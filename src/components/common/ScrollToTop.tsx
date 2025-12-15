import { useEffect } from "react";
import type { ReactElement } from "react";
import { useLocation } from "react-router-dom";

function scrollToTop() {
  if (typeof window === "undefined") return;
  const el = document.scrollingElement ?? document.documentElement;
  el.scrollTo({ top: 0, left: 0, behavior: "auto" });
}

export function ScrollToTop(): ReactElement | null {
  const location = useLocation();

  useEffect(() => {
    scrollToTop();
  }, [location.pathname, location.search]);

  return null;
}
