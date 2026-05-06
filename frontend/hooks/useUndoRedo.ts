"use client";

import { useCallback, useState } from "react";

export function useUndoRedo<T>(initial: T) {
  const [past, setPast] = useState<T[]>([]);
  const [present, setPresent] = useState(initial);
  const [future, setFuture] = useState<T[]>([]);

  const set = useCallback((next: T | ((current: T) => T)) => {
    setPast((p) => [...p, present]);
    setPresent((current) => (typeof next === "function" ? (next as (c: T) => T)(current) : next));
    setFuture([]);
  }, [present]);

  const undo = useCallback(() => {
    setPast((p) => {
      if (!p.length) return p;
      const previous = p[p.length - 1];
      setFuture((f) => [present, ...f]);
      setPresent(previous);
      return p.slice(0, -1);
    });
  }, [present]);

  const redo = useCallback(() => {
    setFuture((f) => {
      if (!f.length) return f;
      const next = f[0];
      setPast((p) => [...p, present]);
      setPresent(next);
      return f.slice(1);
    });
  }, [present]);

  const canUndo = past.length > 0;
  const canRedo = future.length > 0;

  return { present, set, undo, redo, canUndo, canRedo, setPresent, setPast, setFuture };
}