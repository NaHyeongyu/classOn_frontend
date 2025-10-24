import { MarketingPageView } from "@/components/marketing/MarketingPageView";
import { useMarketingPage } from "@/features/marketing/hooks/useMarketingPage";

export default function MarketingPage() {
  const { filterProps, resultsProps } = useMarketingPage();
  return (
    <MarketingPageView
      filterProps={filterProps}
      resultsProps={resultsProps}
    />
  );
}
