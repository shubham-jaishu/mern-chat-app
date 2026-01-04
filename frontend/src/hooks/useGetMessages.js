import { useEffect, useState } from "react"
import useConversation from "../zustand/useConversation"
import toast from "react-hot-toast"

const useGetMessages = () => {
    const [loading, setLoading] = useState(false)
    const { messages, setMessages, selectedConversation, setLastMessage } = useConversation()

    useEffect(() => {
        const getMessages = async () => {
            setLoading(true)
            try {
                const res = await fetch(`/api/messages/${selectedConversation._id}`)
                const data = await res.json()

                if (data.error) throw new Error(data.error)
                setMessages(data)
                
                // Set the last message from the fetched messages
                if (data.length > 0) {
                    const lastMsg = data[data.length - 1]
                    const messageText = lastMsg.message || (lastMsg.imageUrl ? "📷 Image" : "")
                    setLastMessage(selectedConversation._id, messageText)
                }
            }
            catch (error) {
                toast.error(error.message)
            }
            finally {
                setLoading(false)
            }
        }
        if (selectedConversation?._id) getMessages()
    }, [selectedConversation?._id, setMessages, setLastMessage])
    return { messages, loading, setMessages }
}

export default useGetMessages