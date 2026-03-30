"use client";

import { useState } from "react";
import { useCrudManager } from "@/hooks/useCrudManager";
import { useToast } from "@/components/Toast";

type Edu = { id: string; graduationDate: string; degree: string; institution: string; city: string | null; country: string | null; order: number };
type Exp = { id: string; startDate: string; endDate: string | null; title: string; institution: string; city: string | null; country: string | null; order: number };
type Tea = { id: string; curriculum: string; course: string; institution: string; city: string | null; country: string | null; order: number };

interface Props {
  profileId: string;
  education: Edu[];
  experience: Exp[];
  teaching: Tea[];
}

export default function TrayectoriaClient({ profileId, education, experience, teaching }: Props) {
  const { showToast, ToastComponent } = useToast();
  const [showTeaching, setShowTeaching] = useState(teaching.length > 0);

  // Managers para cada sección
  const educationManager = useCrudManager(
    education,
    `/api/profile/${profileId}/education`,
    () => showToast("Cambios de formación guardados")
  );

  const experienceManager = useCrudManager(
    experience,
    `/api/profile/${profileId}/experience`,
    () => showToast("Cambios de experiencia guardados")
  );

  const teachingManager = useCrudManager(
    teaching,
    `/api/profile/${profileId}/teaching`,
    () => showToast("Cambios de docencia guardados")
  );

  return (
    <div>
      <ToastComponent />
      <h1 className="section-heading">Trayectoria</h1>
      <p className="section-subheading">Formación, experiencia y docencia.</p>

      {/* EDUCACIÓN */}
      <section className="card">
        <div className="card-header">
          <h2 className="card-title">Formación Educativa</h2>
          <button 
            className="btn btn-sm btn-primary" 
            onClick={() => educationManager.add({ graduationDate: "2024", degree: "Nuevo Título", institution: "Institución", city: null, country: null, order: educationManager.data.length })}
          >
            + Agregar
          </button>
        </div>
        {educationManager.hasChanges && (
          <div className="card-header">
            <button 
              className="btn btn-sm btn-success" 
              onClick={async () => {
                const result = await educationManager.save();
                if (!result.success) {
                  showToast("Error al guardar: " + result.error, "error");
                }
              }}
              disabled={educationManager.isSaving}
            >
              {educationManager.isSaving ? "Guardando..." : "💾 Guardar cambios"}
            </button>
          </div>
        )}
        <div className="item-list">
          {educationManager.data.map((item) => (
            <div key={item.id} className="item-row">
              <div className="item-row-body">
                <input className="input" value={item.degree} onChange={(e) => {
                  educationManager.update(item.id, { degree: e.target.value });
                }} />
                <div className="field-row mt-2">
                   <input className="input text-sm" placeholder="Fecha" value={item.graduationDate} onChange={(e) => {
                      educationManager.update(item.id, { graduationDate: e.target.value });
                   }} />
                   <input className="input text-sm" placeholder="Institución" value={item.institution} onChange={(e) => {
                      educationManager.update(item.id, { institution: e.target.value });
                   }} />
                </div>
                <div className="field-row mt-2">
                   <input className="input text-sm" placeholder="Ciudad" value={item.city || ""} onChange={(e) => {
                      educationManager.update(item.id, { city: e.target.value || null });
                   }} />
                   <input className="input text-sm" placeholder="País" value={item.country || ""} onChange={(e) => {
                      educationManager.update(item.id, { country: e.target.value || null });
                   }} />
                </div>
              </div>
              <div className="item-actions">
                <button className="btn btn-icon btn-danger" onClick={() => {
                  if (confirm("¿Eliminar este elemento?")) {
                    educationManager.remove(item.id);
                  }
                }}>🗑️</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* EXPERIENCIA */}
      <section className="card mt-6">
        <div className="card-header">
          <h2 className="card-title">Experiencia Profesional</h2>
          <button 
            className="btn btn-sm btn-primary" 
            onClick={() => experienceManager.add({ startDate: "2024", title: "Nuevo Cargo", institution: "Lugar", city: null, country: null, endDate: null, order: experienceManager.data.length })}
          >
            + Agregar
          </button>
        </div>
        {experienceManager.hasChanges && (
          <div className="card-header">
            <button 
              className="btn btn-sm btn-success" 
              onClick={async () => {
                const result = await experienceManager.save();
                if (!result.success) {
                  showToast("Error al guardar: " + result.error, "error");
                }
              }}
              disabled={experienceManager.isSaving}
            >
              {experienceManager.isSaving ? "Guardando..." : "💾 Guardar cambios"}
            </button>
          </div>
        )}
        <div className="item-list">
          {experienceManager.data.map((item) => (
            <div key={item.id} className="item-row">
              <div className="item-row-body">
                <input className="input" value={item.title} onChange={(e) => {
                  experienceManager.update(item.id, { title: e.target.value });
                }} />
                <div className="field-row mt-2">
                   <input className="input text-sm" placeholder="Inicio" value={item.startDate} onChange={(e) => {
                      experienceManager.update(item.id, { startDate: e.target.value });
                   }} />
                   <input className="input text-sm" placeholder="Fin (o Presente)" value={item.endDate || ""} onChange={(e) => {
                      experienceManager.update(item.id, { endDate: e.target.value || null });
                   }} />
                </div>
                <input className="input text-sm mt-2" placeholder="Institución" value={item.institution} onChange={(e) => {
                  experienceManager.update(item.id, { institution: e.target.value });
                }} />
                <div className="field-row mt-2">
                   <input className="input text-sm" placeholder="Ciudad" value={item.city || ""} onChange={(e) => {
                      experienceManager.update(item.id, { city: e.target.value || null });
                   }} />
                   <input className="input text-sm" placeholder="País" value={item.country || ""} onChange={(e) => {
                      experienceManager.update(item.id, { country: e.target.value || null });
                   }} />
                </div>
              </div>
              <div className="item-actions">
                <button className="btn btn-icon btn-danger" onClick={() => {
                  if (confirm("¿Eliminar este elemento?")) {
                    experienceManager.remove(item.id);
                  }
                }}>🗑️</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* DOCENCIA */}
      <section className="card mt-6">
        <div className="card-header">
           <div className="flex items-center gap-2">
             <h2 className="card-title">Docencia</h2>
             <label className="switch" style={{ width: 34, height: 20 }}>
               <input type="checkbox" checked={showTeaching} onChange={(e) => setShowTeaching(e.target.checked)} />
               <span className="track"></span>
             </label>
           </div>
           {showTeaching && (
             <button 
               className="btn btn-sm btn-primary" 
               onClick={() => teachingManager.add({ curriculum: "Plan", course: "Nuevo Curso", institution: "Lugar", city: null, country: null, order: teachingManager.data.length })}
             >
               + Agregar
             </button>
           )}
        </div>
        {showTeaching && teachingManager.hasChanges && (
          <div className="card-header">
            <button 
              className="btn btn-sm btn-success" 
              onClick={async () => {
                const result = await teachingManager.save();
                if (!result.success) {
                  showToast("Error al guardar: " + result.error, "error");
                }
              }}
              disabled={teachingManager.isSaving}
            >
              {teachingManager.isSaving ? "Guardando..." : "💾 Guardar cambios"}
            </button>
          </div>
        )}
        
        {showTeaching ? (
          <div className="item-list">
            {teachingManager.data.map((item) => (
              <div key={item.id} className="item-row">
                <div className="item-row-body">
                  <input className="input" placeholder="Curso" value={item.course} onChange={(e) => {
                    teachingManager.update(item.id, { course: e.target.value });
                  }} />
                  <div className="field-row mt-2">
                     <input className="input text-sm" placeholder="Plan de estudio" value={item.curriculum} onChange={(e) => {
                        teachingManager.update(item.id, { curriculum: e.target.value });
                     }} />
                     <input className="input text-sm" placeholder="Lugar" value={item.institution} onChange={(e) => {
                        teachingManager.update(item.id, { institution: e.target.value });
                     }} />
                  </div>
                  <div className="field-row mt-2">
                     <input className="input text-sm" placeholder="Ciudad" value={item.city || ""} onChange={(e) => {
                        teachingManager.update(item.id, { city: e.target.value || null });
                     }} />
                     <input className="input text-sm" placeholder="País" value={item.country || ""} onChange={(e) => {
                        teachingManager.update(item.id, { country: e.target.value || null });
                     }} />
                  </div>
                </div>
                <div className="item-actions">
                  <button className="btn btn-icon btn-danger" onClick={() => {
                    if (confirm("¿Eliminar este elemento?")) {
                      teachingManager.remove(item.id);
                    }
                  }}>🗑️</button>
                </div>
              </div>
            ))}
            {teachingManager.data.length === 0 && <p className="text-muted text-sm text-center py-4">No hay registros de docencia.</p>}
          </div>
        ) : (
          <p className="text-muted text-sm">La sección de docencia está oculta (no se mostrará en el portafolio si borras los registros o el frontend lo detecta).</p>
        )}
      </section>
    </div>
  );
}
