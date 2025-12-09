import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useToast } from "@/components/common/Toast";
import { createSaved } from "@/api/marketingSaved";
import { saveMarketingPost } from "@/lib/savedMarketing";
import { invalidateCacheByPrefix } from "@/lib/fetcher";
import { MARKETING_SPEECH_STYLE_LABELS, MARKETING_TONE_LABELS } from "@/features/marketing/constants";
import type { UseMarketingSummaryResult, SummaryLocationState, PlatformChoice, SpeechStyle } from "./types";
import { composeDraft } from "./utils";

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

  const directionText = useMemo(() => locationState?.direction?.trim() ?? "", [locationState?.direction]);

  const draft = useMemo(
    () => composeDraft(locationState, platformChoice, speechStyle, directionText),
    [locationState, platformChoice, speechStyle, directionText]
  );

  const draftTagString = useMemo(() => draft.tags.join(" "), [draft.tags]);
  const [bodyInput, setBodyInput] = useState(draft.body);
  const [tagInput, setTagInput] = useState(draftTagString);
  useEffect(() => {
    setBodyInput(draft.body);
    setTagInput(draftTagString);
  }, [draft.body, draftTagString]);

  const [igImgIdx, setIgImgIdx] = useState(0);
  useEffect(() => {
    if (igImgIdx >= draft.images.length) {
      setIgImgIdx(0);
    }
  }, [igImgIdx, draft.images.length]);

  const tagsList = useMemo(() => tagInput.split(/\s+/).filter(Boolean), [tagInput]);
  const toneLabel = (MARKETING_TONE_LABELS as Record<string, string>)[tone] ?? tone;
  const speechLabel = (MARKETING_SPEECH_STYLE_LABELS as Record<string, string>)[speechStyle] ?? speechStyle;
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
    copyText(bodyInput, "본문을 복사했습니다.");
  }, [copyText, bodyInput]);

  const copyBodyAndTags = useCallback(() => {
    const combined = [bodyInput, tagsList.join(" ")].filter(Boolean).join("\n\n");
    copyText(combined, "본문과 태그를 복사했습니다.");
  }, [copyText, bodyInput, tagsList]);

  const copyTags = useCallback(() => {
    copyText(tagsList.join(" "), "태그를 복사했습니다.");
  }, [copyText, tagsList]);

  const saveDraft = useCallback(async () => {
    if (!bodyInput.trim() && tagsList.length === 0) {
      error("저장할 내용이 없습니다.");
      return;
    }
    try {
      const saved = await createSaved({
        platform: platformChoice,
        speechStyle,
        tone,
        title: blogTitle || undefined,
        body: bodyInput,
        tags: tagsList,
      });
      invalidateCacheByPrefix("/api/marketing/posts");
      success("저장되었습니다.");
      navigate(`/marketing/saved/${saved.id ?? ""}`);
    } catch {
      try {
        saveMarketingPost({
        platform: platformChoice,
        speechStyle,
        tone,
        title: blogTitle || undefined,
        body: bodyInput,
        tags: tagsList,
      });
        invalidateCacheByPrefix("/api/marketing/posts");
        success("오프라인으로 저장되었습니다.");
        navigate("/marketing/saved");
      } catch {
        error("저장에 실패했습니다.");
      }
    }
  }, [blogTitle, bodyInput, error, navigate, platformChoice, speechStyle, success, tagsList, tone]);

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
      draft,
      tagsList,
      blogTitle,
      bodyInput,
    },
    ui: {
      setBodyInput,
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
