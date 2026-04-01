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
      <h1 className="section-heading">Galería</h1>
      <p className="section-subheading">Fotos y descripciones cortas.</p>

      {/* GALERÍA */}
      <section className="card mt-6">
        <div className="border-b border-gray-200 pb-4 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-2">🖼️ Galería</h2>
          <p className="text-sm text-gray-600">Fotos de proyectos, eventos y momentos destacados.</p>
        </div>
        
        <div className="flex justify-between items-center mb-4">
          <button 
            className="btn btn-primary" 
            onClick={() => galleryManager.add({
              imageUrl: "",
              shortName: "",
              description: null,
              order: galleryManager.data.length,
            })}
          >
            + Agregar Foto
          </button>
          
          <button 
            className="btn btn-success px-6 py-2 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200" 
            onClick={async () => {
              const result = await galleryManager.save();
              if (result && !result.success) {
                showToast("Error al guardar: " + result.error, "error");
              }
            }}
            disabled={galleryManager.isSaving || !galleryManager.hasChanges}
          >
            {galleryManager.isSaving ? "⏳ Guardando..." : "💾 Guardar cambios"}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {galleryManager.data.map((item) => (
            <div key={item.id} className="card border border-gray-200 p-4">
              <div className="space-y-3">
                <div className="field">
                  <label className="field-label text-sm text-gray-600">Imagen *</label>
                  <FileUpload
                    profileId={profileId}
                    label="foto de galería"
                    currentUrl={item.imageUrl}
                    previewStyle="cover"
                    onUploaded={(url) => {
                      galleryManager.update(item.id, { imageUrl: url });
                    }}
                  />
                  {!item.imageUrl && (
                    <p className="text-xs text-red-500 mt-1">La imagen es obligatoria</p>
                  )}
                </div>
                <input 
                  className="input text-sm" 
                  placeholder="Título de la foto *" 
                  value={item.shortName} 
                  onChange={(e) => galleryManager.update(item.id, { shortName: e.target.value })} 
                />
                <textarea 
                  className="textarea text-sm" 
                  placeholder="Descripción breve" 
                  value={item.description || ""} 
                  onChange={(e) => galleryManager.update(item.id, { description: e.target.value || null })} 
                  rows={3}
                />
                {!item.imageUrl && (
                  <p className="text-xs text-red-500 mt-1">La imagen es obligatoria</p>
                )}
              </div>
              <div className="flex justify-end mt-4">
                <button 
                  className="btn btn-sm btn-danger" 
                  onClick={() => {
                    if (confirm("¿Eliminar esta foto?")) {
                      galleryManager.remove(item.id);
                    }
                  }}
                >
                  🗑️ Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {galleryManager.data.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No hay fotos en la galería.</p>
          </div>
        )}
      </section>
    </div>
  );
}
