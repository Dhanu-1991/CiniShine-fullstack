import { HiViewGrid, HiCog, HiLogout, HiUserCircle, HiDocumentText, HiCheckCircle, HiClipboardList } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

const SIDEBAR_OPEN_WIDTH = 256; // px
const SIDEBAR_CLOSED_WIDTH = 64; // px
const HEADER_HEIGHT = 80; // px

export const Sidebar = ({ sidebarOpen }) => {
  const navigate = useNavigate();
  const hasApplied = false; // mock

  const handleNav = (path) => navigate(path);

  return (
    <aside
      className={`transition-all duration-300 bg-gradient-to-b from-blue-900 via-indigo-800 to-cyan-600 text-white shadow-lg fixed left-0 z-50
        ${sidebarOpen ? "w-64" : "w-16"} flex flex-col items-center py-4`}
      style={{
        top: `${HEADER_HEIGHT}px`,
        height: `calc(100vh - ${HEADER_HEIGHT}px)`,
        width: sidebarOpen ? SIDEBAR_OPEN_WIDTH : SIDEBAR_CLOSED_WIDTH,
      }}
    >
      <div className="flex flex-col space-y-6 w-full px-2 mt-2">
        <SidebarItem icon={<HiViewGrid />} label="Dashboard" open={sidebarOpen} onClick={() => handleNav("/dashboard")} />
        <SidebarItem icon={<HiClipboardList />} label="Workflow" open={sidebarOpen} onClick={() => handleNav("/workflow")} />
        <SidebarItem icon={<HiDocumentText />} label="Apply for Role" open={sidebarOpen} onClick={() => handleNav("/roles/new")} />
        <SidebarItem icon={<HiCheckCircle />} label="Selected Roles" open={sidebarOpen} onClick={() => handleNav("/roles/applied")} />
        <SidebarItem icon={<HiUserCircle />} label="Contact Us" open={sidebarOpen} onClick={() => handleNav("/contact")} />
        <SidebarItem icon={<HiCog />} label="Settings" open={sidebarOpen} onClick={() => handleNav("/settings")} />
        <SidebarItem icon={<HiLogout className="text-red-600" />} label="Logout" open={sidebarOpen} onClick={() => handleNav("/logout")} isDanger />
      </div>
    </aside>
  );
};

function SidebarItem({ icon, label, open, onClick, isDanger }) {
  return (
    <div
      className={`group flex items-center space-x-3 hover:bg-${isDanger ? "red-100 dark:hover:bg-red-900" : "gray-200 dark:hover:bg-gray-700"} p-2 rounded cursor-pointer`}
      onClick={onClick}
    >
      <span className={`text-2xl ${isDanger ? "text-red-600" : ""}`}>{icon}</span>
      {open && <span className={`${isDanger ? "text-red-600" : ""}`}>{label}</span>}
    </div>
  );
}
