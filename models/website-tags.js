"use strict";
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class WebsiteTag extends Model {
    static associate(models) {
      // Define associations here
    }
  }
  WebsiteTag.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      id_website: DataTypes.INTEGER,
      id_tag: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "WebsiteTag",
      tableName: "website_tags",
    }
  );
  return WebsiteTag;
};
