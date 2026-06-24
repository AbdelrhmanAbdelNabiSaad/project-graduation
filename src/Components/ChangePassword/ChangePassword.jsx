import { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";
import "./ChangePassword.css";

const BASE_URL = "https://jooobs.runasp.net";

function ChangePassword({ onClose }) {
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const formik = useFormik({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: yup.object({
      currentPassword: yup.string().required("Current password is required"),
      newPassword: yup
        .string()
        .matches(
          /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
          "Password must be at least 8 chars, include uppercase, lowercase, number and special character"
        )
        .required("New password is required"),
      confirmPassword: yup
        .string()
        .oneOf([yup.ref("newPassword")], "Passwords do not match")
        .required("Please confirm your new password"),
    }),
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);
      setApiError("");
      setSuccessMsg("");

      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setApiError("You are not logged in. Please login first.");
          return;
        }

        await axios.post(`${BASE_URL}/api/Auth/change-password`, null, {
          params: {
            currentPassword: values.currentPassword,
            newPassword: values.newPassword,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setSuccessMsg("Password changed successfully.");
        resetForm();

        setTimeout(() => {
          onClose();
        }, 1500);
      } catch (error) {
        if (error.response?.status === 401) {
          setApiError("Current password is incorrect.");
        } else if (error.response?.status === 400) {
          setApiError(
            error.response?.data?.message ||
              "Invalid input or new password does not meet requirements."
          );
        } else {
          setApiError(
            error.response?.data?.message ||
              "Failed to change password. Please try again."
          );
        }
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Change Password
            </h2>
            <p className="text-sm text-gray-400 mt-0.5">
              Make sure your new password is strong and secure.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none cursor-pointer"
          >
            ×
          </button>
        </div>

        {apiError && (
          <div className="p-3 mb-4 text-red-900 bg-red-100 rounded-lg text-sm">
            {apiError}
          </div>
        )}
        {successMsg && (
          <div className="p-3 mb-4 text-green-900 bg-green-100 rounded-lg text-sm font-bold">
            {successMsg}
          </div>
        )}

        <form onSubmit={formik.handleSubmit}>
          {/* Current Password */}
          <div className="mb-4">
            <label className="block mb-1.5 text-sm font-bold text-gray-500">
              Current Password
            </label>
            <input
              type="password"
              name="currentPassword"
              value={formik.values.currentPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="border border-gray-200 text-black text-sm rounded-xl focus:border-green-500 block w-full px-3 py-2.5 outline-none"
              placeholder="Enter your current password"
            />
            {formik.touched.currentPassword &&
              formik.errors.currentPassword && (
                <p className="text-red-500 text-xs mt-1">
                  {formik.errors.currentPassword}
                </p>
              )}
          </div>

          {/* New Password */}
          <div className="mb-4">
            <label className="block mb-1.5 text-sm font-bold text-gray-500">
              New Password
            </label>
            <input
              type="password"
              name="newPassword"
              value={formik.values.newPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="border border-gray-200 text-black text-sm rounded-xl focus:border-green-500 block w-full px-3 py-2.5 outline-none"
              placeholder="Enter your new password"
            />
            {formik.touched.newPassword && formik.errors.newPassword && (
              <p className="text-red-500 text-xs mt-1">
                {formik.errors.newPassword}
              </p>
            )}
          </div>

          {/* Confirm New Password */}
          <div className="mb-4">
            <label className="block mb-1.5 text-sm font-bold text-gray-500">
              Confirm New Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="border border-gray-200 text-black text-sm rounded-xl focus:border-green-500 block w-full px-3 py-2.5 outline-none"
              placeholder="Re-enter your new password"
            />
            {formik.touched.confirmPassword &&
              formik.errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">
                  {formik.errors.confirmPassword}
                </p>
              )}
          </div>

          {/* Footer Buttons */}
          <div className="flex gap-3 mt-6 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-5 bg-gray-100 text-gray-700 text-sm font-bold rounded-lg hover:bg-gray-200 duration-300 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="py-2 px-6 bg-green-600 text-white text-sm font-bold rounded-lg hover:bg-green-700 duration-300 disabled:opacity-60 cursor-pointer"
            >
              {loading ? "Saving..." : "Save Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChangePassword;
