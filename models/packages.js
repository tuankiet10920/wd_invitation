"use strict";
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Package extends Model {
    static associate(models) {
      // Các mối quan hệ định nghĩa model/index.js
    }
  }
  Package.init(
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
      short_description: DataTypes.STRING,
      level: DataTypes.INTEGER,
      original_price: DataTypes.INTEGER,
      sale_price: DataTypes.INTEGER,
      discount_end_date: DataTypes.DATE,
      is_best: DataTypes.BOOLEAN,
      time_save_card: DataTypes.INTEGER,
      image_limits: DataTypes.INTEGER,
      number_of_cards: DataTypes.INTEGER,
      maximum_views: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Package",
      tableName: "packages",
    }
  );
  return Package;
};
