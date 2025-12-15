import { useEffect, useState } from "react";
import styled from "styled-components";
import Modal from "@/components/common/Modal";
import { GhostButton, PrimaryButton, Skeleton } from "@/components/common/UI";
import { getPaymentDetail } from "@/api/payments";
import type { PaymentDetail } from "@classon/shared-types";
import { formatMoney, formatKoreanDateTimeKST } from "@/lib/format";
import { readableError } from "@/lib/errors";
import { useToast } from "@/components/common/Toast";
import { AdditionalChargeFields } from "@/components/payments/AdditionalChargeFields";
import {
    resolveCourseRows,
    computeNextDueDateLabel,
    getCycleLabel,
    getPaymentMethodDisplay,
} from "@/lib/paymentDetailHelpers";

type Props = {
    open: boolean;
    onClose: () => void;
    paymentId: number | null;
    variant: "invoice" | "history";
    onCancelPayment?: (detail: PaymentDetail) => void;
    cancelPending?: boolean;
};

const statusLabel: Record<string, string> = {
    UNPAID: "미납",
    PENDING: "대기",
    COMPLETED: "완료",
    FAILED: "실패",
    CANCELED: "취소",
    SCHEDULED: "예약",
};

export function PaymentDetailModal({
    open,
    onClose,
    paymentId,
    variant,
    onCancelPayment,
    cancelPending = false,
}: Props) {
    const { error: toastError } = useToast();
    const [loading, setLoading] = useState(false);
    const [detail, setDetail] = useState<PaymentDetail | null>(null);

    useEffect(() => {
        if (!open || !paymentId) {
            setDetail(null);
            return;
        }

        setLoading(true);
        getPaymentDetail(paymentId)
            .then((data) => {
                setDetail(data);
                setLoading(false);
            })
            .catch((err) => {
                toastError(readableError(err, "결제 정보를 불러오지 못했습니다."));
                setLoading(false);
                onClose();
            });
    }, [open, paymentId, toastError, onClose]);

    const canCancel = variant === "history" && detail?.info.status === "COMPLETED" && onCancelPayment;
    const courseRows = detail ? resolveCourseRows(detail) : [];
    const courseTitles = courseRows
        .map((course) => course?.title ?? null)
        .filter((title): title is string => Boolean(title && title.trim()))
        .join(", ");
    const recipientPhoneDisplay = detail
        ? formatPhoneKR(
              detail.info.recipientPhone ??
                  detail.student.recipientPhone ??
                  detail.student.guardianPhone ??
                  "",
          ) || "-"
        : "-";
    const additionalSnapshot = detail
        ? mapAdditionalFieldsFromDetail(detail)
        : createEmptyAdditionalSnapshot();
    const additionalTotalAmount =
        (additionalSnapshot.materialFee ?? 0) + (additionalSnapshot.textbookFee ?? 0);
    const [additionExpanded, setAdditionExpanded] = useState(false);
    const [discountExpanded, setDiscountExpanded] = useState(false);

    useEffect(() => {
        setAdditionExpanded(additionalSnapshot.enabled);
    }, [detail?.info.id, additionalSnapshot.enabled]);

    const discountAmount = detail
        ? Math.max(
              0,
              (detail.info.originalAmount ?? 0) - (detail.info.finalAmount ?? 0),
          )
        : 0;
    const hasDiscountDetails =
        Boolean(detail?.info.discountType) || discountAmount > 0;

    useEffect(() => {
        setDiscountExpanded(hasDiscountDetails);
    }, [detail?.info.id, hasDiscountDetails]);

    if (!open) return null;

    return (
        <Modal open={open} onClose={onClose} title="결제 상세" maxWidth={720}>
            {loading ? (
                <Skeleton h={200} />
            ) : detail ? (
                <DetailLayout>
                    <DetailColumn>
                        <SectionHeading>학생 정보</SectionHeading>
                        <InfoCard>
                            <InfoRow>
                                <span>학생 이름</span>
                                <strong>{detail.student.name}</strong>
                            </InfoRow>
                            <InfoRow>
                                <span>학생 코드</span>
                                <strong>{detail.student.code ?? "-"}</strong>
                            </InfoRow>
                            <InfoRow>
                                <span>수강 수업</span>
                                <strong>{courseTitles || "-"}</strong>
                            </InfoRow>
                            <InfoRow>
                                <span>발신 번호</span>
                                <strong>{recipientPhoneDisplay}</strong>
                            </InfoRow>
                        </InfoCard>

                        <SectionHeading>수강 과목</SectionHeading>
                        <CourseList>
                            {courseRows.map((course, index) => (
                                <li key={`${course?.id ?? "course"}-${index}`}>
                                    <div className="info">
                                        <strong>{course?.title ?? "-"}</strong>
                                        {course?.code ? <span className="code">{course.code}</span> : null}
                                    </div>
                                    <span className="fee">{formatMoney(Number(course?.fee ?? 0))}</span>
                                </li>
                            ))}
                        </CourseList>
                    </DetailColumn>

                    <DetailColumn>
                        <SectionHeading>상세 정보</SectionHeading>
                        <DetailInfoCard>
                            <DetailInfoRows>
                                <li>
                                    <span>수강 금액</span>
                                    <strong>{formatMoney(detail.info.originalAmount ?? 0)}</strong>
                                </li>
                                <li>
                                    <span>할인</span>
                                    <strong>
                                        {Math.max(
                                            0,
                                            (detail.info.originalAmount ?? 0) - (detail.info.finalAmount ?? 0),
                                        )
                                            ? formatMoney(
                                                  Math.max(
                                                      0,
                                                      (detail.info.originalAmount ?? 0) -
                                                          (detail.info.finalAmount ?? 0),
                                                  ),
                                              )
                                            : "—"}
                                    </strong>
                                </li>
                                <li>
                                    <span>최종 결제금액</span>
                                    <strong>{formatMoney(detail.info.finalAmount ?? 0)}</strong>
                                </li>
                                <li>
                                    <span>결제 수단</span>
                                    <strong>
                                        {getPaymentMethodDisplay(detail.info.paymentMethod, detail.info.paymentType)}
                                    </strong>
                                </li>
                                <li>
                                    <span>결제 주기</span>
                                    <strong>{getCycleLabel(detail, variant)}</strong>
                                </li>
                                <li>
                                    <span>결제 시간</span>
                                    <strong>
                                        {detail.info.completedAt
                                            ? formatKoreanDateTimeKST(detail.info.completedAt, {
                                                  includeWeekday: true,
                                                  showSeconds: true,
                                              })
                                            : "-"}
                                    </strong>
                                </li>
                                {detail.info.status === "CANCELED" ? (
                                    <li>
                                        <span>취소 시간</span>
                                        <strong>
                                            {detail.info.canceledAt
                                                ? formatKoreanDateTimeKST(detail.info.canceledAt, {
                                                      includeWeekday: true,
                                                      showSeconds: true,
                                                  })
                                                : "-"}
                                        </strong>
                                    </li>
                                ) : null}
                                <li>
                                    <span>승인 번호</span>
                                    <strong>{detail.info.approvalNumber?.trim() || "-"}</strong>
                                </li>
                                <li>
                                    <span>승인 상태</span>
                                    <strong>{statusLabel[detail.info.status] ?? detail.info.status}</strong>
                                </li>
                                <li>
                                    <span>다음 결제일</span>
                                    <strong>{computeNextDueDateLabel(detail)}</strong>
                                </li>
                            </DetailInfoRows>
                        </DetailInfoCard>

                        {hasDiscountDetails ? (
                            <CollapsibleCard>
                                <CollapsibleHeader
                                    type="button"
                                    onClick={() => setDiscountExpanded((prev) => !prev)}
                                >
                                    <span>할인 설정</span>
                                    <CaretIcon $open={discountExpanded} />
                                </CollapsibleHeader>
                                {discountExpanded ? (
                                    <CollapsibleBody>
                                        <DetailList>
                                            <li>
                                                <span>유형</span>
                                                <strong>
                                                    {detail.info.discountType === "PERCENT"
                                                        ? "비율 할인"
                                                        : "금액 할인"}
                                                </strong>
                                            </li>
                                            <li>
                                                <span>할인 값</span>
                                                <strong>
                                                    {detail.info.discountType === "PERCENT"
                                                        ? `${detail.info.discountValue ?? 0}%`
                                                        : formatMoney(
                                                              Number(detail.info.discountValue ?? 0),
                                                          )}
                                                </strong>
                                            </li>
                                            <li>
                                                <span>적용된 할인 금액</span>
                                                <strong>{discountAmount ? formatMoney(discountAmount) : "—"}</strong>
                                            </li>
                                        </DetailList>
                                    </CollapsibleBody>
                                ) : null}
                            </CollapsibleCard>
                        ) : null}

                        <CollapsibleCard>
                            <CollapsibleHeader
                                type="button"
                                onClick={() => setAdditionExpanded((prev) => !prev)}
                            >
                                <span>추가 금액 설정</span>
                                <CaretIcon $open={additionExpanded} />
                            </CollapsibleHeader>
                            {additionExpanded ? (
                                <CollapsibleBody>
                                    <AdditionalChargeFields
                                        enabled={additionalSnapshot.enabled}
                                        materialFee={additionalSnapshot.materialFee}
                                        textbookFee={additionalSnapshot.textbookFee}
                                        startDate={additionalSnapshot.startDate}
                                        endDate={additionalSnapshot.endDate}
                                        onToggleEnabled={() => {}}
                                        onChangeMaterialFee={() => {}}
                                        onChangeTextbookFee={() => {}}
                                        onChangeStartDate={() => {}}
                                        onChangeEndDate={() => {}}
                                        disabled
                                        showTitle={false}
                                    />
                                    {additionalSnapshot.enabled ? (
                                        <AdditionalFooter>
                                            <span>추가 금액 합계</span>
                                            <strong>{formatMoney(additionalTotalAmount)}</strong>
                                        </AdditionalFooter>
                                    ) : null}
                                </CollapsibleBody>
                            ) : null}
                        </CollapsibleCard>

                        <SectionHeading>메모</SectionHeading>
                        <Paragraph>
                            {[detail.info.memo, detail.info.managerMemo]
                                .filter((v) => v && v.trim())
                                .join("\n") || "메모가 없습니다."}
                        </Paragraph>

                        <ModalActions>
                            <PrimaryButton type="button" onClick={onClose}>
                                확인
                            </PrimaryButton>
                            {canCancel ? (
                                <GhostButton
                                    type="button"
                                    data-variant="danger"
                                    onClick={() => onCancelPayment(detail)}
                                    disabled={cancelPending}
                                >
                                    {cancelPending ? "취소 중..." : "결제 취소"}
                                </GhostButton>
                            ) : null}
                        </ModalActions>
                    </DetailColumn>
                </DetailLayout>
            ) : null}
        </Modal>
    );
}

