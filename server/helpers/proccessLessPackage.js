// read-deps.js

import fs from "fs";
import fsp from "fs/promises";
import path from "path";

const missingPackage = {
  bcrypt: "^6.0.0",
  jsonwebtoken: "^9.0.3",
  mysql2: "^3.15.3",
  "vue3-moveable": "^0.28.0",
};

const scripts = {
  start: "PORT=3005 node index.mjs",
};

const folderPathImages = path.resolve(
  process.cwd(),
  ".output",
  "public",
  "images",
);

const folderNodeModules = path.resolve(
  process.cwd(),
  ".output",
  "server",
  "node_modules",
);

export const resolveMissingPackage = () => {
  const packageJsonPath = path.resolve(
    process.cwd(),
    "./.output/server/package.json",
  );
  try {
    const data = fs.readFileSync(packageJsonPath, "utf8");

    const packageJson = JSON.parse(data);

    const dependencies = packageJson.dependencies;

    let dependenciesUpdated = false;
    let count = 0;

    for (const [pkg, version] of Object.entries(missingPackage)) {
      count++;
      dependencies[pkg] = version;
      if (count == Object.keys(missingPackage).length)
        dependenciesUpdated = true;
    }

    if (dependenciesUpdated) {
      const versionSharpWin = dependencies["@img/sharp-win32-x64"];

      delete dependencies["@img/sharp-win32-x64"];

      dependencies["@img/sharp-linux-x64"] = versionSharpWin;

      packageJson["scripts"] = scripts;

      const updatedData = JSON.stringify(packageJson, null, 2);
      fs.writeFileSync(packageJsonPath, updatedData, "utf8");
    }

    console.log("🌞 Updated package.json in file path: " + packageJsonPath);
  } catch (error) {
    console.error(
      `Lỗi khi đọc file package.json tại ${packageJsonPath}:`,
      error.message,
    );
  }
};

export const removeFolder = async (path, foldername = "images") => {
  try {
    await fsp.rm(path, { recursive: true, force: true });
    console.log(`😁 Remove folder ${foldername} successfully!`);
  } catch (error) {
    console.log(`😢 Can't remove folder! Error: ` + error);
  }
};

resolveMissingPackage();
removeFolder(folderNodeModules, "node_modules");
removeFolder(folderPathImages, "images");
