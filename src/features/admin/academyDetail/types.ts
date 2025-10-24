export type AcademySummary = {
  id: number;
  name: string;
  students: number;
  courses: number;
  classesToday: number;
  apiCalls: number;
  logins: number;
  paymentCount: number;
  paymentAmountCents: number;
  apiLastAt?: string | null;
  loginLastAt?: string | null;
  paymentLastAt?: string | null;
  createdAt?: string | null;
};

export type AcademyPaymentRow = {
  id?: number;
  createdAt: string;
  amountCents: number;
  currency?: string | null;
  status: string;
  description?: string | null;
  provider?: string | null;
};

export type AcademyLoginLogRow = {
  id?: number;
  createdAt: string;
  username: string;
  ip?: string | null;
  success: boolean;
};

export type AcademyApiLogRow = {
  id?: number;
  createdAt: string;
  method: string;
  path: string;
  status: number;
  ip?: string | null;
  userId?: string | null;
};

export type PagedResponse<T> = {
  content: T[];
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
};
