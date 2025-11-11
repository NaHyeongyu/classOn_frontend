import styled from "styled-components";
import { useMemo } from "react";
import type { AcademyDetail } from "@/api/account";
import { maskBiz } from "@/features/myAcademy/utils";

type AccountSectionProps = {
  name: string;
  phone: string;
  onOpenProfileModal: () => void;
  onOpenPhoneModal: () => void;
  onOpenPasswordModal: () => void;
};

type AcademySectionProps = {
  data: AcademyDetail | null;
  onOpenEditModal: () => void;
};

type TeacherSummary = {
  id: number;
  name: string;
  username: string;
  email?: string | null;
  phone?: string | null;
  courseCount: number;
};

type TeacherSectionProps = {
  loading: boolean;
  error: string | null;
  teachers: TeacherSummary[];
  onRefresh: () => void | Promise<void>;
  onOpenCreate: () => void;
  onSelect: (id: number) => void;
};

type MyAcademyPageViewProps = {
  error: string | null;
  onDismissError?: () => void;
  onLogout: () => void;
  account: AccountSectionProps;
  academy: AcademySectionProps;
  teachers: TeacherSectionProps;
};

export function MyAcademyPageView({
  error,
  onDismissError,
  onLogout,
  account,
  academy,
  teachers,
}: MyAcademyPageViewProps) {
  const academyCategory = useMemo(() => {
    if (!academy.data) return "미설정";
    const { category1, category2, categoryEtc } = academy.data;
    if (!category1) return "미설정";
    if (category1 === "기타") {
      return categoryEtc ? `${category1} · ${categoryEtc}` : category1;
    }
    return category2 ? `${category1} · ${category2}` : category1;
  }, [academy.data]);

  return (
    <Container>
      <Header>
        <div>
          <h1>내 학원 정보</h1>
          <p>계정 및 학원 정보를 확인하고 필요 시 수정하세요.</p>
        </div>
        <HeaderActions>
          <OutlineButton type="button" onClick={onLogout}>
            로그아웃
          </OutlineButton>
        </HeaderActions>
      </Header>

      {error ? (
        <ErrorBanner>
          <span>{error}</span>
          {onDismissError ? (
            <DismissButton type="button" onClick={onDismissError}>
              닫기
            </DismissButton>
          ) : null}
        </ErrorBanner>
      ) : null}

      <Card>
        <SectionTitle>계정 정보</SectionTitle>
        <InfoRow>
          <Label>담당자 성함</Label>
          <Value>
            <ValueRow>
              <span>{account.name || "-"}</span>
              <InlineButton type="button" onClick={account.onOpenProfileModal}>
                이름 수정
              </InlineButton>
            </ValueRow>
          </Value>
        </InfoRow>
        <InfoRow>
          <Label>휴대폰 번호</Label>
          <Value>
            <ValueRow>
              <span>{account.phone || "-"}</span>
              <InlineButton type="button" onClick={account.onOpenPhoneModal}>
                번호 변경
              </InlineButton>
            </ValueRow>
            <Hint>휴대폰 번호는 인증 모달에서 변경할 수 있습니다.</Hint>
          </Value>
        </InfoRow>
        <InfoRow>
          <Label>비밀번호</Label>
          <Value>
            <ValueRow>
              <span>••••••••</span>
              <InlineButton
                type="button"
                onClick={account.onOpenPasswordModal}
              >
                비밀번호 변경
              </InlineButton>
            </ValueRow>
          </Value>
        </InfoRow>
      </Card>

      <Card>
        <SectionHeader>
          <SectionTitle>학원 정보</SectionTitle>
          <InlineButton type="button" onClick={academy.onOpenEditModal}>
            학원 정보 수정
          </InlineButton>
        </SectionHeader>
        <InfoRow>
          <Label>학원명</Label>
          <Value>{academy.data?.name || "-"}</Value>
        </InfoRow>
        <InfoRow>
          <Label>카테고리</Label>
          <Value>{academyCategory || "-"}</Value>
        </InfoRow>
        <InfoRow>
          <Label>주소</Label>
          <Value>{academy.data?.address || "-"}</Value>
        </InfoRow>
        <InfoRow>
          <Label>대표자명</Label>
          <Value>{academy.data?.representativeName || "-"}</Value>
        </InfoRow>
        <InfoRow>
          <Label>학원 대표번호</Label>
          <Value>{academy.data?.phone || "-"}</Value>
        </InfoRow>
        <InfoRow>
          <Label>청구용 이메일</Label>
          <Value>{academy.data?.billingEmail || "-"}</Value>
        </InfoRow>
        <InfoRow>
          <Label>사업자번호</Label>
          <Value>{academy.data?.bizNo ? maskBiz(academy.data.bizNo) : "-"}</Value>
        </InfoRow>
      </Card>

      <Card>
        <SectionHeader>
          <SectionTitle>강사 목록</SectionTitle>
          <TeacherActions>
            <InlineButton type="button" onClick={() => { void teachers.onRefresh(); }} disabled={teachers.loading}>
              새로고침
            </InlineButton>
            <PrimaryButton type="button" onClick={teachers.onOpenCreate}>
              강사 추가
            </PrimaryButton>
          </TeacherActions>
        </SectionHeader>
        {teachers.loading ? (
          <TeacherPlaceholder>강사 정보를 불러오는 중입니다…</TeacherPlaceholder>
        ) : teachers.error ? (
          <TeacherError role="alert">
            <span>{teachers.error}</span>
            <InlineButton type="button" onClick={() => { void teachers.onRefresh(); }}>
              다시 시도
            </InlineButton>
          </TeacherError>
        ) : teachers.teachers.length === 0 ? (
          <TeacherPlaceholder>등록된 강사가 없습니다. 강사 추가 버튼으로 강사를 초대해 보세요.</TeacherPlaceholder>
        ) : (
          <TeacherTable>
            <thead>
              <tr>
                <th scope="col">이름</th>
                <th scope="col">아이디</th>
                <th scope="col">연락처</th>
                <th scope="col" className="email">이메일</th>
                <th scope="col" className="num">담당 수업</th>
              </tr>
            </thead>
            <tbody>
              {teachers.teachers.map((teacher) => (
                <tr
                  key={teacher.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => teachers.onSelect(teacher.id)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      teachers.onSelect(teacher.id);
                    }
                  }}
                >
                  <td>{teacher.name || "-"}</td>
                  <td>{teacher.username}</td>
                  <td>{teacher.phone || "-"}</td>
                  <td className="email">{teacher.email || "-"}</td>
                  <td className="num">{teacher.courseCount}</td>
                </tr>
              ))}
            </tbody>
          </TeacherTable>
        )}
      </Card>
    </Container>
  );
}

