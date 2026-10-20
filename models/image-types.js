"use strict";
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class ImageType extends Model {
    static associate(models) {
      // define association here
    }
  }
  ImageType.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      key: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "ImageType",
      tableName: "image_types",
    }
  );
  return ImageType;
};
