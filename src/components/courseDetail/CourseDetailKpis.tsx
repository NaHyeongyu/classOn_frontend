import {
  CheckIcon,
  ClassIcon,
  KPI,
  UsersIcon,
} from "@/components/dashboard/KPI";
import {
  KPIGrid,
} from "./CourseDetail.styles";

type CourseDetailKpisProps = {
  totalStudents?: number | null;
  capacity?: number | null;
  avgAttendance: number | null;
  completedCount: number;
  progressPct: number | null;
};

export function CourseDetailKpis({
  totalStudents,
  capacity,
  avgAttendance,
  completedCount,
  progressPct,
}: CourseDetailKpisProps) {
  return (
    <KPIGrid>
      <KPI
        title="총 수강생"
        icon={<UsersIcon />}
        iconAccent="indigo"
        value={<>{typeof totalStudents === "number" ? `${totalStudents}명` : "—"}</>}
        footerLeft={<span>정원 {capacity ?? "—"}명</span>}
      />
      <KPI
        title="평균 출석률"
        icon={<CheckIcon />}
        iconAccent="green"
        value={<>{avgAttendance != null ? `${avgAttendance}%` : "—"}</>}
        footerLeft={<span>처리된 회차 기준</span>}
      />
      <KPI
        title="완료된 수업"
        icon={<ClassIcon />}
        iconAccent="violet"
        value={<>{completedCount || 0}회</>}
        footerRight={
          progressPct != null ? <span>진행률 {progressPct}%</span> : <span>—</span>
        }
      />
    </KPIGrid>
  );
}
