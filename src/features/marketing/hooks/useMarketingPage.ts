import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listCourseRecords, type CourseRecord } from "@/api/courses";
import { useToast } from "@/components/common/Toast";
import { MAX_MARKETING_SELECTED_COURSES } from "@/features/marketing/constants";
import type {
  MarketingPlatform,
  MarketingPresetKey,
  MarketingSpeechStyle,
  MarketingTone,
} from "@/features/marketing/types";
import type { SummarizeItem } from "@/api/summarize";
import {
  formatRangeSummary,
  normalizeYMDInput,
  recordPreview,
  toErrorMessage,
  ymd,
} from "@/features/marketing/utils";
import { useMarketingCourses } from "@/features/marketing/hooks";

type PresetKey = MarketingPresetKey;
type RecordsByCourse = Record<number, CourseRecord[]>;

const PAGE_SIZE = 30;

export function useMarketingPage() {
  const { courses, loading: loadingCourses, error: coursesError } =
    useMarketingCourses();

  const [courseQuery, setCourseQuery] = useState("");
  const [selectedCourseIds, setSelectedCourseIds] = useState<number[]>([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [preset, setPreset] = useState<PresetKey | null>(null);

  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [results, setResults] = useState<RecordsByCourse>({});
  const [pagesByCourse, setPagesByCourse] = useState<Record<number, number>>({});
  const [hasMoreByCourse, setHasMoreByCourse] = useState<
    Record<number, boolean>
  >({});
  const [loadingByCourse, setLoadingByCourse] = useState<
    Record<number, boolean>
  >({});
  const [recordsError, setRecordsError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { error: showError, warning } = useToast();

  const filteredCourses = useMemo(() => {
    const q = courseQuery.trim().toLowerCase();
    if (!q) return courses;
    return courses.filter((course) =>
      course.title.toLowerCase().includes(q),
    );
  }, [courses, courseQuery]);

  const selectedCourses = useMemo(
    () => courses.filter((course) => selectedCourseIds.includes(course.id)),
    [courses, selectedCourseIds],
  );

  const todayYmd = useMemo(() => ymd(new Date()), []);

  const jsonData = useMemo(() => {
    const items: SummarizeItem[] = [];
    for (const course of selectedCourses) {
      const rows = results[course.id] || [];
      for (const record of rows) {
        const content = recordPreview(record);
        items.push({
          date: record.recordDate,
          content,
          courseTitle: course.title,
        });
      }
    }
    items.sort((a, b) => a.date.localeCompare(b.date));
    return items;
  }, [results, selectedCourses]);

  const courseSections = useMemo(
    () =>
      selectedCourses.map((course) => {
        const rows = (results[course.id] || [])
          .slice()
          .sort((a, b) => a.recordDate.localeCompare(b.recordDate));
        return { course, rows };
      }),
    [results, selectedCourses],
  );

  const totalRecords = useMemo(
    () => courseSections.reduce((acc, section) => acc + section.rows.length, 0),
    [courseSections],
  );

  const rangeSummary = useMemo(
    () => formatRangeSummary(from, to),
    [from, to],
  );

  const handleCourseQueryChange = useCallback((value: string) => {
    setCourseQuery(value);
  }, []);

  const handleClearSelectedCourses = useCallback(() => {
    setSelectedCourseIds([]);
  }, []);

  const handleFromChange = useCallback((value: string) => {
    const normalized = normalizeYMDInput(value);
    setFrom(normalized);
    setPreset(null);
  }, []);

  const handleToChange = useCallback((value: string) => {
    const normalized = normalizeYMDInput(value);
    setTo(normalized);
    setPreset(null);
  }, []);

  const toggleCourse = useCallback((id: number) => {
    setSelectedCourseIds((prev) => {
      const has = prev.includes(id);
      if (has) return prev.filter((courseId) => courseId !== id);
      if (prev.length >= MAX_MARKETING_SELECTED_COURSES) return prev;
      return [...prev, id];
    });
  }, []);

  const setPresetRange = useCallback((key: PresetKey, start: Date, end: Date) => {
    setFrom(ymd(start));
    setTo(ymd(end));
    setPreset(key);
  }, []);

  const applyPreset = useCallback(
    (key: PresetKey) => {
      const today = new Date();
      const end = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
      );
      if (key === "7d") {
        const start = new Date(end);
        start.setDate(end.getDate() - 6);
        setPresetRange(key, start, end);
      } else if (key === "30d") {
        const start = new Date(end);
        start.setDate(end.getDate() - 29);
        setPresetRange(key, start, end);
      } else if (key === "thisMonth") {
        const start = new Date(end.getFullYear(), end.getMonth(), 1);
        setPresetRange(key, start, end);
      } else if (key === "lastMonth") {
        const start = new Date(end.getFullYear(), end.getMonth() - 1, 1);
        const last = new Date(end.getFullYear(), end.getMonth(), 0);
        setPresetRange(key, start, last);
      }
    },
    [setPresetRange],
  );

  const fetchCoursePage = useCallback(
    async (courseId: number, nextPage: number) => {
      if (!from || !to) return;
      setLoadingByCourse((state) => ({ ...state, [courseId]: true }));
      try {
        const resp = await listCourseRecords(courseId, {
          from,
          to,
          page: nextPage,
          size: PAGE_SIZE,
        });
        setResults((prev) => {
          const before = prev[courseId] || [];
          const seen = new Set(before.map((record) => record.id));
          const merged = before.concat(
            resp.filter((record) => !seen.has(record.id)),
          );
          return { ...prev, [courseId]: merged };
        });
        setPagesByCourse((prev) => ({ ...prev, [courseId]: nextPage }));
        setHasMoreByCourse((prev) => ({
          ...prev,
          [courseId]: resp.length >= PAGE_SIZE,
        }));
      } finally {
        setLoadingByCourse((state) => ({ ...state, [courseId]: false }));
      }
    },
    [from, to],
  );

  const handleFetch = useCallback(async () => {
    if (!selectedCourseIds.length) {
      warning("수업을 하나 이상 선택해주세요.");
      return;
    }
    if (!from || !to) {
      warning("조회 기간(시작/종료일)을 선택해주세요.");
      return;
    }
    if (from > to) {
      showError(
        "조회 기간이 올바르지 않습니다. 시작일이 종료일보다 늦습니다.",
      );
      return;
    }
    try {
      setHasSearched(true);
      setLoading(true);
      setRecordsError(null);
      setResults({});
      const initPages: Record<number, number> = {};
      const initHas: Record<number, boolean> = {};
      const initLoad: Record<number, boolean> = {};
      for (const cid of selectedCourseIds) {
        initPages[cid] = -1;
        initHas[cid] = true;
        initLoad[cid] = false;
      }
      setPagesByCourse(initPages);
      setHasMoreByCourse(initHas);
      setLoadingByCourse(initLoad);
      await Promise.all(selectedCourseIds.map((cid) => fetchCoursePage(cid, 0)));
    } catch (err) {
      const message = toErrorMessage(err, "수업 내역을 불러오지 못했습니다.");
      setRecordsError(message);
      showError(message);
    } finally {
      setLoading(false);
    }
  }, [
    fetchCoursePage,
    from,
    selectedCourseIds,
    showError,
    to,
    warning,
  ]);

  const handleReset = useCallback(() => {
    setSelectedCourseIds([]);
    setCourseQuery("");
    setFrom("");
    setTo("");
    setPreset(null);
    setHasSearched(false);
    setResults({});
    setPagesByCourse({});
    setHasMoreByCourse({});
    setLoadingByCourse({});
  }, []);

  const handleLoadMore = useCallback(
    (courseId: number) => {
      if (!from || !to) return;
      if (loadingByCourse[courseId]) return;
      if (hasMoreByCourse[courseId] === false) return;
      const nextPage = (pagesByCourse[courseId] ?? 0) + 1;
      void fetchCoursePage(courseId, nextPage).catch((err) => {
        const message = toErrorMessage(
          err,
          "수업 내역을 불러오지 못했습니다.",
        );
        setRecordsError(message);
        showError(message);
      });
    },
    [
      fetchCoursePage,
      from,
      hasMoreByCourse,
      loadingByCourse,
      pagesByCourse,
      showError,
      to,
    ],
  );

  const handleSummarize = useCallback(() => {
    if (!totalRecords) {
      warning("먼저 조회를 실행해주세요.");
      return;
    }
    const items: SummarizeItem[] = jsonData;
    const speechStyle: MarketingSpeechStyle = "SEUMNIDA";
    const tone: MarketingTone = "WARM_VIVID";
    const platformChoice: MarketingPlatform = "INSTAGRAM";
    navigate("/marketing/generating", {
      state: { items, tone, speechStyle, platformChoice },
    });
  }, [jsonData, navigate, totalRecords, warning]);

  return {
    classSelectorProps: {
      courseQuery,
      onCourseQueryChange: handleCourseQueryChange,
      filteredCourses,
      selectedCourses,
      selectedCourseIds,
      onToggleCourse: toggleCourse,
      onClearSelected: handleClearSelectedCourses,
      maxSelectable: MAX_MARKETING_SELECTED_COURSES,
      loadingCourses,
      coursesError,
    },
    periodSelectorProps: {
      preset,
      onSelectPreset: applyPreset,
      from,
      to,
      onChangeFrom: handleFromChange,
      onChangeTo: handleToChange,
      rangeSummary,
      onSubmit: handleFetch,
      onReset: handleReset,
      loading,
    },
    resultsProps: {
      loading,
      hasSearched,
      courseSections,
      totalRecords,
      from,
      to,
      recordsError,
      loadingByCourse,
      hasMoreByCourse,
      onLoadMore: handleLoadMore,
      results,
      todayYmd,
      onSummarize: handleSummarize,
      canSummarize: Boolean(totalRecords),
    },
  };
}
