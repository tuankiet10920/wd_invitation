"use strict";
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Withdrawal extends Model {
    static associate(models) {
      // Associations are defined in models/index.js
    }
  }
  Withdrawal.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      code: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      id_user: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      bank_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      account_number: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      account_holder: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      note: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM("PROCESSING", "COMPLETED", "CANCELLED"),
        allowNull: false,
        defaultValue: "PROCESSING",
      },
    },
    {
      sequelize,
      modelName: "Withdrawal",
      tableName: "withdrawals",
    }
  );
  return Withdrawal;
};
