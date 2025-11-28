import type { useStudentForm } from "@/features/studentForm/useStudentForm";
import {
  SideColumn,
  StickyCard,
  SummaryTitle,
  StatusBadge,
  TipNote,
  InfoCard,
  PreviewSection,
  PreviewSectionTitle,
  PreviewHeader,
  PreviewName,
  PreviewFields,
  PreviewField,
  PreviewLabel,
  PreviewValue,
} from "./StudentForm.styles";
import { formatPhone } from "@/lib/format";

type StudentFormState = ReturnType<typeof useStudentForm>;

type StudentFormSidebarProps = {
  flow: StudentFormState;
};

export function StudentFormSidebar({ flow }: StudentFormSidebarProps) {
  const { form, currentStatus, currentStatusLabel, intlAge } = flow;

  const trimmedName = form.name?.trim() || "미입력";
  const birthDisplay = form.birthDate
    ? `${form.birthDate}${intlAge != null ? ` (만 ${intlAge}세)` : ""}`
    : "-";
  const joinedDate = form.joinedDate || "-";
  const address = form.address?.trim() || "-";
  const guardianName = form.guardianName?.trim() || "-";
  const phone = formatPhone(form.phoneNumber);
  const guardianPhone = formatPhone(form.guardianPhone);

  return (
    <SideColumn aria-label="form tips and preview">
      <InfoCard>
        <h4>입력 팁</h4>
        <ul>
          <li>수강 상태는 언제든지 변경 가능하니 현재 상황을 기준으로 선택하세요.</li>
        </ul>
      </InfoCard>

      <StickyCard>
        <SummaryTitle>입력 미리 보기</SummaryTitle>
        <TipNote>저장 전 요약을 빠르게 확인할 수 있어요.</TipNote>
        <PreviewSection>
          <PreviewSectionTitle>기본 정보</PreviewSectionTitle>
          <PreviewHeader>
            <PreviewName>{trimmedName}</PreviewName>
            <StatusBadge $variant={currentStatus}>{currentStatusLabel}</StatusBadge>
          </PreviewHeader>
          <PreviewFields>
            <PreviewField>
              <PreviewLabel>연락처</PreviewLabel>
              <PreviewValue>{phone}</PreviewValue>
            </PreviewField>
            <PreviewField>
              <PreviewLabel>생년월일</PreviewLabel>
              <PreviewValue>{birthDisplay}</PreviewValue>
            </PreviewField>
            <PreviewField>
              <PreviewLabel>주소</PreviewLabel>
              <PreviewValue>{address}</PreviewValue>
            </PreviewField>
            <PreviewField>
              <PreviewLabel>등록일</PreviewLabel>
              <PreviewValue>{joinedDate}</PreviewValue>
            </PreviewField>
          </PreviewFields>
        </PreviewSection>

        <PreviewSection>
          <PreviewSectionTitle>부모님 정보</PreviewSectionTitle>
          <PreviewFields>
            <PreviewField>
              <PreviewLabel>보호자 이름</PreviewLabel>
              <PreviewValue>{guardianName}</PreviewValue>
            </PreviewField>
            <PreviewField>
              <PreviewLabel>보호자 연락처</PreviewLabel>
              <PreviewValue>{guardianPhone}</PreviewValue>
            </PreviewField>
          </PreviewFields>
        </PreviewSection>
      </StickyCard>
    </SideColumn>
  );
}
