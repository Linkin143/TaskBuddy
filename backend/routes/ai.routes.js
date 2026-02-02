import express from "express";
import { getTaskInsights } from "../controller/ai.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.get("/get-insights", verifyToken, getTaskInsights);

export default router;