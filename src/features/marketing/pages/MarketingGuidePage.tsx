import { MarketingGuidePageView } from "@/components/marketing/MarketingGuidePageView";
import { useMarketingGuidePage } from "@/features/marketing/hooks/useMarketingGuidePage";

export default function MarketingGuidePage() {
  const state = useMarketingGuidePage();

  return (
    <MarketingGuidePageView
      itemsCount={state.items.length}
      tone={state.tone}
      toneLabel={state.toneLabel}
      onToneChange={state.setTone}
      speechStyle={state.speechStyle}
      onSpeechStyleChange={state.setSpeechStyle}
      platformChoice={state.platformChoice}
      onPlatformChange={state.setPlatformChoice}
      direction={state.direction}
      onDirectionChange={state.setDirection}
      bullets={state.bullets}
      onAddBullet={state.addBullet}
      onChangeBullet={state.updateBullet}
      onRemoveBullet={(index) => {
        state.removeBullet(index);
      }}
      canProceed={state.canProceed}
      onGoNext={state.goNext}
      onGoBack={state.goBack}
      fxActive={state.fxActive}
      fxVariant={state.fxVariant}
      confirmDialog={state.confirmDialog}
    />
  );
}
