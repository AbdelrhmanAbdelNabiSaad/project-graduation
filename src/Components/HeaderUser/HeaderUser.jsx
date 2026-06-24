import "./HeaderUser.css";
import logo from "../../assets/logo.svg";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import userImg from "../../assets/user.png";
import { useState } from "react";
import Logout from "../Logout/Logout";
import { useTheme } from "../../context/ThemeContext";

function HeaderUser() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [view, setView] = useState(false);
  const [searchVal, setSearchVal] = useState("");

  const settingUser = [
    { name: "My Profile", path: "/profile" },
    { name: "My Applications", path: "/applications" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "Logout", action: "logout" },
  ];

  async function handleLogout() {
    try {
      await Logout();
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      navigate("/login");
    } catch (error) {
      console.log(`Logout Error: ${error}`);
    }
  }

  return (
    <nav className="sr-nav">
      <div className="max-w-screen-xl flex items-center justify-between mx-auto px-4 h-16 gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <img src={logo} alt="Logo" className="w-8 h-8" />
          <span className="text-lg font-bold hidden sm:block" style={{ color: "var(--text-primary)" }}>
            Smart<span style={{ color: "var(--text-brand)" }}>Recruit</span>
          </span>
        </Link>

        {/* Search */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--text-muted)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
            <input
              type="search"
              value={searchVal}
              onChange={e => setSearchVal(e.target.value)}
              className="sr-input pl-9"
              placeholder="Search jobs, companies, keywords..."
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Theme */}
          <button onClick={toggleTheme} className="theme-toggle" title="Toggle theme">
            {theme === "dark" ? (
              <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
              </svg>
            ) : (
              <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
              </svg>
            )}
          </button>

          {/* Notifications */}
          <button className="theme-toggle relative" title="Notifications">
            <FontAwesomeIcon icon={faBell} className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ background: "var(--indigo-500)" }}></span>
          </button>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setView(!view)}
              className="flex items-center gap-2 px-2 py-1 rounded-xl transition-all duration-200 hover:opacity-80"
              style={{ background: "var(--bg-tertiary)" }}
            >
              <img src={userImg} className="w-8 h-8 rounded-full object-cover ring-2" style={{ ringColor: "var(--border-brand)" }} alt="avatar" />
              <span className="text-sm font-semibold hidden sm:block" style={{ color: "var(--text-primary)" }}>Account</span>
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" style={{ color: "var(--text-muted)" }}>
                <path d="M6 9l6 6 6-6"/>
              </svg>
            </button>

            {view && (
              <div className="absolute right-0 top-full mt-2 w-52 sr-card overflow-hidden z-50 animate-fade-in">
                {settingUser.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      if (item.action === "logout") { handleLogout(); setView(false); }
                      else setView(false);
                    }}
                    className="hover:opacity-80 transition-opacity"
                    style={{ borderBottom: index < settingUser.length - 1 ? "1px solid var(--border-default)" : "none" }}
                  >
                    {item.path ? (
                      <NavLink to={item.path} className="flex items-center gap-2 px-4 py-3 text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                        {item.name}
                      </NavLink>
                    ) : (
                      <button className="flex items-center gap-2 px-4 py-3 text-sm font-medium w-full text-left" style={{ color: "var(--text-danger)" }}>
                        {item.name}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile search */}
      <div className="md:hidden px-4 pb-3">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--text-muted)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <input type="search" className="sr-input pl-9" placeholder="Search jobs..." />
        </div>
      </div>
    </nav>
  );
}

export default HeaderUser;
