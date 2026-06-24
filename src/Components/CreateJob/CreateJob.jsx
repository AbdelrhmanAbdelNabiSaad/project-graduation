import { useState } from "react";
import "./CreateJob.css";
import { useFormik } from "formik";
import axios from "axios";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";

function CreateJob() {
  const navigate = useNavigate();
  const [apiError, setApiError] = useState("");
  const [success, setSuccess] = useState("");
  const [statusMsg, setStatusMsg] = useState("");

  const validationSchema = yup.object().shape({
    companyId: yup.string().required("Company ID is required"),
    title: yup.string().required("Please enter position name"),
    description: yup.string().required("Please enter job description"),
    requirements: yup.string().required("Please enter requirements"),
    experienceLevel: yup
      .number()
      .required("Please enter experience level")
      .typeError("Must be a number"),
    employmentType: yup
      .number()
      .required("Please select employment type")
      .typeError("Must be a number"),
    minSalary: yup
      .number()
      .required("Please enter minimum salary")
      .typeError("Must be a number"),
    maxSalary: yup
      .number()
      .required("Please enter maximum salary")
      .typeError("Must be a number"),
  });

  const formik = useFormik({
    initialValues: {
      companyId:
        localStorage.getItem("companyId") ||
        localStorage.getItem("userId") ||
        "",
      title: "",
      description: "",
      requirements: "",
      employmentType: "",
      experienceLevel: "",
      minSalary: "",
      maxSalary: "",
    },
    validationSchema,
    onSubmit: handleSubmit,
  });

  async function handleSubmit(formValue) {
    try {
      setApiError("");
      setSuccess("");
      setStatusMsg("");
      const token = localStorage.getItem("token");

      const jobData = {
        companyId: formValue.companyId,
        title: formValue.title,
        description: formValue.description,
        requirements: formValue.requirements,
        employmentType: Number(formValue.employmentType),
        experienceLevel: Number(formValue.experienceLevel),
        minSalary: Number(formValue.minSalary),
        maxSalary: Number(formValue.maxSalary),
        expirationDate: new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000,
        ).toISOString(),
        isPublished: false,
      };

      // ── Step 1: Create Job (as Draft) ──
      setStatusMsg("Creating job...");
      const createRes = await axios.post(
        "https://jooobs.runasp.net/api/Jobs",
        jobData,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (!createRes.data?.isSuccess) {
        setApiError(createRes.data?.message || "Job creation failed.");
        setStatusMsg("");
        return;
      }

      // ✅ حفظ الـ job في localStorage عشان تظهر في MyJobs فوراً
      const jobId = createRes.data?.data?.id || createRes.data?.data;
      const newJob = {
        id: jobId || Date.now().toString(),
        ...jobData,
        salary: { min: jobData.minSalary, max: jobData.maxSalary },
        isPublished: false,
        isExpired: false,
        requiredSkills: [],
      };
      const savedJobs = JSON.parse(localStorage.getItem("myDraftJobs") || "[]");
      // تجنب التكرار
      const exists = savedJobs.find((j) => j.id === newJob.id);
      if (!exists) {
        savedJobs.push(newJob);
        localStorage.setItem("myDraftJobs", JSON.stringify(savedJobs));
      }

      setSuccess("✅ Job created as draft! Go to 'My Jobs' to add skills and publish it.");
      setStatusMsg("");
      formik.resetForm();
      setTimeout(() => navigate("/myjobs"), 2500);
    } catch (error) {
      setStatusMsg("");
      setApiError(
        error?.response?.data?.title ||
          error?.response?.data?.message ||
          "Failed to post job. Please try again.",
      );
    }
  }

  return (
    <div className="ml-0 py-3 mt-20  mr-0 md:mr-8">
      {apiError && (
        <div className="p-4 mb-4 text-red-900 bg-red-100 rounded-lg">
          {apiError}
        </div>
      )}
      {success && (
        <div className="p-4 mb-4 text-green-900 bg-green-100 rounded-lg font-bold">
          {success}
        </div>
      )}
      {statusMsg && (
        <div className="p-3 mb-4 text-blue-800 bg-blue-50 rounded-lg text-sm flex items-center gap-2">
          <svg
            className="animate-spin h-4 w-4 text-blue-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8z"
            ></path>
          </svg>
          {statusMsg}
        </div>
      )}

      <form className="w-full mx-auto" onSubmit={formik.handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="mb-5 w-full">
            <label
              htmlFor="title"
              className="block mb-2.5 text-sm font-bold"
              style={{ color: "var(--text-secondary)" }}
            >
              Position Name:
            </label>
            <input
              type="text"
              id="title"
              name="title"
              className="border text-sm rounded-xl focus:border-green-500 block w-full px-3 py-2.5 outline-none"
              placeholder="e.g. Frontend Developer"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.title && formik.errors.title && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.title}</p>
            )}
          </div>
          <div className="mb-5 w-full">
            <label
              htmlFor="experienceLevel"
              className="block mb-2.5 text-sm font-bold"
              style={{ color: "var(--text-secondary)" }}
            >
              Experience Level (number):
            </label>
            <input
              type="number"
              id="experienceLevel"
              name="experienceLevel"
              className="border border-gray-200 text-black text-sm rounded-xl focus:border-green-500 block w-full px-3 py-2.5 outline-none"
              placeholder="e.g. 2 (years)"
              value={formik.values.experienceLevel}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.experienceLevel &&
              formik.errors.experienceLevel && (
                <p className="text-red-500 text-xs mt-1">
                  {formik.errors.experienceLevel}
                </p>
              )}
          </div>
        </div>

        <div className="w-full mb-5">
          <label
            htmlFor="description"
            className="block mb-2.5 text-sm font-bold "
            style={{ color: "var(--text-secondary)" }}
          >
            Job Description:
          </label>
          <textarea
            id="description"
            name="description"
            rows="4"
            className="border border-gray-200 text-black text-sm rounded-xl focus:border-green-500 block w-full px-3 py-2.5 outline-none"
            placeholder="Describe the job role..."
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.description && formik.errors.description && (
            <p className="text-red-500 text-xs mt-1">
              {formik.errors.description}
            </p>
          )}
        </div>

        <div className="w-full mb-5">
          <label
            htmlFor="requirements"
            className="block mb-2.5 text-sm font-bold "
            style={{ color: "var(--text-secondary)" }}
          >
            Requirements:
          </label>
          <input
            type="text"
            id="requirements"
            name="requirements"
            className="border border-gray-200 text-black text-sm rounded-xl focus:border-green-500 block w-full px-3 py-2.5 outline-none"
            placeholder="e.g. React, Node.js, SQL"
            value={formik.values.requirements}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.requirements && formik.errors.requirements && (
            <p className="text-red-500 text-xs mt-1">
              {formik.errors.requirements}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="mb-5 w-full">
            <label
              htmlFor="minSalary"
              className="block mb-2.5 text-sm font-bold "
              style={{ color: "var(--text-secondary)" }}
            >
              Minimum Salary:
            </label>
            <input
              type="number"
              id="minSalary"
              name="minSalary"
              className="border border-gray-200 text-black text-sm rounded-xl focus:border-green-500 block w-full px-3 py-2.5 outline-none"
              placeholder="e.g. 1000"
              value={formik.values.minSalary}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.minSalary && formik.errors.minSalary && (
              <p className="text-red-500 text-xs mt-1">
                {formik.errors.minSalary}
              </p>
            )}
          </div>
          <div className="mb-5 w-full">
            <label
              htmlFor="maxSalary"
              className="block mb-2.5 text-sm font-bold "
              style={{ color: "var(--text-secondary)" }}
            >
              Maximum Salary:
            </label>
            <input
              type="number"
              id="maxSalary"
              name="maxSalary"
              className="border border-gray-200 text-black text-sm rounded-xl focus:border-green-500 block w-full px-3 py-2.5 outline-none"
              placeholder="e.g. 5000"
              value={formik.values.maxSalary}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.maxSalary && formik.errors.maxSalary && (
              <p className="text-red-500 text-xs mt-1">
                {formik.errors.maxSalary}
              </p>
            )}
          </div>
        </div>

        <div className="mb-5 w-full">
          <label
            htmlFor="employmentType"
            className="block mb-2.5 text-sm font-bold"
            style={{ color: "var(--text-secondary)" }}
          >
            Employment Type:
          </label>
          <select
            id="employmentType"
            name="employmentType"
            className="border text-sm rounded-xl block w-full px-3 py-2.5 outline-none"
            value={formik.values.employmentType}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          >
            <option value="" className="text-gray-600">
              Select Type
            </option>
            <option value="1" className="text-gray-600">
              Full-time
            </option>
            <option value="2" className="text-gray-600">
              Part-time
            </option>
            <option value="3" className="text-gray-600">
              Contract
            </option>
            <option value="4" className="text-gray-600">
              Freelance
            </option>
            <option value="5" className="text-gray-600">
              Internship
            </option>
          </select>
          {formik.touched.employmentType && formik.errors.employmentType && (
            <p className="text-red-500 text-xs mt-1">
              {formik.errors.employmentType}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={formik.isSubmitting}
          className="my-5 py-2 px-6 btn-primary rounded-lg text-white font-bold hover:cursor-pointer duration-300 hover:bg-green-700 disabled:opacity-60"
        >
          {formik.isSubmitting ? "Creating..." : "Create Job Draft"}
        </button>
      </form>
    </div>
  );
}

export default CreateJob;