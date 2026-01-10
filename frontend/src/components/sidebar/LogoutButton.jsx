import { BiLogOut } from "react-icons/bi";
import useLogout from "../../hooks/useLogout";
import toast from "react-hot-toast";

const LogoutButton = () => {
  const { loading, logout } = useLogout();

  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to logout?")) {
      await logout();
    }
  };

  return (
    <div className="mt-auto pt-4 border-t border-gray-700">
      <button
        onClick={handleLogout}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 disabled:from-gray-500 disabled:to-gray-600 text-gray-200 font-semibold py-3 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg disabled:cursor-not-allowed border border-gray-600 hover:border-gray-500"
      >
        {loading ? (
          <>
            <span className="loading loading-spinner loading-sm"></span>
            <span>Logging out...</span>
          </>
        ) : (
          <>
            <BiLogOut className="w-5 h-5" />
            <span>Logout</span>
          </>
        )}
      </button>
    </div>
  );
};

export default LogoutButton;
