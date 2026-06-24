import './HowItWorks.css';
import upload from '../../assets/upload.png';
import ai from '../../assets/Ai.png';
import receive from '../../assets/receive.png';
import rank from "../../assets/rank.png";
import { useState } from 'react';

const tabs = ["For Applicants", "For Companies"];

const applicantSteps = [
  { icon: upload, num: "01", title: "Upload Your CV", desc: "Let our AI parse and understand your skills, experience, and expertise in seconds." },
  { icon: ai,     num: "02", title: "Get AI-Matched", desc: "Our platform scores and matches you to the best jobs based on your unique profile." },
  { icon: receive,num: "03", title: "Receive Offers", desc: "Connect with top companies that fit your profile and get hired faster." },
];

const companySteps = [
  { icon: ai,     num: "01", title: "Post a Job", desc: "Define your requirements and let our AI understand exactly what you're looking for." },
  { icon: rank,   num: "02", title: "AI Ranks Candidates", desc: "Our system automatically ranks applicants by how well they match your job." },
  { icon: receive,num: "03", title: "Hire the Best", desc: "Review top-ranked candidates and make data-driven hiring decisions confidently." },
];



function HowItWorks() {
  const [activeTab, setActiveTab] = useState(0);
  const steps = activeTab === 0 ? applicantSteps : companySteps;

  return (
    <section style={{ padding: "100px 0", background: "var(--bg-primary)" }}>
      <div className="max-w-screen-xl mx-auto px-4">
        {/* Heading */}
        <div className="text-center mb-12">
          <p className="section-label">Simple Process</p>
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle mx-auto">Three simple steps to transform your recruitment experience.</p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex p-1 rounded-2xl gap-1" style={{ background: "var(--bg-tertiary)" }}>
            {tabs.map((tab, i) => (
              <button
                key={i}
                onClick={() => setActiveTab(i)}
                className="px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
                style={activeTab === i
                  ? { background: "var(--gradient-brand)", color: "white", boxShadow: "var(--shadow-brand)" }
                  : { color: "var(--text-secondary)", background: "transparent" }
                }
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connector line on desktop */}
          <div className="hidden md:block absolute top-10 left-1/6 right-1/6 h-0.5" style={{ background: "var(--gradient-brand)", opacity: 0.3 }}></div>

          {steps.map((step, i) => (
            <div key={i} className="sr-card p-8 text-center relative">
              {/* Step number */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                style={{ background: "var(--gradient-brand)" }}>
                {i + 1}
              </div>

              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
                style={{ background: "var(--bg-badge)" }}>
                <img src={step.icon} alt={step.title} className="w-8 h-8 object-contain" />
              </div>

              <div className="text-3xl font-black mb-2" style={{ color: "var(--border-brand)", opacity: 0.5 }}>{step.num}</div>
              <h4 className="text-lg font-bold mb-3" style={{ color: "var(--text-primary)" }}>{step.title}</h4>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
