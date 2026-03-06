import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface CatalogZone {
  id: string;
  name: string;
  sort_order: number;
}

interface CatalogTechnique {
  id: string;
  category: string;
  name: string;
  sort_order: number;
}

export function useCatalogZones() {
  const [zones, setZones] = useState<CatalogZone[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("catalog_zones")
      .select("*")
      .order("sort_order")
      .then(({ data }) => {
        if (data) setZones(data as any);
        setLoading(false);
      });
  }, []);

  return { zones, loading };
}

export function useCatalogTechniques() {
  const [techniques, setTechniques] = useState<CatalogTechnique[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("catalog_techniques")
      .select("*")
      .order("category")
      .order("sort_order")
      .then(({ data }) => {
        if (data) setTechniques(data as any);
        setLoading(false);
      });
  }, []);

  // Group by category
  const categories = [...new Set(techniques.map((t) => t.category))];
  const grouped = categories.map((cat) => ({
    title: cat,
    options: techniques.filter((t) => t.category === cat).map((t) => t.name),
  }));

  return { techniques, grouped, loading };
}