const DetailLayout = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 16px;
    max-height: 70vh;
    overflow: auto;
`;

const DetailColumn = styled.div`
    display: grid;
    gap: 16px;
    align-items: flex-start;
    align-content: flex-start;
`;

const SectionHeading = styled.h4`
    margin: 0;
    font-size: 15px;
    color: ${(p) => p.theme.colors.text};
`;

const InfoCard = styled.div`
    border: 1px solid ${(p) => p.theme.colors.border};
    border-radius: ${(p) => p.theme.radii.md};
    padding: 16px;
    display: grid;
    gap: 10px;
    background: ${(p) => p.theme.colors.surfaceAlt ?? "#f9fafb"};
`;

const InfoRow = styled.div`
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    span {
        color: ${(p) => p.theme.colors.textMuted};
    }
    strong {
        color: ${(p) => p.theme.colors.text};
    }
`;

const CourseList = styled.ul`
    list-style: none;
    margin: 0;
    padding: 0;
    border: 1px solid ${(p) => p.theme.colors.border};
    border-radius: ${(p) => p.theme.radii.md};
    li {
        padding: 12px;
        border-bottom: 1px solid ${(p) => p.theme.colors.borderMuted};
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 12px;
    }
    li:last-child {
        border-bottom: none;
    }
    .info {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }
    strong {
        font-size: 14px;
        color: ${(p) => p.theme.colors.text};
    }
    .code {
        font-size: 12px;
        color: ${(p) => p.theme.colors.textMuted};
    }
    .fee {
        font-size: 14px;
        font-weight: 600;
        color: ${(p) => p.theme.colors.text};
        white-space: nowrap;
    }
