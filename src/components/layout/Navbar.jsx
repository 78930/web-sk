import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import Icon from "../ui/Icons";

const NAV = [
  { to: "/",         label: "Home",        end: true },
  { to: "/jobs",     label: "Jobs" },
  { to: "/talent",   label: "Talent" },
  { to: "/features", label: "How it works" },
  { to: "/about",    label: "About" },
];

function Brand() {
  return (
    <Link to="/" className="flex items-center gap-2 group">
      <img
        src="/sketu-logo.jpeg"
        alt="Sketu"
        className="h-9 w-auto object-contain"
      />
    </Link>
  );
}

export default function Navbar() {
  const [open,     setOpen]     = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/");
  };

  const linkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors duration-150 ${
      isActive
        ? "text-brand-600 dark:text-brand-400"
        : "text-slate-600 hover:text-brand-600 dark:text-slate-300 dark:hover:text-brand-400"
    }`;

  const mobileLinkClass = ({ isActive }) =>
    `rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
      isActive
        ? "bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300"
        : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
    }`;

  return (
    <header
      className={`sticky top-0 z-50 border-b glass transition-shadow duration-300 ${
        scrolled
          ? "border-slate-200/80 shadow-card dark:border-slate-800/80"
          : "border-slate-200/50 dark:border-slate-800/50"
      }`}
    >
      <nav className="container-page flex h-16 items-center justify-between">
        <Brand />

        {/* Desktop links */}
        <div className="hidden items-center gap-7 lg:flex">
          {NAV.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={linkClass}>
              {item.label}
            </NavLink>
          ))}
          {user?.type === "admin" && (
            <NavLink to="/admin" className={linkClass}>
              Admin Panel
            </NavLink>
          )}
        </div>

        {/* Desktop actions */}
        <div className="hidden items-center gap-2 lg:flex">
          <button onClick={toggleTheme} aria-label="Toggle dark mode" className="btn-icon btn-ghost">
            {theme === "dark"
              ? <Icon.Sun  className="h-4.5 w-4.5" />
              : <Icon.Moon className="h-4.5 w-4.5" />}
          </button>
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="btn-secondary">
                {user?.name?.split(" ")[0] || "Dashboard"}
              </Link>
              <button onClick={handleLogout} className="btn-icon btn-ghost" aria-label="Log out">
                <Icon.Logout className="h-4.5 w-4.5" />
              </button>
            </>
          ) : (
            <>
              <Link to="/login"    className="btn-ghost">Log in</Link>
              <Link to="/register" className="btn-accent">Get started</Link>
            </>
          )}
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-1 lg:hidden">
          <button onClick={toggleTheme} aria-label="Toggle dark mode" className="btn-icon btn-ghost">
            {theme === "dark"
              ? <Icon.Sun  className="h-5 w-5" />
              : <Icon.Moon className="h-5 w-5" />}
          </button>
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            className="btn-icon btn-ghost"
          >
            {open ? <Icon.Close className="h-5 w-5" /> : <Icon.Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-slate-200 bg-white px-4 pb-5 pt-3 lg:hidden dark:border-slate-800 dark:bg-slate-950 animate-fade-in">
          <div className="flex flex-col gap-0.5">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setOpen(false)}
                className={mobileLinkClass}
              >
                {item.label}
              </NavLink>
            ))}
            {user?.type === "admin" && (
              <NavLink
                to="/admin"
                onClick={() => setOpen(false)}
                className={mobileLinkClass}
              >
                Admin Panel
              </NavLink>
            )}
          </div>
          <div className="mt-4 flex flex-col gap-2 border-t border-slate-200 pt-4 dark:border-slate-800">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" onClick={() => setOpen(false)} className="btn-secondary w-full">
                  Dashboard
                </Link>
                <button onClick={handleLogout} className="btn-ghost w-full">Log out</button>
              </>
            ) : (
              <>
                <Link to="/login"    onClick={() => setOpen(false)} className="btn-secondary w-full">Log in</Link>
                <Link to="/register" onClick={() => setOpen(false)} className="btn-accent w-full">Get started</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
