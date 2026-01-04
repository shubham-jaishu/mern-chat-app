import { useEffect } from "react"
import { useSocketContext } from "../context/SocketContext"
import useConversation from "../zustand/useConversation"

import notificationSound from "../assets/sounds/notification.mp3"

const useListenMessages = () => {
    const { socket } = useSocketContext()
    const { addMessage, setLastMessage, selectedConversation } = useConversation()

    useEffect(() => {
        if (!socket) return

        const handleNewMessage = (newMessage) => {
            newMessage.shouldShake = true
            const sound = new Audio(notificationSound)
            sound.play()
            addMessage(newMessage)
            setLastMessage(newMessage.senderId, newMessage.message)
        }

        const handleTyping = (data) => {
            const event = new CustomEvent('typing-start', { detail: data })
            window.dispatchEvent(event)
        }

        const handleStoppedTyping = (data) => {
            const event = new CustomEvent('typing-end', { detail: data })
            window.dispatchEvent(event)
        }

        socket.on("newMessage", handleNewMessage)
        socket.on("userTyping", handleTyping)
        socket.on("userStoppedTyping", handleStoppedTyping)

        return () => {
            socket.off("newMessage", handleNewMessage)
            socket.off("userTyping", handleTyping)
            socket.off("userStoppedTyping", handleStoppedTyping)
        }
    }, [socket, addMessage, setLastMessage])
}

export default useListenMessages