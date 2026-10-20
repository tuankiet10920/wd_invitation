"use strict";
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      // Các mối quan hệ định nghĩa model/index.js
    }
  }
  Order.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      total: DataTypes.INTEGER,
      duration: DataTypes.INTEGER,
      id_user: DataTypes.INTEGER,
      id_package: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Order",
      tableName: "orders",
    }
  );
  return Order;
};
