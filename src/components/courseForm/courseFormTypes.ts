import type { Course } from "@/api/courses";
import type { Student } from "@/api/students";

export type CourseTypeValue = "INDIVIDUAL" | "GROUP";

export type FormState = {
  title: string;
  description?: string;
  status: Course["status"];
  courseType: CourseTypeValue;
  capacity?: number;
  fee?: number;
  courseTime?: string;
  recurrenceDays?: string;
  startTime?: string;
  endTime?: string;
  primaryStudentId?: number | null;
  primaryStudentName?: string;
  instructorId?: number | null;
  instructorName?: string;
   // Optional multi-instructor support (backend: instructorIds)
  instructorIds?: number[] | null;
};

export type StudentOption = Pick<Student, "id" | "name" | "code" | "status">;

export type TeacherOption = {
  id: number;
  name?: string | null;
  username?: string | null;
  phone?: string | null;
  courseCount?: number | null;
};

export const DEFAULT_FORM: FormState = {
  title: "",
  description: "",
  status: "IN_PROGRESS",
  courseType: "GROUP",
  primaryStudentId: null,
  primaryStudentName: "",
  instructorId: null,
  instructorName: "",
  instructorIds: null,
};

export type CourseFormStepMeta = {
  key: string;
  title: string;
  lead: string;
};
