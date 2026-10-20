import { Sequelize, DataTypes } from "sequelize";
import config from "~~/config/config.json"; // Giả định config.json tồn tại
import fs from "fs";
import path from "path";
import { pathToFileURL } from "url"; // <<< Cần import pathToFileURL
import { defineNitroPlugin } from "#imports";
import { loadAndAssociateModels } from "~~/models/index.js";

type EnvType = "development" | "test" | "production";

const runTimeConfig = useRuntimeConfig();

let sequelizeInstance: Sequelize | null = null;
const db: any = {}; // Đối tượng Models (đã liên kết)

// Khai báo biến global cho TypeScript
declare global {
  var __sequelize: Sequelize | undefined;
  var __db: any; // Thêm db object để chứa models
}

// Hàm tải tất cả Models và thiết lập liên kết

// Hàm khởi tạo kết nối (giữ nguyên)
async function initializeSequelize() {
  if (sequelizeInstance) {
    return sequelizeInstance;
  }

  const port: number = 3306;
  const environment: EnvType = runTimeConfig.environment as EnvType;

  // Lưu ý: Tốt nhất là dùng process.env thay vì config.json
  const connectionConfig = config[environment];

  // 1. Lấy chuỗi kết nối
  const connectionUrl = generateStringDatabaseConnection(
    connectionConfig.username,
    connectionConfig.password,
    connectionConfig.host,
    port,
    connectionConfig.database
  );

  if (!connectionUrl) {
    console.error(
      "Connection URL is invalid. Database initialization skipped."
    );
    return null;
  }

  try {
    const sequelize = new Sequelize(connectionUrl, {
      dialect: "mysql",
      logging: false,
      dialectOptions: {
        ssl: connectionConfig.ssl ? { rejectUnauthorized: false } : undefined,
      },
    });

    await sequelize.authenticate();
    console.log("✅ Database connection established successfully.");

    // Tải Models (SỬ DỤNG HÀM loadAndAssociateModels ĐÃ ĐƯỢC TÙY CHỈNH)
    const { sequelize: seqInstance, db: loadedDb } = loadAndAssociateModels(
      sequelize,
      DataTypes
    );

    // Gán vào biến Global
    global.__sequelize = seqInstance;
    global.__db = loadedDb; // Gán đối tượng db chứa Models

    sequelizeInstance = sequelize;
    return sequelizeInstance;
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    return null;
  }
}

// Hàm tạo chuỗi kết nối (giữ nguyên)
const generateStringDatabaseConnection = (
  user: string,
  pass: string,
  host: string,
  port: number,
  db: string
) => {
  return `mysql://${user}:${pass}@${host}:${port}/${db}`;
};

let isInitialized = false;

// Định nghĩa Server Plugin (giữ nguyên)
export default defineNitroPlugin(async (nitroApp) => {
  if (!sequelizeInstance) {
    console.log("Starting Sequelize initialization...");
    await initializeSequelize();
    isInitialized = true; // Đánh dấu đã xong
  }
});
