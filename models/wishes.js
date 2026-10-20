"use strict";
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Wish extends Model {
    static associate(models) {
      // define association here
    }
  }
  Wish.init(
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
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      id_wedding_card: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Wish",
      tableName: "wishes",
    }
  );
  return Wish;
};
