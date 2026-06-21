import React from "react";
import { FaInstagram } from "react-icons/fa";
import logoimg from "./assets/transparent white logo.png";
import "./cloudpage.css";

const navItems = [
  { icon: "⊞", label: "Home" },
  { icon: "◎", label: "Manage Clients" },
  { icon: "▣", label: "QR Sharing" },
  { icon: "⬇", label: "Cloud storage" },
];

export default function ServiceUnavailable({
  onNavigate,
  activeNav = "Cloud storage",
}) {
  return (
    <div className="snapqr-root">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo-wrap">
          <div className="logo-img-placeholder">
            <span className="logo-camera-icon">
              <img src={logoimg} alt="SnapQR" />
            </span>
          </div>

          <div className="logo-text">
            <div className="logo-name">SnapQR</div>
            <div className="logo-sub">
              Photography &amp; Instant Sharing
            </div>
          </div>
        </div>

        {navItems.map(({ icon, label }) => (
          <button
            key={label}
            className={`nav-item ${
              activeNav === label ? "active" : ""
            }`}
            onClick={() => onNavigate && onNavigate(label)}
          >
            <span className="nav-icon">{icon}</span>
            {label}
          </button>
        ))}

        <div className="sidebar-footer">
          <button className="social-btn">
            <FaInstagram />
          </button>

          <button className="social-btn">✕</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="cloud-main">
        <div className="cloud-card">
          <div className="cloud-icon">🤕</div>

          <h1>Cloud Storage</h1>

          <p>This page is currently not available.</p>
        </div>
      </main>
    </div>
  );
}