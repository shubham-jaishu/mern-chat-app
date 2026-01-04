import path from "path"
import express from "express"
import dotenv from "dotenv"
dotenv.config()
import cookieParser from "cookie-parser"
import rateLimit from "express-rate-limit"
import { fileURLToPath } from "url"

import authRoutes from "./routes/auth.routes.js"
import messageRoutes from "./routes/message.routes.js"
import userRoutes from "./routes/user.routes.js"

import connectToMongoDB from "./db/connectToMongoDB.js"
import { app, server } from "./socket/socket.js"

const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Rate limiting middleware
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again later."
})

// Apply rate limiting to all requests
app.use(limiter)

app.use(express.json())
app.use(cookieParser())

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

app.use("/api/auth", authRoutes)
app.use("/api/messages", messageRoutes)
app.use("/api/users", userRoutes)

app.use(express.static(path.join(__dirname, "/frontend/dist")))

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"))
})

server.listen(PORT, () => {
    connectToMongoDB()
    console.log(`Server running on PORT ${PORT}`)
})