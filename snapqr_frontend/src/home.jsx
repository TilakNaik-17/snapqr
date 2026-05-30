import { useState } from "react";
import "./home.css";
import logoimg from "./assets/transparent white logo.png";
import { FaInstagram } from "react-icons/fa";
import ClientDashboard from "./addclients";

const QRBadge = () => (
  <div className="logo-qr-badge">
    {[1, 1, 0, 1, 0, 1, 0, 1, 1].map((v, i) => (
      <div key={i} className={`qr-dot ${v === 0 ? "empty" : ""}`} />
    ))}
  </div>
);

const navItems = [
  { icon: "⊞", label: "Home", action: "home" },
  { icon: "◎", label: "Manage Clients", action: "clients" },
  { icon: "▣", label: "QR Sharing", action: "qr" },
  { icon: "⬇", label: "Cloud storage", action: "cloud" },
];

export default function SnapQRHomepage({
  onQrSharing,
  onGetStarted,
  onManageClients,
}) {
  const [activeNav, setActiveNav] = useState("Home");

  const handleNavClick = (label, action) => {
    setActiveNav(label);
    
    // Connect sidebar item clicks to the parent App logic
    if (action === "clients" && onManageClients) onManageClients();
    if (action === "qr" && onQrSharing) onQrSharing();
  };

  return (
    <div className="snapqr-root">
      
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo-wrap">
          <div className="logo-img-placeholder">
            <span className="logo-camera-icon"> 
              <img src={logoimg} alt="Photography studio" /> 
            </span>
          </div>
          <div className="logo-text">
            <div className="logo-name">SnapQR</div>
            <div className="logo-sub">Photography &amp; Instant Sharing</div>
          </div>
        </div>

        {navItems.map(({ icon, label, action }) => (
          <button
            key={label}
            className={`nav-item ${activeNav === label ? "active" : ""}`}
            onClick={() => handleNavClick(label, action)}
          >
            <span className="nav-icon">{icon}</span>
            {label}
          </button>
        ))}

        <div className="sidebar-footer">
          <button className="social-btn" title="Instagram">
            <FaInstagram />
          </button>
          <button className="social-btn" title="Twitter/X">✕</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-area">
        {activeNav === "Home" && (
          <>
            <div className="blob blob-top-right" />
            <div className="blob blob-bottom-right" />
            <div className="glow-orb" />

            <div className="headline-wrap">
              <div className="headlinebox2">
                <h1 className="headline">
                  SnapQR reduced<br />
                  delivery time<br />
                  from 3 days to{" "}
                  <span className="white">5 minutes.</span>
                </h1>

                <p className="headline-sub">
                  Instantly share high-resolution photos with clients via QR codes —
                  no app downloads, no delays, no friction.
                </p>

                <div className="cta-row">
                  {/* Get Started Button */}
                  <button className="btn-primary" onClick={onGetStarted}>
                    Get Started
                  </button>
                  
                  {/* QR Sharing Button */}
                  <button className="btn-secondary" onClick={onQrSharing}>
                    QR Sharing
                  </button>

                  {/* Manage Clients Button */}
                  <button className="btn-secondary" onClick={onManageClients}>
                    Manage Clients
                  </button>
                </div>

                <div className="stat-row">
                  <div className="stat-pill">
                    <div className="stat-value">5min</div>
                    <div className="stat-label">Delivery time</div>
                  </div>
                  <div className="stat-pill">
                    <div className="stat-value">100%</div>
                    <div className="stat-label">Instant access</div>
                  </div>
                  <div className="stat-pill">
                    <div className="stat-value">0 apps</div>
                    <div className="stat-label">Client needed</div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
        
        {activeNav === "Manage Clients" && (
          <ClientDashboard />
        )}
      </main>
    </div>
  );
}