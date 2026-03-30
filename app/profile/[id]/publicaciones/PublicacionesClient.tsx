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
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="section-heading">Publicaciones</h1>
          <p className="section-subheading">Libros, artículos y documentos.</p>
        </div>
        <button 
          className="btn btn-primary" 
          onClick={() => publicationsManager.add({
            title: "Nueva Publicación",
            date: new Date().getFullYear().toString(),
            reference: "",
            pdfUrl: null,
            externalUrl: null,
            order: publicationsManager.data.length,
          })}
        >
          + Nueva Publicación
        </button>
      </div>

      {publicationsManager.hasChanges && (
        <div className="flex justify-end mb-4">
          <button 
            className="btn btn-success px-6" 
            onClick={async () => {
              const result = await publicationsManager.save();
              if (!result.success) {
                showToast("Error al guardar: " + result.error, "error");
              }
            }}
            disabled={publicationsManager.isSaving}
          >
            {publicationsManager.isSaving ? "Guardando..." : "💾 Guardar cambios"}
          </button>
        </div>
      )}

      <div className="item-list">
        {publicationsManager.data.map((item) => (
          <div key={item.id} className="card">
            <div className="field">
              <label className="field-label">Título <span className="required">*</span></label>
              <input className="input" value={item.title} onChange={(e) => {
                publicationsManager.update(item.id, { title: e.target.value });
              }} />
            </div>

            <div className="field-row mt-4">
              <div className="field">
                <label className="field-label">Fecha <span className="required">*</span></label>
                <input className="input" placeholder="Ej: 2023" value={item.date} onChange={(e) => {
                  publicationsManager.update(item.id, { date: e.target.value });
                }} />
              </div>
              <div className="field">
                <label className="field-label">Enlace Externo</label>
                <input className="input" placeholder="https://..." value={item.externalUrl || ""} onChange={(e) => {
                  publicationsManager.update(item.id, { externalUrl: e.target.value || null });
                }} />
              </div>
            </div>

            <div className="field mt-4">
              <label className="field-label">Referencia (Bibliográfica)</label>
              <textarea className="textarea" rows={2} value={item.reference} onChange={(e) => {
                publicationsManager.update(item.id, { reference: e.target.value });
              }} />
            </div>

            <div className="field mt-4">
               <label className="field-label">Archivo PDF</label>
               <FileUpload 
                profileId={profileId}
                label="PDF"
                bucket="pdfs"
                accept=".pdf"
                currentUrl={item.pdfUrl}
                previewStyle="avatar"
                onUploaded={(url) => {
                  publicationsManager.update(item.id, { pdfUrl: url });
                }}
               />
            </div>

            <div className="flex gap-2 mt-6">
               <button 
                 className="btn btn-danger" 
                 onClick={() => {
                   if (confirm("¿Eliminar publicación?")) {
                     publicationsManager.remove(item.id);
                   }
                 }}
               >
                 Eliminar
               </button>
            </div>
          </div>
        ))}

        {publicationsManager.data.length === 0 && (
          <div className="empty-state">
            <p>No has agregado publicaciones aún.</p>
          </div>
        )}
      </div>
    </div>
  );
}
