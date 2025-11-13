import styled from "styled-components";
import type { TeacherDetail } from "@/api/teachers";
import type { TeacherCourseBrief } from "@/api/teachers";
import { TeacherCoursesTable } from "@/components/myAcademy/TeacherCoursesTable";
import BackButton from "@/components/common/BackButton";
import { Page, GhostButton } from "@/components/common/UI";
import { Card as StuCard, SectionTitle as StuSectionTitle, Divider as StuDivider } from "@/components/studentDetail/StudentDetailStyles";

type TeacherDetailPageViewProps = {
  loading: boolean;
  error: string | null;
  detail: TeacherDetail | null;
  onBack: () => void;
  onRetry: () => void;
  canEditMenus: boolean;
  onOpenPasswordModal?: () => void;
  canDeleteTeacher?: boolean;
  onRequestDelete?: () => void;
  onChangeInstructor?: (course: TeacherCourseBrief) => void;
  coursesRef?: React.Ref<HTMLDivElement>;
};

export function TeacherDetailPageView({
  loading,
  error,
  detail,
  onBack,
  onRetry,
  canEditMenus,
  onOpenPasswordModal,
  canDeleteTeacher = false,
  onRequestDelete,
  onChangeInstructor,
  coursesRef,
}: TeacherDetailPageViewProps) {
  if (loading) {
    return (
      <Page>
        <TopBar>
          <TopLeft>
            <BackButton onClick={onBack} label="뒤로" />
            <h2>강사 상세</h2>
          </TopLeft>
        </TopBar>
        <StuCard>강사 정보를 불러오는 중입니다…</StuCard>
      </Page>
    );
  }

  if (error || !detail) {
    return (
      <Page>
        <TopBar>
          <TopLeft>
            <BackButton onClick={onBack} label="뒤로" />
            <h2>강사 상세</h2>
          </TopLeft>
        </TopBar>
        <StuCard role="alert">{error ?? "강사 정보를 찾을 수 없습니다."}</StuCard>
      </Page>
    );
  }

  // 메뉴 권한 UI 제거 (기본 세트 자동 부여)

  return (
    <Page>
      <TopBar>
        <TopLeft>
          <BackButton label="뒤로" onClick={onBack} />
          <h2>강사 상세</h2>
        </TopLeft>
        {canDeleteTeacher ? (
          <GhostButton data-variant="danger" type="button" onClick={onRequestDelete}>
            강사 삭제
          </GhostButton>
        ) : null}
      </TopBar>

      <Columns>
        <Left>
          <StuCard>
            <HeaderRow>
              <StuSectionTitle>기본 정보</StuSectionTitle>
              {canEditMenus ? (
                <GhostButton type="button" onClick={onOpenPasswordModal}>
                  비밀번호 재설정
                </GhostButton>
              ) : null}
            </HeaderRow>
            <StuDivider />
            <InfoRow>
              <Label>이름</Label>
              <Value>{detail.name}</Value>
            </InfoRow>
            <InfoRow>
              <Label>아이디</Label>
              <Value>{detail.username}</Value>
            </InfoRow>
            <InfoRow>
              <Label>연락처</Label>
              <Value>{detail.phone || "-"}</Value>
            </InfoRow>
          </StuCard>

          {/* 메뉴 권한 카드 제거 */}
        </Left>

        <Right ref={coursesRef as React.RefObject<HTMLDivElement>}>
          <TeacherCoursesTable teacherId={detail.id} courses={detail.courses} />
        </Right>
      </Columns>
    </Page>
  );
}

const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 2px;
  h2 { margin: 0; font-size: 20px; color: #0f172a; }
`;

const TopLeft = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const SectionTitle = styled.h2`
  margin: 0;
  color: #1f2937;
  font-size: 16px;
`;

const InfoRow = styled.div`
  display: grid;
  grid-template-columns: 140px 1fr;
  gap: 12px;
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const Label = styled.span`
  font-size: 12px;
  color: #6b7280;
  letter-spacing: 0.03em;
`;

const Value = styled.span`
  font-size: 15px;
  color: #111827;
  font-weight: 600;
`;

/* removed: menu permission chips */

const Columns = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.25fr;
  gap: 16px;
  align-items: start;
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const Left = styled.div`
  display: grid;
  gap: 16px;
`;

const Right = styled.div`
  display: grid;
`;
