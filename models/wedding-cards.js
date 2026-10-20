"use strict";
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class WeddingCard extends Model {
    static associate(models) {
      // Các mối quan hệ định nghĩa model/index.js
    }
  }
  WeddingCard.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: DataTypes.STRING,
      meta_desc: DataTypes.STRING,
      image_page: DataTypes.STRING,
      avatar: {
        type: DataTypes.STRING,
        defaultValue: "/others/cinelove-default-thumbnail.jpg",
      },
      url: DataTypes.STRING,
      is_custom_url: DataTypes.BOOLEAN,
      is_public: DataTypes.BOOLEAN,
      is_publish: DataTypes.BOOLEAN,
      qr_code: DataTypes.STRING,
      views: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      likes: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },

      background: DataTypes.STRING,
      height: {
        type: DataTypes.INTEGER,
        defaultValue: 1024,
      },
      music: DataTypes.TEXT("long"),
      effect: DataTypes.TEXT("long"),
      nodes: DataTypes.JSON,
      is_template: DataTypes.BOOLEAN,
      is_template_user: DataTypes.BOOLEAN,
      id_category_wedding_card: DataTypes.INTEGER,
      id_user: DataTypes.INTEGER,
      id_package: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "WeddingCard",
      tableName: "wedding_cards",
    }
  );
  return WeddingCard;
};