export function MyAcademyLoadingView() {
  return (
    <Container>
      <Header>
        <div>
          <h1>내 학원 정보</h1>
          <p>불러오는 중…</p>
        </div>
        <HeaderActions>
          <OutlineButton type="button" disabled>
            로그아웃
          </OutlineButton>
        </HeaderActions>
      </Header>
      <SkeletonCard />
      <SkeletonCard />
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
  h1 {
    margin: 0;
    font-size: 24px;
    color: #111827;
  }
  p {
    margin: 6px 0 0;
    color: #6b7280;
    font-size: 14px;
  }
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const OutlineButton = styled.button`
  border: 1px solid #e5e7eb;
  background: #ffffff;
  color: #374151;
  font-weight: 600;
  border-radius: 10px;
  padding: 8px 16px;
  cursor: pointer;
  &:hover:not(:disabled) {
    background: #f8fafc;
  }
  &:disabled {
    cursor: not-allowed;
    opacity: 0.65;
  }
`;

const Card = styled.section`
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  background: linear-gradient(180deg, #ffffff 0%, #f9fafb 100%);
  padding: 18px;
  display: grid;
  gap: 12px;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.05);
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const SectionTitle = styled.h2`
  margin: 0;
  font-size: 16px;
  color: #1f2937;
`;

const InfoRow = styled.div`
  display: grid;
  grid-template-columns: 140px 1fr;
  gap: 14px;
  align-items: flex-start;
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 8px;
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
  display: block;
`;

const ValueRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
`;

const InlineButton = styled.button`
  border: none;
  background: transparent;
  color: #4f46e5;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
  &:hover {
    text-decoration: underline;
  }
`;

const Hint = styled.p`
  margin: 6px 0 0;
  font-size: 12px;
  color: #6b7280;
`;

const TeacherActions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

const PrimaryButton = styled.button`
  border: none;
  background: #4f46e5;
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  border-radius: 10px;
  padding: 8px 16px;
  cursor: pointer;
  box-shadow: 0 8px 16px rgba(79, 70, 229, 0.25);
  &:hover:not(:disabled) {
    background: #4338ca;
  }
  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
    box-shadow: none;
  }
`;

const ErrorBanner = styled.div`
  border-radius: 12px;
  background: #fee2e2;
  border: 1px solid #fecaca;
  padding: 12px 16px;
  color: #b91c1c;
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const DismissButton = styled.button`
  border: none;
  background: transparent;
  color: #b91c1c;
  font-weight: 600;
  cursor: pointer;
`;

const SkeletonCard = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 18px;
  background: linear-gradient(90deg, #f3f4f6 0%, #f9fafb 50%, #f3f4f6 100%);
  background-size: 200% 100%;
  animation: shimmer 1.6s infinite;

  @keyframes shimmer {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
`;

const TeacherPlaceholder = styled.div`
  border: 1px dashed #d1d5db;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  color: #6b7280;
  font-size: 14px;
  background: #f9fafb;
`;

const TeacherError = styled.div`
  border-radius: 12px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  padding: 14px 18px;
  color: #b91c1c;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
`;

const TeacherTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: inset 0 0 0 1px #e5e7eb;
  thead th {
    text-align: center;
    background: #f3f4f6;
    color: #374151;
    font-size: 13px;
    font-weight: 600;
    padding: 12px 16px;
  }
  thead th.email,
  tbody td.email {
    word-break: break-all;
  }
  tbody td {
    font-size: 14px;
    color: #1f2937;
    padding: 12px 16px;
    border-top: 1px solid #e5e7eb;
    text-align: center;
  }
  tbody tr:nth-child(even) td {
    background: #f9fafb;
  }
  tbody tr:hover td {
    background: #eef2ff;
  }
  tbody tr {
    cursor: pointer;
    outline: none;
  }
  tbody tr:focus-visible td {
    box-shadow: inset 0 0 0 2px #4f46e5;
  }
  td.num {
    font-variant-numeric: tabular-nums;
  }
`;
