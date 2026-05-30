import { useState } from "react";
import Signup from "./Signup";
import Login from "./Login";
import SnapQRHomepage from "./home";
import AlbumManager from "./Albummanager";
import MngClients from "./addclients";

export default function App() {
  const [page, setPage] = useState("signup");

  // Handles navigation sidebar clicks from sub-components
  const handleNavigate = (label) => {
    const lowerLabel = label.toLowerCase();
    if (lowerLabel === "home") setPage("home");
    if (lowerLabel === "manage clients" || lowerLabel === "clients") setPage("clients");
    if (lowerLabel === "qr sharing" || lowerLabel === "qr") setPage("qr");
    if (lowerLabel === "cloud storage") setPage("qr"); // Fallback routing if cloud is tied into your AlbumManager layout
  };

  const handleLogout = () => {
    // Clear tokens if necessary
    localStorage.removeItem("user_id");
    localStorage.removeItem("id");
    setPage("login");
  };

  return (
    <>
      {/* Auth Flow */}
      {page === "signup" && (
        <Signup onSwitchToLogin={() => setPage("login")} />
      )}

      {page === "login" && (
        <Login
          onSwitchToSignup={() => setPage("signup")}
          onLoginSuccess={() => setPage("home")}
        />
      )}

      {page === "home" && (
        <SnapQRHomepage
          onManageClients={() => setPage("clients")}
          onQrSharing={() => setPage("qr")}
          onGetStarted={() => setPage("qr")}
        />
      )}

      {page === "qr" && (
        <AlbumManager onNavigate={(target) => handleNavigate(target)} />
      )}

      {page === "clients" && (
        <MngClients 
          activeNav="Manage Clients"
          onNavClick={(label) => handleNavigate(label)}
          onLogout={handleLogout}
        />
      )}
    </>
  );
}