import {
  MarketingGeneratingEmptyState,
  MarketingGeneratingPageView,
} from "@/views/marketing/MarketingGeneratingPageView";
import { useMarketingGeneratingPage } from "@/features/marketing/hooks/useMarketingGeneratingPage";

export default function MarketingGeneratingPage() {
  const state = useMarketingGeneratingPage();

  if (!state.items.length) {
    return <MarketingGeneratingEmptyState onBackHome={state.goHome} />;
  }

  return (
    <MarketingGeneratingPageView
      itemsCount={state.items.length}
      progress={state.progress}
      error={state.error}
      onRetry={state.retry}
      onBackHome={state.goHome}
    />
  );
}
