import { DataTypes } from "sequelize";

export default (sequelize, Sequelize) => {
  const Tutor = sequelize.define("tutor", {
    username: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    phone: {
      type: DataTypes.STRING,
    },
    tell: {
      type: DataTypes.STRING,
    },
  });
  return Tutor;
};
