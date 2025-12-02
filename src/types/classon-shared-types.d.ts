// Lightweight local shim for @classon/shared-types.
// This keeps frontend type-safe without depending on an external shared package.

declare module "@classon/shared-types" {
  // Students
  export type StudentStatus =
    | "ENROLLED"
    | "ON_LEAVE"
    | "PENDING"
    | "STOPPED"
    | "GRADUATED"
    | string;

  export interface StudentCourseBrief {
    id: number;
    title: string;
    code: string;
    status: string;
    fee?: number | null;
    [key: string]: unknown;
  }

  export interface Student {
    id: number;
    code: string;
    name: string;
    status: StudentStatus;
    age?: number | null;
    birthDate?: string | null;
    phoneNumber?: string | null;
    guardianPhone?: string | null;
    joinedDate?: string | null;
    createdAt?: string | null;
    address?: string | null;
    courses?: StudentCourseBrief[] | null;
    [key: string]: unknown;
  }

  export interface StudentAttendance {
    date: string; // YYYY-MM-DD
    courseId: number;
    courseTitle: string;
    present: boolean;
    reason?: string | null;
    [key: string]: unknown;
  }

  // Courses / attendance
  export type CourseStatus = "IN_PROGRESS" | "PENDING" | "STOPPED" | string;
  export type CourseType = "INDIVIDUAL" | "GROUP" | string;

  export interface CourseScheduleEntry {
    dayOfWeek?: string | null;
    startTime?: string | null;
    endTime?: string | null;
    [key: string]: unknown;
  }

  export interface Course {
    id: number;
    title: string;
    code?: string | null;
    status?: CourseStatus;
    courseType?: CourseType;
    capacity?: number | null;
    fee?: number | null;
    courseTime?: string | null;
    recurrenceDays?: string[] | string | null;
    startTime?: string | null;
    endTime?: string | null;
    recurring?: boolean;
    schedule?: CourseScheduleEntry[] | null;
    enrolledCount?: number | null;
    nextClassDate?: string | null;
    instructorId?: number | null;
    primaryStudentId?: number | null;
    instructorName?: string | null;
    primaryStudentName?: string | null;
    description?: string | null;
    createdAt?: string | Date | null;
    [key: string]: unknown;
  }

  export interface CourseRecord {
    id: number;
    courseId?: number;
    recordDate: string; // YYYY-MM-DD
    startTime?: string | null;
    endTime?: string | null;
    topic?: string | null;
    notes?: string | null;
    content?: string | null;
    performanceScore?: number | null;
    performanceNote?: string | null;
    [key: string]: unknown;
  }

  export interface Attendance {
    id?: number;
    studentId: number;
    present: boolean;
    reason?: string | null;
    studentName?: string | null;
    source?: "MOBILE" | "MANUAL" | string;
    [key: string]: unknown;
  }

  // Payments
  export type DiscountType = "PERCENT" | "AMOUNT" | string;
  export type BillingCycleUnit = "MONTHS" | "WEEKS" | "DAYS" | string;
  export type PaymentMethod = "CARD" | "BANK_TRANSFER" | "CASH" | string;
  export type PaymentType = "ONLINE" | "OFFLINE" | string;
  export type PaymentStatus = "UNPAID" | "PENDING" | "COMPLETED" | "FAILED" | "CANCELED" | string;

  export interface PaymentSummary {
    paidAmount: number;
    unpaidAmount: number;
    unpaidCount: number;
    unsentCount: number;
    [key: string]: unknown;
  }

  export interface PaymentStudentRef {
    id?: number;
    name: string;
    code: string;
    phoneNumber?: string | null;
    guardianPhone?: string | null;
    joinedDate?: string | null;
    status?: string | null;
    [key: string]: unknown;
  }

  export interface PaymentCourseBrief {
    id: number;
    title?: string | null;
    code?: string | null;
    fee?: number | null;
    [key: string]: unknown;
  }

  export interface PaymentHistoryRow {
    id: number;
    status: PaymentStatus;
    originalAmount?: number | null;
    finalAmount?: number | null;
    dueDate?: string | null;
    completedAt?: string | null;
    canceledAt?: string | null;
    paymentMethod?: PaymentMethod | null;
    paymentType?: PaymentType | null;
    invoiceRequestedAt?: string | null;
    student: PaymentStudentRef;
    course?: PaymentCourseBrief | null;
    [key: string]: unknown;
  }

  export interface PaymentScheduleInfo {
    cycleValue?: number | null;
    cycleUnit?: BillingCycleUnit | null;
    nextDueDate?: string | null;
    [key: string]: unknown;
  }

  export interface PaymentInfo {
    id: number;
    status: PaymentStatus;
    originalAmount?: number | null;
    finalAmount?: number | null;
    dueDate?: string | null;
    periodStart?: string | null;
    periodEnd?: string | null;
    memo?: string | null;
    managerMemo?: string | null;
    completedAt?: string | null;
    canceledAt?: string | null;
    discountType?: DiscountType | null;
    discountValue?: number | null;
    paymentMethod?: PaymentMethod | null;
    paymentType?: PaymentType | null;
    approvalNumber?: string | null;
    currency?: string | null;
    course?: PaymentCourseBrief | null;
    [key: string]: unknown;
  }

  export interface PaymentAlertLog {
    id: number;
    type?: string | null;
    status?: PaymentStatus | null;
    scheduledAt?: string | null;
    sentAt?: string | null;
    retryCount?: number | null;
    errorMessage?: string | null;
  }

  export interface PaymentDetail {
    info: PaymentInfo;
    student: PaymentStudentRef;
    course?: PaymentCourseBrief | null;
    courses?: PaymentCourseBrief[] | null;
    schedule?: PaymentScheduleInfo | null;
    alerts?: PaymentAlertLog[] | null;
    latestAlert?: PaymentAlertLog | null;
    [key: string]: unknown;
  }

  export interface PaymentCancelPayload {
    reason?: string | null;
  }
}
