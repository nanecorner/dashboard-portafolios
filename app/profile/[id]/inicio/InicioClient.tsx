"use client";

import { useState } from "react";
import FileUpload from "@/components/FileUpload";
import { useToast } from "@/components/Toast";

// Only Google Fonts that are reliably loaded and visually distinct
const FONTS = [
  { value: "Inter",            label: "Inter — Sans-serif moderna" },
  { value: "Montserrat",       label: "Montserrat — Geométrica" },
  { value: "Lora",             label: "Lora — Serif elegante" },
  { value: "Merriweather",     label: "Merriweather — Serif legible" },
  { value: "Playfair Display", label: "Playfair Display — Serif editorial" },
  { value: "Outfit",           label: "Outfit — Sans-serif limpia" },
  { value: "Source Serif 4",   label: "Source Serif 4 — Clásica" },
  { value: "DM Sans",          label: "DM Sans — Minimalista" },
];

type Profile = {
  id: string;
  name: string;
  slug: string;
  photoUrl: string | null;
  bio: string;
  quote: string | null;
  cvUrl: string | null;
  cvIsDownloadable: boolean;
  themePrimary: string | null;
  themeSecondary: string | null;
  themeFont: string | null;
};

export default function InicioClient({ profile }: { profile: Profile }) {
  const [form, setForm] = useState({
    name: profile.name,
    bio: profile.bio,
    quote: profile.quote ?? "",
    cvUrl: profile.cvUrl ?? "",
    cvIsDownloadable: profile.cvIsDownloadable,
    themePrimary: profile.themePrimary ?? "#ffffff",
    themeSecondary: profile.themeSecondary ?? "#000000",
    themeFont: profile.themeFont ?? "Montserrat",
    photoUrl: profile.photoUrl ?? "",
  });
  const [saving, setSaving] = useState(false);
  const { showToast, ToastComponent } = useToast();

  function update(k: string, v: string | boolean) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function save() {
    setSaving(true);
    try {
      const res = await fetch(`/api/profile/${profile.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          quote: form.quote || null,
          cvUrl: form.cvUrl || null,
          photoUrl: form.photoUrl || null,
        }),
      });
      if (!res.ok) throw new Error();
      showToast("Cambios guardados");
      setTimeout(() => window.location.reload(), 500);
    } catch {
      showToast("Error al guardar", "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="pb-20">
      <ToastComponent />

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="section-heading">Configuración General</h1>
          <p className="section-subheading">Gestiona la identidad y apariencia de tu portafolio.</p>
        </div>
        <button className="btn btn-primary px-8" onClick={save} disabled={saving}>
          {saving ? "Guardando..." : "💾 Guardar todo"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ── Columna izquierda ── */}
        <div className="space-y-6">

          {/* Identidad */}
          <div className="card">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">👤 Identidad</h2>

            <div className="field">
              <label className="field-label">Nombre <span className="required">*</span></label>
              <input
                className="input"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
              />
            </div>

            <div className="field mt-5">
              <label className="field-label">Foto de portada</label>
              <FileUpload
                profileId={profile.id}
                label="foto de portada"
                currentUrl={form.photoUrl}
                previewStyle="cover"
                onUploaded={(url) => update("photoUrl", url)}
              />
            </div>

            <div className="field mt-5">
              <label className="field-label">Biografía</label>
              <textarea
                className="textarea"
                value={form.bio}
                onChange={(e) => update("bio", e.target.value)}
                rows={4}
              />
            </div>

            <div className="field mt-5">
              <label className="field-label">Frase destacada</label>
              <textarea
                className="textarea"
                value={form.quote}
                onChange={(e) => update("quote", e.target.value)}
                rows={3}
                placeholder="Una frase que te represente (opcional)"
              />
              <p style={{ fontSize: "0.72rem", color: "var(--user-text-muted)", marginTop: 6 }}>
                Se muestra como cita en el inicio del portafolio.
              </p>
            </div>
          </div>
        </div>

        {/* ── Columna derecha ── */}
        <div className="space-y-6">

          {/* Apariencia */}
          <div className="card">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">🎨 Apariencia Visual</h2>

            <div className="grid grid-cols-2 gap-4">
              <div className="field">
                <label className="field-label">Color de Fondo</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    title="Seleccionar color de fondo"
                    style={{ height: 40, width: 40, padding: 0, border: "none", background: "transparent", cursor: "pointer", borderRadius: 8 }}
                    value={form.themePrimary}
                    onChange={e => update("themePrimary", e.target.value)}
                  />
                  <input className="input text-xs font-mono" value={form.themePrimary} onChange={e => update("themePrimary", e.target.value)} />
                </div>
              </div>
              <div className="field">
                <label className="field-label">Acento / Botones</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    title="Seleccionar color de acento"
                    style={{ height: 40, width: 40, padding: 0, border: "none", background: "transparent", cursor: "pointer", borderRadius: 8 }}
                    value={form.themeSecondary}
                    onChange={e => update("themeSecondary", e.target.value)}
                  />
                  <input className="input text-xs font-mono" value={form.themeSecondary} onChange={e => update("themeSecondary", e.target.value)} />
                </div>
              </div>
            </div>

            <div className="field mt-4">
              <label className="field-label">Tipografía</label>
              <select
                className="input"
                value={form.themeFont}
                onChange={e => update("themeFont", e.target.value)}
              >
                {FONTS.map(f => (
                  <option key={f.value} value={f.value}>{f.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* CV */}
          <div className="card">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">📄 Currículum Vitae</h2>
            <FileUpload
              profileId={profile.id}
              label="PDF del CV"
              currentUrl={form.cvUrl}
              bucket="pdfs"
              accept=".pdf"
              previewStyle="document"
              onUploaded={(url) => update("cvUrl", url)}
            />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: 12,
                padding: "0.75rem 1rem",
                borderRadius: 12,
                background: "var(--user-input-bg)",
                border: "1px solid var(--user-border)",
              }}
            >
              <div>
                <p style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--user-text)" }}>Permitir descarga</p>
                <p style={{ fontSize: "0.7rem", color: "var(--user-text-muted)" }}>Los visitantes podrán descargar el PDF</p>
              </div>
              <input
                type="checkbox"
                checked={form.cvIsDownloadable}
                onChange={(e) => update("cvIsDownloadable", e.target.checked)}
                style={{ width: 18, height: 18, cursor: "pointer", accentColor: "var(--user-accent)" }}
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
