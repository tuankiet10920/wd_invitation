"use strict";
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class SeoPage extends Model {
    static associate(models) {
      // define association here if needed
    }
  }

  SeoPage.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      slug: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
      },
      image: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      priority: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 0.5,
      },
      change_freq: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: "monthly",
      },
    },
    {
      sequelize,
      modelName: "SeoPage",
      tableName: "seo_pages",
    }
  );

  return SeoPage;
};
