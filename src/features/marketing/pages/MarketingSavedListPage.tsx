import { MarketingSavedListPageView } from "@/views/marketing/MarketingSavedListPageView";
import { useMarketingSavedListPage } from "@/features/marketing/hooks/useMarketingSavedListPage";

export default function MarketingSavedListPage() {
  const { state, handlers } = useMarketingSavedListPage();

  return (
    <MarketingSavedListPageView
      rows={state.rows}
      page={state.page}
      totalPages={state.totalPages}
      platform={state.platform}
      from={state.from}
      to={state.to}
      query={state.query}
      error={state.error}
      confirmDialog={state.confirmDialog}
      onPlatformChange={handlers.updatePlatform}
      onFromChange={(value) => handlers.updateFrom(value)}
      onToChange={(value) => handlers.updateTo(value)}
      onQueryChange={handlers.updateQuery}
      onSearch={() => handlers.goToPage(0)}
      onReset={handlers.resetFilters}
      onClearAll={() => {
        void handlers.clearAll();
      }}
      onOpenDetail={handlers.openDetail}
      onPrevPage={handlers.goPrevPage}
      onNextPage={handlers.goNextPage}
    />
  );
}
