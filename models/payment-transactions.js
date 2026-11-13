"use strict";
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class PaymentTransaction extends Model {
    static associate(models) {
      // Associations are defined in models/index.js
    }
  }
  PaymentTransaction.init(
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
      short_code: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM("GIFT", "PACKAGE", "COIN_TOPUP"),
        allowNull: false,
        defaultValue: "PACKAGE",
      },
      amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      coins: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      gift_name: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      sender_name: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      slug: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      id_package: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      package_name: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      duration: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      id_user: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM("PENDING", "SUCCESS", "EXPIRED"),
        allowNull: false,
        defaultValue: "PENDING",
      },
      db_processed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "PaymentTransaction",
      tableName: "payment_transactions",
    }
  );
  return PaymentTransaction;
};
