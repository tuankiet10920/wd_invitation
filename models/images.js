"use strict";
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Image extends Model {
    static associate(models) {
      // Các mối quan hệ định nghĩa model/index.js
    }
  }
  Image.init(
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
      type: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'img',
      },
      id_image_type: DataTypes.INTEGER,
      id_user: DataTypes.INTEGER,
      id_min_package: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Image",
      tableName: "images",
    },
  );
  return Image;
};
