"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const NAV = [
  { href: "inicio",        label: "Configuración General", icon: "⚙️" },
  { href: "sobre-mi",      label: "Sobre mí",              icon: "👤" },
  { href: "trayectoria",   label: "Trayectoria",           icon: "📚" },
  { href: "publicaciones", label: "Publicaciones", icon: "📄" },
  { href: "galeria",       label: "Galería",       icon: "🖼️" },
  { href: "divulgacion",   label: "Divulgación",   icon: "📢" },
  { href: "links",         label: "Links",         icon: "🔗" },
];

export default function Sidebar({ 
  profileName, 
  slug, 
  id, 
}: { 
  profileName: string; 
  slug: string; 
  id: string;
}) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  }

  return (
    <aside className="dash-sidebar">
      <div className="sidebar-logo">
        <span className="brand">Dashboard</span>
        <p className="profile-name" title={profileName}>{profileName}</p>
        <p style={{ fontSize: ".72rem", color: "rgba(255,255,255,0.4)", marginTop: 2 }}>/{slug}</p>
      </div>

      <nav className="sidebar-nav mt-8">
        <p className="nav-section-label">Secciones</p>
        <div className="space-y-1">
          {NAV.map((n) => {
            const href = `/profile/${id}/${n.href}`;
            const active = pathname.startsWith(href);
            return (
              <Link 
                key={n.href} 
                href={href} 
                className={`nav-link ${active ? "active" : ""}`}
              >
                <span className="icon">{n.icon}</span>
                <span className="label">{n.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="sidebar-footer">
        <button 
          className="nav-link w-full text-left" 
          onClick={handleLogout} 
          style={{ color: "#ef4444" }}
        >
          <span className="icon">↩️</span>
          <span className="label">Cerrar sesión</span>
        </button>
      </div>

      <style jsx>{`
        .dash-sidebar {
          width: 280px;
          height: 100vh;
          background: var(--user-sidebar-bg);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-right: 1px solid var(--user-border);
          display: flex;
          flex-direction: column;
          padding: 2rem 1.5rem;
          position: sticky;
          top: 0;
        }
        .sidebar-logo {
          padding: 0 0.5rem;
        }
        .brand {
          font-size: 0.75rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--user-accent);
          display: block;
          margin-bottom: 0.5rem;
        }
        .profile-name {
          font-size: 1.125rem;
          font-weight: 700;
          color: var(--user-text);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .nav-section-label {
          font-size: 0.625rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: rgba(255, 255, 255, 0.3);
          margin-bottom: 1rem;
          padding: 0 0.5rem;
        }
        .nav-link {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.875rem 1rem;
          border-radius: 12px;
          color: var(--user-text-muted);
          font-weight: 500;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid transparent;
        }
        .nav-link:hover {
          color: var(--user-text);
          background: var(--user-nav-hover);
        }
        .nav-link.active {
          background: var(--user-accent);
          color: white;
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }
        .icon {
          font-size: 1.125rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .sidebar-footer {
          margin-top: auto;
          padding-top: 2rem;
          border-top: 1px solid var(--user-border);
        }
      `}</style>
    </aside>
  );
}
