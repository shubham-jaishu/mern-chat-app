import { IoSearchSharp } from "react-icons/io5";
import { MdClear } from "react-icons/md";
import { useState, useMemo } from "react";
import useConversation from "../../zustand/useConversation";
import useGetConversations from "../../hooks/useGetConversations";
import toast from "react-hot-toast";

const SearchInput = () => {
  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const { setSelectedConversation } = useConversation();
  const { conversations } = useGetConversations();

  // Filter conversations based on search
  const filteredConversations = useMemo(() => {
    if (!search.trim()) return [];
    
    return conversations.filter((c) =>
      c.fullName.toLowerCase().includes(search.toLowerCase()) ||
      c.username.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, conversations]);

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
    setSearch("");
    setShowDropdown(false);
    toast.success(`Selected ${conversation.fullName}`);
  };

  const handleClear = () => {
    setSearch("");
    setShowDropdown(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!search.trim()) {
      toast.error("Please enter a search term");
      return;
    }

    if (search.length < 2) {
      return toast.error("Search term must be at least 2 characters");
    }

    if (filteredConversations.length === 0) {
      toast.error("No user found!");
      return;
    }

    // Auto select if only one result
    if (filteredConversations.length === 1) {
      handleSelectConversation(filteredConversations[0]);
    } else {
      setShowDropdown(true);
    }
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search users..."
            className="input input-bordered rounded-full w-full pl-4 pr-10"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => search && setShowDropdown(true)}
            autoComplete="off"
          />
          {search && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition"
            >
              <MdClear className="w-5 h-5" />
            </button>
          )}
        </div>
        <button 
          type="submit" 
          className="btn btn-circle bg-sky-500 hover:bg-sky-600 text-white transition"
        >
          <IoSearchSharp className="w-6 h-6 outline-none" />
        </button>
      </form>

      {/* Search Dropdown Results */}
      {showDropdown && search && filteredConversations.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
          <div className="p-2">
            <p className="text-xs text-gray-400 px-2 py-1">
              Found {filteredConversations.length} user{filteredConversations.length !== 1 ? "s" : ""}
            </p>
            {filteredConversations.map((conversation) => (
              <button
                key={conversation._id}
                onClick={() => handleSelectConversation(conversation)}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-700 transition flex items-center gap-2 mb-1"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-600 flex items-center justify-center flex-shrink-0">
                  <img
                    src={
                      conversation.profilePic ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        conversation.fullName
                      )}&background=random&bold=true&size=32`
                    }
                    alt="avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">
                    {conversation.fullName}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    @{conversation.username}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* No Results Message */}
      {showDropdown && search && filteredConversations.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50 p-4 text-center">
          <p className="text-gray-400 text-sm">No users found matching "{search}"</p>
        </div>
      )}
    </div>
  );
};

export default SearchInput;

// STARTER CODE SNIPPET

// import { IoSearchSharp } from "react-icons/io5";

// const SearchInput = () => {
//   return (
//     <form className="flex items-center gap-2">
//       <input
//         type="text"
//         placeholder="Search"
//         className="input input-bordered rounded-full"
//       />
//       <button type="submit" className="btn btn-circle bg-sky-500 text-white">
//         <IoSearchSharp className="w-6 h-6 outline-none"/>
//       </button>
//     </form>
//   );
// };

// export default SearchInput;
