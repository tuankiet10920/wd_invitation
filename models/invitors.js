"use strict";
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Invitor extends Model {
    static associate(models) {
      // Các mối quan hệ định nghĩa model/index.js
    }
  }
  Invitor.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      content: DataTypes.STRING,
      views: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      token: DataTypes.STRING,
      is_confirm: {
        type: DataTypes.ENUM("not_yet", "confirmed", "refuse"),
        defaultValue: "not_yet",
      },
      is_send: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      lastest_view_at: DataTypes.DATE,
      id_card: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Invitor",
      tableName: "invitors",
    }
  );
  return Invitor;
};
