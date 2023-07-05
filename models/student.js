import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Student = sequelize.define("student", {
    username: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    phone: {
      type: DataTypes.STRING,
    },
    why: {
      type: DataTypes.STRING,
    },
  });
  return Student;
};
