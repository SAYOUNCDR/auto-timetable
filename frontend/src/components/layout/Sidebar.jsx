import {
  LayoutDashboard,
  Database,
  Settings,
  FileText,
  User,
  LogOut,
  ChevronLeft,
  Menu,
} from "lucide-react";
import CalanderSVG from "../Logos/CalanderSVG";

const Sidebar = ({ isOpen, toggleSidebar, activePage, setActivePage }) => {
  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    { id: "data", label: "Data Management", icon: <Database size={20} /> },
    { id: "generator", label: "Generator", icon: <Settings size={20} /> },
    { id: "timetables", label: "All Timetables", icon: <FileText size={20} /> },
  ];

  return (
    <aside
      className={`bg-white h-screen shadow-lg flex flex-col transition-all duration-300 ease-in-out z-20 ${
        isOpen ? "w-64" : "w-20"
      }`}
    >
      {/* Logo Area */}
      <div className="flex items-center justify-between p-6 border-b border-gray-100">
        <div
          className={`flex items-center gap-2 ${
            !isOpen && "justify-center w-full"
          }`}
        >
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-bold text-xl">
            <CalanderSVG size={16} />
          </div>
          {isOpen && (
            <span className="font-bold text-lg text-gray-800">
              SmartScheduler
            </span>
          )}
        </div>
        <button
          onClick={toggleSidebar}
          className={`p-1.5 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-600 ${
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
            className="p-2 hover:bg-gray-100 rounded-md"
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
            className={`flex items-center w-full p-3 rounded-lg transition-colors ${
              activePage === item.id
                ? "bg-black text-white"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
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
            <div className="flex-1">
              <p className="text-xs text-gray-400 uppercase font-semibold">
                Current Role
              </p>
              <p className="text-sm font-bold text-gray-800">Admin</p>
            </div>
          )}
        </div>
        {isOpen && (
          <button className="flex items-center gap-2 mt-4 text-gray-500 hover:text-red-500 text-sm px-2">
            <LogOut size={16} /> <span>Sign out</span>
          </button>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
