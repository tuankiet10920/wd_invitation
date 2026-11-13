"use strict";
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class SentGift extends Model {
    static associate(models) {
      // Associations are defined in models/index.js
    }
  }
  SentGift.init(
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
      id_sender_user: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      sender_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      sender_avatar: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      id_gift: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      gift_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      gift_price_coins: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      gift_image: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      gift_file: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      amount_vnd: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      slug: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      id_wedding_card: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      wedding_card_name: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      id_recipient_user: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "SentGift",
      tableName: "sent_gifts",
    }
  );
  return SentGift;
};
