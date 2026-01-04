import { useState, useRef, useEffect } from "react";
import { BsSend } from "react-icons/bs";
import { MdEmojiEmotions } from "react-icons/md";
import useSendMessage from "../../hooks/useSendMessage";
import { useSocketContext } from "../../context/SocketContext";
import useConversation from "../../zustand/useConversation";

const MessageInput = () => {
  const [message, setMessage] = useState("");
  const [showEmojis, setShowEmojis] = useState(false);
  const { loading, sendMessage } = useSendMessage();
  const { socket } = useSocketContext();
  const { selectedConversation } = useConversation();
  const typingTimeoutRef = useRef(null);

  const emojis = ["😀", "😃", "😄", "😁", "😆", "😅", "🤣", "😂", "😊", "😇", "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘", "😗", "😚", "😙", "🥲", "😋", "😛", "😜", "🤪", "😌", "😔", "😑", "😐", "😶", "🤐", "🤨", "😏", "😒", "🙄", "😬", "🤥", "😌", "😔", "😪", "🤤", "😴", "😷", "🤒", "🤕", "🤢", "🤮", "🤮", "🤧", "🤬", "😈", "👿", "💀", "💩", "🤡", "👹", "👺", "👻", "👽", "👾", "🤖", "😺", "😸", "😹", "😻", "😼", "😽", "🙀", "😿", "😾", "❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔", "💕", "💞", "💓", "💗", "💖", "💘", "💝", "💟", "👋", "🤚", "🖐️", "✋", "🖖", "👌", "🤌", "🤏", "✌️", "🤞", "🫰", "🤟", "🤘", "🤙", "👍", "👎", "✊", "👊", "🤛", "🤜", "👏", "🙌", "👐", "🤲", "🤝", "🤜"];

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const handleMessageChange = (e) => {
    setMessage(e.target.value);

    if (!socket || !selectedConversation) return;

    socket.emit("userTyping", { receiverId: selectedConversation._id });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("userStoppedTyping", { receiverId: selectedConversation._id });
    }, 1000);
  };

  const handleEmojiClick = (emoji) => {
    setMessage(message + emoji);
    setShowEmojis(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message) return;
    await sendMessage(message);
    setMessage("");

    if (socket && selectedConversation) {
      socket.emit("userStoppedTyping", { receiverId: selectedConversation._id });
    }
  };

  return (
    <form className="px-4 my-3" onSubmit={handleSubmit}>
      <div className="w-full relative flex items-center">
        <div className="absolute left-3 top-2 z-10">
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowEmojis(!showEmojis)}
              className="text-2xl hover:text-blue-400 transition"
            >
              <MdEmojiEmotions />
            </button>
            
            {showEmojis && (
              <div className="absolute bottom-12 left-0 bg-gray-800 rounded-lg p-3 grid grid-cols-8 gap-2 w-80 max-h-64 overflow-y-auto shadow-lg border border-gray-600 z-50">
                {emojis.map((emoji, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleEmojiClick(emoji)}
                    className="text-2xl hover:bg-gray-700 rounded p-1 transition"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <input
          type="text"
          className="border text-sm rounded-lg block w-full p-2.5 ps-12 pr-12 bg-gray-700 border-gray-600 text-white"
          placeholder="Send a message"
          value={message}
          onChange={handleMessageChange}
        />
        
        <button type="submit" className="absolute right-3 flex items-center">
          {loading ? <div className="loading loading-spinner"></div> : <BsSend />}
        </button>
      </div>
    </form>
  );
};

export default MessageInput;
