"use client";

import { useCrudManager } from "@/hooks/useCrudManager";
import { useToast } from "@/components/Toast";
import FileUpload from "@/components/FileUpload";

type Gallery = { id: string; imageUrl: string; shortName: string; description: string | null; order: number };

interface Props {
  profileId: string;
  galleryItems: Gallery[];
}

export default function GaleriaClient({ profileId, galleryItems }: Props) {
  const { showToast, ToastComponent } = useToast();

  const galleryManager = useCrudManager(
    galleryItems,
    `/api/profile/${profileId}/gallery`,
    () => showToast("Cambios de galería guardados")
  );

  return (
    <div>
      <ToastComponent />
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="section-heading">Galería</h1>
          <p className="section-subheading">Fotos y descripciones cortas.</p>
        </div>
        <button 
          className="btn btn-primary" 
          onClick={() => galleryManager.add({
            imageUrl: "https://via.placeholder.com/300",
            shortName: "Nueva Foto",
            description: null,
            order: galleryManager.data.length,
          })}
        >
          + Nueva Foto
        </button>
      </div>

      {galleryManager.hasChanges && (
        <div className="flex justify-end mb-4">
          <button 
            className="btn btn-success px-6" 
            onClick={async () => {
              const result = await galleryManager.save();
              if (!result.success) {
                showToast("Error al guardar: " + result.error, "error");
              }
            }}
            disabled={galleryManager.isSaving}
          >
            {galleryManager.isSaving ? "Guardando..." : "💾 Guardar cambios"}
          </button>
        </div>
      )}

      <div className="profile-grid">
        {galleryManager.data.map((item) => (
          <div key={item.id} className="card">
            <FileUpload
              profileId={profileId}
              label="foto de galería"
              currentUrl={item.imageUrl}
              onUploaded={(url) => {
                galleryManager.update(item.id, { imageUrl: url });
              }}
            />
            <div className="field mt-4">
              <label className="field-label">Título <span className="required">*</span></label>
              <input
                className="input"
                value={item.shortName}
                onChange={(e) => {
                  galleryManager.update(item.id, { shortName: e.target.value });
                }}
              />
            </div>
            <div className="field mt-2">
              <label className="field-label">Descripción</label>
              <textarea
                className="input"
                rows={2}
                value={item.description || ""}
                onChange={(e) => {
                  galleryManager.update(item.id, { description: e.target.value || null });
                }}
              />
            </div>
            <div className="flex gap-2 mt-4">
              <button 
                className="btn btn-sm btn-danger" 
                onClick={() => {
                  if (confirm("¿Eliminar de la galería?")) {
                    galleryManager.remove(item.id);
                  }
                }}
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
        {galleryManager.data.length === 0 && <div className="card text-center py-8"><p className="text-muted">Galería vacía.</p></div>}
      </div>
    </div>
  );
}
