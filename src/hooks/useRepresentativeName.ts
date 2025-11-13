import { useEffect, useState } from "react";
import { fetchJSON } from "@/lib/fetcher";

export function useRepresentativeName() {
  const [repName, setRepName] = useState<string>("");
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const academy = await fetchJSON<{ representativeName?: string }>("/api/account/academy");
        if (!cancelled) setRepName((academy?.representativeName || "").trim());
      } catch {
        if (!cancelled) setRepName("");
      }
    })();
    return () => { cancelled = true; };
  }, []);
  return repName;
}

