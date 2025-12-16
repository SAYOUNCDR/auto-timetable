import {
  LayoutDashboard,
  Calendar,
  LogOut,
  ChevronLeft,
  Menu,
  User,
} from "lucide-react";
import CalanderSVG from "../Logos/CalanderSVG";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const StudentSidebar = ({
  isOpen,
  toggleSidebar,
  activePage,
  setActivePage,
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    {
      id: "timetable",
      label: "My Timetable",
      icon: <Calendar size={20} />,
    },
  ];

  return (
    <aside
      className={`bg-white h-screen shadow-lg flex flex-col transition-all duration-300 ease-in-out z-20 ${
        isOpen ? "w-64" : "w-20"
      }`}
    >
      {/* Logo Area */}
      <div className="flex items-center justify-between pt-8 pb-6 px-6">
        <div
          className={`flex items-center gap-2 ${
            !isOpen && "justify-center w-full"
          }`}
        >
          <CalanderSVG size={25} />

          {isOpen && (
            <span className="font-bold text-lg text-black tracking-wide cursor-pointer">
              Student
            </span>
          )}
        </div>
        <button
          onClick={toggleSidebar}
          className={`p-1.5 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-600 cursor-pointer ${
            !isOpen ? "hidden" : "block"
          }`}
        >
          <ChevronLeft size={16} />
        </button>
      </div>

      {/* Mobile/Collapsed Toggle */}
      {!isOpen && (
        <div className="flex justify-center py-4">
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-gray-100 rounded-md cursor-pointer"
          >
            <Menu size={20} />
          </button>
        </div>
      )}

      {/* Navigation Items */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {isOpen && (
          <p className="text-xs font-semibold text-gray-400 mb-4 px-2 tracking-wider">
            MENU
          </p>
        )}
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActivePage(item.id)}
            className={`flex items-center w-full p-3 rounded-lg transition-all duration-200 cursor-pointer ${
              activePage === item.id
                ? "bg-yellow-400 text-black font-medium shadow-sm"
                : "text-gray-500 hover:bg-yellow-50 hover:text-yellow-700"
            } ${!isOpen && "justify-center"}`}
          >
            {item.icon}
            {isOpen && <span className="ml-3 font-medium">{item.label}</span>}
          </button>
        ))}
      </nav>

      {/* Footer / Profile */}
      <div className="p-4 border-t border-gray-100">
        <div
          className={`flex items-center ${
            !isOpen ? "justify-center" : "gap-3"
          }`}
        >
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
            <User size={20} />
          </div>
          {isOpen && (
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-400 uppercase font-semibold">
                Student
              </p>
              <p
                className="text-sm font-bold text-gray-800 truncate"
                title={user?.email}
              >
                {user?.email || "User"}
              </p>
            </div>
          )}
        </div>
        {isOpen && (
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 mt-4 text-gray-500 hover:text-red-500 text-sm px-2 transition-colors w-full text-left"
          >
            <LogOut size={16} /> <span>Sign out</span>
          </button>
        )}
      </div>
    </aside>
  );
};

export default StudentSidebar;
