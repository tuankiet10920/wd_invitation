"use strict";
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Website extends Model {
    static associate(models) {
      // Define associations here
    }
  }
  Website.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: DataTypes.STRING,
      slug: {
        type: DataTypes.STRING,
        unique: true,
      },
      key: DataTypes.STRING,
      desc: DataTypes.TEXT,
      meta_desc: DataTypes.TEXT,
      level: DataTypes.INTEGER,
      time_creator: DataTypes.DATE,
      features: DataTypes.JSON,
      image: DataTypes.STRING,
      is_new: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      is_hot: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      id_website_type: DataTypes.INTEGER,
      id_user: DataTypes.INTEGER,
      id_package: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Website",
      tableName: "websites",
    }
  );
  return Website;
};
