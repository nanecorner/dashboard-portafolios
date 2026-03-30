"use client";

import { useState } from "react";
import { useToast } from "@/components/Toast";

type Foot = { id: string; label: string; url: string; icon: string | null; order: number };

interface Props {
  profileId: string;
  footerLinks: Foot[];
}

export default function LinksClient({ profileId, footerLinks }: Props) {
  const { showToast, ToastComponent } = useToast();
  const [list, setList] = useState<Foot[]>(footerLinks);

  async function addItem() {
    try {
      const res = await fetch(`/api/profile/${profileId}/links`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          label: "Nuevo Link",
          url: "https://",
          icon: "link",
          order: list.length,
        }),
      });
      if (!res.ok) throw new Error();
      const newItem = await res.json();
      setList([...list, newItem]);
      showToast("Agregado");
    } catch {
      showToast("Error al agregar", "error");
    }
  }

  async function deleteItem(id: string) {
    if (!confirm("¿Eliminar este link?")) return;
    try {
      const res = await fetch(`/api/profile/${profileId}/links/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setList(list.filter((i) => i.id !== id));
      showToast("Eliminado");
    } catch {
      showToast("Error al eliminar", "error");
    }
  }

  async function saveItem(item: Foot) {
    if (!item.label || !item.url || item.url === "https://") {
      showToast("Etiqueta y URL son obligatorios", "error");
      return;
    }

    try {
      const res = await fetch(`/api/profile/${profileId}/links/${item.id}`, {
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
          <h1 className="section-heading">Links (Footer)</h1>
          <p className="section-subheading">Redes sociales y enlaces rápidos.</p>
        </div>
        <button className="btn btn-primary" onClick={addItem}>+ Nuevo Link</button>
      </div>

      <div className="item-list">
        {list.map((item) => (
          <div key={item.id} className="item-row">
            <div className="item-row-body">
              <div className="field-row">
                <input
                  className="input"
                  placeholder="Ej: Twitter, Web, etc."
                  value={item.label}
                  onChange={(e) => {
                    const newList = [...list];
                    newList.find((x) => x.id === item.id)!.label = e.target.value;
                    setList(newList);
                  }}
                />
                <input
                  className="input"
                  placeholder="https://..."
                  value={item.url}
                  onChange={(e) => {
                    const newList = [...list];
                    newList.find((x) => x.id === item.id)!.url = e.target.value;
                    setList(newList);
                  }}
                />
              </div>
            </div>
            <div className="item-actions">
              <button className="btn btn-icon btn-primary" onClick={() => saveItem(item)}>💾</button>
              <button className="btn btn-icon btn-danger" onClick={() => deleteItem(item.id)}>🗑️</button>
            </div>
          </div>
        ))}
        {list.length === 0 && <div className="card text-center py-8"><p className="text-muted">No has agregado links aún.</p></div>}
      </div>
    </div>
  );
}
