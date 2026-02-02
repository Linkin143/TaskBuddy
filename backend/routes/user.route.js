import express from "express"
import { getUserById, getUsers } from "../controller/user.controller.js"
import { verifyToken } from "../utils/verifyUser.js"

const router = express.Router()

// User mangement route
router.get("/get-users", verifyToken, getUsers)

router.get("/:id", verifyToken, getUserById)

export default router
