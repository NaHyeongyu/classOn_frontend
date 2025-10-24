import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  createCourseRecord,
  updateCourseRecord,
  type Course,
  type CourseRecord,
} from "@/api/courses";
import { invalidateCacheByPrefix } from "@/lib/fetcher";
import { readableError } from "@/lib/errors";
import {
  formatDateBadge,
  formatDuration,
  formatRange,
  getDurationMinutes,
  toHHMM,
  toHHMMSS,
} from "./utils";

const CONTENT_AUTO_SAVE_DELAY = 1500;

type Options = {
  courseId: number | null;
  course: Course | null;
  record: CourseRecord | null;
  setRecord: (record: CourseRecord) => void;
  ymd?: string | null;
  showError: (message: string) => void;
};

export function useCourseRecordEditor({
  courseId,
  course,
  record,
  setRecord,
  ymd,
  showError,
}: Options) {
  const [saving, setSaving] = useState<{ content?: boolean; when?: boolean }>(
    {}
  );
  const [contentFeedback, setContentFeedback] = useState<
    "idle" | "success"
  >("idle");
  const [contentValue, setContentValue] = useState<string>("");
  const contentAutoSaveTimerRef = useRef<number | null>(null);
  const lastSavedContentRef = useRef<string>("");
  const lastContentEditAtRef = useRef<number>(0);
  const lastContentSaveMetaRef = useRef<{ time: number; value: string } | null>(
    null
  );

  const [editingWhen, setEditingWhen] = useState(false);
  const [editDate, setEditDate] = useState<string>("");
  const [editStart, setEditStart] = useState<string>("");
  const [editEnd, setEditEnd] = useState<string>("");
  const [whenError, setWhenError] = useState<string | null>(null);

  const saveField = useCallback(
    async (
      patch: Partial<
        Pick<CourseRecord, "content" | "recordDate" | "startTime" | "endTime">
      >,
      key: keyof typeof saving
    ) => {
      if (!courseId || !record?.id) return;
      if (key === "content") setContentFeedback("idle");
      setSaving((state) => ({ ...state, [key]: true }));
      if (
        key === "content" &&
        Object.prototype.hasOwnProperty.call(patch, "content")
      ) {
        lastContentSaveMetaRef.current = {
          time: Date.now(),
          value: patch.content ?? "",
        };
      }
      try {
        const updated = await updateCourseRecord(courseId, record.id, patch);
        setRecord(updated);
        invalidateCacheByPrefix("/api/calendar/classes");
        invalidateCacheByPrefix("/api/calendar/classes-range");
        if (key === "content") setContentFeedback("success");
      } catch (error) {
        showError(readableError(error, "저장에 실패했습니다."));
      } finally {
        setSaving((state) => ({ ...state, [key]: false }));
      }
    },
    [courseId, record?.id, setRecord, showError]
  );

  const handleContentChange = useCallback((value: string) => {
    setContentValue(value);
    setContentFeedback("idle");
    lastContentEditAtRef.current = Date.now();
  }, []);

  useEffect(() => {
    const next = record?.content || "";
    const prevLastSaved = lastSavedContentRef.current;
    const saveMeta = lastContentSaveMetaRef.current;
    lastSavedContentRef.current = next;
    let appliedFromSaveMeta = false;
    setContentValue((prev) => {
      if (prev === next) return prev;
      if (saveMeta && lastContentEditAtRef.current <= saveMeta.time) {
        appliedFromSaveMeta = true;
        return next;
      }
      if (prev === prevLastSaved) return next;
      return prev;
    });
    if (appliedFromSaveMeta) {
      lastContentSaveMetaRef.current = null;
    }
  }, [record?.content]);

  useEffect(() => {
    if (!record?.id) return;
    if (saving.content) return;
    if (contentValue === lastSavedContentRef.current) return;
    if (contentAutoSaveTimerRef.current) {
      window.clearTimeout(contentAutoSaveTimerRef.current);
    }
    contentAutoSaveTimerRef.current = window.setTimeout(() => {
      contentAutoSaveTimerRef.current = null;
      void saveField({ content: contentValue }, "content");
    }, CONTENT_AUTO_SAVE_DELAY);
    return () => {
      if (contentAutoSaveTimerRef.current) {
        window.clearTimeout(contentAutoSaveTimerRef.current);
        contentAutoSaveTimerRef.current = null;
      }
    };
  }, [contentValue, record?.id, saveField, saving.content]);

  useEffect(() => {
    if (contentFeedback !== "success") return;
    const timer = window.setTimeout(() => setContentFeedback("idle"), 2500);
    return () => window.clearTimeout(timer);
  }, [contentFeedback]);

  const showCreationHint = !record?.id;
  const saveWhenDisabled = Boolean(saving.when);

  const whenInfo = useMemo(() => {
    const rawDate = record?.recordDate || ymd || "";
    const rangeLabel = formatRange(
      record?.startTime || course?.startTime,
      record?.endTime || course?.endTime
    );
    const dateLabel = rawDate ? formatDateBadge(rawDate) : "일자 미지정";
    const timeLabel = rangeLabel || "시간 미지정";
    return {
      dateLabel,
      timeLabel,
      hasDate: Boolean(record?.recordDate || ymd),
      hasTime: Boolean(rangeLabel),
    };
  }, [
    record?.recordDate,
    record?.startTime,
    record?.endTime,
    course?.startTime,
    course?.endTime,
    ymd,
  ]);

  const displayDateValue = record?.recordDate || "-";
  const displayTimeValue =
    formatRange(
      record?.startTime || course?.startTime,
      record?.endTime || course?.endTime
    ) || "-";
  const previewDateLabel = useMemo(
    () => formatDateBadge(editDate || record?.recordDate || ymd || ""),
    [editDate, record?.recordDate, ymd]
  );
  const previewDateEmpty = useMemo(
    () => !(editDate || record?.recordDate || ymd),
    [editDate, record?.recordDate, ymd]
  );
  const previewTimeLabel = useMemo(() => {
    if (editStart && editEnd) return formatRange(editStart, editEnd);
    return "시간 미지정";
  }, [editStart, editEnd]);
  const previewTimeEmpty = useMemo(
    () => !(editStart && editEnd),
    [editStart, editEnd]
  );

  const durationMin = useMemo(
    () =>
      getDurationMinutes(
        record?.startTime || course?.startTime,
        record?.endTime || course?.endTime
      ),
    [record?.startTime, record?.endTime, course?.startTime, course?.endTime]
  );
  const durationLabel = useMemo(
    () => formatDuration(durationMin),
    [durationMin]
  );

  const handleStartEditWhen = useCallback(() => {
    setEditingWhen(true);
    setWhenError(null);
    setEditDate(record?.recordDate || ymd || "");
    setEditStart(toHHMM(record?.startTime || course?.startTime || ""));
    setEditEnd(toHHMM(record?.endTime || course?.endTime || ""));
  }, [course?.endTime, course?.startTime, record?.endTime, record?.recordDate, record?.startTime, ymd]);

  const handleCancelEditWhen = useCallback(() => {
    setEditingWhen(false);
    setWhenError(null);
    setEditDate(record?.recordDate || ymd || "");
    setEditStart(toHHMM(record?.startTime || course?.startTime || ""));
    setEditEnd(toHHMM(record?.endTime || course?.endTime || ""));
  }, [course?.endTime, course?.startTime, record?.endTime, record?.recordDate, record?.startTime, ymd]);

  const saveWhen = useCallback(async () => {
    if (!courseId) return;
    const payload: {
      recordDate: string;
      startTime?: string;
      endTime?: string;
    } = {
      recordDate: editDate || ymd || "",
      startTime: toHHMMSS(editStart),
      endTime: toHHMMSS(editEnd),
    };
    setWhenError(null);
    if (record?.id) {
      await saveField(payload, "when");
      setEditingWhen(false);
      return;
    }
    setSaving((state) => ({ ...state, when: true }));
    try {
      const created = await createCourseRecord(courseId, payload);
      setRecord(created);
      setEditingWhen(false);
      invalidateCacheByPrefix("/api/calendar/classes");
      invalidateCacheByPrefix("/api/calendar/classes-range");
    } catch (error) {
      const msg = readableError(error, "");
      if (msg.includes("HTTP 409")) {
        setWhenError("이미 등록된 수업이 있습니다.");
      } else {
        setWhenError("기록 생성에 실패했습니다.");
      }
    } finally {
      setSaving((state) => ({ ...state, when: false }));
    }
  }, [
    courseId,
    editDate,
    editEnd,
    editStart,
    record?.id,
    saveField,
    setRecord,
    ymd,
  ]);

  const handleSaveWhen = useCallback(() => {
    void saveWhen();
  }, [saveWhen]);

  return {
    saving,
    content: {
      value: contentValue,
      onChange: handleContentChange,
      saving: Boolean(saving.content),
      feedback: contentFeedback,
    },
    schedule: {
      editing: editingWhen,
      editDate,
      setEditDate,
      editStart,
      setEditStart,
      editEnd,
      setEditEnd,
      whenError,
      showCreationHint,
      saveDisabled: saveWhenDisabled,
      onStartEdit: handleStartEditWhen,
      onCancelEdit: handleCancelEditWhen,
      onSave: handleSaveWhen,
    },
    meta: {
      whenInfo,
      displayDateValue,
      displayTimeValue,
      previewDateLabel,
      previewDateEmpty,
      previewTimeLabel,
      previewTimeEmpty,
      durationMin,
      durationLabel,
    },
  };
}

export type UseCourseRecordEditorReturn = ReturnType<typeof useCourseRecordEditor>;
