export interface ClassItem {
  subject: string;
  time: string; // e.g., "18:30 ~ 19:30"
  room: string;
  teacher: string;
  student: string;
  done: boolean;
  // Optional explicit status. If omitted, UI derives from `done`.
  // SCHEDULED(예정), CANCELED(결강), DONE(완료)
  status?: 'SCHEDULED' | 'CANCELED' | 'DONE';
  courseId?: number;
  date?: string; // YYYY-MM-DD
  recordId?: number;
  // For unified "수업 내역" style
  notes?: string | null; // 수업 내용 텍스트
  attPresent?: number;   // 출석 인원 수
  attAbsent?: number;    // 결석 인원 수
}

export interface CounselItem {
  id?: number;
  studentId?: number;
  time: string;
  title: string;
  with: string;  // student name
  owner: string;
  done: boolean;
}

export interface TaskItem {
  id?: number;
  title: string;
  content?: string;
  done: boolean;
}
