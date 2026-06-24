import "./Features.css";
import parsing from "../../assets/parsing.png";
import match from "../../assets/matching.png";
import rank from "../../assets/rank.png";
import analytic from "../../assets/analytics.png";

const features = [
  { icon: parsing, title: "AI CV Parsing", desc: "Automatically extract and analyze key information from any resume format with high accuracy.", color: "var(--indigo-500)" },
  { icon: match,   title: "Smart Job Matching", desc: "Our algorithm provides a score to show how well a candidate fits a role — no more guessing.", color: "var(--brand-600)" },
  { icon: rank,    title: "Candidate Ranking", desc: "Instantly see the most qualified candidates ranked for each job opening by AI score.", color: "#8b5cf6" },
  { icon: analytic,title: "Analytics Dashboard", desc: "Track recruitment metrics and gain insights with powerful real-time analytics.", color: "#0ea5e9" },
];

function Features() {
  return (
    <section style={{ background: "var(--bg-secondary)", padding: "100px 0" }}>
      <div className="max-w-screen-xl mx-auto px-4">
        {/* Heading */}
        <div className="text-center mb-14">
          <p className="section-label">What We Offer</p>
          <h2 className="section-title">Powerful AI Features</h2>
          <p className="section-subtitle mx-auto">
            Everything you need to streamline your hiring process and find the best candidates faster.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <div key={i} className="feature-card text-center md:text-start" style={{ animationDelay: `${i * 0.1}s` }}>
              <div
                className="w-14 h-14 mx-auto md:mx-0  rounded-2xl flex items-center justify-center mb-5"
                style={{ background: `${f.color}18` }}
              >
                <img src={f.icon} alt={f.title} className="w-8 h-8  object-contain" />
              </div>
              <h5 className="text-lg font-bold mb-3" style={{ color: "var(--text-primary)" }}>{f.title}</h5>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;
