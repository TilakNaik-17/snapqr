import { useState, useEffect } from "react";
import { FaInstagram } from "react-icons/fa";
import QRCode from "qrcode";
import logoimg from "./assets/transparent white logo.png";
import "./Albummanager.css";

// 1. GLOBAL DYNAMIC BASE CONSTANTS
const FRONTEND_BASE = window.location.origin;
const BACKEND_BASE = `http://${window.location.hostname}:8084`;

const navItems = [
  { icon: "⊞", label: "Home" },
  { icon: "◎", label: "Manage Clients" },
  { icon: "▣", label: "QR Sharing" },
  { icon: "⬇", label: "Cloud storage" },
];

export default function AlbumManager({ onNavigate, onOpenGallery }) {
  const [activeNav, setActiveNav] = useState("QR Sharing");
  const [albums, setAlbums] = useState([]);
  const [albumId, setAlbumId] = useState("");
  const [albumName, setAlbumName] = useState("");
  const [userId, setUserId] = useState("");
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [showQr, setShowQr] = useState(false);
  const [qrImageUrl, setQrImageUrl] = useState("");

  // ── STATE VARIABLES ──
  const [totalAmount, setTotalAmount] = useState("");

  // Load albums and set initial userId on mount
  useEffect(() => {
    getAlbums();
    const sessionUser = localStorage.getItem("user_id");
    if (sessionUser) setUserId(sessionUser);
  }, []);

  async function getAlbums() {
    try {
      const activeUserId = localStorage.getItem("user_id") || "11";
      const response = await fetch(
        `${BACKEND_BASE}/api/albums/user/${activeUserId}`
      );
      if (!response.ok) throw new Error("Failed to fetch albums");

      const data = await response.json();
      setAlbums(data.map((a) => ({
        id: a.albumId,
        name: a.albumName,
        userId: a.userId,
        date: a.createdDate,
      })));
    } catch (error) {
      console.error("Error loading albums:", error);
    }
  }

  const handleNavClick = (label) => {
    if (label === "QR Sharing") return;
    setActiveNav(label);
    if (onNavigate) onNavigate(label);
  };

  const handleAdd = async () => {
    if (!albumId.trim() || !albumName.trim() || !userId.trim()) {
      alert("Fill all fields");
      return;
    }

    const albumData = {
      albumId: Number(albumId),
      albumName: albumName.trim(),
      userId: Number(userId),
    };

    try {
      const response = await fetch(`${BACKEND_BASE}/api/albums/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(albumData),
      });

      const result = await response.text();

      if (!response.ok) {
        alert("Album not saved: " + result);
        return;
      }

      await getAlbums();
      setAlbumId("");
      setAlbumName("");
      setUserId("");

      alert("Album stored in database");
    } catch (error) {
      console.error(error);
      alert("Backend connection failed");
    }
  };

  // ── ADDED PUT ACTION TO UPDATE TOTAL AMOUNT VIA API ──
  const handleAddAmount = async () => {
    if (!selectedAlbum?.id) {
      alert("Generate/select QR first");
      return;
    }

    if (!totalAmount.trim()) {
      alert("Enter total amount");
      return;
    }

    try {
      const response = await fetch(
        `${BACKEND_BASE}/api/qrcode/amount/${selectedAlbum.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            total_amount: Number(totalAmount),
          }),
        }
      );

      if (!response.ok) {
        const error = await response.text();
        alert("Amount not saved: " + error);
        return;
      }

      alert("Amount saved in SQL");
    } catch (error) {
      console.error(error);
      alert("Backend connection failed");
    }
  };

  // ── QR GENERATOR ──
  const handleGenerateQr = async (album) => {
    const qrLink = `${FRONTEND_BASE}/qrcode/${album.id}`;

    try {
      const qrDataUrl = await QRCode.toDataURL(qrLink, {
        width: 220,
        margin: 2,
      });

      setSelectedAlbum(album);
      setQrImageUrl(qrDataUrl);
      setShowQr(true);

      const response = await fetch(`${BACKEND_BASE}/api/qrcode/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          albumId: album.id,
          albumName: album.name,
          qrLink,
          total_amount: Number(totalAmount),
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.log("QR save error:", errorText);
        alert("QR saved in UI, but not saved in database");
        return;
      }
    } catch (error) {
      console.error(error);
      alert("QR generation failed");
    }
  };

  const qrLink = selectedAlbum ? `${FRONTEND_BASE}/qrcode/${selectedAlbum.id}` : "";

  return (
    <div className="snapqr-root">
      {/* ── Sidebar ── */}
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

        {navItems.map(({ icon, label }) => (
          <button
            key={label}
            className={`nav-item ${activeNav === label ? "active" : ""}`}
            onClick={() => handleNavClick(label)}
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
          <button className="btn-logout-sidebar" onClick={() => alert("Logged out!")}>
            logout
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <div className="app-wrapper">
        {/* Header */}
        <header className="app-header">
          <div className="header-fields">
            <div className="header-field">
              <label className="form-label">AlbumID:</label>
              <input
                className="form-input"
                type="text"
                placeholder="Enter album id"
                value={albumId}
                onChange={(e) => setAlbumId(e.target.value)}
              />
            </div>
          </div>
        </header>

        {/* Form rows */}
        <section className="form-section">
          <div className="form-row">
            <label className="form-label">User ID:</label>
            <input
              className="form-input"
              type="text"
              placeholder="Enter user id"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
          </div>

          <div className="form-row">
            <label className="form-label">Album name:</label>
            <input
              className="form-input"
              type="text"
              placeholder="Enter album name"
              value={albumName}
              onChange={(e) => setAlbumName(e.target.value)}
            />
          </div>
          

          <div className="add-btn-container">
            <button className="btn-add" onClick={handleAdd}>
               Add
            </button>
          </div>
        </section>

        <hr className="divider" />

        {/* Albums grid + QR panel */}
        <div className="main-content">
          <section className="albums-section">
            <h2 className="albums-title">Albums:</h2>
            <div className="albums-grid">
              {albums.map((album) => (
                <div
                  key={album.id}
                  className={`album-card ${
                    selectedAlbum?.id === album.id ? "album-card--active" : ""
                  }`}
                >
                  <div className="album-thumbnail">
                    <div className="album-thumbnail-inner" />
                  </div>
                  <div className="album-info">
                    <p className="album-name">album name: {album.name}</p>
                    <p className="album-user">user identity: {album.userId}</p>
                    <p className="album-date">created date: {album.date}</p>
                    <button
                      className="btn-generate-qr"
                      style={{ marginRight: "10px", color: "#00c8e0" }}
                      onClick={() => onOpenGallery && onOpenGallery(album)}
                    >
                      view gallery
                    </button>
                    <button
                      className="btn-generate-qr"
                      onClick={() => handleGenerateQr(album)}
                    >
                      generate qr-code
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── UPDATED QR PANEL ── */}
          {showQr && selectedAlbum && (
            <aside className="qr-panel">
              <div className="qr-image-wrapper">
                <img className="qr-image" src={qrImageUrl} alt="QR Code" />
              </div>
              <div className="qr-banner">
                📸 Your memories are ready. Scan to explore the gallery.
              </div>
              <div className="qr-details">
                <p className="qr-link">
                  <span className="qr-label">link:-</span>
                  <br />
                  <span className="qr-url">{qrLink}</span>
                </p>
                <p className="qr-album-name">
                  <strong>Album name:</strong> {selectedAlbum.name}
                </p>
                
                {/* ── TOTAL BILL INPUT BLOCK WITH ₹ SYMBOL & SAVE BUTTON ── */}
                <div className="qr-field">
                  <label><strong>Total Bill:</strong></label>
                  <div className="amount-box" style={{ display: "flex", alignItems: "center", gap: "6px", position: "relative" }}>
                    <span className="rupee-symbol" style={{ color: "#00c8e0", fontWeight: "bold" }}>₹</span>
                    <input
                      type="number"
                      className="qr-input amount-input"
                      placeholder="Enter total amount"
                      value={totalAmount}
                      onChange={(e) => setTotalAmount(e.target.value)}
                      style={{ flex: 1 }}
                    />
                  </div>
                  <button 
                    className="btn-add-amount" 
                    onClick={handleAddAmount}
                    style={{ marginTop: "10px", width: "100%" }}
                  >
                    Add Amount
                  </button>
                </div>

              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}