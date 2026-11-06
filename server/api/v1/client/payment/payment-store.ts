import fs from "fs";
import path from "path";

export interface PaymentRecord {
    code: string;
    amount: number;
    type?: 'GIFT' | 'PACKAGE';
    giftName?: string;
    senderName?: string;
    message?: string;
    slug?: string;
    packageId?: number;
    packageName?: string;
    userId?: number;
    duration?: number;
    status: 'PENDING' | 'SUCCESS' | 'EXPIRED';
    dbProcessed?: boolean;
    createdAt: number;
}

const PAYMENTS_FILE = path.resolve(process.cwd(), "server/data/payments.json");
const paymentsMap = new Map<string, PaymentRecord>();
const processedPackageCodes = new Set<string>();

function loadPaymentsFromDisk() {
    try {
        if (fs.existsSync(PAYMENTS_FILE)) {
            const raw = fs.readFileSync(PAYMENTS_FILE, "utf-8");
            const list: PaymentRecord[] = JSON.parse(raw);
            if (Array.isArray(list)) {
                for (const rec of list) {
                    if (rec && rec.code) {
                        const full = rec.code.trim().toUpperCase();
                        const short = full.replace(/^SEVQR/i, "");
                        paymentsMap.set(full, rec);
                        paymentsMap.set(short, rec);
                        if (rec.dbProcessed) {
                            processedPackageCodes.add(full);
                        }
                    }
                }
            }
        }
    } catch (e) {
        console.error("[PaymentStore] Failed to load payments.json:", e);
    }
}

function savePaymentsToDisk() {
    try {
        const dir = path.dirname(PAYMENTS_FILE);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        const uniqueRecords = Array.from(new Set(paymentsMap.values()));
        // Giữ tối đa 200 giao dịch gần nhất
        const recentRecords = uniqueRecords
            .sort((a, b) => b.createdAt - a.createdAt)
            .slice(0, 200);
        fs.writeFileSync(PAYMENTS_FILE, JSON.stringify(recentRecords, null, 2), "utf-8");
    } catch (e) {
        console.error("[PaymentStore] Failed to save payments.json:", e);
    }
}

// Khởi tạo dữ liệu từ đĩa khi server khởi động
loadPaymentsFromDisk();

export const createPaymentRecord = (data: Partial<PaymentRecord>) => {
    if (!data.code) return null;
    const rawCode = data.code.replace(/\s+/g, "").toUpperCase();
    const shortCode = rawCode.replace(/^SEVQR/i, "");
    const fullCode = rawCode.startsWith("SEVQR") ? rawCode : `SEVQR${rawCode}`;

    // Nếu mã có dạng PKGU{userId}P{packageId} thì tự động trích xuất luôn
    const codeMatch = fullCode.match(/PKGU(\d+)P(\d+)/i);
    const parsedUserId = codeMatch ? Number(codeMatch[1]) : undefined;
    const parsedPackageId = codeMatch ? Number(codeMatch[2]) : undefined;

    const record: PaymentRecord = {
        code: fullCode,
        amount: Number(data.amount) || 0,
        type: data.type || (data.packageId || parsedPackageId ? 'PACKAGE' : 'GIFT'),
        giftName: data.giftName,
        senderName: data.senderName,
        message: data.message,
        slug: data.slug,
        packageId: data.packageId ? Number(data.packageId) : parsedPackageId,
        packageName: data.packageName,
        userId: data.userId ? Number(data.userId) : parsedUserId,
        duration: data.duration ? Number(data.duration) : undefined,
        status: 'PENDING',
        dbProcessed: false,
        createdAt: Date.now()
    };

    paymentsMap.set(fullCode, record);
    paymentsMap.set(shortCode, record);
    paymentsMap.set(rawCode, record);
    savePaymentsToDisk();
    return record;
};

export const getPaymentRecord = (code: string) => {
    if (!code) return undefined;
    const clean = code.replace(/\s+/g, "").toUpperCase();
    const short = clean.replace(/^SEVQR/i, "");
    return (
        paymentsMap.get(clean) ||
        paymentsMap.get(short) ||
        paymentsMap.get(`SEVQR${short}`)
    );
};

