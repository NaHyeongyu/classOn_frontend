import { MarketingSavedDetailPageView } from "@/components/marketing/MarketingSavedDetailPageView";
import { useMarketingSavedDetailPage } from "@/features/marketing/hooks/useMarketingSavedDetailPage";

export default function MarketingSavedDetailPage() {
  const { state, handlers } = useMarketingSavedDetailPage();

  return (
    <MarketingSavedDetailPageView
      record={state.record}
      createdAtLabel={state.createdAtLabel}
      tags={state.tags}
      confirmDialog={state.confirmDialog}
      onBack={handlers.handleBack}
      onCopy={handlers.handleCopy}
      onDelete={() => {
        void handlers.handleDelete();
      }}
    />
  );
}
