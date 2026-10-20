"use strict";
import { Model } from "sequelize";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export default (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // define association here nếu có bảng khác liên kết
    }
  }

  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      avatar: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: "default.jpg",
      },
      birthday: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: true,
        unique: {
          msg: "Email đã được sử dụng",
        },
        validate: {
          isEmail: { msg: "Email không hợp lệ" },
        },
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      phone: {
        type: DataTypes.STRING(15),
        allowNull: true,
        defaultValue: null,
      },
      introduction: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
      },
      is_google: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      verify_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
      },
      social: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      facebook_user_id: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      role: {
        type: DataTypes.ENUM("user", "admin"),
        allowNull: false,
        defaultValue: "user",
      },
      package_expired_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      is_change_image: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      id_package: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 1,
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
      hooks: {
        beforeCreate: async (user) => {
          console.log("beforeCreate hook triggered");
          if (user.password) {
            console.log("Hashing password in beforeCreate hook");
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
            console.log("Password hashed successfully");
          }
        },
        beforeUpdate: async (user) => {
          console.log("beforeUpdate hook triggered");
          if (user.changed("password")) {
            console.log("Hashing password in beforeUpdate hook");
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
            console.log("Password hashed successfully");
          }
        },
      },
    },
  );

  // So khớp mật khẩu
  User.prototype.matchPassword = async function (enteredPassword) {
    try {
      if (!this.password || !enteredPassword) return false;
      return await bcrypt.compare(enteredPassword, this.password);
    } catch (error) {
      console.error("Error comparing passwords:", error);
      return false;
    }
  };

  // Tạo JWT token
  User.prototype.getSignedJwtToken = function () {
    try {
      return jwt.sign(
        { id: this.id },
        process.env.JWT_SECRET || "fallback_secret_key",
        { expiresIn: process.env.JWT_EXPIRE || "30d" },
      );
    } catch (error) {
      console.error("Error generating JWT token:", error);
      throw error;
    }
  };

  return User;
};
