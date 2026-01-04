import { useState, useRef, useEffect } from "react";
import { BsSend } from "react-icons/bs";
import { MdEmojiEmotions } from "react-icons/md";
import { MdAddAPhoto } from "react-icons/md";
import useSendMessage from "../../hooks/useSendMessage";
import { useSocketContext } from "../../context/SocketContext";
import useConversation from "../../zustand/useConversation";
import toast from "react-hot-toast";

const MessageInput = () => {
  const [message, setMessage] = useState("");
  const [showEmojis, setShowEmojis] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const imageInputRef = useRef(null);
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

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type - allow common image formats
      const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Please select a supported image (JPEG, PNG, GIF, WebP)");
        return;
      }
      processImage(file);
    }
  };

  const processImage = (imageFile) => {
    console.log("Processing image:", imageFile.name, imageFile.type, imageFile.size);
    setSelectedImage(imageFile);
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(imageFile);
  };

  const clearImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message && !selectedImage) return;
    await sendMessage(message, selectedImage);
    setMessage("");
    clearImage();
    setMessage("");

    if (socket && selectedConversation) {
      socket.emit("userStoppedTyping", { receiverId: selectedConversation._id });
    }
  };

  return (
    <form className="px-4 my-3" onSubmit={handleSubmit}>
      {imagePreview && (
        <div className="mb-3 relative w-32 h-32 border border-gray-600 rounded-lg overflow-hidden bg-gray-700">
          <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={clearImage}
            className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 rounded-full p-1 text-white text-sm"
          >
            ✕
          </button>
        </div>
      )}
      <div className="w-full relative flex items-center">
        <div className="absolute left-3 top-2 z-10 flex gap-2 items-center">
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

          <input
            type="file"
            ref={imageInputRef}
            onChange={handleImageSelect}
            accept="image/*"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => imageInputRef.current?.click()}
            className="text-2xl hover:text-blue-400 transition -mt-1"
          >
            <MdAddAPhoto />
          </button>
        </div>

        <input
          type="text"
          className="border text-sm rounded-lg block w-full p-2.5 ps-24 pr-12 bg-gray-700 border-gray-600 text-white"
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
