import { useEffect, useState } from "react";
import styled from "styled-components";
import Modal from "@/components/common/Modal";
import { GhostButton, PrimaryButton, Skeleton } from "@/components/common/UI";
import { getPaymentDetail } from "@/api/payments";
import type { PaymentDetail } from "@classon/shared-types";
import { formatMoney, formatKoreanDate, formatKoreanDateTimeKST } from "@/lib/format";
import { readableError } from "@/lib/errors";
import { useToast } from "@/components/common/Toast";
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
                                <span>이름</span>
                                <strong>{detail.student.name}</strong>
                            </InfoRow>
                            <InfoRow>
                                <span>코드</span>
                                <strong>{detail.student.code ?? "-"}</strong>
                            </InfoRow>
                            <InfoRow>
                                <span>등록일</span>
                                <strong>
                                    {detail.student.joinedDate
                                        ? formatKoreanDate(detail.student.joinedDate, { includeWeekday: false })
                                        : "-"}
                                </strong>
                            </InfoRow>
                            <InfoRow>
                                <span>연락처</span>
                                <strong>{detail.student.phoneNumber ?? "-"}</strong>
                            </InfoRow>
                        </InfoCard>

                        <SectionHeading>수강 과목</SectionHeading>
                        <CourseList>
                            {resolveCourseRows(detail).map((course, index) => (
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

const ModalActions = styled.div`
    display: flex;
    gap: 8px;
    justify-content: flex-end;
`;
