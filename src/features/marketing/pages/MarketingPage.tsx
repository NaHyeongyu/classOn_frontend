import { MarketingPageView } from "@/views/marketing/MarketingPageView";
import { useMarketingPage } from "@/features/marketing/hooks/useMarketingPage";

export default function MarketingPage() {
  const { classSelectorProps, periodSelectorProps, resultsProps } = useMarketingPage();
  return (
    <MarketingPageView
      classSelectorProps={classSelectorProps}
      periodSelectorProps={periodSelectorProps}
      resultsProps={resultsProps}
    />
  );
}
