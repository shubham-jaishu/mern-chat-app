import express from "express"
import dotenv from "dotenv"
dotenv.config()
import cookieParser from "cookie-parser"

import authRoutes from "./routes/auth.routes.js"
import messageRoutes from "./routes/message.routes.js"
import userRoutes from "./routes/user.routes.js"

import connectToMongoDB from "./db/connectToMongoDB.js"

const app = express()
const PORT = process.env.PORT || 5000;



app.use(express.json())
app.use(cookieParser())

app.use("/api/auth", authRoutes)
app.use("/api/messages", messageRoutes)
app.use("/api/users", userRoutes)

// app.get("/", (req, res) => {
//     res.send("Hello world!!")
// })


app.listen(PORT, () => {
    console.log(process.env.JWT_SECRET)
    connectToMongoDB()
    console.log(`Server running on PORT ${PORT}`)
})