export const markPaymentSuccess = (code: string) => {
    const record = getPaymentRecord(code);
    if (record) {
        record.status = 'SUCCESS';
        const clean = code.replace(/\s+/g, "").toUpperCase();
        const shortCode = clean.replace(/^SEVQR/i, '');
        paymentsMap.set(clean, record);
        paymentsMap.set(shortCode, record);
        paymentsMap.set(`SEVQR${shortCode}`, record);
        savePaymentsToDisk();
        return true;
    }
    return false;
};

export const processPaymentSuccess = async (
    fullCode: string,
    shortCode?: string,
    transferAmount?: number
) => {
    const cleanFull = fullCode.replace(/\s+/g, "").toUpperCase();
    const cleanShort = (shortCode || cleanFull.replace(/^SEVQR/i, '')).replace(/\s+/g, "").toUpperCase();
    const canonicalCode = cleanFull.startsWith('SEVQR') ? cleanFull : `SEVQR${cleanShort}`;

    let record = getPaymentRecord(cleanFull) || getPaymentRecord(cleanShort);

    if (record) {
        record.status = 'SUCCESS';
    } else {
        record = {
            code: canonicalCode,
            amount: transferAmount || 0,
            status: 'SUCCESS',
            dbProcessed: false,
            createdAt: Date.now()
        };
    }

    // 1. Lấy userId và packageId đã lưu trong PaymentRecord
    let userId = record.userId;
    let packageId = record.packageId;

    // 2. Giải mã trực tiếp từ mã nội dung chuyển khoản (VD: SEVQRPKGU2P2R3V4N -> userId = 2, packageId = 2)
    const codeMatch = canonicalCode.match(/PKGU(\d+)P(\d+)/i);
    if (codeMatch) {
        if (!userId) userId = Number(codeMatch[1]);
        if (!packageId) packageId = Number(codeMatch[2]);
        record.type = 'PACKAGE';
        record.userId = userId;
        record.packageId = packageId;
    }

    const db = (global as any).__db;

    // 3. Fallback: Nếu là giao dịch gói (PKG) nhưng chưa rõ packageId, đối chiếu theo số tiền chuyển khoản (transferAmount)
    if (!packageId && canonicalCode.includes("PKG") && transferAmount && db?.Package) {
        try {
            const allPkgs = await db.Package.findAll({ raw: true });
            const matchedPkg = allPkgs.find(
                (p: any) => Number(p.sale_price) === Number(transferAmount) || Number(p.original_price) === Number(transferAmount)
            );
            if (matchedPkg) {
                packageId = Number(matchedPkg.id);
                record.packageId = packageId;
                record.packageName = matchedPkg.name;
                record.type = 'PACKAGE';
            }
        } catch (e) {}
    }

    paymentsMap.set(cleanFull, record);
    paymentsMap.set(cleanShort, record);
    paymentsMap.set(canonicalCode, record);

    if (
        (record.type === 'PACKAGE' || (userId && packageId)) &&
        userId &&
        packageId &&
        !record.dbProcessed &&
        !processedPackageCodes.has(canonicalCode)
    ) {
        record.dbProcessed = true;
        processedPackageCodes.add(canonicalCode);

        try {
            if (db && db.User && db.Package && db.Order) {
                const pkg = await db.Package.findByPk(packageId);
                if (pkg) {
                    const duration = Number(pkg.time_save_card || record.duration || 12);
                    const expiredAt = new Date();
                    expiredAt.setMonth(expiredAt.getMonth() + duration);

                    await db.User.update(
                        {
                            id_package: pkg.id,
                            package_expired_at: expiredAt
                        },
                        {
                            where: { id: userId }
                        }
                    );

                    const orderTotal =
                        record.amount ||
                        transferAmount ||
                        Number(pkg.sale_price ?? pkg.original_price ?? 0);

                    await db.Order.create({
                        total: orderTotal,
                        duration: duration,
                        id_user: userId,
                        id_package: pkg.id
                    });

                    record.packageName = pkg.name;
                    console.log(
                        `[SePay Package Upgrade] Đã xác định User #${userId} đăng ký Gói #${pkg.id} (${pkg.name}) từ mã ${canonicalCode}. Đã cập nhật User & tạo Order trong DB.`
                    );
                }
            }
        } catch (dbErr) {
            console.error('[SePay Package Upgrade DB Error]:', dbErr);
        }
    }

    savePaymentsToDisk();
    return record;
};
