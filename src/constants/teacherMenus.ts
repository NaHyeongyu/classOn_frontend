export const TEACHER_MENU_OPTIONS = [
  { key: "DASHBOARD", label: "대시보드", description: "요약 지표를 확인할 수 있는 홈 화면" },
  { key: "CALENDAR", label: "일정", description: "수업 일정과 캘린더" },
  { key: "STUDENTS", label: "원생관리", description: "원생 목록 및 상세 정보" },
  { key: "COURSES", label: "수업관리", description: "담당 수업 등록 및 편집" },
  { key: "ATTENDANCE", label: "출결관리", description: "출석 현황 확인" },
  { key: "PAYMENTS", label: "결제관리", description: "수강료 결제 내역" },
] as const;

export type TeacherMenuOption = (typeof TEACHER_MENU_OPTIONS)[number];
