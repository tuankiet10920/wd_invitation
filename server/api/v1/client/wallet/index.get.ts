import FormatResponse from "~~/composables/FormatResponse";
import { getAuthUser } from "~~/server/utils/auth";

// Temporary in-memory storage for user withdrawals during application runtime
export const withdrawalRecords: any[] = [];

export default defineEventHandler(async (event) => {
  try {
    const user = await getAuthUser(event);
    if (!user) {
      return FormatResponse.error(event, "Unauthorized", 401);
    }

    const { Package: PackageModel } = (global as any).__db;
    const userPackageId = user.id_package || 1;
    const currentPkg = await PackageModel?.findByPk(userPackageId);

    const packageName = currentPkg?.name || "Free";

    // Rate according to packages: Free = 0%, Basic = 80%, Premium = 100%
    let receiveRate = 0;
    if (packageName.toLowerCase().includes("premium")) {
      receiveRate = 100;
    } else if (packageName.toLowerCase().includes("basic")) {
      receiveRate = 80;
    } else {
      receiveRate = 0;
    }

    // Gross revenue received from gifts
    const grossReceived = 6800000;
    // Net potential before withdrawals
    const netReceived = Math.round((grossReceived * receiveRate) / 100);

    // Sum user's withdrawals
    const userWithdrawals = withdrawalRecords.filter((w: any) => w.userId === user.id);
    const totalWithdrawn = userWithdrawals.reduce((sum: number, w: any) => sum + w.amount, 0);

    const availableBalance = Math.max(0, netReceived - totalWithdrawn);

    // Standard activity transactions list
    const transactions = [
      ...userWithdrawals.map((w: any) => ({
        id: w.id,
        code: w.code,
        type: "WITHDRAW",
        title: "Rút tiền về tài khoản ngân hàng",
        description: `Chuyển về ${w.bankName} - ${w.accountNumber}`,
        amount: -w.amount,
        status: w.status,
        createdAt: w.createdAt,
      })),
      {
        id: "tx-3",
        code: "GIFT-194028",
        type: "GIFT",
        title: "Nhận quà mừng: Rượu mừng",
        description: "Từ người thân Vũ Tuấn Kiệt",
        amount: Math.round(3000000 * (receiveRate / 100)),
        status: "COMPLETED",
        createdAt: new Date(Date.now() - 1440 * 60 * 1000).toISOString(),
      },
      {
        id: "tx-2",
        code: "GIFT-193851",
        type: "GIFT",
        title: "Nhận quà mừng: Hoa gấu bông",
        description: "Từ người thân Phạm Thùy Linh",
        amount: Math.round(2020000 * (receiveRate / 100)),
        status: "COMPLETED",
        createdAt: new Date(Date.now() - 720 * 60 * 1000).toISOString(),
      },
      {
        id: "tx-1",
        code: "GIFT-193402",
        type: "GIFT",
        title: "Nhận quà mừng: Bắn tim",
        description: "Từ người thân Nguyễn Văn Hùng",
        amount: Math.round(520000 * (receiveRate / 100)),
        status: "COMPLETED",
        createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
      },
    ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return FormatResponse.success({
      balance: availableBalance,
      grossReceived,
      netReceived,
      totalWithdrawn,
      receiveRate,
      packageName,
      isPremium: packageName.toLowerCase().includes("premium"),
      transactions,
    }, "Get wallet info successfully!");
  } catch (error: any) {
    return FormatResponse.failure(error);
  }
});
