"use strict";
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Tag extends Model {
    static associate(models) {
      // Define associations here
    }
  }
  Tag.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: DataTypes.STRING,
      slug: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Tag",
      tableName: "tags",
    }
  );
  return Tag;
};
