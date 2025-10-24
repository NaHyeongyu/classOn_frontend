import type { Counsel } from "@/api/counsels";

export type StudentMemo = {
  id: number;
  text: string;
  createdAt: string;
  updatedAt?: string;
};

export type StudentGradeEntry = {
  id: string;
  date?: string;
  subject?: string | null;
  courseId?: number;
  score?: number | null;
  outOf?: number | null;
  level?: string | null;
  note?: string | null;
};

export type StudentCounselList = Counsel[];
