"use strict";
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Gallery extends Model {
    static associate(models) {
      Gallery.belongsTo(models.News, {
        foreignKey: "id_news",
        as: "news",
      });
    }
  }
  Gallery.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      num: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      id_news: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Gallery",
      tableName: "galleries",
    }
  );
  return Gallery;
};
