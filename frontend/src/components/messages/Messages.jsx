import { useEffect, useRef, useState } from "react";
import useGetMessages from "../../hooks/useGetMessages";
import MessageSkeleton from "../skeletons/MessageSkeleton";
import Message from "./Message";
import useListenMessages from "../../hooks/useListenMessages";

const Messages = () => {
  const { messages, loading } = useGetMessages();
  const [isTyping, setIsTyping] = useState(false);

  useListenMessages();

  const lastMessageRef = useRef();

  useEffect(() => {
    const handleTyping = () => setIsTyping(true);
    const handleStoppedTyping = () => setIsTyping(false);

    window.addEventListener('typing-start', handleTyping);
    window.addEventListener('typing-end', handleStoppedTyping);

    return () => {
      window.removeEventListener('typing-start', handleTyping);
      window.removeEventListener('typing-end', handleStoppedTyping);
    };
  }, []);

  useEffect(() => {
    setTimeout(() => {
      lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [messages, isTyping]);

  return (
    <div className="px-4 flex-1 overflow-auto">
      {!loading &&
        messages.length > 0 &&
        messages.map((message) => (
          <div key={message._id} ref={lastMessageRef}>
            <Message message={message} />
          </div>
        ))}
      {isTyping && (
        <div className="flex gap-2 items-center mb-3">
          <div className="flex gap-1">
            <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
            <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0.1s" }}></div>
            <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0.2s" }}></div>
          </div>
          <span className="text-sm text-gray-400 italic">typing...</span>
        </div>
      )}
      {loading &&
        [...Array(3)].map((_, idx) => <MessageSkeleton key={idx} />)}
      {!loading && messages.length === 0 && (
        <p className="text-center">Send a message to start the conversation</p>
      )}
    </div>
  );
};

export default Messages;

// STARTER CODE SNIPPET
// import Message from "./Message";

// const Messages = () => {
//   return <div className="px-4 flex-1 overflow-auto">
//     <Message/>
//     <Message/>
//     <Message/>
//     <Message/>
//     <Message/>
//     <Message/>
//     <Message/>
//     <Message/>
//     <Message/>
//     <Message/>
//     <Message/>
//   </div>;
// };

// export default Messages;
