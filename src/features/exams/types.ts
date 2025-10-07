export type ExamKind = 'REGULAR' | 'TEST';
export type ExamInputMode = 'percent' | 'letter';

export type Exam = {
  id: string; // uuid-like
  courseId: number;
  title: string;
  date: string; // YYYY-MM-DD
  kind: ExamKind;
  inputMode: ExamInputMode;
  templateId?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ExamResult = {
  examId: string;
  courseId: number;
  studentId: number;
  score?: number;   // 0..100 when inputMode is 'percent'
  outOf?: number;   // default 100
  level?: string;   // when inputMode is 'letter'
  note?: string;
  createdAt: string;
  updatedAt: string;
};

