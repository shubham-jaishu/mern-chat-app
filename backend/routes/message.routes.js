import express from "express"
import { sendMessage, getMessages, addReaction, removeReaction } from "../controllers/message.controller.js"
import protectRoute from "../middleware/protectRoute.js"

const router = express.Router()

router.get("/:id", protectRoute, getMessages)
router.post("/send/:id", protectRoute, sendMessage)
router.post("/reaction/add/:messageId", protectRoute, addReaction)
router.post("/reaction/remove/:messageId", protectRoute, removeReaction)

export default router