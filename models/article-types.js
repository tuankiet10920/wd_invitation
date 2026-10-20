"use strict";
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class ArticleType extends Model {
    static associate(models) {}
  }
  ArticleType.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name_vi: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM("posts", "sections"),
        allowNull: false,
        defaultValue: "posts",
      },
    },
    {
      sequelize,
      modelName: "ArticleType",
      tableName: "article_types",
    },
  );
  return ArticleType;
};
