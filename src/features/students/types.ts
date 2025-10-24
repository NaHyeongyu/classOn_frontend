export type StudentsFiltersState = {
  status: "" | "ENROLLED" | "ON_LEAVE" | "PENDING";
  from: string;
  to: string;
  ageMin: string;
  ageMax: string;
  q: string;
};

export type StudentImportPreviewRow = {
  row?: number;
  name?: string;
  status?: string;
  joinedDate?: string;
  birthDate?: string;
  phoneNumber?: string;
  guardianPhone?: string;
  address?: string;
  isNew?: boolean;
};

export type StudentImportPreview = {
  created: number;
  updated: number;
  skipped: number;
  errors: string[];
  rows: StudentImportPreviewRow[];
};
