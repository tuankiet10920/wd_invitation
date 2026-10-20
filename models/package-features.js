"use strict";
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class PackageFeature extends Model {
    static associate(models) {
      // Các mối quan hệ định nghĩa model/index.js
    }
  }
  PackageFeature.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      id_package: DataTypes.INTEGER,
      id_feature: DataTypes.INTEGER,
      status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: "PackageFeature",
      tableName: "package_features",
    }
  );
  return PackageFeature;
};
