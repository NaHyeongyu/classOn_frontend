import { fetchJSON, invalidateCacheByPrefix } from "../lib/fetcher";

export type Exam = {
  id: number;
  courseId: number;
  title: string;
  examDate?: string; // YYYY-MM-DD (optional for template-like exams)
  kind: 'REGULAR'|'TEST';
  inputMode: 'percent'|'letter';
  templateId?: string | null;
  createdAt: string;
  averageScore?: number | null;
};

export type ExamPayload = {
  title: string;
  examDate?: string; // YYYY-MM-DD
  kind?: 'REGULAR'|'TEST';
  inputMode: 'percent'|'letter';
  templateId?: string | null;
};

export type ExamResult = {
  studentId: number;
  studentName?: string;
  score?: number;
  outOf?: number;
  level?: string;
  note?: string;
};

export async function listExams(courseId: number): Promise<Exam[]> {
  return await fetchJSON<Exam[]>(`/api/courses/${courseId}/exams`);
}

export async function createExam(courseId: number, payload: ExamPayload): Promise<Exam> {
  const res = await fetchJSON<Exam>(`/api/courses/${courseId}/exams`, { method: 'POST', body: JSON.stringify(payload) });
  try { invalidateCacheByPrefix(`/api/courses/${courseId}/exams`); } catch { /* ignore cache invalidation failures */ }
  return res;
}

export async function updateExam(courseId: number, examId: number, payload: Partial<ExamPayload>): Promise<Exam> {
  const res = await fetchJSON<Exam>(`/api/courses/${courseId}/exams/${examId}`, { method: 'PUT', body: JSON.stringify(payload) });
  try { invalidateCacheByPrefix(`/api/courses/${courseId}/exams`); } catch { /* ignore cache invalidation failures */ }
  return res;
}

export async function deleteExam(courseId: number, examId: number): Promise<void> {
  await fetchJSON<void>(`/api/courses/${courseId}/exams/${examId}`, { method: 'DELETE' });
  try { invalidateCacheByPrefix(`/api/courses/${courseId}/exams`); } catch { /* ignore cache invalidation failures */ }
}

export async function listExamResults(courseId: number, examId: number): Promise<ExamResult[]> {
  return await fetchJSON<ExamResult[]>(`/api/courses/${courseId}/exams/${examId}/results`);
}

export async function upsertExamResults(courseId: number, examId: number, items: ExamResult[]): Promise<ExamResult[]> {
  const res = await fetchJSON<ExamResult[]>(`/api/courses/${courseId}/exams/${examId}/results`, { method: 'POST', body: JSON.stringify(items) });
  try { invalidateCacheByPrefix(`/api/courses/${courseId}/exams`); } catch { /* ignore cache invalidation failures */ }
  return res;
}
