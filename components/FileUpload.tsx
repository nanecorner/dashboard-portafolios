"use client";

import { useState, useRef } from "react";

interface Props {
  profileId: string;
  label: string;
  currentUrl: string | null;
  bucket?: string;
  onUploaded: (url: string) => void;
  accept?: string;
  previewStyle?: "cover" | "avatar" | "document";
}

export default function FileUpload({
  profileId,
  label,
  currentUrl,
  bucket = "images",
  onUploaded,
  accept = "image/*",
  previewStyle = "cover",
}: Props) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentUrl);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setUploading(true);
    if (previewStyle !== "document") {
      setPreview(URL.createObjectURL(file));
    }
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("bucket", bucket);
      const res = await fetch(`/api/profile/${profileId}/upload`, { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      onUploaded(data.url);
      if (previewStyle === "document") setPreview(data.url);
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  }

  const isDoc = previewStyle === "document";
  const filename = preview ? preview.split("/").pop()?.split("?")[0] ?? "archivo" : null;

  return (
    <div>
      {/* Image preview */}
      {preview && !isDoc && (
        <div style={{ position: "relative", borderRadius: 14, overflow: "hidden", marginBottom: 10 }}>
          <img
            src={preview}
            alt="preview"
            style={{
              width: "100%",
              height: 180,
              objectFit: "cover",
              borderRadius: 14,
              display: "block",
            }}
          />
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 50%)",
            borderRadius: 14,
          }} />
          <button
            className="btn btn-secondary"
            style={{ position: "absolute", bottom: 10, right: 10, fontSize: "0.75rem", padding: "0.35rem 0.85rem" }}
            onClick={() => inputRef.current?.click()}
            type="button"
          >
            {uploading ? "⏳ Subiendo..." : "✏️ Cambiar imagen"}
          </button>
        </div>
      )}

      {/* PDF / document preview */}
      {isDoc && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            padding: "0.875rem 1rem",
            borderRadius: 12,
            border: "1px solid var(--user-border)",
            background: "var(--user-input-bg)",
            marginBottom: 10,
          }}
        >
          <span style={{ fontSize: "1.5rem" }}>📄</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            {preview ? (
              <>
                <p style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--user-text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {filename}
                </p>
                <p style={{ fontSize: "0.7rem", color: "var(--user-text-muted)" }}>PDF subido correctamente</p>
              </>
            ) : (
              <p style={{ fontSize: "0.85rem", color: "var(--user-text-muted)" }}>Sin archivo subido</p>
            )}
          </div>
          <button
            className="btn btn-secondary"
            style={{ fontSize: "0.75rem", padding: "0.35rem 0.85rem", flexShrink: 0 }}
            onClick={() => inputRef.current?.click()}
            type="button"
          >
            {uploading ? "⏳" : preview ? "Cambiar" : "Subir"}
          </button>
        </div>
      )}

      {/* Empty state for images */}
      {!preview && !isDoc && (
        <div
          onClick={() => inputRef.current?.click()}
          style={{
            border: "2px dashed var(--user-border)",
            borderRadius: 14,
            padding: "2rem 1rem",
            textAlign: "center",
            cursor: "pointer",
            transition: "border-color 0.2s, background 0.2s",
            marginBottom: 10,
            background: "var(--user-input-bg)",
          }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--user-accent)")}
          onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--user-border)")}
        >
          <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🖼️</div>
          <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--user-text)" }}>
            {uploading ? "Subiendo..." : `Subir ${label}`}
          </p>
          <p style={{ fontSize: "0.75rem", color: "var(--user-text-muted)", marginTop: 4 }}>
            JPG, PNG, WebP — máx. 10 MB
          </p>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        style={{ display: "none" }}
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
        }}
      />
    </div>
  );
}
