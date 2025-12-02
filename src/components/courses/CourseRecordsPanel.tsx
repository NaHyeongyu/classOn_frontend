import { useMemo } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import {
  GhostButton as UIGhostButton,
  GhostBtnSmall as UIGhostBtnSmall,
  PrimaryBtn as UIPrimaryBtn,
  PrimaryButton as UIPrimaryButton,
  buttonVariants,
} from "@/components/common/UI";
import SelectBox from "@/components/common/SelectBox";
import {
  Section,
  Title,
  SectionHead,
} from "@/components/courseDetail/CourseDetail.styles";

type HistoryItem = {
  id?: number;
  date: Date;
  dateLabel: string;
  time: string;
  type: '지난 수업' | '예정';
  notes?: string | null;
};

type Props = {
  title?: string;
  history: HistoryItem[];
  filterYear: number | null;
  filterMonth: number;
  onChangeYear: (y: number | null) => void;
  onChangeMonth: (m: number) => void;
  onResetFilters: () => void;
  exporting: boolean;
  onExport: () => void;
  collapsed: boolean;
  onToggleCollapsed: () => void;
  todayHref: string;
  detailHrefFor: (id?: number, date?: Date) => string;
  onCreateRecord?: () => void;
};

export default function CourseRecordsPanel({
  title = '수업 내역',
  history,
  filterYear,
  filterMonth,
  onChangeYear,
  onChangeMonth,
  onResetFilters,
  exporting,
  onExport,
  collapsed,
  onToggleCollapsed,
  todayHref,
  detailHrefFor,
  onCreateRecord,
}: Props) {
  const navigate = useNavigate();
  const todayKey = useMemo(() => formatYmd(new Date()), []);
  const recordsByDate = useMemo(() => {
    const map: Record<string, HistoryItem[]> = {};
    history.forEach((item) => {
      const key = formatYmd(item.date);
      if (!map[key]) map[key] = [];
      map[key].push(item);
    });
    return map;
  }, [history]);
  const monthViews = useMemo(
    () => buildMonthViews(history, filterYear, filterMonth),
    [history, filterYear, filterMonth],
  );
  
  const yearOptions = useMemo(() => {
    return buildYears().map(y => ({ label: `${y}년`, value: String(y) }));
  }, []);

  const monthOptions = useMemo(
    () =>
      [{ value: "0", label: "전체" }].concat(
        Array.from({ length: 12 }, (_, i) => ({
          value: String(i + 1),
          label: `${i + 1}월`,
        })),
      ),
    [],
  );

  return (
    <Section>
      <SectionHead>
        <Title>{title}</Title>
        <div style={{ display: 'inline-flex', gap: 8 }}>
          <UIGhostButton type="button" onClick={onExport} disabled={exporting}>
            {exporting ? '엑셀 준비 중...' : '엑셀 추출'}
          </UIGhostButton>
          <UIGhostButton type="button" onClick={onToggleCollapsed}>
            {collapsed ? '펼치기' : '목록 접기'}
          </UIGhostButton>
          {onCreateRecord ? (
            <UIPrimaryButton type="button" onClick={onCreateRecord}>수업 생성</UIPrimaryButton>
          ) : (
            <UIPrimaryBtn to={todayHref}>수업 생성</UIPrimaryBtn>
          )}
        </div>
      </SectionHead>

      <FilterRow>
        <FilterItem>
          <SmallLabel>연도</SmallLabel>
          <SelectBox
            value={filterYear ? String(filterYear) : ""}
            onChange={(val) => onChangeYear(val ? Number(val) : null)}
            options={yearOptions}
            width="100px"
          />
        </FilterItem>
        <FilterItem>
          <SmallLabel>월</SmallLabel>
          <SelectBox
            value={String(filterMonth)}
            onChange={(val) => onChangeMonth(Number(val))}
            options={monthOptions}
            width="100px"
          />
        </FilterItem>
        <div style={{ flex: 1 }} />
        <SmallLink type="button" onClick={onResetFilters}>초기화</SmallLink>
      </FilterRow>

      {collapsed ? (
        history.length === 0 ? (
          <Muted>표시할 일정이 없습니다.</Muted>
        ) : (
          <RecordsList>
            {history.map((h) => (
              <CollapsedRow key={h.id || h.dateLabel}>
                <div className="left">
                  <strong>{h.dateLabel}</strong>
                  <SmallMuted>{h.time}</SmallMuted>
                  <SmallMuted>{h.type}</SmallMuted>
                </div>
                <div className="right">
                  <UIGhostBtnSmall to={detailHrefFor(h.id, h.date)}>
                    상세
                  </UIGhostBtnSmall>
                </div>
              </CollapsedRow>
            ))}
          </RecordsList>
        )
      ) : monthViews.length === 0 ? (
        <Muted>표시할 일정이 없습니다.</Muted>
      ) : (
        <CalendarWrap>
          {monthViews.map((view) => {
            const cells = buildMonthCells(view.year, view.month, recordsByDate, todayKey);
            return (
              <MonthSection key={`${view.year}-${pad2(view.month)}`}>
                <MonthTitle>
                  {view.year}년 {view.month}월
                </MonthTitle>
                <WeekdayHeader>
                  {WEEKDAY_LABELS.map((label) => (
                    <WeekdayCell key={label}>{label}</WeekdayCell>
                  ))}
                </WeekdayHeader>
                <MonthGrid>
                  {cells.map((cell) => {
                    const href =
                      cell.records.length === 1
                        ? detailHrefFor(cell.records[0].id, cell.records[0].date)
                        : cell.records.length > 1
                          ? detailHrefFor(undefined, cell.date)
                          : null;
                    return (
                      <DayCell
                        key={cell.key}
                        data-other={!cell.inMonth || undefined}
                        data-today={cell.isToday || undefined}
                        $clickable={cell.records.length > 0}
                        $dim={!cell.inMonth}
                        $today={cell.isToday}
                        onClick={() => { if (href) navigate(href); }}
                      >
                        <DayNumber data-other={!cell.inMonth || undefined}>
                          {cell.date.getDate()}
                        </DayNumber>
                        <TimesList>
                          {cell.records.map((record) => (
                            <TimeBadge
                              key={`${record.id || `${record.dateLabel}-${record.time}`}`}
                              data-variant={record.type === "지난 수업" ? "past" : "upcoming"}
                            >
                              {record.time || "시간 미정"}
                            </TimeBadge>
                          ))}
                        </TimesList>
                      </DayCell>
                    );
                  })}
                </MonthGrid>
                {view.records.length === 0 ? (
                  <MonthEmpty>등록된 수업 내역이 없습니다.</MonthEmpty>
                ) : null}
              </MonthSection>
            );
          })}
        </CalendarWrap>
      )}
    </Section>
  );
}

