import express from "express"
import { sendMessage, getMessages, addReaction, removeReaction, deleteMessage, editMessage } from "../controllers/message.controller.js"
import protectRoute from "../middleware/protectRoute.js"

const router = express.Router()

// Add logging middleware
router.use((req, res, next) => {
    console.log(`[MESSAGE ROUTE] ${req.method} ${req.originalUrl}`);
    next();
});

// POST routes (specific patterns first)
router.post("/send/:id", protectRoute, sendMessage)
router.post("/reaction/add/:messageId", protectRoute, addReaction)
router.post("/reaction/remove/:messageId", protectRoute, removeReaction)

// DELETE route
router.delete("/:messageId", protectRoute, deleteMessage)

// PUT route  
router.put("/:messageId", protectRoute, editMessage)

// GET route (last, most generic)
router.get("/:id", protectRoute, getMessages)

export default router