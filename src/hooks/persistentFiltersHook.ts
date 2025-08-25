import { useEffect, useState } from "react";
import { Filters } from "../components/Filters/type";

export const usePersistentFilters = (key: string, initial: Filters) => {
  const [filters, setFilters] = useState<Filters>(initial);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) setFilters(JSON.parse(raw));
    } catch (error) {
      console.error("Localstorage access failed:", error);
    }
  }, [key]);

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(filters));
  }, [key, filters]);

  return { filters, setFilters, reset: () => setFilters(initial) };
};
