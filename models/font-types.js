"use strict";
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class FontType extends Model {
    static associate(models) {
      // define association here
    }
  }
  FontType.init(
    {
      name: DataTypes.STRING,
      slug: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "FontType",
      tableName: "font_types",
    }
  );
  return FontType;
};
