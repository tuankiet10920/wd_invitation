"use strict";
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class AcceptInvitation extends Model {
    static associate(models) {
      // Define associations in models/index.js if needed
    }
  }
  AcceptInvitation.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      content: DataTypes.TEXT,
      is_accept: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      id_wedding_card: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "AcceptInvitation",
      tableName: "accept_invitations",
    }
  );
  return AcceptInvitation;
};
