import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import Icon from "../ui/Icons";

const NAV = [
  { to: "/", label: "Home", end: true },
  { to: "/jobs", label: "Jobs" },
  { to: "/talent", label: "Talent" },
  { to: "/features", label: "How it works" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
  ];

function Brand() {
    return (
          <Link to="/" className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white shadow-sm">
                        <Icon.Briefcase className="h-5 w-5" />
                </span>span>
                <span className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
                        Sketu
                </span>span>
          </Link>Link>
        );
}

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const { isAuthenticated, user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
  
    const handleLogout = () => {
          logout();
          setOpen(false);
          navigate("/");
    };
  
    const linkClass = ({ isActive }) =>
          `text-sm font-medium transition-colors ${
                  isActive
                    ? "text-brand-600 dark:text-brand-400"
                    : "text-slate-600 hover:text-brand-600 dark:text-slate-300 dark:hover:text-brand-400"
          }`;
  
    return (
          <>
            {/* Skip to main content — accessibility */}
                <a
                          href="#main-content"
                          className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-[100] focus:rounded-lg focus:bg-brand-600 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white focus:shadow-lg"
                        >
                        Skip to main content
                </a>a>
          
                <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur-lg dark:border-slate-800/70 dark:bg-slate-950/80">
                        <nav className="container-page flex h-16 items-center justify-between">
                                  <Brand />
                        
                                  <div className="hidden items-center gap-7 lg:flex">
                                    {NAV.map((item) => (
                          <NavLink key={item.to} to={item.to} end={item.end} className={linkClass}>
                            {item.label}
                          </NavLink>NavLink>
                        ))}
                                  </div>div>
                        
                                  <div className="hidden items-center gap-3 lg:flex">
                                              <button
                                                              onClick={toggleTheme}
                                                              aria-label="Toggle dark mode"
                                                              aria-pressed={theme === "dark"}
                                                              className="btn-ghost h-10 w-10 !px-0"
                                                            >
                                                {theme === "dark" ? <Icon.Sun className="h-5 w-5" /> : <Icon.Moon className="h-5 w-5" />}
                                              </button>button>
                                    {isAuthenticated ? (
                          <>
                                          <Link to="/dashboard" className="btn-secondary">
                                            {user?.name?.split(" ")[0] || "Dashboard"}
                                          </Link>Link>
                                          <button onClick={handleLogout} className="btn-ghost" aria-label="Log out">
                                                            <Icon.Logout className="h-5 w-5" />
                                          </button>button>
                          </>>
                        ) : (
                          <>
                                          <Link to="/login" className="btn-ghost">
                                                            Log in
                                          </Link>Link>
                                          <Link to="/register" className="btn-primary">
                                                            Get started
                                          </Link>Link>
                          </>>
                        )}
                                  </div>div>
                        
                                  <div className="flex items-center gap-1 lg:hidden">
                                              <button
                                                              onClick={toggleTheme}
                                                              aria-label="Toggle dark mode"
                                                              aria-pressed={theme === "dark"}
                                                              className="btn-ghost h-10 w-10 !px-0"
                                                            >
                                                {theme === "dark" ? <Icon.Sun className="h-5 w-5" /> : <Icon.Moon className="h-5 w-5" />}
                                              </button>button>
                                              <button
                                                              onClick={() => setOpen((v) => !v)}
                                                              aria-label="Toggle menu"
                                                              aria-expanded={open}
                                                              className="btn-ghost h-10 w-10 !px-0"
                                                            >
                                                {open ? <Icon.Close className="h-6 w-6" /> : <Icon.Menu className="h-6 w-6" />}
                                              </button>button>
                                  </div>div>
                        </nav>nav>
                
                  {open ? (
                      <div className="border-t border-slate-200 bg-white px-4 py-4 lg:hidden dark:border-slate-800 dark:bg-slate-950">
                                  <div className="flex flex-col gap-1">
                                    {NAV.map((item) => (
                                        <NavLink
                                                            key={item.to}
                                                            to={item.to}
                                                            end={item.end}
                                                            onClick={() => setOpen(false)}
                                                            className={({ isActive }) =>
                                                                                  `rounded-lg px-3 py-2.5 text-sm font-medium ${
                                                                                                          isActive
                                                                                                            ? "bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300"
                                                                                                            : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                                                                                    }`
                                                            }
                                                          >
                                          {item.label}
                                        </NavLink>NavLink>
                                      ))}
                                                <div className="mt-3 flex flex-col gap-2 border-t border-slate-200 pt-3 dark:border-slate-700">
                                                  {isAuthenticated ? (
                                          <>
                                                              <Link to="/dashboard" onClick={() => setOpen(false)} className="btn-secondary w-full text-center">
                                                                {user?.name?.split(" ")[0] || "Dashboard"}
                                                              </Link>Link>
                                                              <button onClick={handleLogout} className="btn-ghost w-full">
                                                                                    Log out
                                                              </button>button>
                                          </>>
                                        ) : (
                                          <>
                                                              <Link to="/login" onClick={() => setOpen(false)} className="btn-ghost w-full text-center">
                                                                                    Log in
                                                              </Link>Link>
                                                              <Link to="/register" onClick={() => setOpen(false)} className="btn-primary w-full text-center">
                                                                                    Get started
                                                              </Link>Link>
                                          </>>
                                        )}
                                                </div>div>
                                  </div>div>
                      </div>div>
                    ) : null}
                </header>header>
          </>>
        );
}</></></></></></Link>
