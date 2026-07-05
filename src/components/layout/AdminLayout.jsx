import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import Icon from "../ui/Icons";

const NAV_ITEMS = [
  {
    to: "/admin",
    end: true,
    label: "Dashboard",
    icon: (p) => (
      <svg fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" {...p}>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    to: "/admin/verifications",
    label: "Verifications",
    icon: Icon.Shield,
  },
];

function SidebarLink({ item, onClick }) {
  return (
    <NavLink
      to={item.to}
      end={item.end}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
          isActive
            ? "bg-brand-600 text-white shadow-sm"
            : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
        }`
      }
    >
      {({ isActive }) => (
        <>
          <item.icon className={`h-4.5 w-4.5 flex-shrink-0 ${isActive ? "text-white" : "text-slate-400 dark:text-slate-500"}`} />
          {item.label}
        </>
      )}
    </NavLink>
  );
}

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const Sidebar = ({ mobile = false }) => (
    <aside
      className={
        mobile
          ? "flex flex-col gap-1 p-4"
          : "hidden w-60 flex-shrink-0 flex-col border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 lg:flex"
      }
    >
      {/* Brand */}
      <div className={`flex items-center gap-2.5 ${mobile ? "mb-4 px-1" : "h-16 flex-shrink-0 border-b border-slate-200 px-5 dark:border-slate-800"}`}>
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
          <Icon.Briefcase className="h-4 w-4" />
        </span>
        <div>
          <span className="block text-sm font-extrabold text-slate-900 dark:text-white">Sketu Admin</span>
          <span className="block text-xs text-slate-400">{user?.name || "Administrator"}</span>
        </div>
      </div>

      {/* Nav */}
      <nav className={`flex flex-col gap-1 ${mobile ? "" : "flex-1 overflow-y-auto p-3"}`}>
        <p className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-widest text-slate-400">Menu</p>
        {NAV_ITEMS.map((item) => (
          <SidebarLink key={item.to} item={item} onClick={() => setSidebarOpen(false)} />
        ))}
      </nav>

      {/* Footer actions */}
      <div className={`flex items-center justify-between border-t border-slate-200 dark:border-slate-800 ${mobile ? "mt-4 pt-4" : "p-3"}`}>
        <Link
          to="/"
          className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
        >
          <Icon.ArrowRight className="h-3.5 w-3.5 rotate-180" />
          Public site
        </Link>
        <div className="flex items-center gap-1">
          <button onClick={toggleTheme} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
            {theme === "dark" ? <Icon.Sun className="h-4 w-4" /> : <Icon.Moon className="h-4 w-4" />}
          </button>
          <button onClick={handleLogout} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800" title="Log out">
            <Icon.Logout className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Desktop sidebar */}
      <Sidebar />

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-xl dark:bg-slate-950">
            <Sidebar mobile />
          </div>
        </div>
      )}

      {/* Main area */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile topbar */}
        <div className="flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4 dark:border-slate-800 dark:bg-slate-950 lg:hidden">
          <button onClick={() => setSidebarOpen(true)} className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
            <Icon.Menu className="h-5 w-5" />
          </button>
          <span className="text-sm font-bold text-slate-900 dark:text-white">Admin Panel</span>
          <button onClick={handleLogout} className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
            <Icon.Logout className="h-4 w-4" />
          </button>
        </div>

        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
