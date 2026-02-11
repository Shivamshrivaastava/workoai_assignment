import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { LogIn, UserPlus } from "lucide-react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function Auth({ setIsAuthenticated }) {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    full_name: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = isLogin ? `${API}/auth/login` : `${API}/auth/signup`;
      const payload = isLogin
        ? { email: formData.email, password: formData.password }
        : formData;

      const res = await axios.post(endpoint, payload);

      localStorage.setItem("token", res.data.access_token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      toast.success(isLogin ? "Welcome back!" : "Account created!");
      setIsAuthenticated(true);
    } catch (error) {
      toast.error(error.response?.data?.detail || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        <div className="brand-section">
          <h1>ReferClub</h1>
          <p>Candidate Referral Intelligence Platform</p>
        </div>

        <div className="auth-card">
          <div className="card-header">
            <h2>{isLogin ? "Sign In" : "Create Account"}</h2>
            <p>
              {isLogin
                ? "Access your dashboard"
                : "Register to manage referrals"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="form">
            {!isLogin && (
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={formData.full_name}
                  onChange={(e) =>
                    setFormData({ ...formData, full_name: e.target.value })
                  }
                  required={!isLogin}
                />
              </div>
            )}

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="********"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
              />
            </div>

            <button className="btn-primary" disabled={loading}>
              {loading
                ? "Processing..."
                : isLogin ? (
                  <>
                    <LogIn size={16} /> Sign In
                  </>
                ) : (
                  <>
                    <UserPlus size={16} /> Sign Up
                  </>
                )}
            </button>
          </form>

          <div className="switch">
            {isLogin ? "Don't have an account?" : "Already registered?"}
            <button
              className="switch-btn"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Create account" : "Sign in"}
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .auth-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f4f6fa;
          padding: 40px 20px;
          font-family: Inter, sans-serif;
        }

        .auth-wrapper {
          width: 100%;
          max-width: 420px;
        }

        .brand-section {
          text-align: center;
          margin-bottom: 32px;
        }

        .brand-section h1 {
          margin: 0;
          font-size: 28px;
          font-weight: 800;
          color: #111827;
        }

        .brand-section p {
          margin-top: 6px;
          font-size: 14px;
          color: #6b7280;
        }

        .auth-card {
          background: #ffffff;
          border-radius: 18px;
          padding: 32px;
          border: 1px solid #e5e7eb;
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.05);
        }

        .card-header h2 {
          margin: 0;
          font-size: 22px;
          font-weight: 800;
          color: #111827;
        }

        .card-header p {
          margin-top: 4px;
          font-size: 13px;
          color: #6b7280;
          margin-bottom: 24px;
        }

        .form {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .form-group label {
          font-size: 13px;
          font-weight: 600;
          color: #374151;
        }

        .form-group input {
          width: 100%;
          margin-top: 6px;
          padding: 12px 14px;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
          background: #f9fafb;
          font-size: 14px;
          transition: 0.2s ease;
        }

        .form-group input:focus {
          outline: none;
          background: #ffffff;
          border-color: #111827;
          box-shadow: 0 0 0 3px rgba(17, 24, 39, 0.08);
        }

        .btn-primary {
          margin-top: 10px;
          background: #111827;
          color: #ffffff;
          padding: 12px;
          border-radius: 12px;
          border: none;
          font-weight: 700;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: 0.2s ease;
        }

        .btn-primary:hover {
          background: #000000;
        }

        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .switch {
          margin-top: 20px;
          text-align: center;
          font-size: 14px;
          color: #4b5563;
        }

        .switch-btn {
          margin-left: 6px;
          background: none;
          border: none;
          color: #111827;
          font-weight: 600;
          cursor: pointer;
        }

        @media (max-width: 480px) {
          .auth-card {
            padding: 24px;
          }
        }
      `}</style>
    </div>
  );
}
