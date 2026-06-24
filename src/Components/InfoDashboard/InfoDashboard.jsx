import { useState, useEffect } from "react";
import "./InfoDashboard.css";
import peopleTotal from "../../assets/people-total.png";
import calendar from "../../assets/date.png";
import ai from "../../assets/Ai.png";
import usericon from "../../assets/user-icon.svg";
import view from "../../assets/icon-view.svg";
import send from "../../assets/icon-send.svg";
import trend from "../../assets/icon-trend.svg";
import save from "../../assets/icon-save.svg";
import email from "../../assets/email (2).png";
import logoCompany from "../../assets/company-1.svg";
import axios from "axios";

const BASE = "https://jooobs.runasp.net";

function InfoDashboard() {
  const userType = JSON.parse(localStorage.getItem("userType"));
  const token = localStorage.getItem("token");
  const userName =
    localStorage.getItem("userName") ||
    localStorage.getItem("name") ||
    "User";

  // ── Shared State ──
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [apiErrorMsg, setApiErrorMsg] = useState("");

  // ── Recruiter: Details Modal ──
  const [detailsModal, setDetailsModal] = useState(null);
  const [recruiterPage, setRecruiterPage] = useState(1);
  const [userPage, setUserPage] = useState(1);
  const PAGE_SIZE = 5; // { app, details, loading }
  const [actionLoading, setActionLoading] = useState(null); // applicationId being acted on

  // ─────────────────────────────────────────────
  // APPLICANT: fetch my applications
  // ─────────────────────────────────────────────
  async function fetchUserApplications() {
    setLoading(true);
    setApiErrorMsg("");
    try {
      const res = await axios.get(`${BASE}/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const raw = res.data?.data || res.data || [];
      const list = Array.isArray(raw) ? raw : [];

      // جيب اسم الوظيفة لكل application من jobId
      const withTitles = await Promise.all(
        list.map(async (app) => {
          let jobTitle = "N/A";
          if (app.jobId) {
            try {
              const jobRes = await axios.get(`${BASE}/api/Jobs/${app.jobId}`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              jobTitle =
                jobRes.data?.data?.title ||
                jobRes.data?.title ||
                "N/A";
            } catch {}
          }
          return {
            id: app.id || app.applicationId,
            jobTitle,
            companyName:
              app.companyName || app.company?.name || app.company || "N/A",
            status: app.status || "Pending",
            matchScore: app.matchScore ?? app.score ?? null,
            createdAt: app.createdAt || app.appliedAt || app.created || null,
          };
        })
      );

      setApplications(withTitles);
    } catch (e) {
      setApiErrorMsg("Could not load applications.");
      setApplications([]);
    } finally {
      setLoading(false);
    }
  }

  // ─────────────────────────────────────────────
  // RECRUITER: fetch all applications for company jobs
  // ─────────────────────────────────────────────
  async function fetchRecruiterApplications() {
    setLoading(true);
    setApiErrorMsg("");
    try {
      // 1️⃣ جيب كل jobs الشركة
      const jobsRes = await axios.get(`${BASE}/api/CompanyJobs`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { Page: 1, PageSize: 100 },
      });
      const myJobs = Array.isArray(jobsRes.data?.data)
        ? jobsRes.data.data
        : [];

      if (myJobs.length === 0) {
        setApplications([]);
        setLoading(false);
        return;
      }

      // 2️⃣ لكل job جيب الـ applications
      const allApps = [];
      for (const job of myJobs) {
        try {
          const appsRes = await axios.get(`${BASE}/api/JobApplications`, {
            headers: { Authorization: `Bearer ${token}` },
            params: { jobId: job.id, page: 1, pageSize: 50 },
          });
          const raw = appsRes.data?.data || [];
          if (Array.isArray(raw)) {
            raw.forEach((a) =>
              allApps.push({
                id: a.id,
                jobId: a.jobId || job.id,
                jobTitle: a.jobTitle || job.title || "N/A",
                companyName: a.companyName || "N/A",
                matchScore: a.matchScore ?? 0,
                status: a.status || "Pending",
                createdAt: a.created || a.createdAt || null,
                // تفاصيل إضافية لو موجودة في list response
                applicantName: a.applicantName || null,
                applicantEmail: a.email || null,
                cvId: a.cvId || null,
              })
            );
          }
        } catch (_) {}
      }
      setApplications(allApps);
    } catch (e) {
      setApiErrorMsg("Could not load applications.");
      setApplications([]);
    } finally {
      setLoading(false);
    }
  }

  // ─────────────────────────────────────────────
  // RECRUITER: فتح Details Modal
  // ─────────────────────────────────────────────
  async function openDetails(app) {
    setDetailsModal({ app, details: null, loading: true });
    try {
      const res = await axios.get(
        `${BASE}/api/JobApplications/${app.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const d = res.data?.data || {};
      setDetailsModal({
        app,
        details: {
          applicantName: d.applicantName || app.applicantName || "N/A",
          email: d.email || app.applicantEmail || "N/A",
          jobTitle: d.jobTitle || app.jobTitle || "N/A",
          matchScore: d.matchScore ?? app.matchScore ?? 0,
          status: d.status || app.status || "Pending",
          cvId: d.cvId || app.cvId || null,
          cvFilePath: d.cvPath || d.cvFilePath || d.cvUrl || d.filePath || null,
        },
        loading: false,
      });
    } catch {
      setDetailsModal((prev) => ({ ...prev, loading: false }));
    }
  }

  // ─────────────────────────────────────────────
  // RECRUITER: Accept / Reject
  // Pending=0, Accepted=1, Rejected=2
  // ─────────────────────────────────────────────
  async function updateStatus(applicationId, statusCode) {
    setActionLoading(applicationId);
    try {
      await axios.patch(
        `${BASE}/api/JobApplications/${applicationId}/status`,
        statusCode,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const statusLabel =
        statusCode === 1 ? "Accepted" : statusCode === 2 ? "Rejected" : "Pending";

      // حدّث الـ state فوراً
      setApplications((prev) =>
        prev.map((a) =>
          a.id === applicationId ? { ...a, status: statusLabel } : a
        )
      );

      // لو الـ modal مفتوح على نفس الـ application حدّثه
      if (detailsModal?.app?.id === applicationId) {
        setDetailsModal((prev) => ({
          ...prev,
          app: { ...prev.app, status: statusLabel },
          details: prev.details
            ? { ...prev.details, status: statusLabel }
            : null,
        }));
      }
    } catch (e) {
      alert("Failed to update status. Please try again.");
    } finally {
      setActionLoading(null);
    }
  }

  useEffect(() => {
    if (userType === "applicant") fetchUserApplications();
    else fetchRecruiterApplications();
  }, []);

  function getStatusStyle(status) {
    switch (status?.toLowerCase()) {
      case "accepted": return "text-green-600 bg-green-100";
      case "rejected": return "text-red-600 bg-red-100";
      case "interview": return "text-blue-600 bg-blue-100";
      default: return "text-yellow-600 bg-yellow-100";
    }
  }

  // ── Stats arrays ──
  const arrayUser = [
    { subTitle: "Total Applications", count: applications.length, icon: peopleTotal, target: "12%", time: "vs last month" },
    { subTitle: "Interview", count: applications.filter((a) => a.status?.toLowerCase() === "interview").length, icon: calendar, target: "12%", time: "vs last month" },
    { subTitle: "AI Shortlisted", count: 0, icon: ai, target: "12%", time: "vs last month" },
    { subTitle: "Accepted", count: applications.filter((a) => a.status?.toLowerCase() === "accepted").length, icon: peopleTotal, target: "12%", time: "vs last month" },
  ];

  const arrayRecruiter = [
    { icon: send, target: "+12%", subTitle: "Total Applications", count: applications.length },
    { icon: view, target: "+5%", subTitle: "Pending", count: applications.filter((a) => a.status?.toLowerCase() === "pending").length },
    { icon: trend, target: "stable", subTitle: "Interview", count: applications.filter((a) => a.status?.toLowerCase() === "interview").length },
    { icon: save, target: "+2%", subTitle: "Accepted", count: applications.filter((a) => a.status?.toLowerCase() === "accepted").length },
  ];

  return (
    <div className="w-full py-6 px-2 mt-15 md:mt-0">
      <h1
        className="font-bold text-3xl"
        style={{ color: "var(--text-primary)" }}
      >
        Dashboard Overview
      </h1>
      <div className="my-4">
        <h3 className="text-xl font-bold">
          Welcome{" "}
          <span className="" style={{ color: "var(--text-brand)" }}>
            {userName}
          </span>
        </h3>
        <p className="text-gray-500">
          Here's what's happening with your hiring pipeline today.
        </p>
      </div>

      {/* ══════════════════════════════════════════
          APPLICANT VIEW
      ══════════════════════════════════════════ */}
      {userType === "applicant" ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {arrayUser.map((card, i) => (
              <div key={i} className="stat-card w-full">
                <div className="head flex justify-between items-center">
                  <h5 className="text-gray-500">{card.subTitle}</h5>
                  <img src={card.icon} alt={card.subTitle} />
                </div>
                <h5 className="mb-2 text-3xl font-bold tracking-tight">
                  {card.count}
                </h5>
                <div className="inline-flex font-medium items-center">
                  <span className="badge-brand py-1 px-2 rounded-lg">
                    {card.target}
                  </span>
                  <span className="ml-2 text-gray-300">{card.time}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 mt-4 gap-5">
            <div className="col-span-1 md:col-span-2 lg:col-span-3">
              <div className="sr-card overflow-hidden">
                <h3 className="px-4 sm:px-6 pt-4 font-bold text-lg">My Applications</h3>

                {/* Table view — tablet & desktop */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-sm text-left mt-2">
                    <thead
                      className="text-sm  border-t text-white"
                      style={{
                        background: "var(--gradient-brand)",
                        borderTopColor: "var(--border-default)",
                      }}
                    >
                      <tr>
                        {[
                          "Company",
                          "Position",
                          "Match Score",
                          "Status",
                          "Applied At",
                        ].map((h) => (
                          <th
                            key={h}
                            className="px-6 py-3 font-bold text-sm text-white"
                            
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td
                            colSpan={5}
                            className="px-6 py-6 text-center text-gray-400"
                          >
                            Loading...
                          </td>
                        </tr>
                      ) : apiErrorMsg ? (
                        <tr>
                          <td
                            colSpan={5}
                            className="px-6 py-6 text-center text-red-500 text-xs"
                          >
                            {apiErrorMsg}
                          </td>
                        </tr>
                      ) : applications.length === 0 ? (
                        <tr>
                          <td
                            colSpan={5}
                            className="px-6 py-6 text-center text-gray-400"
                          >
                            No applications yet.
                          </td>
                        </tr>
                      ) : (
                        applications
                          .slice((userPage - 1) * PAGE_SIZE, userPage * PAGE_SIZE)
                          .map((app) => (
                            <tr
                              key={app.id}
                              className="border-b"
                              style={{ borderColor: "var(--border-default)" }}
                            >
                              <th
                                scope="row"
                                className="flex items-center px-6 py-4 whitespace-nowrap"
                              >
                                <img
                                  className="w-10 h-10 rounded-full"
                                  src={logoCompany}
                                  alt="company"
                                />
                                <div className="ps-3 text-base font-semibold">
                                  {app.companyName}
                                </div>
                              </th>
                              <td className="px-6 py-4" style={{color: 'var(--text-brand)'}}>
                                {app.jobTitle}
                              </td>
                              <td
                                className="px-6 py-4  text-blue-700"
                                
                              >
                                {app.matchScore !== null
                                  ? `${app.matchScore}%`
                                  : "N/A"}
                              </td>
                              <td className="px-6 py-4">
                                <span
                                  className={`py-1 px-3 rounded-2xl text-xs font-bold ${getStatusStyle(app.status)}`}
                                >
                                  {app.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-gray-400">
                                {app.createdAt
                                  ? new Date(app.createdAt).toLocaleDateString()
                                  : "N/A"}
                              </td>
                            </tr>
                          ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Card view — mobile */}
                <div className="md:hidden mt-2">
                  {loading ? (
                    <div className="px-4 py-6 text-center text-gray-400">
                      Loading...
                    </div>
                  ) : apiErrorMsg ? (
                    <div className="px-4 py-6 text-center text-red-500 text-xs">
                      {apiErrorMsg}
                    </div>
                  ) : applications.length === 0 ? (
                    <div className="px-4 py-6 text-center text-gray-400">
                      No applications yet.
                    </div>
                  ) : (
                    applications
                      .slice((userPage - 1) * PAGE_SIZE, userPage * PAGE_SIZE)
                      .map((app) => (
                        <div
                          key={app.id}
                          className="px-4 py-4 border-t flex flex-col gap-3"
                          style={{ borderColor: "var(--border-default)" }}
                        >
                          <div className="flex items-center gap-3">
                            <img
                              className="w-10 h-10 rounded-full flex-shrink-0"
                              src={logoCompany}
                              alt="company"
                            />
                            <div className="min-w-0">
                              <div className="text-base font-semibold truncate">
                                {app.companyName}
                              </div>
                              <div
                                className="text-sm truncate"
                                style={{ color: "var(--text-brand)" }}
                              >
                                {app.jobTitle}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <span className="text-sm text-blue-700 font-medium">
                              {app.matchScore !== null
                                ? `Match: ${app.matchScore}%`
                                : "Match: N/A"}
                            </span>
                            <span
                              className={`py-1 px-3 rounded-2xl text-xs font-bold ${getStatusStyle(app.status)}`}
                            >
                              {app.status}
                            </span>
                          </div>
                          <div
                            className="text-xs"
                            style={{ color: "var(--text-secondary)" }}
                          >
                            Applied:{" "}
                            {app.createdAt
                              ? new Date(app.createdAt).toLocaleDateString()
                              : "N/A"}
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </div>
              {/* User Pagination */}
              {Math.ceil(applications.length / PAGE_SIZE) > 1 && (
                <div className="flex justify-center items-center gap-2 py-4 border-t border-gray-100">
                  <button
                    onClick={() => setUserPage((p) => Math.max(1, p - 1))}
                    disabled={userPage === 1}
                    className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 cursor-pointer"
                  >
                    ← Prev
                  </button>
                  {Array.from(
                    { length: Math.ceil(applications.length / PAGE_SIZE) },
                    (_, i) => i + 1,
                  ).map((pg) => (
                    <button
                      key={pg}
                      onClick={() => setUserPage(pg)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-bold border cursor-pointer ${userPage === pg ? "bg-green-500 text-white border-green-500" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}
                    >
                      {pg}
                    </button>
                  ))}
                  <button
                    onClick={() =>
                      setUserPage((p) =>
                        Math.min(
                          Math.ceil(applications.length / PAGE_SIZE),
                          p + 1,
                        ),
                      )
                    }
                    disabled={
                      userPage === Math.ceil(applications.length / PAGE_SIZE)
                    }
                    className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 cursor-pointer"
                  >
                    Next →
                  </button>
                </div>
              )}
            </div>
            <div className="col-span-1">
              <div className="p-4 sr-card rounded-2xl">
                <h3 className="text-xl font-bold">Application Status</h3>
                <p className="text-gray-500 text-sm">
                  Breakdown of your applications.
                </p>
                <h1 className="text-5xl font-bold my-5 text-center">
                  {applications.length}
                </h1>
                {[
                  ["Accepted", "bg-blue-800", "accepted"],
                  ["Pending", "bg-orange-500", "pending"],
                  ["Rejected", "bg-red-500", "rejected"],
                ].map(([label, color, s]) => (
                  <div
                    key={s}
                    className="flex justify-between items-center mb-2"
                  >
                    <div className="flex gap-1 items-center">
                      <div
                        className={`h-[10px] w-[10px] rounded-full ${color}`}
                      ></div>
                      <div>{label}</div>
                    </div>
                    <div>
                      {
                        applications.filter(
                          (a) => a.status?.toLowerCase() === s,
                        ).length
                      }
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      ) : (
        /* ══════════════════════════════════════════
            RECRUITER / ADMIN VIEW
        ══════════════════════════════════════════ */
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {arrayRecruiter.map((card, i) => (
              <div key={i} className="stat-card w-full">
                <div className="head flex justify-between items-center">
                  <div className="w-[40px] h-[40px] flex justify-center items-center rounded-2xl">
                    <img src={card.icon} alt={card.subTitle} />
                  </div>
                  <div
                    className="font-bold"
                    style={{ color: "var(--text-brand)" }}
                  >
                    {card.target}
                  </div>
                </div>
                <h5 className="" style={{ color: "var(--text-secondary)" }}>
                  {card.subTitle}
                </h5>
                <h5 className="mb-2 text-3xl font-bold tracking-tight">
                  {card.count}
                </h5>
              </div>
            ))}
          </div>

          {/* Applications Table */}
          <div className="mt-6">
            <div className="sr-card overflow-hidden">
              <div className="px-4 sm:px-6 pt-5 pb-3 flex justify-between items-center flex-wrap gap-2">
                <div>
                  <h3
                    className="font-bold text-lg"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Recent Applications
                  </h3>
                  <p
                    className="text-sm mt-0.5"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    All applicants who applied to your job postings.
                  </p>
                </div>
                <span
                  className="text-xs font-bold py-1 px-3 rounded-full"
                  style={{
                    background: "var(--bg-badge)",
                    color: "var(--text-brand)",
                  }}
                >
                  {applications.length} Total
                </span>
              </div>

              {loading ? (
                <div
                  className="py-12 text-center"
                  style={{ color: "var(--text-primary)" }}
                >
                  Loading applications...
                </div>
              ) : apiErrorMsg ? (
                <div className="py-8 text-center text-red-500 text-sm">
                  {apiErrorMsg}
                </div>
              ) : applications.length === 0 ? (
                <div className="py-12 text-center text-gray-400">
                  No applications yet.
                </div>
              ) : (
                <>
                {/* Table view — tablet & desktop */}
                <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead
                    className=""
                    style={{ background: "var(--gradient-brand)" }}
                  >
                    <tr>
                      {[
                        "Applicant",
                        "Position",
                        "Match Score",
                        "Status",
                        "Applied At",
                        "Actions",
                      ].map((h) => (
                        <th
                          key={h}
                          className="px-5 py-3 font-bold text-xs uppercase tracking-wide text-white"
                          
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {applications
                      .slice(
                        (recruiterPage - 1) * PAGE_SIZE,
                        recruiterPage * PAGE_SIZE,
                      )
                      .map((app) => (
                        <tr key={app.id} className="border-t transition-colors" style={{ borderColor: "var(--border-default)" }}>
                          {/* Applicant */}
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div
                                className="w-9 h-9 rounded-full flex items-center justify-center"
                                style={{ background: "var(--indigo-900)" }}
                              >
                                <img
                                  src={usericon}
                                  alt="user"
                                  className="w-5 h-5"
                                />
                              </div>
                              <div>
                                <div
                                  className="font-semibold text-sm cursor-pointer hover:text-(--text-brand) transition-colors"
                                  style={{ color: "var(--text-primary)" }}
                                  onClick={() => openDetails(app)}
                                >
                                  {app.applicantName || "View Details →"}
                                </div>
                                {app.applicantEmail && (
                                  <div
                                    className="text-xs"
                                    style={{ color: "var(--text-secondary)" }}
                                  >
                                    {app.applicantEmail}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Position */}
                          <td
                            className="px-5 py-4 font-medium"
                            style={{ color: "var(--text-brand)" }}
                          >
                            {app.jobTitle}
                          </td>

                          {/* Match Score */}
                          <td className="px-5 py-4">
                            <span className="bg-blue-50 text-blue-700 text-xs font-bold py-1 px-2 rounded-lg">
                              {app.matchScore !== null
                                ? `${app.matchScore}%`
                                : "N/A"}
                            </span>
                          </td>

                          {/* Status */}
                          <td className="px-5 py-4">
                            <span
                              className={`py-1 px-3 rounded-full text-xs font-bold ${getStatusStyle(app.status)}`}
                            >
                              {app.status}
                            </span>
                          </td>

                          {/* Applied At */}
                          <td className="px-5 py-4 text-gray-400 text-xs">
                            {app.createdAt
                              ? new Date(app.createdAt).toLocaleDateString()
                              : "N/A"}
                          </td>

                          {/* Accept / Reject */}
                          <td className="px-5 py-4">
                            <div className="flex gap-2 items-center">
                              {app.status?.toLowerCase() === "accepted" ? (
                                <span className="py-1.5 px-3 bg-green-100 text-green-700 text-xs font-bold rounded-lg">
                                  ✓ Accepted
                                </span>
                              ) : app.status?.toLowerCase() === "rejected" ? (
                                <span className="py-1.5 px-3 bg-red-100 text-red-600 text-xs font-bold rounded-lg">
                                  ✗ Rejected
                                </span>
                              ) : (
                                <>
                                  <button
                                    onClick={() => updateStatus(app.id, 1)}
                                    disabled={actionLoading === app.id}
                                    className="py-1.5 px-3 bg-green-500 hover:bg-green-600 text-white text-xs font-bold rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
                                  >
                                    {actionLoading === app.id
                                      ? "..."
                                      : "Accept"}
                                  </button>
                                  <button
                                    onClick={() => updateStatus(app.id, 2)}
                                    disabled={actionLoading === app.id}
                                    className="py-1.5 px-3 bg-red-100 hover:bg-red-200 text-red-600 text-xs font-bold rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
                                  >
                                    {actionLoading === app.id
                                      ? "..."
                                      : "Reject"}
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
                </div>

                {/* Card view — mobile */}
                <div className="md:hidden">
                  {applications
                    .slice(
                      (recruiterPage - 1) * PAGE_SIZE,
                      recruiterPage * PAGE_SIZE,
                    )
                    .map((app) => (
                      <div
                        key={app.id}
                        className="px-4 py-4 border-t flex flex-col gap-3"
                        style={{ borderColor: "var(--border-default)" }}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <div
                              className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                              style={{ background: "var(--indigo-900)" }}
                            >
                              <img src={usericon} alt="user" className="w-5 h-5" />
                            </div>
                            <div className="min-w-0">
                              <div
                                className="font-semibold text-sm cursor-pointer truncate"
                                style={{ color: "var(--text-primary)" }}
                                onClick={() => openDetails(app)}
                              >
                                {app.applicantName || "View Details →"}
                              </div>
                              {app.applicantEmail && (
                                <div
                                  className="text-xs truncate"
                                  style={{ color: "var(--text-secondary)" }}
                                >
                                  {app.applicantEmail}
                                </div>
                              )}
                            </div>
                          </div>
                          <span
                            className={`py-1 px-3 rounded-full text-xs font-bold flex-shrink-0 ${getStatusStyle(app.status)}`}
                          >
                            {app.status}
                          </span>
                        </div>

                        <div
                          className="text-sm font-medium"
                          style={{ color: "var(--text-brand)" }}
                        >
                          {app.jobTitle}
                        </div>

                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <span className="bg-blue-50 text-blue-700 text-xs font-bold py-1 px-2 rounded-lg">
                            {app.matchScore !== null
                              ? `${app.matchScore}%`
                              : "N/A"}
                          </span>
                          <span
                            className="text-xs text-gray-400"
                          >
                            {app.createdAt
                              ? new Date(app.createdAt).toLocaleDateString()
                              : "N/A"}
                          </span>
                        </div>

                        <div className="flex gap-2 items-center">
                          {app.status?.toLowerCase() === "accepted" ? (
                            <span className="py-1.5 px-3 bg-green-100 text-green-700 text-xs font-bold rounded-lg">
                              ✓ Accepted
                            </span>
                          ) : app.status?.toLowerCase() === "rejected" ? (
                            <span className="py-1.5 px-3 bg-red-100 text-red-600 text-xs font-bold rounded-lg">
                              ✗ Rejected
                            </span>
                          ) : (
                            <>
                              <button
                                onClick={() => updateStatus(app.id, 1)}
                                disabled={actionLoading === app.id}
                                className="flex-1 py-1.5 px-3 bg-green-500 hover:bg-green-600 text-white text-xs font-bold rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
                              >
                                {actionLoading === app.id ? "..." : "Accept"}
                              </button>
                              <button
                                onClick={() => updateStatus(app.id, 2)}
                                disabled={actionLoading === app.id}
                                className="flex-1 py-1.5 px-3 bg-red-100 hover:bg-red-200 text-red-600 text-xs font-bold rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
                              >
                                {actionLoading === app.id ? "..." : "Reject"}
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
                </>
              )}
              {/* Recruiter Pagination */}
              {Math.ceil(applications.length / PAGE_SIZE) > 1 && (
                <div className="flex justify-center items-center gap-2 py-4 border-t border-gray-100">
                  <button
                    onClick={() => setRecruiterPage((p) => Math.max(1, p - 1))}
                    disabled={recruiterPage === 1}
                    className="btn-outline"
                  >
                    ← Prev
                  </button>
                  {Array.from(
                    { length: Math.ceil(applications.length / PAGE_SIZE) },
                    (_, i) => i + 1,
                  ).map((pg) => (
                    <button
                      key={pg}
                      onClick={() => setRecruiterPage(pg)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-bold border cursor-pointer ${recruiterPage === pg ? "bg-blue-900 text-white border-blue-900" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}
                    >
                      {pg}
                    </button>
                  ))}
                  <button
                    onClick={() =>
                      setRecruiterPage((p) =>
                        Math.min(
                          Math.ceil(applications.length / PAGE_SIZE),
                          p + 1,
                        ),
                      )
                    }
                    disabled={
                      recruiterPage ===
                      Math.ceil(applications.length / PAGE_SIZE)
                    }
                    className="btn-outline"
                  >
                    Next →
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right side cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="p-4 rounded-2xl sr-card">
              <h3
                className="font-bold mb-2"
                style={{ color: "var(--text-primary)" }}
              >
                Profile Strength
              </h3>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                Complete Your Profile To Unlock better matches
              </p>
              <div className="w-full h-[4px] bg-gray-100 mt-5">
                <div
                  className="h-full"
                  style={{ width: "90%", background: "var(--gradient-brand)" }}
                ></div>
              </div>
              <div
                className="font-bold mt-1"
                style={{ color: "var(--text-brand)" }}
              >
                Analysis: 85%
              </div>
            </div>
            <div className="sr-card p-5 rounded-2xl">
              <div className="flex items-center gap-3 mb-2">
                <img src={email} alt="email" />
                <span className="text-lg font-bold">Job Alert</span>
              </div>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                Get instant notification for role matching your profile.
              </p>
            </div>
          </div>
        </>
      )}

      {/* ══════════════════════════════════════════
          DETAILS MODAL (Recruiter)
      ══════════════════════════════════════════ */}
      {detailsModal && (
        <div className="sr-modal-overlay">
          <div className="sr-modal max-w-md p-6">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-bold text-gray-900">
                Applicant Details
              </h2>
              <button
                onClick={() => setDetailsModal(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none cursor-pointer"
              >
                ×
              </button>
            </div>

            {detailsModal.loading ? (
              <div className="py-10 text-center text-gray-400">
                Loading details...
              </div>
            ) : (
              <>
                {/* Info Rows */}
                {[
                  [
                    "👤 Name",
                    detailsModal.details?.applicantName ||
                      detailsModal.app?.applicantName ||
                      "N/A",
                  ],
                  [
                    "📧 Email",
                    detailsModal.details?.email ||
                      detailsModal.app?.applicantEmail ||
                      "N/A",
                  ],
                  [
                    "💼 Position",
                    detailsModal.details?.jobTitle ||
                      detailsModal.app?.jobTitle ||
                      "N/A",
                  ],
                  [
                    "🎯 Match Score",
                    `${detailsModal.details?.matchScore ?? detailsModal.app?.matchScore ?? 0}%`,
                  ],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0"
                  >
                    <span className="text-gray-500 text-sm">{label}</span>
                    <span className="font-semibold text-gray-900 text-sm">
                      {value}
                    </span>
                  </div>
                ))}

                {/* Status */}
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-500 text-sm">📋 Status</span>
                  <span
                    className={`py-1 px-3 rounded-full text-xs font-bold ${getStatusStyle(detailsModal.details?.status || detailsModal.app?.status)}`}
                  >
                    {detailsModal.details?.status ||
                      detailsModal.app?.status ||
                      "Pending"}
                  </span>
                </div>

                {/* CV Link */}
                {(detailsModal.details?.cvFilePath ||
                  detailsModal.app?.cvFilePath) && (
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-gray-500 text-sm">📄 CV</span>
                    <a
                      href={
                        detailsModal.details?.cvFilePath ||
                        detailsModal.app?.cvFilePath
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:underline text-sm font-medium"
                    >
                      View CV →
                    </a>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 mt-5">
                  {(
                    detailsModal.details?.status || detailsModal.app?.status
                  )?.toLowerCase() !== "accepted" && (
                    <button
                      onClick={() => {
                        updateStatus(detailsModal.app.id, 1);
                      }}
                      disabled={actionLoading === detailsModal.app.id}
                      className="flex-1 py-2.5 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl text-sm transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      {actionLoading === detailsModal.app.id
                        ? "..."
                        : "✓ Accept"}
                    </button>
                  )}
                  {(
                    detailsModal.details?.status || detailsModal.app?.status
                  )?.toLowerCase() !== "rejected" && (
                    <button
                      onClick={() => {
                        updateStatus(detailsModal.app.id, 2);
                      }}
                      disabled={actionLoading === detailsModal.app.id}
                      className="flex-1 py-2.5 bg-red-100 hover:bg-red-200 text-red-600 font-bold rounded-xl text-sm transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      {actionLoading === detailsModal.app.id
                        ? "..."
                        : "✗ Reject"}
                    </button>
                  )}
                  <button
                    onClick={() => setDetailsModal(null)}
                    className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold rounded-xl text-sm transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default InfoDashboard;
