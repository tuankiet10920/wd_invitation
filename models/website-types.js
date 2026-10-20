"use strict";
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class WebsiteType extends Model {
    static associate(models) {
      // Define associations here
    }
  }
  WebsiteType.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: DataTypes.STRING,
      slug: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "WebsiteType",
      tableName: "website_types",
    }
  );
  return WebsiteType;
};
