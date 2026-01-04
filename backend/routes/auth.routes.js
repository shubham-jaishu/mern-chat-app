import express from "express"
import rateLimit from "express-rate-limit"
import { login, logout, signup } from "../controllers/auth.controller.js"

const router = express.Router()

// Stricter rate limiting for auth endpoints
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs
    skipSuccessfulRequests: true, // Only count failed requests
    message: "Too many login/signup attempts, please try again later."
})

router.post("/signup", authLimiter, signup)
router.post("/login", authLimiter, login)
router.get("/logout", logout)

export default router