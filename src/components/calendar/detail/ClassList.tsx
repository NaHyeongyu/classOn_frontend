import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import type { ClassItem } from "../../../types/calendarDetail";
import { SmallBtn as UISmallBtn, PrimaryButtonSm } from "../../common/UI";
import { EmptyPlaceholder } from "../../common/EmptyPlaceholder";
import { formatKoreanDate } from "@/lib/format";

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
  showNotes = true,
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
            <AddBtn type="button" onClick={onAdd}>
              {actionLabel}
            </AddBtn>
          </Actions>
        )}
      </SectionHeader>
      <Grid>
        {records.length === 0 ? (
          <EmptyPlaceholder
            title="등록된 수업 내역이 없습니다."
            description="오늘 수업을 기록하면 출석과 수업 내용을 한 번에 관리할 수 있어요."
            actionLabel={canAdd ? actionLabel.replace(/^\+\s*/, "") : undefined}
            onAction={canAdd ? onAdd : undefined}
            actionVariant="outline"
          />
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
                      <DetailBtn
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
                      </DetailBtn>
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
  const formatted = formatKoreanDate(ymd, { includeWeekday: true });
  return formatted === "—" ? ymd : formatted;
}

function formatDateBadge(ymd?: string) {
  if (!ymd) return "-";
  const formatted = formatKoreanDate(ymd, { includeYear: false, includeWeekday: true });
  return formatted === "—" ? ymd : formatted;
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
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.radii.lg};
  padding: 12px;
  background: ${(p) => p.theme.colors.surface};
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
    color: ${(p) => p.theme.colors.text};
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
  background: ${(p) => p.theme.colors.primarySurface};
  color: ${(p) => p.theme.colors.primary};
`;
const Actions = styled.div``;
const AddBtn = styled(PrimaryButtonSm)``;
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
// Unified "수업 내역" look
const RecordCard = styled.div`
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.radii.md};
  padding: 12px;
  background: ${(p) => p.theme.colors.surface};
  display: grid;
  gap: 10px;
`;
const RecordHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const SmallMuted = styled.span`
  color: ${(p) => p.theme.colors.textMuted};
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
  background: ${(p) => p.theme.colors.surfaceMuted};
  color: #4b5563;
  &[data-variant="past"] {
    background: ${(p) => p.theme.colors.dangerSurface};
    color: ${(p) => p.theme.colors.danger};
  }
  &[data-variant="upcoming"] {
    background: ${(p) => p.theme.colors.successSurface};
    color: ${(p) => p.theme.colors.success};
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
  background: ${(p) => p.theme.colors.primarySurface};
  color: ${(p) => p.theme.colors.primary};
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
  border: 1px solid ${(p) => p.theme.colors.borderMuted};
  border-radius: ${(p) => p.theme.radii.md};
  padding: 10px;
  background: ${(p) => p.theme.colors.surfaceMuted};
  color: ${(p) => p.theme.colors.text};
  font-size: 14px;
  line-height: 1.5;
  max-height: calc(1.5em * 3 + 20px); /* 3 lines + vertical padding */
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3; /* show 3 lines */
  -webkit-box-orient: vertical;
`;
const CountPill = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: 999px;
  border: 1px solid ${(p) => p.theme.colors.border};
  font-size: 12px;
  font-weight: 800;
  color: #374151;
  background: ${(p) => p.theme.colors.bg};
  &[data-variant="present"] {
    background: ${(p) => p.theme.colors.successSurface};
    color: ${(p) => p.theme.colors.success};
    border-color: #a7f3d0;
  }
  &[data-variant="absent"] {
    background: ${(p) => p.theme.colors.dangerSurface};
    color: #7f1d1d;
    border-color: #fecaca;
  }
  &[data-variant="none"] {
    background: ${(p) => p.theme.colors.surfaceMuted};
    color: ${(p) => p.theme.colors.textMuted};
    border-color: ${(p) => p.theme.colors.border};
  }
`;
const DetailBtn = styled(UISmallBtn)`
  height: 40px;
  padding: 0 16px;
  font-size: 14px;
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
