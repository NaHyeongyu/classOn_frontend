import type { useStudentForm } from "@/features/studentForm/useStudentForm";
import {
  SideColumn,
  StickyCard,
  SummaryTitle,
  SummaryList,
  StatusBadge,
  TipNote,
  InfoCard,
} from "./StudentForm.styles";

type StudentFormState = ReturnType<typeof useStudentForm>;

type StudentFormSidebarProps = {
  flow: StudentFormState;
};

export function StudentFormSidebar({ flow }: StudentFormSidebarProps) {
  const {
    form,
    currentStatus,
    currentStatusLabel,
    koreanAge,
    intlAge,
  } = flow;

  return (
    <SideColumn aria-label="form tips">
      <StickyCard>
        <SummaryTitle>입력 미리 보기</SummaryTitle>
        <SummaryList>
          <li>
            <span>이름</span>
            <strong>{form.name?.trim() || "미입력"}</strong>
          </li>
          <li>
            <span>상태</span>
            <StatusBadge $variant={currentStatus}>{currentStatusLabel}</StatusBadge>
          </li>
          <li>
            <span>나이</span>
            <strong>
              {koreanAge != null ? `${koreanAge}세` : "-"}
              {intlAge != null ? ` / 만 ${intlAge}` : ""}
            </strong>
          </li>
          <li>
            <span>등록일</span>
            <strong>{form.joinedDate ?? "-"}</strong>
          </li>
        </SummaryList>
        <TipNote>저장 전 요약을 빠르게 확인할 수 있어요.</TipNote>
      </StickyCard>

      <InfoCard>
        <h4>입력 팁</h4>
        <ul>
          <li>수강 상태는 언제든지 변경 가능하니 현재 상황을 기준으로 선택하세요.</li>
        </ul>
      </InfoCard>
    </SideColumn>
  );
}
