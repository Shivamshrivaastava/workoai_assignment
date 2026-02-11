import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import {
  LogOut,
  UserPlus,
  Search,
  Briefcase,
  Users,
  CheckCircle,
  Clock,
  TrendingUp,
  Trash2,
} from "lucide-react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function Dashboard({ setIsAuthenticated }) {
  const [candidates, setCandidates] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    reviewed: 0,
    hired: 0,
  });
  const [animatedStats, setAnimatedStats] = useState(stats);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    job_title: "",
    resume: null,
  });

  const token = localStorage.getItem("token");
  const axiosConfig = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    fetchCandidates();
    fetchStats();
  }, [searchTerm, statusFilter]);

  const fetchCandidates = async () => {
    setLoading(true);
    try {
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (statusFilter) params.status_filter = statusFilter;
      const response = await axios.get(`${API}/candidates`, {
        params,
        ...axiosConfig,
      });
      setCandidates(response.data);
    } catch {
      toast.error("Failed to fetch candidates");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API}/candidates/stats`, axiosConfig);
      setStats(response.data);
    } catch {}
  };

  useEffect(() => {
    const duration = 500;
    const steps = 30;
    const interval = duration / steps;

    Object.keys(stats).forEach((key) => {
      let current = 0;
      const increment = stats[key] / steps;
      const timer = setInterval(() => {
        current += increment;
        if (current >= stats[key]) {
          current = stats[key];
          clearInterval(timer);
        }
        setAnimatedStats((prev) => ({
          ...prev,
          [key]: Math.floor(current),
        }));
      }, interval);
    });
  }, [stats]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key]) fd.append(key, formData[key]);
    });

    try {
      await axios.post(`${API}/candidates`, fd, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Candidate referred successfully");
      setDialogOpen(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        job_title: "",
        resume: null,
      });
      fetchCandidates();
      fetchStats();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to refer candidate");
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await axios.put(
        `${API}/candidates/${id}/status`,
        { status },
        axiosConfig,
      );
      toast.success(`Moved to ${status}`);
      fetchCandidates();
      fetchStats();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this candidate?")) return;
    try {
      await axios.delete(`${API}/candidates/${id}`, axiosConfig);
      toast.success("Candidate deleted");
      fetchCandidates();
      fetchStats();
    } catch {
      toast.error("Failed to delete");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    toast.success("Logged out");
  };

  return (
    <div className="dashboard-container">
      <header className="header">
        <div className="header-inner">
          <div>
            <h1 className="app-title">ReferClub</h1>
            <p className="app-subtitle">
              Candidate Referral Intelligence Platform
            </p>
          </div>
          <div className="header-actions">
            <button className="btn-primary" onClick={() => setDialogOpen(true)}>
              <UserPlus size={16} /> Refer
            </button>
            <button className="btn-outline" onClick={handleLogout}>
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="content">
        <section className="stats">
          <StatCard
            icon={<Users size={20} />}
            label="Total"
            value={animatedStats.total}
          />
          <StatCard
            icon={<Clock size={20} />}
            label="Pending"
            value={animatedStats.pending}
          />
          <StatCard
            icon={<TrendingUp size={20} />}
            label="Reviewed"
            value={animatedStats.reviewed}
          />
          <StatCard
            icon={<CheckCircle size={20} />}
            label="Hired"
            value={animatedStats.hired}
          />
        </section>

        <section className="toolbar">
          <div className="search-box">
            <Search size={16} />
            <input
              placeholder="Search candidates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="select-wrapper">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Reviewed">Reviewed</option>
              <option value="Hired">Hired</option>
            </select>
          </div>
        </section>

        <section className="card-list">
          {loading ? (
            <p>Loading candidates...</p>
          ) : candidates.length === 0 ? (
            <div className="empty">
              <Briefcase size={40} />
              <p>No Candidates Found</p>
            </div>
          ) : (
            candidates.map((c) => (
              <div key={c.id} className="candidate-card">
                <div className="card-top">
                  <div className="profile">
                    <div className="avatar">{c.name[0]?.toUpperCase()}</div>
                    <div className="profile-text">
                      <h3>{c.name}</h3>
                      <p className="email">{c.email}</p>
                    </div>
                  </div>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(c.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="divider"></div>

                <div className="info-row">
                  <span>Role</span>
                  <strong>{c.job_title || "-"}</strong>
                </div>

                <div className="info-row">
                  <span>Phone</span>
                  <strong>{c.phone || "-"}</strong>
                </div>

                {c.resume_url && (
                  <a
                    className="resume-btn"
                    href={c.resume_url.replace("/upload/", "/upload/f_auto/")}
                    target="_blank"
                  >
                    View Resume
                  </a>
                )}

                <div className="status-group">
                  {["Pending", "Reviewed", "Hired"].map((status) => (
                    <span
                      key={status}
                      onClick={() => handleStatusUpdate(c.id, status)}
                      className={`status-badge ${c.status === status ? "active" : ""} ${status.toLowerCase()}`}
                    >
                      {status}
                    </span>
                  ))}
                </div>
              </div>
            ))
          )}
        </section>
      </main>

      {dialogOpen && (
        <div className="overlay" onClick={() => setDialogOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Refer Candidate</h2>
            <form onSubmit={handleSubmit}>
              <input
                required
                placeholder="Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
              <input
                required
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
              <input
                placeholder="Phone"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
              <input
                placeholder="Job Title"
                value={formData.job_title}
                onChange={(e) =>
                  setFormData({ ...formData, job_title: e.target.value })
                }
              />
              <input
                type="file"
                accept=".pdf"
                onChange={(e) =>
                  setFormData({ ...formData, resume: e.target.files[0] })
                }
              />
              <div className="modal-actions">
                <button type="submit" className="btn-primary">
                  Submit
                </button>
                <button
                  type="button"
                  className="btn-outline"
                  onClick={() => setDialogOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .dashboard-container {
          background: #f4f6fa;
          min-height: 100vh;
          font-family: Inter, sans-serif;
        }
        .header {
          background: #fff;
          border-bottom: 1px solid #e5e7eb;
        }
        .header-inner {
          max-width: 1200px;
          margin: auto;
          padding: 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .app-title {
          font-size: 24px;
          font-weight: 800;
          margin: 0;
        }
        .app-subtitle {
          font-size: 13px;
          color: #6b7280;
        }
        .btn-primary {
          background: #111827;
          color: #fff;
          padding: 10px 16px;
          border: none;
          border-radius: 10px;
          font-weight: 600;
        }
        .btn-outline {
          background: #fff;
          border: 1px solid #d1d5db;
          padding: 10px 16px;
          border-radius: 10px;
        }
        .content {
          max-width: 1200px;
          margin: auto;
          padding: 40px 24px;
        }
        .stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 20px;
          margin-bottom: 40px;
        }
        .toolbar {
          display: flex;
          gap: 16px;
          margin-bottom: 30px;
          align-items: center;
        }
        .search-box {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #fff;
          padding: 12px 14px;
          border-radius: 12px;
          flex: 1;
          border: 1px solid #e5e7eb;
        }
        .search-box input {
          border: none;
          outline: none;
          width: 100%;
        }
        .select-wrapper select {
          appearance: none;
          background: #fff;
          border: 1px solid #e5e7eb;
          padding: 12px 14px;
          border-radius: 12px;
          min-width: 170px;
        }
        .card-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 24px;
        }
        .candidate-card {
          background: #fff;
          border-radius: 18px;
          padding: 24px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
          border: 1px solid #eef0f4;
        }
        .card-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }
        .profile {
          display: flex;
          gap: 14px;
          flex: 1;
        }
        .profile-text {
          min-width: 0;
        }
        .email {
          font-size: 13px;
          color: #6b7280;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .avatar {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          background: #e5e7eb;
          display: grid;
          place-items: center;
          font-weight: 700;
          font-size: 18px;
        }
        .delete-btn {
          flex-shrink: 0;
          background: #fef2f2;
          border: none;
          padding: 8px;
          border-radius: 8px;
          color: #dc2626;
        }
        .divider {
          height: 1px;
          background: #eef0f4;
          margin: 18px 0;
        }
        .info-row {
          display: flex;
          justify-content: space-between;
          font-size: 14px;
          margin-bottom: 10px;
          color: #4b5563;
        }
        .resume-btn {
          display: inline-block;
          margin: 10px 0;
          padding: 8px 14px;
          background: #eef2ff;
          color: #3730a3;
          border-radius: 8px;
          font-size: 13px;
          text-decoration: none;
        }
        .status-group {
          margin-top: 10px;
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .status-badge {
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          cursor: pointer;
          border: 1px solid transparent;
        }
        .status-badge.pending {
          background: #fef3c7;
          color: #92400e;
        }
        .status-badge.reviewed {
          background: #e0e7ff;
          color: #3730a3;
        }
        .status-badge.hired {
          background: #d1fae5;
          color: #065f46;
        }
        .status-badge.active {
          border: 1px solid #111827;
          font-weight: 600;
        }
        .overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.4);
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .modal {
          background: #fff;
          padding: 30px;
          border-radius: 16px;
          width: 420px;
        }
        .modal input {
          width: 100%;
          padding: 10px;
          margin-bottom: 12px;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
        }
        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
        }
        .empty {
          text-align: center;
          color: #6b7280;
          margin-top: 60px;
        }
      `}</style>
    </div>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div
      style={{
        background: "#fff",
        padding: "22px",
        borderRadius: "16px",
        display: "flex",
        gap: "14px",
        alignItems: "center",
        boxShadow: "0 6px 18px rgba(0,0,0,.05)",
      }}
    >
      <div
        style={{
          background: "#111827",
          color: "#fff",
          width: 46,
          height: 46,
          display: "grid",
          placeItems: "center",
          borderRadius: "12px",
        }}
      >
        {icon}
      </div>
      <div>
        <p style={{ margin: 0, fontSize: 13, color: "#6b7280" }}>{label}</p>
        <h2 style={{ margin: 0, fontWeight: 800 }}>{value}</h2>
      </div>
    </div>
  );
}
