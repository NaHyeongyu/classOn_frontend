import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Page, PageHeader, SectionCard, PrimaryButton, GhostButtonSmall } from "../components/common/UI";
import { listCourses, listCourseRecords, type Course, type CourseRecord } from "../api/courses";
import { type SummarizeItem, type SummarizeOptions } from "../api/summarize";

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
  const [hasSearched, setHasSearched] = useState(false);
  const [results, setResults] = useState<RecordsByCourse>({});

  const navigate = useNavigate();

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
        if (!cancelled) setCoursesError("수업 목록을 불러오는 데 실패했습니다.");
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

  const selectedCourses = useMemo(() => (
    courses.filter((course) => selectedCourseIds.includes(course.id))
  ), [courses, selectedCourseIds]);

  const jsonData = useMemo(() => {
    const items: SummarizeItem[] = [];
    for (const course of selectedCourses) {
      const rows = results[course.id] || [];
      for (const record of rows) {
        const content = recordPreview(record);
        items.push({ date: record.recordDate, content, courseTitle: course.title });
      }
    }
    items.sort((a, b) => a.date.localeCompare(b.date));
    return items;
  }, [results, selectedCourses]);

  const courseSections = useMemo<CourseSection[]>(() => (
    selectedCourses.map((course) => {
      const rows = (results[course.id] || []).slice().sort((a, b) => a.recordDate.localeCompare(b.recordDate));
      return { course, rows };
    })
  ), [results, selectedCourses]);

  const totalRecords = useMemo(() => (
    courseSections.reduce((acc, section) => acc + section.rows.length, 0)
  ), [courseSections]);

  const rangeSummary = useMemo<RangeSummary>(() => formatRangeSummary(from, to), [from, to]);

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
    const end = new Date(today.getFullYear(), today.getMonth(), today.getDate());
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

  async function handleFetch() {
    if (!selectedCourseIds.length) {
      alert("수업을 하나 이상 선택해주세요.");
      return;
    }
    if (!from || !to) {
      alert("조회 기간(시작/종료일)을 선택해주세요.");
      return;
    }
    if (from > to) {
      alert("조회 기간이 올바르지 않습니다. 시작일이 종료일보다 늦습니다.");
      return;
    }
    try {
      setHasSearched(true);
      setLoading(true);
      const entries = await Promise.all(
        selectedCourseIds.map(async (courseId) => [courseId, await listCourseRecords(courseId, { from, to })] as const)
      );
      const map: RecordsByCourse = {};
      for (const [courseId, records] of entries) {
        map[courseId] = records;
      }
      setResults(map);
    } catch (err) {
      console.error(err);
      alert("수업 내역을 불러오지 못했습니다.");
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
  }

  function handleSummarize() {
    if (!totalRecords) {
      alert("먼저 조회를 실행해주세요.");
      return;
    }
    const items: SummarizeItem[] = jsonData;
    const options: SummarizeOptions = { language: "ko", maxBullets: 3, style: "marketing" } as SummarizeOptions;
    navigate("/marketing/guide", { state: { items, options } });
  }

  return (
    <Viewport>
      <PageHeader>
        <div>
          <h2>마케팅</h2>
          <p>수업 내역을 조회하고 마케팅 자료를 관리하세요.</p>
        </div>
        <GhostButtonSmall as="a" href="/classes">수업 관리</GhostButtonSmall>
      </PageHeader>

      <ContentGrid>
        <FilterColumn>
          <FilterCard>
            <PanelHeader>
              <PanelTitle>수업 내역 조회</PanelTitle>
              <PanelSub>수업을 선택하고 기간을 지정해 기록을 불러올 수 있어요.</PanelSub>
            </PanelHeader>

            <FilterBody>
            <FieldBlock>
              <SearchBar>
                <SearchIcon aria-hidden>🔍</SearchIcon>
                <SearchInput
                  id="course-search"
                  placeholder="수업을 검색해 선택하세요"
                  value={courseQuery}
                  onChange={(event) => setCourseQuery(event.target.value)}
                />
              </SearchBar>
              {loadingCourses ? <CardHint>수업을 불러오는 중입니다…</CardHint> : null}
              {coursesError ? <CardError>{coursesError}</CardError> : null}
            </FieldBlock>

            <FieldBlock>
              <FieldLabel>수업 선택 <span>(최대 3개)</span></FieldLabel>
              <CourseListWrap>
                <CourseList role="list" aria-label="수업 목록">
                {filteredCourses.map((course) => {
                  const selected = selectedCourseIds.includes(course.id);
                  const atLimit = !selected && selectedCourseIds.length >= 3;
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
              ) : (
                <SelectedSummary>{selectedCourseIds.length}개 수업 선택됨</SelectedSummary>
              )}
            </FieldBlock>

            <FieldBlock>
              <FieldLabel>빠른 기간 선택</FieldLabel>
              <QuickGrid>
                <QuickButton type="button" data-active={preset === "7d"} onClick={() => applyPreset("7d")}>
                  최근 7일
                </QuickButton>
                <QuickButton type="button" data-active={preset === "30d"} onClick={() => applyPreset("30d")}>
                  최근 30일
                </QuickButton>
                <QuickButton type="button" data-active={preset === "thisMonth"} onClick={() => applyPreset("thisMonth")}>
                  이번 달
                </QuickButton>
                <QuickButton type="button" data-active={preset === "lastMonth"} onClick={() => applyPreset("lastMonth")}>
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
                    value={from}
                    onChange={(event) => {
                      setFrom(event.target.value);
                      setPreset(null);
                    }}
                  />
                </DateField>
                <DateField>
                  <span>종료일</span>
                  <DateInput
                    type="date"
                    value={to}
                    onChange={(event) => {
                      setTo(event.target.value);
                      setPreset(null);
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
              <PrimaryButton type="button" onClick={handleFetch} disabled={loading}>
                {loading ? "조회 중..." : "조회하기"}
              </PrimaryButton>
              <GhostButtonSmall as="button" type="button" onClick={handleReset}>
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
              <PanelSub>선택한 수업과 기간에 해당하는 기록이 표시돼요.</PanelSub>
            </PanelHeader>

            <ResultBody>
              {loading ? (
                <ResultEmpty>
                <ResultIcon aria-hidden>📄</ResultIcon>
                <p>조회 중입니다...</p>
              </ResultEmpty>
            ) : !hasSearched ? (
              <ResultEmpty>
                <ResultIcon aria-hidden>📘</ResultIcon>
                <p>수업을 선택하고 기간을 설정한 후 조회해주세요.</p>
              </ResultEmpty>
            ) : !courseSections.length ? (
              <ResultEmpty>
                <ResultIcon aria-hidden>📚</ResultIcon>
                <p>선택한 수업이 없어요. 왼쪽에서 수업을 선택해주세요.</p>
              </ResultEmpty>
            ) : totalRecords === 0 ? (
              <ResultEmpty>
                <ResultIcon aria-hidden>🗓</ResultIcon>
                <p>선택한 기간에 해당하는 수업 기록이 없습니다.</p>
              </ResultEmpty>
            ) : (
              <ResultContent>
                <ResultMeta>
                  <span>총 {totalRecords}건</span>
                  {from && to ? <span>{from} ~ {to}</span> : null}
                </ResultMeta>

                <SectionStack>
                  {courseSections.map(({ course, rows }) => (
                    <ResultSection key={course.id}>
                      <ResultSectionHeader>
                        <span className="title">{course.title}</span>
                        <span className="count">{rows.length}건</span>
                      </ResultSectionHeader>
                      <RecordList>
                        {rows.map((record) => (
                          <RecordItem key={`${course.id}:${record.id}`}>
                            <RecordDate>{formatKoreanDate(record.recordDate)}</RecordDate>
                            <RecordText>{recordPreview(record)}</RecordText>
                          </RecordItem>
                        ))}
                      </RecordList>
                    </ResultSection>
                  ))}
                </SectionStack>


              </ResultContent>
            )}
            </ResultBody>
          <ResultStickyActions>
            <PrimaryButton type="button" onClick={handleSummarize}>요약 만들기</PrimaryButton>
          </ResultStickyActions>
          </ResultCard>
        </ResultColumn>
      </ContentGrid>
    </Viewport>
  );
}

function formatCourseMeta(course: Course): string {
  const time = course.courseTime || buildTimeRange(course.startTime, course.endTime);
  const next = course.nextClassDate ? `다음 수업 ${formatKoreanDate(course.nextClassDate)}` : "";
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

const ContentGrid = styled.div`
  display: grid;
  gap: 14px;
  grid-template-columns: 1fr;
  flex: 1;
  min-height: 0;
  overflow: hidden;
  @media (min-width: 1080px) {
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
  gap: 14px;
  min-height: 0;
`;

const FilterBody = styled.div`
  flex: 1;
  min-height: 0;
  overflow: auto;
  display: grid;
  gap: 18px;
`

const FilterCard = styled(SectionCard)`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 18px;
`;

const ResultCard = styled(SectionCard)`
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 18px;
`;

const PanelHeader = styled.div`
  display: grid;
  gap: 3px;
`;

const PanelTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text};
`;

const PanelSub = styled.p`
  margin: 0;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const FieldBlock = styled.div`
  display: grid;
  gap: 6px;
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  height: 38px;
  padding: 0 10px;
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: #fff;
`;

const SearchIcon = styled.span`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.textMuted};
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
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const CardError = styled.span`
  font-size: 12px;
  color: #dc2626;
`;

const FieldLabel = styled.div`
  font-size: 12px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  span {
    margin-left: 4px;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;

const CourseList = styled.div`
  display: grid;
  gap: 8px;
`;

const CourseButton = styled.button`
  display: grid;
  gap: 4px;
  padding: 12px;
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: #fff;
  text-align: left;
  cursor: pointer;
  transition: border-color 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
  .title {
    font-weight: 600;
    font-size: 12px;
    color: ${({ theme }) => theme.colors.text};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .meta {
    font-size: 11px;
    color: ${({ theme }) => theme.colors.textMuted};
  }
  &[data-selected='true'] {
    border-color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.primarySurface};
    box-shadow: 0 2px 8px rgba(79, 70, 229, 0.10);
  }
  &[data-disabled='true'] {
    opacity: 0.35;
    cursor: not-allowed;
  }
`;



const CourseListWrap = styled.div`
  flex: 0 0 auto;
  max-height: 220px;
  overflow: auto;
  border: 1px dashed ${({ theme }) => theme.colors.borderMuted};
  border-radius: 10px;
  padding: 8px;
  background: #fafafa;
`;
const SelectedSummary = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const QuickGrid = styled.div`
  display: grid;
  gap: 6px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
`;

const QuickButton = styled.button`
  height: 34px;
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: #fff;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease;
  &[data-active='true'] {
    border-color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.primarySurface};
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 600;
  }
`;

const DateRow = styled.div`
  display: grid;
  gap: 8px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
`;

const DateField = styled.label`
  display: grid;
  gap: 4px;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const DateInput = styled.input`
  height: 36px;
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: 0 10px;
  background: #fff;
  font-size: 12px;
`;

const RangeSummaryText = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const StickyActions = styled.div`
  position: sticky;
  bottom: 0;
  background: ${({ theme }) => theme.colors.surface};
  border-top: 1px solid ${({ theme }) => theme.colors.borderMuted};
  padding-top: 10px;
  margin-top: 6px;
`;

const ActionRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`;

const ResultEmpty = styled.div`
  display: grid;
  justify-items: center;
  gap: 6px;
  padding: 48px 10px;
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const ResultIcon = styled.span`
  font-size: 26px;
`;

const ResultBody = styled.div`
  flex: 1;
  min-height: 0;
  overflow: auto;
`

const ResultContent = styled.div`
  display: grid;
  gap: 16px;
`;

const ResultMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
  span:first-child {
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text};
    font-size: 12px;
  }
`;

const SectionStack = styled.div`
  display: grid;
  gap: 12px;
`;

const ResultSection = styled.section`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.surface};
  padding: 12px;
  display: grid;
  gap: 10px;
`;

const ResultSectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  .title {
    font-weight: 700;
    color: ${({ theme }) => theme.colors.text};
  }
  .count {
    font-size: 12px;
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;

const RecordList = styled.div`
  display: grid;
  gap: 10px;
`;

const RecordItem = styled.div`
  display: grid;
  gap: 4px;
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: 10px;
  background: ${({ theme }) => theme.colors.surfaceMuted};
`;

const RecordDate = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-weight: 600;
`;

const RecordText = styled.p`
  margin: 0;
  font-size: 12px;
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
  padding-top: 10px;
  margin-top: 6px;
  display: flex;
  justify-content: flex-end;
`

const ResultFooter = styled.div`
  display: flex;
  justify-content: flex-end;
`;
