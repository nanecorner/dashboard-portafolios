"use client";

import { useState } from "react";
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
  const [eduList, setEduList] = useState<Edu[]>(education);
  const [expList, setExpList] = useState<Exp[]>(experience);
  const [teaList, setTeaList] = useState<Tea[]>(teaching);
  const [showTeaching, setShowTeaching] = useState(teaching.length > 0);

  // Generic CRUD helpers
  async function addItem(type: string, data: any) {
    try {
      const res = await fetch(`/api/profile/${profileId}/${type}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      const newItem = await res.json();
      if (type === "education") setEduList([...eduList, newItem]);
      if (type === "experience") setExpList([...expList, newItem]);
      if (type === "teaching") setTeaList([...teaList, newItem]);
      showToast("Agregado correctamente");
    } catch {
      showToast("Error al agregar", "error");
    }
  }

  async function deleteItem(type: string, id: string) {
    if (!confirm("¿Eliminar este elemento?")) return;
    try {
      const res = await fetch(`/api/profile/${profileId}/${type}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      if (type === "education") setEduList(eduList.filter((i) => i.id !== id));
      if (type === "experience") setExpList(expList.filter((i) => i.id !== id));
      if (type === "teaching") setTeaList(teaList.filter((i) => i.id !== id));
      showToast("Eliminado");
    } catch {
      showToast("Error al eliminar", "error");
    }
  }

  return (
    <div>
      <ToastComponent />
      <h1 className="section-heading">Trayectoria</h1>
      <p className="section-subheading">Formación, experiencia y docencia.</p>

      {/* EDUCACIÓN */}
      <section className="card">
        <div className="card-header">
          <h2 className="card-title">Formación Educativa</h2>
          <button className="btn btn-sm btn-primary" onClick={() => addItem("education", { graduationDate: "2024", degree: "Nuevo Título", institution: "Institución", order: eduList.length })}>
            + Agregar
          </button>
        </div>
        <div className="item-list">
          {eduList.map((item) => (
            <div key={item.id} className="item-row">
              <div className="item-row-body">
                <input className="input" value={item.degree} onChange={(e) => {
                  const newList = [...eduList];
                  const i = newList.find(x => x.id === item.id);
                  if (i) i.degree = e.target.value;
                  setEduList(newList);
                }} />
                <div className="field-row mt-2">
                   <input className="input text-sm" placeholder="Fecha" value={item.graduationDate} onChange={(e) => {
                      const newList = [...eduList];
                      const i = newList.find(x => x.id === item.id);
                      if (i) i.graduationDate = e.target.value;
                      setEduList(newList);
                   }} />
                   <input className="input text-sm" placeholder="Institución" value={item.institution} onChange={(e) => {
                      const newList = [...eduList];
                      const i = newList.find(x => x.id === item.id);
                      if (i) i.institution = e.target.value;
                      setEduList(newList);
                   }} />
                </div>
                <div className="field-row mt-2">
                   <input className="input text-sm" placeholder="Ciudad" value={item.city || ""} onChange={(e) => {
                      const newList = [...eduList];
                      const i = newList.find(x => x.id === item.id);
                      if (i) i.city = e.target.value;
                      setEduList(newList);
                   }} />
                   <input className="input text-sm" placeholder="País" value={item.country || ""} onChange={(e) => {
                      const newList = [...eduList];
                      const i = newList.find(x => x.id === item.id);
                      if (i) i.country = e.target.value;
                      setEduList(newList);
                   }} />
                </div>
              </div>
              <div className="item-actions">
                <button className="btn btn-icon btn-primary" onClick={async () => {
                   await fetch(`/api/profile/${profileId}/education/${item.id}`, {
                     method: 'PATCH',
                     headers: { 'Content-Type': 'application/json' },
                     body: JSON.stringify(item)
                   });
                   showToast("Guardado");
                }}>💾</button>
                <button className="btn btn-icon btn-danger" onClick={() => deleteItem("education", item.id)}>🗑️</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* EXPERIENCIA */}
      <section className="card mt-6">
        <div className="card-header">
          <h2 className="card-title">Experiencia Profesional</h2>
          <button className="btn btn-sm btn-primary" onClick={() => addItem("experience", { startDate: "2024", title: "Nuevo Cargo", institution: "Lugar", order: expList.length })}>
            + Agregar
          </button>
        </div>
        <div className="item-list">
          {expList.map((item) => (
            <div key={item.id} className="item-row">
              <div className="item-row-body">
                <input className="input" value={item.title} onChange={(e) => {
                  const newList = [...expList];
                  const i = newList.find(x => x.id === item.id);
                  if (i) i.title = e.target.value;
                  setExpList(newList);
                }} />
                <div className="field-row mt-2">
                   <input className="input text-sm" placeholder="Inicio" value={item.startDate} onChange={(e) => {
                      const newList = [...expList];
                      const i = newList.find(x => x.id === item.id);
                      if (i) i.startDate = e.target.value;
                      setExpList(newList);
                   }} />
                   <input className="input text-sm" placeholder="Fin (o Presente)" value={item.endDate || ""} onChange={(e) => {
                      const newList = [...expList];
                      const i = newList.find(x => x.id === item.id);
                      if (i) i.endDate = e.target.value;
                      setExpList(newList);
                   }} />
                </div>
                <input className="input text-sm mt-2" placeholder="Institución" value={item.institution} onChange={(e) => {
                  const newList = [...expList];
                  const i = newList.find(x => x.id === item.id);
                  if (i) i.institution = e.target.value;
                  setExpList(newList);
                }} />
                <div className="field-row mt-2">
                   <input className="input text-sm" placeholder="Ciudad" value={item.city || ""} onChange={(e) => {
                      const newList = [...expList];
                      const i = newList.find(x => x.id === item.id);
                      if (i) i.city = e.target.value;
                      setExpList(newList);
                   }} />
                   <input className="input text-sm" placeholder="País" value={item.country || ""} onChange={(e) => {
                      const newList = [...expList];
                      const i = newList.find(x => x.id === item.id);
                      if (i) i.country = e.target.value;
                      setExpList(newList);
                   }} />
                </div>
              </div>
              <div className="item-actions">
                <button className="btn btn-icon btn-primary" onClick={async () => {
                   await fetch(`/api/profile/${profileId}/experience/${item.id}`, {
                     method: 'PATCH',
                     headers: { 'Content-Type': 'application/json' },
                     body: JSON.stringify(item)
                   });
                   showToast("Guardado");
                }}>💾</button>
                <button className="btn btn-icon btn-danger" onClick={() => deleteItem("experience", item.id)}>🗑️</button>
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
             <button className="btn btn-sm btn-primary" onClick={() => addItem("teaching", { curriculum: "Plan", course: "Nuevo Curso", institution: "Lugar", order: teaList.length })}>
               + Agregar
             </button>
           )}
        </div>
        
        {showTeaching ? (
          <div className="item-list">
            {teaList.map((item) => (
              <div key={item.id} className="item-row">
                <div className="item-row-body">
                  <input className="input" placeholder="Curso" value={item.course} onChange={(e) => {
                    const newList = [...teaList];
                    const i = newList.find(x => x.id === item.id);
                    if (i) i.course = e.target.value;
                    setTeaList(newList);
                  }} />
                  <div className="field-row mt-2">
                     <input className="input text-sm" placeholder="Plan de estudio" value={item.curriculum} onChange={(e) => {
                        const newList = [...teaList];
                        const i = newList.find(x => x.id === item.id);
                        if (i) i.curriculum = e.target.value;
                        setTeaList(newList);
                     }} />
                     <input className="input text-sm" placeholder="Lugar" value={item.institution} onChange={(e) => {
                        const newList = [...teaList];
                        const i = newList.find(x => x.id === item.id);
                        if (i) i.institution = e.target.value;
                        setTeaList(newList);
                     }} />
                  </div>
                  <div className="field-row mt-2">
                     <input className="input text-sm" placeholder="Ciudad" value={item.city || ""} onChange={(e) => {
                        const newList = [...teaList];
                        const i = newList.find(x => x.id === item.id);
                        if (i) i.city = e.target.value;
                        setTeaList(newList);
                     }} />
                     <input className="input text-sm" placeholder="País" value={item.country || ""} onChange={(e) => {
                        const newList = [...teaList];
                        const i = newList.find(x => x.id === item.id);
                        if (i) i.country = e.target.value;
                        setTeaList(newList);
                     }} />
                  </div>
                </div>
                <div className="item-actions">
                  <button className="btn btn-icon btn-primary" onClick={async () => {
                     await fetch(`/api/profile/${profileId}/teaching/${item.id}`, {
                       method: 'PATCH',
                       headers: { 'Content-Type': 'application/json' },
                       body: JSON.stringify(item)
                     });
                     showToast("Guardado");
                  }}>💾</button>
                  <button className="btn btn-icon btn-danger" onClick={() => deleteItem("teaching", item.id)}>🗑️</button>
                </div>
              </div>
            ))}
            {teaList.length === 0 && <p className="text-muted text-sm text-center py-4">No hay registros de docencia.</p>}
          </div>
        ) : (
          <p className="text-muted text-sm">La sección de docencia está oculta (no se mostrará en el portafolio si borras los registros o el frontend lo detecta).</p>
        )}
      </section>
    </div>
  );
}