function buildYears(): number[] {
  const todayY = new Date().getFullYear();
  const start = todayY - 1;
  const end = todayY + 1;
  const arr: number[] = [];
  for (let y = start; y <= end; y++) arr.push(y);
  return arr;
}

const Muted = styled.p`
  margin: 0;
  color: ${(p) => p.theme.colors.textMuted};
  font-size: ${(p) => p.theme.font.size.xs};
`;
const SmallMuted = styled.span`
  color: ${(p) => p.theme.colors.textMuted};
  font-size: ${(p) => p.theme.font.size.xs};
`;
const FilterRow = styled.div`
  display: flex;
  gap: ${(p) => p.theme.spacing.sm};
  align-items: flex-end;
  background: ${(p) => p.theme.colors.surfaceMuted};
  border: 1px solid ${(p) => p.theme.colors.borderMuted};
  border-radius: ${(p) => p.theme.radii.md};
  padding: ${(p) => p.theme.spacing.sm};
`;
const FilterItem = styled.label`
  display: grid;
  gap: ${(p) => p.theme.spacing.xs};
`;
const SmallLabel = styled.span`
  display: block;
  color: ${(p) => p.theme.colors.textMuted};
  font-size: ${(p) => p.theme.font.size.xs};
`;

const SmallLink = styled.button`
  ${buttonVariants.outline}; height:40px; padding:0 ${(p) => p.theme.spacing.md}; font-size:${(p) => p.theme.font.size.sm};
`;
const RecordsList = styled.div`
  display: grid;
  gap: ${(p) => p.theme.spacing.sm};
`;
const CollapsedRow = styled.div`
  display:flex; align-items:center; justify-content:space-between; padding:${(p) => p.theme.spacing.sm}; border:1px solid ${(p) => p.theme.colors.borderMuted}; border-radius:${(p) => p.theme.radii.md}; background:${(p) => p.theme.colors.surface};
  .left{ display:flex; align-items:center; gap:${(p) => p.theme.spacing.xs}; flex-wrap:wrap; }
`;
const CalendarWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(p) => p.theme.spacing.lg};
`;
const MonthSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(p) => p.theme.spacing.sm};
`;
const MonthTitle = styled.h4`
  margin: 0;
  font-size: ${(p) => p.theme.font.size.lg};
`;
const WeekdayHeader = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: ${(p) => p.theme.spacing.xs};
`;
const WeekdayCell = styled.div`
  text-align: center;
  font-size: ${(p) => p.theme.font.size.xs};
  color: ${(p) => p.theme.colors.textMuted};
  font-weight: 600;
