import './FooterInfo.css';
import logo from '../../assets/logo.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faLinkedin, faTwitter } from "@fortawesome/free-brands-svg-icons";

function FooterInfo() {
  return (
    <footer className="sr-footer" id="contact">
      <div className="max-w-screen-xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="sm:col-span-2">
            <a href="/" className="flex items-center gap-2 mb-4">
              <img src={logo} alt="Logo" className="w-8 h-8" />
              <span
                className="text-lg font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                Smart<span style={{ color: "var(--text-brand)" }}>Recruit</span>
              </span>
            </a>
            <p
              className="text-sm leading-relaxed mb-6 max-w-xs"
              style={{ color: "var(--text-secondary)" }}
            >
              The future of hiring is intelligent, efficient, and data-driven.
              Connect the right talent with the right opportunity.
            </p>
            {/* Social */}
            <div className="flex gap-3">
              <a
                href="#"
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 hover:opacity-80"
                style={{
                  background: "var(--bg-badge)",
                  color: "var(--text-brand)",
                }}
              >
                {/* <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                    <path d={s === "linkedin" ? "M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z M4 6a2 2 0 100-4 2 2 0 000 4z" : "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"}/>
                  </svg> */}
                <FontAwesomeIcon icon={faFacebook} />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 hover:opacity-80"
                style={{
                  background: "var(--bg-badge)",
                  color: "var(--text-brand)",
                }}
              >
                {/* <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                    <path d={s === "linkedin" ? "M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z M4 6a2 2 0 100-4 2 2 0 000 4z" : "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"}/>
                  </svg> */}
                <FontAwesomeIcon icon={faLinkedin} />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 hover:opacity-80"
                style={{
                  background: "var(--bg-badge)",
                  color: "var(--text-brand)",
                }}
              >
                {/* <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                    <path d={s === "linkedin" ? "M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z M4 6a2 2 0 100-4 2 2 0 000 4z" : "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"}/>
                  </svg> */}
                <FontAwesomeIcon icon={faTwitter} />
              </a>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4
              className="text-sm font-bold mb-4 uppercase tracking-widest"
              style={{ color: "var(--text-primary)" }}
            >
              Platform
            </h4>
            <ul className="space-y-3">
              {["For Applicants", "For Companies", "Pricing", "API"].map(
                (item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-sm transition-colors duration-200 hover:opacity-80"
                      style={{ color: "var(--text-secondary)" }}
                      onMouseEnter={(e) =>
                        (e.target.style.color = "var(--text-brand)")
                      }
                      onMouseLeave={(e) =>
                        (e.target.style.color = "var(--text-secondary)")
                      }
                    >
                      {item}
                    </a>
                  </li>
                ),
              )}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4
              className="text-sm font-bold mb-4 uppercase tracking-widest"
              style={{ color: "var(--text-primary)" }}
            >
              Company
            </h4>
            <ul className="space-y-3">
              {["About Us", "Careers", "Blog", "Contact"].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-sm transition-colors duration-200"
                    style={{ color: "var(--text-secondary)" }}
                    onMouseEnter={(e) =>
                      (e.target.style.color = "var(--text-brand)")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.color = "var(--text-secondary)")
                    }
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default FooterInfo;
