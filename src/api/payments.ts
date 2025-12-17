// EN: Payment management API client (pre Kakao/Toss integration stage)
// KO: 결제 관리 페이지용 API 클라이언트 (카카오/토스 연동 전 단계)

import { fetchJSON, invalidateCacheByPrefix } from "@/lib/fetcher";
import type { PageResult } from "@/types/paging";
import type {
  DiscountType,
  PaymentSummary,
  PaymentHistoryRow,
  PaymentDetail,
  PaymentMethod,
  PaymentType,
  BillingCycleUnit,
  PaymentStatus,
  PaymentCancelPayload,
} from "@classon/shared-types";

export type PaymentTemplateKey =
  | "PAYMENT_GUIDE"
  | "PAYMENT_RETRY"
  | "PAYMENT_SUCCESS"
  | "PAYMENT_CANCEL"
  | "REPORT_READY";

export type PaymentAdditionalItemPayload = {
  type: "MATERIAL" | "TEXTBOOK" | "OTHER";
  label: string;
  quantity?: number;
  unitPrice?: number;
  appliedStart?: string;
  appliedEnd?: string;
};

export type PaymentInvoicePayload = {
  studentId: number;
  courseId?: number;
  dueDate: string; // YYYY-MM-DD
  periodStart?: string;
  periodEnd?: string;
  amount?: number;
  discountType?: DiscountType;
  discountValue?: number;
  memo?: string;
  managerMemo?: string;
  autoGenerate?: boolean;
  cycleValue?: number;
  cycleUnit?: BillingCycleUnit;
  discountEnabled?: boolean;
  discountStartDate?: string;
  discountEndDate?: string;
  additionalItems?: PaymentAdditionalItemPayload[];
  recipientPhone?: string;
};

export type PaymentInvoiceUpdatePayload = {
  dueDate?: string;
  periodStart?: string;
  periodEnd?: string;
  amount?: number;
  discountType?: DiscountType;
  discountValue?: number;
  discountEnabled?: boolean;
  discountStartDate?: string;
  discountEndDate?: string;
  memo?: string;
  managerMemo?: string;
  courseId?: number;
  cycleValue?: number;
  cycleUnit?: BillingCycleUnit;
  additionalItems?: PaymentAdditionalItemPayload[];
  recipientPhone?: string;
};

export type PaymentTemplateSetup = {
  templateId: number;
  studentId: number;
  courseId?: number | null;
  courseCodeSnapshot?: string | null;
  courseTitleSnapshot?: string | null;
  cycleUnit: BillingCycleUnit;
  cycleValue: number;
  graceDays: number;
  nextDueDate: string;
  autoGenerate: boolean;
  originalAmount: number;
  discountType?: DiscountType | null;
  discountValue?: number | null;
  discountStartDate?: string | null;
  discountEndDate?: string | null;
  finalAmount: number;
  memo?: string | null;
  managerMemo?: string | null;
  additionalItems?: {
    id?: number;
    type: "MATERIAL" | "TEXTBOOK" | "OTHER";
    label: string;
    quantity?: number | null;
    unitPrice?: number | null;
    totalPrice?: number | null;
    appliedStart?: string | null;
    appliedEnd?: string | null;
  }[];
};

export type PaymentOnsitePayload = {
  amount: number;
  method: PaymentMethod;
  paymentType?: PaymentType;
  paidAt?: string; // ISO datetime
  approvalNumber?: string;
  memo?: string;
};

export async function getPaymentSummary(params?: { month?: string }): Promise<PaymentSummary> {
  const sp = new URLSearchParams();
  if (params?.month) sp.set("month", params.month);
  const q = sp.toString() ? `?${sp.toString()}` : "";
  return await fetchJSON<PaymentSummary>(`/api/payments/summary${q}`);
}

