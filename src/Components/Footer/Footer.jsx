import './Footer.css';

function Footer() {
  return (
    <div style={{ background: "var(--bg-secondary)", borderTop: "1px solid var(--border-default)" }}>
      <div className="max-w-screen-xl mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>© 2025 SmartRecruit. All rights reserved.</p>
        <div className="flex gap-5">
          {["Privacy Policy", "Terms of Service"].map(item => (
            <a key={item} href="#" className="text-sm transition-colors duration-200"
              style={{ color: "var(--text-muted)" }}
              onMouseEnter={e => e.target.style.color = "var(--text-brand)"}
              onMouseLeave={e => e.target.style.color = "var(--text-muted)"}
            >{item}</a>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Footer;
