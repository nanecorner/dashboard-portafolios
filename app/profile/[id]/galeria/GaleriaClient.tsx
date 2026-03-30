"use client";

import { useState } from "react";
import { useToast } from "@/components/Toast";
import FileUpload from "@/components/FileUpload";

type Gallery = { id: string; imageUrl: string; shortName: string; description: string | null; order: number };

interface Props {
  profileId: string;
  galleryItems: Gallery[];
}

export default function GaleriaClient({ profileId, galleryItems }: Props) {
  const { showToast, ToastComponent } = useToast();
  const [list, setList] = useState<Gallery[]>(galleryItems);

  async function addItem() {
    try {
      const res = await fetch(`/api/profile/${profileId}/gallery`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl: "https://via.placeholder.com/300",
          shortName: "Nueva Foto",
          description: "",
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

  async function deleteItem(id: string) {
    if (!confirm("¿Eliminar de la galería?")) return;
    try {
      const res = await fetch(`/api/profile/${profileId}/gallery/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setList(list.filter((i) => i.id !== id));
      showToast("Eliminada");
    } catch {
      showToast("Error al eliminar", "error");
    }
  }

  async function saveItem(item: Gallery) {
    if (!item.shortName || !item.imageUrl || item.imageUrl.includes("placeholder")) {
      showToast("Imagen y título son obligatorios", "error");
      return;
    }

    try {
      const res = await fetch(`/api/profile/${profileId}/gallery/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
      if (!res.ok) throw new Error();
      showToast("Guardado");
    } catch {
      showToast("Error al guardar", "error");
    }
  }

  return (
    <div>
      <ToastComponent />
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="section-heading">Galería</h1>
          <p className="section-subheading">Fotos y descripciones cortas.</p>
        </div>
        <button className="btn btn-primary" onClick={addItem}>+ Nueva Foto</button>
      </div>

      <div className="profile-grid">
        {list.map((item) => (
          <div key={item.id} className="card">
            <FileUpload
              profileId={profileId}
              label="foto de galería"
              currentUrl={item.imageUrl}
              onUploaded={(url) => {
                const newList = [...list];
                newList.find((x) => x.id === item.id)!.imageUrl = url;
                setList(newList);
              }}
            />
            <div className="field mt-4">
              <label className="field-label">Título <span className="required">*</span></label>
              <input
                className="input"
                value={item.shortName}
                onChange={(e) => {
                  const newList = [...list];
                  newList.find((x) => x.id === item.id)!.shortName = e.target.value;
                  setList(newList);
                }}
              />
            </div>
            <div className="field mt-2">
              <label className="field-label">Descripción</label>
              <textarea
                className="input"
                rows={2}
                value={item.description || ""}
                onChange={(e) => {
                  const newList = [...list];
                  newList.find((x) => x.id === item.id)!.description = e.target.value;
                  setList(newList);
                }}
              />
            </div>
            <div className="flex gap-2 mt-4">
              <button className="btn btn-sm btn-primary" onClick={() => saveItem(item)}>💾 Guardar</button>
              <button className="btn btn-sm btn-danger" onClick={() => deleteItem(item.id)}>🗑️</button>
            </div>
          </div>
        ))}
        {list.length === 0 && <div className="card text-center py-8"><p className="text-muted">Galería vacía.</p></div>}
      </div>
    </div>
  );
}
