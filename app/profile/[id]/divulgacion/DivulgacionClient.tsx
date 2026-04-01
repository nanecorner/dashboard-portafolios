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
      <h1 className="section-heading">Divulgación y Difusión</h1>
      <p className="section-subheading">Entrevistas, conferencias y medios.</p>

      {/* DIVULGACIÓN */}
      <section className="card mt-6">
        <div className="border-b border-gray-200 pb-4 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-2">🎤 Divulgación y Difusión</h2>
          <p className="text-sm text-gray-600">Entrevistas, conferencias, podcasts y apariciones en medios.</p>
        </div>
        
        <div className="flex justify-between items-center mb-4">
          <button 
            className="btn btn-primary" 
            onClick={() => disseminationManager.add({
              title: "",
              date: "",
              url: "",
              order: disseminationManager.data.length,
            })}
          >
            + Agregar Divulgación
          </button>
          
          <button 
            className="btn btn-success px-6 py-2 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200" 
            onClick={async () => {
              const result = await disseminationManager.save();
              if (result && !result.success) {
                showToast("Error al guardar: " + result.error, "error");
              }
            }}
            disabled={disseminationManager.isSaving || !disseminationManager.hasChanges}
          >
            {disseminationManager.isSaving ? "⏳ Guardando..." : "💾 Guardar cambios"}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {disseminationManager.data.map((item) => (
            <div key={item.id} className="card border border-gray-200 p-4">
              <div className="space-y-3">
                <input 
                  className="input" 
                  placeholder="Título de la divulgación *" 
                  value={item.title} 
                  onChange={(e) => disseminationManager.update(item.id, { title: e.target.value })} 
                />
                <input 
                  className="input text-sm" 
                  placeholder="Fecha de la divulgación *" 
                  value={item.date || ""} 
                  onChange={(e) => disseminationManager.update(item.id, { date: e.target.value || null })} 
                />
                <input 
                  className="input text-sm" 
                  placeholder="Enlace o URL *" 
                  value={item.url || ""} 
                  onChange={(e) => disseminationManager.update(item.id, { url: e.target.value || null })} 
                />
              </div>
              <div className="flex justify-end mt-4">
                <button 
                  className="btn btn-sm btn-danger" 
                  onClick={() => {
                    if (confirm("¿Eliminar esta divulgación?")) {
                      disseminationManager.remove(item.id);
                    }
                  }}
                >
                  🗑️ Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {disseminationManager.data.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No hay registros de divulgación.</p>
          </div>
        )}
      </section>
    </div>
  );
}
