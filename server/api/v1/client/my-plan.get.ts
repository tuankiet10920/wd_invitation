import FormatResponse from "~~/composables/FormatResponse";
import { getAuthUser } from "~~/server/utils/auth";
import { Op } from "sequelize";

export default defineEventHandler(async (event) => {
  try {
    const user = await getAuthUser(event);

    if (!user) {
      return FormatResponse.error(event, "Unauthorized", 401);
    }

    // Default package level is 1 (Free) if user doesn't have an id_package
    const userPackageId = user.id_package || 1;

    const {
      Package: PackageModel,
      Feature: FeatureModel,
      PackageFeature: PackageFeatureModel,
      Image: ImageModel,
      ImageType: ImageTypeModel,
      WeddingCard: WeddingCardModel,
    } = (global as any).__db;

    // --- Usage Stats ---
    // 1. Count personal images (include admin_image for admins)
    const typeKeys = ["personal_image"];
    if (user.role === "admin") typeKeys.push("admin_image");

    const imageTypes = await ImageTypeModel.findAll({ where: { key: typeKeys } });
    const typeIds = imageTypes.map((t: any) => t.id);

    let currentImages = 0;
    if (typeIds.length > 0) {
      currentImages = await ImageModel.count({
        where: { id_user: user.id, id_image_type: { [Op.in]: typeIds } },
      });
    }

    // 2. Count wedding cards (personal cards)
    const currentWebsites = await WeddingCardModel.count({
      where: { id_user: user.id, is_template: false },
    });

    // 3. Sum total views across all wedding cards
    const viewsResult = await WeddingCardModel.sum("views", {
      where: { id_user: user.id, is_template: false },
    });
    const currentViews = viewsResult || 0;

    // Get the user's package
    const userPackage = await PackageModel.findOne({
      where: { id: userPackageId },
      raw: true,
    });

    if (!userPackage) {
      return FormatResponse.error(event, "Package not found");
    }

    // Fetch all system package features and the mapping rows for user's current package
    const [allFeatures, packageFeatures] = await Promise.all([
      FeatureModel.findAll({
        where: { type: "packages" },
        order: [
          ["order", "ASC"],
          ["id", "ASC"],
        ],
        raw: true,
      }),
      PackageFeatureModel.findAll({
        where: { id_package: userPackage.id },
        raw: true,
      }),
    ]);

    const statusByFeatureId = new Map<number, boolean>();
    for (const pf of packageFeatures) {
      statusByFeatureId.set(
        Number(pf.id_feature),
        pf.status === true || Number(pf.status) === 1
      );
    }

    const isPremiumPkg =
      Number(userPackage.level) >= 3 ||
      String(userPackage.name || "").toLowerCase().includes("premium");

    // Format the response structure required by the frontend
    const packageData = {
      userId: user.id,
      id: userPackage.id,
      name: userPackage.name,
      level: userPackage.level,
      time_save_card: userPackage.time_save_card,
      image_limits: userPackage.image_limits,
      number_of_cards: userPackage.number_of_cards,
      maximum_views: userPackage.maximum_views,
      package_expired_at: user.package_expired_at,
      // Actual usage stats
      currentImages,
      currentWebsites,
      currentViews,
      features: allFeatures.map((feat: any) => ({
        id: feat.id,
        name: feat.name,
        key: feat.key_feature,
        active: statusByFeatureId.has(Number(feat.id))
          ? Boolean(statusByFeatureId.get(Number(feat.id)))
          : isPremiumPkg,
      })),
    };

    return FormatResponse.success(packageData, "Fetched plan successfully!");
  } catch (error) {
    console.error("Error fetching my plan:", error);
    return FormatResponse.failure(error);
  }
});
