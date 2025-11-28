import styled from "styled-components";
import { DashboardGrid } from "@/components/dashboard/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import { Page as PageWrap, PageHeader, PrimaryBtn as LinkPrimary } from "@/components/common/UI";
import KpiTotalStudents from "@/components/dashboard/KpiTotalStudents";
import KpiAttendance from "@/components/dashboard/KpiAttendance";
import KpiClasses from "@/components/dashboard/KpiClasses";
import DashboardAttendance from "@/components/dashboard/DashboardAttendance";
import DashboardClasses from "@/components/dashboard/DashboardClasses";
import DashboardPayments from "@/components/dashboard/DashboardPayments";
import type { DashboardPageData } from "@/features/dashboard/useDashboardPage";

const DEFAULT_TITLE = "대시보드";

export type DashboardPageViewProps = DashboardPageData;

export function DashboardPageView({
  title = DEFAULT_TITLE,
  createStudentHref,
  createCourseHref,
  kpiProps,
}: DashboardPageViewProps) {
  const { user } = useAuth();
  const isTeacher = (user?.role ?? "").toString().toUpperCase() === "TEACHER";

  return (
    <PageWrap>
      <DashboardGrid>
        <PageHead>
          <div>
            <h2>{title}</h2>
            <SubTitle>학원 현황을 한눈에 확인해보세요!</SubTitle>
          </div>
          <Actions>
            {!isTeacher && (
              <LinkPrimary to={createStudentHref}>원생 추가</LinkPrimary>
            )}
            {!isTeacher && (
              <LinkPrimary to={createCourseHref}>수업 추가</LinkPrimary>
            )}
          </Actions>
        </PageHead>

        <KpiRow>
          <KpiTotalStudents {...kpiProps} />
          <KpiAttendance {...kpiProps} />
          <KpiClasses {...kpiProps} />
        </KpiRow>

        <ContentRow>
          <div>
            <DashboardPayments kpi={kpiProps} />
          </div>
          <ScrollableWrapper>
            <DashboardAttendance />
          </ScrollableWrapper>
          <ScrollableWrapper>
            <DashboardClasses />
          </ScrollableWrapper>
        </ContentRow>
      </DashboardGrid>
    </PageWrap>
  );
}

const Actions = styled.div`
  display: inline-flex;
  gap: ${(p) => p.theme.spacing.sm};
  align-items: center;
  flex-wrap: wrap;
`;

const PageHead = styled(PageHeader)`
  grid-column: 1 / -1;
  margin-bottom: 0;
`;

const SubTitle = styled.p`
  margin: 4px 0 0;
  color: ${(p) => p.theme.colors.textMuted};
  font-size: ${(p) => p.theme.font.size.sm};
`;

const KpiRow = styled.div`
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${(p) => p.theme.spacing.pageGap};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ContentRow = styled.div`
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: 2fr 3fr 3fr;
  gap: ${(p) => p.theme.spacing.pageGap};

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const ScrollableWrapper = styled.div`
  height: 600px;
  
  @media (max-width: 1024px) {
    height: auto;
  }
`;




