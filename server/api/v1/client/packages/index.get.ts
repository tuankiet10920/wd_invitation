import { PackageData } from "~~/server/data/package";
import { PackageFeatureData } from "~~/server/data/package-feature";
import FormatResponse from "~~/composables/FormatResponse";

const Package = new PackageData();
const PackageFeature = new PackageFeatureData();

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const result = await Package.list(query);
    
    // Fetch features for each package
    const packages = result.data;
    const updatedPackages = [];
    if (packages && packages.length > 0) {
        for (let i = 0; i < packages.length; i++) {
            const feature_list = await PackageFeature.getListInternal(packages[i].id);
            const plainPackage = JSON.parse(JSON.stringify(packages[i]));
            updatedPackages.push({
                ...plainPackage,
                feature_list
            });
        }
    }
    result.data = updatedPackages;
    
    return FormatResponse.success(result, "Get package list successfully!");
  } catch (error) {
    return FormatResponse.failure(error);
  }
});
