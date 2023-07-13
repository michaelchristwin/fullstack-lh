import dbConfig from "../config/db.config.js";
import { Sequelize } from "sequelize";
import student from "../models/student.js";
import tutor from "../models/tutor.js";

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialectOptions: dbConfig.dialectOptions,
  dialect: dbConfig.dialect,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.tutors = tutor(sequelize, Sequelize);
db.students = student(sequelize, Sequelize);

export default db;
