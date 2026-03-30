"use client";

import { useState } from "react";
import { useToast } from "@/components/Toast";

type Dissemination = { id: string; title: string; date: string | null; url: string | null; order: number };

interface Props {
  profileId: string;
  disseminationItems: Dissemination[];
}

export default function DivulgacionClient({ profileId, disseminationItems }: Props) {
  const { showToast, ToastComponent } = useToast();
  const [list, setList] = useState<Dissemination[]>(disseminationItems);

  async function addItem() {
    try {
      const res = await fetch(`/api/profile/${profileId}/dissemination`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "Nueva Divulgación",
          date: "",
          url: "",
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
    if (!confirm("¿Eliminar divulgación?")) return;
    try {
      const res = await fetch(`/api/profile/${profileId}/dissemination/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setList(list.filter((i) => i.id !== id));
      showToast("Eliminada");
    } catch {
      showToast("Error al eliminar", "error");
    }
  }

  async function saveItem(item: Dissemination) {
    if (!item.title) {
      showToast("El título es obligatorio", "error");
      return;
    }

    try {
      const res = await fetch(`/api/profile/${profileId}/dissemination/${item.id}`, {
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
          <h1 className="section-heading">Divulgación y Difusión</h1>
          <p className="section-subheading">Entrevistas, conferencias y medios.</p>
        </div>
        <button className="btn btn-primary" onClick={addItem}>+ Nueva Divulgación</button>
      </div>

      <div className="item-list">
        {list.map((item) => (
          <div key={item.id} className="item-row">
            <div className="item-row-body">
              <input
                className="input"
                placeholder="Título de la divulgación *"
                value={item.title}
                onChange={(e) => {
                  const newList = [...list];
                  newList.find((x) => x.id === item.id)!.title = e.target.value;
                  setList(newList);
                }}
              />
              <div className="field-row mt-2">
                <input
                  className="input text-sm"
                  placeholder="Fecha (opcional)"
                  value={item.date || ""}
                  onChange={(e) => {
                    const newList = [...list];
                    newList.find((x) => x.id === item.id)!.date = e.target.value;
                    setList(newList);
                  }}
                />
                <input
                  className="input text-sm"
                  placeholder="Link (opcional)"
                  value={item.url || ""}
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
        {list.length === 0 && <div className="card text-center py-8"><p className="text-muted">No has agregado elementos aún.</p></div>}
      </div>
    </div>
  );
}