`;
const MonthGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: ${(p) => p.theme.spacing.xs};
`;
const DayCell = styled.div<{ $clickable?: boolean; $dim?: boolean; $today?: boolean }>`
  min-height: 80px;
  border: 1px solid ${(p) => (p.$today ? p.theme.colors.primary : p.theme.colors.borderMuted)};
  border-radius: ${(p) => p.theme.radii.lg};
  padding: ${(p) => p.theme.spacing.sm};
  background: ${(p) => (p.$dim ? p.theme.colors.surfaceMuted : p.theme.colors.surface)};
  display: flex;
  flex-direction: column;
  gap: ${(p) => p.theme.spacing.xs};
  cursor: ${(p) => (p.$clickable ? "pointer" : "default")};
  transition: border-color 0.18s ease, box-shadow 0.18s ease, transform 0.12s ease;
  box-shadow: ${(p) => (p.$today ? `0 0 0 2px ${p.theme.colors.primary}22` : "0 2px 6px rgba(15, 23, 42, 0.04)")};
  &:hover {
    border-color: ${(p) => (p.$clickable ? p.theme.colors.primary : p.theme.colors.borderMuted)};
    box-shadow: ${(p) => (p.$clickable ? "0 12px 24px rgba(15, 23, 42, 0.08)" : "0 2px 6px rgba(15, 23, 42, 0.04)")};
    transform: ${(p) => (p.$clickable ? "translateY(-2px)" : "none")};
  }
`;
const DayNumber = styled.span`
  font-weight: 600;
  font-size: ${(p) => p.theme.font.size.sm};
  color: ${(p) => p.theme.colors.text};
  &[data-other] {
    color: ${(p) => p.theme.colors.textMuted};
  }
`;
const TimesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: auto;
`;
const TimeBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 2px 6px;
  border-radius: 999px;
  font-size: ${(p) => p.theme.font.size.xs};
  border: 1px solid ${(p) => p.theme.colors.borderMuted};
  background: ${(p) => p.theme.colors.surfaceMuted};
  color: ${(p) => p.theme.colors.text};
  &[data-variant="past"] {
    color: ${(p) => p.theme.colors.textMuted};
  }
  &[data-variant="upcoming"] {
    border-color: ${(p) => p.theme.colors.primary};
    color: ${(p) => p.theme.colors.primary};
  }
`;
const MonthEmpty = styled.p`
  margin: 0;
  font-size: ${(p) => p.theme.font.size.xs};
  color: ${(p) => p.theme.colors.textMuted};
`;

type CalendarCellType = {
  key: string;
  date: Date;
  inMonth: boolean;
  isToday: boolean;
  records: HistoryItem[];
};
type MonthView = {
  year: number;
  month: number;
  records: HistoryItem[];
};
const WEEKDAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

function buildMonthViews(history: HistoryItem[], year: number | null, month: number): MonthView[] {
  const fallbackYear = year ?? history[0]?.date.getFullYear() ?? new Date().getFullYear();
  if (month >= 1) {
    const filtered = history.filter(
      (entry) =>
        entry.date.getFullYear() === fallbackYear &&
        entry.date.getMonth() + 1 === month,
    );
    return [{ year: fallbackYear, month, records: filtered }];
  }
  if (!history.length) return [];
  const map = new Map<number, HistoryItem[]>();
  history.forEach((entry) => {
    if (entry.date.getFullYear() !== fallbackYear) return;
    const entryMonth = entry.date.getMonth() + 1;
    if (!map.has(entryMonth)) map.set(entryMonth, []);
    map.get(entryMonth)!.push(entry);
  });
  return Array.from(map.entries())
    .sort(([a], [b]) => a - b)
    .map(([entryMonth, records]) => ({
      year: fallbackYear,
      month: entryMonth,
      records,
    }));
}

function buildMonthCells(
  year: number,
  month: number,
  recordsByDate: Record<string, HistoryItem[]>,
  todayKey: string,
): CalendarCellType[] {
  const firstOfMonth = new Date(year, month - 1, 1);
  const start = new Date(firstOfMonth);
  start.setDate(start.getDate() - start.getDay());
  const totalCells = 42;
  const cells: CalendarCellType[] = [];
  for (let i = 0; i < totalCells; i += 1) {
    const current = new Date(start);
    current.setDate(start.getDate() + i);
    const key = formatYmd(current);
    cells.push({
      key: `${key}-${i}`,
      date: current,
      inMonth: current.getMonth() === month - 1 && current.getFullYear() === year,
      isToday: key === todayKey,
      records: (recordsByDate[key] || []).slice(),
    });
  }
  return cells;
}

function formatYmd(date: Date): string {
  const y = date.getFullYear();
  const m = pad2(date.getMonth() + 1);
  const d = pad2(date.getDate());
  return `${y}-${m}-${d}`;
}
function pad2(value: number): string {
  return String(value).padStart(2, "0");
}
