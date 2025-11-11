import styled from "styled-components";
import type { TeacherDetail } from "@/api/teachers";
import { TEACHER_MENU_OPTIONS } from "@/constants/teacherMenus";
import { TeacherCoursesTable } from "@/components/myAcademy/TeacherCoursesTable";
import type { TeacherCourseBrief } from "@/api/teachers";
const MENU_LABEL_MAP = new Map<string, string>(TEACHER_MENU_OPTIONS.map((option) => [option.key, option.label]));

type TeacherDetailPageViewProps = {
  loading: boolean;
  error: string | null;
  detail: TeacherDetail | null;
  onBack: () => void;
  onRetry: () => void;
  canEditMenus: boolean;
  onOpenMenuModal?: () => void;
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
  onOpenMenuModal,
  canDeleteTeacher = false,
  onRequestDelete,
  onChangeInstructor,
  coursesRef,
}: TeacherDetailPageViewProps) {
  if (loading) {
    return (
      <Container>
        <Header>
          <HeaderLeft>
            <BackButton type="button" onClick={onBack}>
              ← 강사 목록으로
            </BackButton>
            <h1>강사 상세</h1>
          </HeaderLeft>
        </Header>
        <Placeholder>강사 정보를 불러오는 중입니다…</Placeholder>
      </Container>
    );
  }

  if (error || !detail) {
    return (
      <Container>
        <Header>
          <HeaderLeft>
            <BackButton type="button" onClick={onBack}>
              ← 강사 목록으로
            </BackButton>
            <h1>강사 상세</h1>
          </HeaderLeft>
        </Header>
        <ErrorCard role="alert">
          <span>{error ?? "강사 정보를 찾을 수 없습니다."}</span>
          <div>
            <ActionButton type="button" onClick={onRetry}>
              새로고침
            </ActionButton>
          </div>
        </ErrorCard>
      </Container>
    );
  }

  const menuLabelMap = MENU_LABEL_MAP;
  const handleEditMenus = () => {
    onOpenMenuModal?.();
  };

  return (
    <Container>
      <Header>
        <HeaderLeft>
          <BackButton type="button" onClick={onBack}>
            ← 강사 목록으로
          </BackButton>
          <h1>강사 상세</h1>
        </HeaderLeft>
        {canDeleteTeacher ? (
          <HeaderActions>
            <DeleteButton type="button" onClick={onRequestDelete}>
              강사 삭제
            </DeleteButton>
          </HeaderActions>
        ) : null}
      </Header>

      <Card>
        <SectionTitle>기본 정보</SectionTitle>
        <InfoRow>
          <Label>이름</Label>
          <Value>{detail.name}</Value>
        </InfoRow>
        <InfoRow>
          <Label>아이디</Label>
          <Value>{detail.username}</Value>
        </InfoRow>
        <InfoRow>
          <Label>이메일</Label>
          <Value>{detail.email || "-"}</Value>
        </InfoRow>
        <InfoRow>
          <Label>연락처</Label>
          <Value>{detail.phone || "-"}</Value>
        </InfoRow>
        <InfoRow>
          <Label>휴대폰 인증</Label>
          <Value>{detail.phoneVerified ? "완료" : "미인증"}</Value>
        </InfoRow>
      </Card>

      <Card>
        <SectionHeader>
          <SectionTitle>메뉴 권한</SectionTitle>
          {canEditMenus ? (
            <EditButton type="button" onClick={handleEditMenus}>
              권한 수정
            </EditButton>
          ) : null}
        </SectionHeader>
        {detail.menus.length === 0 ? (
          <Placeholder>부여된 메뉴 권한이 없습니다.</Placeholder>
        ) : (
          <MenuGrid>
            {detail.menus.map((menu) => (
              <MenuChip key={menu}>{menuLabelMap.get(menu) ?? menu}</MenuChip>
            ))}
          </MenuGrid>
        )}
      </Card>

      <div ref={coursesRef}>
        <TeacherCoursesTable
          courses={detail.courses}
          onChangeInstructor={onChangeInstructor}
          actionLabel="수정"
        />
      </div>
    </Container>
  );
}

const Container = styled.div`
  display: grid;
  gap: 16px;
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  h1 {
    margin: 0;
    font-size: 24px;
    color: #111827;
  }
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const DeleteButton = styled.button`
  border: none;
  border-radius: 999px;
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 700;
  color: #fff;
  background: #dc2626;
  cursor: pointer;
  &:hover {
    background: #b91c1c;
  }
`;

const BackButton = styled.button`
  border: none;
  background: transparent;
  color: #4f46e5;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
  &:hover {
    text-decoration: underline;
  }
`;

const Card = styled.section`
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  background: linear-gradient(180deg, #ffffff 0%, #f9fafb 100%);
  padding: 18px;
  display: grid;
  gap: 12px;
`;

const SectionHeader = styled.div`
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

const EditButton = styled.button`
  border: 1px solid #cbd5f5;
  background: #ffffff;
  color: #4f46e5;
  font-size: 13px;
  font-weight: 600;
  border-radius: 999px;
  padding: 6px 14px;
  cursor: pointer;
  &:hover {
    background: #eef2ff;
  }
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

const Placeholder = styled.div`
  border: 1px dashed #d1d5db;
  border-radius: 12px;
  padding: 14px;
  text-align: center;
  color: #6b7280;
  font-size: 14px;
  background: #f9fafb;
`;

const ErrorCard = styled.div`
  border-radius: 16px;
  border: 1px solid #fecaca;
  background: #fef2f2;
  padding: 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  color: #b91c1c;
  font-size: 14px;
  flex-wrap: wrap;
`;

const ActionButton = styled.button`
  border: none;
  background: #4f46e5;
  color: #ffffff;
  font-size: 13px;
  font-weight: 600;
  border-radius: 10px;
  padding: 8px 16px;
  cursor: pointer;
  &:hover {
    background: #4338ca;
  }
`;

const MenuGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const MenuChip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 999px;
  background: #eef2ff;
  color: #3730a3;
  font-size: 12px;
  font-weight: 600;
`;
