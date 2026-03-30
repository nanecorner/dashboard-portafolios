"use client";

import { useState } from "react";
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
  const [list, setList] = useState<Pub[]>(publications);

  async function addPub() {
    try {
      const res = await fetch(`/api/profile/${profileId}/publications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "Nueva Publicación",
          date: new Date().getFullYear().toString(),
          reference: "",
          order: list.length,
        }),
      });
      if (!res.ok) throw new Error();
      const newItem = await res.json();
      setList([...list, newItem]);
      showToast("Agregada");
    } catch {
      showToast("Error al agregar", "error");
    }
  }

  async function deletePub(id: string) {
    if (!confirm("¿Eliminar publicación?")) return;
    try {
      const res = await fetch(`/api/profile/${profileId}/publications/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setList(list.filter((i) => i.id !== id));
      showToast("Eliminada");
    } catch {
      showToast("Error al eliminar", "error");
    }
  }

  async function savePub(item: Pub) {
     if (!item.title || !item.date || (!item.pdfUrl && !item.externalUrl)) {
       showToast("Título, fecha y al menos un link (PDF o Externo) son obligatorios", "error");
       return;
     }

     try {
       const res = await fetch(`/api/profile/${profileId}/publications/${item.id}`, {
         method: 'PATCH',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(item)
       });
       if (!res.ok) throw new Error();
       showToast("Guardada");
     } catch {
       showToast("Error al guardar", "error");
     }
  }

  return (
    <div>
      <ToastComponent />
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="section-heading">Publicaciones</h1>
          <p className="section-subheading">Libros, artículos y documentos.</p>
        </div>
        <button className="btn btn-primary" onClick={addPub}>+ Nueva Publicación</button>
      </div>

      <div className="item-list">
        {list.map((item) => (
          <div key={item.id} className="card">
            <div className="field">
              <label className="field-label">Título <span className="required">*</span></label>
              <input className="input" value={item.title} onChange={(e) => {
                const newList = [...list];
                newList.find(x => x.id === item.id)!.title = e.target.value;
                setList(newList);
              }} />
            </div>

            <div className="field-row mt-4">
              <div className="field">
                <label className="field-label">Fecha <span className="required">*</span></label>
                <input className="input" placeholder="Ej: 2023" value={item.date} onChange={(e) => {
                  const newList = [...list];
                  newList.find(x => x.id === item.id)!.date = e.target.value;
                  setList(newList);
                }} />
              </div>
              <div className="field">
                <label className="field-label">Enlace Externo</label>
                <input className="input" placeholder="https://..." value={item.externalUrl || ""} onChange={(e) => {
                  const newList = [...list];
                  newList.find(x => x.id === item.id)!.externalUrl = e.target.value;
                  setList(newList);
                }} />
              </div>
            </div>

            <div className="field mt-4">
              <label className="field-label">Referencia (Bibliográfica)</label>
              <textarea className="textarea" rows={2} value={item.reference} onChange={(e) => {
                const newList = [...list];
                newList.find(x => x.id === item.id)!.reference = e.target.value;
                setList(newList);
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
                  const newList = [...list];
                  newList.find(x => x.id === item.id)!.pdfUrl = url;
                  setList(newList);
                }}
               />
            </div>

            <div className="flex gap-2 mt-6">
               <button className="btn btn-primary" onClick={() => savePub(item)}>💾 Guardar Publicación</button>
               <button className="btn btn-danger" onClick={() => deletePub(item.id)}>Eliminar</button>
            </div>
          </div>
        ))}

        {list.length === 0 && (
          <div className="empty-state">
            <p>No has agregado publicaciones aún.</p>
          </div>
        )}
      </div>
    </div>
  );
}
