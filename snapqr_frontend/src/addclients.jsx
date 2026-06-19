import { useState, useEffect } from "react";
import { FaInstagram } from "react-icons/fa";
import logoimg from "./assets/transparent white logo.png";
import "./addclients.css";

const navItems = [
  { icon: "⊞", label: "Home" },
  { icon: "◎", label: "Manage Clients" },
  { icon: "▣", label: "QR Sharing" },
  { icon: "⬇", label: "Cloud storage" },
];

export default function MngClients({ activeNav, onNavClick, onLogout }) {
  const [view, setView] = useState("add"); 
  const [clients, setClients] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState("");

  const [form, setForm] = useState({
    userid: "", 
    name: "",
    email: "",
    phoneNo: "", 
    eventType: "",
    eventDate: "",
  });
  
  const [errors, setErrors] = useState({});
  const [addedFlash, setAddedFlash] = useState(false);

  // Load user session
  useEffect(() => {
    const sessionUser = localStorage.getItem("user_id") || localStorage.getItem("id") || "";
    if (sessionUser) {
      setLoggedInUser(sessionUser);
      setForm((prev) => ({ ...prev, userid: sessionUser }));
    } else {
      setLoggedInUser("11");
      setForm((prev) => ({ ...prev, userid: "11" }));
    }
  }, []);

  // Fetch clients
  useEffect(() => {
    if (loggedInUser) {
      fetchClients();
    }
  }, [loggedInUser]);

  async function fetchClients() {
    try {
      const userId = loggedInUser || "11";
      const response = await fetch(`http://localhost:8084/api/clients/user/${userId}`);
      if (!response.ok) throw new Error("Failed to fetch clients");
      
      const data = await response.json();
      
      const formattedClients = data.map((c) => {
        const isPending = c.pending === 1 || c.pending === true || String(c.pending) === "1";
        const isEditing = c.editing === 1 || c.editing === true || String(c.editing) === "1";

        return {
          id: c.client_id || c.id, 
          name: c.name,
          email: c.email,
          phoneNo: c.phone_number || c.phoneNumber || c.phoneNo || "", 
          eventType: c.event_type || c.eventType || "",
          eventDate: c.event_date || c.eventDate || "",
          statuses: [
            isPending ? "pending" : isEditing ? "editing" : "delivered"
          ],
        };
      });
      
      setClients(formattedClients);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  }

  const stats = {
    totalClients: clients.length,
    activeProjects: clients.filter((c) =>
      c.statuses.some((s) => s === "pending" || s === "editing")
    ).length,
    qrShared: clients.reduce((acc, c) => acc + c.statuses.filter((s) => s === "delivered").length, 0),
    pendingDelivery: clients.reduce((acc, c) => acc + c.statuses.filter((s) => s === "pending").length, 0),
  };

  function validate() {
    const e = {};
    if (!form.userid.toString().trim()) e.userid = "User ID target field is required";
    if (!form.name.trim()) e.name = "Required";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Valid email required";
    if (!form.phoneNo.toString().trim()) e.phoneNo = "Required"; 
    if (!form.eventType.trim()) e.eventType = "Required";
    if (!form.eventDate) e.eventDate = "Required";
    return e;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  async function handleAdd(e) {
    if (e) e.preventDefault();

    const eValidation = validate();
    if (Object.keys(eValidation).length) {
      setErrors(eValidation);
      return;
    }

    try {
      const targetUserId = form.userid || loggedInUser || "11";
      
      const payload = {
        name: form.name,
        email: form.email,
        phoneNo: form.phoneNo,
        eventType: form.eventType,
        eventDate: form.eventDate,
        pending: 1,
        editing: 0,
        delivered: 0,
        user_id: parseInt(targetUserId, 10)
      };

      const response = await fetch("http://localhost:8084/api/clients/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Client not saved");

      await fetchClients();

      setForm({ 
        userid: targetUserId, 
        name: "", 
        email: "", 
        phoneNo: "", 
        eventType: "", 
        eventDate: "" 
      });
      setErrors({});
      setAddedFlash(true);
      setTimeout(() => setAddedFlash(false), 1800);

    } catch (error) {
      console.error(error);
      alert("Database persistence link dropped.");
    }
  }

  async function markAsDelivered(clientId, currentStatus) {
    if (currentStatus !== "pending") return;

    try {
      const response = await fetch(
        `http://localhost:8084/api/clients/deliver/${clientId}`,
        {
          method: "PUT",
        }
      );

      const result = await response.text();

      if (!response.ok) {
        alert("Update failed: " + result);
        return;
      }

      await fetchClients(); // refresh UI
    } catch (error) {
      console.error(error);
      alert("Backend connection failed");
    }
  }

  async function handleDelete(clientId) {
    if (!window.confirm("Are you sure you want to delete this client?")) return;
    try {
      const response = await fetch(`http://localhost:8084/api/clients/delete/${clientId}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete client");
      fetchClients();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    /* Outer layout container to align Sidebar + Main Workspace side by side */
    <div className="app-layout-wrapper" style={{ display: "flex", width: "100%", minHeight: "100vh" }}>
      
      {/* ================= FIXED SIDEBAR ================= */}
      <aside className="sidebar" style={{ width: "260px", minWidth: "260px", flexShrink: 0 }}>
        {/* Logo */}
        <div className="logo-wrap">
          <div className="logo-img-placeholder">
            <span className="logo-camera-icon">
              <img src={logoimg} alt="SnapQR logo" />
            </span>
          </div>
          <div className="logo-text">
            <div className="logo-name">SnapQR</div>
            <div className="logo-sub">Photography &amp; Instant Sharing</div>
          </div>
        </div>

        {/* Nav items */}
        {navItems.map(({ icon, label }) => (
          <button
            key={label}
            className={`nav-item ${label === "Manage Clients" || activeNav === label ? "active" : ""}`}
            onClick={() => {
              if (label === "Manage Clients") {
                setView("add"); // Stay here and open the default inner view
              } else if (onNavClick) {
                onNavClick(label); // Tells the main router to change the page context
              }
            }}
          >
            <span className="nav-icon">{icon}</span>
            {label}
          </button>
        ))}

        {/* Footer */}
        <div className="sidebar-footer">
          <button className="social-btn" title="Instagram">
            <FaInstagram />
          </button>
          <button className="social-btn" title="Twitter/X">
            ✕
          </button>
          <button
            className="btn-logout-sidebar"
            title="Logout"
            onClick={onLogout}
          >
            logout
          </button>
        </div>
      </aside>

      {/* ================= MAIN CONTENT SURFACE ================= */}
      <div className="db-body" style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <nav className="db-nav">
          <button className={`db-nav-btn ${view === "add" ? "active" : ""}`} onClick={() => setView("add")}>
            <span className="db-nav-icon">⊕</span> Add clients
          </button>
          <button className={`db-nav-btn ${view === "status" ? "active" : ""}`} onClick={() => setView("status")}>
            <span className="db-nav-icon">👤</span> Project Status
          </button>
        </nav>

        <div className="db-content-split" style={{ display: "flex", flex: 1, gap: "20px" }}>
          {view === "add" && (
            <aside className="db-sidebar">
              <h2 className="db-sidebar-title">Dashboard Overview</h2>
              <ul className="db-stats">
                <li><span className="db-stat-label">Total Clients</span><span className="db-stat-value">{String(stats.totalClients).padStart(2, "0")}</span></li>
                <li><span className="db-stat-label">Active Projects</span><span className="db-stat-value">{String(stats.activeProjects).padStart(2, "0")}</span></li>
                <li><span className="db-stat-label">QR Shared</span><span className="db-stat-value">{String(stats.qrShared).padStart(2, "0")}</span></li>
                <li><span className="db-stat-label">Pending Delivery</span><span className="db-stat-value">{String(stats.pendingDelivery).padStart(2, "0")}</span></li>
              </ul>
            </aside>
          )}

          <main className="db-main" style={{ flex: 1 }}>
            {view === "add" ? (
              <div className="db-form-panel">
                {addedFlash && <div className="db-flash"> Client added!</div>}
                <div className="inputs">
                  <div className="db-field">
                    <label className="db-label">user id:</label>
                    <input name="userid" className={`db-input ${errors.userid ? "db-input-error" : ""}`} value={form.userid} onChange={handleChange} placeholder="User identifier string" />
                    {errors.userid && <span className="db-error-msg">{errors.userid}</span>}
                  </div>

                  <div className="db-field">
                    <label className="db-label">name:</label>
                    <input name="name" className={`db-input ${errors.name ? "db-input-error" : ""}`} value={form.name} onChange={handleChange} placeholder="Full name" />
                    {errors.name && <span className="db-error-msg">{errors.name}</span>}
                  </div>

                  <div className="db-field">
                    <label className="db-label">email:</label>
                    <input name="email" className={`db-input ${errors.email ? "db-input-error" : ""}`} value={form.email} onChange={handleChange} placeholder="email@example.com" />
                    {errors.email && <span className="db-error-msg">{errors.email}</span>}
                  </div>

                  <div className="db-field">
                    <label className="db-label">phone number:</label>
                    <input name="phoneNo" className={`db-input ${errors.phoneNo ? "db-input-error" : ""}`} value={form.phoneNo} onChange={handleChange} placeholder="1234567890" />
                    {errors.phoneNo && <span className="db-error-msg">{errors.phoneNo}</span>}
                  </div>

                  <div className="db-field">
                    <label className="db-label">event type:</label>
                    <input name="eventType" className={`db-input ${errors.eventType ? "db-input-error" : ""}`} value={form.eventType} onChange={handleChange} placeholder="Wedding, Birthday…" />
                    {errors.eventType && <span className="db-error-msg">{errors.eventType}</span>}
                  </div>

                  <div className="db-field">
                    <label className="db-label">event date:</label>
                    <input type="date" name="eventDate" className={`db-input db-input-date ${errors.eventDate ? "db-input-error" : ""}`} value={form.eventDate} onChange={handleChange} />
                    {errors.eventDate && <span className="db-error-msg">{errors.eventDate}</span>}
                  </div>

                  <div className="db-form-actions">
                    <button className="db-add-btn" onClick={handleAdd}>Add</button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="db-status-panel">
                <h3 className="db-status-title">Status:</h3>
                <div className="db-table-wrap" style={{ width: "100%", overflowX: "auto" }}>
                  <table className="db-table" style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr>
                        <th>Name</th><th>Email</th><th>Phone number</th><th>Event Type</th><th>Event Date</th><th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {clients.length === 0 ? (
                        <tr><td colSpan={7} className="db-empty">No clients yet. Add one first.</td></tr>
                      ) : (
                        clients.map((client) => (
                          <tr key={client.id}>
                            <td>{client.name}</td>
                            <td>{client.email}</td>
                            <td>{client.phoneNo}</td>
                            <td>{client.eventType}</td>
                            <td>{client.eventDate}</td>
                            <td>
                              <div className="db-status-cell">
                                {client.statuses.map((s, i) => (
                                  <button
                                    key={i}
                                    className={`db-status-tag db-status-${s}`}
                                    onClick={() => markAsDelivered(client.id, s)}
                                  >
                                    {s}
                                  </button>
                                ))}
                              </div>
                            </td>
                      
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}