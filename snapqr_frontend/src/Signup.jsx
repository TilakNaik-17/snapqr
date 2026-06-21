import "./signup.css";
import { useState } from "react";
import confirmImg from "./assets/confirm.png";

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

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

const MicrosoftIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16">
    <rect x="1" y="1" width="10" height="10" fill="#F25022" />
    <rect x="13" y="1" width="10" height="10" fill="#7FBA00" />
    <rect x="1" y="13" width="10" height="10" fill="#00A4EF" />
    <rect x="13" y="13" width="10" height="10" fill="#FFB900" />
  </svg>
);

export default function Signup({ onSwitchToLogin }) {

  // STATE
  const [formData, setFormData] = useState({
    user_id: "", 
    fullName: "",
    email: "",
    password: "",
  });
  
  const [errors, setErrors] = useState({});

  // 🔄 FIXED: Dynamic network binding matching your current hostname address profile
  const backendBaseUrl = `http://${window.location.hostname}:8084`;

  // HANDLE INPUT
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: "",
      });
    }
  };

  // VALIDATE INPUTS FOR BLANK SPACES AND PASSWORD STRENGTH
  const validateForm = () => {
    let formErrors = {};
    const emailRegex = /\S+@\S+\.\S+/;

    if (!formData.user_id || !formData.user_id.trim()) {
      formErrors.user_id = "User ID cannot be empty";
    }
    if (!formData.fullName || !formData.fullName.trim()) {
      formErrors.fullName = "Name cannot be empty";
    }
    if (!formData.email || !formData.email.trim()) {
      formErrors.email = "Email cannot be empty";
    } else if (!emailRegex.test(formData.email)) {
      formErrors.email = "Please enter a valid email address";
    }
    if (!formData.password || !formData.password.trim()) {
      formErrors.password = "Password cannot be empty";
    } else if (formData.password.length < 6) {
      formErrors.password = "Password must be at least 6 characters long";
    }

    return formErrors;
  };

  // HANDLE SIGNUP
  const handleSignup = async () => {
    const formErrors = validateForm();
    
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      alert("Please fix validation errors before submitting.");
      return;
    }

    try {
      // 🔗 FIXED: Replaced localhost with dynamic template literal string variables
      const response = await fetch(`${backendBaseUrl}/api/users/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        alert("Signup Successful!");
        setErrors({});
        if (onSwitchToLogin) onSwitchToLogin(); // Guide them back to login on success
      } else {
        const textError = await response.text();
        alert("Signup Failed: " + textError);
      }
    } catch (error) {
      console.error("Frontend Catch Block:", error);
      alert(`Network Error or Parsing Error: Signup Failed! Unable to contact backend at: ${backendBaseUrl}`);
    }
  };

  return (
    <div className="su-page">
      <div className="su-card">

        {/* LEFT PANEL */}
        <div className="su-form-panel">

          {/* HEADLINE */}
          <div className="su-headline">
            <h2>Ready to shoot?</h2>
            <p>
              Sign-up now to{" "}
              <span className="su-highlight">
                get 20% off
              </span>{" "}
              your first premium project
            </p>
          </div>

          {/* INPUT FIELDS */}
          <div className="su-fields">

            {/* USER ID */}
            <div className={`su-field ${errors.user_id ? "db-input-error" : ""}`}>
              <span className="su-field-icon">
                <IconUser />
              </span>
              <input
                type="text"
                name="user_id"
                placeholder="User ID"
                autoComplete="username"
                value={formData.user_id}
                onChange={handleChange}
              />
              {errors.user_id && <span className="db-error-msg" style={{display: 'block', color: 'red', fontSize: '12px', marginTop: '4px'}}>{errors.user_id}</span>}
            </div>

            {/* FULL NAME */}
            <div className={`su-field ${errors.fullName ? "db-input-error" : ""}`}>
              <span className="su-field-icon">
                <IconUser />
              </span>
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                autoComplete="name"
                value={formData.fullName}
                onChange={handleChange}
              />
              {errors.fullName && <span className="db-error-msg" style={{display: 'block', color: 'red', fontSize: '12px', marginTop: '4px'}}>{errors.fullName}</span>}
            </div>

            {/* EMAIL */}
            <div className={`su-field ${errors.email ? "db-input-error" : ""}`}>
              <span className="su-field-icon">
                <IconMail />
              </span>
              <input
                type="email"
                name="email"
                placeholder="Email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <span className="db-error-msg" style={{display: 'block', color: 'red', fontSize: '12px', marginTop: '4px'}}>{errors.email}</span>}
            </div>

            {/* PASSWORD */}
            <div className={`su-field ${errors.password ? "db-input-error" : ""}`}>
              <span className="su-field-icon">
                <IconLock />
              </span>
              <input
                type="password"
                name="password"
                placeholder="Password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && <span className="db-error-msg" style={{display: 'block', color: 'red', fontSize: '12px', marginTop: '4px'}}>{errors.password}</span>}
            </div>

          </div>

          {/* SIGNUP BUTTON */}
          <button
            className="su-btn-primary"
            onClick={handleSignup}
          >
            Sign Up
          </button>

          {/* DIVIDER */}
          <div className="su-divider">
            <div className="su-divider-line" />
            <span>or sign up with</span>
            <div className="su-divider-line" />
          </div>

          {/* SOCIALS */}
          <div className="su-socials">
            <button className="su-btn-social">
              <GoogleIcon />
              Google
            </button>
            <button className="su-btn-social">
              <MicrosoftIcon />
              Microsoft
            </button>
          </div>

          {/* LOGIN SWITCH */}
          <div className="su-switch">
            Already have an account?{" "}
            <button onClick={onSwitchToLogin}>
              Log in
            </button>
          </div>

        </div>

        {/* RIGHT IMAGE PANEL */}
        <div className="su-image-panel">
          <img
            src={confirmImg}
            alt="Photography studio"
          />
          <div className="su-image-overlay" />
          <div className="su-image-badge">
            <div className="su-badge-model">
              Canon EOS R5
            </div>
            <div className="su-badge-sub">
              <span className="su-badge-dot" />
              Available for rent today
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}