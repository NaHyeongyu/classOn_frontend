import {
  MarketingRenderingEmptyState,
  MarketingRenderingPageView,
} from "@/components/marketing/MarketingRenderingPageView";
import { useMarketingRenderingPage } from "@/features/marketing/hooks/useMarketingRenderingPage";

export default function MarketingRenderingPage() {
  const state = useMarketingRenderingPage();

  if (!state.items.length) {
    return <MarketingRenderingEmptyState onBackHome={state.goHome} />;
  }

  return (
    <MarketingRenderingPageView
      progress={state.progress}
      error={state.error}
      helperText={state.helperText}
      onRetry={state.retry}
      onBackToPreview={state.goBackToPreview}
    />
  );
}
