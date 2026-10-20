"use strict";
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class QrBox extends Model {
    static associate(models) {
      // Associations are defined in models/index.js
    }
  }
  QrBox.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: DataTypes.STRING,
      name_reveive: DataTypes.STRING,
      name_bank: DataTypes.STRING,
      number_bank: DataTypes.STRING,
      image: DataTypes.STRING,
      id_wedding_card: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "QrBox",
      tableName: "qr_boxes",
    }
  );
  return QrBox;
};