`;

const DetailInfoCard = styled.div`
    border: 1px solid ${(p) => p.theme.colors.border};
    border-radius: ${(p) => p.theme.radii.md};
    padding: 16px;
    background: ${(p) => p.theme.colors.surfaceAlt ?? "#f9fafb"};
`;

const DetailInfoRows = styled.ul`
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: 10px;
    li {
        display: flex;
        justify-content: space-between;
        font-size: 14px;
    }
    span {
        color: ${(p) => p.theme.colors.textMuted};
    }
    strong {
        color: ${(p) => p.theme.colors.text};
    }
`;

const DetailList = styled.ul`
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: 8px;
    li {
        display: flex;
        justify-content: space-between;
        font-size: 14px;
    }
    span {
        color: ${(p) => p.theme.colors.textMuted};
    }
    strong {
        color: ${(p) => p.theme.colors.text};
    }
`;

const Paragraph = styled.p`
    border: 1px solid ${(p) => p.theme.colors.border};
    border-radius: ${(p) => p.theme.radii.md};
    padding: 12px;
    min-height: 80px;
    white-space: pre-wrap;
    font-size: 14px;
    line-height: 1.6;
    color: ${(p) => p.theme.colors.text};
    background: ${(p) => p.theme.colors.surfaceAlt ?? "#f9fafb"};
    margin: 0;
