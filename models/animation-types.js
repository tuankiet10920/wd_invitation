"use strict";
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class AnimationType extends Model {
    static associate(models) {
    }
  }
  AnimationType.init(
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
    },
    {
      sequelize,
      modelName: "AnimationType",
      tableName: "animation_types",
    }
  );
  return AnimationType;
};
