"use strict";
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class News extends Model {
    static associate(models) {
      News.hasMany(models.Gallery, {
        foreignKey: "id_news",
        as: "galleries",
      });
    }
  }
  News.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      content: DataTypes.STRING,
      key: DataTypes.STRING,
      name: DataTypes.STRING,
      slug: DataTypes.STRING,
      id_news: DataTypes.BIGINT,
      icon: DataTypes.STRING,
      icon_name: DataTypes.STRING,
      icon_type: DataTypes.STRING,
      desc: DataTypes.TEXT,
      id_user: {
        type: DataTypes.BIGINT,
        allowNull: true,
        unique: true,
      },
    },
    {
      sequelize,
      modelName: "News",
      tableName: "news",
    }
  );
  return News;
};
