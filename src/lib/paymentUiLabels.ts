import type { PaymentMethod, PaymentStatus, PaymentType } from "@classon/shared-types";

export const PAYMENT_METHOD_LABEL: Partial<Record<PaymentMethod, string>> = {
  CARD: "카드",
  BANK_TRANSFER: "계좌이체",
  CASH: "현금",
};

export const PAYMENT_TYPE_LABEL: Partial<Record<PaymentType, string>> = {
  ONLINE: "온라인",
  OFFLINE: "오프라인",
};

export const PAYMENT_STATUS_LABEL: Partial<Record<PaymentStatus, string>> = {
  UNPAID: "대기",
  SCHEDULED: "예약",
  PENDING: "미납",
  COMPLETED: "완료",
  FAILED: "실패",
  CANCELED: "취소",
};

export const PAYMENT_STATUS_COLOR: Partial<Record<PaymentStatus, string>> = {
  UNPAID: "#2563eb",
  SCHEDULED: "#f59e0b",
  PENDING: "#f97316",
  COMPLETED: "#059669",
  FAILED: "#dc2626",
  CANCELED: "#dc2626",
};

export function formatPhoneKR(raw?: string | null): string {
  if (!raw) return "";
  const digits = String(raw).replace(/[^0-9]/g, "");
  if (!digits) return "";
  if (digits.length === 11 && digits.startsWith("010")) {
    return `010-${digits.slice(3, 7)}-${digits.slice(7)}`;
  }
  if (digits.length === 10 && digits.startsWith("010")) {
    return `010-${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  return digits;
}
