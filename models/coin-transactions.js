"use strict";
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class CoinTransaction extends Model {
    static associate(models) {
      // Associations are defined in models/index.js
    }
  }
  CoinTransaction.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      code: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      id_user: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM("TOPUP", "SEND_GIFT", "RECEIVE_GIFT"),
        allowNull: false,
      },
      coins: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      balance_after: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      id_gift: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      gift_name: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      slug: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "CoinTransaction",
      tableName: "coin_transactions",
    }
  );
  return CoinTransaction;
};
