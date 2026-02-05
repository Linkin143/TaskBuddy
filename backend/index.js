import cookieParser from "cookie-parser"
import cors from "cors"
import dotenv from "dotenv"
import express from "express"
import mongoose from "mongoose"
import path from "path"
import { fileURLToPath } from "url"

import aiRoutes from "./routes/ai.routes.js"
import authRoutes from "./routes/auth.route.js"
import reportRoutes from "./routes/report.route.js"
import taskRoutes from "./routes/task.route.js"
import userRoutes from "./routes/user.route.js"

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

// (secure cookies behind proxy)
app.set("trust proxy", 1)


app.use(
  cors({
    origin: process.env.FRONT_END_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
)

app.use(express.json())
app.use(cookieParser())


app.use("/api/auth", authRoutes)
app.use("/api/user", aiRoutes)
app.use("/api/users", userRoutes)
app.use("/api/tasks", taskRoutes)
app.use("/api/reports", reportRoutes)


app.use("/uploads", express.static(path.join(__dirname, "uploads")))


app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  })
})


mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Database connected"))
  .catch((err) => console.error(err))


const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
