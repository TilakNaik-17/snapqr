import "./login.css";
import logoimg from "./assets/transparent white logo.png";
import photographer from "./assets/loginpage photog.png";
import { useState } from "react";

const IconUser = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
  </svg>
);

const IconMail = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m2 7 10 7 10-7" />
  </svg>
);

const IconLock = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <rect x="5" y="11" width="14" height="10" rx="2" />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
  </svg>
);

export default function Login({ onSwitchToSignup, onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:8084/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (response.ok) {
        // CORRECTION: Parse response as JSON to read the fields returned by Spring Boot
        const userData = await response.json();
        console.log("Logged in user details:", userData);

        // CORRECTION: Extract id dynamically (fallback to your main test user 11 if missing)
        const activeUserId = userData.user_id || userData.id || "11";

        // CRITICAL FIX: Save the ID to localStorage so the client manager dashboard can see it
        localStorage.setItem("user_id", String(activeUserId));

        alert("Login Successful");
        
        if (onLoginSuccess) {
          onLoginSuccess();
        }
      } else {
        const errorText = await response.text();
        alert(errorText || "Invalid credentials");
      }
    } catch (error) {
      console.error("Login Error:", error);
      alert("Login Failed. Make sure your Spring Boot backend is running.");
    }
  };

  return (
    <div className="li-page">
      <div className="li-card">
        {/* LEFT: FORM */}
        <div className="li-form-panel">
          {/* Logo */}
          <div className="li-logo-wrap">
            <div className="li-logo-ring">
              <img src={logoimg} alt="Photography studio" />
            </div>
            <div className="li-logo-name">SnapQR</div>
            <div className="li-logo-tagline">Photography & Instant Sharing</div>
          </div>

          {/* Fields */}
          <div className="li-fields">
            {/* EMAIL */}
            <div className="li-field">
              <span className="li-field-icon">
                <IconMail />
              </span>
              <input
                type="email"
                placeholder="Email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* PASSWORD */}
            <div className="li-field">
              <span className="li-field-icon">
                <IconLock />
              </span>
              <input
                type="password"
                placeholder="Password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {/* LOGIN BUTTON */}
          <button className="li-btn-primary" onClick={handleLogin}>
            Login
          </button>

          {/* SWITCH */}
          <div className="li-switch">
            Don&apos;t have an account?{" "}
            <button onClick={onSwitchToSignup}>Sign up</button>
          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div className="li-image-panel">
          <img src={photographer} alt="Photography studio" />
          <div className="li-image-overlay" />
          <div className="li-image-badge">
            <div className="li-badge-title">Welcome Back</div>
            <div className="li-badge-sub">
              <span className="li-badge-dot" />
              Your shots are waiting for you
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}