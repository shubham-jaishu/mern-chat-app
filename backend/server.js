import path from "path"
import express from "express"
import dotenv from "dotenv"
dotenv.config()
import cookieParser from "cookie-parser"
import { fileURLToPath } from "url"

import authRoutes from "./routes/auth.routes.js"
import messageRoutes from "./routes/message.routes.js"
import userRoutes from "./routes/user.routes.js"

import connectToMongoDB from "./db/connectToMongoDB.js"
import { app, server } from "./socket/socket.js"

const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, "..")

app.use(express.json())
app.use(cookieParser())

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

app.use("/api/auth", authRoutes)
app.use("/api/messages", messageRoutes)
app.use("/api/users", userRoutes)

// Serve frontend static files
app.use(express.static(path.join(projectRoot, "frontend/dist")))

// SPA fallback - serve index.html for all routes
app.get("*", (req, res) => {
    res.sendFile(path.join(projectRoot, "frontend/dist/index.html"))
})

server.listen(PORT, () => {
    connectToMongoDB()
    console.log(`Server running on PORT ${PORT}`)
})