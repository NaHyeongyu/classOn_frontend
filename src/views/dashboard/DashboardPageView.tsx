import styled from "styled-components";
import { DashboardGrid } from "@/components/dashboard/DashboardLayout";
import { Page as PageWrap, PageHeader, PrimaryBtn as LinkPrimary } from "@/components/common/UI";
import KpiTotalStudents from "@/components/dashboard/KpiTotalStudents";
import KpiAttendance from "@/components/dashboard/KpiAttendance";
import KpiClasses from "@/components/dashboard/KpiClasses";
import DashboardAttendance from "@/components/dashboard/DashboardAttendance";
import DashboardClasses from "@/components/dashboard/DashboardClasses";
import type { DashboardPageData } from "@/features/dashboard/useDashboardPage";

const DEFAULT_TITLE = "대시보드";

export type DashboardPageViewProps = DashboardPageData;

export function DashboardPageView({
  title = DEFAULT_TITLE,
  createStudentHref,
  createCourseHref,
  kpiProps,
}: DashboardPageViewProps) {
  return (
    <PageWrap>
      <DashboardGrid>
        <PageHead>
          <div>
            <h2>{title}</h2>
          </div>
          <Actions>
            <LinkPrimary to={createStudentHref}>원생 추가</LinkPrimary>
            <LinkPrimary to={createCourseHref}>수업 추가</LinkPrimary>
          </Actions>
        </PageHead>

        <KpiTotalStudents {...kpiProps} />
        <KpiAttendance {...kpiProps} />
        <KpiClasses {...kpiProps} />

        <DashboardAttendance />
        <DashboardClasses />
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
`;
