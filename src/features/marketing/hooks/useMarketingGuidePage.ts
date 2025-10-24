import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { SummarizeItem } from "@/api/summarize";
import { useConfirmDialog } from "@/hooks/useConfirmDialog";
import type {
  MarketingPlatform,
  MarketingSpeechStyle,
  MarketingTone,
} from "@/features/marketing/types";

type LocationState = {
  items?: SummarizeItem[];
};

const TONE_LABEL: Record<MarketingTone, string> = {
  WARM_VIVID: "따뜻·생동",
  CONCISE_NEUTRAL: "담백·간결",
  TRUST_CALM: "차분·신뢰",
  UPBEAT_POSITIVE: "밝음·긍정",
};

export type UseMarketingGuidePageResult = {
  items: SummarizeItem[];
  direction: string;
  setDirection: (value: string) => void;
  bullets: string[];
  addBullet: () => void;
  updateBullet: (index: number, value: string) => void;
  removeBullet: (index: number) => Promise<void>;
  tone: MarketingTone;
  setTone: (value: MarketingTone) => void;
  toneLabel: string;
  speechStyle: MarketingSpeechStyle;
  setSpeechStyle: (value: MarketingSpeechStyle) => void;
  platformChoice: MarketingPlatform;
  setPlatformChoice: (value: MarketingPlatform) => void;
  canProceed: boolean;
  goNext: () => void;
  goBack: () => void;
  fxActive: boolean;
  fxVariant: number;
  confirmDialog: React.ReactNode;
};

export function useMarketingGuidePage(): UseMarketingGuidePageResult {
  const { state } = useLocation() as { state?: LocationState };
  const navigate = useNavigate();
  const items = state?.items ?? [];

  const [direction, setDirection] = useState("");
  const [bullets, setBullets] = useState<string[]>([]);
  const [tone, setTone] = useState<MarketingTone>("WARM_VIVID");
  const [speechStyle, setSpeechStyle] =
    useState<MarketingSpeechStyle>("SEUMNIDA");
  const [platformChoice, setPlatformChoice] =
    useState<MarketingPlatform>("INSTAGRAM");
  const [fxActive, setFxActive] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    },
    [],
  );

  const fxVariant = useMemo(() => ((Math.floor(Math.random() * 1000) % 3) + 1), []);

  const { confirm: confirmDelete, dialog: confirmDialog } = useConfirmDialog({
    confirmLabel: "삭제",
    cancelLabel: "취소",
    tone: "danger",
  });

  const canProceed = useMemo(() => {
    if (items.length === 0) return false;
    if (bullets.length < 2) return false;
    return bullets.every((bullet) => bullet.trim().length > 0);
  }, [bullets, items.length]);

  const addBullet = () => {
    setBullets((prev) => [...prev, ""]);
  };

  const updateBullet = (index: number, value: string) => {
    setBullets((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const removeBullet = async (index: number) => {
    const confirmed = await confirmDelete({
      title: "항목을 삭제할까요?",
      message: `#${index + 1} 핵심 문장을 삭제합니다.`,
    });
    if (!confirmed) return;
    setBullets((prev) => prev.filter((_, idx) => idx !== index));
  };

  const goNext = () => {
    if (!canProceed) return;
    setFxActive(true);
    timerRef.current = window.setTimeout(() => {
      navigate("/marketing/preview", {
        state: {
          items,
          direction,
          bullets,
          tone,
          speechStyle,
          platformChoice,
        },
      });
    }, 750);
  };

  const goBack = () => {
    navigate("/marketing");
  };

  return {
    items,
    direction,
    setDirection,
    bullets,
    addBullet,
    updateBullet,
    removeBullet,
    tone,
    setTone,
    toneLabel: TONE_LABEL[tone],
    speechStyle,
    setSpeechStyle,
    platformChoice,
    setPlatformChoice,
    canProceed,
    goNext,
    goBack,
    fxActive,
    fxVariant,
    confirmDialog,
  };
}
