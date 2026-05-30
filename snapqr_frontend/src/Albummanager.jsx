import { useState } from "react";
import { FaInstagram } from "react-icons/fa";
import logoimg from "./assets/transparent white logo.png";
import "./AlbumManager.css";

const navItems = [
  { icon: "⊞", label: "Home" },
  { icon: "◎", label: "Manage Clients" },
  { icon: "▣", label: "QR Sharing" },
  { icon: "⬇", label: "Cloud storage" },
];

export default function AlbumManager({ onNavigate }) {
  const [activeNav, setActiveNav] = useState("QR Sharing");
  const [albums, setAlbums] = useState([]);
  const [albumId, setAlbumId] = useState("");
  const [albumName, setAlbumName] = useState("");
  const [createdDate, setCreatedDate] = useState("");
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [showQr, setShowQr] = useState(false);

  const handleNavClick = (label) => {
    if (label === "QR Sharing") return;
    setActiveNav(label);
    if (onNavigate) onNavigate(label);
  };

  const handleAdd = () => {
    if (!albumName.trim() || !createdDate.trim()) return;
    setAlbums((prev) => [
      ...prev,
      {
        id: albumId.trim() || Date.now(),
        name: albumName.trim(),
        date: createdDate,
      },
    ]);
    setAlbumId("");
    setAlbumName("");
    setCreatedDate("");
  };

  const handleGenerateQr = async (album) => {
    const qrLink = `http://localhost:5173/qrcode/${album.name
      .replace(/\s+/g, "-")
      .toLowerCase()}/${album.id}`;

    try {
      const response = await fetch("http://localhost:8084/api/qrcode/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ albumId: album.id, albumName: album.name, qrLink }),
      });
      if (!response.ok) throw new Error("QR not saved");
      const savedQr = await response.json();
      console.log("QR saved:", savedQr);
    } catch (error) {
      console.error(error);
      alert("QR code not saved in database");
    }

    setSelectedAlbum(album);
    setShowQr(true);
  };

  const qrLink = selectedAlbum
    ? `http://snapqr/qrcode/${selectedAlbum.name
        .replace(/\s+/g, "-")
        .toLowerCase()}/${selectedAlbum.id}`
    : "";

  const qrImageUrl = selectedAlbum
    ? `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrLink)}`
    : "";

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
              <label className="form-label">Album id:</label>
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
            <label className="form-label">Album name:</label>
            <input
              className="form-input"
              type="text"
              placeholder="Enter album name"
              value={albumName}
              onChange={(e) => setAlbumName(e.target.value)}
            />
          </div>

          <div className="form-row">
            <label className="form-label">Created date:</label>
            <input
              className="form-input"
              type="text"
              placeholder="dd/mm/yyyy"
              value={createdDate}
              onChange={(e) => setCreatedDate(e.target.value)}
            />
            <button className="btn-add" onClick={handleAdd}>Add</button>
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
                    <p className="album-date">album created date: {album.date}</p>
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
                <p className="qr-bill">
                  <strong>Total Bill:-</strong>
                </p>
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}