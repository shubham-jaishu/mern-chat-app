import { useState } from "react";
import Conversations from "./Conversations";
import LogoutButton from "./LogoutButton";
import SearchInput from "./SearchInput";
import ProfileSettings from "./ProfileSettings";
import { useAuthContext } from "../../context/AuthContext";

const Sidebar = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { authUser } = useAuthContext();

  return (
    <div className="border-r border-slate-500 p-4 flex flex-col h-full">
      {/* Profile Section */}
      <div className="flex items-center gap-3 mb-4 p-3 bg-gray-800/40 rounded-lg">
        <div
          className="w-10 h-10 rounded-full cursor-pointer hover:opacity-80 transition bg-gray-600 flex items-center justify-center overflow-hidden"
          onClick={() => setIsProfileOpen(true)}
        >
          <img
            src={
              authUser?.profilePic ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                authUser?.fullName
              )}&background=random&bold=true`
            }
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-white truncate">{authUser?.fullName}</p>
          <p className="text-xs text-gray-400 truncate">Click to change photo</p>
        </div>
      </div>

      <SearchInput />
      <div className="divider px-3 my-2"></div>
      <div className="flex-1 overflow-y-auto">
        <Conversations />
      </div>
      <LogoutButton />

      {/* Profile Settings Modal */}
      <ProfileSettings isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </div>
  );
};

export default Sidebar;













// STARTER CODE FOR THIS FILE 
// import Conversations from "./Conversations";
// import LogoutButton from "./LogoutButton";
// import SearchInput from "./SearchInput";

// const Sidebar = () => {
//   return (
//     <div className="border-r border-slate-500 p-4 flex flex-col">
//       <SearchInput />
//       <div className="divider px-3"></div>
//       <Conversations />
//       <LogoutButton/>
//     </div>
//   );
// };

// export default Sidebar;
