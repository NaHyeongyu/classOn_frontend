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
};

export type StudentOption = Pick<Student, "id" | "name" | "code" | "status">;

export const DEFAULT_FORM: FormState = {
  title: "",
  description: "",
  status: "IN_PROGRESS",
  courseType: "GROUP",
  primaryStudentId: null,
  primaryStudentName: "",
};

export type CourseFormStepMeta = {
  key: string;
  title: string;
  lead: string;
};
