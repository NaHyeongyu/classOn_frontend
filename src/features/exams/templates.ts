export type ExamTemplate = {
  id: string;
  name: string;
  inputMode?: "percent" | "letter";
  defaultNote?: string;
};

const builtins: ExamTemplate[] = [
  {
    id: "midterm-essay",
    name: "중간고사(서술형)",
    inputMode: "percent",
    defaultNote: "핵심 개념 서술 정확도와 논리 전개 평가",
  },
  {
    id: "final-mixed",
    name: "기말고사(복합)",
    inputMode: "percent",
    defaultNote: "선다/서술 혼합: 정답률과 서술의 완성도",
  },
  {
    id: "weekly-quiz",
    name: "주간 퀴즈",
    inputMode: "percent",
    defaultNote: "최근 학습 범위에 대한 체크 퀴즈",
  },
  {
    id: "mock-test",
    name: "모의고사",
    inputMode: "percent",
    defaultNote: "시간 관리와 전 범위 개념 점검",
  },
];

export function listExamTemplates(): ExamTemplate[] {
  return builtins.slice();
}

export function getExamTemplate(id?: string | null): ExamTemplate | undefined {
  if (!id) return undefined;
  return builtins.find(t => t.id === id);
}