export async function listPaymentInvoices(params?: {
  status?: string;
  q?: string;
  page?: number;
  size?: number;
  from?: string;
  to?: string;
  studentStatus?: string;
  studentId?: number;
}): Promise<PageResult<PaymentHistoryRow>> {
  const sp = new URLSearchParams();
  const statusParam = params?.status?.trim() || "UNPAID,PENDING";
  sp.set("status", statusParam);
  if (params?.q && params.q.trim()) sp.set("q", params.q.trim());
  if (typeof params?.page === "number") sp.set("page", String(params.page));
  if (typeof params?.size === "number") sp.set("size", String(params.size));
  if (params?.from) sp.set("from", params.from);
  if (params?.to) sp.set("to", params.to);
  if (params?.studentStatus && params.studentStatus !== "ALL") sp.set("studentStatus", params.studentStatus);
  if (typeof params?.studentId === "number") sp.set("studentId", String(params.studentId));
  const q = sp.toString() ? `?${sp.toString()}` : "";
  return await fetchJSON<PageResult<PaymentHistoryRow>>(`/api/payments/invoices${q}`);
}

export async function listPaymentHistory(params?: {
  from?: string;
  to?: string;
  status?: string;
  q?: string;
  page?: number;
  size?: number;
  studentId?: number;
}): Promise<PageResult<PaymentHistoryRow>> {
  const sp = new URLSearchParams();
  if (params?.from) sp.set("from", params.from);
  if (params?.to) sp.set("to", params.to);
  if (params?.status && params.status.trim()) sp.set("status", params.status.trim());
  if (params?.q && params.q.trim()) sp.set("q", params.q.trim());
  if (typeof params?.page === "number") sp.set("page", String(params.page));
  if (typeof params?.size === "number") sp.set("size", String(params.size));
  if (typeof params?.studentId === "number") sp.set("studentId", String(params.studentId));
  const q = sp.toString() ? `?${sp.toString()}` : "";
  return await fetchJSON<PageResult<PaymentHistoryRow>>(`/api/payments/history${q}`);
}

export async function listPendingHistory(params?: {
  from?: string;
  to?: string;
  q?: string;
  page?: number;
  size?: number;
  status?: string;
  studentId?: number;
}): Promise<PageResult<PaymentHistoryRow>> {
  const sp = new URLSearchParams();
  if (params?.from) sp.set("from", params.from);
  if (params?.to) sp.set("to", params.to);
  if (params?.q && params.q.trim()) sp.set("q", params.q.trim());
  if (typeof params?.page === "number") sp.set("page", String(params.page));
  if (typeof params?.size === "number") sp.set("size", String(params.size));
  if (params?.status && params.status.trim()) sp.set("status", params.status.trim());
  if (typeof params?.studentId === "number") sp.set("studentId", String(params.studentId));
  const q = sp.toString() ? `?${sp.toString()}` : "";
  return await fetchJSON<PageResult<PaymentHistoryRow>>(`/api/payments/history/pending${q}`);
}

export async function getPaymentDetail(id: number): Promise<PaymentDetail> {
  return await fetchJSON<PaymentDetail>(`/api/payments/${id}`);
}

