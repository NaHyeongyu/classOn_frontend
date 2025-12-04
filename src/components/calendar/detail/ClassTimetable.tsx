import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import type { ClassItem } from "../../../types/calendarDetail";
import { DashboardMoreButton } from "@/components/dashboard/DashboardButtons";
import { PrimaryButtonSm } from "../../common/UI";
import { EmptyPlaceholder } from "../../common/EmptyPlaceholder";
import ClassDetailModal from "./modals/ClassDetailModal";

type Props = {
  items?: ClassItem[] | null;
  onAdd?: () => void;
  actionLabel?: string;
  embedded?: boolean;
  maxHeight?: string;
};

const START_HOUR = 8;
const END_HOUR = 23;
const HOUR_HEIGHT = 60;

export default function ClassTimetable({
  items,
  onAdd,
  actionLabel = "+ 수업 추가",
  embedded = false,
  maxHeight,
}: Props) {
  const [selectedItem, setSelectedItem] = useState<ClassItem | null>(null);
  const [now, setNow] = useState(new Date());
  const containerRef = useRef<HTMLDivElement>(null);

  const records = Array.isArray(items) ? items : [];
  const canAdd = typeof onAdd === "function";

  const hours = Array.from(
    { length: END_HOUR - START_HOUR + 1 },
    (_, i) => START_HOUR + i
  );

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentMinutesFromStart = (currentHour - START_HOUR) * 60 + currentMinute;
  const currentTop = (currentMinutesFromStart / 60) * HOUR_HEIGHT;
  const showCurrentTime = currentHour >= START_HOUR && currentHour <= END_HOUR;

  // Auto-scroll to current time on mount or when data loads
  const hasScrolledRef = useRef(false);

  useEffect(() => {
    if (
      containerRef.current &&
      showCurrentTime &&
      records.length > 0 &&
      !hasScrolledRef.current
    ) {
      // Use setTimeout to ensure DOM is updated and layout is stable
      setTimeout(() => {
        if (containerRef.current) {
          // Scroll to show current time with some context above (e.g. 100px)
          // Using 'smooth' behavior for better UX
          containerRef.current.scrollTo({
            top: Math.max(0, currentTop - 100),
            behavior: 'smooth'
          });
          hasScrolledRef.current = true;
        }
      }, 100);
    }
  }, [records.length, showCurrentTime, currentTop]); // Run when records load

  return (
    <Section $embedded={embedded} $maxHeight={maxHeight}>
      <SectionHeader data-embedded={embedded || undefined}>
        <HeaderLeft>
          <SectionIcon aria-hidden>
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
          </SectionIcon>
          <h4>수업 내역</h4>
        </HeaderLeft>
        {canAdd && (
          <Actions>
            {embedded ? (
              <DashboardMoreButton type="button" onClick={onAdd}>
                {actionLabel}
              </DashboardMoreButton>
            ) : (
              <AddBtn type="button" onClick={onAdd}>
                {actionLabel}
              </AddBtn>
            )}
          </Actions>
        )}
      </SectionHeader>

      <TimetableContainer
        ref={containerRef}
        $embedded={embedded}
        $maxHeight={maxHeight}
      >
        {records.length === 0 ? (
          <EmptyPlaceholder
            title="등록된 수업 내역이 없습니다."
            description="오늘 수업을 기록하면 출석과 수업 내용을 한 번에 관리할 수 있어요."
            actionLabel={canAdd ? actionLabel.replace(/^\+\s*/, "") : undefined}
            onAction={canAdd ? onAdd : undefined}
            actionVariant="outline"
          />
        ) : (
          <TimetableGrid>
            <TimeColumn>
              {hours.map((h) => (
                <TimeLabel key={h} style={{ top: (h - START_HOUR) * HOUR_HEIGHT }}>
                  {h < 12 ? `AM ${h}시` : h === 12 ? `PM 12시` : `PM ${h - 12}시`}
                </TimeLabel>
              ))}
            </TimeColumn>
            <ContentColumn>
              {hours.map((h) => (
                <GridLine key={h} style={{ top: (h - START_HOUR) * HOUR_HEIGHT }} />
              ))}
              {showCurrentTime && (
                <CurrentTimeLine style={{ top: currentTop }} />
              )}
              {records.map((item, i) => {
                const pos = calculatePosition(item.time);
                if (!pos) return null;
                return (
                  <ClassBlock
                    key={i}
                    style={{
                      top: pos.top,
                      height: pos.height,
                    }}
                    onClick={() => setSelectedItem(item)}
                  >
                    <BlockSubject>
                      {item.subject}
                      <TimeText>{item.time}</TimeText>
                    </BlockSubject>
                  </ClassBlock>
                );
              })}
            </ContentColumn>
          </TimetableGrid>
        )}
      </TimetableContainer>

      <ClassDetailModal
        open={!!selectedItem}
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </Section>
  );
}

