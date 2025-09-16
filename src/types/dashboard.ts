export interface DashboardSummary {
  totalStudents: number;
  deltaStudents: number; // MoM absolute change
  thisMonthRevenue: number; // in KRW
  revenueMoMPercent: number; // +64 -> 64
  attendanceRate: number; // 0..100
  attendanceNumerator: number;
  attendanceDenominator: number;
  classCountToday: number;
  dateLabel: string; // e.g. 09/02
}

