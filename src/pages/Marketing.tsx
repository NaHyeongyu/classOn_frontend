import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { SectionCard, PrimaryButton, GhostBtnSmall as UIGhostBtnSmall, GhostButtonSmall, PageHeader } from "@/components/common/UI";
import { EmptyPlaceholder } from "@/components/common/EmptyPlaceholder";
import {
  listCourses,
  listCourseRecords,
  type Course,
  type CourseRecord,
} from "@/api/courses";
import { type SummarizeItem } from "@/api/summarize";
import { useToast } from "@/components/common/Toast";
// saved posts are shown on dedicated pages

type RecordsByCourse = Record<number, CourseRecord[]>;
type PresetKey = "7d" | "30d" | "thisMonth" | "lastMonth";

type CourseSection = {
  course: Course;
  rows: CourseRecord[];
};

type RangeSummary = {
  label: string;
  days: number | null;
};

export default function Marketing() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [coursesError, setCoursesError] = useState<string | null>(null);

  const [courseQuery, setCourseQuery] = useState("");
  const [selectedCourseIds, setSelectedCourseIds] = useState<number[]>([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [preset, setPreset] = useState<PresetKey | null>(null);

  const [loading, setLoading] = useState(false);
  const genLoading = false;
  const genError: string | null = null;
  const [hasSearched, setHasSearched] = useState(false);
  const [results, setResults] = useState<RecordsByCourse>({});
  const [pagesByCourse, setPagesByCourse] = useState<Record<number, number>>({});
  const [hasMoreByCourse, setHasMoreByCourse] = useState<Record<number, boolean>>({});
  const [loadingByCourse, setLoadingByCourse] = useState<Record<number, boolean>>({});
  // guide banner removed for a cleaner UI

  const navigate = useNavigate();
  const { error: showError, warning } = useToast();
  

  useEffect(() => {
    let cancelled = false;
    async function loadCourses() {
      try {
        setLoadingCourses(true);
        setCoursesError(null);
        const page = await listCourses({ status: "IN_PROGRESS", size: 500 });
        if (!cancelled) setCourses(page.content ?? []);
      } catch (err) {
        console.error(err);
        if (!cancelled)
          setCoursesError("수업 목록을 불러오는 데 실패했습니다.");
      } finally {
        if (!cancelled) setLoadingCourses(false);
      }
    }
    void loadCourses();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredCourses = useMemo(() => {
    const q = courseQuery.trim().toLowerCase();
    if (!q) return courses;
    return courses.filter((course) => course.title.toLowerCase().includes(q));
  }, [courses, courseQuery]);

  const selectedCourses = useMemo(
    () => courses.filter((course) => selectedCourseIds.includes(course.id)),
    [courses, selectedCourseIds]
  );

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

  const courseSections = useMemo<CourseSection[]>(
    () =>
      selectedCourses.map((course) => {
        const rows = (results[course.id] || [])
          .slice()
          .sort((a, b) => a.recordDate.localeCompare(b.recordDate));
        return { course, rows };
      }),
    [results, selectedCourses]
  );

  const totalRecords = useMemo(
    () => courseSections.reduce((acc, section) => acc + section.rows.length, 0),
    [courseSections]
  );

  const rangeSummary = useMemo<RangeSummary>(
    () => formatRangeSummary(from, to),
    [from, to]
  );

  function toggleCourse(id: number) {
    setSelectedCourseIds((prev) => {
      const has = prev.includes(id);
      if (has) return prev.filter((courseId) => courseId !== id);
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  }

  function ymd(d: Date) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const da = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${da}`;
  }

  function setPresetRange(key: PresetKey, start: Date, end: Date) {
    setFrom(ymd(start));
    setTo(ymd(end));
    setPreset(key);
  }

  function applyPreset(key: PresetKey) {
    const today = new Date();
    const end = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
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
  }

  // Normalize various user-typed date formats into YYYY-MM-DD
  function normalizeYMDInput(input: string): string {
    const s = (input || "").trim();
    if (!s) return "";
    // If already YYYY-MM-DD, return as-is
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
    // Accept YYYY.MM.DD or YYYY/MM/DD
    const ymdMatch = s.match(/^(\d{4})[./-]?(\d{2})[./-]?(\d{2})$/);
    if (ymdMatch) {
      const [, y, m, d] = ymdMatch;
      return `${y}-${m}-${d}`;
    }
    // Accept MM/DD/YYYY or MM.DD.YYYY
    const mdyMatch = s.match(/^(\d{1,2})[./-](\d{1,2})[./-](\d{4})$/);
    if (mdyMatch) {
      let [, mm, dd, yyyy] = mdyMatch;
      mm = String(mm).padStart(2, '0');
      dd = String(dd).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}`;
    }
    // Compact 8-digit forms:
    const digits = s.replace(/\D/g, "");
    if (digits.length === 8) {
      if (/^\d{4}/.test(digits)) {
        const y = digits.slice(0, 4), m = digits.slice(4, 6), d = digits.slice(6, 8);
        return `${y}-${m}-${d}`;
      } else {
        const m = digits.slice(0, 2), d = digits.slice(2, 4), y = digits.slice(4, 8);
        return `${y}-${m}-${d}`;
      }
    }
    return s;
  }

  const PAGE_SIZE = 30;

  async function fetchCoursePage(courseId: number, nextPage: number) {
    if (!from || !to) return;
    setLoadingByCourse(m => ({ ...m, [courseId]: true }));
    try {
      const resp = await listCourseRecords(courseId, { from, to, page: nextPage, size: PAGE_SIZE });
      setResults(prev => {
        const before = prev[courseId] || [];
        const seen = new Set(before.map(r => r.id));
        const merged = before.concat(resp.filter(r => !seen.has(r.id)));
        return { ...prev, [courseId]: merged };
      });
      setPagesByCourse(p => ({ ...p, [courseId]: nextPage }));
      setHasMoreByCourse(h => ({ ...h, [courseId]: (resp.length >= PAGE_SIZE) }));
    } finally {
      setLoadingByCourse(m => ({ ...m, [courseId]: false }));
    }
  }

  async function handleFetch() {
    if (!selectedCourseIds.length) { warning("수업을 하나 이상 선택해주세요."); return; }
    if (!from || !to) { warning("조회 기간(시작/종료일)을 선택해주세요."); return; }
    if (from > to) { showError("조회 기간이 올바르지 않습니다. 시작일이 종료일보다 늦습니다."); return; }
    try {
      setHasSearched(true);
      setLoading(true);
      // reset maps and load first pages
      setResults({});
      const initPages: Record<number, number> = {};
      const initHas: Record<number, boolean> = {};
      const initLoad: Record<number, boolean> = {};
      for (const cid of selectedCourseIds) { initPages[cid] = -1; initHas[cid] = true; initLoad[cid] = false; }
      setPagesByCourse(initPages);
      setHasMoreByCourse(initHas);
      setLoadingByCourse(initLoad);
      await Promise.all(selectedCourseIds.map(cid => fetchCoursePage(cid, 0)));
    } catch (err) {
      console.error(err);
      showError("수업 내역을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
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
  }

  async function handleSummarize() {
    if (!totalRecords) { warning("먼저 조회를 실행해주세요."); return; }
    const items: SummarizeItem[] = jsonData;
    const speechStyle: 'SEUMNIDA'|'YO' = 'SEUMNIDA';
    const tone = 'WARM_VIVID';
    const platformChoice = 'INSTAGRAM' as const;
    navigate('/marketing/generating', { state: { items, tone, speechStyle, platformChoice } });
  }

  return (
    <Viewport>
      <HeaderWrap>
        <PageHeader>
          <div>
            <h2>마케팅</h2>
            <p>수업 기록을 모아 AI 요약과 콘텐츠로 이어가세요.</p>
          </div>
          <HeaderActions>
            <UIGhostBtnSmall to="/marketing/saved">저장 내역</UIGhostBtnSmall>
            <UIGhostBtnSmall to="/classes">수업 관리</UIGhostBtnSmall>
          </HeaderActions>
        </PageHeader>
        {/* Guide banner removed */}
      </HeaderWrap>

      <ContentGrid>
        <FilterColumn>
          <FilterCard>
            <PanelHeader>
              <PanelTitle>수업 내역 조회</PanelTitle>
              <PanelSub>
                수업을 선택하고 기간을 지정해 기록을 불러올 수 있어요.
              </PanelSub>
            </PanelHeader>

            <FilterBody>
              <FieldBlock>
                <SearchBar>
                  <SearchInput
                    id="course-search"
                    placeholder="수업을 검색해 선택하세요"
                    value={courseQuery}
                    onChange={(event) => setCourseQuery(event.target.value)}
                  />
                </SearchBar>
                {loadingCourses ? (
                  <CardHint>수업을 불러오는 중입니다…</CardHint>
                ) : null}
                {coursesError ? <CardError>{coursesError}</CardError> : null}
              </FieldBlock>

              <FieldBlock>
                <FieldHead>
                  <FieldLabel>수업 선택</FieldLabel>
                  <FieldMeta>
                    <span>선택 {selectedCourseIds.length}/3</span>
                    {selectedCourseIds.length > 0 ? (
                      <SmallLink type="button" onClick={() => setSelectedCourseIds([])}>전체 해제</SmallLink>
                    ) : null}
                  </FieldMeta>
                </FieldHead>
                {selectedCourses.length > 0 ? (
                  <SelectedChips>
                    {selectedCourses.map((c) => (
                      <Chip key={c.id}>
                        <span className="t">{c.title}</span>
                        <button type="button" aria-label="제거" onClick={() => toggleCourse(c.id)}>×</button>
                      </Chip>
                    ))}
                  </SelectedChips>
                ) : null}
                <CourseListWrap>
                  <CourseList role="list" aria-label="수업 목록">
                    {filteredCourses.map((course) => {
                      const selected = selectedCourseIds.includes(course.id);
                      const atLimit =
                        !selected && selectedCourseIds.length >= 3;
                      return (
                        <CourseButton
                          key={course.id}
                          type="button"
                          role="listitem"
                          data-selected={selected || undefined}
                          data-disabled={atLimit || undefined}
                          onClick={() => {
                            if (!atLimit || selected) toggleCourse(course.id);
                          }}
                        >
                          <div className="title">{course.title}</div>
                          <div className="meta">{formatCourseMeta(course)}</div>
                        </CourseButton>
                      );
                    })}
                  </CourseList>
                </CourseListWrap>
                {!selectedCourseIds.length ? (
                  <CardHint>최대 3개까지 선택할 수 있어요.</CardHint>
                ) : null}
              </FieldBlock>

              <FieldBlock>
                <FieldLabel>빠른 기간 선택</FieldLabel>
                <QuickGrid>
                  <QuickButton
                    type="button"
                    data-active={preset === "7d"}
                    onClick={() => applyPreset("7d")}
                  >
                    최근 7일
                  </QuickButton>
                  <QuickButton
                    type="button"
                    data-active={preset === "30d"}
                    onClick={() => applyPreset("30d")}
                  >
                    최근 30일
                  </QuickButton>
                  <QuickButton
                    type="button"
                    data-active={preset === "thisMonth"}
                    onClick={() => applyPreset("thisMonth")}
                  >
                    이번 달
                  </QuickButton>
                  <QuickButton
                    type="button"
                    data-active={preset === "lastMonth"}
                    onClick={() => applyPreset("lastMonth")}
                  >
                    지난 달
                  </QuickButton>
                </QuickGrid>
              </FieldBlock>

              <FieldBlock>
                <FieldLabel>직접 선택</FieldLabel>
                <DateRow>
                  <DateField>
                    <span>시작일</span>
                    <DateInput
                      type="date"
                      lang="ko-KR"
                      inputMode="numeric"
                      pattern="^\\d{4}-\\d{2}-\\d{2}$"
                      placeholder="YYYY-MM-DD"
                      onFocus={(e) => { try { (e.currentTarget as any).showPicker?.(); } catch {} }}
                      value={from}
                      onChange={(event) => {
                        const v = normalizeYMDInput(event.target.value);
                        setFrom(v);
                        setPreset(null);
                      }}
                      onBlur={(e) => {
                        const v = normalizeYMDInput(e.currentTarget.value);
                        if (v !== from) setFrom(v);
                      }}
                    />
                  </DateField>
                  <DateField>
                    <span>종료일</span>
                    <DateInput
                      type="date"
                      lang="ko-KR"
                      inputMode="numeric"
                      pattern="^\\d{4}-\\d{2}-\\d{2}$"
                      placeholder="YYYY-MM-DD"
                      onFocus={(e) => { try { (e.currentTarget as any).showPicker?.(); } catch {} }}
                      value={to}
                      onChange={(event) => {
                        const v = normalizeYMDInput(event.target.value);
                        setTo(v);
                        setPreset(null);
                      }}
                      onBlur={(e) => {
                        const v = normalizeYMDInput(e.currentTarget.value);
                        if (v !== to) setTo(v);
                      }}
                    />
                  </DateField>
                </DateRow>
                <RangeSummaryText>
                  {rangeSummary.label}
                  {rangeSummary.days ? ` · 총 ${rangeSummary.days}일` : null}
                </RangeSummaryText>
              </FieldBlock>
            </FilterBody>
            <StickyActions>
              <ActionRow>
                <PrimaryButton
                  type="button"
                  onClick={handleFetch}
                  disabled={loading}
                >
                  {loading ? "조회 중..." : "조회하기"}
                </PrimaryButton>
                <GhostButtonSmall
                  as="button"
                  type="button"
                  onClick={handleReset}
                >
                  초기화
                </GhostButtonSmall>
              </ActionRow>
            </StickyActions>
          </FilterCard>
        </FilterColumn>

        <ResultColumn>
          <ResultCard>
            <PanelHeader>
              <PanelTitle>조회 결과</PanelTitle>
              <PanelSub>
                선택한 수업과 기간에 해당하는 기록이 표시돼요.
              </PanelSub>
            </PanelHeader>

            <ResultBody>
              {loading ? (
                <EmptyPlaceholder title="조회 중입니다..." />
              ) : !hasSearched ? (
                <EmptyPlaceholder title="수업을 선택하고 기간을 설정한 후 조회해주세요." />
              ) : !courseSections.length ? (
                <EmptyPlaceholder title="선택한 수업이 없어요. 왼쪽에서 수업을 선택해주세요." />
              ) : totalRecords === 0 ? (
                <EmptyPlaceholder title="선택한 기간에 해당하는 수업 기록이 없습니다." />
              ) : (
                <ResultContent>
                  <ResultMeta>
                    <span>총 {totalRecords}건</span>
                    {from && to ? (
                      <span>
                        {from} ~ {to}
                      </span>
                    ) : null}
                  </ResultMeta>

                  <SectionStack>
                    {courseSections.map(({ course, rows }) => (
                      <ResultSection key={course.id}>
                        <ResultSectionHeader>
                          <span className="title">{course.title}</span>
                          <span className="count">{(results[course.id]?.length || 0)}건</span>
                        </ResultSectionHeader>
                        <RecordList>
                          {rows.map((record) => (
                            <RecordItem key={`${course.id}:${record.id}`}>
                              <RecordDate>
                                {formatKoreanDate(record.recordDate)}
                              </RecordDate>
                              <RecordText>{recordPreview(record)}</RecordText>
                            </RecordItem>
                          ))}
                          <Sentinel onVisible={() => {
                            const cid = course.id;
                            if (loadingByCourse[cid]) return;
                            if (hasMoreByCourse[cid] === false) return;
                            const next = (pagesByCourse[cid] ?? 0) + 1;
                            void fetchCoursePage(cid, next);
                          }}>
                            {loadingByCourse[course.id] ? (
                              <span style={{ color:'#64748b', fontSize:12 }}>불러오는 중…</span>
                            ) : hasMoreByCourse[course.id] ? (
                              <span style={{ color:'#9ca3af', fontSize:12 }}>아래로 스크롤하면 더 불러옵니다</span>
                            ) : (
                              <span style={{ color:'#9ca3af', fontSize:12 }}>마지막입니다</span>
                            )}
                          </Sentinel>
                        </RecordList>
                      </ResultSection>
                    ))}
                  </SectionStack>
                </ResultContent>
              )}
            </ResultBody>
            <ResultStickyActions>
              <ResultActionRow>
                {genError && <InlineError>{genError}</InlineError>}
                <PrimaryButton type="button" onClick={handleSummarize} disabled={genLoading}>
                  {genLoading ? '생성 중…' : '요약 만들기'}
                </PrimaryButton>
              </ResultActionRow>
            </ResultStickyActions>
          </ResultCard>
        </ResultColumn>
      </ContentGrid>
    </Viewport>
  );
}

// IntersectionObserver sentinel used for per-course infinite scroll
function Sentinel({ onVisible, children }: { onVisible: () => void; children?: React.ReactNode }) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          onVisible();
          break;
        }
      }
    }, { root: null, rootMargin: '200px 0px', threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, [onVisible]);
  return <div ref={ref} style={{ display:'grid', placeItems:'center', padding:'8px 0' }}>{children}</div>;
}

function formatCourseMeta(course: Course): string {
  const time =
    course.courseTime || buildTimeRange(course.startTime, course.endTime);
  const next = course.nextClassDate
    ? `다음 수업 ${formatKoreanDate(course.nextClassDate)}`
    : "";
  return [time, next].filter(Boolean).join(" · ") || "일정 정보 없음";
}

function buildTimeRange(start?: string, end?: string) {
  if (!start && !end) return "";
  const s = start ? start.slice(0, 5) : "?";
  const e = end ? end.slice(0, 5) : "?";
  return `${s} ~ ${e}`;
}

function formatKoreanDate(ymd?: string) {
  if (!ymd) return "-";
  const [year, month, day] = ymd.split("-");
  if (!year || !month || !day) return ymd;
  return `${Number(year)}년 ${Number(month)}월 ${Number(day)}일`;
}

function countDaysInclusive(start?: string, end?: string): number | null {
  if (!start || !end) return null;
  try {
    const s = new Date(start);
    const e = new Date(end);
    if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime())) return null;
    const diff = Math.abs(e.getTime() - s.getTime());
    return Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
  } catch {
    return null;
  }
}

