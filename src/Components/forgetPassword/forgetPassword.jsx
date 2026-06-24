import { useState } from "react";
import "./forgetPassword.css";
import heroSign from "../../assets/hero-form.svg";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";

const BASE_URL = "https://jooobs.runasp.net";

function ForgetPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: email, 2: reset, 3: success
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [emailSent, setEmailSent] = useState("");

  // ─── Step 1: Forgot Password ────────────────────────────────────────────────
  const step1Formik = useFormik({
    initialValues: { email: "" },
    validationSchema: yup.object({
      email: yup
        .string()
        .email("Please enter a valid email")
        .required("Email is required"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      setApiError("");
      try {
        await axios.post(`${BASE_URL}/api/Auth/forgot-password`, {
          email: values.email,
        });
        setEmailSent(values.email);
        setStep(2);
      } catch (err) {
        setApiError(
          err?.response?.data?.message ||
            "Something went wrong. Please try again."
        );
      } finally {
        setLoading(false);
      }
    },
  });

  // ─── Step 2: Reset Password ──────────────────────────────────────────────────
  const step2Formik = useFormik({
    initialValues: { token: "", newPassword: "", confirmPassword: "" },
    validationSchema: yup.object({
      token: yup.string().required("Reset token is required"),
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
        .required("Please confirm your password"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      setApiError("");
      try {
        await axios.post(`${BASE_URL}/api/Auth/reset-password`, {
          email: emailSent,
          token: values.token,
          newPassword: values.newPassword,
        });
        setStep(3);
      } catch (err) {
        setApiError(
          err?.response?.data?.message ||
            "Invalid or expired token. Please try again."
        );
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="register mx-auto h-screen flex">
      {/* Left image */}
      <div
        className="content  w-1/2 text-center flex flex-col justify-center items-center relative"
        style={{ background: "var(--gradient-brand)" }}
      >
        <div className="image">
          <img src={heroSign} alt="" />
        </div>
        <h1 className="text-4xl font-bold">Intelligence meets Talent</h1>
        <p className="text-gray-100 my-3">
          Our AI-driven platform connects the right candidates with the right
          opportunities in milliseconds. Secure, unbiased, and efficient.
        </p>
      </div>

      {/* Right form */}
      <div className="flex flex-col items-center py-10 w-1/2 overflow-y-scroll">
        <h2 className="text-3xl text-shadow-slate-950 font-bold">
          Smart Hiring Starts Here
        </h2>
        <p className="mt-2 text-gray-500">
          Welcome To The Future Of Recruitment
        </p>

        <ul className="mt-4 flex justify-center gap-5 relative">
          <li>
            <Link
              to="/login"
              className="py-3 px-5 block border-b-2  font-bold"
              style={{
                color: "var(--text-brand)",
                borderBottomColor: "var(--text-brand)",
              }}
            >
              Login
            </Link>
          </li>
          <li>
            <Link to="/register" className="py-3 px-5 block">
              Register
            </Link>
          </li>
        </ul>

        {apiError && (
          <div
            className="p-4 mb-2 mt-4 text-red-900 rounded-lg bg-red-100"
            style={{ width: "80%" }}
            role="alert"
          >
            {apiError}
          </div>
        )}

        {/* STEP 1 */}
        {step === 1 && (
          <form
            className="flex flex-col items-center w-full"
            onSubmit={step1Formik.handleSubmit}
          >
            <p
              className="mt-6 mb-2 text-gray-500 text-sm"
              style={{ width: "80%" }}
            >
              Enter your email address and we will send you a reset token.
            </p>

            <div className="mt-2" style={{ width: "80%" }}>
              <label
                htmlFor="email"
                className="block mb-2.5 text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={step1Formik.values.email}
                onChange={step1Formik.handleChange}
                onBlur={step1Formik.handleBlur}
                className="border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-500 focus:border-3 block w-full px-3 py-2.5 shadow-xs placeholder:text-gray-500 duration-100"
                placeholder="Enter Your Email Address"
              />
              {step1Formik.touched.email && step1Formik.errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {step1Formik.errors.email}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="py-3 px-5 mt-5 btn-primary justify-center rounded-xl text-white font-bold text-lg hover:cursor-pointer hover:bg-green-700 duration-300 disabled:opacity-60"
              style={{ width: "50%" }}
            >
              {loading ? "Sending..." : "Send Reset Token"}
            </button>

            <p className="mt-5 text-gray-500">
              Back to{" "}
              <Link
                to="/login"
                className="font-bold"
                style={{ color: "var(--text-brand)" }}
              >
                Login
              </Link>
            </p>
          </form>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <form
            className="flex flex-col items-center w-full"
            onSubmit={step2Formik.handleSubmit}
          >
            <div
              className="p-4 mb-2 mt-4 text-green-800 bg-green-50 border border-green-200 rounded-lg text-sm"
              style={{ width: "80%" }}
            >
              A reset token was sent to <strong>{emailSent}</strong>. Check your
              inbox.
            </div>

            <div className="mt-3" style={{ width: "80%" }}>
              <label
                htmlFor="token"
                className="block mb-2.5 text-sm font-medium text-gray-700"
              >
                Reset Token
              </label>
              <input
                type="text"
                id="token"
                name="token"
                value={step2Formik.values.token}
                onChange={step2Formik.handleChange}
                onBlur={step2Formik.handleBlur}
                className="border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-500 focus:border-3 block w-full px-3 py-2.5 shadow-xs placeholder:text-gray-500 duration-100"
                placeholder="Paste your reset token here"
              />
              {step2Formik.touched.token && step2Formik.errors.token && (
                <p className="text-red-500 text-xs mt-1">
                  {step2Formik.errors.token}
                </p>
              )}
            </div>

            <div className="mt-3" style={{ width: "80%" }}>
              <label
                htmlFor="newPassword"
                className="block mb-2.5 text-sm font-medium text-gray-700"
              >
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={step2Formik.values.newPassword}
                onChange={step2Formik.handleChange}
                onBlur={step2Formik.handleBlur}
                className="border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-500 focus:border-3 block w-full px-3 py-2.5 shadow-xs placeholder:text-gray-500 duration-100"
                placeholder="Enter new password"
              />
              {step2Formik.touched.newPassword &&
                step2Formik.errors.newPassword && (
                  <p className="text-red-500 text-xs mt-1">
                    {step2Formik.errors.newPassword}
                  </p>
                )}
            </div>

            <div className="mt-3" style={{ width: "80%" }}>
              <label
                htmlFor="confirmPassword"
                className="block mb-2.5 text-sm font-medium text-gray-700"
              >
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={step2Formik.values.confirmPassword}
                onChange={step2Formik.handleChange}
                onBlur={step2Formik.handleBlur}
                className="border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-500 focus:border-3 block w-full px-3 py-2.5 shadow-xs placeholder:text-gray-500 duration-100"
                placeholder="Confirm new password"
              />
              {step2Formik.touched.confirmPassword &&
                step2Formik.errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">
                    {step2Formik.errors.confirmPassword}
                  </p>
                )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="py-3 px-5 mt-5 bg-green-600 rounded-xl text-white font-bold text-lg hover:cursor-pointer hover:bg-green-700 duration-300 disabled:opacity-60"
              style={{ width: "50%" }}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep(1);
                setApiError("");
              }}
              className="mt-3 text-sm text-gray-500 hover:text-green-600 duration-200 cursor-pointer"
            >
              Resend token
            </button>
          </form>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div
            className="flex flex-col items-center mt-10 text-center"
            style={{ width: "80%" }}
          >
            <div className="text-6xl mb-4">✅</div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">
              Password Reset Successfully!
            </h3>
            <p className="text-gray-500 mb-6">
              Your password has been updated. You can now log in with your new
              password.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="py-3 px-8 bg-green-600 rounded-xl text-white font-bold text-lg hover:bg-green-700 duration-300 cursor-pointer"
            >
              Go to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ForgetPassword;
