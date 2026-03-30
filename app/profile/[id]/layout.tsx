import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Sidebar from "./Sidebar";

/** Determines if a hex color is perceptually "light" (luma > 0.55) */
function isLightColor(hex: string): boolean {
  const h = hex.replace("#", "");
  if (h.length !== 6) return false;
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.55;
}

export default async function ProfileLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getSession();

  if (!session || session.profileId !== id) redirect("/");

  const profile = await prisma.profile.findUnique({
    where: { id },
    select: { 
      name: true, 
      slug: true,
      themePrimary: true,
      themeSecondary: true,
      themeFont: true,
    },
  });

  if (!profile) redirect("/");

  const primaryColor = profile.themePrimary || "#0f172a";
  const accentColor  = profile.themeSecondary || "#3b82f6";
  const fontMain     = profile.themeFont || "Inter";
  const light        = isLightColor(primaryColor);

  const themeVars = {
    "--user-bg":          primaryColor,
    "--user-accent":      accentColor,
    "--user-font":        fontMain,
    "--user-text":        light ? "#0f172a"              : "#f8fafc",
    "--user-text-muted":  light ? "#64748b"              : "#94a3b8",
    "--user-border":      light ? "rgba(0,0,0,0.12)"     : "rgba(255,255,255,0.1)",
    "--user-card":        light ? "rgba(0,0,0,0.04)"     : "rgba(255,255,255,0.03)",
    "--user-sidebar-bg":  light ? "rgba(255,255,255,0.55)"  : "rgba(0,0,0,0.3)",
    "--user-nav-hover":   light ? "rgba(0,0,0,0.06)"     : "rgba(255,255,255,0.05)",
    "--user-input-bg":    light ? "rgba(0,0,0,0.06)"     : "rgba(0,0,0,0.15)",
  } as React.CSSProperties;

  return (
    <div className="dash-shell" style={themeVars}>
      {/* Dynamic Font Import */}
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=${fontMain.replace(/ /g, '+')}:wght@400;500;600;700&display=swap');
      ` }} />

      <Sidebar 
        profileName={profile.name} 
        slug={profile.slug} 
        id={id}
      />
      <main className="dash-main">
        <div className="dash-content p-8 max-w-7xl mx-auto min-h-screen">
          {children}
        </div>
        <footer className="dash-footer">
          Hecho por D'cReaM 🐢
        </footer>
      </main>
    </div>
  );
}
