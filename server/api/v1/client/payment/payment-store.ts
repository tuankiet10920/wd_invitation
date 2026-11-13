import { addUserCoins } from '../gifts/coin-store';

export interface PaymentRecord {
  code: string;
  shortCode: string; // Mã định danh ngắn 4 ký tự cuối để chống ngân hàng cắt chuỗi
  type: 'GIFT' | 'PACKAGE' | 'COIN_TOPUP';
  amount: number;
  coins?: number;
  giftName?: string;
  senderName?: string;
  message?: string;
  slug?: string;
  packageId?: number;
  packageName?: string;
  duration?: number;
  userId?: number;
  status: 'PENDING' | 'SUCCESS' | 'EXPIRED';
  dbProcessed?: boolean;
  createdAt: number;
}

function mapPaymentRow(row: any): PaymentRecord {
  const plain = row?.get ? row.get({ plain: true }) : row;
  return {
    code: plain.code,
    shortCode: plain.short_code || plain.code.slice(-4),
    type: plain.type,
    amount: Number(plain.amount || 0),
    coins: plain.coins !== null && plain.coins !== undefined ? Number(plain.coins) : undefined,
    giftName: plain.gift_name || undefined,
    senderName: plain.sender_name || undefined,
    message: plain.message || undefined,
    slug: plain.slug || undefined,
    packageId: plain.id_package !== null && plain.id_package !== undefined ? Number(plain.id_package) : undefined,
    packageName: plain.package_name || undefined,
    duration: plain.duration !== null && plain.duration !== undefined ? Number(plain.duration) : undefined,
    userId: plain.id_user !== null && plain.id_user !== undefined ? Number(plain.id_user) : undefined,
    status: plain.status,
    dbProcessed: Boolean(plain.db_processed),
    createdAt: plain.createdAt ? new Date(plain.createdAt).getTime() : Date.now(),
  };
}

export async function createPaymentRecord(
  params: Omit<PaymentRecord, 'status' | 'createdAt' | 'shortCode'>
): Promise<PaymentRecord> {
  const db = (global as any).__db;
  const code = params.code.toUpperCase();
  const shortCode = code.slice(-4);

  const [row, created] = await db.PaymentTransaction.findOrCreate({
    where: { code },
    defaults: {
      code,
      short_code: shortCode,
      type: params.type,
      amount: Number(params.amount || 0),
      coins: params.coins ?? null,
      gift_name: params.giftName ?? null,
      sender_name: params.senderName ?? null,
      message: params.message ?? null,
      slug: params.slug ?? null,
      id_package: params.packageId ?? null,
      package_name: params.packageName ?? null,
      duration: params.duration ?? null,
      id_user: params.userId ?? null,
      status: 'PENDING',
      db_processed: false,
    },
  });

  if (!created) {
    await row.update({
      short_code: shortCode,
      type: params.type,
      amount: Number(params.amount || 0),
      coins: params.coins ?? null,
      gift_name: params.giftName ?? null,
      sender_name: params.senderName ?? null,
      message: params.message ?? null,
      slug: params.slug ?? null,
      id_package: params.packageId ?? null,
      package_name: params.packageName ?? null,
      duration: params.duration ?? null,
      id_user: params.userId ?? null,
    });
  }

  return mapPaymentRow(row);
}

export async function getPaymentRecord(code: string): Promise<PaymentRecord | null> {
  if (!code) return null;
  const db = (global as any).__db;
  const row = await db.PaymentTransaction.findOne({
    where: { code: code.toUpperCase() },
  });
  return row ? mapPaymentRow(row) : null;
}

export async function getPendingPayments(): Promise<PaymentRecord[]> {
  const db = (global as any).__db;
  const rows = await db.PaymentTransaction.findAll({
    where: { status: 'PENDING' },
    order: [['createdAt', 'DESC']],
    limit: 200,
  });
  return rows.map(mapPaymentRow);
}

export async function markPaymentSuccess(code: string): Promise<PaymentRecord | null> {
  if (!code) return null;
  const db = (global as any).__db;
  const row = await db.PaymentTransaction.findOne({
    where: { code: code.toUpperCase() },
  });
  if (!row) return null;

  await row.update({ status: 'SUCCESS' });
  return mapPaymentRow(row);
}

/**
 * Xử lý nâng cấp gói dịch vụ, nạp xu và lưu đơn hàng vào MySQL khi thanh toán thành công
 * Đảm bảo chỉ chạy 1 lần duy nhất (idempotent thông qua cờ db_processed)
 */
export async function processPaymentSuccess(code: string): Promise<PaymentRecord | null> {
  if (!code) return null;
  const db = (global as any).__db;
  const upperCode = code.toUpperCase();

  const row = await db.PaymentTransaction.findOne({
    where: { code: upperCode },
  });
  if (!row) return null;

  if (row.status === 'SUCCESS' && row.db_processed) {
    return mapPaymentRow(row);
  }

  await row.update({ status: 'SUCCESS' });
  const record = mapPaymentRow(row);

  if (!record.dbProcessed) {
    try {
      // 1. Nạp Xu vào ví nếu là giao dịch COIN_TOPUP
      if (record.type === 'COIN_TOPUP' && record.userId && record.coins) {
        await addUserCoins(
          record.userId,
          Number(record.coins),
          `Nạp ${Number(record.coins).toLocaleString('vi-VN')} Xu qua chuyển khoản (${record.code})`
        );
        await row.update({ db_processed: true });
        console.log(
          `[Payment DB] Đã cộng ${record.coins} Xu cho User #${record.userId} (Mã GD: ${record.code})`
        );
      }
      // 2. Nâng cấp gói dịch vụ nếu là giao dịch PACKAGE
      else if (record.type === 'PACKAGE' && record.userId && record.packageId) {
        if (db && db.User && db.Order) {
          const durationMonths = Number(record.duration || 12);
          const expiredAt = new Date();
          expiredAt.setMonth(expiredAt.getMonth() + durationMonths);

          // Cập nhật id_package và hạn sử dụng cho User
          await db.User.update(
            {
              id_package: Number(record.packageId),
              package_expired_at: expiredAt,
            },
            { where: { id: Number(record.userId) } }
          );

          // Đồng bộ id_package cho toàn bộ thiệp cưới của User đó
          if (db.WeddingCard) {
            await db.WeddingCard.update(
              { id_package: Number(record.packageId) },
              { where: { id_user: Number(record.userId) } }
            );
          }

          // Ghi nhận lịch sử đơn hàng vào bảng orders
          await db.Order.create({
            total: Number(record.amount || 0),
            duration: durationMonths,
            id_user: Number(record.userId),
            id_package: Number(record.packageId),
          });

          await row.update({ db_processed: true });
          console.log(
            `[Payment DB] Đã nâng cấp gói #${record.packageId} (${durationMonths} tháng) cho User #${record.userId}`
          );
        }
      } else {
        await row.update({ db_processed: true });
      }
    } catch (err) {
      console.error('[Payment DB] Lỗi khi cập nhật Database:', err);
    }
  }

  return mapPaymentRow(row);
}
