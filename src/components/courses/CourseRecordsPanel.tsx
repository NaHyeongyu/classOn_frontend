import React from 'react';
import styled from 'styled-components';
import { GhostButton as UIGhostButton, GhostBtnSmall as UIGhostBtnSmall, PrimaryBtn as UIPrimaryBtn, PrimaryButton as UIPrimaryButton, buttonVariants } from "@/components/common/UI";
import { Section, Title, SectionHead } from "@/components/courseDetail/CourseDetail.styles";

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
  getAttendanceMap,
  onCreateRecord,
}: Props) {
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

      {history.length === 0 ? (
        <Muted>표시할 일정이 없습니다.</Muted>
      ) : (
        <RecordsList>
          {history.map((h) =>
            collapsed ? (
              <CollapsedRow key={h.id || h.dateLabel}>
                <div className="left">
                  <strong>{h.dateLabel}</strong>
                  <SmallMuted>{h.time}</SmallMuted>
                  <SmallMuted>{h.type}</SmallMuted>
                </div>
                <div className="right">
                  <UIGhostBtnSmall to={detailHrefFor(h.id, h.date)}>상세</UIGhostBtnSmall>
                </div>
              </CollapsedRow>
            ) : (
              <RecordCard key={h.id || h.dateLabel}>
                <RecordHead>
                  <RecordMeta>
                    <strong>{h.dateLabel}</strong>
                    <SmallMuted>{h.time}</SmallMuted>
                    <SmallMuted>{h.type}</SmallMuted>
                    {h.id && (() => {
                      const map = getAttendanceMap(h.id!);
                      const present = Object.values(map).filter(v => v === true).length;
                      const absent = Object.values(map).filter(v => v === false).length;
                      const processed = present + absent;
                      return processed > 0 ? (
                        <SmallMuted>
                          출석 {present} · 결석 {absent} · 처리 {processed}
                        </SmallMuted>
                      ) : null;
                    })()}
                  </RecordMeta>
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
          )}
        </RecordsList>
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
const SmallSelect = styled.select`
  height: 32px;
  padding: 0 ${(p) => p.theme.spacing.sm};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.radii.md};
  font-size: ${(p) => p.theme.font.size.sm};
  background: ${(p) => p.theme.colors.surface};
  min-width: 110px;
`;
const SmallLink = styled.button`
  ${buttonVariants.outline}; height:32px; padding:0 ${(p) => p.theme.spacing.sm}; font-size:${(p) => p.theme.font.size.xs};
`;
const RecordsList = styled.div`
  display: grid;
  gap: ${(p) => p.theme.spacing.sm};
`;
const CollapsedRow = styled.div`
  display:flex; align-items:center; justify-content:space-between; padding:${(p) => p.theme.spacing.sm}; border:1px solid ${(p) => p.theme.colors.borderMuted}; border-radius:${(p) => p.theme.radii.md}; background:${(p) => p.theme.colors.surface};
  .left{ display:flex; align-items:center; gap:${(p) => p.theme.spacing.xs}; flex-wrap:wrap; }
`;
const RecordCard = styled.div`
  border:1px solid ${(p) => p.theme.colors.borderMuted};
  border-radius:${(p) => p.theme.radii.lg};
  overflow:hidden;
  background:${(p) => p.theme.colors.surface};
`;
const RecordHead = styled.div`
  display:flex;
  align-items:center;
  justify-content:space-between;
  padding:${(p) => p.theme.spacing.sm};
  background:${(p) => p.theme.colors.surfaceMuted};
  gap:${(p) => p.theme.spacing.sm};
  flex-wrap:wrap;
`;
const RecordMeta = styled.div`
  display:flex;
  align-items:center;
  gap:${(p) => p.theme.spacing.xs};
  flex-wrap:wrap;
`;
const RecordBody = styled.div`
  padding:${(p) => p.theme.spacing.sm};
  p{ margin:0; color:${(p) => p.theme.colors.text}; font-size:${(p) => p.theme.font.size.md}; }
`;
