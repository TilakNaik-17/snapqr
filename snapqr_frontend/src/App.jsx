import { useState } from "react";
import Signup from "./Signup";
import Login from "./Login";
import SnapQRHomepage from "./home";
import AlbumManager from "./Albummanager";
import MngClients from "./addclients";
import PhotoGallery from "./photogallary";

export default function App() {
  const [page, setPage] = useState("signup");
  const [selectedAlbum, setSelectedAlbum] = useState(null);

  const path = window.location.pathname;
  const albumIdFromPath = path.startsWith("/qrcode/")
    ? path.split("/")[2]
    : null;

  // Handles navigation sidebar clicks from sub-components
  const handleNavigate = (label) => {
    const lowerLabel = label.toLowerCase();
    if (lowerLabel === "home") setPage("home");
    if (lowerLabel === "manage clients" || lowerLabel === "clients") setPage("clients");
    if (lowerLabel === "qr sharing" || lowerLabel === "qr") setPage("qr");
    if (lowerLabel === "cloud storage") setPage("qr");
  };

  const handleLogout = () => {
    localStorage.removeItem("user_id");
    localStorage.removeItem("id");
    setPage("login");
  };

  if (albumIdFromPath) {
    return (
      <PhotoGallery
        album={{ id: Number(albumIdFromPath) }}
        onBack={() => window.history.back()}
      />
    );
  }

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
        <AlbumManager
          onNavigate={(target) => handleNavigate(target)}
          onOpenGallery={(album) => {
            setSelectedAlbum(album);
            setPage("gallery");
          }}
        />
      )}

      {page === "gallery" && (
        <PhotoGallery album={selectedAlbum} onBack={() => setPage("qr")} />
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