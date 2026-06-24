import { useState, useEffect } from "react";
import axios from "axios";
import usericon from "../../assets/user-icon.svg";
import logoCompany from "../../assets/company-1.svg";

const BASE = "https://jooobs.runasp.net";

// ─── Recruiter View ───────────────────────────────────────────────────────────
function RecruiterCandidates({ token }) {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 8;
  const [detailsModal, setDetailsModal] = useState(null);

  async function fetchAcceptedCandidates() {
    setLoading(true);
    setError("");
    try {
      const jobsRes = await axios.get(`${BASE}/api/CompanyJobs`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { Page: 1, PageSize: 100 },
      });
      const myJobs = Array.isArray(jobsRes.data?.data) ? jobsRes.data.data : [];
      if (myJobs.length === 0) { setCandidates([]); setLoading(false); return; }

      const allAccepted = [];
      for (const job of myJobs) {
        try {
          const appsRes = await axios.get(`${BASE}/api/JobApplications`, {
            headers: { Authorization: `Bearer ${token}` },
            params: { jobId: job.id, page: 1, pageSize: 100 },
          });
          const raw = appsRes.data?.data || [];
          if (Array.isArray(raw)) {
            raw
              .filter((a) => a.status?.toLowerCase() === "accepted")
              .forEach((a) =>
                allAccepted.push({
                  id: a.id,
                  jobId: a.jobId || job.id,
                  jobTitle: a.jobTitle || job.title || "N/A",
                  applicantName: a.applicantName || null,
                  applicantEmail: a.email || a.applicantEmail || null,
                  matchScore: a.matchScore ?? 0,
                  createdAt: a.created || a.createdAt || null,
                })
              );
          }
        } catch (_) {}
      }
      setCandidates(allAccepted);
    } catch (e) {
      setError("Could not load candidates. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function openDetails(candidate) {
    setDetailsModal({ candidate, details: null, loading: true });
    try {
      const res = await axios.get(`${BASE}/api/JobApplications/${candidate.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const d = res.data?.data || {};
      setDetailsModal({
        candidate,
        details: {
          applicantName: d.applicantName || candidate.applicantName || "N/A",
          email: d.email || candidate.applicantEmail || "N/A",
          jobTitle: d.jobTitle || candidate.jobTitle || "N/A",
          matchScore: d.matchScore ?? candidate.matchScore ?? 0,
        },
        loading: false,
      });
    } catch {
      setDetailsModal((prev) => ({ ...prev, loading: false }));
    }
  }

  useEffect(() => { fetchAcceptedCandidates(); }, []);

  const filtered = candidates.filter(
    (c) =>
      (c.applicantName || "").toLowerCase().includes(search.toLowerCase()) ||
      (c.applicantEmail || "").toLowerCase().includes(search.toLowerCase()) ||
      (c.jobTitle || "").toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold " style={{color: 'var(--text-primary)'}}>Candidates</h1>
        <p className="text-sm mt-1" style={{color: 'var(--text-secondary)'}}>
          All applicants you accepted across your job postings.
        </p>
      </div>

      {/* Stats */}
      <div className=" rounded-2xl border shadow-xs p-4 mb-6 flex items-center gap-4 flex-wrap" style={{borderColor: 'var(--border-default)'}}>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="text-sm font-semibold text-gray-700">
            {candidates.length} Accepted Candidate
            {candidates.length !== 1 ? "s" : ""}
          </span>
        </div>
        {candidates.length > 0 && (
          <span className="text-xs text-gray-400">
            across {[...new Set(candidates.map((c) => c.jobId))].length} job
            {[...new Set(candidates.map((c) => c.jobId))].length !== 1
              ? "s"
              : ""}
          </span>
        )}
      </div>

      {/* Search */}
      <input
        type="search"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setCurrentPage(1);
        }}
        placeholder="Search by name, email, or position..."
        className="w-full py-2.5 px-4 border border-gray-200 rounded-xl mb-5 text-sm focus:outline-none focus:border-green-400"
      />

      {error && (
        <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-xl text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-gray-100 py-16 text-center">
          <div className="text-4xl mb-3">👥</div>
          <p className="text-gray-500 font-medium">
            No accepted candidates yet.
          </p>
          <p className="text-gray-400 text-sm mt-1">
            Accept applicants from the dashboard to see them here.
          </p>
        </div>
      ) : (
        <>
          {/* Table view — tablet & desktop */}
          <div className="hidden md:block rounded-2xl border shadow-xs overflow-hidden" style={{borderColor: 'var(--border-default)'}}>
            <table className="w-full text-sm text-left">
              <thead
                className=""
                style={{ background: "var(--gradient-brand)" }}
              >
                <tr>
                  <th
                    className="px-5 py-3 font-bold text-xs uppercase tracking-wide w-2/5 text-white"
                  >
                    Candidate
                  </th>
                  <th
                    className="px-5 py-3 font-bold text-xs uppercase tracking-wide w-1/4 text-white"
                  >
                    Position
                  </th>
                  <th
                    className="px-5 py-3 font-bold text-xs uppercase tracking-wide w-1/6 text-white"
                  >
                    Match Score
                  </th>
                  <th
                    className="px-5 py-3 font-bold text-xs uppercase tracking-wide w-1/6 text-white"
                  >
                    Accepted At
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((c) => (
                  <tr
                    key={c.id}
                    className="border-t  transition-colors" style={{borderTopColor: 'var(--border-default)'}}
                  >
                    {/* Candidate */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ background: "var(--indigo-900)" }}
                        >
                          <img src={usericon} alt="user" className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <div
                            className="font-semibold text-sm cursor-pointer truncate transition-colors"
                            style={{ color: "var(--text-primary)" }}
                            onClick={() => openDetails(c)}
                          >
                            {c.applicantName || "View Details →"}
                          </div>
                          {c.applicantEmail && (
                            <div className="text-xs text-gray-400 mt-0.5 truncate">
                              {c.applicantEmail}
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
                      {c.jobTitle}
                    </td>
                    {/* Match Score */}
                    <td className="px-5 py-4">
                      <span className="bg-green-50 text-blue-700 text-xs font-bold py-1 px-3 rounded-lg">
                        {c.matchScore !== null ? `${c.matchScore}%` : "N/A"}
                      </span>
                    </td>
                    {/* Accepted At */}
                    <td className="px-5 py-4 text-gray-400 text-xs">
                      {c.createdAt
                        ? new Date(c.createdAt).toLocaleDateString()
                        : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Card view — mobile */}
          <div className="md:hidden rounded-2xl border shadow-xs overflow-hidden" style={{borderColor: 'var(--border-default)'}}>
            {paginated.map((c) => (
              <div
                key={c.id}
                className="px-4 py-4 border-t first:border-t-0 flex flex-col gap-3"
                style={{ borderColor: "var(--border-default)" }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: "var(--indigo-900)" }}
                  >
                    <img src={usericon} alt="user" className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div
                      className="font-semibold text-sm cursor-pointer truncate transition-colors"
                      style={{ color: "var(--text-primary)" }}
                      onClick={() => openDetails(c)}
                    >
                      {c.applicantName || "View Details →"}
                    </div>
                    {c.applicantEmail && (
                      <div className="text-xs text-gray-400 truncate">
                        {c.applicantEmail}
                      </div>
                    )}
                  </div>
                </div>

                <div
                  className="text-sm font-medium"
                  style={{ color: "var(--text-brand)" }}
                >
                  {c.jobTitle}
                </div>

                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="bg-green-50 text-blue-700 text-xs font-bold py-1 px-3 rounded-lg">
                    {c.matchScore !== null ? `${c.matchScore}%` : "N/A"}
                  </span>
                  <span className="text-gray-400 text-xs">
                    {c.createdAt
                      ? new Date(c.createdAt).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-5">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 cursor-pointer"
              >
                ← Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                <button
                  key={pg}
                  onClick={() => setCurrentPage(pg)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-bold border cursor-pointer ${currentPage === pg ? "bg-green-500 text-white border-green-500" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}
                >
                  {pg}
                </button>
              ))}
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 cursor-pointer"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}

      {/* Details Modal */}
      {detailsModal && (
        <div className="fixed inset-0  flex items-center justify-center z-50 p-4">
          <div className="rounded-2xl shadow-xl w-full max-w-md p-6 sr-card">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-bold" style={{color: 'var(--text-primary)'}}>
                Candidate Details
              </h2>
              <button
                onClick={() => setDetailsModal(null)}
                className="btn-outline text-2xl leading-none cursor-pointer"
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
                <div className="flex justify-center mb-5">
                  <span className="badge-brand text-xs font-bold py-1.5 px-4 rounded-full">
                    ✓ Accepted
                  </span>
                </div>
                {[
                  [
                    "👤 Name",
                    detailsModal.details?.applicantName ||
                      detailsModal.candidate?.applicantName ||
                      "N/A",
                  ],
                  [
                    "📧 Email",
                    detailsModal.details?.email ||
                      detailsModal.candidate?.applicantEmail ||
                      "N/A",
                  ],
                  [
                    "💼 Position",
                    detailsModal.details?.jobTitle ||
                      detailsModal.candidate?.jobTitle ||
                      "N/A",
                  ],
                  [
                    "🎯 Match Score",
                    `${detailsModal.details?.matchScore ?? detailsModal.candidate?.matchScore ?? 0}%`,
                  ],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="flex justify-between items-center py-3 border-b last:border-0" style={{borderBottomColor: 'var(--border-default)'}}
                  >
                    <span className="text-sm" style={{color: 'var(--text-secondary)'}}>{label}</span>
                    <span className="font-semibold text-sm" style={{color: 'var(--text-primary)'}}>
                      {value}
                    </span>
                  </div>
                ))}
                <button
                  onClick={() => setDetailsModal(null)}
                  className="w-full mx-auto text-center mt-5 py-2.5 btn-ghost font-bold rounded-xl text-sm transition-colors cursor-pointer" 
                >
                  Close
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

// ─── User/Applicant View ──────────────────────────────────────────────────────
function AcceptedOffers({ token }) {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 6;

  async function fetchAcceptedOffers() {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`${BASE}/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const raw = Array.isArray(res.data?.data) ? res.data.data : [];
      const acceptedRaw = raw.filter((a) => a.status?.toLowerCase() === "accepted");

      const detailed = await Promise.all(
        acceptedRaw.map(async (a) => {
          try {
            const detailRes = await axios.get(`${BASE}/api/UserApplications/${a.id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            const d = detailRes.data?.data || {};
            return {
              id: a.id,
              jobId: d.jobId || a.jobId || null,
              jobTitle: d.jobTitle || "N/A",
              companyName: a.companyName || "N/A",
              matchScore: d.matchScore ?? a.matchScore ?? 0,
              acceptedAt: a.created || null,
            };
          } catch {
            return {
              id: a.id,
              jobId: a.jobId || null,
              jobTitle: "N/A",
              companyName: a.companyName || "N/A",
              matchScore: a.matchScore ?? 0,
              acceptedAt: a.created || null,
            };
          }
        })
      );
      setOffers(detailed);
    } catch (e) {
      setError("Could not load your accepted offers. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchAcceptedOffers(); }, []);

  const filtered = offers.filter(
    (o) =>
      (o.companyName || "").toLowerCase().includes(search.toLowerCase()) ||
      (o.jobTitle || "").toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Accepted Offers</h1>
        <p className="text-gray-400 text-sm mt-1">Companies that accepted your applications.</p>
      </div>

      {/* Stats */}
      <div className=" rounded-2xl border border-gray-100 shadow-xs p-4 mb-6 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="text-sm font-semibold text-gray-700">
            {offers.length} Accepted Offer{offers.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Search */}
      <input
        type="search"
        value={search}
        onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
        placeholder="Search by company or job title..."
        className="w-full py-2.5 px-4 border border-gray-200 rounded-xl mb-5 text-sm focus:outline-none focus:border-green-400"
      />

      {error && <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-xl text-sm">{error}</div>}

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-gray-100 py-16 text-center">
          <div className="text-4xl mb-3">🏢</div>
          <p className="text-gray-500 font-medium">No accepted offers yet.</p>
          <p className="text-gray-400 text-sm mt-1">Keep applying! Accepted offers will appear here.</p>
        </div>
      ) : (
        <>
          {/* Cards - 2 columns on md, 3 on lg */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {paginated.map((o) => (
              <div
                key={o.id}
                className="rounded-2xl border border-gray-100 shadow-xs p-6 flex flex-col gap-4 hover:shadow-md hover:border-green-100 transition-all"
              >
                {/* Company Header */}
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center flex-shrink-0">
                    <img src={logoCompany} alt="company" className="w-8 h-8 object-contain" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-gray-900 text-base truncate">{o.companyName}</div>
                    <div className="text-sm text-gray-500 truncate">{o.jobTitle}</div>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-50"></div>

                {/* Stats Row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="bg-green-50 text-green-700 text-xs font-bold py-1.5 px-3 rounded-lg">
                      🎯 {o.matchScore}% Match
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">
                    {o.acceptedAt ? new Date(o.acceptedAt).toLocaleDateString() : "N/A"}
                  </span>
                </div>

                {/* Accepted Badge */}
                <div className="flex items-center gap-2 bg-green-50 rounded-xl px-3 py-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-xs font-semibold text-green-700">Accepted</span>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 cursor-pointer">← Prev</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                <button key={pg} onClick={() => setCurrentPage(pg)} className={`px-3 py-1.5 rounded-lg text-sm font-bold border cursor-pointer ${currentPage === pg ? "bg-green-500 text-white border-green-500" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}>{pg}</button>
              ))}
              <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 cursor-pointer">Next →</button>
            </div>
          )}
        </>
      )}
    </>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
function Candidates() {
  const token = localStorage.getItem("token");
  const userType = JSON.parse(localStorage.getItem("userType"));
  const isApplicant = userType === "applicant";

  return (
    <div className="w-full mt-15 md:mt-0">
      {isApplicant ? (
        <AcceptedOffers token={token} />
      ) : (
        <RecruiterCandidates token={token} />
      )}
    </div>
  );
}

export default Candidates;
