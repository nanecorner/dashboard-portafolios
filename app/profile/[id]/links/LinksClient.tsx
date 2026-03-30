"use client";

import { useCrudManager } from "@/hooks/useCrudManager";
import { useToast } from "@/components/Toast";

type Foot = { id: string; label: string; url: string; icon: string | null; order: number };

interface Props {
  profileId: string;
  footerLinks: Foot[];
}

export default function LinksClient({ profileId, footerLinks }: Props) {
  const { showToast, ToastComponent } = useToast();

  const linksManager = useCrudManager(
    footerLinks,
    `/api/profile/${profileId}/links`,
    () => showToast("Cambios de links guardados")
  );

  return (
    <div>
      <ToastComponent />
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="section-heading">Links (Footer)</h1>
          <p className="section-subheading">Redes sociales y enlaces rápidos.</p>
        </div>
        <button 
          className="btn btn-primary" 
          onClick={() => linksManager.add({
            label: "Nuevo Link",
            url: "https://",
            icon: "link",
            order: linksManager.data.length,
          })}
        >
          + Nuevo Link
        </button>
      </div>

      {linksManager.hasChanges && (
        <div className="flex justify-end mb-4">
          <button 
            className="btn btn-success px-6" 
            onClick={async () => {
              const result = await linksManager.save();
              if (!result.success) {
                showToast("Error al guardar: " + result.error, "error");
              }
            }}
            disabled={linksManager.isSaving}
          >
            {linksManager.isSaving ? "Guardando..." : "💾 Guardar cambios"}
          </button>
        </div>
      )}

      <div className="item-list">
        {linksManager.data.map((item) => (
          <div key={item.id} className="item-row">
            <div className="item-row-body">
              <div className="field-row">
                <input
                  className="input"
                  placeholder="Ej: Twitter, Web, etc."
                  value={item.label}
                  onChange={(e) => {
                    linksManager.update(item.id, { label: e.target.value });
                  }}
                />
                <input
                  className="input"
                  placeholder="https://..."
                  value={item.url}
                  onChange={(e) => {
                    linksManager.update(item.id, { url: e.target.value });
                  }}
                />
              </div>
            </div>
            <div className="item-actions">
              <button 
                className="btn btn-icon btn-danger" 
                onClick={() => {
                  if (confirm("¿Eliminar este link?")) {
                    linksManager.remove(item.id);
                  }
                }}
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
        {linksManager.data.length === 0 && <div className="card text-center py-8"><p className="text-muted">No has agregado links aún.</p></div>}
      </div>
    </div>
  );
}
