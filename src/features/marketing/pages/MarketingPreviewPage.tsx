import { MarketingPreviewPageView } from "@/views/marketing/MarketingPreviewPageView";
import { useMarketingPreview } from "@/features/marketing/preview/useMarketingPreview";

export default function MarketingPreviewPage() {
  const preview = useMarketingPreview();
  return <MarketingPreviewPageView {...preview} />;
}
