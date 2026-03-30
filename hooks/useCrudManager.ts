"use client";

import { useState, useCallback, useRef } from "react";

type CrudOperation<T> = {
  type: 'create' | 'update' | 'delete';
  data?: T;
  id?: string;
  originalData?: T;
};

export function useCrudManager<T extends { id: string }>(
  initialData: T[],
  apiEndpoint: string,
  onSaveComplete?: () => void
) {
  const [data, setData] = useState<T[]>(initialData);
  const [changes, setChanges] = useState<CrudOperation<T>[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const originalDataRef = useRef<T[]>(initialData);

  // Detectar si hay cambios pendientes
  const hasChanges = changes.length > 0;

  // Agregar nuevo elemento (solo en memoria)
  const add = useCallback((newItem: Omit<T, 'id'>) => {
    const tempId = `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const itemWithId = { ...newItem, id: tempId } as T;
    
    setData(prev => [...prev, itemWithId]);
    setChanges(prev => [...prev, { type: 'create', data: itemWithId }]);
  }, []);

  // Actualizar elemento (solo en memoria)
  const update = useCallback((id: string, updates: Partial<T>) => {
    setData(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
    
    // Si es un elemento temporal, actualizar el create
    const existingChange = changes.find(c => c.type === 'create' && c.data?.id === id);
    if (existingChange && existingChange.data) {
      setChanges(prev => prev.map(c => 
        c.type === 'create' && c.data?.id === id 
          ? { ...c, data: { ...c.data, ...updates } as T }
          : c
      ));
    } else {
      // Si no es temporal, buscar el original y agregar update
      const original = originalDataRef.current.find(item => item.id === id);
      if (original) {
        const updatedItem = { ...original, ...updates } as T;
        setChanges(prev => {
          // Eliminar cualquier update previo para este mismo elemento
          const filtered = prev.filter(c => !(c.type === 'update' && c.id === id));
          return [...filtered, { type: 'update', id, data: updatedItem, originalData: original }];
        });
      }
    }
  }, [changes]);

  // Eliminar elemento (solo marcar para eliminar)
  const remove = useCallback((id: string) => {
    setData(prev => prev.filter(item => item.id !== id));
    
    // Si es un elemento temporal, eliminar el create
    const createChange = changes.find(c => c.type === 'create' && c.data?.id === id);
    if (createChange) {
      setChanges(prev => prev.filter(c => !(c.type === 'create' && c.data?.id === id)));
    } else {
      // Si no es temporal, agregar delete
      const original = originalDataRef.current.find(item => item.id === id);
      if (original) {
        setChanges(prev => {
          // Eliminar cualquier update previo para este mismo elemento
          const filtered = prev.filter(c => !(c.type === 'update' && c.id === id));
          return [...filtered, { type: 'delete', id, originalData: original }];
        });
      }
    }
  }, [changes]);

  // Guardar todos los cambios
  const save = useCallback(async () => {
    if (!hasChanges || isSaving) return;

    setIsSaving(true);
    
    try {
      // Ejecutar operaciones en orden: creates, updates, deletes
      const creates = changes.filter(c => c.type === 'create');
      const updates = changes.filter(c => c.type === 'update');
      const deletes = changes.filter(c => c.type === 'delete');

      // Procesar creates
      for (const change of creates) {
        if (!change.data) continue;
        
        const { id, ...dataWithoutId } = change.data;
        const res = await fetch(apiEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dataWithoutId),
        });
        
        if (!res.ok) throw new Error(`Error en create: ${res.statusText}`);
        const created = await res.json();
        
        // Reemplazar el elemento temporal con el real
        setData(prev => prev.map(item => 
          item.id === change.data?.id ? created : item
        ));
      }

      // Procesar updates
      for (const change of updates) {
        if (!change.id || !change.data) continue;
        
        const res = await fetch(`${apiEndpoint}/${change.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(change.data),
        });
        
        if (!res.ok) throw new Error(`Error en update: ${res.statusText}`);
      }

      // Procesar deletes
      for (const change of deletes) {
        if (!change.id) continue;
        
        const res = await fetch(`${apiEndpoint}/${change.id}`, {
          method: 'DELETE',
        });
        
        if (!res.ok) throw new Error(`Error en delete: ${res.statusText}`);
      }

      // Actualizar datos originales y limpiar cambios
      originalDataRef.current = [...data];
      setChanges([]);
      
      if (onSaveComplete) {
        onSaveComplete();
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error saving changes:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
    } finally {
      setIsSaving(false);
    }
  }, [hasChanges, isSaving, changes, data, apiEndpoint, onSaveComplete]);

  // Descartar todos los cambios
  const discard = useCallback(() => {
    setData(originalDataRef.current);
    setChanges([]);
  }, []);

  return {
    data,
    add,
    update,
    remove,
    save,
    discard,
    hasChanges,
    isSaving,
  };
}

// Hook para datos simples (no array) como el perfil
export function useSimpleCrudManager<T>(
  initialData: T,
  apiEndpoint: string,
  onSaveComplete?: () => void
) {
  const [data, setData] = useState<T>(initialData);
  const [originalData, setOriginalData] = useState<T>(initialData);
  const [isSaving, setIsSaving] = useState(false);

  // Detectar si hay cambios
  const hasChanges = JSON.stringify(data) !== JSON.stringify(originalData);

  // Actualizar datos
  const update = useCallback((updates: Partial<T>) => {
    setData(prev => ({ ...prev, ...updates }));
  }, []);

  // Guardar cambios
  const save = useCallback(async () => {
    if (!hasChanges || isSaving) return;

    setIsSaving(true);
    
    try {
      const res = await fetch(apiEndpoint, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!res.ok) throw new Error(`Error: ${res.statusText}`);
      
      setOriginalData(data);
      
      if (onSaveComplete) {
        onSaveComplete();
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error saving:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
    } finally {
      setIsSaving(false);
    }
  }, [hasChanges, isSaving, data, apiEndpoint, onSaveComplete]);

  // Descartar cambios
  const discard = useCallback(() => {
    setData(originalData);
  }, [originalData]);

  return {
    data,
    update,
    save,
    discard,
    hasChanges,
    isSaving,
  };
}
