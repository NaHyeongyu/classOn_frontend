// Minimal shared domain types to satisfy frontend build.
// These mirror the backend domain shape used by the app, but fields are kept permissive.

export type CourseStatus = "IN_PROGRESS" | "PENDING" | "STOPPED" | (string & {});
export type CourseType = "INDIVIDUAL" | "GROUP" | (string & {});

export type DayCode = "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN" | (string & {});

export type CourseScheduleItem = {
  dayOfWeek?: DayCode | string | null;
  startTime?: string | null;
  endTime?: string | null;
};

export type Course = {
  id: number;
  title: string;
  code?: string | null;
  description?: string | null;
  status?: CourseStatus;
  courseType?: CourseType;
  capacity?: number | null;
  fee?: number | null;
  courseTime?: string | null;
  recurrenceDays?: string | DayCode[] | null;
  startTime?: string | null;
  endTime?: string | null;
  schedule?: CourseScheduleItem[];
  enrolledCount?: number | null;
  nextClassDate?: string | null;
  primaryStudentId?: number | null;
  primaryStudentName?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  [key: string]: unknown;
};

export type CourseRecord = {
  id?: number;
  recordDate: string; // YYYY-MM-DD
  startTime?: string | null;
  endTime?: string | null;
  topic?: string | null;
  notes?: string | null;
  content?: string | null;
  performanceScore?: number | null;
  performanceNote?: string | null;
  [key: string]: unknown;
};

export type Attendance = {
  studentId: number;
  present?: boolean | null;
  reason?: string | null;
  studentName?: string | null;
  [key: string]: unknown;
};

export type StudentStatus =
  | "ENROLLED"
  | "ON_LEAVE"
  | "PENDING"
  | "WITHDRAWN"
  | (string & {});

export type StudentCourseBrief = {
  id: number;
  code: string;
  title: string;
  status: CourseStatus | string;
  fee?: number | null;
};

export type Student = {
  id: number;
  name?: string | null;
  code?: string | null;
  status?: StudentStatus;
  phoneNumber?: string | null;
  guardianPhone?: string | null;
  age?: number | null;
  birthDate?: string | null; // YYYY-MM-DD
  joinedDate?: string | null; // YYYY-MM-DD
  createdAt?: string | null;
  address?: string | null;
  parentName?: string | null;
  courses: StudentCourseBrief[];
  [key: string]: unknown;
};

export type StudentAttendance = {
  studentId: number;
  date: string; // YYYY-MM-DD
  courseId?: number;
  courseTitle?: string;
  present?: boolean | null;
  reason?: string | null;
  [key: string]: unknown;
};
