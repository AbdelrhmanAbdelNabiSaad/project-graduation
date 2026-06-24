import './Project.css';
import { Link } from 'react-router-dom';

function Project() {
  return (
    <section style={{ padding: "100px 1rem", background: "var(--bg-primay)" }}>
      <div className="max-w-4xl mx-auto text-center px-4">
        {/* Card */}
        <div className="relative overflow-hidden rounded-3xl p-12" style={{ background: "var(--gradient-brand)" }}>
          {/* decorative blobs */}
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10" style={{ background: "white", transform: "translate(30%, -30%)" }}></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-10" style={{ background: "white", transform: "translate(-30%, 30%)" }}></div>

          <div className="relative z-10">
            <p className="text-indigo-200 text-sm font-bold uppercase tracking-widest mb-4">Get Started Today</p>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-5 leading-tight">
              Ready to Find Your<br className="hidden sm:block" /> Perfect Match?
            </h2>
            <p className="text-indigo-100 text-lg mb-10 max-w-lg mx-auto">
              Whether you're a talented professional or a company looking for the best fit — SmartRecruit is your AI-powered solution.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="inline-flex items-center justify-center gap-2 px-8 py-4 font-bold rounded-full text-base transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5"
                style={{ background: "white", color: "var(--indigo-600)" }}>
                Get Started — Applicant
              </Link>
              <Link to="/register" className="inline-flex items-center justify-center gap-2 px-8 py-4 font-bold rounded-full text-base border-2 border-white/50 text-white transition-all duration-200 hover:bg-white/10">
                Post a Job — Companies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Project;
