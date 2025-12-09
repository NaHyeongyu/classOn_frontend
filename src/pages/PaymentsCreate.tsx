import { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import {
  Page,
  SectionCard,
  PageHeader,
  PrimaryButtonLg,
  GhostButton,
  TableBase,
  EmptyState,
  Skeleton,
  ToggleSwitch,
} from "@/components/common/UI";
import { useToast } from "@/components/common/Toast";
import { DiscountFields } from "@/components/payments/DiscountFields";
import { AdditionalChargeFields } from "@/components/payments/AdditionalChargeFields";
import {
  createPaymentInvoice,
  listPaymentHistory,
  type PaymentInvoicePayload,
  type PaymentAdditionalItemPayload,
} from "@/api/payments";
import { listStudents, type Student } from "@/api/students";
import type { PageResult } from "@/types/paging";
import type { DiscountType, BillingCycleUnit, PaymentHistoryRow } from "@classon/shared-types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { routes } from "@/routes";
import { formatMoney } from "@/lib/format";
import { invalidatePaymentsQueries } from "@/lib/paymentsCache";

type StudentOverride = {
  dueDate?: string;
  periodStart?: string;
  periodEnd?: string;
  cycleValue?: number;
  discountEnabled?: boolean;
  discountType?: DiscountType;
  discountValue?: number;
  discountStartDate?: string;
  discountEndDate?: string;
  memo?: string;
  managerMemo?: string;
  extraEnabled?: boolean;
  materialFee?: number;
  textbookFee?: number;
  extraStartDate?: string;
  extraEndDate?: string;
};

const today = new Date();
const toLocalISODate = (date: Date) => {
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60000);
  return local.toISOString().slice(0, 10);
};
const nextMonthBase = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
const dateISO = (date: Date) => toLocalISODate(date);
const nextMonth = nextMonthBase;

const defaultForm = {
  dueDate: dateISO(today),
  periodStart: dateISO(today),
  periodEnd: dateISO(nextMonth),
  discountStartDate: dateISO(today),
  discountEndDate: dateISO(nextMonth),
  discountEnabled: false,
  discountType: "AMOUNT" as DiscountType,
  discountValue: undefined as number | undefined,
  memo: "",
  managerMemo: "",
  cycleValue: 1,
  cycleUnit: "MONTHS" as BillingCycleUnit,
  autoGenerate: true,
  extraEnabled: false,
  materialFee: undefined as number | undefined,
  textbookFee: undefined as number | undefined,
  extraStartDate: dateISO(today),
  extraEndDate: dateISO(nextMonth),
  recipientPhone: "",
};

function normalizeCycle(value: string | number | undefined): number {
  const num = typeof value === "string" ? Number(value) : value;
  if (!Number.isFinite(num) || (num ?? 0) <= 0) return 1;
  return Math.max(1, Math.round(Number(num)));
}