export async function createPaymentInvoice(payload: PaymentInvoicePayload): Promise<PaymentDetail> {
  const res = await fetchJSON<PaymentDetail>(`/api/payments`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  invalidateCacheByPrefix([
    "/api/payments/summary",
    "/api/payments/invoices",
    "/api/payments/history",
    "/api/payments/history/pending",
  ]);
  return res;
}

export async function createPaymentTemplateInvoice(payload: PaymentInvoicePayload): Promise<PaymentTemplateSetup> {
  const res = await fetchJSON<PaymentTemplateSetup>(`/api/payments/templates`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  invalidateCacheByPrefix([
    "/api/payments/templates",
    "/api/payments/summary",
    "/api/payments/invoices",
    "/api/payments/history",
    "/api/payments/history/pending",
  ]);
  return res;
}

export async function updatePaymentTemplate(templateId: number, payload: PaymentInvoicePayload): Promise<PaymentTemplateSetup> {
  const res = await fetchJSON<PaymentTemplateSetup>(`/api/payments/templates/${templateId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  invalidateCacheByPrefix([
    "/api/payments/templates",
    "/api/payments/summary",
    "/api/payments/invoices",
    "/api/payments/history",
    "/api/payments/history/pending",
  ]);
  return res;
}

export async function deletePaymentTemplate(templateId: number): Promise<void> {
  await fetchJSON<void>(`/api/payments/templates/${templateId}`, { method: "DELETE" });
  invalidateCacheByPrefix([
    "/api/payments/templates",
    "/api/payments/summary",
    "/api/payments/invoices",
    "/api/payments/history",
    "/api/payments/history/pending",
  ]);
}

export async function listPaymentTemplates(params?: { studentId?: number }): Promise<PaymentTemplateSetup[]> {
  const sp = new URLSearchParams();
  if (typeof params?.studentId === "number") sp.set("studentId", String(params.studentId));
  const q = sp.toString() ? `?${sp.toString()}` : "";
  return await fetchJSON<PaymentTemplateSetup[]>(`/api/payments/templates${q}`);
}

export async function updatePaymentTemplateAutoGenerate(templateId: number, autoGenerate: boolean): Promise<PaymentTemplateSetup> {
  const res = await fetchJSON<PaymentTemplateSetup>(`/api/payments/templates/${templateId}/auto-generate`, {
    method: "PATCH",
    body: JSON.stringify({ autoGenerate }),
  });
  invalidateCacheByPrefix([
    "/api/payments/templates",
    "/api/payments/summary",
    "/api/payments/invoices",
    "/api/payments/history",
    "/api/payments/history/pending",
  ]);
  return res;
}

export async function updatePaymentInvoice(id: number, payload: PaymentInvoiceUpdatePayload): Promise<PaymentDetail> {
  const res = await fetchJSON<PaymentDetail>(`/api/payments/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  invalidateCacheByPrefix([
    "/api/payments/summary",
    "/api/payments/invoices",
    "/api/payments/history",
    "/api/payments/history/pending",
    `/api/payments/${id}`,
  ]);
  return res;
}

export async function deletePaymentInvoice(id: number): Promise<void> {
  await fetchJSON<void>(`/api/payments/${id}`, { method: "DELETE" });
  invalidateCacheByPrefix([
    "/api/payments/summary",
    "/api/payments/invoices",
    "/api/payments/history",
    "/api/payments/history/pending",
    `/api/payments/${id}`,
  ]);
}

export async function sendPaymentInvoices(payload: {
  ids: number[];
  templateKey: PaymentTemplateKey;
  resend?: boolean;
  scheduledAt?: string;
}): Promise<PaymentHistoryRow[]> {
  const res = await fetchJSON<PaymentHistoryRow[]>(`/api/payments/send`, {
    method: "POST",
    body: JSON.stringify({
      ids: payload.ids,
      resend: Boolean(payload.resend),
      templateKey: payload.templateKey,
      scheduledAt: payload.scheduledAt,
    }),
  });
  invalidateCacheByPrefix([
    "/api/payments/summary",
    "/api/payments/invoices",
    "/api/payments/history",
    "/api/payments/history/pending",
  ]);
  return res;
}

export async function markOnsitePayment(id: number, payload: PaymentOnsitePayload): Promise<PaymentDetail> {
  const res = await fetchJSON<PaymentDetail>(`/api/payments/${id}/onsite`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  invalidateCacheByPrefix([
    "/api/payments/summary",
    "/api/payments/invoices",
    "/api/payments/history",
    "/api/payments/history/pending",
    `/api/payments/${id}`,
  ]);
  return res;
}

export async function cancelPayment(id: number, payload?: PaymentCancelPayload): Promise<PaymentDetail> {
  const res = await fetchJSON<PaymentDetail>(`/api/payments/${id}/cancel`, {
    method: "POST",
    body: payload ? JSON.stringify(payload) : undefined,
  });
  invalidateCacheByPrefix([
    "/api/payments/summary",
    "/api/payments/invoices",
    "/api/payments/history",
    `/api/payments/${id}`,
  ]);
  return res;
}

export async function cancelScheduledAlert(paymentId: number, alertId: number): Promise<PaymentDetail> {
  const res = await fetchJSON<PaymentDetail>(
    `/api/payments/${paymentId}/alerts/${alertId}/schedule/cancel`,
    {
      method: "POST",
    },
  );
  invalidateCacheByPrefix([
    "/api/payments/summary",
    "/api/payments/invoices",
    "/api/payments/history",
    "/api/payments/history/pending",
    `/api/payments/${paymentId}`,
  ]);
  return res;
}

export async function sendScheduledAlertNow(paymentId: number, alertId: number): Promise<PaymentDetail> {
  const res = await fetchJSON<PaymentDetail>(
    `/api/payments/${paymentId}/alerts/${alertId}/schedule/send-now`,
    {
      method: "POST",
    },
  );
  invalidateCacheByPrefix([
    "/api/payments/summary",
    "/api/payments/invoices",
    "/api/payments/history",
    "/api/payments/history/pending",
    `/api/payments/${paymentId}`,
  ]);
  return res;
}

export type PaymentReminderSetting = {
  reminderDays: number;
};

export async function getPaymentReminderSetting(): Promise<PaymentReminderSetting> {
  return await fetchJSON<PaymentReminderSetting>(`/api/payments/reminder-setting`);
}

export async function updatePaymentReminderSetting(payload: PaymentReminderSetting): Promise<PaymentReminderSetting> {
  const res = await fetchJSON<PaymentReminderSetting>(`/api/payments/reminder-setting`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  return res;
}

export type PublicPaymentInvoice = {
  invoiceId: number;
  token: string;
  academyName?: string;
  courseTitle?: string;
  studentName?: string;
  originalAmount?: number;
  finalAmount?: number;
  currency?: string;
  dueDate?: string;
  periodStart?: string;
  periodEnd?: string;
  status?: PaymentStatus;
  memo?: string;
  receiptToken?: string | null;
};

export async function getPublicPaymentInvoice(token: string): Promise<PublicPaymentInvoice> {
  return await fetchJSON<PublicPaymentInvoice>(`/api/public/pay/${encodeURIComponent(token)}`);
}

export type PublicPaymentReceipt = {
  academyName?: string | null;
  receiptToken?: string | null;
  info: PaymentDetail["info"];
  student: PaymentDetail["student"];
  course?: PaymentDetail["course"] | null;
  courses?: PaymentDetail["courses"];
  schedule?: PaymentDetail["schedule"];
  methodDetail?: string | null;
};

export async function getPublicPaymentReceipt(token: string): Promise<PublicPaymentReceipt> {
  return await fetchJSON<PublicPaymentReceipt>(`/api/public/pay/receipt/${encodeURIComponent(token)}`);
}

export async function refreshPublicPaymentReceipt(token: string): Promise<PublicPaymentReceipt> {
  return await fetchJSON<PublicPaymentReceipt>(
    `/api/public/pay/receipt/${encodeURIComponent(token)}/refresh`,
    { method: "POST" },
  );
}

export type PublicPaymentCheckoutInit = {
  clientKey: string;
  customerKey: string;
  orderId: string;
  orderName: string;
  amount: number;
  currency?: string;
  academyName?: string;
  courseTitle?: string;
  studentName?: string;
  successUrl?: string;
  failUrl?: string;
  sellerRefId?: string | null;
  tossSellerId?: string | null;
  widgetClientKey?: string | null;
};

export async function preparePublicPaymentCheckout(token: string): Promise<PublicPaymentCheckoutInit> {
  return await fetchJSON<PublicPaymentCheckoutInit>(`/api/public/pay/${encodeURIComponent(token)}/checkout`, {
    method: "POST",
  });
}

export type PublicPaymentCheckoutConfirmPayload = {
  paymentKey: string;
  orderId: string;
  amount: number;
};

export type PublicPaymentCheckoutResult = {
  invoiceId?: number;
  academyName?: string;
  courseTitle?: string;
  studentName?: string;
  amount?: number;
  currency?: string;
  status?: PaymentStatus;
  paymentMethod?: string | null;
  approvalNumber?: string | null;
  receiptUrl?: string | null;
  receiptToken?: string | null;
  approvedAt?: string | null;
};

export async function confirmPublicPaymentCheckout(
  token: string,
  payload: PublicPaymentCheckoutConfirmPayload,
): Promise<PublicPaymentCheckoutResult> {
  return await fetchJSON<PublicPaymentCheckoutResult>(`/api/public/pay/${encodeURIComponent(token)}/confirm`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
