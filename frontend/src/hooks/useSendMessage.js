import { useState } from "react"
import useConversation from "../zustand/useConversation"
import toast from "react-hot-toast"

const useSendMessage = () => {
    const [loading, setLoading] = useState(false)
    const { messages, setMessages, selectedConversation } = useConversation()

    const sendMessage = async (message, imageFile) => {
        setLoading(true)
        try {
            const formData = new FormData()
            formData.append("message", message)
            if (imageFile) {
                formData.append("image", imageFile)
            }

            const res = await fetch(`/api/messages/send/${selectedConversation._id}`, {
                method: "POST",
                body: formData
            })

            // Check if response is ok
            if (!res.ok) {
                const errorText = await res.text()
                console.error("Response error:", res.status, errorText)
                throw new Error(`Server error: ${res.status}`)
            }

            const data = await res.json()
            if (data.error) throw new Error(data.error)

            setMessages([...messages, data])
        }
        catch (error) {
            console.error("Send message error:", error.message)
            toast.error(error.message || "Failed to send message")
        }
        finally {
            setLoading(false)
        }
    }
    return { sendMessage, loading }
}

export default useSendMessage