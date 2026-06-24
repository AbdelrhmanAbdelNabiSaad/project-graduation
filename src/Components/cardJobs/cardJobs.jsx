import { useState, useEffect } from "react";
import "./cardJobs.css";
import axios from "axios";
import company from "../../assets/tech.png";

const BASE = "https://jooobs.runasp.net";

function CardJobs() {
  const [loading, setLoading] = useState(false);
  const [applyLoading, setApplyLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [applyError, setApplyError] = useState("");
  const [applySuccess, setApplySuccess] = useState("");
  const [jobs, setJobs] = useState([]);
  const [apply, setApply] = useState(false);
  const [currentJob, setCurrentJob] = useState(null);
  const [selectedJobId, setSelectedJobId] = useState(null);

  const employmentTypeMap = {
    1: "Full-time", 2: "Part-time", 3: "Contract", 4: "Freelance", 5: "Internship",
  };

  const [formData, setFormData] = useState({
    fullName: "", email: "", phoneNumber: "",
    expectedSalary: "", portfolio: "", linkedin: "",
  });

  function openApply(jobId, job) {
    setApply(true);
    setCurrentJob(job);
    setSelectedJobId(jobId);
    setApplyError("");
    setApplySuccess("");
    setFormData({ fullName: "", email: "", phoneNumber: "", expectedSalary: "", portfolio: "", linkedin: "" });
  }

  function closeApply() {
    setApply(false);
    setCurrentJob(null);
  }

  function handleFormChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function getJobs() {
    setLoading(true);
    const token = localStorage.getItem("token");
    const userType = JSON.parse(localStorage.getItem("userType"));
    try {
      const response = await axios.get(`${BASE}/api/Jobs/search`, {
        params: { pageNumber: 1, pageSize: 50, OnlyPublished: userType === "recruiter" ? false : true },
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const jobsData = response?.data?.data || response?.data || [];
      const jobsList = Array.isArray(jobsData) ? jobsData : [];

      // جيب skills لكل job بـ Promise.all
      const jobsWithSkills = await Promise.all(
        jobsList.map(async (job) => {
          try {
            const skillsRes = await axios.get(`${BASE}/api/jobs/${job.id}/skills`, {
              headers: token ? { Authorization: `Bearer ${token}` } : {},
            });
            const skillsData = skillsRes?.data?.data || skillsRes?.data || [];
            return {
              ...job,
              requiredSkills: Array.isArray(skillsData)
                ? skillsData.map((s) => s.skillName || s.name || s)
                : [],
            };
          } catch {
            return job;
          }
        })
      );

      setJobs(jobsWithSkills);
    } catch (error) {
      setApiError(error.message);
    } finally {
      setLoading(false);
    }
  }



  async function handleApply(e) {
    e.preventDefault();
    setApplyLoading(true);
    setApplyError("");
    setApplySuccess("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setApplyError("You must be logged in to apply.");
        setApplyLoading(false);
        return;
      }

      await axios.post(
        `${BASE}/api/UserApplications/${selectedJobId}`,
        null,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setApplySuccess("Applied Successfully! 🎉");
      setTimeout(() => setApply(false), 1500);
    } catch (error) {
      const errData = error.response?.data;
      let msg = "Apply failed. Please try again.";
      if (typeof errData?.errors === "string") msg = errData.errors;
      else if (errData?.errors && typeof errData.errors === "object")
        msg = Object.values(errData.errors).flat().join(", ");
      else if (errData?.message) msg = errData.message;
      else if (errData?.title) msg = errData.title;
      setApplyError(msg);
    } finally {
      setApplyLoading(false);
    }
  }

  useEffect(() => { getJobs(); }, []);

  return (
    <>
      <div
        className="w-full p-5 min-h-screen"
        style={{ background: "var(--bg-secondary)" }}
      >
        <div className="title">
          <h1
            className="text-4xl font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            Find Your Next Role
          </h1>
          <p
            className="text-sm mt-2"
            style={{ color: "var(--text-secondary)" }}
          >
            We've found high-quality matches based on your profile preference
          </p>
        </div>
        <div className="mt-5">
          <div className="jobs flex justify-between items-center">
            <h3
              className="text-lg font-bold"
              style={{ color: "var(--text-secondary)" }}
            >
              Found {jobs.length} Jobs Based On Your Profile
            </h3>
            <button className="btn-ghost">Best Match</button>
          </div>

          {loading && (
            <div className="flex justify-center mt-5">
              <span className="loader"></span>
            </div>
          )}

          {apiError && (
            <div
              className="p-4 mt-4 mb-4 text-sm text-red-900 font-bold rounded-base bg-red-100"
              role="alert"
            >
              {apiError}
            </div>
          )}

          {jobs.map((job) => (
            <a
              key={job.id}
              href="#"
              className="job-card mt-5 flex flex-col p-6 md:flex-row md:max-w-full"
            >
              <img
                className="object-cover w-[70px] rounded-base h-[70px] mb-4 md:mb-0"
                src={company}
                alt="company"
              />
              <div className="flex flex-col justify-between md:p-4 leading-normal">
                <h5
                  className="text-xl font-bold"
                  style={{ color: "var(--text-primary)" }}
                >
                  {job.title}
                </h5>
                <p className="mb-3" style={{ color: "var(--text-secondary)" }}>
                  {job.description}
                </p>
                <div className="flex gap-3 items-center mb-4 flex-wrap">
                  <span
                    className="rounded-lg py-1 px-3 text-sm font-bold"
                    style={{
                      background: "var(--bg-badge)",
                      color: "var(--text-brand)",
                    }}
                  >
                    {employmentTypeMap[job.employmentType] ||
                      job.employmentType}
                  </span>
                  <span
                    className="py-1 px-3 rounded-lg text-sm font-bold"
                    style={{
                      background: "var(--bg-badge)",
                      color: "var(--text-brand)",
                    }}
                  >
                    Experience: {job.experienceLevel}
                  </span>
                  <span
                    className="py-1 px-3 rounded-lg text-sm font-bold"
                    style={{
                      background: "var(--bg-badge)",
                      color: "var(--text-brand)",
                    }}
                  >
                    ${job.minSalary ?? job.salary?.min} – $
                    {job.maxSalary ?? job.salary?.max}
                  </span>
                  {/* Skills من requiredSkills أو requirements */}
                  {Array.isArray(job.requiredSkills) &&
                  job.requiredSkills.length > 0
                    ? job.requiredSkills.map((skill, i) => (
                        <span
                          key={i}
                          className="py-1 px-3 rounded-lg text-sm font-bold"
                          style={{
                            background: "var(--bg-badge)",
                            color: "var(--text-brand)",
                          }}
                        >
                          {skill}
                        </span>
                      ))
                    : job.requirements
                      ? job.requirements.split(/[,،]/).map(
                          (s, i) =>
                            s.trim() && (
                              <span
                                key={i}
                                className="py-1 px-3 rounded-lg text-sm font-bold"
                                style={{
                                  background: "var(--bg-badge)",
                                  color: "var(--text-brand)",
                                }}
                              >
                                {s.trim()}
                              </span>
                            ),
                        )
                      : null}
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => openApply(job.id, job)}
                    className="inline-flex mr-3 items-center btn-primary duration-300  font-medium rounded-lg text-sm px-4 py-2.5"
                  >
                    Apply Now
                  </button>
                  <button
                    type="button"
                    className="inline-flex btn-outline items-center mt-2 md:mt-0 duration-300  font-medium rounded-lg text-sm px-4 py-2.5"
                  >
                    View Details
                    <svg
                      className="w-4 h-4 ms-1.5"
                      xmlns="http://www.w3.org/2000/svg"
                      width={24}
                      height={24}
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 12H5m14 0-4 4m4-4-4-4"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </a>
          ))}

          {/* Apply Modal — Full Form */}
          {apply && (
            <div className="sr-modal-overlay">
              <div className="sr-modal p-6 w-[95%] sm:w-[90%] md:w-[520px]">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-xl font-bold">
                    Apply For:
                    <span className="" style={{color: 'var(--text-brand)'}}> {currentJob?.title}</span>
                  </h2>
                  <button
                    onClick={closeApply}
                    className="text-gray-400 hover:text-gray-600 text-2xl leading-none cursor-pointer"
                  >
                    ×
                  </button>
                </div>
                <p className="text-gray-500 mb-4 text-sm">
                  {currentJob?.description}
                </p>

                {applyError && (
                  <div className="p-3 mb-4 text-red-900 bg-red-100 rounded-lg text-sm">
                    {applyError}
                  </div>
                )}
                {applySuccess && (
                  <div className="p-3 mb-4 text-green-900 bg-green-100 rounded-lg text-sm font-bold">
                    {applySuccess}
                  </div>
                )}

                <form onSubmit={handleApply} className="flex flex-col gap-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{color: 'var(--text-secondary)'}}>
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleFormChange}
                      placeholder="Enter your full name"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-green-500 duration-100"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{color: 'var(--text-secondary)'}}>
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleFormChange}
                      placeholder="Enter your email"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-green-500 duration-100"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{color: 'var(--text-secondary)'}}>
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="phoneNumber"
                      required
                      value={formData.phoneNumber}
                      onChange={handleFormChange}
                      placeholder="e.g. 01012345678"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-green-500 duration-100"
                    />
                  </div>

                  {/* Expected Salary */}
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{color: 'var(--text-secondary)'}}>
                      Expected Salary
                    </label>
                    <input
                      type="number"
                      name="expectedSalary"
                      value={formData.expectedSalary}
                      onChange={handleFormChange}
                      placeholder="e.g. 5000"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-green-500 duration-100"
                    />
                  </div>

                  {/* Portfolio */}
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{color: 'var(--text-secondary)'}}>
                      Portfolio URL
                    </label>
                    <input
                      type="url"
                      name="portfolio"
                      value={formData.portfolio}
                      onChange={handleFormChange}
                      placeholder="https://yourportfolio.com"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-green-500 duration-100"
                    />
                  </div>

                  {/* LinkedIn */}
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{color: 'var(--text-secondary)'}}>
                      LinkedIn URL
                    </label>
                    <input
                      type="url"
                      name="linkedin"
                      value={formData.linkedin}
                      onChange={handleFormChange}
                      placeholder="https://linkedin.com/in/yourname"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-green-500 duration-100"
                    />
                  </div>

                  <div className="flex gap-3 mt-2">
                    <button
                      type="submit"
                      disabled={applyLoading}
                      className="flex-1 py-3 px-6 btn-primary justify-center text-white font-bold hover:bg-green-600 rounded-lg duration-300 cursor-pointer disabled:opacity-60"
                    >
                      {applyLoading ? "Applying..." : "Submit Application"}
                    </button>
                    <button
                      onClick={closeApply}
                      type="button"
                      className="py-3 px-6 w-1/2 btn-ghost text-white font-bold  rounded-lg duration-300 cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default CardJobs;
