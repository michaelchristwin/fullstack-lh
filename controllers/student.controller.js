import db from "../models/index.js";
import nodemailer from "nodemailer";

const { students, Sequelize } = db;
const Op = Sequelize.Op;
import dotenv from "dotenv";
dotenv.config();
const emailUsed = process.env.EMAIL_USED;
const emailPass = process.env.EMAIL_PASS;

export const create = (req, res) => {
  if (!req.body.username) {
    console.log("Name cannot be empty");
    res.status(400).send({
      message: "Name cannot be empty",
    });
    return;
  }
  const student = {
    username: req.body.username,
    email: req.body.email,
    phone: req.body.phone,
    why: req.body.why,
  };

  const text = `${student.username} booked a session. Contact them right away on ${student.email} or ${student.phone}.\nReason: ${student.why}`;

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: emailUsed,
      pass: emailPass,
    },
  });

  async function SendMail() {
    let info = await transporter.sendMail({
      from: emailUsed,
      to: "mwhoeft@gmail.com",
      subject: "New Student Signed up!",
      text: text,
    });
    console.log("Message sent: %s", info.response);
  }

  students
    .create(student)
    .then((data) => {
      res.send(data);
      console.log("Student Created...");
      SendMail();
    })
    .catch((error) => {
      console.log("Student not created!");
      res.status(500).send({
        message: error.message,
      });
    });
};

export const findAll = (req, res) => {
  students
    .findAll()
    .then((data) => {
      res.send(data);
      console.log("Returning all Students");
    })
    .catch((error) => {
      console.log("Some error occurred while retrieving students.");
      res.status(500).send({
        message:
          error.message || "Some error occurred while retrieving students.",
      });
    });
};