function calculatePosition(timeStr: string) {
  try {
    const [start, end] = timeStr.split("~").map((s) => s.trim());
    const [startH, startM] = start.split(":").map(Number);
    const [endH, endM] = end.split(":").map(Number);

    if (startH < START_HOUR) return null; // Skip if too early (or handle differently)

    const startMinutes = (startH - START_HOUR) * 60 + startM;
    const endMinutes = (endH - START_HOUR) * 60 + endM;
    const durationMinutes = endMinutes - startMinutes;

    return {
      top: (startMinutes / 60) * HOUR_HEIGHT,
      height: (durationMinutes / 60) * HOUR_HEIGHT,
    };
  } catch {
    return null;
  }
}

const Section = styled.section<{ $embedded?: boolean; $maxHeight?: string }>`
  border: ${({ $embedded, theme }) =>
    $embedded ? "0" : `1px solid ${theme.colors.border}`};
  border-radius: ${({ $embedded, theme }) =>
    $embedded ? "0" : theme.radii.lg};
  padding: ${({ $embedded }) => ($embedded ? "0" : "12px")};
  background: ${({ $embedded, theme }) =>
    $embedded ? "transparent" : theme.colors.surface};
  display: flex;
  flex-direction: column;
  height: ${({ $embedded, $maxHeight }) =>
    $maxHeight ?? ($embedded ? "auto" : "100%")};
  min-height: 0;
  overflow: hidden;
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
  &[data-embedded] {
    margin-bottom: 12px;
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

const AddBtn = styled(PrimaryButtonSm)`
  white-space: nowrap;
`;

const TimetableContainer = styled.div<{ $embedded?: boolean; $maxHeight?: string }>`
  flex: 1;
  overflow-y: auto;
  position: relative;
  /* Hide scrollbar for cleaner look if desired, or keep it */
`;

const TimetableGrid = styled.div`
  display: flex;
  position: relative;
  height: ${(END_HOUR - START_HOUR + 1) * HOUR_HEIGHT}px;
  padding-top: 10px; /* Space for first label */
`;

const TimeColumn = styled.div`
  width: 60px;
  position: relative;
  border-right: 1px solid #e5e7eb;
`;

const TimeLabel = styled.div`
  position: absolute;
  width: 100%;
  text-align: right;
  padding-right: 8px;
  font-size: 11px;
  color: #9ca3af;
  transform: translateY(-50%);
`;

const ContentColumn = styled.div`
  flex: 1;
  position: relative;
`;

const GridLine = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  border-top: 1px solid #f3f4f6;
`;

const ClassBlock = styled.div`
  position: absolute;
  left: 4px;
  right: 4px;
  background: #eff6ff; /* Light blue bg */
  border-left: 3px solid #3b82f6; /* Blue accent */
  border-radius: 4px;
  padding: 4px 8px;
  cursor: pointer;
  overflow: hidden;
  transition: transform 0.1s;
  
  &:hover {
    transform: scale(1.01);
    z-index: 10;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }
`;

const BlockSubject = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: #1e40af;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const TimeText = styled.span`
  color: #60a5fa; /* Lighter blue/gray */
  font-weight: 400;
  font-size: 0.9em;
  margin-left: 6px;
`;

const CurrentTimeLine = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  border-top: 2px solid #ef4444;
  z-index: 20;
  pointer-events: none;

  &::before {
    content: "";
    position: absolute;
    left: -5px;
    top: -5px;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #ef4444;
  }
`;
