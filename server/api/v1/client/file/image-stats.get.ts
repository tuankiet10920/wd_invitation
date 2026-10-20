import FormatResponse from "~~/composables/FormatResponse";
import { UserData } from "~~/server/data/user";

const User = new UserData();

export default defineEventHandler(async (event) => {
  try {
    const session = await getUserSession(event);
    const sessionUser = session?.user as any;
    const email = sessionUser?.email;

    if (!email) {
      return FormatResponse.error(event, "Unauthorized");
    }

    const user = await User.checkUserNormal(email);
    if (!user) {
      return FormatResponse.error(event, "User not found");
    }

    const userPackageId = user.id_package || 1;

    const { Package: PackageModel, Image: ImageModel, ImageType: ImageTypeModel } = global.__db;

    // 1. Get image_limits from the user's package
    const userPackage = await PackageModel.findOne({
      where: { id: userPackageId },
      attributes: ['image_limits']
    });

    const maxFiles = userPackage?.image_limits || 0;

    // 2. Count images where image_type slug is 'personal_image'
    const personalImageType = await ImageTypeModel.findOne({
      where: { key: 'personal_image' }
    });

    let uploadedFilesCount = 0;
    if (personalImageType) {
      uploadedFilesCount = await ImageModel.count({
        where: {
          id_user: user.id,
          id_image_type: personalImageType.id
        }
      });
    }

    return FormatResponse.success({ maxFiles, uploadedFilesCount }, "Success");
  } catch (error) {
    console.error("Error fetching image stats:", error);
    return FormatResponse.failure(error);
  }
});
