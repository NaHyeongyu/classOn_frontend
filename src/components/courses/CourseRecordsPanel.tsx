import React from 'react';
import styled from 'styled-components';
import { SectionCard as Section, TitleH3 as Title, GhostButton as UIGhostButton, GhostBtnSmall as UIGhostBtnSmall, PrimaryBtn as UIPrimaryBtn, buttonVariants } from "@/components/common/UI";

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
  getAttendanceMap: (recordId: number) => Record<number, boolean>;
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
  getAttendanceMap,
}: Props) {
  return (
    <Section>
      <Head>
        <Title>{title}</Title>
        <div style={{ display: 'inline-flex', gap: 8 }}>
          <UIGhostButton type="button" onClick={onExport} disabled={exporting}>
            {exporting ? '엑셀 준비 중...' : '엑셀 추출'}
          </UIGhostButton>
          <UIGhostButton type="button" onClick={onToggleCollapsed}>
            {collapsed ? '펼치기' : '목록 접기'}
          </UIGhostButton>
          <UIPrimaryBtn to={todayHref}>수업 생성</UIPrimaryBtn>
        </div>
      </Head>

      <FilterRow>
        <FilterItem>
          <SmallLabel>연도</SmallLabel>
          <SmallSelect
            value={filterYear ?? ''}
            onChange={(e) => onChangeYear(Number(e.currentTarget.value) || new Date().getFullYear())}
          >
            {buildYears().map((y) => (
              <option key={y} value={y}>{y}년</option>
            ))}
          </SmallSelect>
        </FilterItem>
        <FilterItem>
          <SmallLabel>월</SmallLabel>
          <SmallSelect value={filterMonth} onChange={(e) => onChangeMonth(Number(e.currentTarget.value))}>
            <option value={0}>전체</option>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
              <option key={m} value={m}>{m}월</option>
            ))}
          </SmallSelect>
        </FilterItem>
        <div style={{ flex: 1 }} />
        <SmallLink type="button" onClick={onResetFilters}>초기화</SmallLink>
      </FilterRow>

      {history.length === 0 && <Muted>표시할 일정이 없습니다.</Muted>}
      {history.map((h) => (
        collapsed ? (
          <CollapsedRow key={h.id || h.dateLabel}>
            <div className="left">
              <strong>{h.dateLabel}</strong>
              <SmallMuted style={{ marginLeft: 8 }}>{h.time}</SmallMuted>
              <SmallMuted style={{ marginLeft: 8 }}>{h.type}</SmallMuted>
            </div>
            <div className="right">
              <UIGhostBtnSmall to={detailHrefFor(h.id, h.date)}>상세</UIGhostBtnSmall>
            </div>
          </CollapsedRow>
        ) : (
          <RecordCard key={h.id || h.dateLabel}>
            <RecordHead>
              <div>
                <strong>{h.dateLabel}</strong>
                <SmallMuted style={{ marginLeft: 8 }}>{h.time}</SmallMuted>
                <SmallMuted style={{ marginLeft: 8 }}>{h.type}</SmallMuted>
                {h.id && (() => {
                  const map = getAttendanceMap(h.id!);
                  const present = Object.values(map).filter(v => v === true).length;
                  const absent = Object.values(map).filter(v => v === false).length;
                  const processed = present + absent;
                  return processed > 0 ? (
                    <SmallMuted style={{ marginLeft: 10 }}>
                      출석 {present} · 결석 {absent} · 처리 {processed}
                    </SmallMuted>
                  ) : null;
                })()}
              </div>
              <div>
                <UIGhostBtnSmall to={detailHrefFor(h.id, h.date)}>상세</UIGhostBtnSmall>
              </div>
            </RecordHead>
            {h.notes && (
              <RecordBody>
                <p>{h.notes}</p>
              </RecordBody>
            )}
          </RecordCard>
        )
      ))}
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

const Head = styled.div`
  display: flex; align-items: center; justify-content: space-between;
`;
const Muted = styled.div`
  color: #6b7280; font-size: 12px;
`;
const SmallMuted = styled.span`
  color: #6b7280; font-size: 12px;
`;
const FilterRow = styled.div`
  display: flex; gap: 12px; align-items: flex-end; margin-bottom: 8px; background:#f9fafb; border:1px solid #f1f5f9; border-radius:10px; padding:8px 10px;
`;
const FilterItem = styled.label`
  display: grid; gap: 4px;
`;
const SmallLabel = styled.span`
  display:block; color:#6b7280; font-size:12px; margin-bottom:4px;
`;
const SmallSelect = styled.select`
  height: 32px; padding: 0 10px; border:1px solid #e5e7eb; border-radius:8px; font-size:12px; background:#fff; min-width:110px;
`;
const SmallLink = styled.button`
  ${buttonVariants.outline}; height:32px; padding:0 12px; font-size:12px;
`;
const CollapsedRow = styled.div`
  display:flex; align-items:center; justify-content:space-between; padding:12px; border:1px solid #f1f5f9; border-radius:10px; margin-bottom:8px; background:#fff;
  .left{ display:flex; align-items:center; }
`;
const RecordCard = styled.div`
  border:1px solid #f1f5f9; border-radius:12px; margin-bottom:10px; overflow:hidden; background:#fff;
`;
const RecordHead = styled.div`
  display:flex; align-items:center; justify-content:space-between; padding:12px; background:#f9fafb;
`;
const RecordBody = styled.div`
  padding:12px;
  p{ margin:0; color:#374151; font-size:14px; }
`;
