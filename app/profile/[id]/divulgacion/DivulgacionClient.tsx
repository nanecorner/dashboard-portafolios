"use client";

import { useCrudManager } from "@/hooks/useCrudManager";
import { useToast } from "@/components/Toast";

type Dissemination = { id: string; title: string; date: string | null; url: string | null; order: number };

interface Props {
  profileId: string;
  disseminationItems: Dissemination[];
}

export default function DivulgacionClient({ profileId, disseminationItems }: Props) {
  const { showToast, ToastComponent } = useToast();

  const disseminationManager = useCrudManager(
    disseminationItems,
    `/api/profile/${profileId}/dissemination`,
    () => showToast("Cambios de divulgación guardados")
  );

  return (
    <div>
      <ToastComponent />
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="section-heading">Divulgación y Difusión</h1>
          <p className="section-subheading">Entrevistas, conferencias y medios.</p>
        </div>
        <button 
          className="btn btn-primary" 
          onClick={() => disseminationManager.add({
            title: "Nueva Divulgación",
            date: null,
            url: null,
            order: disseminationManager.data.length,
          })}
        >
          + Nueva Divulgación
        </button>
      </div>

      {disseminationManager.hasChanges && (
        <div className="flex justify-end mb-4">
          <button 
            className="btn btn-success px-6" 
            onClick={async () => {
              const result = await disseminationManager.save();
              if (!result.success) {
                showToast("Error al guardar: " + result.error, "error");
              }
            }}
            disabled={disseminationManager.isSaving}
          >
            {disseminationManager.isSaving ? "Guardando..." : "💾 Guardar cambios"}
          </button>
        </div>
      )}

      <div className="item-list">
        {disseminationManager.data.map((item) => (
          <div key={item.id} className="item-row">
            <div className="item-row-body">
              <input
                className="input"
                placeholder="Título de la divulgación *"
                value={item.title}
                onChange={(e) => {
                  disseminationManager.update(item.id, { title: e.target.value });
                }}
              />
              <div className="field-row mt-2">
                <input
                  className="input text-sm"
                  placeholder="Fecha (opcional)"
                  value={item.date || ""}
                  onChange={(e) => {
                    disseminationManager.update(item.id, { date: e.target.value || null });
                  }}
                />
                <input
                  className="input text-sm"
                  placeholder="Link (opcional)"
                  value={item.url || ""}
                  onChange={(e) => {
                    disseminationManager.update(item.id, { url: e.target.value || null });
                  }}
                />
              </div>
            </div>
            <div className="item-actions">
              <button 
                className="btn btn-icon btn-danger" 
                onClick={() => {
                  if (confirm("¿Eliminar divulgación?")) {
                    disseminationManager.remove(item.id);
                  }
                }}
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
        {disseminationManager.data.length === 0 && <div className="card text-center py-8"><p className="text-muted">No has agregado elementos aún.</p></div>}
      </div>
    </div>
  );
}