function formatRangeSummary(from?: string, to?: string): RangeSummary {
  if (!from || !to) {
    return { label: "기간을 선택하면 조회 안내가 표시돼요.", days: null };
  }
  const label = `${formatKoreanDate(from)} ~ ${formatKoreanDate(to)}`;
  const days = countDaysInclusive(from, to);
  return { label, days };
}

function recordPreview(record: CourseRecord): string {
  return (
    record.content?.trim() ||
    record.notes?.trim() ||
    record.topic?.trim() ||
    "(기록된 내용이 없습니다)"
  );
}

const Viewport = styled.div`
  height: calc(100vh - 48px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const HeaderWrap = styled.div`
  padding: 0 ${(p) => p.theme.spacing.xs};
  display: grid;
  gap: ${(p) => p.theme.spacing.sm};
`;

const HeaderActions = styled.div`
  display: inline-flex;
  gap: ${(p) => p.theme.spacing.sm};
  flex-wrap: wrap;
  justify-content: flex-end;
`;

const ContentGrid = styled.div`
  display: grid;
  gap: ${(p) => p.theme.spacing.xl};
  grid-template-columns: 1fr;
  flex: 1;
  min-height: 0;
  overflow: hidden;
  @media (min-width: 1120px) {
    grid-template-columns: 360px 1fr;
  }
