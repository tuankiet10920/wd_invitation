"use strict";
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class CategoryWeddingCard extends Model {
    static associate(models) {
    }
  }
  CategoryWeddingCard.init(
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
    },
    {
      sequelize,
      modelName: "CategoryWeddingCard",
      tableName: "category_wedding_cards",
    }
  );
  return CategoryWeddingCard;
};
