"use strict";
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Music extends Model {
    static associate(models) {
      // Các mối quan hệ định nghĩa model/index.js
    }
  }
  Music.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      slug: {
        type: DataTypes.STRING,
      },
      duration: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      id_music_type: DataTypes.INTEGER,
      id_user: DataTypes.INTEGER,
      id_min_package: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Music",
      tableName: "musics",
    },
  );
  return Music;
};
