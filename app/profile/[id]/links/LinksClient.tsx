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
      <h1 className="section-heading">Links (Footer)</h1>
      <p className="section-subheading">Redes sociales y enlaces rápidos.</p>

      {/* LINKS */}
      <section className="card mt-6">
        <div className="border-b border-gray-200 pb-4 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-2">🔗 Links del Footer</h2>
          <p className="text-sm text-gray-600">Redes sociales, sitios web y enlaces importantes.</p>
        </div>
        
        <div className="flex justify-between items-center mb-4">
          <button 
            className="btn btn-primary" 
            onClick={() => linksManager.add({
              label: "",
              url: "",
              icon: null,
              order: linksManager.data.length,
            })}
          >
            + Agregar Link
          </button>
          
          <button 
            className="btn btn-success px-6 py-2 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200" 
            onClick={async () => {
              const result = await linksManager.save();
              if (result && !result.success) {
                showToast("Error al guardar: " + result.error, "error");
              }
            }}
            disabled={linksManager.isSaving || !linksManager.hasChanges}
          >
            {linksManager.isSaving ? "⏳ Guardando..." : "💾 Guardar cambios"}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {linksManager.data.map((item) => (
            <div key={item.id} className="card border border-gray-200 p-4">
              <div className="space-y-3">
                <input 
                  className="input" 
                  placeholder="Nombre del enlace *" 
                  value={item.label} 
                  onChange={(e) => linksManager.update(item.id, { label: e.target.value })} 
                />
                <input 
                  className="input text-sm" 
                  placeholder="URL del enlace *" 
                  value={item.url} 
                  onChange={(e) => linksManager.update(item.id, { url: e.target.value })} 
                />
              </div>
              <div className="flex justify-end mt-4">
                <button 
                  className="btn btn-sm btn-danger" 
                  onClick={() => {
                    if (confirm("¿Eliminar este enlace?")) {
                      linksManager.remove(item.id);
                    }
                  }}
                >
                  🗑️ Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {linksManager.data.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No hay enlaces agregados.</p>
          </div>
        )}
      </section>
    </div>
  );
}
