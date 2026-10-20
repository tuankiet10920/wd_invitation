"use strict";
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class VerifyToken extends Model {
    /**
     * Helper method for defining associations.
     */
    static associate(models) {
      // Thiết lập mối quan hệ: Một token thuộc về một User
    }
  }

  VerifyToken.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      token: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM("VERIFY_ACCOUNT", "RESET_PASSWORD"),
        allowNull: false,
        defaultValue: "VERIFY_ACCOUNT",
      },
      expires_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      id_user: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "VerifyToken",
      // Đảm bảo tên bảng khớp với DB (số nhiều)
      tableName: "verify_tokens",
      underscored: false, // Để false nếu bạn dùng kiểu createdAt, updatedAt (camelCase)
    }
  );

  return VerifyToken;
};
