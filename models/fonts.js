"use strict";
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Font extends Model {
    static associate(models) {
      // define association here
    }
  }
  Font.init(
    {
      name: DataTypes.STRING,
      slug: DataTypes.STRING,
      id_font_type: DataTypes.INTEGER,
      path: DataTypes.STRING,
      image: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Font",
      tableName: "fonts",
    }
  );
  return Font;
};
