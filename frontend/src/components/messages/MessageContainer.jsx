import { useEffect } from "react";
import useConversation from "../../zustand/useConversation";
import MessageInput from "./MessageInput";
import Messages from "./Messages";
import { TiMessages } from "react-icons/ti";
import { useAuthContext } from "../../context/AuthContext";
import { useSocketContext } from "../../context/SocketContext";

const MessageContainer = () => {
  const { selectedConversation, setSelectedConversation } = useConversation()
  const { socket, onlineUsers } = useSocketContext()
  const isOnline = onlineUsers.includes(selectedConversation?._id)

  useEffect(() => {
    return () => setSelectedConversation(null)
  }, [setSelectedConversation])

  useEffect(() => {
    if (selectedConversation && socket) {
      socket.emit("joinConversation", {
        conversationId: selectedConversation._id
      })
    }
  }, [selectedConversation, socket])

  return (
    <div className="md:min-w-[800px] flex flex-col">
      {!selectedConversation ? (
        <NoChatSelected />
      ) : (
        <>
          {/* Header */}
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-4 mb-2 border-b border-gray-700 shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center">
                  <img
                    src={
                      selectedConversation?.profilePic ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        selectedConversation?.fullName
                      )}&background=random&bold=true&size=48`
                    }
                    alt="avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-lg font-bold text-white">{selectedConversation?.fullName}</p>
                  <p className={`text-xs font-medium ${isOnline ? "text-green-400" : "text-gray-400"}`}>
                    {isOnline ? "Active now" : "Offline"}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <Messages />
          <MessageInput />
        </>
      )}
    </div>
  );
};

export default MessageContainer;

const NoChatSelected = () => {
  const {authUser} = useAuthContext()
  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="px-4 text-center ms:text-lg md:text-xl text-gray-200 font-semibold flex flex-col items-center gap-2">
        <p>Welcome 👋 {authUser.fullName} ❄️</p>
        <p>Select a chat to start messaging</p>
        <TiMessages className="text-3xl md:text-6xl text-center" />
      </div>
    </div>
  );
};

// STARTER CODE SNIPPET
// import MessageInput from "./MessageInput";
// import Messages from "./Messages";

// const MessageContainer = () => {
//   return (
//     <div className="md:min-w-[450px] flex flex-col">
//       <>
//         {/* Header */}
//         <div className="bg-slate-500 px-4 py-2 mb-2">
//           <span className="label-text">To:</span>{" "}
//           <span className="text-gray-900 font-bold">Shubham Jaiswal</span>
//         </div>
//         <Messages />
//         <MessageInput />
//       </>
//     </div>
//   );
// };

// export default MessageContainer;
