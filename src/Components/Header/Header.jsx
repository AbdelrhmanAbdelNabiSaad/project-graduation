import "./Header.css";
import logo from "../../assets/logo.svg";
import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import { useTheme } from "../../context/ThemeContext";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="sr-nav">
      <div className="max-w-screen-xl flex items-center justify-between mx-auto px-4 py-3 h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <img src={logo} alt="Logo" className="w-8 h-8" />
          <span className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>
            Smart<span style={{ color: "var(--text-brand)" }}>Recruit</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Home</NavLink>
          <NavLink to="/about" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>About</NavLink>
          <Link to="/jobs" className="nav-link">Jobs</Link>
          <a href="#contact" className="nav-link">Contact</a>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <button onClick={toggleTheme} className="theme-toggle" title={theme === "dark" ? "Light Mode" : "Dark Mode"}>
            {theme === "dark" ? (
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
              </svg>
            ) : (
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
              </svg>
            )}
          </button>

          <Link to="/login" className="btn-outline hide">Login</Link>
          <Link to="/register" className="btn-primary hide">Sign Up</Link>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="block md:hidden theme-toggle"
            aria-label="Toggle menu"
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              {menuOpen
                ? <path d="M6 18L18 6M6 6l12 12"/>
                : <path d="M4 6h16M4 12h16M4 18h16"/>}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4">
          <div className="mobile-menu flex flex-col gap-1">
            <NavLink to="/" onClick={() => setMenuOpen(false)} className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Home</NavLink>
            <NavLink to="/about" onClick={() => setMenuOpen(false)} className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>About</NavLink>
            <Link to="/jobs" onClick={() => setMenuOpen(false)} className="nav-link">Jobs</Link>
            <a href="#contact" className="nav-link">Contact</a>
            <hr style={{ borderColor: "var(--border-default)" }} />
            <div className="flex gap-2 pt-1">
              <Link to="/login" onClick={() => setMenuOpen(false)} className="btn-outline flex-1 justify-center">Login</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="btn-primary flex-1 justify-center">Sign Up</Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Header;
