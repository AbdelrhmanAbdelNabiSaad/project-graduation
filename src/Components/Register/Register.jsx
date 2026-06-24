import { useState, useEffect } from "react";
import "./Register.css";
import heroSign from "../../assets/hero-form.svg";
import iconRecuit from "../../assets/icon-recurite.svg";
import iconUser from "../../assets/user-icon.svg";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from 'yup';
import axios from "axios";
import { useTheme } from "../../context/ThemeContext";

function Register() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [userType, setUserType] = useState(JSON.parse(localStorage.getItem('userType')) || "applicant");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => { localStorage.setItem('userType', JSON.stringify(userType)); }, [userType]);

  const schemaApplicant = yup.object().shape({
    firstName: yup.string().required('Required'),
    lastName: yup.string().required('Required'),
    email: yup.string().email('Invalid email').required('Required'),
    password: yup.string().matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, 'Min 8 chars, uppercase, lowercase, number & special char').required('Required'),
    confirmPassword: yup.string().oneOf([yup.ref('password')], 'Passwords must match').required('Required'),
    bio: yup.string().required('Required'),
    phoneNumber: yup.string().matches(/^[01][0125][0-9]{8}$/, 'Invalid Egyptian phone').required('Required'),
  });

  const schemaRecuiter = yup.object().shape({
    userName: yup.string().required("Required"),
    email: yup.string().email("Invalid email").required("Required"),
    industry: yup.string().required("Required"),
    country: yup.string().required("Required"),
    city: yup.string().required("Required"),
    street: yup.string().required("Required"),
    buildingNumber: yup.string().required("Required"),
    postalCode: yup.string().required("Required"),
    description: yup.string().required("Required"),
    password: yup.string().matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, 'Min 8 chars, uppercase, lowercase, number & special char').required('Required'),
    confirmPassword: yup.string().oneOf([yup.ref("password")], "Passwords must match").required("Required"),
  });

  const formik = useFormik({
    initialValues: userType === "applicant"
      ? { firstName: "", lastName: "", email: "", password: "", confirmPassword: "", bio: "", phoneNumber: "" }
      : { userName: "", email: "", industry: "", country: "", city: "", street: "", buildingNumber: "", postalCode: "", description: "", password: "", confirmPassword: "" },
    onSubmit: handleSubmit,
    validationSchema: userType === "applicant" ? schemaApplicant : schemaRecuiter,
    enableReinitialize: true,
  });

  async function handleSubmit(dataValues) {
    try {
      setLoading(true); setMsg('');
      if (userType === 'applicant') {
        const res = await axios.post("https://jooobs.runasp.net/api/User/register", dataValues);
        const d = res.data.data;
        localStorage.setItem('token', d.accessToken);
        localStorage.setItem('refreshToken', d.refreshToken);
        localStorage.setItem('userId', d.userId);
        navigate('/login');
      } else {
        const res = await axios.post('https://jooobs.runasp.net/api/Companies/register', dataValues);
        const d = res.data.data;
        localStorage.setItem("token", d.accessToken);
        localStorage.setItem("refreshToken", d.refreshToken);
        localStorage.setItem("companyId", d.userId);
        navigate('/login');
      }
    } catch (error) {
      setMsg(error.response?.data?.message || error.response?.data?.data?.message || "Something went wrong.");
    } finally { setLoading(false); }
  }

  // Field helper
  const Field = ({ id, label, type = "text", placeholder }) => (
    <div>
      <label htmlFor={id} className="form-label">{label}</label>
      <input type={type} id={id} name={id}
        value={formik.values[id] || ""} onChange={formik.handleChange} onBlur={formik.handleBlur}
        className="sr-input" placeholder={placeholder} />
      {formik.touched[id] && formik.errors[id] && (
        <p className="form-error">{formik.errors[id]}</p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col lg:flex-row" style={{ background: "var(--bg-secondary)" }}>
      {/* Theme toggle */}
      <button onClick={toggleTheme} className="theme-toggle fixed top-4 right-4 z-50">
        {theme === "dark"
          ? <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
          : <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
        }
      </button>

      {/* Left panel */}
      <div className="hidden lg:flex flex-1 auth-hero-panel m-4 rounded-3xl">
        <div className="relative z-10 flex flex-col items-center justify-center text-center p-12">
          <img src={heroSign} alt="" className="w-64 mb-8 drop-shadow-xl" />
          <h1 className="text-4xl font-extrabold text-white mb-4">Intelligence meets Talent</h1>
          <p className="text-indigo-100 text-lg max-w-sm">Join thousands of companies and candidates transforming recruitment with AI.</p>
        </div>
      </div>

      {/* Right panel - scrollable form */}
      <div className="flex-1 flex items-start justify-center p-4 lg:p-8 overflow-y-auto">
        <div className="auth-form-card w-full my-8">
          <div className="flex justify-center mb-6">
            <Link to="/" className="text-2xl font-extrabold" style={{ color: "var(--text-primary)" }}>
              Smart<span style={{ color: "var(--text-brand)" }}>Recruit</span>
            </Link>
          </div>

          <h2 className="text-2xl font-bold text-center mb-1" style={{ color: "var(--text-primary)" }}>Create your account</h2>
          <p className="text-center text-sm mb-5" style={{ color: "var(--text-secondary)" }}>Join the future of recruitment</p>

          {/* Tabs */}
          <div className="flex mb-5 border-b" style={{ borderColor: "var(--border-default)" }}>
            <Link to="/login" className="flex-1 text-center py-3 text-sm font-medium border-b-2 border-transparent" style={{ color: "var(--text-secondary)" }}>Login</Link>
            <Link to="/register" className="flex-1 text-center py-3 text-sm font-bold border-b-2" style={{ borderColor: "var(--indigo-500)", color: "var(--text-brand)" }}>Register</Link>
          </div>

          {msg && (
            <div className="p-4 mb-5 rounded-xl text-sm" style={{ background: "rgba(220,38,38,0.1)", color: "var(--text-danger)", border: "1px solid rgba(220,38,38,0.2)" }}>
              {msg}
            </div>
          )}

          {/* User type selector */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {[
              { type: "applicant", icon: iconUser, label: "I'm an Applicant" },
              { type: "recuiter", icon: iconRecuit, label: "I'm a Recruiter" },
            ].map(({ type, icon, label }) => (
              <button key={type} type="button" onClick={() => setUserType(type)}
                className="flex flex-col items-center gap-2 py-4 px-3 rounded-2xl border-2 transition-all duration-200 text-sm font-semibold"
                style={userType === type
                  ? { borderColor: "var(--indigo-500)", background: "var(--bg-badge)", color: "var(--text-brand)" }
                  : { borderColor: "var(--border-default)", background: "var(--bg-card)", color: "var(--text-secondary)" }
                }>
                <img src={icon} className="w-8 h-8" alt="" />
                {label}
              </button>
            ))}
          </div>

          <form onSubmit={formik.handleSubmit} className="space-y-4">
            {userType === "applicant" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field id="firstName" label="First Name" placeholder="John" />
                <Field id="lastName" label="Last Name" placeholder="Doe" />
                <Field id="email" label="Email" type="email" placeholder="you@example.com" />
                <Field id="phoneNumber" label="Phone Number" placeholder="01XXXXXXXXX" />
                <div className="sm:col-span-2"><Field id="bio" label="Bio" placeholder="Tell us about yourself..." /></div>
                <Field id="password" label="Password" type="password" placeholder="••••••••" />
                <Field id="confirmPassword" label="Confirm Password" type="password" placeholder="••••••••" />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field id="userName" label="Company Name" placeholder="Acme Inc." />
                <Field id="email" label="Email" type="email" placeholder="hr@company.com" />
                <Field id="industry" label="Industry" placeholder="Technology" />
                <Field id="country" label="Country" placeholder="Egypt" />
                <Field id="city" label="City" placeholder="Cairo" />
                <Field id="street" label="Street" placeholder="123 Main St" />
                <Field id="buildingNumber" label="Building Number" placeholder="5" />
                <Field id="postalCode" label="Postal Code" placeholder="12345" />
                <div className="sm:col-span-2"><Field id="description" label="Company Description" placeholder="What does your company do?" /></div>
                <Field id="password" label="Password" type="password" placeholder="••••••••" />
                <Field id="confirmPassword" label="Confirm Password" type="password" placeholder="••••••••" />
              </div>
            )}

            <button type="submit" className="btn-primary w-full justify-center py-3 text-base rounded-xl mt-2" disabled={loading}>
              {loading
                ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Creating account...</>
                : "Create Account"
              }
            </button>
          </form>

          <p className="text-center text-sm mt-5" style={{ color: "var(--text-secondary)" }}>
            Already have an account?{" "}
            <Link to="/login" className="font-bold" style={{ color: "var(--text-brand)" }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
