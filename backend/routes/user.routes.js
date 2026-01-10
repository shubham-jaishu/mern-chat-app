import express from "express"
import protectRoute from "../middleware/protectRoute.js"
import { getUsersForSidebar, updateProfilePicture } from "../controllers/user.controller.js"
import upload from "../middleware/uploadMiddleware.js"

const router = express.Router()

router.get("/", protectRoute, getUsersForSidebar)
router.post("/profile-picture", protectRoute, upload.single("profilePic"), updateProfilePicture)

export default router