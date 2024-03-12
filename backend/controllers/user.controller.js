import User from "../models/user.model.js"

export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id
        console.log(loggedInUserId);

        // const filteredUsers=await User.find();

        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password")

        res.status(200).json(filteredUsers)
    }
    catch (err) {
        console.log("Error in getUserForSidebar: ", err.message)
        res.status(500).json({ err: "Internal server error" })
    }
}