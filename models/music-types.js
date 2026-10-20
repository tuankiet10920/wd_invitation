"use strict";
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class MusicType extends Model {
    static associate(models) {
    }
  }
  MusicType.init(
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
      slug: {
        type: DataTypes.STRING,
      },
      key: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: "MusicType",
      tableName: "music_types",
    }
  );
  return MusicType;
};
