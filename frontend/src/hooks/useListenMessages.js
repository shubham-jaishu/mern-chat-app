import { useEffect } from "react"
import { useSocketContext } from "../context/SocketContext"
import useConversation from "../zustand/useConversation"

import notificationSound from "../assets/sounds/notification.mp3"

const useListenMessages = () => {
    const { socket } = useSocketContext()
    const { addMessage } = useConversation()

    useEffect(() => {
        // Only set up listener if socket exists
        if (!socket) return

        const handleNewMessage = (newMessage) => {
            newMessage.shouldShake = true
            const sound = new Audio(notificationSound)
            sound.play()
            addMessage(newMessage)
        }

        socket.on("newMessage", handleNewMessage)

        // Proper cleanup
        return () => {
            socket.off("newMessage", handleNewMessage)
        }
    }, [socket, addMessage])
}

export default useListenMessages