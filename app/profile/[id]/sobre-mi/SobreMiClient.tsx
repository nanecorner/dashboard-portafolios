"use client";

import { useCrudManager } from "@/hooks/useCrudManager";
import { useToast } from "@/components/Toast";

type ResearchLine = { id: string; order: number; title: string; paragraphs: string[] };
type Award = { id: string; title: string; year: number | null };
type Society = { id: string; name: string };
type Collaboration = { id: string; name: string; url: string | null };
type Funding = { id: string; name: string; url: string | null };

interface Props {
  profileId: string;
  researchLines: ResearchLine[];
  awards: Award[];
  societies: Society[];
  collaborations: Collaboration[];
  fundings: Funding[];
}

export default function SobreMiClient({ 
  profileId,
  researchLines,
  awards,
  societies,
  collaborations,
  fundings
}: Props) {
  const { showToast, ToastComponent } = useToast();

  const researchManager = useCrudManager<ResearchLine>(researchLines, `/api/profile/${profileId}/researchLines`);
  const awardManager = useCrudManager<Award>(awards, `/api/profile/${profileId}/awards`);
  const societyManager = useCrudManager<Society>(societies, `/api/profile/${profileId}/societies`);
  const collabsManager = useCrudManager<Collaboration>(collaborations, `/api/profile/${profileId}/collaborations`);
  const fundingManager = useCrudManager<Funding>(fundings, `/api/profile/${profileId}/fundings`);

  return (
    <div className="pb-20">
      <ToastComponent />

      <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Sobre mí</h1>
          <p className="text-gray-600 mt-1">Añade información detallada sobre tu investigación, reconocimientos y colaboraciones.</p>
        </div>
      </div>

      {/* ── LÍNEAS DE INVESTIGACIÓN ── */}
      <section className="card mb-8">
        <div className="border-b border-gray-200 pb-4 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-2">🔍 Líneas de Investigación</h2>
          <p className="text-sm text-gray-600">Añade tus áreas principales de investigación y descríbelas.</p>
        </div>
        
        <div className="flex justify-between items-center mb-4">
          <button 
            className="btn btn-primary" 
            onClick={() => researchManager.add({ title: "", paragraphs: [], order: researchManager.data.length })}
          >
            + Agregar Línea
          </button>
          
          <button 
            className="btn btn-success px-6 py-2 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200" 
            onClick={async () => {
              const res = await researchManager.save();
              if (res?.success) showToast("Guardado");
              else if (res?.error) showToast(res.error, "error");
            }}
            disabled={!researchManager.hasChanges || researchManager.isSaving}
          >
            {researchManager.isSaving ? "⏳ Guardando..." : "💾 Guardar cambios"}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {researchManager.data.map((item) => (
            <div key={item.id} className="card border border-gray-200 p-4">
              <div className="space-y-3">
                <input 
                  className="input font-semibold" 
                  placeholder="Título de la línea *"
                  value={item.title} 
                  onChange={e => researchManager.update(item.id, { title: e.target.value })} 
                />
                <textarea 
                  className="textarea text-sm" 
                  rows={5} 
                  placeholder="Descripción detallada de la línea de investigación" 
                  value={item.paragraphs[0] || ""} 
                  onChange={e => {
                    researchManager.update(item.id, { paragraphs: [e.target.value] });
                  }} 
                />
              </div>
              <div className="flex justify-end mt-4">
                <button 
                  className="btn btn-sm btn-danger" 
                  onClick={() => {
                    if (confirm("¿Eliminar esta línea de investigación?")) {
                      researchManager.remove(item.id);
                    }
                  }}
                >
                  🗑️ Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
        {researchManager.data.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No hay líneas de investigación guardadas.</p>
          </div>
        )}
      </section>

      {/* RECONOCIMIENTOS */}
      <section className="card mt-8">
        <div className="border-b border-gray-200 pb-4 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-2">🏆 Reconocimientos</h2>
          <p className="text-sm text-gray-600">Premios, medallas o becas relevantes.</p>
        </div>
        
        <div className="flex justify-between items-center mb-4">
          <button className="btn btn-primary" onClick={() => awardManager.add({ title: "", year: new Date().getFullYear() })}>
            + Agregar Reconocimiento
          </button>
          <button 
            className="btn btn-success px-6 py-2 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200" 
            onClick={async () => {
              const res = await awardManager.save();
              if (res?.success) showToast("Guardado");
              else if (res?.error) showToast(res.error, "error");
            }} 
            disabled={!awardManager.hasChanges || awardManager.isSaving}
          >
            {awardManager.isSaving ? "⏳ Guardando..." : "💾 Guardar cambios"}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {awardManager.data.map(item => (
            <div key={item.id} className="card border border-gray-200 p-4">
              <div className="space-y-3">
                <input 
                  type="number" 
                  className="input" 
                  placeholder="Año" 
                  value={item.year || ""} 
                  onChange={e => awardManager.update(item.id, { year: e.target.value ? parseInt(e.target.value) : null })} 
                />
                <input 
                  className="input" 
                  placeholder="Título del reconocimiento *" 
                  value={item.title} 
                  onChange={e => awardManager.update(item.id, { title: e.target.value })} 
                />
              </div>
              <div className="flex justify-end mt-4">
                <button 
                  className="btn btn-sm btn-danger" 
                  onClick={() => {
                    if (confirm("¿Eliminar este reconocimiento?")) awardManager.remove(item.id);
                  }}
                >
                  🗑️ Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
        {awardManager.data.length === 0 && (
          <div className="text-center py-8 text-gray-500 text-sm">No hay registros de reconocimientos.</div>
        )}
      </section>

      {/* SOCIEDADES */}
      <section className="card mt-8">
        <div className="border-b border-gray-200 pb-4 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-2">👥 Sociedades Científicas</h2>
          <p className="text-sm text-gray-600">Pertenencia a colegios o asociaciones.</p>
        </div>
        
        <div className="flex justify-between items-center mb-4">
          <button className="btn btn-primary" onClick={() => societyManager.add({ name: "" })}>
            + Agregar Sociedad
          </button>
          <button 
            className="btn btn-success px-6 py-2 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200" 
            onClick={async () => {
              const res = await societyManager.save();
              if (res?.success) showToast("Guardado");
              else if (res?.error) showToast(res.error, "error");
            }} 
            disabled={!societyManager.hasChanges || societyManager.isSaving}
          >
            {societyManager.isSaving ? "⏳ Guardando..." : "💾 Guardar cambios"}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {societyManager.data.map(item => (
            <div key={item.id} className="card border border-gray-200 p-4">
              <div className="space-y-3">
                <input 
                  className="input" 
                  placeholder="Nombre de la sociedad *" 
                  value={item.name} 
                  onChange={e => societyManager.update(item.id, { name: e.target.value })} 
                />
              </div>
              <div className="flex justify-end mt-4">
                <button 
                  className="btn btn-sm btn-danger" 
                  onClick={() => {
                    if (confirm("¿Eliminar esta sociedad?")) societyManager.remove(item.id);
                  }}
                >
                  🗑️ Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
        {societyManager.data.length === 0 && (
          <div className="text-center py-8 text-gray-500 text-sm">No hay registros de sociedades.</div>
        )}
      </section>

      {/* COLABORACIONES */}
      <section className="card mt-8">
        <div className="border-b border-gray-200 pb-4 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-2">🤝 Colaboraciones Activas</h2>
          <p className="text-sm text-gray-600">Proyectos conjuntos o instituciones aliadas.</p>
        </div>
        
        <div className="flex justify-between items-center mb-4">
          <button className="btn btn-primary" onClick={() => collabsManager.add({ name: "", url: null })}>
            + Agregar Colaboración
          </button>
          <button 
            className="btn btn-success px-6 py-2 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200" 
            onClick={async () => {
              const res = await collabsManager.save();
              if (res?.success) showToast("Guardado");
              else if (res?.error) showToast(res.error, "error");
            }} 
            disabled={!collabsManager.hasChanges || collabsManager.isSaving}
          >
            {collabsManager.isSaving ? "⏳ Guardando..." : "💾 Guardar cambios"}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {collabsManager.data.map(item => (
            <div key={item.id} className="card border border-gray-200 p-4">
              <div className="space-y-3">
                <input 
                  className="input font-semibold" 
                  placeholder="Nombre de la colaboración *" 
                  value={item.name} 
                  onChange={e => collabsManager.update(item.id, { name: e.target.value })} 
                />
                <input 
                  className="input text-sm text-blue-600" 
                  placeholder="URL del sitio / proyecto (opcional)" 
                  value={item.url || ""} 
                  onChange={e => collabsManager.update(item.id, { url: e.target.value || null })} 
                />
              </div>
              <div className="flex justify-end mt-4">
                <button 
                  className="btn btn-sm btn-danger" 
                  onClick={() => {
                    if (confirm("¿Eliminar esta colaboración?")) collabsManager.remove(item.id);
                  }}
                >
                  🗑️ Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
        {collabsManager.data.length === 0 && (
          <div className="text-center py-8 text-gray-500 text-sm">No hay colaboraciones activas.</div>
        )}
      </section>

      {/* FINANCIAMIENTOS */}
      <section className="card mt-8">
        <div className="border-b border-gray-200 pb-4 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-2">💰 Financiamientos</h2>
          <p className="text-sm text-gray-600">Fondos o grants obtenidos para la investigación.</p>
        </div>
        
        <div className="flex justify-between items-center mb-4">
          <button className="btn btn-primary" onClick={() => fundingManager.add({ name: "", url: null })}>
            + Agregar Financiamiento
          </button>
          <button 
            className="btn btn-success px-6 py-2 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200" 
            onClick={async () => {
              const res = await fundingManager.save();
              if (res?.success) showToast("Guardado");
              else if (res?.error) showToast(res.error, "error");
            }} 
            disabled={!fundingManager.hasChanges || fundingManager.isSaving}
          >
            {fundingManager.isSaving ? "⏳ Guardando..." : "💾 Guardar cambios"}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {fundingManager.data.map(item => (
            <div key={item.id} className="card border border-gray-200 p-4">
              <div className="space-y-3">
                <input 
                  className="input font-semibold" 
                  placeholder="Nombre del financiamiento *" 
                  value={item.name} 
                  onChange={e => fundingManager.update(item.id, { name: e.target.value })} 
                />
                <input 
                  className="input text-sm text-blue-600" 
                  placeholder="URL del financiamiento (opcional)" 
                  value={item.url || ""} 
                  onChange={e => fundingManager.update(item.id, { url: e.target.value || null })} 
                />
              </div>
              <div className="flex justify-end mt-4">
                <button 
                  className="btn btn-sm btn-danger" 
                  onClick={() => {
                    if (confirm("¿Eliminar este financiamiento?")) fundingManager.remove(item.id);
                  }}
                >
                  🗑️ Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
        {fundingManager.data.length === 0 && (
          <div className="text-center py-8 text-gray-500 text-sm">No hay registros de financiamiento.</div>
        )}
      </section>

    </div>
  );
}
