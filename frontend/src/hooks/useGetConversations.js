import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { useSocketContext } from "../context/SocketContext"
import useConversation from "../zustand/useConversation"

const useGetConversations = () => {
    const [loading, setLoading] = useState(false)
    const [conversations, setConversations] = useState([])
    const { onlineUsers } = useSocketContext()
    const { setLastMessage } = useConversation()

    useEffect(() => {
        const getConversations = async () => {
            setLoading(true)
            try {
                const res = await fetch("/api/users")
                const data = await res.json()
                if (data.error) {
                    throw new Error(data.error)
                }
                setConversations(data)
                
                // Fetch last message for each conversation
                data.forEach(async (conversation) => {
                    try {
                        const msgRes = await fetch(`/api/messages/${conversation._id}`)
                        const msgData = await msgRes.json()
                        if (msgData.length > 0) {
                            const lastMsg = msgData[msgData.length - 1]
                            const messageText = lastMsg.message || (lastMsg.imageUrl ? "📷 Image" : "")
                            setLastMessage(conversation._id, messageText)
                        }
                    } catch (err) {
                        console.log("Error fetching last message:", err.message)
                    }
                })
            }
            catch (error) {
                toast.error(error.message)
            }
            finally {
                setLoading(false)
            }
        }
        getConversations()
    }, [onlineUsers, setLastMessage]) // Refetch when online users change
    return { loading, conversations }
}

export default useGetConversations