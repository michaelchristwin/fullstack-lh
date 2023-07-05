import db from "../models/index.js";
import nodemailer from "nodemailer";

const { tutors, Sequelize } = db;
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
  const tutor = {
    username: req.body.username,
    email: req.body.email,
    phone: req.body.phone,
    tell: req.body.tell,
  };

  const text = `${tutor.username} is interested in becoming a tutor. Contact them right away on ${tutor.email} or ${tutor.phone}.\nReason: ${tutor.tell}`;

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
      to: "iamjanus@proton.me",
      subject: "New Tutor Signed up!",
      text: text,
    });
    console.log("Message sent: %s", info.response);
  }

  tutors
    .create(tutor)
    .then((data) => {
      res.send(data);
      console.log("Tutor Created...");
      SendMail();
    })
    .catch((error) => {
      console.log("Tutor not created!");
      res.status(500).send({
        message: error.message,
      });
    });
};

export const findAll = (req, res) => {
  tutors
    .findAll()
    .then((data) => {
      res.send(data);
      console.log("Returning all Tutors");
    })
    .catch((error) => {
      console.log("Some error occurred while retrieving tutors.");
      res.status(500).send({
        message:
          error.message || "Some error occurred while retrieving tutors.",
      });
    });
};
