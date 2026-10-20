import FormatResponse from "~~/composables/FormatResponse";
import { UserData } from "~~/server/data/user";
import { getCookie } from "h3";
import jwt from "jsonwebtoken";
import { Op } from "sequelize";

const User = new UserData();

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig();
    let user = null;

    // 1. Check normal user session
    const session = await getUserSession(event);
    const sessionUser = session?.user as any;
    if (sessionUser?.email) {
      user = await User.checkUserNormal(sessionUser.email);
    }

    // 2. Check admin token if no session user found
    if (!user) {
      const token = getCookie(event, "auth_admin_token");
      if (token) {
        try {
          const decoded = jwt.verify(token, config.jwtSecret) as any;
          if (decoded && decoded.id) {
            user = await User.getById(decoded.id);
          }
        } catch (e) {
          // Admin auth fail
        }
      }
    }

    if (!user) {
      return FormatResponse.error(event, "Unauthorized", 401);
    }

    // Default package level is 1 (Free) if user doesn't have an id_package
    const userPackageId = user.id_package || 1;

    const { Package: PackageModel, Feature: FeatureModel, PackageFeature: PackageFeatureModel, Image: ImageModel, ImageType: ImageTypeModel, WeddingCard: WeddingCardModel } = global.__db;
    
    // --- Usage Stats ---
    // 1. Count personal images (include admin_image for admins)
    const typeKeys = ["personal_image"];
    if (user.role === "admin") typeKeys.push("admin_image");

    const imageTypes = await ImageTypeModel.findAll({ where: { key: typeKeys } });
    const typeIds = imageTypes.map((t: any) => t.id);

    let currentImages = 0;
    if (typeIds.length > 0) {
      currentImages = await ImageModel.count({
        where: { id_user: user.id, id_image_type: { [Op.in]: typeIds } }
      });
    }

    // 2. Count wedding cards
    const currentWebsites = await WeddingCardModel.count({
      where: { id_user: user.id }
    });

    // 3. Sum total views across all wedding cards
    const viewsResult = await WeddingCardModel.sum('views', {
      where: { id_user: user.id }
    });
    const currentViews = viewsResult || 0;
    
    // Get the user's package and also fetch all features to compare what is active
    const userPackage = await PackageModel.findOne({
      where: { id: userPackageId },
      include: [
        {
          model: FeatureModel,
          as: 'features',
          through: {
             model: PackageFeatureModel,
             attributes: ['status'] // Get the status from mapping table
          }
        }
      ]
    });

    if (!userPackage) {
      return FormatResponse.error(event, "Package not found");
    }

    // Get all system features to show inactive ones with 'X'
    const allFeatures = await FeatureModel.findAll({
        order: [['order', 'ASC']]
    });

    const activeFeatureIds = userPackage.features
        .filter((f: any) => f.PackageFeature && f.PackageFeature.status === true)
        .map((f: any) => f.id);

    // Format the response structure required by the frontend
    const packageData = {
        id: userPackage.id,
        name: userPackage.name,
        level: userPackage.level,
        image_limits: userPackage.image_limits,
        number_of_cards: userPackage.number_of_cards,
        maximum_views: userPackage.maximum_views,
        // Actual usage stats
        currentImages,
        currentWebsites,
        currentViews,
        features: allFeatures.map((feat: any) => ({
            id: feat.id,
            name: feat.name,
            key: feat.key_feature,
            active: activeFeatureIds.includes(feat.id)
        }))
    };

    return FormatResponse.success(packageData, "Fetched plan successfully!");
  } catch (error) {
    console.error("Error fetching my plan:", error);
    return FormatResponse.failure(error);
  }
});
