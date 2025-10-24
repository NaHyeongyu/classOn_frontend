import { DevToolsPageView } from "@/components/dev/DevToolsPageView";
import { useDevToolsPage } from "@/features/dev/useDevToolsPage";

export default function DevTools() {
  const state = useDevToolsPage();
  return <DevToolsPageView {...state} />;
}
