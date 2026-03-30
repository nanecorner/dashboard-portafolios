"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        const { profileId } = await res.json();
        router.push(`/profile/${profileId}/inicio`);
      } else {
        const data = await res.json();
        setError(data.error || "Credenciales inválidas");
      }
    } catch {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-container">
      <div className="login-card animate-fade-in">
        <div className="login-header">
          <div className="login-logo">🚀</div>
          <h1>Dashboard Portafolios</h1>
          <p>Ingresa tus credenciales para administrar tu perfil</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <div className="field">
            <label className="field-label">Usuario (slug)</label>
            <input
              type="text"
              className="input"
              placeholder="juan-perez"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="field mt-4">
            <label className="field-label">Contraseña</label>
            <input
              type="password"
              className="input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <div className="error-message mt-4">{error}</div>}

          <button
            type="submit"
            className={`btn btn-primary w-full mt-6 ${loading ? "loading" : ""}`}
            disabled={loading}
          >
            {loading ? "Iniciando sesión..." : "Entrar al Panel"}
          </button>
        </form>

        <div className="login-footer">
          <p>Hecho por D'cReaM 🐢</p>
        </div>
      </div>

      <style jsx>{`
        .login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient(circle at top right, #1a1a2e, #16213e);
          padding: 2rem;
        }
        .login-card {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          padding: 3rem;
          width: 100%;
          max-width: 440px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }
        .login-header {
          text-align: center;
          margin-bottom: 2.5rem;
        }
        .login-logo {
          font-size: 3rem;
          margin-bottom: 1rem;
        }
        .login-header h1 {
          font-size: 1.75rem;
          font-weight: 700;
          color: white;
          margin-bottom: 0.5rem;
          letter-spacing: -0.025em;
        }
        .login-header p {
          color: #94a3b8;
          font-size: 0.9375rem;
        }
        .field-label {
          color: #cbd5e1;
          font-size: 0.875rem;
          font-weight: 500;
          margin-bottom: 0.5rem;
          display: block;
        }
        .input {
          width: 100%;
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: white;
          padding: 0.875rem 1rem;
          border-radius: 12px;
          transition: all 0.2s ease;
        }
        .input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
        }
        .error-message {
          color: #ef4444;
          background: rgba(239, 68, 68, 0.1);
          padding: 0.75rem;
          border-radius: 8px;
          font-size: 0.875rem;
          text-align: center;
          border: 1px solid rgba(239, 68, 68, 0.2);
        }
        .login-footer {
          margin-top: 3rem;
          text-align: center;
          color: #64748b;
          font-size: 0.75rem;
        }
        .animate-fade-in {
          animation: fadeIn 0.6s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
