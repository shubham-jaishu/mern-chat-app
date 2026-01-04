import express from "express"
import { sendMessage, getMessages, addReaction, removeReaction, deleteMessage, editMessage } from "../controllers/message.controller.js"
import protectRoute from "../middleware/protectRoute.js"
import upload from "../middleware/uploadMiddleware.js"

const router = express.Router()

// Add logging middleware
router.use((req, res, next) => {
    console.log(`[MESSAGE ROUTE] ${req.method} ${req.originalUrl}`);
    next();
});

// Custom error handler for multer
const handleMulterError = (err, req, res, next) => {
    if (err) {
        console.error("Multer error:", err.message);
        return res.status(400).json({ error: err.message || "File upload error" });
    }
    next();
};

// POST routes (specific patterns first)
router.post("/send/:id", protectRoute, upload.single("image"), handleMulterError, sendMessage)
router.post("/reaction/add/:messageId", protectRoute, addReaction)
router.post("/reaction/remove/:messageId", protectRoute, removeReaction)

// DELETE route
router.delete("/:messageId", protectRoute, deleteMessage)

// PUT route  
router.put("/:messageId", protectRoute, editMessage)

// GET route (last, most generic)
router.get("/:id", protectRoute, getMessages)

export default router