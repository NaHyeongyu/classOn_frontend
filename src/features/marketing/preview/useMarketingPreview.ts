import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { SummarizeItem } from "@/api/summarize";
import type {
  MarketingFormatStyle,
  MarketingPlatform,
  MarketingSessionPayload,
  MarketingSpeechStyle,
} from "@/features/marketing/types";
import {
  buildDirections,
  buildInitialDirectionIndex,
  buildSpeechLabel,
  buildToneLabel,
  composeDirectionText,
} from "./utils";
import type { UseMarketingPreviewReturn } from "./types";

export function useMarketingPreview(): UseMarketingPreviewReturn {
  const location = useLocation();
  const navigate = useNavigate();
  const state = (location as { state?: MarketingSessionPayload }).state;

  const items: SummarizeItem[] = useMemo(() => state?.items ?? [], [state?.items]);
  const summary = state?.summary;
  const tone = state?.tone ?? "WARM_VIVID";

  const directions = useMemo(() => buildDirections(summary), [summary]);
  const initialDirectionIndex = useMemo(
    () => buildInitialDirectionIndex(directions, state),
    [directions, state]
  );

  const [directionText, setDirectionText] = useState(() => {
    const existing = state?.direction?.trim();
    if (existing) return existing;
    if (initialDirectionIndex !== null) {
      return composeDirectionText(directions, initialDirectionIndex);
    }
    return "";
  });
  const [selectedDirectionIndex, setSelectedDirectionIndex] = useState<number | null>(initialDirectionIndex);
  const [bullets, setBullets] = useState<string[]>(summary?.bullets ?? state?.bullets ?? []);
  const [speechStyle, setSpeechStyle] = useState<MarketingSpeechStyle>(state?.speechStyle ?? "SEUMNIDA");
  const [platformChoice, setPlatformChoice] = useState<MarketingPlatform>(state?.platformChoice ?? "INSTAGRAM");
  const [formatStyle, setFormatStyle] = useState<MarketingFormatStyle>(state?.formatStyle ?? "STORY");
  const [pendingDeleteIndex, setPendingDeleteIndex] = useState<number | null>(null);

  useEffect(() => {
    const existing = state?.direction?.trim();
    if (existing) {
      if (directionText !== existing) setDirectionText(existing);
      const nextIndex = typeof state?.selectedDirectionIndex === "number" ? state.selectedDirectionIndex : null;
      if (selectedDirectionIndex !== nextIndex) setSelectedDirectionIndex(nextIndex);
      return;
    }
    if (!directions.length) {
      if (directionText !== "") setDirectionText("");
      if (selectedDirectionIndex !== null) setSelectedDirectionIndex(null);
      return;
    }
    const fallbackIndex =
      typeof state?.selectedDirectionIndex === "number" &&
      state.selectedDirectionIndex >= 0 &&
      state.selectedDirectionIndex < directions.length
        ? state.selectedDirectionIndex
        : 0;
    const nextText = composeDirectionText(directions, fallbackIndex);
    if (selectedDirectionIndex !== fallbackIndex) setSelectedDirectionIndex(fallbackIndex);
    if (directionText !== nextText) setDirectionText(nextText);
  }, [directionText, directions, selectedDirectionIndex, state?.direction, state?.selectedDirectionIndex]);

  const toneLabel = useMemo(() => buildToneLabel(tone), [tone]);
  const speechLabel = useMemo(() => buildSpeechLabel(speechStyle), [speechStyle]);

  const handleSelectDirection = useCallback((index: number) => {
    setSelectedDirectionIndex(index);
    setDirectionText(composeDirectionText(directions, index));
  }, [directions]);

  const handleDirectionChange = useCallback((value: string) => {
    setDirectionText(value);
    setSelectedDirectionIndex(null);
  }, []);

  const handleAddBullet = useCallback(() => {
    setBullets((prev) => [...prev, ""]);
  }, []);

  const handleUpdateBullet = useCallback((index: number, value: string) => {
    setBullets((prev) => prev.map((bullet, idx) => (idx === index ? value : bullet)));
  }, []);

  const handleDeleteBullet = useCallback(() => {
    setBullets((prev) => {
      if (pendingDeleteIndex == null) return prev;
      return prev.filter((_, idx) => idx !== pendingDeleteIndex);
    });
    setPendingDeleteIndex(null);
  }, [pendingDeleteIndex]);

  const handleSpeechChange = useCallback((value: MarketingSpeechStyle) => {
    setSpeechStyle(value);
  }, []);

  const handlePlatformChange = useCallback((value: MarketingPlatform) => {
    setPlatformChoice(value);
  }, []);

  const handleFormatChange = useCallback((value: MarketingFormatStyle) => {
    setFormatStyle(value);
  }, []);

  const handleNext = useCallback(() => {
    navigate("/marketing/rendering", {
      state: {
        ...state,
        items,
        direction: directionText.trim(),
        bullets,
        tone,
        speechStyle,
        platformChoice,
        formatStyle,
        summary,
        selectedDirectionIndex,
      },
    });
  }, [navigate, state, items, directionText, bullets, tone, speechStyle, platformChoice, formatStyle, summary, selectedDirectionIndex]);

  return {
    state: {
      directionText,
      selectedDirectionIndex,
      bullets,
      speechStyle,
      platformChoice,
      formatStyle,
    },
    computed: {
      items,
      tone,
      toneLabel,
      speechLabel,
      directions,
      summary,
    },
    dialog: {
      pendingDeleteIndex,
      setPendingDeleteIndex,
    },
    handlers: {
      handleSelectDirection,
      handleDirectionChange,
      handleAddBullet,
      handleUpdateBullet,
      handleDeleteBullet,
      handleSpeechChange,
      handlePlatformChange,
      handleFormatChange,
      handleNext,
    },
  };
}
