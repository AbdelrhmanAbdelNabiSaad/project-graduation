import { useState, useEffect } from "react";
import "./MyApplication.css";
import axios from "axios";
import logoCompany from "../../assets/company-1.svg";

function MyApplication() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

    async function fetchApplications() {
    setLoading(true);
    setError("");
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get("https://jooobs.runasp.net/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const raw = res.data?.data || res.data || [];
      const list = Array.isArray(raw) ? raw : [];

      // جيب اسم الوظيفة لكل application من jobId
      const withTitles = await Promise.all(
        list.map(async (app) => {
          if (!app.jobId) return app;
          try {
            const jobRes = await axios.get(
              `https://jooobs.runasp.net/api/Jobs/${app.jobId}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            const jobTitle =
              jobRes.data?.data?.title ||
              jobRes.data?.title ||
              "N/A";
            return { ...app, jobTitle };
          } catch {
            return app;
          }
        })
      );

      setApplications(withTitles);
    } catch (e) {
      console.warn("fetchApplications error:", e?.response?.status, e?.response?.data);
      setError("Failed to load applications. Please try again.");
    } finally {
      setLoading(false);
    }
  }


  useEffect(() => {
    fetchApplications();
  }, []);

  // ✅ FIX: Search بيفلتر على اسم الشركة أو اسم الـ position
  const filtered = applications.filter(
    (app) =>
      (app.companyName || "").toLowerCase().includes(search.toLowerCase()) ||
      (app.jobTitle || app.position || "")
        .toLowerCase()
        .includes(search.toLowerCase()),
  );

  function getStatusStyle(status) {
    switch (status?.toLowerCase()) {
      case "accepted":
        return "bg-green-100 text-green-600";
      case "rejected":
        return "bg-red-100 text-red-600";
      case "pending":
        return "bg-yellow-100 text-yellow-600";
      case "interview":
        return "bg-blue-100 text-blue-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  }

  // ✅ Helper: جيب اسم الشركة من أي field
  function getCompanyName(app) {
    return app.companyName || app.company?.name || app.company || "N/A";
  }

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  function handleSearch(e) {
    setSearch(e.target.value);
    setCurrentPage(1);
  }

  return (
    <div className="container mx-auto mt-30 px-4">
      <div className="head flex justify-between items-center">
        <div className="text">
          <h1
            className="text-2xl font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            My Applications
          </h1>
          <p className="" style={{ color: "var(--text-secondary)" }}>
            Track and manage your job applications in one place. View AI
            insights and current status updates.
          </p>
        </div>
      </div>

      <input
        type="search"
        className="w-full py-2 px-3 border border-gray-200 rounded-lg my-5 focus:outline-none focus:border-green-500"
        placeholder="Search by job title or company..."
        value={search}
        onChange={handleSearch}
      />

      {loading && (
        <div className="flex justify-center my-10">
          <span className="loader"></span>
        </div>
      )}

      {error && (
        <div className="p-4 mb-4 text-red-900 bg-red-100 rounded-lg">
          {error}
        </div>
      )}

      <div className="my-5">
        <div className="relative overflow-x-auto sr-card shadow-xs rounded-2xl border border-gray-200">
          <table className="w-full text-sm text-lef">
            <thead
              className="text-sm  border-b border-t text-white"
              style={{
                background: "var(--gradient-brand)",
                borderTopColor: "var(--border-default)",
              }}
            >
              <tr>
                <th scope="col" className="px-6 py-3 font-bold">
                  Company Name
                </th>
                {/* ✅ عمود Position جديد */}
                <th scope="col" className="px-6 py-3 font-bold">
                  Position
                </th>
                <th scope="col" className="px-6 py-3 font-bold">
                  Match Score
                </th>
                <th scope="col" className="px-6 py-3 font-bold">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 font-bold">
                  Applied At
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && !loading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-10 text-center " style={{color: 'var(--text-secondary)'}}
                  >
                    No applications found.
                  </td>
                </tr>
              ) : (
                paginated.map((app, index) => (
                  <tr
                    key={app.id || index}
                    className="border-b " style={{borderBottomColor: 'var(--border-default)'}}
                  >
                    {/* ✅ FIX: اسم الشركة بيظهر صح */}
                    <th
                      scope="row"
                      className="flex items-center px-6 py-4 whitespace-nowrap"
                    >
                      <img
                        className="w-10 h-10 rounded-full"
                        src={logoCompany}
                        alt="company"
                      />
                      <div className="ps-3">
                        <div className="text-base font-bold">
                          {getCompanyName(app)}
                        </div>
                      </div>
                    </th>
                    {/* ✅ Position */}
                    <td className="px-6 py-4">
                      {app.jobTitle || app.position || "N/A"}
                    </td>
                    <td className="px-6 py-4 font-bold">
                      {app.matchScore !== undefined
                        ? `${app.matchScore}%`
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`py-1 px-3 rounded-2xl font-medium text-xs ${getStatusStyle(app.status)}`}
                      >
                        {app.status || "Pending"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400">
                      {app.createdAt || app.created
                        ? new Date(
                            app.createdAt || app.created,
                          ).toLocaleDateString()
                        : "N/A"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6 mb-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            ← Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1.5 rounded-lg text-sm font-bold border transition-colors cursor-pointer ${
                currentPage === page
                  ? "bg-green-500 text-white border-green-500"
                  : "border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}

export default MyApplication;
