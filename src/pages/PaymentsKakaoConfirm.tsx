import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import {
  Page,
  SectionCard,
  PageHeader,
  TableBase,
  PrimaryButton,
  GhostButton,
  EmptyState,
  Skeleton,
} from "@/components/common/UI";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "@/components/common/Toast";
import { getPaymentDetail, sendPaymentInvoices } from "@/api/payments";
import type { PaymentTemplateKey } from "@/api/payments";
import type { PaymentDetail, PaymentHistoryRow } from "@classon/shared-types";
import { formatMoney, formatKoreanDate } from "@/lib/format";
import { readableError } from "@/lib/errors";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { routes } from "@/routes";
import { invalidatePaymentsQueries } from "@/lib/paymentsCache";
import { useAuth } from "@/hooks/useAuth";
import Modal from "@/components/common/Modal";
import InvoicePreview from "@/components/payments/InvoicePreview";
import SelectBox from "@/components/common/SelectBox";

type TemplateKey = PaymentTemplateKey;

const DEFAULT_TEMPLATE_KEY: TemplateKey = "PAYMENT_GUIDE";
const LEGACY_TEMPLATE_ALIASES: Record<string, TemplateKey> = {
  GUIDE: "PAYMENT_GUIDE",
  RETRY: "PAYMENT_RETRY",
  SUCCESS: "PAYMENT_SUCCESS",
  FAIL: "PAYMENT_CANCEL",
};

const PAYMENT_LINK_HOST_PREVIEW =
  import.meta.env.VITE_PAYMENT_LINK_HOST_PREVIEW ??
  (typeof window !== "undefined"
    ? `${window.location.origin}/billing/pay`
    : "https://pay.myclasson.com/billing/pay");
const RECEIPT_TOKEN_PREVIEW = "PREVIEW_RECEIPT_TOKEN";

type PreviewMessage = { id: number; student: string; text: string };

const TEMPLATE_DEFINITIONS: Record<
  TemplateKey,
  { label: string; body: string; resend: boolean }
> = {
  PAYMENT_GUIDE: {
    label: "결제 안내 (기본 청구)",
    resend: false,
    body: [
      "[#{academyName}]",
      "",
      "안녕하세요 😊",
      "",
      "#{studentName} 학생의",
      "#{courseName} 수업과 관련된 비용 안내가 있어 알려드립니다.",
      "",
      "자세한 내용은 아래에서 확인하실 수 있습니다.",
    ].join("\n"),
  },
  PAYMENT_RETRY: {
    label: "결제 재안내 (미납 재전송)",
    resend: true,
    body: [
      "[#{academyName}]",
      "",
      "안녕하세요 😊",
      "",
      "이전에 안내드린",
      "#{studentName} 학생의 #{courseName} 수업 관련 비용 내용에 대해",
      "다시 한 번 확인 요청드립니다.",
      "",
      "자세한 내용은 아래에서 확인하실 수 있습니다.",
    ].join("\n"),
  },
  PAYMENT_SUCCESS: {
    label: "결제 완료 안내",
    resend: false,
    body: [
      "[#{academyName}]",
      "#{studentName} 학생의 #{courseName} 수업 수강료 결제가 정상적으로 완료되었습니다.",
      "",
      "항상 믿고 맡겨주셔서 감사합니다.",
    ].join("\n"),
  },
  PAYMENT_CANCEL: {
    label: "결제 취소 안내",
    resend: false,
    body: [
      "[#{academyName}]",
      "#{studentName} 학생의 #{courseName} 수업 수강료 결제가 취소 처리되었습니다.",
      "",
      "관련하여 추가 안내가 필요하시면 학원으로 문의해주세요.",
      "",
      "늘 믿고 함께해주셔서 감사합니다.",
    ].join("\n"),
  },
  REPORT_READY: {
    label: "수업 보고서 안내",
    resend: false,
    body: [
      "[#{academyName}]",
      "안녕하세요 😊",
      "#{studentName} 학생의",
      "#{courseName} 수업 보고서가 있어 알려드립니다.",
      "",
      "자세한 내용은 아래에서 확인하실 수 있습니다.",
    ].join("\n"),
  },
};

