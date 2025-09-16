import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import type { ClassItem } from "../../../types/calendarDetail";

type Props = {
  items: ClassItem[];
  onAdd?: () => void;
  actionLabel?: string; // default: + 수업 추가
  titleMode?: 'subject' | 'date'; // default: subject for dashboard/day
  showNotes?: boolean; // default: false (hide in dashboard/day)
};

export default function ClassList({ items, onAdd, actionLabel = '+ 수업 추가', titleMode = 'subject', showNotes = false }: Props) {
  const navigate = useNavigate();
  return (
    <Section>
      <SectionHeader>
        <HeaderLeft>
          <SectionIcon aria-hidden>{bookIcon}</SectionIcon>
          <h4>수업 내역</h4>
        </HeaderLeft>
        <Actions>
          <ActionBtn type="button" onClick={onAdd}>{actionLabel}</ActionBtn>
        </Actions>
      </SectionHeader>
      <Grid>
        {items.map((c, i) => (
          <RecordCard key={`cls-${i}`}>
            <RecordHead>
              <div>
                <strong>{titleMode === 'date' ? formatDateLabel(c.date) : (c.subject || '수업')}</strong>
                {c.time && <SmallMuted style={{ marginLeft: 8 }}>{c.time}</SmallMuted>}
                <SmallMuted style={{ marginLeft: 8 }}>{typeLabel(c.date, c.time)}</SmallMuted>
              </div>
              <div>
                {c.courseId && (c.recordId || c.date) && (
                  <SmallBtn
                    type="button"
                    onClick={() => {
                      if (c.recordId) navigate(`/classes/${c.courseId}/history/${c.recordId}`);
                      else navigate(`/classes/${c.courseId}/history/date/${c.date}`);
                    }}
                  >상세</SmallBtn>
                )}
              </div>
            </RecordHead>

            <BlockTitle>출석</BlockTitle>
            <div style={{ display:'flex', gap:12, alignItems:'center' }}>
              <CountPill data-variant='present'>출석 {c.attPresent ?? 0}명</CountPill>
              <CountPill data-variant='absent'>결석 {c.attAbsent ?? 0}명</CountPill>
            </div>
            {showNotes && (
              <>
                <BlockTitle>수업 내용</BlockTitle>
                <ReadOnlyBox>
                  {(c.notes && c.notes.trim()) ? c.notes : '—'}
                </ReadOnlyBox>
              </>
            )}
          </RecordCard>
        ))}
      </Grid>
    </Section>
  );
}

// Status chip removed by request

function formatDateLabel(ymd?: string) {
  if (!ymd) return '-';
  try {
    const d = new Date(ymd);
    if (Number.isNaN(d.getTime())) return ymd;
    const day = '일월화수목금토'[d.getDay()];
    return `${ymd} (${day})`;
  } catch { return ymd; }
}
function typeLabel(ymd?: string, timeRange?: string) {
  if (!ymd) return '';
  try {
    const todayStart = new Date(); todayStart.setHours(0,0,0,0);
    const d = new Date(ymd); d.setHours(0,0,0,0);
    if (d < todayStart) return '지난 수업';
    if (d > todayStart) return '예정';
    // Same day: try to parse end time from "HH:mm ~ HH:mm"
    const end = (timeRange || '').split('~')[1]?.trim();
    if (end && /^\d{2}:\d{2}$/.test(end)) {
      const [hh, mm] = end.split(':').map(Number);
      const now = new Date();
      const endDate = new Date(); endDate.setHours(hh, mm, 0, 0);
      if (now > endDate) return '지난 수업';
    }
    return '예정';
  } catch { return ''; }
}

const Section = styled.section`
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 12px;
  background: #fff;
  display: flex;
  flex-direction: column;
  height: 100%; /* fill half container */
  min-height: 0; /* allow Grid to scroll */
`;
const SectionHeader = styled.div`
  display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;
  h4 { margin: 0; font-size: 15px; color: #111827; }
`;
const HeaderLeft = styled.div`
  display: flex; align-items: center; gap: 8px;
`;
const SectionIcon = styled.span`
  width: 28px; height: 28px; border-radius: 8px; display: grid; place-items: center; background: #f3f4f6; color: #4f46e5;
`;
const Actions = styled.div``;
const ActionBtn = styled.button`
  height: 32px; padding: 0 10px; border-radius: 8px; border: 1px solid #e5e7eb; background: #fff; color: #111827; font-weight: 700; font-size: 12px; cursor: pointer;
  &:hover { background: #f9fafb; }
`;
const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
  padding: 4px 2px;
  overflow: auto; /* scroll within fixed half */
  flex: 1 1 auto;
  min-height: 0;
  align-content: start; /* prevent single card from stretching to fill */
  align-items: start;   /* keep item height to content */
  grid-auto-rows: max-content; /* row height equals content height */
`;
// Unified "수업 내역" look
const RecordCard = styled.div` border:1px solid #e5e7eb; border-radius:12px; padding:12px; display:grid; gap:10px; `;
const RecordHead = styled.div` display:flex; align-items:center; justify-content:space-between; `;
const SmallMuted = styled.span` color:#9ca3af; font-size:12px; `;
const BlockTitle = styled.div` font-size:12px; font-weight:800; color:#6b7280; margin-top:4px; `;
const ReadOnlyBox = styled.div` white-space:pre-wrap; border:1px solid #f1f5f9; border-radius:10px; padding:10px; background:#f9fafb; color:#111827; font-size:14px; `;
const CountPill = styled.span`
  display:inline-flex; align-items:center; gap:4px; padding:2px 8px; border-radius:999px; border:1px solid #e5e7eb; font-size:12px; font-weight:800; color:#374151; background:#fff;
  &[data-variant='present']{ background:#ecfdf5; color:#065f46; border-color:#a7f3d0; }
  &[data-variant='absent']{ background:#fee2e2; color:#7f1d1d; border-color:#fecaca; }
`;
// removed unused styled components
/* Status chip styles removed */
const SmallBtn = styled.button`
  height: 28px; padding: 0 10px; border-radius: 8px; border: 1px solid #e5e7eb; background: #fff; color: #111827; font-size: 12px;
`;
/* legacy meta row removed */

const bookIcon = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);
