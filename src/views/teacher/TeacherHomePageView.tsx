import styled from "styled-components";
import {
  EmptyState,
  GhostButton,
  Page,
  PageHeader,
  PrimaryButton,
  Scroller,
  SectionCard,
  TableBase,
} from "@/components/common/UI";
import { LoadingSpinner } from "@/components/common/Loading";
import type { TeacherProfile } from "@/api/teachers";
import { CourseStatusBadge } from "@/components/common/CourseStatusBadge";

type TeacherHomePageViewProps = {
  loading: boolean;
  error: string | null;
  profile: TeacherProfile | null;
  onRefresh: () => void;
  onOpenProfileModal: () => void;
  onNavigateCourse: (courseId: number) => void;
};

export function TeacherHomePageView({
  loading,
  error,
  profile,
  onRefresh,
  onOpenProfileModal,
  onNavigateCourse,
}: TeacherHomePageViewProps) {
  if (loading && !profile) {
    return (
      <Centered>
        <LoadingSpinner />
        <p>강사 정보를 불러오는 중입니다…</p>
      </Centered>
    );
  }

  return (
    <Page>
      <PageHeader>
        <div>
          <h2>강사 홈</h2>
          <p>담당 수업과 연락처를 한눈에 확인하세요.</p>
        </div>
        <Actions>
          <GhostButton type="button" onClick={onRefresh} disabled={loading}>
            새로고침
          </GhostButton>
          <PrimaryButton type="button" onClick={onOpenProfileModal} disabled={!profile}>
            내 정보 관리
          </PrimaryButton>
        </Actions>
      </PageHeader>

      {error ? (
        <AlertCard role="alert">
          <strong>정보를 불러오지 못했습니다.</strong>
          <p>{error}</p>
          <GhostButton type="button" onClick={onRefresh} disabled={loading}>
            다시 시도
          </GhostButton>
        </AlertCard>
      ) : null}

      {profile ? (
        <>
          <SectionCard aria-labelledby="teacher-profile-heading">
            <CardHeader>
              <div>
                <CardTitle id="teacher-profile-heading">{profile.name} 강사님</CardTitle>
                <CardSubtitle>{profile.username}</CardSubtitle>
              </div>
              <StatusBadge data-verified={profile.phoneVerified || undefined}>
                {profile.phoneVerified ? "휴대폰 인증 완료" : "휴대폰 미인증"}
              </StatusBadge>
            </CardHeader>
            <InfoGrid>
              <dt>이름</dt>
              <dd>{profile.name || "미입력"}</dd>
              <dt>아이디</dt>
              <dd>{profile.username}</dd>
              <dt>이메일</dt>
              <dd>{profile.email || "미입력"}</dd>
              <dt>전화번호</dt>
              <dd>{profile.phone || "미입력"}</dd>
              <dt>담당 수업</dt>
              <dd>{profile.courses.length}개</dd>
            </InfoGrid>
          </SectionCard>

          <SectionCard aria-labelledby="teacher-courses-heading">
            <CardHeader>
              <div>
                <CardTitle id="teacher-courses-heading">담당 수업</CardTitle>
                <CardSubtitle>배정된 수업 목록과 시간을 확인하세요.</CardSubtitle>
              </div>
            </CardHeader>
            {profile.courses.length === 0 ? (
              <EmptyState>아직 배정된 수업이 없습니다.</EmptyState>
            ) : (
              <Scroller role="region" aria-live="polite">
                <Table>
                  <thead>
                    <tr>
                      <th scope="col">수업명</th>
                      <th scope="col">상태</th>
                      <th scope="col">수업 시간</th>
                      <th scope="col">반복</th>
                      <th scope="col">상세</th>
                    </tr>
                  </thead>
                  <tbody>
                    {profile.courses.map((course) => (
                      <tr key={course.id}>
                        <td>{course.title}</td>
                        <td>
                          <CourseStatusBadge status={course.status} />
                        </td>
                        <td>{formatTimeRange(course)}</td>
                        <td>{formatRecurrence(course)}</td>
                        <td>
                          <GhostButton type="button" onClick={() => onNavigateCourse(course.id)}>
                            상세보기
                          </GhostButton>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Scroller>
            )}
          </SectionCard>
        </>
      ) : null}
    </Page>
  );
}

function formatTimeRange(course: TeacherProfile["courses"][number]): string {
  if (course.courseTime && course.courseTime.trim().length > 0) {
    return course.courseTime.trim();
  }
  const start = normalizeTime(course.startTime);
  const end = normalizeTime(course.endTime);
  if (start && end) return `${start} ~ ${end}`;
  if (start) return `${start} 시작`;
  if (end) return `${end} 종료`;
  return "-";
}

function formatRecurrence(course: TeacherProfile["courses"][number]): string {
  if (!course.recurring) return "단회성";
  if (Array.isArray(course.recurrenceDays) && course.recurrenceDays.length > 0) {
    return course.recurrenceDays
      .map((day) => String(day).trim())
      .filter(Boolean)
      .join(", ");
  }
  if (typeof course.recurrenceDays === "string") {
    const normalized = course.recurrenceDays.trim();
    if (normalized.length > 0) {
      return normalized.replace(/,/g, ", ");
    }
  }
  return "반복 요일 미지정";
}

function normalizeTime(value?: string | null): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (trimmed.length === 0) return null;
  if (/^\d{2}:\d{2}$/.test(trimmed)) return trimmed;
  if (/^\d{2}:\d{2}:\d{2}$/.test(trimmed)) return trimmed.slice(0, 5);
  return trimmed;
}

const Centered = styled.div`
  min-height: 320px;
  display: grid;
  place-items: center;
  gap: 12px;
  color: ${(p) => p.theme.colors.textMuted};
  p {
    margin: 0;
  }
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.spacing.sm};
  flex-wrap: wrap;
`;

const AlertCard = styled(SectionCard)`
  display: grid;
  gap: ${(p) => p.theme.spacing.sm};
  border-color: ${(p) => p.theme.colors.danger};
  background: ${(p) => p.theme.colors.dangerSurface};
  color: ${(p) => p.theme.colors.danger};
  strong {
    font-size: ${(p) => p.theme.font.size.lg};
  }
  p {
    margin: 0;
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: ${(p) => p.theme.spacing.md};
  margin-bottom: ${(p) => p.theme.spacing.lg};
  flex-wrap: wrap;
`;

const CardTitle = styled.h3`
  margin: 0;
  font-size: ${(p) => p.theme.font.size.xl};
  font-weight: ${(p) => p.theme.font.weight.bold};
  color: ${(p) => p.theme.colors.text};
`;

const CardSubtitle = styled.p`
  margin: ${(p) => p.theme.spacing.xs} 0 0;
  color: ${(p) => p.theme.colors.textMuted};
  font-size: ${(p) => p.theme.font.size.sm};
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: ${(p) => p.theme.font.size.sm};
  font-weight: ${(p) => p.theme.font.weight.medium};
  background: ${(p) => p.theme.colors.surfaceMuted};
  color: ${(p) => p.theme.colors.textMuted};
  &[data-verified='true'] {
    background: ${(p) => p.theme.colors.successSurface};
    color: ${(p) => p.theme.colors.success};
  }
`;

const InfoGrid = styled.dl`
  margin: 0;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: ${(p) => p.theme.spacing.sm} ${(p) => p.theme.spacing.lg};
  dt {
    margin: 0;
    font-weight: ${(p) => p.theme.font.weight.semiBold};
    color: ${(p) => p.theme.colors.textMuted};
  }
  dd {
    margin: 0;
    color: ${(p) => p.theme.colors.text};
    word-break: break-word;
  }
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: ${(p) => p.theme.spacing.xs};
    dd {
      margin-bottom: ${(p) => p.theme.spacing.sm};
    }
  }
`;

const Table = styled(TableBase)`
  thead th,
  tbody td {
    text-align: center;
  }
  thead th {
    background: ${(p) => p.theme.colors.surfaceAlt};
  }
  tbody td:last-child {
    width: 120px;
  }
`;
