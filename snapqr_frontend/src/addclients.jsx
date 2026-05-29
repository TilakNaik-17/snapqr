import { useState, useEffect } from "react";
import "./addclients.css";

export default function MngClients() {
  const [view, setView] = useState("add"); // "add" | "status"
  const [clients, setClients] = useState([]);
  
  // State schema tracking input field states
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
  
  // Safe extraction of the logged-in user session
  const loggedInUser = localStorage.getItem("user_id") || localStorage.getItem("id");

  // Automatically seed the logged-in user's ID into the form when it loads
  useEffect(() => {
    if (loggedInUser) {
      setForm((prev) => ({ ...prev, userid: loggedInUser }));
      getClients();
    }
  }, [loggedInUser]);

  // CHANGED: Fetching all clients globally to bypass structural user_id NULL restrictions 
  async function getClients() {
    try {
      const response = await fetch("http://localhost:8084/api/clients");
      if (!response.ok) throw new Error("Failed to fetch clients");
      
      const data = await response.json();
      
      const formattedClients = data.map((c) => {
        // Handle both Numeric (1) and Boolean (true) conditions safely
        const isPending = c.pending === 1 || c.pending === true || String(c.pending) === "1";
        const isEditing = c.editing === 1 || c.editing === true || String(c.editing) === "1";

        return {
          id: c.client_id, // CHANGED: Strictly mapped to c.client_id
          name: c.name,
          email: c.email,
          phoneNo: c.phoneNo, 
          eventType: c.eventType,
          eventDate: c.eventDate,
          statuses: [
            isPending ? "pending" : isEditing ? "editing" : "delivered"
          ],
        };
      });
      
      setClients(formattedClients);
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  }

  const stats = {
    totalClients: clients.length,
    activeProjects: clients.filter((c) =>
      c.statuses.some((s) => s === "pending" || s === "editing")
    ).length,
    qrShared: clients.reduce(
      (acc, c) => acc + c.statuses.filter((s) => s === "delivered").length,
      0
    ),
    pendingDelivery: clients.reduce(
      (acc, c) => acc + c.statuses.filter((s) => s === "pending").length,
      0
    ),
  };

  function validate() {
    const e = {};
    if (!form.userid.trim()) e.userid = "User ID field is required";
    if (!form.name.trim()) e.name = "Required";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email))
      e.email = "Valid email required";
    if (!form.phoneNo.trim()) e.phoneNo = "Required"; 
    if (!form.eventType.trim()) e.eventType = "Required";
    if (!form.eventDate) e.eventDate = "Required";
    return e;
  }

  async function handleAdd(e) {
    if (e) e.preventDefault(); // Kills the browser hard-refresh loop instantly!

    const eValidation = validate();
    if (Object.keys(eValidation).length) {
      setErrors(eValidation);
      return;
    }

    try {
      const response = await fetch("http://localhost:8084/api/clients/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phoneNo: form.phoneNo,
          eventType: form.eventType,
          eventDate: form.eventDate,
          pending: 1,
          editing: 0,
          delivered: 0,
          user_id: form.userid 
        }),
      });

      if (!response.ok) {
        throw new Error("Client not saved");
      }

      await getClients();

      // Reset form variables safely while preserving session token user identity
      setForm({ 
        userid: loggedInUser || "", 
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
      alert("Client not stored in database");
    }
  }

  async function cycleStatus(clientId, currentStatus) {
    let endpoint = "pending";
    if (currentStatus === "pending") endpoint = "deliver";

    try {
      const response = await fetch(`http://localhost:8084/api/clients/${endpoint}/${clientId}`, {
        method: "PUT",
      });
      if (!response.ok) throw new Error("Failed to update status");
      getClients();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  }

  return (
    <div className="db-root">
      {/* Top Nav */}
      <nav className="db-nav">
        <button
          className={`db-nav-btn ${view === "add" ? "active" : ""}`}
          onClick={() => setView("add")}
        >
          <span className="db-nav-icon">⊕</span> Add clients
        </button>
        <button
          className={`db-nav-btn ${view === "status" ? "active" : ""}`}
          onClick={() => setView("status")}
        >
          <span className="db-nav-icon">👤</span> Project Status
        </button>
      </nav>

      {/* Body */}
      <div className="db-body">
        {/* Sidebar */}
        <aside className="db-sidebar">
          <h2 className="db-sidebar-title">Dashboard Overview</h2>
          <ul className="db-stats">
            <li>
              <span className="db-stat-label">Total Clients</span>
              <span className="db-stat-value">{String(stats.totalClients).padStart(2, "0")}</span>
            </li>
            <li>
              <span className="db-stat-label">Active Projects</span>
              <span className="db-stat-value">{String(stats.activeProjects).padStart(2, "0")}</span>
            </li>
            <li>
              <span className="db-stat-label">QR Shared</span>
              <span className="db-stat-value">{String(stats.qrShared).padStart(2, "0")}</span>
            </li>
            <li>
              <span className="db-stat-label">Pending Delivery</span>
              <span className="db-stat-value">{String(stats.pendingDelivery).padStart(2, "0")}</span>
            </li>
          </ul>
        </aside>

        {/* Main Panel */}
        <main className="db-main">
          {view === "add" ? (
            <div className="db-form-panel">
              {addedFlash && <div className="db-flash">✓ Client added!</div>}
              
              {/* USER ID INPUT */}
              <div className="db-field">
                <label className="db-label">user id:</label>
                <input
                  className={`db-input ${errors.userid ? "db-input-error" : ""}`}
                  value={form.userid}
                  onChange={(e) => setForm({ ...form, userid: e.target.value })}
                  placeholder="User identifier string"
                />
                {errors.userid && <span className="db-error-msg">{errors.userid}</span>}
              </div>

              {/* NAME */}
              <div className="db-field">
                <label className="db-label">name:</label>
                <input
                  className={`db-input ${errors.name ? "db-input-error" : ""}`}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Full name"
                />
                {errors.name && <span className="db-error-msg">{errors.name}</span>}
              </div>

              {/* EMAIL */}
              <div className="db-field">
                <label className="db-label">email:</label>
                <input
                  className={`db-input ${errors.email ? "db-input-error" : ""}`}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="email@example.com"
                />
                {errors.email && <span className="db-error-msg">{errors.email}</span>}
              </div>

              {/* PHONE NUMBER */}
              <div className="db-field">
                <label className="db-label">phone number:</label>
                <input
                  className={`db-input ${errors.phoneNo ? "db-input-error" : ""}`}
                  value={form.phoneNo}
                  onChange={(e) => setForm({ ...form, phoneNo: e.target.value })}
                  placeholder="1234567890"
                />
                {errors.phoneNo && <span className="db-error-msg">{errors.phoneNo}</span>}
              </div>

              {/* EVENT TYPE */}
              <div className="db-field">
                <label className="db-label">event type:</label>
                <input
                  className={`db-input ${errors.eventType ? "db-input-error" : ""}`}
                  value={form.eventType}
                  onChange={(e) => setForm({ ...form, eventType: e.target.value })}
                  placeholder="Wedding, Birthday…"
                />
                {errors.eventType && <span className="db-error-msg">{errors.eventType}</span>}
              </div>

              {/* EVENT DATE */}
              <div className="db-field">
                <label className="db-label">event date:</label>
                <input
                  type="date"
                  className={`db-input db-input-date ${errors.eventDate ? "db-input-error" : ""}`}
                  value={form.eventDate}
                  onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
                />
                {errors.eventDate && <span className="db-error-msg">{errors.eventDate}</span>}
              </div>

              <div className="db-form-actions">
                <button className="db-add-btn" onClick={(e) => handleAdd(e)}>
                  Add
                </button>
              </div>
            </div>
          ) : (
            <div className="db-status-panel">
              <h3 className="db-status-title">Status:</h3>
              <div className="db-table-wrap">
                <table className="db-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone number</th>
                      <th>Event Type</th>
                      <th>Event Date</th>
                      <th>Status / Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clients.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="db-empty">
                          No clients yet. Add one first.
                        </td>
                      </tr>
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
                                  onClick={() => cycleStatus(client.id, s)}
                                  title="Click to advance status"
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
  );
}