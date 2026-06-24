import { useState, useEffect } from "react";
import "./MyJobs.css";
import axios from "axios";
import JobSkillsManager from "../JobSkillsManager/JobSkillsManager";
import { useFormik } from "formik";
import * as yup from "yup";
import { Link } from "react-router-dom";

const BASE_URL = "https://jooobs.runasp.net";

function MyJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [publishingId, setPublishingId] = useState(null);
  const [msgMap, setMsgMap] = useState({});
  const [showSkillsManager, setShowSkillsManager] = useState(null);

  // ── Update Modal State ──
  const [editJob, setEditJob] = useState(null); // the job being edited
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState("");
  const [updateSuccess, setUpdateSuccess] = useState("");

  const token = localStorage.getItem("token");
  const companyId = localStorage.getItem("companyId") || localStorage.getItem("userId");

  // ── Update Form (Formik) ──
  const updateSchema = yup.object().shape({
    title: yup.string().required("Title is required"),
    description: yup.string().required("Description is required"),
    requirements: yup.string().required("Requirements are required"),
    experienceLevel: yup.number().required("Experience level is required").typeError("Must be a number"),
    employmentType: yup.number().required("Employment type is required").typeError("Must be a number"),
    minSalary: yup.number().required("Min salary is required").typeError("Must be a number"),
    maxSalary: yup.number().required("Max salary is required").typeError("Must be a number"),
  });

  const updateFormik = useFormik({
    initialValues: {
      title: "",
      description: "",
      requirements: "",
      experienceLevel: "",
      employmentType: "",
      minSalary: "",
      maxSalary: "",
    },
    validationSchema: updateSchema,
    enableReinitialize: true,
    onSubmit: handleUpdate,
  });

  function openEditModal(job) {
    setEditJob(job);
    setUpdateError("");
    setUpdateSuccess("");
    updateFormik.setValues({
      title: job.title || "",
      description: job.description || "",
      requirements: job.requirements || "",
      experienceLevel: job.experienceLevel || "",
      employmentType: job.employmentType || "",
      minSalary: job.minSalary || job.salary?.min || "",
      maxSalary: job.maxSalary || job.salary?.max || "",
    });
  }

  function closeEditModal() {
    setEditJob(null);
    setUpdateError("");
    setUpdateSuccess("");
    updateFormik.resetForm();
  }

  async function handleUpdate(values) {
    setUpdateLoading(true);
    setUpdateError("");
    setUpdateSuccess("");
    try {
      const payload = {
        jobId: editJob.id,
        title: values.title,
        description: values.description,
        requirements: values.requirements,
        experienceLevel: Number(values.experienceLevel),
        employmentType: Number(values.employmentType),
        minSalary: Number(values.minSalary),
        maxSalary: Number(values.maxSalary),
        companyId: companyId,
        expirationDate: editJob.expirationDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        isPublished: editJob.isPublished,
      };

      await axios.put(`${BASE_URL}/api/Jobs/${editJob.id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUpdateSuccess("Job updated successfully! ✅");
      // Update the job in local state immediately
      setJobs((prev) =>
        prev.map((j) =>
          j.id === editJob.id ? { ...j, ...payload } : j
        )
      );
      setTimeout(() => closeEditModal(), 1500);
    } catch (e) {
      const errData = e.response?.data;
      const msg =
        errData?.title ||
        errData?.message ||
        (typeof errData?.errors === "string" ? errData.errors : null) ||
        "Update failed. Please try again.";
      setUpdateError(msg);
    } finally {
      setUpdateLoading(false);
    }
  }

  async function fetchMyJobs() {
    try {
      setLoading(true);
      setError("");

      // ── جلب jobs من الـ API ──
      let apiJobs = [];
      try {
        const res = await axios.get(`${BASE_URL}/api/CompanyJobs`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { Page: 1, PageSize: 100 },
        });
        apiJobs = Array.isArray(res.data?.data) ? res.data.data : [];
      } catch (_) {}

      // ── جلب draft jobs من localStorage ──
      const localJobs = JSON.parse(localStorage.getItem("myDraftJobs") || "[]");

      // ── دمج: الـ API هي المصدر الأساسي، الـ local بس للي مش موجودة في الـ API ──
      const apiIds = new Set(apiJobs.map((j) => String(j.id)));
      const localOnly = localJobs.filter((j) => !apiIds.has(String(j.id)));
      const merged = [...apiJobs, ...localOnly];

      // لو الـ API رجعت jobs، امسح الـ local اللي موجودة في الـ API
      if (apiJobs.length > 0) {
        const remaining = localJobs.filter((j) => !apiIds.has(String(j.id)));
        localStorage.setItem("myDraftJobs", JSON.stringify(remaining));
      }

      setJobs(merged);
    } catch (e) {
      setError("Failed to load jobs. Please try again.");
    } finally {
      setLoading(false);
    }
  }



  async function handlePublish(jobId) {
    setPublishingId(jobId);
    setMsgMap((prev) => ({ ...prev, [jobId]: "" }));
    try {
      const res = await axios.post(
        `${BASE_URL}/api/Jobs/${jobId}/publish`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.status < 400) {
        setMsgMap((prev) => ({
          ...prev,
          [jobId]: { type: "success", text: "Published successfully! ✅" },
        }));
        // ✅ Keep the job visible — just update isPublished flag
        setJobs((prev) =>
          prev.map((j) => (j.id === jobId ? { ...j, isPublished: true } : j))
        );
        // امسح من localStorage لو كانت draft محلية
        const ljP = JSON.parse(localStorage.getItem("myDraftJobs") || "[]");
        localStorage.setItem("myDraftJobs", JSON.stringify(ljP.filter((j) => j.id !== jobId)));
      }
    } catch (e) {
      const msg =
        e.response?.data?.errors ||
        e.response?.data?.message ||
        "Publish failed.";
      if (msg.includes && msg.includes("at least one required skill")) {
        setMsgMap((prev) => ({
          ...prev,
          [jobId]: {
            type: "error",
            text: "⚠️ Add at least one skill before publishing. Click 'Add Skills' above.",
          },
        }));
      } else {
        setMsgMap((prev) => ({
          ...prev,
          [jobId]: { type: "error", text: msg },
        }));
      }
    } finally {
      setPublishingId(null);
    }
  }

  async function handleUnpublish(jobId) {
    setPublishingId(jobId);
    setMsgMap((prev) => ({ ...prev, [jobId]: "" }));
    try {
      const res = await axios.post(
        `${BASE_URL}/api/Jobs/${jobId}/unpublish`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.status < 400) {
        setMsgMap((prev) => ({
          ...prev,
          [jobId]: { type: "success", text: "Unpublished successfully." },
        }));
        setJobs((prev) =>
          prev.map((j) => (j.id === jobId ? { ...j, isPublished: false } : j))
        );
      }
    } catch (e) {
      const msg =
        e.response?.data?.errors ||
        e.response?.data?.message ||
        "Unpublish failed.";
      setMsgMap((prev) => ({
        ...prev,
        [jobId]: { type: "error", text: msg },
      }));
    } finally {
      setPublishingId(null);
    }
  }
  async function handleDelete(jobId) {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    try {
      await axios.delete(`${BASE_URL}/api/Jobs/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobs((prev) => prev.filter((j) => j.id !== jobId));
      const ljD = JSON.parse(localStorage.getItem("myDraftJobs") || "[]");
      localStorage.setItem("myDraftJobs", JSON.stringify(ljD.filter((j) => j.id !== jobId)));
    } catch (e) {
      alert("Delete failed. Please try again.");
    }
  }

  const employmentTypeMap = {
    1: "Full-time", 2: "Part-time", 3: "Contract", 4: "Freelance", 5: "Internship",
  };

  useEffect(() => {
    fetchMyJobs();
  }, []);

  return (
    <div className="ml-0 py-3 mt-20 md:mt-0 mr-0 md:mr-8 px-1 ms:px-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <div className="">
          <h1
            className="text-2xl font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            My Posted Jobs
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Manage your job postings — publish, unpublish, edit or delete
            anytime.
          </p>
        </div>
        <Link
          to="/createjob"
          className="mt-10 md:mt-0 py-2 px-4 text-white rounded-lg font-bold text-sm w-full md:w-fit text-center duration-300"
          style={{ background: "var(--gradient-brand)" }}
        >
          + Post New Job
        </Link>
      </div>

      {loading && (
        <div className="flex justify-center my-10 text-gray-400">
          Loading jobs...
        </div>
      )}
      {error && (
        <div className="p-4 mb-4 text-red-900 bg-red-100 rounded-lg">
          {error}
        </div>
      )}
      {!loading && jobs.length === 0 && !error && (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg">No jobs posted yet.</p>
          <a
            href="/createjob"
            className="mt-4 inline-block py-2 px-6 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 duration-300"
          >
            Post Your First Job
          </a>
        </div>
      )}

      <div className="flex flex-col gap-4">
        {jobs.map((job) => (
          <div key={job.id} className="sr-card rounded-2xl p-5 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <h2
                    className="text-lg font-bold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {job.title}
                  </h2>
                  <span
                    className={`badge-brand py-0.5 px-3 rounded-full text-xs font-bold `}
                  >
                    {job.isPublished ? "Published" : "Draft"}
                  </span>
                </div>
                <p
                  className="text-sm mb-3 line-clamp-2"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {job.description}
                </p>
                <div className="flex gap-2 flex-wrap">
                  <span className=" py-1 px-3 rounded-lg text-xs font-bold badge-accent">
                    {employmentTypeMap[job.employmentType] ||
                      job.employmentType}
                  </span>
                  <span className="badge-brand py-1 px-3 rounded-lg text-xs font-bold">
                    Exp: {job.experienceLevel} yrs
                  </span>
                  {(job.minSalary || job.salary?.min) && (
                    <span className="badge-brand py-1 px-3 rounded-lg text-xs font-bold">
                      ${job.minSalary || job.salary?.min} – $
                      {job.maxSalary || job.salary?.max}
                    </span>
                  )}
                </div>
                {msgMap[job.id] && (
                  <p
                    className={`mt-2 text-sm font-medium ${
                      msgMap[job.id].type === "success"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {msgMap[job.id].text}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 flex-wrap md:flex-col md:items-end">
                {/* Add Skills — always visible for drafts */}
                {!job.isPublished && (
                  <button
                    onClick={() => setShowSkillsManager(job.id)}
                    className="py-2 px-4  text-white text-sm font-bold rounded-lg duration-300 cursor-pointer"
                    style={{ background: "var(--gradient-brand)" }}
                  >
                    Add Skills
                  </button>
                )}

                {/* Update Button — always visible */}
                <button
                  onClick={() => openEditModal(job)}
                  className="py-2 px-4 text-white text-sm font-bold rounded-lg btn-outline duration-300 cursor-pointer"
                >
                  Update
                </button>

                {/* Publish / Unpublish */}
                {!job.isPublished ? (
                  <button
                    onClick={() => handlePublish(job.id)}
                    disabled={publishingId === job.id}
                    className="py-2 px-4 btn-accent text-white text-sm font-bold rounded-lg  duration-300 disabled:opacity-60 cursor-pointer"
                  >
                    {publishingId === job.id ? "Publishing..." : "Publish"}
                  </button>
                ) : (
                  <button
                    onClick={() => handleUnpublish(job.id)}
                    disabled={publishingId === job.id}
                    className="py-2 px-4 btn-ghost text-white text-sm font-bold rounded-lg hover:bg-yellow-600 duration-300 disabled:opacity-60 cursor-pointer"
                  >
                    {publishingId === job.id ? "Unpublishing..." : "Unpublish"}
                  </button>
                )}

                {/* Delete */}
                <button
                  onClick={() => handleDelete(job.id)}
                  className="py-2 px-4 btn-ghost text-sm font-bold rounded-lg hover:bg-red-200 duration-300 cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Skills Manager Modal */}
      {showSkillsManager && (
        <JobSkillsManager
          jobId={showSkillsManager}
          onSkillsAdded={() => fetchMyJobs()}
          onClose={() => setShowSkillsManager(null)}
        />
      )}

      {/* ── Update Job Modal ── */}
      {editJob && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="sr-card rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Update Job</h2>
                <p className="text-sm text-gray-400 mt-0.5">
                  Edit the details below and save changes.
                </p>
              </div>
              <button
                onClick={closeEditModal}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none cursor-pointer"
              >
                ×
              </button>
            </div>

            {updateError && (
              <div className="p-3 mb-4 text-red-900 bg-red-100 rounded-lg text-sm">
                {updateError}
              </div>
            )}
            {updateSuccess && (
              <div className="p-3 mb-4 text-green-900 bg-green-100 rounded-lg text-sm font-bold">
                {updateSuccess}
              </div>
            )}

            <form onSubmit={updateFormik.handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Title */}
                <div>
                  <label className="block mb-1.5 text-sm font-bold text-gray-500">
                    Position Name
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={updateFormik.values.title}
                    onChange={updateFormik.handleChange}
                    onBlur={updateFormik.handleBlur}
                    style={{ color: "var(--text-primary)" }}
                    className="border border-gray-200  text-sm rounded-xl focus:border-green-500 block w-full px-3 py-2.5 outline-none"
                    placeholder="e.g. Frontend Developer"
                  />
                  {updateFormik.touched.title && updateFormik.errors.title && (
                    <p className="text-red-500 text-xs mt-1">
                      {updateFormik.errors.title}
                    </p>
                  )}
                </div>

                {/* Experience Level */}
                <div>
                  <label className="block mb-1.5 text-sm font-bold text-gray-500">
                    Experience Level (years)
                  </label>
                  <input
                    type="number"
                    name="experienceLevel"
                    value={updateFormik.values.experienceLevel}
                    onChange={updateFormik.handleChange}
                    onBlur={updateFormik.handleBlur}
                    style={{ color: "var(--text-primary)" }}
                    className="border border-gray-200  text-sm rounded-xl  block w-full px-3 py-2.5 outline-none"
                    placeholder="e.g. 2"
                  />
                  {updateFormik.touched.experienceLevel &&
                    updateFormik.errors.experienceLevel && (
                      <p className="text-red-500 text-xs mt-1">
                        {updateFormik.errors.experienceLevel}
                      </p>
                    )}
                </div>
              </div>

              {/* Description */}
              <div className="mt-4">
                <label className="block mb-1.5 text-sm font-bold text-gray-500">
                  Job Description
                </label>
                <textarea
                  name="description"
                  rows="3"
                  value={updateFormik.values.description}
                  onChange={updateFormik.handleChange}
                  onBlur={updateFormik.handleBlur}
                  style={{ color: "var(--text-primary)" }}
                  className="border border-gray-200  text-sm rounded-xl block w-full px-3 py-2.5 outline-none"
                  placeholder="Describe the job role..."
                />
                {updateFormik.touched.description &&
                  updateFormik.errors.description && (
                    <p className="text-red-500 text-xs mt-1">
                      {updateFormik.errors.description}
                    </p>
                  )}
              </div>

              {/* Requirements */}
              <div className="mt-4">
                <label className="block mb-1.5 text-sm font-bold text-gray-500">
                  Requirements / Skills
                </label>
                <input
                  type="text"
                  name="requirements"
                  value={updateFormik.values.requirements}
                  onChange={updateFormik.handleChange}
                  onBlur={updateFormik.handleBlur}
                  style={{ color: "var(--text-primary)" }}
                  className="border border-gray-200  text-sm rounded-xl  block w-full px-3 py-2.5 outline-none"
                  placeholder="e.g. React, Node.js, SQL"
                />
                {updateFormik.touched.requirements &&
                  updateFormik.errors.requirements && (
                    <p className="text-red-500 text-xs mt-1">
                      {updateFormik.errors.requirements}
                    </p>
                  )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
                {/* Min Salary */}
                <div>
                  <label className="block mb-1.5 text-sm font-bold text-gray-500">
                    Minimum Salary
                  </label>
                  <input
                    type="number"
                    name="minSalary"
                    value={updateFormik.values.minSalary}
                    onChange={updateFormik.handleChange}
                    onBlur={updateFormik.handleBlur}
                    style={{ color: "var(--text-primary)" }}
                    className="border border-gray-200  text-sm rounded-xl  block w-full px-3 py-2.5 outline-none"
                    placeholder="e.g. 1000"
                  />
                  {updateFormik.touched.minSalary &&
                    updateFormik.errors.minSalary && (
                      <p className="text-red-500 text-xs mt-1">
                        {updateFormik.errors.minSalary}
                      </p>
                    )}
                </div>

                {/* Max Salary */}
                <div>
                  <label className="block mb-1.5 text-sm font-bold text-gray-500">
                    Maximum Salary
                  </label>
                  <input
                    type="number"
                    name="maxSalary"
                    value={updateFormik.values.maxSalary}
                    onChange={updateFormik.handleChange}
                    onBlur={updateFormik.handleBlur}
                    style={{ color: "var(--text-primary)" }}
                    className="border border-gray-200  text-sm rounded-xl  block w-full px-3 py-2.5 outline-none"
                    placeholder="e.g. 5000"
                  />
                  {updateFormik.touched.maxSalary &&
                    updateFormik.errors.maxSalary && (
                      <p className="text-red-500 text-xs mt-1">
                        {updateFormik.errors.maxSalary}
                      </p>
                    )}
                </div>
              </div>

              {/* Employment Type */}
              <div className="mt-4">
                <label className="block mb-1.5 text-sm font-bold text-gray-500">
                  Employment Type
                </label>
                <select
                  name="employmentType"
                  value={updateFormik.values.employmentType}
                  onChange={updateFormik.handleChange}
                  onBlur={updateFormik.handleBlur}
                  className="border mt-0  border-gray-200 text-sm rounded-xl block w-full px-3 py-2.5 outline-none"
                >
                  <option value="" style={{ color: "var(--text-brand)" }}>
                    Select Type
                  </option>
                  <option value="1" style={{ color: "var(--text-brand)" }}>
                    Full-time
                  </option>
                  <option value="2" style={{ color: "var(--text-brand)" }}>
                    Part-time
                  </option>
                  <option value="3" style={{ color: "var(--text-brand)" }}>
                    Contract
                  </option>
                  <option value="4" style={{ color: "var(--text-brand)" }}>
                    Freelance
                  </option>
                  <option value="5" style={{ color: "var(--text-brand)" }}>
                    Internship
                  </option>
                </select>
                {updateFormik.touched.employmentType &&
                  updateFormik.errors.employmentType && (
                    <p className="text-red-500 text-xs mt-1">
                      {updateFormik.errors.employmentType}
                    </p>
                  )}
              </div>

              {/* Footer Buttons */}
              <div className="flex gap-3 mt-6 justify-end">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="py-2 px-5 btn-ghost bg-gray-100 text-gray-700 text-sm font-bold rounded-lg hover:bg-gray-200 duration-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateLoading}
                  className="py-2 px-6 btn-accent bg-purple-600 text-white text-sm font-bold rounded-lg hover:bg-purple-700 duration-300 disabled:opacity-60 cursor-pointer"
                >
                  {updateLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyJobs;
