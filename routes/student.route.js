import { create, findAll } from "../controllers/student.controller.js";
import express from "express";

const router = express.Router();

router.post("/", create);
router.get("/", findAll); // remove on production

export default router;
