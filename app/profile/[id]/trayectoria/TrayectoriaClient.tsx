"use client";

import { useState } from "react";
import { useCrudManager } from "@/hooks/useCrudManager";
import { useToast } from "@/components/Toast";

type Edu = { id: string; graduationDate: string; degree: string; institution: string; city: string | null; country: string | null; order: number };
type Exp = { id: string; startDate: string; endDate: string | null; title: string; institution: string; city: string | null; country: string | null; order: number };
type Tea = { id: string; curriculum: string; course: string; institution: string; startDate: string | null; endDate: string | null; city: string | null; country: string | null; order: number };

interface Props {
  profileId: string;
  education: Edu[];
  experience: Exp[];
  teaching: Tea[];
}

export default function TrayectoriaClient({ profileId, education, experience, teaching }: Props) {
  const { showToast, ToastComponent } = useToast();

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

      {/* FORMACIÓN EDUCATIVA */}
      <section className="card mt-6">
        <div className="border-b border-gray-200 pb-4 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-2">🎓 Formación Educativa</h2>
          <p className="text-sm text-gray-600">Títulos académicos, certificaciones y estudios formales obtenidos.</p>
        </div>
        
        <div className="flex justify-between items-center mb-4">
          <button 
            className="btn btn-primary" 
            onClick={() => educationManager.add({ graduationDate: "", degree: "", institution: "", city: null, country: null, order: educationManager.data.length })}
          >
            + Agregar Formación
          </button>
          
          <button 
            className="btn btn-success px-6 py-2 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200" 
            onClick={async () => {
              const result = await educationManager.save();
              if (result && !result.success) {
                showToast("Error al guardar: " + result.error, "error");
              }
            }}
            disabled={educationManager.isSaving || !educationManager.hasChanges}
          >
            {educationManager.isSaving ? "⏳ Guardando..." : "💾 Guardar cambios"}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {educationManager.data.map((item) => (
            <div key={item.id} className="card border border-gray-200 p-4">
              <div className="space-y-3">
                <input 
                  className="input" 
                  placeholder="Título obtenido *" 
                  value={item.degree} 
                  onChange={(e) => educationManager.update(item.id, { degree: e.target.value })} 
                />
                <input 
                  className="input text-sm" 
                  placeholder="Fecha de titulación *" 
                  value={item.graduationDate} 
                  onChange={(e) => educationManager.update(item.id, { graduationDate: e.target.value })} 
                />
                <input 
                  className="input text-sm" 
                  placeholder="Institución educativa *" 
                  value={item.institution} 
                  onChange={(e) => educationManager.update(item.id, { institution: e.target.value })} 
                />
                <input 
                  className="input text-sm" 
                  placeholder="Ciudad *" 
                  value={item.city || ""} 
                  onChange={(e) => educationManager.update(item.id, { city: e.target.value || null })} 
                />
                <input 
                  className="input text-sm" 
                  placeholder="País *" 
                  value={item.country || ""} 
                  onChange={(e) => educationManager.update(item.id, { country: e.target.value || null })} 
                />
              </div>
              <div className="flex justify-end mt-4">
                <button 
                  className="btn btn-sm btn-danger" 
                  onClick={() => {
                    if (confirm("¿Eliminar esta formación?")) {
                      educationManager.remove(item.id);
                    }
                  }}
                >
                  🗑️ Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {educationManager.data.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No hay registros de formación educativa.</p>
          </div>
        )}
      </section>

      {/* EXPERIENCIA PROFESIONAL */}
      <section className="card mt-6">
        <div className="border-b border-gray-200 pb-4 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-2">💼 Experiencia Profesional</h2>
          <p className="text-sm text-gray-600">Trabajos, empleos y roles profesionales desempeñados.</p>
        </div>
        
        <div className="flex justify-between items-center mb-4">
          <button 
            className="btn btn-primary" 
            onClick={() => experienceManager.add({ startDate: "", title: "", institution: "", city: null, country: null, endDate: null, order: experienceManager.data.length })}
          >
            + Agregar Experiencia
          </button>
          
          <button 
            className="btn btn-success px-6 py-2 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200" 
            onClick={async () => {
              const result = await experienceManager.save();
              if (result && !result.success) {
                showToast("Error al guardar: " + result.error, "error");
              }
            }}
            disabled={experienceManager.isSaving || !experienceManager.hasChanges}
          >
            {experienceManager.isSaving ? "⏳ Guardando..." : "💾 Guardar cambios"}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {experienceManager.data.map((item) => (
            <div key={item.id} className="card border border-gray-200 p-4">
              <div className="space-y-3">
                <input 
                  className="input" 
                  placeholder="Cargo o posición *" 
                  value={item.title} 
                  onChange={(e) => experienceManager.update(item.id, { title: e.target.value })} 
                />
                <div className="grid grid-cols-2 gap-2">
                  <input 
                    className="input text-sm" 
                    placeholder="Fecha inicio *" 
                    value={item.startDate} 
                    onChange={(e) => experienceManager.update(item.id, { startDate: e.target.value })} 
                  />
                  <input 
                    className="input text-sm" 
                    placeholder="Fecha fin" 
                    value={item.endDate || ""} 
                    onChange={(e) => experienceManager.update(item.id, { endDate: e.target.value || null })} 
                  />
                </div>
                <input 
                  className="input text-sm" 
                  placeholder="Empresa o institución *" 
                  value={item.institution} 
                  onChange={(e) => experienceManager.update(item.id, { institution: e.target.value })} 
                />
                <div className="grid grid-cols-2 gap-2">
                  <input 
                    className="input text-sm" 
                    placeholder="Ciudad *" 
                    value={item.city || ""} 
                    onChange={(e) => experienceManager.update(item.id, { city: e.target.value || null })} 
                  />
                  <input 
                    className="input text-sm" 
                    placeholder="País *" 
                    value={item.country || ""} 
                    onChange={(e) => experienceManager.update(item.id, { country: e.target.value || null })} 
                  />
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <button 
                  className="btn btn-sm btn-danger" 
                  onClick={() => {
                    if (confirm("¿Eliminar esta experiencia?")) {
                      experienceManager.remove(item.id);
                    }
                  }}
                >
                  🗑️ Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {experienceManager.data.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No hay registros de experiencia profesional.</p>
          </div>
        )}
      </section>

      {/* DOCENCIA */}
      <section className="card mt-6">
        <div className="border-b border-gray-200 pb-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">📚 Docencia</h2>
            <p className="text-sm text-gray-600">Cursos impartidos, clases y experiencia académica.</p>
          </div>
        </div>
        
        <div className="flex justify-between items-center mb-4">
          <button 
            className="btn btn-primary" 
            onClick={() => teachingManager.add({ curriculum: "", course: "", institution: "", startDate: null, endDate: null, city: null, country: null, order: teachingManager.data.length })}
          >
            + Agregar Docencia
          </button>
          
          <button 
            className="btn btn-success px-6 py-2 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200" 
            onClick={async () => {
              const result = await teachingManager.save();
              if (result && !result.success) {
                showToast("Error al guardar: " + result.error, "error");
              }
            }}
            disabled={teachingManager.isSaving || !teachingManager.hasChanges}
          >
            {teachingManager.isSaving ? "⏳ Guardando..." : "💾 Guardar cambios"}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {teachingManager.data.map((item) => (
            <div key={item.id} className="card border border-gray-200 p-4">
              <div className="space-y-3">
                <input 
                  className="input" 
                  placeholder="Nombre del curso *" 
                  value={item.course} 
                  onChange={(e) => teachingManager.update(item.id, { course: e.target.value })} 
                />
                <input 
                  className="input text-sm" 
                  placeholder="Plan de estudio o programa *" 
                  value={item.curriculum} 
                  onChange={(e) => teachingManager.update(item.id, { curriculum: e.target.value })} 
                />
                <input 
                  className="input text-sm" 
                  placeholder="Institución educativa *" 
                  value={item.institution} 
                  onChange={(e) => teachingManager.update(item.id, { institution: e.target.value })} 
                />
                <div className="grid grid-cols-2 gap-2">
                  <input 
                    className="input text-sm" 
                    placeholder="Fecha inicio *" 
                    value={item.startDate || ""} 
                    onChange={(e) => teachingManager.update(item.id, { startDate: e.target.value || null })} 
                  />
                  <input 
                    className="input text-sm" 
                    placeholder="Fecha fin" 
                    value={item.endDate || ""} 
                    onChange={(e) => teachingManager.update(item.id, { endDate: e.target.value || null })} 
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input 
                    className="input text-sm" 
                    placeholder="Ciudad *" 
                    value={item.city || ""} 
                    onChange={(e) => teachingManager.update(item.id, { city: e.target.value || null })} 
                  />
                  <input 
                    className="input text-sm" 
                    placeholder="País *" 
                    value={item.country || ""} 
                    onChange={(e) => teachingManager.update(item.id, { country: e.target.value || null })} 
                  />
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <button 
                  className="btn btn-sm btn-danger" 
                  onClick={() => {
                    if (confirm("¿Eliminar esta docencia?")) {
                      teachingManager.remove(item.id);
                    }
                  }}
                >
                  🗑️ Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {teachingManager.data.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No hay registros de docencia.</p>
          </div>
        )}
      </section>
    </div>
  );
}
