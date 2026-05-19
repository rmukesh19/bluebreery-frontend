"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import logo from "@/images/blueberry-logo-Photoroom.png";
import { Lock, Mail, Eye, EyeOff, Loader2 } from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // If already logged in, redirect to dashboard directly
    const isLoggedIn = localStorage.getItem("admin_logged_in") === "true";
    if (isLoggedIn) {
      router.push("/admin/dashboard");
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);

    // Simulate login verification (Replace with actual backend authentication if desired)
    setTimeout(() => {
      if (email === "admin@blueberries.com" && password === "admin123") {
        localStorage.setItem("admin_logged_in", "true");
        router.push("/admin/dashboard");
      } else {
        setError("Invalid email or password.");
        setLoading(false);
      }
    }, 1200);
  };

  return (
    <div className="admin-login-wrapper">
      <div className="login-box">
        {/* LOGO SECTION */}
        <div className="logo-section">
          <Image
            src={logo}
            alt="Blueberries Logo"
            className="admin-logo-img"
            priority
          />
          <div className="panel-badge">ADMIN DASHBOARD</div>
        </div>

        {/* TITLE */}
        <div className="title-section">
          <h1>Sign In</h1>
          <p>Enter your administrative credentials to continue</p>
        </div>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="error-banner">
            <span className="error-icon">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>EMAIL ADDRESS</label>
            <div className="input-container">
              <Mail size={18} className="input-icon" />
              <input
                type="email"
                placeholder="admin@blueberries.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <div className="password-header">
              <label>PASSWORD</label>
            </div>
            <div className="input-container">
              <Lock size={18} className="input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
              />
              <button
                type="button"
                className="eye-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" className="login-submit-btn" disabled={loading}>
            {loading ? (
              <>
                <Loader2 size={18} className="spinner" />
                <span>Authenticating...</span>
              </>
            ) : (
              <span>LOG IN</span>
            )}
          </button>
        </form>
      </div>

      <style jsx global>{`
        .admin-login-wrapper {
          min-height: 100vh;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient(circle at center, #0e2d54 0%, #06162b 100%);
          padding: 24px;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }

        .login-box {
          background: rgba(10, 35, 66, 0.4);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          width: 100%;
          max-width: 440px;
          border-radius: 24px;
          padding: 48px 40px;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
          animation: slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes slideUpFade {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .logo-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          margin-bottom: 32px;
        }

        .admin-logo-img {
          height: auto;
          max-height: 60px;
          width: auto;
          object-fit: contain;
          filter: drop-shadow(0 2px 8px rgba(255, 255, 255, 0.15));
        }

        .panel-badge {
          background: rgba(255, 221, 0, 0.1);
          border: 1px solid rgba(255, 221, 0, 0.25);
          color: #ffdd00;
          font-size: 9px;
          font-weight: 800;
          padding: 4px 10px;
          border-radius: 20px;
          letter-spacing: 2.5px;
        }

        .title-section {
          text-align: center;
          margin-bottom: 28px;
        }

        .title-section h1 {
          color: #fff;
          font-size: 26px;
          font-weight: 800;
          margin: 0 0 6px 0;
          letter-spacing: -0.5px;
        }

        .title-section p {
          color: rgba(255, 255, 255, 0.6);
          font-size: 13px;
          margin: 0;
          line-height: 1.4;
        }

        .error-banner {
          background: rgba(239, 68, 68, 0.15);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #f87171;
          font-size: 13px;
          font-weight: 600;
          padding: 12px 16px;
          border-radius: 12px;
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          gap: 10px;
          animation: shake 0.4s ease;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-group label {
          color: rgba(255, 255, 255, 0.5);
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1px;
        }

        .password-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .input-container {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 14px;
          color: rgba(255, 255, 255, 0.4);
          pointer-events: none;
          transition: color 0.3s;
        }

        .input-container input {
          width: 100%;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 14px 14px 14px 44px;
          color: #fff;
          font-size: 14px;
          outline: none;
          transition: all 0.3s;
        }

        .input-container input::placeholder {
          color: rgba(255, 255, 255, 0.25);
        }

        .input-container input:focus {
          border-color: #ffdd00;
          background: rgba(255, 255, 255, 0.08);
          box-shadow: 0 0 15px rgba(255, 221, 0, 0.15);
        }

        .input-container input:focus + .input-icon {
          color: #ffdd00;
        }

        .eye-btn {
          position: absolute;
          right: 14px;
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.4);
          cursor: pointer;
          display: flex;
          align-items: center;
          padding: 4px;
          transition: color 0.3s;
        }

        .eye-btn:hover {
          color: #fff;
        }

        .login-submit-btn {
          background: #ffdd00;
          color: #06162b;
          border: none;
          border-radius: 12px;
          padding: 15px;
          font-size: 14px;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-top: 10px;
          box-shadow: 0 4px 20px rgba(255, 221, 0, 0.2);
        }

        .login-submit-btn:hover {
          background: #ffe633;
          transform: translateY(-2px);
          box-shadow: 0 6px 25px rgba(255, 221, 0, 0.35);
        }

        .login-submit-btn:active {
          transform: translateY(0);
        }

        .login-submit-btn:disabled {
          background: rgba(255, 221, 0, 0.6);
          color: rgba(6, 22, 43, 0.6);
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .spinner {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
