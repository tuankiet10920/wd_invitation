// server/types/db.d.ts (Đảm bảo file này KHÔNG CÓ import/export ở cấp cao nhất)

import { Sequelize, Model, ModelStatic } from "sequelize";

interface SafeModelStatic extends ModelStatic<any> {
  findAll(): Promise<any[]>;
  findOne(): Promise<any>;
  findByPk(): Promise<any>;
  create(): Promise<any>;
}

interface Models {
  User: SafeModelStatic; // Sử dụng kiểu an toàn
}

interface DB {
  sequelize: Sequelize;
  Models: Models;
}

declare global {
  var __sequelize: Sequelize | undefined;
  var __db: DB | undefined;
}
