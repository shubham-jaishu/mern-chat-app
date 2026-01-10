import User from "../models/user.model.js"

export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id

        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password")

        res.status(200).json(filteredUsers)
    }
    catch (err) {
        console.log("Error in getUsersForSidebar:", err.message)
        res.status(500).json({ error: "Internal server error" })
    }
}

export const updateProfilePicture = async (req, res) => {
    try {
        const userId = req.user._id
        
        if (!req.file) {
            return res.status(400).json({ error: "Please upload an image" })
        }

        const profilePicUrl = `/uploads/${req.file.filename}`
        
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { profilePic: profilePicUrl },
            { new: true }
        ).select("-password")

        res.status(200).json(updatedUser)
    }
    catch (err) {
        console.log("Error in updateProfilePicture:", err.message)
        res.status(500).json({ error: "Internal server error" })
    }
}