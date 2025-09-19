import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import type { ClassItem } from "../../../types/calendarDetail";

type Props = {
  items?: ClassItem[] | null;
  onAdd?: () => void;
  actionLabel?: string; // default: + 수업 추가
  titleMode?: "subject" | "date"; // default: subject for dashboard/day
  showNotes?: boolean; // default: false (hide in dashboard/day)
};

export default function ClassList({
  items,
  onAdd,
  actionLabel = "+ 수업 추가",
  titleMode = "subject",
  showNotes = false,
}: Props) {
  const navigate = useNavigate();
  const records = Array.isArray(items) ? items : [];
  const canAdd = typeof onAdd === "function";
  return (
    <Section>
      <SectionHeader>
        <HeaderLeft>
          <SectionIcon aria-hidden>{bookIcon}</SectionIcon>
          <h4>수업 내역</h4>
        </HeaderLeft>
        {canAdd && (
          <Actions>
            <ActionBtn type="button" onClick={onAdd}>
              {actionLabel}
            </ActionBtn>
          </Actions>
        )}
      </SectionHeader>
      <Grid>
        {records.length === 0 ? (
          <EmptyState>
            <p>등록된 수업 내역이 없습니다.</p>
            {canAdd && (
              <EmptyActionBtn type="button" onClick={onAdd}>
                {actionLabel.replace(/^\+\s*/, "")}
              </EmptyActionBtn>
            )}
          </EmptyState>
        ) : (
          records.map((c, i) => {
            const statusLabel = typeLabel(c.date, c.time);
            const statusTone = statusVariant(statusLabel);
            return (
              <RecordCard key={`cls-${i}`}>
                <RecordHead>
                  <div>
                    <strong>
                      {titleMode === "date"
                        ? formatDateLabel(c.date)
                        : c.subject || "수업"}
                    </strong>
                    {(c.time || statusLabel) && (
                      <MetaRow>
                        {c.time && <SmallMuted>{c.time}</SmallMuted>}
                        {statusLabel && (
                          <StatusChip data-variant={statusTone}>
                            <span aria-hidden>{statusIcon(statusTone)}</span>
                            {statusLabel}
                          </StatusChip>
                        )}
                      </MetaRow>
                    )}
                  </div>
                  <HeadRight>
                    {c.date && (
                      <DateBadge aria-label="수업 일자">
                        {formatDateBadge(c.date)}
                      </DateBadge>
                    )}
                    {c.courseId && (c.recordId || c.date) && (
                      <SmallBtn
                        type="button"
                        onClick={() => {
                          if (c.recordId)
                            navigate(
                              `/classes/${c.courseId}/history/${c.recordId}`
                            );
                          else
                            navigate(
                              `/classes/${c.courseId}/history/date/${c.date}`
                            );
                        }}
                      >
                        상세
                      </SmallBtn>
                    )}
                  </HeadRight>
                </RecordHead>

                <BlockTitle>출석</BlockTitle>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <CountPill data-variant="present">
                    출석 {c.attPresent ?? 0}명
                  </CountPill>
                  <CountPill data-variant="absent">
                    결석 {c.attAbsent ?? 0}명
                  </CountPill>
                  <CountPill data-variant="none">
                    미처리 {c.attUnprocessed ?? 0}명
                  </CountPill>
                </div>
                {showNotes && (
                  <>
                    <BlockTitle>수업 내용</BlockTitle>
                    <ReadOnlyBox>
                      {c.notes && c.notes.trim() ? c.notes : "—"}
                    </ReadOnlyBox>
                  </>
                )}
              </RecordCard>
            );
          })
        )}
      </Grid>
    </Section>
  );
}

