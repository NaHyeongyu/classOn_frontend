export type GradeEntry = {
  id: string;           // uuid-like (timestamp-rand)
  date: string;         // YYYY-MM-DD
  subject?: string;     // 과목/시험명
  courseId?: number;    // 관련 수업 ID (선택)
  score?: number;       // 점수
  outOf?: number;       // 만점
  level?: string;       // 등급/수준 (A/B/C or 상/중/하 등)
  note?: string;        // 메모
};

function key(studentId: number) { return `grades:${studentId}`; }

export function getStudentGrades(studentId: number): GradeEntry[] {
  try {
    const raw = localStorage.getItem(key(studentId));
    if (!raw) return [];
    const list = JSON.parse(raw) as GradeEntry[];
    return Array.isArray(list) ? list : [];
  } catch { return []; }
}

export function saveStudentGrades(studentId: number, list: GradeEntry[]): void {
  try { localStorage.setItem(key(studentId), JSON.stringify(list)); } catch { /* ignore */ }
}

export function addStudentGrade(studentId: number, entry: Omit<GradeEntry, 'id'>): GradeEntry {
  const id = `${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
  const next: GradeEntry = { id, ...entry };
  const list = getStudentGrades(studentId);
  list.unshift(next);
  saveStudentGrades(studentId, list);
  return next;
}

export function removeStudentGrade(studentId: number, id: string): void {
  const list = getStudentGrades(studentId).filter(g => g.id !== id);
  saveStudentGrades(studentId, list);
}

