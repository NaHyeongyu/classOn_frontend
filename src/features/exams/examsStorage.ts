import type { Exam, ExamResult, ExamInputMode, ExamKind } from './types';

function keyExams(courseId: number) { return `exams:${courseId}`; }
function keyResults(courseId: number, examId: string) { return `examResults:${courseId}:${examId}`; }

export function listExamsByCourse(courseId: number): Exam[] {
  try {
    const raw = localStorage.getItem(keyExams(courseId));
    const list = raw ? (JSON.parse(raw) as Exam[]) : [];
    if (!Array.isArray(list)) return [];
    return list.slice().sort((a, b) => a.date.localeCompare(b.date));
  } catch { return []; }
}

export function getExam(courseId: number, examId: string): Exam | null {
  const list = listExamsByCourse(courseId);
  return list.find(e => e.id === examId) || null;
}

export function createExam(courseId: number, payload: { title: string; date: string; kind: ExamKind; inputMode: ExamInputMode; templateId?: string | null }): Exam {
  const now = new Date().toISOString();
  const exam: Exam = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2,8)}`,
    courseId,
    title: payload.title || '시험',
    date: payload.date,
    kind: payload.kind,
    inputMode: payload.inputMode,
    templateId: payload.templateId ?? null,
    createdAt: now,
    updatedAt: now,
  };
  const list = listExamsByCourse(courseId);
  list.push(exam);
  try { localStorage.setItem(keyExams(courseId), JSON.stringify(list)); } catch { /* ignore storage errors */ }
  return exam;
}

export function updateExam(courseId: number, examId: string, patch: Partial<Pick<Exam, 'title'|'date'|'kind'|'inputMode'|'templateId'>>): Exam | null {
  const list = listExamsByCourse(courseId);
  const idx = list.findIndex(e => e.id === examId);
  if (idx < 0) return null;
  const next = { ...list[idx], ...patch, updatedAt: new Date().toISOString() } as Exam;
  list[idx] = next;
  try { localStorage.setItem(keyExams(courseId), JSON.stringify(list)); } catch { /* ignore storage errors */ }
  return next;
}

export function deleteExam(courseId: number, examId: string): void {
  const list = listExamsByCourse(courseId);
  const next = list.filter(e => e.id !== examId);
  try { localStorage.setItem(keyExams(courseId), JSON.stringify(next)); } catch { /* ignore storage errors */ }
  try { localStorage.removeItem(keyResults(courseId, examId)); } catch { /* ignore storage errors */ }
}

export function listExamResults(courseId: number, examId: string): ExamResult[] {
  try {
    const raw = localStorage.getItem(keyResults(courseId, examId));
    const list = raw ? (JSON.parse(raw) as ExamResult[]) : [];
    return Array.isArray(list) ? list : [];
  } catch { return []; }
}

export function upsertExamResult(courseId: number, examId: string, result: Omit<ExamResult, 'examId'|'courseId'|'createdAt'|'updatedAt'>): ExamResult {
  const now = new Date().toISOString();
  const cur = listExamResults(courseId, examId);
  const idx = cur.findIndex(r => r.studentId === result.studentId);
  let next: ExamResult;
  if (idx >= 0) {
    next = { ...cur[idx], ...result, updatedAt: now } as ExamResult;
    cur[idx] = next;
  } else {
    next = { ...result, examId, courseId, createdAt: now, updatedAt: now } as ExamResult;
    cur.push(next);
  }
  try { localStorage.setItem(keyResults(courseId, examId), JSON.stringify(cur)); } catch { /* ignore storage errors */ }
  return next;
}

export function bulkUpsertExamResults(courseId: number, examId: string, items: Array<Omit<ExamResult, 'examId'|'courseId'|'createdAt'|'updatedAt'>>): void {
  const now = new Date().toISOString();
  const map = new Map<number, ExamResult>();
  for (const r of listExamResults(courseId, examId)) map.set(r.studentId, r);
  for (const it of items) {
    const prev = map.get(it.studentId);
    if (prev) {
      map.set(it.studentId, { ...prev, ...it, updatedAt: now });
    } else {
      map.set(it.studentId, { ...it, examId, courseId, createdAt: now, updatedAt: now } as ExamResult);
    }
  }
  const list = Array.from(map.values());
  try { localStorage.setItem(keyResults(courseId, examId), JSON.stringify(list)); } catch { /* ignore storage errors */ }
}
