import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import type { ClassItem } from "@/types/calendarDetail";
import { formatKoreanDate } from "@/lib/format";
import { GhostButton, PrimaryButton } from "@/components/common/UI";

type Props = {
  open: boolean;
  item: ClassItem | null;
  onClose: () => void;
};

export default function ClassDetailModal({ open, item, onClose }: Props) {
  const navigate = useNavigate();
  if (!open || !item) return null;

  const statusLabel = typeLabel(item.date, item.time);
  const statusTone = statusVariant(statusLabel);

  const handleMoreClick = () => {
    if (!item.courseId) return;
    if (item.recordId) {
      navigate(`/classes/${item.courseId}/history/${item.recordId}`);
    } else if (item.date) {
      navigate(`/classes/${item.courseId}/history/date/${item.date}`);
    }
  };

  const hasLink = item.courseId && (item.recordId || item.date);

  return (
    <ModalBackdrop onClick={onClose}>
      <ModalCard onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>{item.subject || "수업"}</ModalTitle>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </ModalHeader>

        <ModalBody>
          <MetaSection>
            <MetaRow>
              <Label>일시</Label>
              <Value>
                {formatDateLabel(item.date)} {item.time}
              </Value>
            </MetaRow>
            <MetaRow>
              <Label>상태</Label>
              <Value>
                {statusLabel && (
                  <StatusChip data-variant={statusTone}>
                    {statusLabel}
                  </StatusChip>
                )}
              </Value>
            </MetaRow>
          </MetaSection>

          <SectionTitle>출석 현황</SectionTitle>
          <AttendanceRow>
            <CountPill data-variant="present">
              출석 {item.attPresent ?? 0}명
            </CountPill>
            <CountPill data-variant="absent">
              결석 {item.attAbsent ?? 0}명
            </CountPill>
            <CountPill data-variant="none">
              미처리 {item.attUnprocessed ?? 0}명
            </CountPill>
          </AttendanceRow>

          <SectionTitle>수업 내용</SectionTitle>
          <NotesBox>
            {item.notes && item.notes.trim() ? item.notes : "—"}
          </NotesBox>
        </ModalBody>

        <ModalFooter>
          {hasLink && (
            <PrimaryButton onClick={handleMoreClick}>더보기</PrimaryButton>
          )}
          <GhostButton onClick={onClose}>닫기</GhostButton>
        </ModalFooter>
      </ModalCard>
    </ModalBackdrop>
  );
}

// Helper functions reused from ClassList
function formatDateLabel(ymd?: string) {
  if (!ymd) return "-";
  const formatted = formatKoreanDate(ymd, { includeWeekday: true });
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

// Styled Components
const ModalBackdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.28);
  display: grid;
  place-items: center;
  z-index: 1200;
`;

const ModalCard = styled.div`
  width: 400px;
  max-width: calc(100% - 32px);
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 8px 28px rgba(2, 6, 23, 0.12);
  overflow: hidden;
  animation: slideUp 0.2s ease-out;

  @keyframes slideUp {
    from { transform: translateY(10px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
`;

const ModalHeader = styled.div`
  padding: 20px 24px;
  border-bottom: 1px solid #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ModalTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #111827;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  color: #9ca3af;
  cursor: pointer;
  padding: 0;
  line-height: 1;
  &:hover { color: #4b5563; }
`;

const ModalBody = styled.div`
  padding: 24px;
`;

const MetaSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
`;

const MetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Label = styled.span`
  width: 40px;
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
`;

const Value = styled.span`
  font-size: 14px;
  color: #111827;
  font-weight: 500;
`;

const SectionTitle = styled.h4`
  margin: 0 0 12px;
  font-size: 14px;
  font-weight: 700;
  color: #374151;
`;

const AttendanceRow = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
`;

const NotesBox = styled.div`
  padding: 16px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  font-size: 14px;
  line-height: 1.6;
  color: #374151;
  white-space: pre-wrap;
`;

const ModalFooter = styled.div`
  padding: 16px 24px;
  background: #f9fafb;
  border-top: 1px solid #f3f4f6;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`;

const StatusChip = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  background: #f3f4f6;
  color: #4b5563;
  &[data-variant="past"] {
    background: #fef2f2;
    color: #ef4444;
  }
  &[data-variant="upcoming"] {
    background: #ecfdf5;
    color: #10b981;
  }
`;

const CountPill = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  background: #fff;
  border: 1px solid #e5e7eb;
  color: #374151;
  
  &[data-variant="present"] {
    background: #ecfdf5;
    color: #059669;
    border-color: #a7f3d0;
  }
  &[data-variant="absent"] {
    background: #fef2f2;
    color: #b91c1c;
    border-color: #fecaca;
  }
  &[data-variant="none"] {
    background: #f3f4f6;
    color: #6b7280;
  }
`;
