import { create } from "zustand"

const useConversation = create((set) => ({
    selectedConversation: null,
    setSelectedConversation: (selectedConversation) => set({ selectedConversation }),
    messages: [],
    setMessages: (messages) => set({ messages }),
    addMessage: (message) => set((state) => ({
        messages: [...state.messages, message]
    })),
    lastMessage: {},
    setLastMessage: (conversationId, text) =>
        set((state) => ({
            lastMessage: {
                ...state.lastMessage,
                [conversationId]: text,
            },
        })),
    openReactionMessageId: null,
    setOpenReactionMessageId: (messageId) => set({ openReactionMessageId: messageId }),
}))

export default useConversation