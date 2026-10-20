"use strict";
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Gift extends Model {
    static associate(models) {
      // define association here
    }
  }
  Gift.init(
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
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      file: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      background: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Gift",
      tableName: "gifts",
    }
  );
  return Gift;
};