const statusLabelMap: Record<string, string> = {
  UNPAID: "대기",
  PENDING: "미납",
  COMPLETED: "완료",
  FAILED: "실패",
  CANCELED: "취소",
};

const statusColor: Record<string, string> = {
  UNPAID: "#4b5563",
  PENDING: "#2563EB",
  COMPLETED: "#059669",
  FAILED: "#dc2626",
  CANCELED: "#dc2626",
};

function normalizeTemplateKey(raw: string | null): TemplateKey | null {
  if (!raw) return null;
  const key = raw.trim().toUpperCase();
  if (Object.prototype.hasOwnProperty.call(TEMPLATE_DEFINITIONS, key)) {
    return key as TemplateKey;
  }
  if (Object.prototype.hasOwnProperty.call(LEGACY_TEMPLATE_ALIASES, key)) {
    return LEGACY_TEMPLATE_ALIASES[key];
  }
  return null;
}

type SendMode = "send" | "schedule";

function KakaoSendPage({ mode }: { mode: SendMode }) {
  const isScheduleMode = mode === "schedule";
  const pageTitle = isScheduleMode ? "카카오톡 알림 예약 발송" : "카카오톡 알림 전송 확인";
  const pageDescription = isScheduleMode
    ? "예약 발송 시각과 메시지를 확인하세요."
    : "선택된 학생들에게 전송할 메시지를 확인하세요.";
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const ids = useMemo(
    () =>
      (searchParams.get("ids") || "")
        .split(",")
        .map((id) => Number(id))
        .filter((id) => Number.isFinite(id) && id > 0),
    [searchParams],
  );
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { success, error: toastError } = useToast();

  const idsKey = ids.slice().sort((a, b) => a - b).join(",");

  const detailsQuery = useQuery<PaymentDetail[]>({
    queryKey: ["payments", "kakao-confirm", idsKey],
    enabled: ids.length > 0,
    queryFn: async () => {
      const results: PaymentDetail[] = [];
      for (const id of ids) {
        const detail = await getPaymentDetail(id);
        results.push(detail);
      }
      return results;
    },
  });

  const [academyName, setAcademyName] = useState("OO학원");
  const queryTemplate = normalizeTemplateKey(searchParams.get("template"));
  const initialTemplateKey = queryTemplate ?? DEFAULT_TEMPLATE_KEY;
  const [templateKey, setTemplateKey] = useState<TemplateKey>(initialTemplateKey);
  const [message, setMessage] = useState(TEMPLATE_DEFINITIONS[initialTemplateKey].body);
  const [previewDetail, setPreviewDetail] = useState<PaymentDetail | null>(null);
  const [scheduleDate, setScheduleDate] = useState(() =>
    isScheduleMode ? buildDefaultScheduleParts().date : "",
  );
  const [scheduleHour, setScheduleHour] = useState(() =>
    isScheduleMode ? buildDefaultScheduleParts().hour : "10",
  );
  const [scheduleMinute, setScheduleMinute] = useState(() =>
    isScheduleMode ? buildDefaultScheduleParts().minute : "00",
  );
  const minScheduleValue = useMemo(
    () => (isScheduleMode ? buildMinScheduleValue() : ""),
    [isScheduleMode],
  );
  const minScheduleDate = useMemo(
    () => (minScheduleValue ? minScheduleValue.slice(0, 10) : undefined),
    [minScheduleValue],
  );
  const schedulePayload = useMemo(
    () =>
      isScheduleMode
        ? combineScheduleParts(scheduleDate, scheduleHour, scheduleMinute)
        : undefined,
    [isScheduleMode, scheduleDate, scheduleHour, scheduleMinute],
  );
  const hours24 = useMemo(
    () =>
      Array.from({ length: 24 }, (_, index) => {
        const value = String(index).padStart(2, "0");
        return { label: value, value };
      }),
    [],
  );
  const mins5 = useMemo(
    () =>
      ["00", "05", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55"].map((value) => ({
        label: value,
        value,
      })),
    [],
  );

  useEffect(() => {
    const nextName = user?.academy?.name?.trim();
    if (!nextName) return;
    setAcademyName((prev) => (prev === "OO학원" || !prev.trim() ? nextName : prev));
  }, [user?.academy?.name]);

  useEffect(() => {
    setMessage(TEMPLATE_DEFINITIONS[templateKey].body);
  }, [templateKey]);

  const details: PaymentDetail[] = useMemo(() => detailsQuery.data ?? [], [detailsQuery.data]);

  const previewMessages: PreviewMessage[] = useMemo(() => {
    if (!details.length) return [];
    const base = details.length > 1 ? [details[0]] : details;
    return base.map((detail) => ({
      id: detail.info.id,
      student: detail.student.name ?? "-",
      text: renderTemplate(message, detail, academyName),
    }));
  }, [details, message, academyName]);

  const previewCandidate = useMemo(() => (details.length ? details[0] : null), [details]);

  const isMultiSelection = details.length > 1;

  const sendMutation = useMutation<PaymentHistoryRow[], unknown, void>({
    mutationFn: () =>
      sendPaymentInvoices({
        ids,
        templateKey,
        resend: TEMPLATE_DEFINITIONS[templateKey].resend,
        scheduledAt: schedulePayload ? normalizeSchedulePayload(schedulePayload) : undefined,
      }),
    onSuccess: (result: PaymentHistoryRow[]) => {
      invalidatePaymentsQueries(queryClient);
      const failed = result.filter((row) => row.status === "FAILED");
      if (failed.length > 0) {
        toastError(
          `카카오톡 발송에 실패한 청구서 ${failed.length}건이 있습니다. 상세 내역을 확인한 뒤 다시 시도해 주세요.`,
        );
        void detailsQuery.refetch();
        return;
      }
      success(
        isScheduleMode
          ? "카카오톡 알림 예약을 등록했습니다."
          : "카카오톡 알림 전송을 요청했습니다.",
      );
      navigate(routes.payments);
    },
    onError: (err: unknown) =>
      toastError(
        readableError(
          err,
          isScheduleMode ? "카카오톡 예약 발송에 실패했습니다." : "카카오톡 발송에 실패했습니다.",
        ),
      ),
  });

  if (ids.length === 0) {
    return (
      <Page>
        <PageHeader>
          <div>
            <h2>{pageTitle}</h2>
            <p>선택된 청구서가 없습니다. 결제 관리 페이지에서 다시 시도해 주세요.</p>
          </div>
          <GhostButton type="button" onClick={() => navigate(routes.payments)}>
            결제 관리로 이동
          </GhostButton>
        </PageHeader>
        <EmptyState>전송할 청구서를 선택한 뒤 이 페이지로 이동해야 합니다.</EmptyState>
      </Page>
    );
  }

  return (
    <Page>
      <PageHeader>
        <div>
          <h2>{pageTitle}</h2>
          <p>{pageDescription}</p>
        </div>
        <GhostButton type="button" onClick={() => navigate(routes.payments)}>
          목록으로
        </GhostButton>
      </PageHeader>

      <ConfirmLayout>
        <SectionCard>
          <h3>학생 목록</h3>
          {detailsQuery.isLoading ? (
            <Skeleton h={120} />
          ) : details.length === 0 ? (
            <EmptyState>표시할 학생이 없습니다.</EmptyState>
          ) : (
            <TableWrapper>
              <StyledTable>
                <thead>
                  <tr>
                    <th>이름</th>
                    <th>수강 과목</th>
                    <th>청구 금액</th>
                    <th>상태</th>
                    <th>다음 결제 예정일</th>
                  </tr>
                </thead>
                <tbody>
                  {details.map((detail) => {
                    const courseNames =
                      detail.courses
                        ?.map(
                          (course: NonNullable<PaymentDetail["courses"]>[number]) =>
                            course?.title ?? null,
                        )
                        .filter(
                          (title: string | null): title is string =>
                            Boolean(title && title.trim()),
                        ) ?? [];
                    const courseTitle =
                      courseNames.length > 0
                        ? courseNames.join(", ")
                        : detail.course?.title ?? detail.info.course?.title ?? "-";
                    const statusText = statusLabelMap[detail.info.status] ?? detail.info.status;
                    return (
                      <tr key={detail.info.id}>
                        <td>{detail.student.name}</td>
                        <td>{courseTitle}</td>
                        <td>{formatMoney(detail.info.finalAmount)}</td>
                        <td>
                          <StatusBadge status={detail.info.status}>{statusText}</StatusBadge>
                        </td>
                        <td>
                          {detail.info.dueDate
                            ? formatKoreanDate(detail.info.dueDate, { includeWeekday: false })
                            : "-"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </StyledTable>
            </TableWrapper>
          )}
        </SectionCard>

        <SectionCard>
          <h3>전송 메시지 내용</h3>
          <FormStack>
            {isScheduleMode ? (
              <ScheduleField>
                <label>예약 발송 일정</label>
                <ScheduleRow>
                  <Input
                    type="date"
                    value={scheduleDate}
                    min={minScheduleDate}
                    onChange={(event) => setScheduleDate(event.target.value)}
                  />
                  <TimeGroup>
                    <SelectBox
                      ariaLabel="시"
                      placeholder="시"
                      value={scheduleHour}
                      onChange={(value) => setScheduleHour(value ?? "")}
                      options={hours24}
                    />
                    <span>:</span>
                    <SelectBox
                      ariaLabel="분"
                      placeholder="분"
                      value={scheduleMinute}
                      onChange={(value) => setScheduleMinute(value ?? "")}
                      options={mins5}
                    />
                  </TimeGroup>
                </ScheduleRow>
                <HelperText>지정한 시각에 Solapi가 자동 발송합니다.</HelperText>
              </ScheduleField>
            ) : null}
            <label>
              템플릿 선택
              <SelectBox
                ariaLabel="템플릿 선택"
                value={templateKey}
                onChange={(value) =>
                  setTemplateKey((value as TemplateKey) ?? DEFAULT_TEMPLATE_KEY)
                }
                options={Object.entries(TEMPLATE_DEFINITIONS).map(([key, value]) => ({
                  label: value.label,
                  value: key,
                }))}
              />
            </label>
            <label>
              학원명
              <Input
                type="text"
                value={academyName}
                onChange={(event) => setAcademyName(event.target.value)}
              />
            </label>
            <label>
              메시지(템플릿 수정은 불가합니다.)
              <MessageTextarea value={message} readOnly />
            </label>
          </FormStack>

          <PreviewSection>
            <PreviewTitle>
              메시지 미리보기
              {isMultiSelection ? (
                <PreviewNote>대표 학생 기준으로 표시됩니다.</PreviewNote>
              ) : null}
            </PreviewTitle>
            {previewMessages.length === 0 ? (
              <EmptyState>전송 미리보기를 생성할 수 없습니다.</EmptyState>
            ) : (
              <PreviewList>
                {previewMessages.map((preview: PreviewMessage) => (
                  <li key={preview.id}>
                    <strong>{preview.student}</strong>
                    <span>{preview.text}</span>
                  </li>
                ))}
              </PreviewList>
            )}
            {previewCandidate ? (
              <PreviewButtonRow>
                <PrimaryButton
                  type="button"
                  onClick={() => setPreviewDetail(previewCandidate)}
                  disabled={!previewCandidate}
                >
                  청구서 확인하기
                </PrimaryButton>
              </PreviewButtonRow>
            ) : null}
          </PreviewSection>

          <Actions>
            <GhostButton type="button" onClick={() => navigate(routes.payments)}>
              취소
            </GhostButton>
            <PrimaryButton
              type="button"
              disabled={
                sendMutation.isPending ||
                details.length === 0 ||
                (isScheduleMode && !schedulePayload)
              }
              onClick={() => {
                if (isScheduleMode && !schedulePayload) {
                  toastError("예약 발송 시각을 선택해 주세요.");
                  return;
                }
                if (isScheduleMode && minScheduleValue && schedulePayload) {
                  const scheduledDate = new Date(`${schedulePayload}:00`);
                  const minDate = new Date(`${minScheduleValue}:00`);
                  if (!(scheduledDate > minDate)) {
                    toastError("현재보다 이후 시각으로 선택해 주세요.");
                    return;
                  }
                }
                sendMutation.mutate();
              }}
            >
              {sendMutation.isPending
                ? isScheduleMode
                  ? "예약 중..."
                  : "전송 중..."
                : isScheduleMode
                  ? "예약 발송"
                  : "전송"}
            </PrimaryButton>
          </Actions>
        </SectionCard>
      </ConfirmLayout>
      <Modal
        open={Boolean(previewDetail)}
        onClose={() => setPreviewDetail(null)}
        title="청구서 확인"
        maxWidth={720}
      >
        <InvoicePreview
          mode="admin"
          payment={previewDetail ?? undefined}
          academyName={academyName}
          variant="modal"
        />
      </Modal>
    </Page>
  );
}

export default function PaymentsKakaoConfirm() {
  return <KakaoSendPage mode="send" />;
}

export function PaymentsKakaoSchedulePage() {
  return <KakaoSendPage mode="schedule" />;
}

function buildDefaultScheduleParts(): ScheduleParts {
  const base = new Date();
  base.setMinutes(base.getMinutes() + 10);
  base.setSeconds(0, 0);
  const remainder = base.getMinutes() % 5;
  if (remainder !== 0) {
    base.setMinutes(base.getMinutes() + (5 - remainder));
  }
  return {
    date: formatDateInput(base),
    hour: String(base.getHours()).padStart(2, "0"),
    minute: String(base.getMinutes()).padStart(2, "0"),
  };
}

function buildMinScheduleValue(): string {
  const base = new Date();
  base.setMinutes(base.getMinutes() + 5);
  base.setSeconds(0, 0);
  return `${formatDateInput(base)}T${String(base.getHours()).padStart(2, "0")}:${String(base.getMinutes()).padStart(2, "0")}`;
}

function formatDateInput(date: Date): string {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

type ScheduleParts = {
  date: string;
  hour: string;
  minute: string;
};

function combineScheduleParts(date?: string, hour?: string, minute?: string): string | undefined {
  if (!date || !hour || !minute) return undefined;
  return `${date}T${hour}:${minute}`;
}

function normalizeSchedulePayload(raw?: string): string | undefined {
  if (!raw) return undefined;
  const trimmed = raw.trim();
  if (!trimmed) return undefined;
  return trimmed.length === 16 ? `${trimmed}:00` : trimmed;
}

function renderTemplate(template: string, detail: PaymentDetail, academyName: string) {
  const amountWithoutSuffix = formatMoney(detail.info.finalAmount, "");
  const dueDateText = detail.info.dueDate
    ? formatKoreanDate(detail.info.dueDate, { includeWeekday: false })
    : "-";
  const courseNames =
    detail.courses
      ?.map(
        (course: NonNullable<PaymentDetail["courses"]>[number]) => course?.title ?? null,
      )
      .filter(
        (title: string | null): title is string => Boolean(title && title.trim()),
      ) ?? [];
  const fallbackCourse = detail.course?.title ?? "";
  const courseText = courseNames.length ? courseNames.join(", ") : fallbackCourse;
  const invoiceTokenPreview = detail.info.id ? String(detail.info.id) : "PREVIEW_TOKEN";
  const paymentLinkHost = buildInvoicePreviewLink(detail.info.id);
  const replacements: Record<string, string> = {
    "#{academyName}": academyName,
    "#{studentName}": detail.student.name ?? "",
    "#{courseName}": courseText || "수강료",
    "#{finalAmount}": amountWithoutSuffix,
    "#{dueDate}": dueDateText,
    "#{paymentLink}": paymentLinkHost,
    "#{token}": invoiceTokenPreview,
    "#{receiptToken}": RECEIPT_TOKEN_PREVIEW,
  };
  return template
    .replaceAll("#{academyName}", replacements["#{academyName}"])
    .replaceAll("#{studentName}", replacements["#{studentName}"])
    .replaceAll("#{courseName}", replacements["#{courseName}"])
    .replaceAll("#{finalAmount}", replacements["#{finalAmount}"])
    .replaceAll("#{dueDate}", replacements["#{dueDate}"])
    .replaceAll("#{paymentLink}", replacements["#{paymentLink}"])
    .replaceAll("#{token}", replacements["#{token}"])
    .replaceAll("#{receiptToken}", replacements["#{receiptToken}"]);
}

function buildInvoicePreviewLink(invoiceId?: number | null) {
  const invoiceTokenPreview = invoiceId ? String(invoiceId) : "PREVIEW_TOKEN";
  const paymentLinkBase = PAYMENT_LINK_HOST_PREVIEW.replace(/\/$/, "");
  return `${paymentLinkBase}?token=${invoiceTokenPreview}`;
}

const ConfirmLayout = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
  gap: 24px;
`;

const TableWrapper = styled.div`
  overflow-x: auto;
`;

const StyledTable = styled(TableBase)`
  thead th,
  tbody td {
    text-align: center;
  }
  tbody td {
    vertical-align: middle;
  }
`;

const FormStack = styled.div`
  display: grid;
  gap: 12px;
  margin-bottom: 16px;
  label {
    display: grid;
    gap: 6px;
    font-size: 13px;
    color: ${(p) => p.theme.colors.textMuted};
  }
`;

const Input = styled.input`
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 10px;
  padding: 8px 12px;
  font-size: 14px;
`;

const HelperText = styled.span`
  font-size: 12px;
  color: ${(p) => p.theme.colors.textMuted};
  display: block;
  margin-top: 2px;
`;

const ScheduleField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  label {
    font-size: 13px;
    color: ${(p) => p.theme.colors.textMuted};
  }
`;

const ScheduleRow = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
  input {
    min-width: 180px;
  }
`;

const TimeGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  span {
    font-weight: 600;
  }
  > div {
    min-width: 80px;
  }
`;

const MessageTextarea = styled.textarea`
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 10px;
  padding: 12px;
  font-size: 14px;
  min-height: 120px;
  resize: vertical;
  background: ${(p) => p.theme.colors.background};
  color: ${(p) => p.theme.colors.text};
  cursor: not-allowed;
`;

const PreviewSection = styled.div`
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.radii.md};
  padding: 12px;
  margin-top: 12px;
`;

const PreviewTitle = styled.h4`
  margin: 0 0 8px;
  font-size: 14px;
  color: ${(p) => p.theme.colors.text};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const PreviewNote = styled.span`
  font-size: 12px;
  color: ${(p) => p.theme.colors.textMuted};
`;

const PreviewList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 8px;
  li {
    border: 1px solid ${(p) => p.theme.colors.borderMuted};
    border-radius: ${(p) => p.theme.radii.sm};
    padding: 8px;
    display: grid;
    gap: 4px;
    strong {
      font-size: 13px;
    }
    span {
      font-size: 13px;
      color: ${(p) => p.theme.colors.text};
      white-space: pre-wrap;
    }
  }
`;

const PreviewButtonRow = styled.div`
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 16px;
`;

const StatusBadge = styled.span<{ status: string }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  background: ${({ status }) => (statusColor[status] ?? "#d1d5db")}1A;
  color: ${({ status }) => statusColor[status] ?? "#52525b"};
`;
