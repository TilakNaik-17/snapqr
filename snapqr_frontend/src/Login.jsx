import "./login.css";
import logoimg from "./assets/transparent white logo.png";
import photographer from "./assets/loginpage photog.png";


/* ─── SVG ICONS ──────────────────────────────── */
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
  <svg viewBox="0 0 24 24" fill="none">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

const MicrosoftIcon = () => (
  <svg viewBox="0 0 24 24">
    <rect x="1"  y="1"  width="10" height="10" fill="#F25022" />
    <rect x="13" y="1"  width="10" height="10" fill="#7FBA00" />
    <rect x="1"  y="13" width="10" height="10" fill="#00A4EF" />
    <rect x="13" y="13" width="10" height="10" fill="#FFB900" />
  </svg>
);

/* Aperture/QR logo SVG */
const LogoSVG = () => (
  <svg width="42" height="42" viewBox="0 0 42 42" fill="none">
    <circle cx="21" cy="21" r="15" stroke="#3b8bff" strokeWidth="2" opacity="0.45" />
    <circle cx="21" cy="21" r="9"  stroke="#3b8bff" strokeWidth="2" />
    <circle cx="21" cy="21" r="3.5" fill="#3b8bff" />
    {/* shutter lines */}
    <line x1="21" y1="6"  x2="21" y2="12" stroke="#3b8bff" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
    <line x1="21" y1="30" x2="21" y2="36" stroke="#3b8bff" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
    <line x1="6"  y1="21" x2="12" y2="21" stroke="#3b8bff" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
    <line x1="30" y1="21" x2="36" y2="21" stroke="#3b8bff" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
    {/* sparkle */}
    <circle cx="32" cy="10" r="1.8" fill="#3b8bff" opacity="0.7" />
    <circle cx="35" cy="7"  r="1.1" fill="#3b8bff" opacity="0.4" />
  </svg>
);


export default function Login({ onSwitchToSignup }) {
  return (
    <div className="li-page">
      <div className="li-card">

        {/* ── LEFT: FORM ── */}
        <div className="li-form-panel">

          {/* Logo */}
          <div className="li-logo-wrap">
            <div className="li-logo-ring">
              <img
                src={logoimg}
                alt="Photography studio"
              />
            </div>
            <div className="li-logo-name">SnapQR</div>
            <div className="li-logo-tagline">Photography &amp; Instant Sharing</div>
          </div>

          {/* Fields */}
          <div className="li-fields">
            <div className="li-field">
              <span className="li-field-icon"><IconMail /></span>
              <input type="email" placeholder="Email" autoComplete="email" />
            </div>

            <div className="li-field">
              <span className="li-field-icon"><IconLock /></span>
              <input type="password" placeholder="Password" autoComplete="current-password" />
            </div>
          </div>

          {/* Options row */}
          <div className="li-options-row">
            <label className="li-remember">
              <input type="checkbox" defaultChecked />
              <span>Reminder me</span>
            </label>
            <button className="li-forgot">Forgotten Password</button>
          </div>

          {/* CTA */}
          <button className="li-btn-primary">Login</button>

          {/* Divider */}
          <div className="li-divider">
            <div className="li-divider-line" />
            <span>or</span>
            <div className="li-divider-line" />
          </div>

          {/* Social */}
          <div className="li-socials">
            <button className="li-btn-social">
              <GoogleIcon /> Google
            </button>
            <button className="li-btn-social">
              <MicrosoftIcon /> Microsoft
            </button>
          </div>

          {/* Switch */}
          <div className="li-switch">
            Don&apos;t have an account?{" "}
            <button onClick={onSwitchToSignup}>Sign up</button>
          </div>
        </div>

        {/* ── RIGHT: IMAGE ── */}
        <div className="li-image-panel">
         <img
                     src={photographer}
                      alt="Photography studio"
                         />
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
