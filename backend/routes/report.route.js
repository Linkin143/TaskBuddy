import express from "express"
import {
  exportTaskReport,
  exportUsersReport,
} from "../controller/report.controller.js"
import { verifyToken } from "../utils/verifyUser.js"

const router = express.Router()

router.get("/export/tasks", verifyToken, exportTaskReport)

router.get("/export/users", verifyToken, exportUsersReport)

export default router
