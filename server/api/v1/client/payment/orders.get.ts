import FormatResponse from "~~/composables/FormatResponse";
import { getAuthUser } from "~~/server/utils/auth";

export default defineEventHandler(async (event) => {
  try {
    const user = await getAuthUser(event);
    if (!user) {
      return FormatResponse.error(event, "Unauthorized", 401);
    }

    const { Order: OrderModel, Package: PackageModel } = (global as any).__db;

    const dbOrders = await OrderModel.findAll({
      where: { id_user: user.id },
      include: [
        {
          model: PackageModel,
          as: "package",
          attributes: ["name", "original_price", "sale_price"],
        },
      ],
      order: [["createdAt", "DESC"]],
      raw: true,
      nest: true,
    });

    // If user has orders in database
    let formattedOrders = dbOrders.map((ord: any) => ({
      id: ord.id,
      code: `ORD-${String(ord.id).padStart(6, "0")}`,
      packageName: ord.package?.name || "Gói dịch vụ",
      duration: ord.duration ? `${ord.duration} tháng` : "12 tháng",
      total: ord.total || 0,
      paymentMethod: "Chuyển khoản QR (SePay)",
      status: "COMPLETED",
      createdAt: ord.createdAt,
    }));

    // If no orders yet, provide active package record so user sees their plan receipt
    if (formattedOrders.length === 0) {
      const userPackageId = user.id_package || 1;
      const currentPkg = await PackageModel?.findByPk(userPackageId);
      const isFree = !currentPkg || currentPkg.name?.toLowerCase().includes("free");

      formattedOrders = [
        {
          id: 1,
          code: `ORD-${Date.now().toString().slice(-6)}`,
          packageName: currentPkg?.name || "Gói Miễn phí (Free)",
          duration: "Vĩnh viễn",
          total: isFree ? 0 : 399000,
          paymentMethod: isFree ? "Kích hoạt mặc định" : "Chuyển khoản QR (SePay)",
          status: "COMPLETED",
          createdAt: user.createdAt || new Date().toISOString(),
        },
      ];
    }

    const totalSpent = formattedOrders.reduce((sum: number, o: any) => sum + (o.total || 0), 0);

    return FormatResponse.success({
      stats: {
        totalOrders: formattedOrders.length,
        totalSpent,
        currentPackage: formattedOrders[0]?.packageName || "Free",
      },
      orders: formattedOrders,
    }, "Get orders payment history successfully!");
  } catch (error: any) {
    return FormatResponse.failure(error);
  }
});