`;

const FilterColumn = styled.div`
  display: flex;
  min-height: 0;
  overflow: hidden;
`;

const ResultColumn = styled.div`
  display: grid;
  gap: ${(p) => p.theme.spacing.xl};
  min-height: 0;
`;

const FilterBody = styled.div`
  flex: 1;
  min-height: 0;
  overflow: auto;
  display: grid;
  gap: ${(p) => p.theme.spacing.xl};
`;

const FilterCard = styled(SectionCard)`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: ${(p) => p.theme.spacing.xl};
`;

const ResultCard = styled(SectionCard)`
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: ${(p) => p.theme.spacing.xl};
`;

const PanelHeader = styled.div`
  display: grid;
  gap: ${(p) => p.theme.spacing.xs};
`;

const PanelTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 800;
  letter-spacing: -0.01em;
  color: ${({ theme }) => theme.colors.text};
`;

const PanelSub = styled.p`
  margin: 0;
  font-size: ${(p) => p.theme.font.size.sm};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const FieldBlock = styled.div`
  display: grid;
  gap: ${(p) => p.theme.spacing.sm};
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  height: 40px;
  padding: 0 ${(p) => p.theme.spacing.md};
  border-radius: ${(p) => p.theme.radii.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: #fff;
  box-shadow: inset 0 1px 2px rgba(15, 23, 42, 0.04);
`;

const SearchInput = styled.input`
  flex: 1;
  border: 0;
  background: transparent;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
  &:focus {
    outline: none;
  }
`;

const CardHint = styled.span`
  font-size: ${(p) => p.theme.font.size.sm};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const CardError = styled.span`
  font-size: ${(p) => p.theme.font.size.sm};
  color: #dc2626;
  font-weight: 600;
`;

const FieldHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${(p) => p.theme.spacing.sm};
`;

const FieldLabel = styled.div`
  font-size: ${(p) => p.theme.font.size.sm};
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text};
`;

const FieldMeta = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${(p) => p.theme.spacing.sm};
  font-size: ${(p) => p.theme.font.size.sm};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const CourseList = styled.div`
  display: grid;
  gap: ${(p) => p.theme.spacing.sm};
  grid-template-columns: 1fr;
  @media (min-width: 720px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

const CourseButton = styled.button`
  position: relative;
  display: grid;
  gap: ${(p) => p.theme.spacing.xs};
  padding: ${(p) => p.theme.spacing.md};
  border-radius: ${(p) => p.theme.radii.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: #fff;
  text-align: left;
  cursor: pointer;
  min-height: 64px;
  transition: border-color 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
  .title {
    font-weight: 700;
    font-size: 13px;
    color: ${({ theme }) => theme.colors.text};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    letter-spacing: -0.01em;
  }
  .meta {
    font-size: 11.5px;
    color: ${({ theme }) => theme.colors.textMuted};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  &:hover {
    border-color: ${({ theme }) => theme.colors.borderMuted};
    box-shadow: 0 2px 6px rgba(15, 23, 42, 0.06);
  }
  &[data-selected="true"] {
    border-color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.primarySurface};
    box-shadow: 0 2px 10px rgba(79, 70, 229, 0.12);
  }
  &[data-selected="true"]::after {
    content: '✓';
    position: absolute;
    top: ${(p) => p.theme.spacing.sm};
    right: ${(p) => p.theme.spacing.sm};
    width: 20px;
    height: 20px;
    border-radius: 999px;
    display: grid;
    place-items: center;
    background: ${({ theme }) => theme.colors.primary};
    color: #fff;
    font-size: ${(p) => p.theme.font.size.sm};
    font-weight: 800;
  }
  &[data-disabled="true"] {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const CourseListWrap = styled.div`
  flex: 0 0 auto;
  max-height: 220px;
  overflow: auto;
  border-radius: ${(p) => p.theme.radii.md};
  padding: ${(p) => p.theme.spacing.sm};
  background: ${({ theme }) => theme.colors.surfaceMuted};
  border: 1px solid ${({ theme }) => theme.colors.borderMuted};
`;
const SelectedChips = styled.div`
  display: flex;
  gap: ${(p) => p.theme.spacing.xs};
  flex-wrap: wrap;
  margin-bottom: ${(p) => p.theme.spacing.xs};
`;
const Chip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${(p) => p.theme.spacing.xs};
  padding: ${(p) => p.theme.spacing.xs} ${(p) => p.theme.spacing.sm};
  border-radius: 999px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  font-size: ${(p) => p.theme.font.size.sm};
  .t { max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  button {
    border: 0;
    background: transparent;
    color: ${({ theme }) => theme.colors.textMuted};
    cursor: pointer;
    font-size: ${(p) => p.theme.font.size.md};
    line-height: 1;
  }
`;

const SmallLink = styled.button`
  border: 0;
  background: transparent;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${(p) => p.theme.font.size.sm};
  text-decoration: underline;
  cursor: pointer;
`;

const QuickGrid = styled.div`
  display: grid;
  gap: ${(p) => p.theme.spacing.sm};
  grid-template-columns: repeat(2, minmax(0, 1fr));
`;

const QuickButton = styled.button`
  height: 40px;
  border-radius: 999px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: #fff;
  font-size: ${(p) => p.theme.font.size.sm};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease;
  &[data-active="true"] {
    border-color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.primarySurface};
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 700;
  }
`;

const DateRow = styled.div`
  display: grid;
  gap: ${(p) => p.theme.spacing.sm};
  grid-template-columns: repeat(2, minmax(0, 1fr));
`;

const DateField = styled.label`
  display: grid;
  gap: ${(p) => p.theme.spacing.xs};
  font-size: ${(p) => p.theme.font.size.sm};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const DateInput = styled.input`
  height: 38px;
  border-radius: ${(p) => p.theme.radii.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: 0 ${(p) => p.theme.spacing.md};
  background: #fff;
  font-size: ${(p) => p.theme.font.size.sm};
`;

const RangeSummaryText = styled.div`
  font-size: ${(p) => p.theme.font.size.sm};
  color: ${({ theme }) => theme.colors.textMuted};
  padding-top: ${(p) => p.theme.spacing.xs};
`;

const StickyActions = styled.div`
  position: sticky;
  bottom: 0;
  background: ${({ theme }) => theme.colors.surface};
  border-top: 1px solid ${({ theme }) => theme.colors.borderMuted};
  padding-top: ${(p) => p.theme.spacing.md};
  margin-top: ${(p) => p.theme.spacing.sm};
`;

const ActionRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${(p) => p.theme.spacing.sm};
`;

const ResultBody = styled.div`
  flex: 1;
  min-height: 0;
  overflow: auto;
`;

const ResultContent = styled.div`
  display: grid;
  gap: ${(p) => p.theme.spacing.xl};
`;

const ResultMeta = styled.div`
  position: sticky;
  top: 0;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.spacing.sm};
  font-size: ${(p) => p.theme.font.size.sm};
  color: ${({ theme }) => theme.colors.textMuted};
  padding: ${(p) => p.theme.spacing.sm} 0;
  margin-bottom: ${(p) => p.theme.spacing.md};
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: 0 12px 16px -14px rgba(15, 23, 42, 0.25);
  span:first-child {
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text};
    font-size: ${(p) => p.theme.font.size.sm};
  }
`;

const SectionStack = styled.div`
  display: grid;
  gap: ${(p) => p.theme.spacing.lg};
`;

const ResultSection = styled.section`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.xl};
  background: ${({ theme }) => theme.colors.surface};
  padding: ${(p) => p.theme.spacing.xl};
  display: grid;
  gap: ${(p) => p.theme.spacing.md};
`;

const ResultSectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  .title {
    font-weight: 700;
    color: ${({ theme }) => theme.colors.text};
    font-size: 14px;
  }
  .count {
    font-size: ${(p) => p.theme.font.size.sm};
    color: ${({ theme }) => theme.colors.textMuted};
    font-weight: 600;
  }
`;

const RecordList = styled.div`
  display: grid;
  gap: ${(p) => p.theme.spacing.md};
`;

const RecordItem = styled.div`
  display: grid;
  gap: ${(p) => p.theme.spacing.xs};
  border-radius: ${(p) => p.theme.radii.md};
  border: 1px solid ${({ theme }) => theme.colors.borderMuted};
  padding: ${(p) => p.theme.spacing.md};
  background: ${({ theme }) => theme.colors.surfaceMuted};
`;

const RecordDate = styled.div`
  font-size: ${(p) => p.theme.font.size.sm};
  color: ${({ theme }) => theme.colors.textMuted};
  font-weight: 600;
`;

const RecordText = styled.p`
  margin: 0;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-word;
`;

const ResultStickyActions = styled.div`
  position: sticky;
  bottom: 0;
  background: ${({ theme }) => theme.colors.surface};
  border-top: 1px solid ${({ theme }) => theme.colors.borderMuted};
  padding-top: ${(p) => p.theme.spacing.md};
  margin-top: ${(p) => p.theme.spacing.md};
  display: flex;
  justify-content: flex-end;
`;

const ResultActionRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.spacing.sm};
`;

const InlineError = styled.span`
  color: #b91c1c;
  font-size: ${(p) => p.theme.font.size.sm};
  font-weight: 600;
`;