function formatDateLabel(ymd?: string) {
  if (!ymd) return "-";
  try {
    const d = new Date(ymd);
    if (Number.isNaN(d.getTime())) return ymd;
    const day = "일월화수목금토"[d.getDay()];
    return `${ymd} (${day})`;
  } catch {
    return ymd;
  }
}
function formatDateBadge(ymd?: string) {
  if (!ymd) return "-";
  try {
    const d = new Date(ymd);
    if (Number.isNaN(d.getTime())) return ymd;
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const date = String(d.getDate()).padStart(2, "0");
    const day = "일월화수목금토"[d.getDay()];
    return `${month}월 ${date}일 (${day})`;
  } catch {
    return ymd;
  }
}
function typeLabel(ymd?: string, timeRange?: string) {
  if (!ymd) return "";
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const d = new Date(ymd);
    d.setHours(0, 0, 0, 0);
    if (d < todayStart) return "지난 수업";
    if (d > todayStart) return "예정";
    // Same day: try to parse end time from "HH:mm ~ HH:mm"
    const end = (timeRange || "").split("~")[1]?.trim();
    if (end && /^\d{2}:\d{2}$/.test(end)) {
      const [hh, mm] = end.split(":").map(Number);
      const now = new Date();
      const endDate = new Date();
      endDate.setHours(hh, mm, 0, 0);
      if (now > endDate) return "지난 수업";
    }
    return "예정";
  } catch {
    return "";
  }
}
type StatusVariant = "past" | "upcoming" | "default";
function statusVariant(label?: string | null): StatusVariant {
  if (label === "지난 수업") return "past";
  if (label === "예정") return "upcoming";
  return "default";
}
function statusIcon(tone: StatusVariant) {
  switch (tone) {
    case "past":
      return "⌛";
    case "upcoming":
      return "🗓";
    default:
      return "•";
  }
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
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
  h4 {
    margin: 0;
    font-size: 15px;
    color: #111827;
  }
`;
const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;
const SectionIcon = styled.span`
  width: 28px;
  height: 28px;
  border-radius: 8px;
  display: grid;
  place-items: center;
  background: #f3f4f6;
  color: #4f46e5;
`;
const Actions = styled.div``;
const ActionBtn = styled.button`
  height: 32px;
  padding: 0 10px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  background: #fff;
  color: #111827;
  font-weight: 700;
  font-size: 12px;
  cursor: pointer;
  &:hover {
    background: #f9fafb;
  }
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
  align-items: start; /* keep item height to content */
  grid-auto-rows: max-content; /* row height equals content height */
`;
const EmptyState = styled.div`
  color: #6b7280;
  font-size: 13px;
  text-align: center;
  border: 1px dashed #e5e7eb;
  border-radius: 10px;
  padding: 18px 12px;
  background: #fafafa;
  display: grid;
  gap: 10px;
  justify-items: center;
  p {
    margin: 0;
  }
`;
const EmptyActionBtn = styled.button`
  height: 34px;
  padding: 0 16px;
  border-radius: 10px;
  border: none;
  background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
  color: #fff;
  font-weight: 800;
  font-size: 13px;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(99, 102, 241, 0.2);
  &:hover {
    filter: brightness(1.05);
  }
  &:active {
    transform: translateY(1px);
  }
`;
// Unified "수업 내역" look
const RecordCard = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 12px;
  display: grid;
  gap: 10px;
`;
const RecordHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const SmallMuted = styled.span`
  color: #9ca3af;
  font-size: 12px;
`;
const MetaRow = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 4px;
  flex-wrap: wrap;
`;
const StatusChip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  background: #f3f4f6;
  color: #4b5563;
  &[data-variant='past'] {
    background: #fee2e2;
    color: #b91c1c;
  }
  &[data-variant='upcoming'] {
    background: #d1fae5;
    color: #047857;
  }
`;
const HeadRight = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  flex-wrap: wrap;
`;
const DateBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 999px;
  background: linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%);
  color: #3730a3;
  font-weight: 700;
  font-size: 12px;
  white-space: nowrap;
`;
const BlockTitle = styled.div`
  font-size: 12px;
  font-weight: 800;
  color: #6b7280;
  margin-top: 4px;
`;
const ReadOnlyBox = styled.div`
  white-space: pre-wrap;
  border: 1px solid #f1f5f9;
  border-radius: 10px;
  padding: 10px;
  background: #f9fafb;
  color: #111827;
  font-size: 14px;
`;
const CountPill = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: 999px;
  border: 1px solid #e5e7eb;
  font-size: 12px;
  font-weight: 800;
  color: #374151;
  background: #fff;
  &[data-variant="present"] {
    background: #ecfdf5;
    color: #065f46;
    border-color: #a7f3d0;
  }
  &[data-variant="absent"] {
    background: #fee2e2;
    color: #7f1d1d;
    border-color: #fecaca;
  }
  &[data-variant="none"] {
    background: #f3f4f6;
    color: #6b7280;
    border-color: #e5e7eb;
  }
`;
const SmallBtn = styled.button`
  height: 28px;
  padding: 0 10px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  background: #fff;
  color: #111827;
  font-size: 12px;
`;

const bookIcon = (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);
