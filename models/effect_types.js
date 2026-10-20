"use strict";
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class EffectType extends Model {
    static associate(models) {
      // define association here
    }
  }
  EffectType.init(
    {
      name: DataTypes.STRING,
      slug: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "EffectType",
      tableName: "effect_types",
    }
  );
  return EffectType;
};