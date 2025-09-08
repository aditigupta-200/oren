import express from "express"
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import dotenv from "dotenv"
import authRoutes from "./routes/auth"
import responseRoutes from "./routes/responses"
import esgRoutes from "./routes/esg"
import { errorHandler } from "./middleware/errorHandler"
import { notFound } from "./middleware/notFound"

dotenv.config()

const app = express()

// Security middleware
app.use(helmet())
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "https://oren-five.vercel.app/",
    credentials: true,
  }),
)

// Logging
app.use(morgan("combined"))

// Body parsing
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true }))

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() })
})

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/responses", responseRoutes)
app.use("/api/esg", esgRoutes)

// Error handling
app.use(notFound)
app.use(errorHandler)

export default app;
