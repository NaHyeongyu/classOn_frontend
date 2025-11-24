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
import type { PaymentDetail } from "@classon/shared-types";
import { formatMoney, formatKoreanDate } from "@/lib/format";
import { readableError } from "@/lib/errors";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { routes } from "@/routes";
import { invalidatePaymentsQueries } from "@/lib/paymentsCache";
import { useAuth } from "@/hooks/useAuth";
import Modal from "@/components/common/Modal";
import InvoicePreview from "@/components/payments/InvoicePreview";

type TemplateKey = PaymentTemplateKey;

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
  GUIDE: {
    label: "결제 안내용 (기본 청구)",
    resend: false,
    body: [
      "[#{academyName}]",
      "안녕하세요. #{studentName} 학부모님 😊",
      "",
      "#{courseName} 수업의 수강료를 안내드립니다.",
      "총 금액은 #{finalAmount}원이며,",
      "납부 기한은 #{dueDate}까지 입니다.",
      "",
      "아래 버튼을 눌러 청구서 상세 내역을 확인해 주세요.",
    ].join("\n"),
  },
  RETRY: {
    label: "결제 재안내용 (미납 재전송)",
    resend: true,
    body: [
      "[#{academyName}]",
      "안녕하세요. #{studentName} 학부모님 😊",
      "",
      "#{courseName} 수업의 청구서 확인을 재요청드립니다.",
      "",
      "총 금액은 #{finalAmount}원이며,",
      "기한은 #{dueDate}입니다.",
      "",
      "아래 버튼을 눌러 청구서 내용을 확인해주세요.",
    ].join("\n"),
  },
  SUCCESS: {
    label: "결제 완료 안내",
    resend: false,
    body: [
      "[#{academyName}]",
      "#{studentName} 학생의 #{courseName} 수업 수강료 결제가 정상적으로 완료되었습니다.",
      "",
      "항상 믿고 맡겨주셔서 감사합니다.",
    ].join("\n"),
  },
  FAIL: {
    label: "결제 실패 안내",
    resend: false,
    body: [
      "[#{academyName}]",
      "안녕하세요. #{studentName} 학부모님 😊",
      "",
      "#{studentName} 학생의 #{courseName} 수업료 납부가 진행 되지 않았습니다.",
      "",
      "청구서 페이지에서 다시 한 번 안내 내용을 확인해 주세요.",
    ].join("\n"),
  },
};

const statusLabelMap: Record<string, string> = {
  UNPAID: "미납",
  PENDING: "대기",
  COMPLETED: "완료",
  FAILED: "실패",
};

const statusColor: Record<string, string> = {
  UNPAID: "#f97316",
  PENDING: "#2563EB",
  COMPLETED: "#059669",
  FAILED: "#dc2626",
};

export default function PaymentsKakaoConfirm() {
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
  const [templateKey, setTemplateKey] = useState<TemplateKey>("GUIDE");
  const [message, setMessage] = useState(TEMPLATE_DEFINITIONS.GUIDE.body);
  const [previewDetail, setPreviewDetail] = useState<PaymentDetail | null>(null);

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

  const sendMutation = useMutation({
    mutationFn: () =>
      sendPaymentInvoices({
        ids,
        templateKey,
        resend: TEMPLATE_DEFINITIONS[templateKey].resend,
      }),
    onSuccess: () => {
      success("카카오톡 알림 전송을 요청했습니다.");
      invalidatePaymentsQueries(queryClient);
      navigate(routes.payments);
    },
    onError: (err: unknown) => toastError(readableError(err, "카카오톡 발송에 실패했습니다.")),
  });

  if (ids.length === 0) {
    return (
      <Page>
        <PageHeader>
          <div>
            <h2>카카오톡 알림 전송</h2>
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
          <h2>카카오톡 알림 전송 확인</h2>
          <p>선택된 학생들에게 전송할 메시지를 확인하세요.</p>
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
            <label>
              템플릿 선택
              <Select
                value={templateKey}
                onChange={(event) => setTemplateKey(event.target.value as TemplateKey)}
              >
                {Object.entries(TEMPLATE_DEFINITIONS).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value.label}
                  </option>
                ))}
              </Select>
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
              disabled={sendMutation.isPending || details.length === 0}
              onClick={() => sendMutation.mutate()}
            >
              {sendMutation.isPending ? "전송 중..." : "전송"}
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

const Select = styled.select`
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 10px;
  padding: 8px 12px;
  font-size: 14px;
  background: #fff;
`;

const Input = styled.input`
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 10px;
  padding: 8px 12px;
  font-size: 14px;
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