`;

const AdditionalFooter = styled.div`
    margin-top: 8px;
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    font-size: 14px;
    font-weight: 600;
    color: ${(p) => p.theme.colors.text};
`;

const ModalActions = styled.div`
    display: flex;
    gap: 8px;
    justify-content: flex-end;
`;

const CollapsibleCard = styled.div`
    border: 1px solid ${(p) => p.theme.colors.border};
    border-radius: ${(p) => p.theme.radii.md};
    margin-bottom: 12px;
    overflow: hidden;
`;

const CollapsibleHeader = styled.button<{ type?: string }>`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    background: ${(p) => p.theme.colors.surface};
    border: none;
    font-size: 14px;
    font-weight: 600;
    color: ${(p) => p.theme.colors.text};
    cursor: pointer;
`;

const CollapsibleBody = styled.div`
    border-top: 1px solid ${(p) => p.theme.colors.borderMuted};
    padding: 12px 16px;
    background: ${(p) => p.theme.colors.surfaceAlt ?? "#f9fafb"};
`;

const CaretIcon = styled.span<{ $open: boolean }>`
    border: solid currentColor;
    border-width: 0 2px 2px 0;
    display: inline-block;
    padding: 4px;
    transform: rotate(${(p) => (p.$open ? "45deg" : "-45deg")});
    transition: transform 120ms ease;
`;

type AdditionalSnapshot = {
    enabled: boolean;
    materialFee?: number;
    textbookFee?: number;
    startDate?: string;
    endDate?: string;
};

function createEmptyAdditionalSnapshot(): AdditionalSnapshot {
    return {
        enabled: false,
        materialFee: undefined,
        textbookFee: undefined,
        startDate: undefined,
        endDate: undefined,
    };
}

function mapAdditionalFieldsFromDetail(detail: PaymentDetail): AdditionalSnapshot {
    const materialItem = detail.additionalItems?.find((item) => item?.type === "MATERIAL");
    const textbookItem = detail.additionalItems?.find((item) => item?.type === "TEXTBOOK");
    const materialFeeValue =
        typeof materialItem?.unitPrice === "number" ? materialItem.unitPrice : undefined;
    const textbookFeeValue =
        typeof textbookItem?.unitPrice === "number" ? textbookItem.unitPrice : undefined;
    const startDateValue =
        materialItem?.appliedStart ??
        textbookItem?.appliedStart ??
        detail.info.dueDate ??
        "";
    const endDateValue =
        materialItem?.appliedEnd ??
        textbookItem?.appliedEnd ??
        detail.info.dueDate ??
        "";
    const enabled = Boolean(
        (materialFeeValue && materialFeeValue > 0) || (textbookFeeValue && textbookFeeValue > 0),
    );
    return {
        enabled,
        materialFee: materialFeeValue,
        textbookFee: textbookFeeValue,
        startDate: startDateValue || undefined,
        endDate: endDateValue || undefined,
    };
}

function formatPhoneKR(raw?: string | null): string {
    if (!raw) return "";
    const digits = raw.replace(/[^0-9]/g, "");
    if (!digits) return "";
    if (digits.length === 11 && digits.startsWith("010")) {
        return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
    }
    if (digits.length === 10 && digits.startsWith("010")) {
        return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
    }
    return digits;
}
