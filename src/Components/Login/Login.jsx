import { useState } from "react";
import "./Login.css";
import heroSign from "../../assets/hero-form.svg";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from 'yup';
import axios from "axios";
import { useTheme } from "../../context/ThemeContext";

function Login() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  let [loading, setLoading] = useState(false);
  let [apiError, setApiError] = useState('');

  const validationSchema = yup.object().shape({
    email: yup.string().email('Please enter a valid email').required('Email is required'),
    password: yup.string()
      .matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        'Min 8 chars, uppercase, lowercase, number & special character')
      .required('Password is required'),
  });

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    onSubmit: handleSubmit,
    validationSchema,
  });

  async function handleSubmit(dataValues) {
    try {
      setLoading(true);
      setApiError('');
      const res = await axios.post(`https://jooobs.runasp.net/api/Auth/login`, dataValues);
      if (res.data.isSuccess) {
        const userData = res.data.data;
        localStorage.setItem("token", userData.accessToken);
        localStorage.setItem("refreshToken", userData.refreshToken);
        localStorage.setItem("userId", userData.userId);
        const role = userData.role || userData.userType || userData.roles?.[0] || '';
        const isRecruiter = ['Company', 'Recruiter', 'company', 'recruiter'].includes(role);
        if (isRecruiter) {
          localStorage.setItem("companyId", userData.userId);
          localStorage.setItem("userType", JSON.stringify("recruiter"));
        } else {
          localStorage.removeItem("companyId");
          localStorage.setItem("userType", JSON.stringify("applicant"));
        }
        navigate('/jobs');
      } else {
        setApiError(res.data?.message || 'Invalid email or password');
      }
    } catch (error) {
      setApiError(error.response?.data?.message || error.response?.data?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex" style={{ background: "var(--bg-secondary)" }}>
      {/* Theme toggle top right */}
      <button onClick={toggleTheme} className="theme-toggle fixed top-4 right-4 z-50">
        {theme === "dark"
          ? <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
          : <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
        }
      </button>

      {/* Left panel - hero (hidden on mobile) */}
      <div className="hidden lg:flex flex-1 auth-hero-panel m-4 rounded-3xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col items-center justify-center text-center p-12">
          <img src={heroSign} alt="" className="w-64 mb-8 drop-shadow-xl" />
          <h1 className="text-4xl font-extrabold text-white mb-4">Intelligence meets Talent</h1>
          <p className="text-indigo-100 text-lg max-w-sm">
            Our AI-driven platform connects the right candidates with the right opportunities in milliseconds.
          </p>
          <div className="flex gap-6 mt-10">
            {[["10K+", "Jobs"], ["50K+", "Candidates"], ["98%", "Match Rate"]].map(([n, l]) => (
              <div key={l} className="text-center">
                <div className="text-2xl font-extrabold text-white">{n}</div>
                <div className="text-indigo-200 text-xs mt-0.5">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center p-4 lg:p-8">
        <div className="auth-form-card w-full">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-2xl font-extrabold" style={{ color: "var(--text-primary)" }}>
                Smart<span style={{ color: "var(--text-brand)" }}>Recruit</span>
              </span>
            </Link>
          </div>

          <h2 className="text-2xl font-bold text-center mb-1" style={{ color: "var(--text-primary)" }}>Welcome back</h2>
          <p className="text-center text-sm mb-6" style={{ color: "var(--text-secondary)" }}>Sign in to your account to continue</p>

          {/* Tabs */}
          <div className="flex mb-6 border-b" style={{ borderColor: "var(--border-default)" }}>
            <Link to="/login" className="flex-1 text-center py-3 text-sm font-bold border-b-2 transition-colors duration-200"
              style={{ borderColor: "var(--indigo-500)", color: "var(--text-brand)" }}>Login</Link>
            <Link to="/register" className="flex-1 text-center py-3 text-sm font-medium transition-colors duration-200 border-b-2 border-transparent"
              style={{ color: "var(--text-secondary)" }}>Register</Link>
          </div>

          {apiError && (
            <div className="p-4 mb-5 rounded-xl text-sm flex items-center gap-2"
              style={{ background: "rgba(220,38,38,0.1)", color: "var(--text-danger)", border: "1px solid rgba(220,38,38,0.2)" }}>
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="flex-shrink-0">
                <circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>
              </svg>
              {apiError}
            </div>
          )}

          <form onSubmit={formik.handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="form-label">Email Address</label>
              <input type="email" id="email" name="email"
                value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur}
                className="sr-input" placeholder="you@example.com" />
              {formik.touched.email && formik.errors.email && (
                <p className="form-error">{formik.errors.email}</p>
              )}
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="form-label mb-0">Password</label>
                <Link to="/forgetPassword" className="text-xs font-semibold" style={{ color: "var(--text-brand)" }}>Forgot password?</Link>
              </div>
              <input type="password" id="password" name="password"
                value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur}
                className="sr-input" placeholder="Your password" />
              {formik.touched.password && formik.errors.password && (
                <p className="form-error">{formik.errors.password}</p>
              )}
            </div>

            <button type="submit" className="btn-primary w-full justify-center py-3 text-base rounded-xl" disabled={loading}>
              {loading
                ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Signing in...</>
                : "Sign In"
              }
            </button>
          </form>

          <p className="text-center text-sm mt-6" style={{ color: "var(--text-secondary)" }}>
            Don't have an account?{" "}
            <Link to="/register" className="font-bold" style={{ color: "var(--text-brand)" }}>Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
