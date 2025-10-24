import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useToast } from "@/components/common/Toast";
import { createSaved } from "@/api/marketingSaved";
import { saveMarketingPost } from "@/lib/savedMarketing";
import { MARKETING_SPEECH_STYLE_LABELS, MARKETING_TONE_LABELS } from "@/features/marketing/constants";
import type { UseMarketingSummaryResult, SummaryLocationState, PlatformChoice, SpeechStyle } from "./types";
import { composeDraft, computeDirectionText, resolveDirections } from "./utils";

export function useMarketingSummary(): UseMarketingSummaryResult {
  const location = useLocation() as { state?: SummaryLocationState };
  const navigate = useNavigate();
  const { success, error } = useToast();

  const locationState = location.state;

  const items = useMemo(() => locationState?.items ?? [], [locationState?.items]);
  const platformChoice: PlatformChoice = locationState?.platformChoice ?? "INSTAGRAM";
  const tone = locationState?.tone ?? "WARM_VIVID";
  const speechStyle: SpeechStyle = locationState?.speechStyle ?? "SEUMNIDA";
  const formatStyle = locationState?.formatStyle;

  const summaryDirections = useMemo(() => resolveDirections(locationState?.summary), [locationState?.summary]);
  const initialDirectionIndex = useMemo(() => {
    const idx = typeof locationState?.selectedDirectionIndex === "number" ? locationState.selectedDirectionIndex : null;
    if (idx == null) return null;
    return idx >= 0 && idx < summaryDirections.length ? idx : null;
  }, [locationState?.selectedDirectionIndex, summaryDirections.length]);

  const [selectedDirectionIndex, setSelectedDirectionIndex] = useState<number | null>(initialDirectionIndex);
  const [directionText, setDirectionText] = useState(() => computeDirectionText(locationState, summaryDirections, initialDirectionIndex));

  useEffect(() => {
    setDirectionText((prev) => {
      const next = computeDirectionText(locationState, summaryDirections, selectedDirectionIndex);
      return prev === next ? prev : next;
    });
  }, [locationState, summaryDirections, selectedDirectionIndex]);

  useEffect(() => {
    if (selectedDirectionIndex != null && selectedDirectionIndex >= summaryDirections.length) {
      setSelectedDirectionIndex(null);
    }
  }, [selectedDirectionIndex, summaryDirections.length]);

  const draft = useMemo(
    () => composeDraft(locationState, platformChoice, speechStyle, directionText),
    [locationState, platformChoice, speechStyle, directionText]
  );

  const draftTagString = useMemo(() => draft.tags.join(" "), [draft.tags]);
  const [tagInput, setTagInput] = useState(draftTagString);
  useEffect(() => {
    setTagInput(draftTagString);
  }, [draftTagString]);

  const [igImgIdx, setIgImgIdx] = useState(0);
  useEffect(() => {
    if (igImgIdx >= draft.images.length) {
      setIgImgIdx(0);
    }
  }, [igImgIdx, draft.images.length]);

  const tagsList = useMemo(() => tagInput.split(/\s+/).filter(Boolean), [tagInput]);
  const toneLabel = MARKETING_TONE_LABELS[tone] ?? tone;
  const speechLabel = MARKETING_SPEECH_STYLE_LABELS[speechStyle] ?? speechStyle;
  const blogTitle = platformChoice === "NAVER_BLOG" ? draft.title ?? "" : "";

  const copyText = useCallback(
    async (text: string, message: string) => {
      if (!text.trim()) {
        error("복사할 내용이 없습니다.");
        return;
      }
      try {
        await navigator.clipboard.writeText(text);
        success(message);
      } catch {
        error("복사에 실패했습니다.");
      }
    },
    [error, success]
  );

  const copyBody = useCallback(() => {
    copyText(draft.body, "본문을 복사했습니다.");
  }, [copyText, draft.body]);

  const copyBodyAndTags = useCallback(() => {
    const combined = [draft.body, tagsList.join(" ")].filter(Boolean).join("\n\n");
    copyText(combined, "본문과 태그를 복사했습니다.");
  }, [copyText, draft.body, tagsList]);

  const copyTags = useCallback(() => {
    copyText(tagsList.join(" "), "태그를 복사했습니다.");
  }, [copyText, tagsList]);

  const saveDraft = useCallback(async () => {
    if (!draft.body.trim() && tagsList.length === 0) {
      error("저장할 내용이 없습니다.");
      return;
    }
    try {
      const saved = await createSaved({
        platform: platformChoice,
        speechStyle,
        tone,
        title: blogTitle || undefined,
        body: draft.body,
        tags: tagsList,
      });
      success("저장되었습니다.");
      navigate(`/marketing/saved/${saved.id ?? ""}`);
    } catch {
      try {
        saveMarketingPost({
          platform: platformChoice,
          speechStyle,
          tone,
          title: blogTitle || undefined,
          body: draft.body,
          tags: tagsList,
        });
        success("오프라인으로 저장되었습니다.");
        navigate("/marketing/saved");
      } catch {
        error("저장에 실패했습니다.");
      }
    }
  }, [blogTitle, draft.body, error, navigate, platformChoice, speechStyle, success, tagsList, tone]);

  return {
    data: {
      items,
      summary: locationState?.summary,
      tone,
      toneLabel,
      speechStyle,
      speechLabel,
      platformChoice,
      formatStyle,
      directionText,
      summaryDirections: summaryDirections,
      selectedDirectionIndex,
      draft,
      tagsList,
      blogTitle,
    },
    ui: {
      tagInput,
      setTagInput,
      igImgIdx,
      setIgImgIdx,
    },
    actions: {
      copyBody,
      copyBodyAndTags,
      copyTags,
      saveDraft,
    },
  };
}
