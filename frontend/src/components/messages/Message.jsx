import { useAuthContext } from "../../context/AuthContext"
import useConversation from "../../zustand/useConversation"
import { extractTime } from "../../utils/extractTime"
import { MdEmojiEmotions } from "react-icons/md"

const Message = ({ message }) => {
    const { authUser } = useAuthContext()
    const { selectedConversation, openReactionMessageId, setOpenReactionMessageId, messages, setMessages } = useConversation()
    const fromMe = message.senderId === authUser._id
    const formattedTime = extractTime(message.createdAt)
    const chatClassName = fromMe ? "chat-end" : "chat-start"
    const profilePic = fromMe ? authUser.profilePic : selectedConversation?.profilePic
    const bubbleBgColor = fromMe ? "bg-blue-500" : ""

    const shakeClass = message.shouldShake ? "shake" : ""

    const reactionEmojis = ["👍", "❤️", "😂", "😮", "😢", "🔥", "😍", "👏"]

    const isReactionOpen = openReactionMessageId === message._id;

    const handleReaction = async (emoji) => {
        try {
            // Check if user already has any reaction on this message
            const userExistingReaction = message.reactions?.find(
                (r) => r.userId === authUser._id
            );

            // Remove all user reactions first, then add new one
            let updatedReactions = message.reactions?.filter(
                (r) => r.userId !== authUser._id
            ) || [];

            // Only add new emoji if it's different from existing, or if no existing
            updatedReactions = [
                ...updatedReactions,
                { emoji, userId: authUser._id }
            ];

            // Update local state immediately
            setMessages(
                messages.map((msg) =>
                    msg._id === message._id ? { ...msg, reactions: updatedReactions } : msg
                )
            );

            // Make API call
            const response = await fetch(`/api/messages/reaction/add/${message._id}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ emoji })
            })
            if (!response.ok) throw new Error("Failed to add reaction")
            setOpenReactionMessageId(null)
        } catch (error) {
            console.log("Error adding reaction:", error)
        }
    }

    const getReactionCounts = () => {
        const counts = {}
        message.reactions?.forEach(reaction => {
            counts[reaction.emoji] = (counts[reaction.emoji] || 0) + 1
        })
        return counts
    }

    const reactionCounts = getReactionCounts()

    return (
        <div className={`chat ${chatClassName}`}>
            <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                    <img src={profilePic} alt="Tailwind CSS chat bubble component" />
                </div>
            </div>

            <div className="relative group">
                <div className={`chat-bubble text-white ${bubbleBgColor} ${shakeClass} pb-2`}>
                    {message.message}
                </div>

                <button
                    onClick={() => setOpenReactionMessageId(isReactionOpen ? null : message._id)}
                    className="absolute -top-3 -right-8 bg-gray-700 hover:bg-gray-600 rounded-full p-2 text-lg opacity-0 group-hover:opacity-100 transition-opacity z-20"
                >
                    <MdEmojiEmotions />
                </button>

                {isReactionOpen && (
                    <div className={`absolute -top-14 ${fromMe ? 'right-0' : 'left-0'} bg-gray-800 rounded-lg p-2 flex gap-1 shadow-lg border border-gray-600 z-30 whitespace-nowrap`}>
                        {reactionEmojis.map((emoji) => (
                            <button
                                key={emoji}
                                onClick={() => handleReaction(emoji)}
                                className="text-xl hover:bg-gray-700 p-1 rounded transition"
                            >
                                {emoji}
                            </button>
                        ))}
                    </div>
                )}

                {Object.keys(reactionCounts).length > 0 && (
                    <div className="flex gap-1 mt-1 flex-wrap">
                        {Object.entries(reactionCounts).map(([emoji, count]) => (
                            <div
                                key={emoji}
                                className="bg-gray-700 rounded-full px-2 py-0.5 text-xs flex items-center gap-1"
                            >
                                <span>{emoji}</span>
                                {count > 1 && <span className="text-gray-300">{count}</span>}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="chat-footer opacity-50 text-xs flex gap-1 items-center">{formattedTime}</div>
        </div>
    )
}

export default Message