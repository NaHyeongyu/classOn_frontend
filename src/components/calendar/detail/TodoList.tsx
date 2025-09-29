import styled from "styled-components";
import { useEffect, useState } from "react";
import type { TaskItem } from "../../../types/calendarDetail";
import { SmallBtn as UISmallBtn, buttonVariants } from "../../common/UI";
import { EmptyPlaceholder } from "../../common/EmptyPlaceholder";

type Props = {
  inProgress: TaskItem[];
  done: TaskItem[];
  onAdd?: () => void;
  onToggle?: (id: number, done: boolean) => void;
  onDelete?: (id: number) => void;
  onEdit?: (id: number) => void;
};

/**
 * EN: Todo list for a selected calendar day (drag-sortable, small actions).
 * KO: 선택된 날짜의 할일 목록(드래그 정렬 및 간단 액션 제공).
 */
export default function TodoList({ inProgress, done, onAdd, onToggle, onDelete, onEdit }: Props) {
  // Local order state (syncs from props)
  const [pList, setPList] = useState<TaskItem[]>(inProgress);
  useEffect(() => { setPList(inProgress); }, [inProgress]);
  // Touch 'done' so TS doesn't warn about unused parameter while keeping API compatible
  useEffect(() => { /* observed for future use */ }, [done]);
  // Touch optional callbacks to satisfy noUnusedParameters
  void onToggle; void onDelete; void onEdit;

  return (
    <Section>
      <SectionHeader>
        <HeaderLeft>
          <SectionIcon aria-hidden>{checkIcon}</SectionIcon>
          <h4>할 일</h4>
          <Count>{inProgress.length}</Count>
        </HeaderLeft>
        <Actions>
          <ActionBtn type="button" onClick={onAdd}>+ 할일 추가</ActionBtn>
        </Actions>
      </SectionHeader>
      {/* 진행 중 표시 제거 (Removed 'In Progress' label) */}
      {pList.length === 0 ? (
        <EmptyPlaceholder title="오늘 등록된 할 일이 없습니다." />
      ) : (
        <List>
          {pList.map((t, i) => (
            <TaskCard key={`p-${t.id ?? i}`}>
              <Left>
                <Dot aria-hidden />
                <TextArea>
                  <TaskTitle title={t.title}>{t.title}</TaskTitle>
                  {t.content && <TaskContent title={t.content}>{t.content}</TaskContent>}
                </TextArea>
              </Left>
              <BtnRow>
                {typeof t.id === "number" && (
                  <GhostBtn type="button" onClick={() => onEdit?.(t.id!)}>수정</GhostBtn>
                )}
                {typeof t.id === "number" && (
                  <DangerBtn type="button" onClick={() => onDelete?.(t.id!)}>삭제</DangerBtn>
                )}
              </BtnRow>
            </TaskCard>
          ))}
        </List>
      )}
    </Section>
  );
}

const Section = styled.section`
  border: 1px solid #e5e7eb; border-radius: 16px; padding: 12px; background: #fff; display: flex; flex-direction: column;
`;
const SectionHeader = styled.div`
  display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;
  h4 { margin: 0; font-size: 15px; color: #111827; }
`;
const HeaderLeft = styled.div`
  display: flex; align-items: center; gap: 8px;
`;
const SectionIcon = styled.span`
  width: 28px; height: 28px; border-radius: 8px; display: grid; place-items: center; background: #eef2ff; color: #4f46e5;
`;
const Actions = styled.div``;
const ActionBtn = styled.button`
  ${buttonVariants.outline};
  height: 36px;
  padding: 0 14px;
  font-size: 13px;
  font-weight: 600;
`;
// SubHeader removed
const Count = styled.span`
  background: #e5e7eb; color: #374151; height: 20px; min-width: 22px; padding: 0 6px; border-radius: 9999px; display: inline-flex; align-items: center; justify-content: center; font-weight: 700; font-size: 12px;
`;
const List = styled.div`
  display: grid;
  gap: 8px;
  padding: 4px 2px;
  /* 상세 페이지는 내부 스크롤 없이 전체 표시 */
`;
const TaskCard = styled.div<{ $dim?: boolean }>`
  display: grid; grid-template-columns: 1fr auto; align-items: flex-start; gap: 10px;
  border: 1px solid #e5e7eb; border-radius: 10px; padding: 10px 12px; background: #fff;
  transition: background 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
  &:hover { background: #fafafa; border-color: #e2e8f0; box-shadow: 0 1px 2px rgba(0,0,0,0.04); }
`;
const Left = styled.div`
  display: grid; grid-template-columns: 10px 1fr; gap: 10px; align-items: flex-start; min-width: 0;
`;
const TaskTitle = styled.div`
  font-weight: 800; margin-bottom: 2px; font-size: 14px; letter-spacing: -0.01em; color: #0f172a;
  display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden;
`;
const TaskContent = styled.div`
  color: #64748b;
  font-size: 12.5px;
  line-height: 1.5;
  white-space: pre-line;
  display: -webkit-box;
  -webkit-line-clamp: 5; /* 상세 페이지는 5줄 표시 */
  -webkit-box-orient: vertical;
  overflow: hidden;
`;
/* removed category/owner metadata display for cleaner look */
const GhostBtn = styled(UISmallBtn)`
  height: 32px;
  padding: 0 12px;
  font-size: 13px;
`;
const DangerBtn = styled(UISmallBtn)`
  height: 32px;
  padding: 0 12px;
  font-size: 13px;
  border-color: #ef4444;
  color: #ef4444;
  &:hover {
    background: #fee2e2;
    border-color: #dc2626;
  }
`;
const BtnRow = styled.div`
  display: flex; gap: 6px; align-items: center;
`;
const Dot = styled.span`
  width: 10px; height: 10px; border-radius: 9999px; background: #4f46e5; margin-top: 5px;
`;
const TextArea = styled.div`
  display: flex; flex-direction: column; gap: 2px; min-width: 0;
`;
// Drag handle removed
/* meta row removed */
/* Divider & CountPill removed to match dashboard style */

const checkIcon = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6L9 17l-5-5" />
  </svg>
);
