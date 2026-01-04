import { useSocketContext } from "../../context/SocketContext";
import useConversation from "../../zustand/useConversation";
import { useState, useEffect } from "react";

const Conversation = ({ conversation, lastIdx, emoji }) => {
  const { selectedConversation, setSelectedConversation, lastMessage } = useConversation();
  const [isTyping, setIsTyping] = useState(false);

  const isSelected = selectedConversation?._id === conversation._id;
  const { onlineUsers } = useSocketContext()
  const isOnline = onlineUsers.includes(conversation._id)

  useEffect(() => {
    const handleTypingStart = () => {
      if (selectedConversation?._id === conversation._id) {
        setIsTyping(true);
      }
    };

    const handleTypingEnd = () => {
      setIsTyping(false);
    };

    if (selectedConversation?._id === conversation._id) {
      window.addEventListener('typing-start', handleTypingStart);
      window.addEventListener('typing-end', handleTypingEnd);
    }

    return () => {
      window.removeEventListener('typing-start', handleTypingStart);
      window.removeEventListener('typing-end', handleTypingEnd);
    };
  }, [selectedConversation, conversation._id]);

  return (
    <>
      <div className={`flex gap-2 items-center hover:bg-sky-500 rounded p-2 py-1 cursor-pointer transition
        ${isSelected ? "bg-sky-500" : ""}
      `}
        onClick={() => setSelectedConversation(conversation)}
      >
        <div className={`avatar ${isOnline ? "online" : "offline"}`}>
          <div className="w-12 rounded-full">
            <img src={conversation.profilePic} alt="user avatar" />
          </div>
        </div>
        <div className="flex flex-col flex-1">
          <div className="flex gap-3 justify-between items-start">
            <p className="font-bold text-gray-200">{conversation.fullName}</p>
            <span className="text-xl">{emoji}</span>
          </div>
          <div className="text-sm text-gray-400 truncate">
            {isTyping ? (
              <span className="text-blue-400 italic">typing...</span>
            ) : (
              lastMessage?.[conversation._id]?.slice(0, 30) || "Start conversation"
            )}
          </div>
        </div>
      </div>
      {!lastIdx && <div className="divider my-0 py-0 h-1" />}
    </>
  );
};

export default Conversation;
