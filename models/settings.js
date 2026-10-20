"use strict";
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Setting extends Model {
    static associate(models) {
      // define association here
    }
  }

  Setting.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      key: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
      },
      value: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Setting",
      tableName: "settings",
    }
  );

  return Setting;
};
