import { useState } from "react";
import './Sidebar.css';
import dash from '../../assets/dash.png';
import job from '../../assets/job.png';
import applicant from '../../assets/applicant.png';
import recommend from '../../assets/recommed.png';
import candidate from '../../assets/user-icon.svg';
import { NavLink } from "react-router-dom";

function SidebarLink({ to, icon, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `sidebar-link ${isActive ? "active" : ""}`
      }
    >
      <img src={icon} alt="" className="w-5 h-5 flex-shrink-0" />
      <span>{label}</span>
    </NavLink>
  );
}

function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem('userType'));

  const applicantLinks = [
    { to: "/dashboard",    icon: dash,      label: "Dashboard" },
    { to: "/jobs",         icon: job,       label: "Browse Jobs" },
    { to: "/candidates",   icon: candidate, label: "Accepted Offers" },
    { to: "/profile",    icon: applicant, label: "My Profile" },
    { to: "/recommend",    icon: recommend, label: "Recommendations" },
  ];

  const recruiterLinks = [
    { to: "/dashboard",   icon: dash,      label: "Dashboard" },
    { to: "/createjob",   icon: job,       label: "Create Job" },
    { to: "/myjobs",      icon: applicant, label: "My Jobs" },
    { to: "/candidates",  icon: candidate, label: "Candidates" },
    { to: "/applicant",   icon: applicant, label: "Applicant Details" },
    { to: "/recommend",   icon: recommend, label: "Recommendations" },
  ];

  const links = user === "applicant" ? applicantLinks : recruiterLinks;

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-30 left-2 z-50 sm:hidden flex items-center justify-center w-10 h-10 rounded-xl shadow-lg"
        style={{ background: "var(--gradient-brand)", color: "white" }}
        aria-label="Toggle sidebar"
      >
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          {mobileOpen ? <path d="M6 18L18 6M6 6l12 12"/> : <path d="M4 6h16M4 12h16M4 18h10"/>}
        </svg>
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 sm:hidden"
          style={{ background: "var(--bg-overlay)" }}
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`sr-sidebar fixed top-16 left-0 z-40 w-64 h-[calc(100vh-4rem)] transition-transform duration-300 flex flex-col
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"} sm:translate-x-0`}
      >
        {/* Nav links */}
        <div className="flex-1 overflow-y-auto px-3 py-4">
          <p className="text-xs font-bold uppercase tracking-widest mb-3 px-2" style={{ color: "var(--text-muted)" }}>
            Navigation
          </p>
          <nav className="space-y-1 mt-20 md:mt-0">
            {links.map(l => (
              <SidebarLink key={l.to} to={l.to} icon={l.icon} label={l.label} />
            ))}
          </nav>
        </div>

        {/* Upgrade banner */}
        <div className="mx-3 mb-4 p-4 rounded-2xl" style={{ background: "var(--gradient-brand)" }}>
          <h3 className="font-bold text-white text-sm mb-1">Upgrade Plan</h3>
          <p className="text-white/80 text-xs mb-3">Get more AI credits for candidate matching.</p>
          <button className="w-full py-1.5 text-sm font-bold rounded-xl transition-all duration-200"
            style={{ background: "white", color: "var(--indigo-600)" }}>
            View Plans
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
