import { MarketingSummaryPageView } from "@/views/marketing/MarketingSummaryPageView";
import { useMarketingSummary } from "@/features/marketing/summary/useMarketingSummary";

export default function MarketingSummaryPage() {
  const { data, ui, actions } = useMarketingSummary();

  return (
    <MarketingSummaryPageView
      itemsCount={data.items.length}
      toneLabel={data.toneLabel}
      speechLabel={data.speechLabel}
      platformChoice={data.platformChoice}
      body={data.bodyInput}
      onBodyChange={ui.setBodyInput}
      tagInput={ui.tagInput}
      onTagInputChange={ui.setTagInput}
      tagsList={data.tagsList}
      tagCount={data.draft.tags.length}
      blogTitle={data.blogTitle}
      images={data.draft.images}
      currentImageIndex={ui.igImgIdx}
      onPrevImage={() => ui.setIgImgIdx((idx) => Math.max(0, idx - 1))}
      onNextImage={() =>
        ui.setIgImgIdx((idx) =>
          Math.min(data.draft.images.length - 1, idx + 1),
        )
      }
      onSelectImage={(index) => ui.setIgImgIdx(index)}
      canPrevImage={ui.igImgIdx > 0}
      canNextImage={ui.igImgIdx < data.draft.images.length - 1}
      onCopyBody={actions.copyBody}
      onCopyBodyAndTags={actions.copyBodyAndTags}
      onCopyTags={actions.copyTags}
      onSaveDraft={actions.saveDraft}
    />
  );
}
