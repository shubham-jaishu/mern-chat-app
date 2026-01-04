import { useEffect } from "react"
import { useSocketContext } from "../context/SocketContext"
import useConversation from "../zustand/useConversation"

import notificationSound from "../assets/sounds/notification.mp3"

const useListenMessages = () => {
    const { socket } = useSocketContext()
    const { addMessage, setLastMessage, selectedConversation, messages, setMessages } = useConversation()

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

        const handleReactionAdded = (data) => {
            console.log("Reaction added received:", data)
            const updatedMessages = messages.map((msg) =>
                msg._id === data.messageId ? { ...msg, reactions: data.reactions } : msg
            )
            setMessages(updatedMessages)
        }

        const handleReactionRemoved = (data) => {
            console.log("Reaction removed received:", data)
            const updatedMessages = messages.map((msg) =>
                msg._id === data.messageId ? { ...msg, reactions: data.reactions } : msg
            )
            setMessages(updatedMessages)
        }

        const handleMessageDeleted = (data) => {
            console.log("Message deleted received:", data)
            const updatedMessages = messages.map((msg) =>
                msg._id === data.messageId ? { ...msg, isDeleted: true } : msg
            )
            setMessages(updatedMessages)
        }

        const handleMessageEdited = (data) => {
            console.log("Message edited received:", data)
            const updatedMessages = messages.map((msg) =>
                msg._id === data.messageId ? { ...msg, message: data.message, editedAt: data.editedAt } : msg
            )
            setMessages(updatedMessages)
        }

        socket.on("newMessage", handleNewMessage)
        socket.on("userTyping", handleTyping)
        socket.on("userStoppedTyping", handleStoppedTyping)
        socket.on("reactionAdded", handleReactionAdded)
        socket.on("reactionRemoved", handleReactionRemoved)
        socket.on("messageDeleted", handleMessageDeleted)
        socket.on("messageEdited", handleMessageEdited)

        return () => {
            socket.off("newMessage", handleNewMessage)
            socket.off("userTyping", handleTyping)
            socket.off("userStoppedTyping", handleStoppedTyping)
            socket.off("reactionAdded", handleReactionAdded)
            socket.off("reactionRemoved", handleReactionRemoved)
            socket.off("messageDeleted", handleMessageDeleted)
            socket.off("messageEdited", handleMessageEdited)
        }
    }, [socket, addMessage, setLastMessage, messages, setMessages])
}

export default useListenMessages