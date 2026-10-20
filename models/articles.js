"use strict";
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Article extends Model {
    static associate(models) {
      // Các mối quan hệ định nghĩa model/index.js
    }
  }
  Article.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      num: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      title_vi: DataTypes.STRING,
      slug_vi: DataTypes.STRING,
      short_description_vi: DataTypes.TEXT,
      content_vi: DataTypes.TEXT,
      keyword: DataTypes.STRING,
      alt: DataTypes.STRING,
      id_type_news: DataTypes.INTEGER, // Nối với article_types (tên cột theo thiết kế ID_TYPE_NEWS nhưng tham chiếu article_types)
      id_user: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Article",
      tableName: "articles",
    }
  );
  return Article;
};
