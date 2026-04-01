"use client";

import { useCrudManager } from "@/hooks/useCrudManager";
import { useToast } from "@/components/Toast";
import FileUpload from "@/components/FileUpload";

type Pub = {
  id: string;
  title: string;
  date: string;
  reference: string;
  pdfUrl: string | null;
  externalUrl: string | null;
  order: number;
};

interface Props {
  profileId: string;
  publications: Pub[];
}

export default function PublicacionesClient({ profileId, publications }: Props) {
  const { showToast, ToastComponent } = useToast();

  const publicationsManager = useCrudManager(
    publications,
    `/api/profile/${profileId}/publications`,
    () => showToast("Cambios de publicaciones guardados")
  );

  return (
    <div>
      <ToastComponent />
      <h1 className="section-heading">Publicaciones</h1>
      <p className="section-subheading">Libros, artículos y documentos.</p>

      {/* PUBLICACIONES */}
      <section className="card mt-6">
        <div className="border-b border-gray-200 pb-4 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-2">📚 Publicaciones</h2>
          <p className="text-sm text-gray-600">Libros, artículos académicos, papers y documentos publicados.</p>
        </div>
        
        <div className="flex justify-between items-center mb-4">
          <button 
            className="btn btn-primary" 
            onClick={() => publicationsManager.add({
              title: "",
              date: "",
              reference: "",
              pdfUrl: null,
              externalUrl: null,
              order: publicationsManager.data.length,
            })}
          >
            + Agregar Publicación
          </button>
          
          <button 
            className="btn btn-success px-6 py-2 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200" 
            onClick={async () => {
              const result = await publicationsManager.save();
              if (result && !result.success) {
                showToast("Error al guardar: " + result.error, "error");
              }
            }}
            disabled={publicationsManager.isSaving || !publicationsManager.hasChanges}
          >
            {publicationsManager.isSaving ? "⏳ Guardando..." : "💾 Guardar cambios"}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {publicationsManager.data.map((item) => (
            <div key={item.id} className="card border border-gray-200 p-4">
              <div className="space-y-3">
                <input 
                  className="input" 
                  placeholder="Título de la publicación *" 
                  value={item.title} 
                  onChange={(e) => publicationsManager.update(item.id, { title: e.target.value })} 
                />
                <input 
                  className="input text-sm" 
                  placeholder="Fecha de publicación *" 
                  value={item.date} 
                  onChange={(e) => publicationsManager.update(item.id, { date: e.target.value })} 
                />
                <input 
                  className="input text-sm" 
                  placeholder="Enlace externo" 
                  value={item.externalUrl || ""} 
                  onChange={(e) => publicationsManager.update(item.id, { externalUrl: e.target.value || null })} 
                />
                <textarea 
                  className="textarea text-sm" 
                  placeholder="Referencia bibliográfica *" 
                  value={item.reference} 
                  onChange={(e) => publicationsManager.update(item.id, { reference: e.target.value })} 
                  rows={3}
                />
                <div className="field mt-5">
                  <label className="field-label">Archivo PDF</label>
                  <FileUpload 
                    profileId={profileId}
                    label="PDF"
                    bucket="pdfs"
                    accept=".pdf"
                    currentUrl={item.pdfUrl}
                    previewStyle="document"
                    onUploaded={(url) => {
                      publicationsManager.update(item.id, { pdfUrl: url });
                    }}
                  />
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <button 
                  className="btn btn-sm btn-danger" 
                  onClick={() => {
                    if (confirm("¿Eliminar esta publicación?")) {
                      publicationsManager.remove(item.id);
                    }
                  }}
                >
                  🗑️ Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {publicationsManager.data.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No hay registros de publicaciones.</p>
          </div>
        )}
      </section>
    </div>
  );
}
