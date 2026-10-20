"use strict";
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Effect extends Model {
    static associate(models) {
      // define association here
    }
  }
  Effect.init(
    {
      name: DataTypes.STRING,
      slug: DataTypes.STRING,
      icon: DataTypes.STRING,
      icon_type: DataTypes.STRING,
      icons: DataTypes.JSON,
      id_type_effect: DataTypes.INTEGER,
      id_min_package: DataTypes.INTEGER,
      image_left: DataTypes.STRING,
      image_right: DataTypes.STRING,
      video: DataTypes.STRING,
      is_custom: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Effect",
      tableName: "effects",
    }
  );
  return Effect;
};