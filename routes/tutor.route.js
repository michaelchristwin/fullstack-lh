import { create, findAll } from "../controllers/tutor.controller.js";
import express from "express";
const router = express.Router();

router.post("/", create);
// router.get("/", findAll); // comment in production

export default router;