function computePeriodEnd(start: string, months: number): string {
  if (!start) return start;
  const base = new Date(start);
  if (Number.isNaN(base.getTime())) return start;
  const next = new Date(base);
  next.setMonth(next.getMonth() + months);
  return dateISO(next);
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

export default function PaymentsCreate() {
  const navigate = useNavigate();
  const { success, error: toastError } = useToast();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [studentPage, setStudentPage] = useState(0);
  const pageSize = 10;
  const [overrides, setOverrides] = useState<Record<number, StudentOverride>>({});
  const [activeOverrideId, setActiveOverrideId] = useState<number | null>(null);
  const [form, setForm] = useState(defaultForm);
  const [discountOpen, setDiscountOpen] = useState(false);
  const [extraOpen, setExtraOpen] = useState(false);
  const handleDueDateChange = (value: string) => {
    setForm((prev) => {
      const nextStart = value || prev.periodStart;
      return {
        ...prev,
        dueDate: value,
        periodStart: nextStart,
        periodEnd: computePeriodEnd(nextStart, prev.cycleValue),
      };
    });
  };
  const handleCycleValueChange = (raw: string) => {
    const nextValue = normalizeCycle(raw);
    setForm((prev) => ({
      ...prev,
      cycleValue: nextValue,
      periodEnd: computePeriodEnd(prev.periodStart, nextValue),
    }));
  };
  const handlePeriodStartChange = (value: string) => {
    setForm((prev) => ({
      ...prev,
      periodStart: value,
      periodEnd: computePeriodEnd(value, prev.cycleValue),
    }));
  };

  const studentsQuery = useQuery<PageResult<Student>>({
    queryKey: ["payments-create", "students"],
    queryFn: () => listStudents({ size: 200 }),
    staleTime: 60_000,
  });

  const reservedInvoicesQuery = useQuery<PaymentHistoryRow[]>({
    queryKey: ["payments-create", "students-with-invoice"],
    queryFn: async () => {
      const size = 500;
      const collected: PaymentHistoryRow[] = [];
      let page = 0;
      const MAX_PAGES = 20;
      while (page < MAX_PAGES) {
        const chunk = await listPaymentHistory({ status: "ALL", page, size });
        if (Array.isArray(chunk.content) && chunk.content.length) {
          collected.push(...chunk.content);
        }
        if (chunk.last || !chunk.content?.length) {
          break;
        }
        page += 1;
      }
      return collected;
    },
    staleTime: 30_000,
  });

  const students = useMemo(() => studentsQuery.data?.content ?? [], [studentsQuery.data]);
  const reservedStudentIds = useMemo<Set<number>>(() => {
    if (!reservedInvoicesQuery.data?.length) return new Set<number>();
    return new Set(
      reservedInvoicesQuery.data
        .map((row: PaymentHistoryRow) => row.student?.id)
        .filter((id: number | undefined): id is number => typeof id === "number"),
    );
  }, [reservedInvoicesQuery.data]);

  const filteredStudents: Student[] = useMemo(() => {
    const base = students.filter(
      (student: Student) =>
        typeof student.id === "number" &&
        !reservedStudentIds.has(student.id),
    );
    if (!search.trim()) return base;
    const keyword = search.trim().toLowerCase();
    return base.filter((student: Student) => student.name?.toLowerCase().includes(keyword));
  }, [students, search, reservedStudentIds]);

  useEffect(() => {
    setStudentPage(0);
  }, [search]);

  useEffect(() => {
    if (!reservedStudentIds.size) return;
    setSelectedIds((prev) => prev.filter((id) => !reservedStudentIds.has(id)));
  }, [reservedStudentIds]);

  useEffect(() => {
    const maxPage = Math.max(0, Math.ceil(filteredStudents.length / pageSize) - 1);
    if (studentPage > maxPage) {
      setStudentPage(maxPage);
    }
  }, [filteredStudents.length, pageSize, studentPage]);

  const handleToggleSelect = (id: number) => {
    setSelectedIds((prev) => {
      const isSelected = prev.includes(id);
      if (isSelected) {
        const next = prev.filter((value) => value !== id);
        return next;
      }
      const next = [...prev, id];
      setActiveOverrideId(id);
      return next;
    });
  };

  const handleSelectAll = () => {
    if (!filteredStudents.length) return;
    const filteredIds = filteredStudents.map((student: Student) => student.id);
    const allSelected = filteredIds.every((id: number) => selectedIds.includes(id));
    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !filteredIds.includes(id)));
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...filteredIds])));
    }
  };

  const defaultAmountForStudent = useCallback((student: Student | undefined) => {
    if (!student || !Array.isArray(student.courses) || student.courses.length === 0) {
      return 0;
    }
    return student.courses.reduce((total: number, course: NonNullable<Student["courses"]>[number]) => {
      const fee = typeof course.fee === "number" ? course.fee : Number(course.fee);
      if (!Number.isFinite(fee)) return total;
      return total + Number(fee);
    }, 0);
  }, []);

  const buildPayload = (student: Student, override: StudentOverride | undefined): PaymentInvoicePayload => {
    const discountEnabled = override?.discountEnabled ?? form.discountEnabled;
    const discountType = override?.discountType ?? form.discountType;
    const discountValue = override?.discountValue ?? form.discountValue;
    const memoValue = override?.memo ?? form.memo;
    const extraEnabled = override?.extraEnabled ?? form.extraEnabled;
    const materialFee = extraEnabled ? override?.materialFee ?? form.materialFee ?? 0 : 0;
    const textbookFee = extraEnabled ? override?.textbookFee ?? form.textbookFee ?? 0 : 0;
    const baseAmount = defaultAmountForStudent(student);
    const totalAmount = baseAmount + materialFee + textbookFee;

    const additionalItems: PaymentAdditionalItemPayload[] = [];
    if (extraEnabled) {
      if (materialFee > 0) {
        additionalItems.push({
          type: "MATERIAL",
          label: "재료비",
          quantity: 1,
          unitPrice: materialFee,
          appliedStart: override?.extraStartDate ?? form.extraStartDate,
          appliedEnd: override?.extraEndDate ?? form.extraEndDate,
        });
      }
      if (textbookFee > 0) {
        additionalItems.push({
          type: "TEXTBOOK",
          label: "교재비",
          quantity: 1,
          unitPrice: textbookFee,
          appliedStart: override?.extraStartDate ?? form.extraStartDate,
          appliedEnd: override?.extraEndDate ?? form.extraEndDate,
        });
      }
    }

    return {
      studentId: student.id,
      dueDate: override?.dueDate ?? form.dueDate,
      periodStart: override?.periodStart ?? form.periodStart,
      periodEnd: override?.periodEnd ?? form.periodEnd,
      amount: totalAmount,
      discountType: discountEnabled ? discountType : undefined,
      discountValue: discountEnabled ? discountValue : undefined,
      memo: memoValue,
      managerMemo: memoValue,
      autoGenerate: form.autoGenerate,
      cycleUnit: form.cycleUnit,
      cycleValue: override?.cycleValue ?? form.cycleValue,
      discountEnabled,
      discountStartDate: discountEnabled
        ? override?.discountStartDate ?? form.discountStartDate
        : undefined,
      discountEndDate: discountEnabled
        ? override?.discountEndDate ?? form.discountEndDate
        : undefined,
      additionalItems: additionalItems.length ? additionalItems : undefined,
      recipientPhone: form.recipientPhone,
    };
  };

  const createMutation = useMutation({
    mutationFn: async () => {
      if (!selectedIds.length) {
        throw new Error("학생을 선택해 주세요.");
      }
      const selectedStudents = selectedIds
        .map((id) => students.find((student: Student) => student.id === id))
        .filter((student): student is Student => Boolean(student));
      if (!selectedStudents.length) {
        throw new Error("선택한 학생 정보를 찾을 수 없습니다.");
      }
      // 간단한 클라이언트 측 검증: 보호자 연락처/금액 0원인 대상은 생성 시도 전에 막습니다.
      const invalidContacts = selectedStudents.filter((student) => {
        const rawGuardian = (student.guardianPhone ?? "").trim();
        return !rawGuardian;
      });
      if (invalidContacts.length) {
        throw new Error("보호자 연락처가 없는 학생이 포함되어 있어 청구서를 생성할 수 없습니다.\n학생 정보에서 학부모 전화번호를 먼저 등록해 주세요.");
      }
      await Promise.all(
        selectedStudents.map((student: Student) => {
          const override = overrides[student.id];
          const payload = buildPayload(student, override);
          if (!payload.amount || payload.amount <= 0) {
            throw new Error("청구 금액이 0원인 학생이 포함되어 있어 청구서를 생성할 수 없습니다.\n수업 수강료나 추가 금액을 확인해 주세요.");
          }
          return createPaymentInvoice(payload);
        }),
      );
    },
    onSuccess: () => {
      success("청구서를 생성했습니다.");
      invalidatePaymentsQueries(queryClient);
      queryClient.invalidateQueries({ queryKey: ["payments-create", "students-with-invoice"] }).catch(() => {});
      navigate(routes.payments);
    },
    onError: (err: unknown) => {
      toastError(err instanceof Error ? err.message : "청구서 생성에 실패했습니다.");
    },
  });

  const pagedStudents: Student[] = useMemo(() => {
    const start = studentPage * pageSize;
    return filteredStudents.slice(start, start + pageSize);
  }, [filteredStudents, pageSize, studentPage]);

  const selectedStudents: Student[] = useMemo(
    () =>
      selectedIds
        .map((id) => students.find((student: Student) => student.id === id))
        .filter((student): student is Student => Boolean(student)),
    [selectedIds, students],
  );

  const primaryStudent: Student | null = useMemo(() => {
    if (!selectedStudents.length) return null;
    if (activeOverrideId != null) {
      const found = selectedStudents.find((s) => s.id === activeOverrideId);
      if (found) return found;
    }
    return selectedStudents[0];
  }, [selectedStudents, activeOverrideId]);
  const selectedCount = selectedStudents.length;

  const primaryBaseAmount = useMemo(() => {
    if (!primaryStudent) return 0;
    return defaultAmountForStudent(primaryStudent);
  }, [primaryStudent, defaultAmountForStudent]);

  const primaryExtrasTotal = useMemo(() => {
    if (!form.extraEnabled) return 0;
    const material = form.materialFee ?? 0;
    const textbook = form.textbookFee ?? 0;
    return material + textbook;
  }, [form.extraEnabled, form.materialFee, form.textbookFee]);

  const primaryOriginalAmount = useMemo(
    () => primaryBaseAmount + primaryExtrasTotal,
    [primaryBaseAmount, primaryExtrasTotal],
  );

  const primaryFinalAmount = useMemo(() => {
    if (primaryOriginalAmount <= 0) return 0;
    if (!form.discountEnabled || !form.discountType || !form.discountValue) {
      return primaryOriginalAmount;
    }
    if (form.discountType === "AMOUNT") {
      const discounted = primaryOriginalAmount - form.discountValue;
      return discounted > 0 ? discounted : 0;
    }
    const percent = form.discountValue / 100;
    const discounted = primaryOriginalAmount - primaryOriginalAmount * percent;
    return discounted > 0 ? Math.round(discounted) : 0;
  }, [primaryOriginalAmount, form.discountEnabled, form.discountType, form.discountValue]);

  const primaryRecipientPhone = useMemo(() => {
    if (!primaryStudent) return "";
    const raw =
      (primaryStudent.guardianPhone && primaryStudent.guardianPhone.trim()) ||
      "";
    const digits = raw.replace(/[^0-9]/g, "");
    return digits || raw || "";
  }, [primaryStudent]);

  const primaryCourseTitles = useMemo(() => {
    if (!primaryStudent) return "-";
    return (
      primaryStudent.courses
        ?.map((c) => c?.title ?? null)
        .filter((t): t is string => Boolean(t && t.trim()))
        .join(", ") ?? "-"
    );
  }, [primaryStudent]);

  useEffect(() => {
    setForm((prev) => ({ ...prev, recipientPhone: primaryRecipientPhone }));
  }, [primaryRecipientPhone]);

  useEffect(() => {
    if (!selectedIds.length) {
      setActiveOverrideId(null);
      return;
    }
    setActiveOverrideId((prev) => {
      if (prev != null && selectedIds.includes(prev)) return prev;
      return selectedIds[0] ?? null;
    });
  }, [selectedIds]);

  const activeOverrideStudent = useMemo(
    () => selectedStudents.find((s) => s.id === activeOverrideId) ?? null,
    [selectedStudents, activeOverrideId],
  );

  const activeOverride = activeOverrideStudent ? overrides[activeOverrideStudent.id] : undefined;

  const patchOverride = (studentId: number, patch: Partial<StudentOverride>) => {
    setOverrides((prev) => {
      const current = prev[studentId] ?? {};
      const next: StudentOverride = { ...current, ...patch };
      return { ...prev, [studentId]: next };
    });
  };

  const resetOverride = (studentId: number) => {
    setOverrides((prev) => {
      if (!prev[studentId]) return prev;
      const next = { ...prev };
      delete next[studentId];
      return next;
    });
  };

  const totalPagesRaw = Math.ceil(filteredStudents.length / pageSize);
  const totalPages = totalPagesRaw > 0 ? totalPagesRaw : 1;

  return (
    <Page>
      <PageHeader>
        <div>
          <h2>청구서 생성</h2>
          <p>현재 수업에 등록된 학생 중 청구서를 생성할 대상을 선택하세요.</p>
        </div>
        <GhostButton type="button" onClick={() => navigate(routes.payments)}>
          돌아가기
        </GhostButton>
      </PageHeader>

      <CreateLayout>
        <LeftColumn>
          <SectionCard>
            <RightHeader>
              <div>
                <h3>학생 목록</h3>
                <SmallText>이름 / 수강 수업 / 청구 금액을 확인하고 선택하세요.</SmallText>
              </div>
              <GhostButton type="button" onClick={handleSelectAll} disabled={!filteredStudents.length}>
                전체 선택/해제
              </GhostButton>
            </RightHeader>
            <label>
              학생 검색
              <Input
                type="text"
                placeholder="이름 검색"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </label>
            <TableWrapper>
              <StyledTable>
                <colgroup>
                  <col style={{ width: "48px" }} />
                  <col style={{ width: "26%" }} />
                  <col style={{ width: "32%" }} />
                  <col style={{ width: "20%" }} />
                  <col />
                </colgroup>
                <thead>
                  <tr>
                    <th />
                    <th>이름</th>
                    <th>수강 수업</th>
                    <th>청구 금액</th>
                    <th>작업</th>
                  </tr>
                </thead>
                <tbody>
                  {studentsQuery.isLoading ? (
                    <tr>
                      <td colSpan={5}>
                        <Skeleton h={36} />
                      </td>
                    </tr>
                  ) : pagedStudents.length === 0 ? (
                    <tr>
                      <td colSpan={5}>
                        <EmptyState>조건에 맞는 학생이 없습니다.</EmptyState>
                      </td>
                    </tr>
                  ) : (
                    pagedStudents.map((student: Student) => {
                      const courseTitles =
                        student.courses
                          ?.map((course: NonNullable<Student["courses"]>[number]) => course?.title ?? null)
                          .filter((title: string | null): title is string => Boolean(title && title.trim()))
                          .join(", ") ?? "-";
                      const fee = defaultAmountForStudent(student);
                      const selected = selectedIds.includes(student.id);
                      const canEdit = selected && selectedIds.length >= 2;
                      const overrideApplied = Boolean(overrides[student.id]);
                      const showIcon = canEdit || overrideApplied;
                      return (
                        <tr key={student.id} data-selected={selected}>
                          <td>
                            <Checkbox
                              type="checkbox"
                              checked={selected}
                              onChange={() => handleToggleSelect(student.id)}
                            />
                          </td>
                          <td>
                            <strong>{student.name}</strong>
                            <Meta>{student.code}</Meta>
                          </td>
                          <td>{courseTitles || "-"}</td>
                          <td className="amount-cell">{formatMoney(fee)}</td>
                          <td>
                            {showIcon ? (
                              <BadgeButton
                                type="button"
                                onClick={() => {
                                  if (!canEdit) return;
                                  setActiveOverrideId(student.id);
                                }}
                                $active={overrideApplied}
                                disabled={!canEdit}
                              >
                                {overrideApplied ? "개별 설정됨" : "개별 설정"}
                              </BadgeButton>
                            ) : (
                              "-"
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </StyledTable>
            </TableWrapper>
            <PagerBar>
              <GhostButton
                type="button"
                onClick={() => setStudentPage((prev) => Math.max(0, prev - 1))}
                disabled={studentPage <= 0}
              >
                이전
              </GhostButton>
              <span>
                {Math.min(studentPage + 1, totalPages)} / {totalPages}
              </span>
              <GhostButton
                type="button"
                onClick={() => setStudentPage((prev) => Math.min(totalPages - 1, prev + 1))}
                disabled={studentPage >= totalPages - 1}
              >
                다음
              </GhostButton>
            </PagerBar>
          </SectionCard>
        </LeftColumn>

        <RightColumn>
          <ReceiptCard>
            <ReceiptHeader>
              <h3>청구서 설정</h3>
              <p>선택된 학생에게 적용될 내용입니다.</p>
            </ReceiptHeader>
            
            {!selectedIds.length ? (
              <EmptyReceipt>
                <div className="icon">🧾</div>
                <p>왼쪽 목록에서<br/>청구서를 보낼 학생을<br/>선택해주세요.</p>
              </EmptyReceipt>
            ) : (
              <>
                {primaryStudent && (
                  <RepresentativeCard>
                    <div className="row">
                      <div className="label">학생 이름</div>
                      <div className="value">{primaryStudent.name}</div>
                    </div>
                    <div className="row">
                      <div className="label">수강 수업</div>
                      <div className="value">{primaryCourseTitles}</div>
                    </div>
                    <div className="row">
                      <div className="label">발신 번호</div>
                      <div className="input-wrap">
                        <Input
                          value={formatPhoneKR(form.recipientPhone)}
                          placeholder="예: 010-1234-5678"
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              recipientPhone: (e.target.value || "").replace(/[^0-9]/g, ""),
                            }))
                          }
                          style={{ textAlign: "right", padding: "6px 10px" }}
                        />
                      </div>
                    </div>
                  </RepresentativeCard>
                )}

                <ReceiptSection>
                  <SectionTitle>결제 정보</SectionTitle>
                  <FormGrid>
                    <label>
                      결제 예정일
                      <Input
                        type="date"
                        value={form.dueDate}
                        onChange={(event) => handleDueDateChange(event.target.value)}
                      />
                    </label>
                    <label>
                      결제 주기
                      <SelectLike
                        value={String(form.cycleValue ?? 1)}
                        onChange={(event) => handleCycleValueChange(event.target.value)}
                      >
                        <option value="1">1개월</option>
                        <option value="2">2개월</option>
                        <option value="3">3개월</option>
                        <option value="6">6개월</option>
                        <option value="12">12개월</option>
                      </SelectLike>
                    </label>
                  </FormGrid>
                </ReceiptSection>

                <ReceiptSection>
                  <SectionTitle>
                    청구 기간
                    {form.cycleValue > 0 && <Badge>{form.cycleValue}개월간</Badge>}
                  </SectionTitle>
                  <PeriodRow>
                    <PeriodValue>
                      <span>시작일</span>
                      <strong>{form.periodStart || "-"}</strong>
                    </PeriodValue>
                    <span className="arrow">→</span>
                    <PeriodValue>
                      <span>종료일</span>
                      <strong>{form.periodEnd || "-"}</strong>
                    </PeriodValue>
                  </PeriodRow>
                </ReceiptSection>

                <ReceiptSection>
                  <SectionTitle>금액 상세</SectionTitle>

                  <AccordionCard>
                    <AccordionHeader>
                      <span>할인 설정</span>
                      <div>
                        <ToggleSwitch>
                          <input
                            type="checkbox"
                            checked={form.discountEnabled}
                            onChange={(e) => {
                              const next = e.target.checked;
                              setForm((prev) => ({ ...prev, discountEnabled: next }));
                              if (next) {
                                setDiscountOpen(true);
                              } else {
                                setDiscountOpen(false);
                              }
                            }}
                          />
                          <div className="switch" />
                        </ToggleSwitch>
                      </div>
                    </AccordionHeader>
                    {discountOpen && (
                      <AccordionBody>
                        <DiscountFields
                          enabled={Boolean(form.discountEnabled)}
                          discountType={form.discountType ?? undefined}
                          discountValue={form.discountValue}
                          startDate={form.discountStartDate}
                          endDate={form.discountEndDate}
                          onToggleEnabled={(next) => {
                            setForm((prev) => ({ ...prev, discountEnabled: next }));
                          }}
                          onChangeType={(next) => setForm((prev) => ({ ...prev, discountType: next }))}
                          onChangeValue={(value) =>
                            setForm((prev) => ({
                              ...prev,
                              discountValue: typeof value === "number" ? value : undefined,
                            }))
                          }
                          onChangeStartDate={(value) =>
                            setForm((prev) => ({ ...prev, discountStartDate: value }))
                          }
                          onChangeEndDate={(value) =>
                            setForm((prev) => ({ ...prev, discountEndDate: value }))
                          }
                          showPeriod
                        />
                      </AccordionBody>
                    )}
                  </AccordionCard>

                  <AccordionCard>
                    <AccordionHeader>
                      <span>추가 금액 설정</span>
                      <div>
                        <ToggleSwitch>
                          <input
                            type="checkbox"
                            checked={form.extraEnabled}
                            onChange={(e) => {
                              const next = e.target.checked;
                              setForm((prev) => ({ ...prev, extraEnabled: next }));
                              if (next) {
                                setExtraOpen(true);
                              } else {
                                setExtraOpen(false);
                              }
                            }}
                          />
                          <div className="switch" />
                        </ToggleSwitch>
                      </div>
                    </AccordionHeader>
                    {extraOpen && (
                      <AccordionBody>
                        <AdditionalChargeFields
                          enabled={Boolean(form.extraEnabled)}
                          materialFee={form.materialFee}
                          textbookFee={form.textbookFee}
                          startDate={form.extraStartDate}
                          endDate={form.extraEndDate}
                          onToggleEnabled={(next) => {
                            setForm((prev) => ({ ...prev, extraEnabled: next }));
                          }}
                          onChangeMaterialFee={(value) =>
                            setForm((prev) => ({
                              ...prev,
                              materialFee: typeof value === "number" ? value : undefined,
                            }))
                          }
                          onChangeTextbookFee={(value) =>
                            setForm((prev) => ({
                              ...prev,
                              textbookFee: typeof value === "number" ? value : undefined,
                            }))
                          }
                          onChangeStartDate={(value) =>
                            setForm((prev) => ({ ...prev, extraStartDate: value }))
                          }
                          onChangeEndDate={(value) =>
                            setForm((prev) => ({ ...prev, extraEndDate: value }))
                          }
                        />
                      </AccordionBody>
                    )}
                  </AccordionCard>
                </ReceiptSection>

                <ReceiptSection>
                  <SectionTitle>메모</SectionTitle>
                  <Textarea
                    placeholder="청구서에 표시될 메모를 입력하세요."
                    value={form.memo}
                    onChange={(event) => {
                      const nextValue = event.target.value;
                      setForm((prev) => ({ ...prev, memo: nextValue, managerMemo: nextValue }));
                    }}
                  />
                </ReceiptSection>

                <TotalAmountSection>
                  <div className="label">최종 청구 금액</div>
                  <div className="amount">{formatMoney(primaryFinalAmount)}</div>
                  <div className="desc">할인 및 추가 금액이 포함된 금액입니다.</div>
                </TotalAmountSection>

                <PrimaryButtonLg
                  type="button"
                  disabled={!selectedIds.length || createMutation.isPending}
                  onClick={() => createMutation.mutate()}
                  style={{ width: "100%", marginTop: "16px" }}
                >
                  {selectedIds.length ? `${selectedIds.length}명 청구서 생성하기` : "학생을 선택하세요"}
                </PrimaryButtonLg>
              </>
            )}
          </ReceiptCard>
        </RightColumn>
      </CreateLayout>
    </Page>
  );
}

// Per-student override editor는 제거되었습니다. 현재는 선택된 학생들에게 동일한 청구서 설정을 적용합니다.

const CreateLayout = styled.div`
  display: flex;
  gap: 24px;
  align-items: flex-start;
  @media (max-width: 1024px) {
    flex-direction: column;
  }
`;

const LeftColumn = styled.div`
  flex: 1;
  min-width: 0;
`;

const RightColumn = styled.div`
  width: 800px;
  flex-shrink: 0;
  position: sticky;
  top: 24px;
  
  @media (max-width: 1440px) {
    width: 600px;
  }

  @media (max-width: 1280px) {
    width: 480px;
  }
  
  @media (max-width: 1024px) {
    width: 100%;
    position: static;
  }
`;

const ReceiptCard = styled(SectionCard)`
  border: 1px solid ${(p) => p.theme.colors.border};
  box-shadow: ${(p) => p.theme.shadow.medium};
  padding: 0;
  overflow: hidden;
  background: #fff;
`;

const ReceiptHeader = styled.div`
  background: ${(p) => p.theme.colors.surfaceAlt};
  padding: 20px 24px;
  border-bottom: 1px dashed ${(p) => p.theme.colors.border};
  h3 {
    margin: 0 0 4px;
    font-size: 18px;
    font-weight: 700;
  }
  p {
    margin: 0;
    font-size: 13px;
    color: ${(p) => p.theme.colors.textMuted};
  }
`;

const ReceiptSection = styled.div`
  padding: 20px 24px;
  border-bottom: 1px solid ${(p) => p.theme.colors.borderMuted};
`;

const SectionTitle = styled.h4`
  margin: 0 0 12px;
  font-size: 14px;
  font-weight: 600;
  color: ${(p) => p.theme.colors.text};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Badge = styled.span`
  display: inline-block;
  padding: 2px 8px;
  border-radius: 999px;
  background: ${(p) => p.theme.colors.primarySurface};
  color: ${(p) => p.theme.colors.primary};
  font-size: 11px;
  font-weight: 600;
`;

const RepresentativeCard = styled.div`
  margin: 20px 24px 0;
  padding: 16px;
  background: ${(p) => p.theme.colors.surfaceAlt};
  border-radius: 8px;
  display: grid;
  gap: 12px;

  .row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }
  .label {
    font-size: 13px;
    font-weight: 600;
    color: ${(p) => p.theme.colors.textMuted};
    flex-shrink: 0;
  }
  .value {
    font-size: 14px;
    color: ${(p) => p.theme.colors.text};
    text-align: right;
    font-weight: 500;
  }
  .input-wrap {
    width: 160px;
  }
`;

const PeriodRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  .arrow {
    color: ${(p) => p.theme.colors.textMuted};
    font-size: 14px;
  }
`;

const PeriodValue = styled.div`
  flex: 1;
  display: grid;
  gap: 4px;
  span {
    font-size: 12px;
    color: ${(p) => p.theme.colors.textMuted};
  }
  strong {
    font-size: 14px;
    font-weight: 600;
    color: ${(p) => p.theme.colors.text};
  }
`;

const TotalAmountSection = styled.div`
  padding: 24px;
  background: ${(p) => p.theme.colors.primarySurface};
  text-align: center;
  .label {
    font-size: 13px;
    font-weight: 600;
    color: ${(p) => p.theme.colors.primary};
    margin-bottom: 4px;
  }
  .amount {
    font-size: 32px;
    font-weight: 800;
    color: ${(p) => p.theme.colors.primary};
    letter-spacing: -0.5px;
    margin-bottom: 8px;
  }
  .desc {
    font-size: 12px;
    color: ${(p) => p.theme.colors.textMuted};
    opacity: 0.8;
  }
`;

const AccordionCard = styled.div`
  margin: 12px 0 8px;
  padding: 0;
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.radii.md};
  background: ${(p) => p.theme.colors.surfaceAlt ?? "#f9fafb"};
`;

const AccordionHeader = styled.div`
  width: 100%;
  padding: 10px 12px;
  border: none;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: default;
  span {
    font-size: 13px;
    color: ${(p) => p.theme.colors.text};
    font-weight: 600;
  }
`;

const AccordionBody = styled.div`
  border-top: 1px solid ${(p) => p.theme.colors.borderMuted};
  padding: 12px;
`;

const EmptyReceipt = styled.div`
  padding: 60px 24px;
  text-align: center;
  color: ${(p) => p.theme.colors.textMuted};
  .icon {
    font-size: 48px;
    margin-bottom: 16px;
    opacity: 0.5;
  }
  p {
    margin: 0;
    line-height: 1.5;
    font-size: 14px;
  }
`;

const BadgeButton = styled.button<{ $active?: boolean }>`
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid ${(p) => (p.$active ? p.theme.colors.primary : p.theme.colors.border)};
  background: ${(p) => (p.$active ? p.theme.colors.primarySurface : "transparent")};
  color: ${(p) => (p.$active ? p.theme.colors.primary : p.theme.colors.textMuted)};
  transition: all 0.2s;
  
  &:hover:not(:disabled) {
    border-color: ${(p) => p.theme.colors.primary};
    color: ${(p) => p.theme.colors.primary};
  }
`;

const LeftHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 16px;
`;

const RightHeader = styled(LeftHeader)``;

const SmallText = styled.p`
  margin: 0;
  font-size: 13px;
  color: ${(p) => p.theme.colors.textMuted};
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 12px;
  margin-bottom: 12px;
  label {
    display: grid;
    gap: 6px;
    font-size: 13px;
    color: ${(p) => p.theme.colors.textMuted};
    text-align: left;
  }
`;

const SelectLike = styled.select`
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 10px;
  padding: 8px 12px;
  font-size: 14px;
  width: 100%;
  box-sizing: border-box;
  background: #fff;
`;

const ModalGrid = styled(FormGrid)`
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
`;

const PeriodText = styled.div`
  font-size: 13px;
  color: ${(p) => p.theme.colors.text};
  display: grid;
  gap: 4px;
  margin-bottom: 8px;
  font-weight: 600;
`;

const PeriodGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
  margin-bottom: 12px;
  label {
    display: grid;
    gap: 6px;
    font-size: 13px;
    color: ${(p) => p.theme.colors.textMuted};
    text-align: left;
  }
`;

const SmallHint = styled.span`
  font-size: 12px;
  color: ${(p) => p.theme.colors.textMuted};
`;

const DiscountBox = styled.div`
  margin: 12px 0 16px;
  padding: 16px;
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.radii.md};
  background: ${(p) => p.theme.colors.surfaceAlt ?? "#f9fafb"};
`;

const Input = styled.input`
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 10px;
  padding: 8px 12px;
  font-size: 14px;
  width: 100%;
  box-sizing: border-box;
`;

const Textarea = styled.textarea`
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 10px;
  padding: 8px 12px;
  font-size: 14px;
  width: 100%;
  box-sizing: border-box;
  min-height: 96px;
`;

const Checkbox = styled.input`
  width: 16px;
  height: 16px;
`;

const TableWrapper = styled.div`
  margin-top: 12px;
  overflow-x: auto;
`;

const PagerBar = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 12px;
  align-items: center;
  span {
    font-size: 13px;
    color: ${(p) => p.theme.colors.textMuted};
  }
`;

const StyledTable = styled(TableBase)`
  tbody td {
    vertical-align: middle;
    text-align: center;
  }
  tbody td.amount-cell {
    text-align: right;
    font-variant-numeric: tabular-nums;
  }
  tbody td:nth-child(2) {
    text-align: center;
  }
  tbody td:nth-child(3) {
    text-align: center;
  }
  tbody td:nth-child(4) {
    text-align: center;
  }
  thead th {
    text-align: center;
  }
  thead th:first-child,
  tbody td:first-child {
    width: 48px;
  }
`;

const IconButton = styled.button<{ $active?: boolean }>`
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
  padding: 4px;
  color: ${(p) => (p.$active ? p.theme.colors.success : p.theme.colors.primary)};
  opacity: ${(p) => (p.disabled ? 0.6 : 1)};
`;

const Meta = styled.span`
  display: block;
  font-size: 12px;
  color: ${(p) => p.theme.colors.textMuted};
`;

const InfoList = styled.ul`
  list-style: none;
  margin: 0 0 12px;
  padding: 8px 10px;
  border-radius: ${(p) => p.theme.radii.md};
  background: ${(p) => p.theme.colors.surfaceAlt ?? "#f9fafb"};
  display: grid;
  gap: 4px;
  li {
    display: flex;
    justify-content: space-between;
    font-size: 13px;
    span {
      color: ${(p) => p.theme.colors.textMuted};
    }
    strong {
      font-weight: 600;
      color: ${(p) => p.theme.colors.text};
    }
  }
`;

const SummaryAmountCard = styled.div`
  margin: 0 0 16px;
  padding: 10px 12px;
  border-radius: ${(p) => p.theme.radii.md};
  background: ${(p) => p.theme.colors.primarySurface ?? "#eef2ff"};
  border: 1px solid ${(p) => p.theme.colors.primary ?? "#4f46e5"};
  display: grid;
  gap: 4px;
  .label {
    font-size: 12px;
    color: ${(p) => p.theme.colors.primary ?? "#4f46e5"};
    font-weight: 600;
  }
  .value {
    font-size: 20px;
    font-weight: 700;
    color: ${(p) => p.theme.colors.text};
  }
  .hint {
    font-size: 12px;
    color: ${(p) => p.theme.colors.textMuted};
  }
`;
