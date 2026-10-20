"use strict";
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Animation extends Model {
    static associate(models) {
      // Các mối quan hệ định nghĩa model/index.js
    }
  }
  Animation.init(
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
      id_animation_type: DataTypes.INTEGER,
      id_user: DataTypes.INTEGER,
      id_min_package: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Animation",
      tableName: "animations",
    }
  );
  return Animation;
};
