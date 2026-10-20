"use strict";
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Feature extends Model {
    static associate(models) {
    }
  }
  Feature.init(
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
      order: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      key_feature: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      type: {
        type: DataTypes.ENUM("packages", "animations", "blocks", "others", "images", "musics", "widgets"),
        allowNull: true,
        defaultValue: "packages",
      },
      branch: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Feature",
      tableName: "features",
    }
  );
  return Feature;
};
