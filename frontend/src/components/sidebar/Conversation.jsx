import { useSocketContext } from "../../context/SocketContext";
import useConversation from "../../zustand/useConversation";
import { useState, useEffect } from "react";
import { formatLastSeen } from "../../utils/formatLastSeen";

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
      <div
        className={`flex gap-3 items-center px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 backdrop-blur-sm
          ${isSelected 
            ? "bg-gradient-to-r from-sky-600 to-blue-600 shadow-lg shadow-blue-500/30" 
            : "hover:bg-gray-700/40 bg-gray-800/20"
          }
        `}
        onClick={() => setSelectedConversation(conversation)}
      >
        <div className={`relative flex-shrink-0`}>
          <div className={`avatar ${isOnline ? "online" : "offline"}`}>
            <div className="w-14 rounded-full ring-2 ring-gray-700 hover:ring-blue-500 transition-all bg-gray-600 flex items-center justify-center overflow-hidden">
              <img 
                src={
                  conversation.profilePic && conversation.profilePic.trim() !== "" 
                    ? conversation.profilePic
                    : `https://ui-avatars.com/api/?name=${encodeURIComponent(conversation.fullName)}&background=random&bold=true`
                }
                alt="user avatar" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col flex-1 min-w-0 gap-1">
          <div className="flex items-center gap-2 justify-between">
            <p className="font-bold text-gray-100 text-sm truncate">{conversation.fullName}</p>
            <span className={`text-sm font-semibold ${isOnline ? "text-green-400" : "text-gray-400"}`}>
              {isOnline ? "Active" : formatLastSeen(conversation.lastSeen)}
            </span>
            <span className="text-3xl flex-shrink-0">{emoji}</span>
          </div>
          
          <p className={`text-xs truncate transition-colors duration-200 ${
            isTyping 
              ? "text-blue-400 font-semibold italic" 
              : isSelected
              ? "text-gray-100"
              : "text-gray-400"
          }`}>
            {isTyping ? (
              <span className="flex items-center gap-1">
                <span className="inline-block w-1 h-1 bg-blue-400 rounded-full animate-bounce"></span>
                <span className="inline-block w-1 h-1 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></span>
                <span className="inline-block w-1 h-1 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></span>
                <span>typing...</span>
              </span>
            ) : (
              lastMessage?.[conversation._id]?.slice(0, 45) || "Start a conversation"
            )}
          </p>
        </div>
      </div>
      {!lastIdx && <div className="my-2 border-t border-gray-700/50" />}
    </>
  );
};

export default Conversation;
