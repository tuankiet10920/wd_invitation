"use strict";
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class WebsiteImage extends Model {
    static associate(models) {
      // Define associations here
    }
  }
  WebsiteImage.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      is_main: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      id_website: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "WebsiteImage",
      tableName: "website_images",
    }
  );
  return WebsiteImage;
};
