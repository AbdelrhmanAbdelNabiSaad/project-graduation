import hero from '../../assets/hero.svg';
import './Hero.css';
import { Link } from 'react-router-dom';

function Hero() {
  return (
    <div className="landing">
      <div className="max-w-screen-xl mx-auto px-4 py-16 flex flex-col lg:flex-row items-center justify-between gap-12 w-full">
        {/* Text */}
        <div className="flex-1 max-w-xl text-center lg:text-left animate-fade-in-up">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6"
            style={{ background: "var(--bg-badge)", color: "var(--text-brand)" }}>
            <span className="w-2 h-2 rounded-full inline-block" style={{ background: "var(--indigo-500)" }}></span>
            AI-Powered Recruitment Platform
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-5" style={{ color: "var(--text-primary)" }}>
            Smart Hiring
            <span className="block" style={{ background: "var(--gradient-brand)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Starts Here
            </span>
          </h1>

          <p className="text-lg mb-8" style={{ color: "var(--text-secondary)" }}>
            AI-powered recruitment platform that matches the right talent with the right job — faster, smarter, and bias-free.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
            <Link to="/register" className="btn-primary text-base px-7 py-3">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z"/>
              </svg>
              Get Started — Applicant
            </Link>
            <Link to="/register" className="btn-outline text-base px-7 py-3">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/>
              </svg>
              Post a Job — Companies
            </Link>
          </div>

          {/* Stats row */}
          <div className="flex flex-wrap gap-6 mt-10 justify-center lg:justify-start">
            {[["10K+", "Active Jobs"], ["50K+", "Candidates"], ["98%", "Match Rate"]].map(([num, label]) => (
              <div key={label} className="text-center">
                <div className="text-2xl font-extrabold" style={{ color: "var(--text-brand)" }}>{num}</div>
                <div className="text-xs font-medium mt-0.5" style={{ color: "var(--text-muted)" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Image */}
        <div className="flex-1 flex justify-center items-center max-w-lg w-full">
          <div className="relative">
            <div className="absolute inset-0 rounded-3xl blur-3xl opacity-20" style={{ background: "var(--gradient-brand)", transform: "scale(0.9) translateY(5%)" }}></div>
            <img src={hero} alt="Hero" className="relative w-full max-w-sm lg:max-w-md drop-shadow-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
