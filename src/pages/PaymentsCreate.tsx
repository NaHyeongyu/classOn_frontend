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
  createPaymentTemplateInvoice,
  type PaymentInvoicePayload,
  type PaymentAdditionalItemPayload,
  listPaymentTemplates,
  type PaymentTemplateSetup,
} from "@/api/payments";
import { listStudents, type Student } from "@/api/students";
import type {
  DiscountType,
  BillingCycleUnit,
  StudentStatus,
} from "@classon/shared-types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { routes } from "@/routes";
import { formatMoney } from "@/lib/format";
import { formatPhoneKR } from "@/lib/paymentUiLabels";
import { invalidatePaymentsQueries } from "@/lib/paymentsCache";
import Pagination from "@/components/common/Pagination";

const today = new Date();
const toLocalISODate = (date: Date) => {
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60000);
  return local.toISOString().slice(0, 10);
};
const nextMonthBase = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
const dateISO = (date: Date) => toLocalISODate(date);
const nextMonth = nextMonthBase;

function clampDueDay(raw: unknown): number {
  const value = typeof raw === "number" ? raw : Number(raw);
  if (!Number.isFinite(value)) return 1;
  return Math.min(28, Math.max(1, Math.round(value)));
}

function computeNextDueDateFromDay(dueDay: number, base: Date): string {
  const day = clampDueDay(dueDay);
  const year = base.getFullYear();
  const month = base.getMonth(); // 0-based
  const baseDay = base.getDate();
  const target = baseDay > day ? new Date(year, month + 1, day) : new Date(year, month, day);
  return dateISO(target);
}

const defaultForm = {
  dueDay: clampDueDay(today.getDate()),
  dueDate: computeNextDueDateFromDay(clampDueDay(today.getDate()), today),
  discountStartDate: dateISO(today),
  discountEndDate: dateISO(nextMonth),
  discountEnabled: false,
  discountType: "AMOUNT" as DiscountType,
  discountValue: undefined as number | undefined,
  memo: "",
  managerMemo: undefined as string | undefined,
  cycleValue: 1,
  cycleUnit: "MONTHS" as BillingCycleUnit,
  autoGenerate: true,
  extraEnabled: false,
  materialFee: undefined as number | undefined,
  textbookFee: undefined as number | undefined,
  extraStartDate: dateISO(today),
  extraEndDate: dateISO(nextMonth),
};

const studentStatusLabels: Record<StudentStatus | "UNKNOWN" | undefined, string> = {
  ENROLLED: "수강중",
  ON_LEAVE: "휴학",
  PENDING: "대기중",
  STOPPED: "퇴원",
  UNKNOWN: "미지정",
  undefined: "미지정",
};

const studentStatusColor: Record<string, string> = {
  ENROLLED: "#059669",
  ON_LEAVE: "#8b5cf6",
  PENDING: "#f97316",
  STOPPED: "#dc2626",
};

function resolveStudentStatus(status?: StudentStatus | "UNKNOWN"): string {
  return studentStatusLabels[status ?? "UNKNOWN"] ?? studentStatusLabels.UNKNOWN;
}

function normalizeCycle(value: string | number | undefined): number {
  const num = typeof value === "string" ? Number(value) : value;
  if (!Number.isFinite(num) || (num ?? 0) <= 0) return 1;
  return Math.max(1, Math.round(Number(num)));
}

export default function PaymentsCreate() {
  const navigate = useNavigate();
  const { success, error: toastError } = useToast();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [studentPage, setStudentPage] = useState(0);
  const pageSize = 10;
  const [form, setForm] = useState(defaultForm);
  const [discountOpen, setDiscountOpen] = useState(false);
  const [extraOpen, setExtraOpen] = useState(false);
  const handleDueDayChange = (raw: string) => {
    const nextDay = clampDueDay(raw);
    const nextDueDate = computeNextDueDateFromDay(nextDay, new Date());
    setForm((prev) => ({
      ...prev,
      dueDay: nextDay,
      dueDate: nextDueDate,
    }));
  };
  const handleCycleOptionChange = (raw: string) => {
    const [unitToken, valueToken] = raw.split(":");
    const nextUnit: BillingCycleUnit =
      unitToken === "D" ? "DAYS" : unitToken === "W" ? "WEEKS" : "MONTHS";
    const nextValue = normalizeCycle(valueToken);
    setForm((prev) => ({
      ...prev,
      cycleValue: nextValue,
      cycleUnit: nextUnit,
    }));
  };

  const studentsQuery = useQuery({
    queryKey: ["payments-create", "students"],
    queryFn: () => listStudents({ size: 200 }),
    staleTime: 0,
    refetchOnMount: "always",
  });

  const templatesQuery = useQuery<PaymentTemplateSetup[]>({
    queryKey: ["payments-create", "templates"],
    queryFn: () => listPaymentTemplates(),
    staleTime: 0,
    refetchOnMount: "always",
  });

  const students = useMemo(() => studentsQuery.data?.content ?? [], [studentsQuery.data]);
  const templateStudentIds = useMemo(() => {
    const rows = templatesQuery.data ?? [];
    return new Set(rows.map((t: PaymentTemplateSetup) => t.studentId));
  }, [templatesQuery.data]);

  const eligibleStudents: Student[] = useMemo(
    () =>
      students.filter(
        (student: Student) =>
          typeof student.id === "number" &&
          Array.isArray(student.courses) &&
          student.courses.some((course) => Boolean(course)),
      ),
    [students],
  );

  const studentsWithoutTemplates: Student[] = useMemo(
    () => eligibleStudents.filter((student: Student) => !templateStudentIds.has(student.id)),
    [eligibleStudents, templateStudentIds],
  );

  const excludedTemplatesCount = useMemo(
    () => eligibleStudents.length - studentsWithoutTemplates.length,
    [eligibleStudents.length, studentsWithoutTemplates.length],
  );

  const filteredStudents: Student[] = useMemo(() => {
    if (!search.trim()) return studentsWithoutTemplates;
    const keyword = search.trim().toLowerCase();
    return studentsWithoutTemplates.filter((student: Student) => student.name?.toLowerCase().includes(keyword));
  }, [studentsWithoutTemplates, search]);

  useEffect(() => {
    if (templatesQuery.isLoading || templatesQuery.isError) return;
    setSelectedIds((prev) => prev.filter((id) => !templateStudentIds.has(id)));
  }, [templateStudentIds, templatesQuery.isError, templatesQuery.isLoading]);

  useEffect(() => {
    setStudentPage(0);
  }, [search]);

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
      return next;
    });
  };

  const filteredStudentIds = useMemo(
    () => filteredStudents.map((student: Student) => student.id),
    [filteredStudents],
  );
  const allFilteredSelected = filteredStudentIds.length > 0 && filteredStudentIds.every((id) => selectedIds.includes(id));

  const handleSelectAll = () => {
    if (!filteredStudentIds.length) return;
    const filteredSet = new Set(filteredStudentIds);
    if (allFilteredSelected) {
      setSelectedIds((prev) => prev.filter((id) => !filteredSet.has(id)));
      return;
    }
    setSelectedIds((prev) => Array.from(new Set([...prev, ...filteredStudentIds])));
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

  const buildPayload = (student: Student): PaymentInvoicePayload => {
    const discountEnabled = form.discountEnabled;
    const discountType = form.discountType;
    const discountValue = form.discountValue;
    const memoValue = form.memo;
    const extraEnabled = form.extraEnabled;
    const materialFee = extraEnabled ? form.materialFee ?? 0 : 0;
    const textbookFee = extraEnabled ? form.textbookFee ?? 0 : 0;
    const baseAmount = defaultAmountForStudent(student);

    const additionalItems: PaymentAdditionalItemPayload[] = [];
    if (extraEnabled) {
      if (materialFee > 0) {
        additionalItems.push({
          type: "MATERIAL",
          label: "재료비",
          quantity: 1,
          unitPrice: materialFee,
          appliedStart: form.extraStartDate,
          appliedEnd: form.extraEndDate,
        });
      }
      if (textbookFee > 0) {
        additionalItems.push({
          type: "TEXTBOOK",
          label: "교재비",
          quantity: 1,
          unitPrice: textbookFee,
          appliedStart: form.extraStartDate,
          appliedEnd: form.extraEndDate,
        });
      }
    }

    return {
      studentId: student.id,
      dueDate: form.dueDate,
      amount: baseAmount,
      discountType: discountEnabled ? discountType : undefined,
      discountValue: discountEnabled ? discountValue : undefined,
      memo: memoValue,
      autoGenerate: form.autoGenerate,
      cycleUnit: form.cycleUnit,
      cycleValue: form.cycleValue,
      discountEnabled,
      discountStartDate: discountEnabled
        ? form.discountStartDate
        : undefined,
      discountEndDate: discountEnabled
        ? form.discountEndDate
        : undefined,
      additionalItems: additionalItems.length ? additionalItems : undefined,
    };
  };

  const createMutation = useMutation({
    mutationFn: async () => {
      if (templatesQuery.isLoading) {
        throw new Error("템플릿 목록을 불러오는 중입니다. 잠시 후 다시 시도해 주세요.");
      }
      if (templatesQuery.isError) {
        throw new Error("템플릿 목록을 불러오지 못했습니다. 새로고침 후 다시 시도해 주세요.");
      }
      if (!selectedIds.length) {
        throw new Error("학생을 선택해 주세요.");
      }
      const selectedStudents = selectedIds
        .map((id) => students.find((student: Student) => student.id === id))
        .filter((student): student is Student => Boolean(student));
      if (!selectedStudents.length) {
        throw new Error("선택한 학생 정보를 찾을 수 없습니다.");
      }
      const existingTemplateStudents = selectedStudents.filter((student) => templateStudentIds.has(student.id));
      if (existingTemplateStudents.length) {
        throw new Error(
          "이미 템플릿이 있는 학생이 포함되어 있어 저장할 수 없습니다.\n템플릿 수정은 결제 관리 > 템플릿 관리 또는 원생 상세 > 청구서 템플릿에서 해주세요.",
        );
      }
      // 간단한 클라이언트 측 검증: 보호자 연락처/금액 0원인 대상은 생성 시도 전에 막습니다.
      const invalidContacts = selectedStudents.filter((student) => {
        const rawGuardian = (student.guardianPhone ?? "").trim();
        return !rawGuardian;
      });
      if (invalidContacts.length) {
        throw new Error(
          "보호자 연락처가 없는 학생이 포함되어 있어 템플릿을 저장할 수 없습니다.\n학생 정보에서 학부모 전화번호를 먼저 등록해 주세요.",
        );
      }
      await Promise.all(
        selectedStudents.map((student: Student) => {
          const payload = buildPayload(student);
          const baseAmount = typeof payload.amount === "number" ? payload.amount : 0;
          const discountedBase =
            payload.discountType === "AMOUNT" && typeof payload.discountValue === "number"
              ? Math.max(0, baseAmount - payload.discountValue)
              : payload.discountType === "PERCENT" && typeof payload.discountValue === "number"
                ? Math.max(0, Math.round(baseAmount - baseAmount * (payload.discountValue / 100)))
                : baseAmount;
          const extrasTotal = (payload.additionalItems ?? []).reduce((acc, item) => {
            const qty = typeof item.quantity === "number" ? item.quantity : 1;
            const unit = typeof item.unitPrice === "number" ? item.unitPrice : 0;
            return acc + qty * unit;
          }, 0);
          const total = discountedBase + extrasTotal;
          if (total <= 0) {
            throw new Error(
              "청구 금액이 0원인 학생이 포함되어 있어 템플릿을 저장할 수 없습니다.\n수업 수강료나 추가 금액을 확인해 주세요.",
            );
          }
          return createPaymentTemplateInvoice(payload);
        }),
      );
    },
    onSuccess: () => {
      success("청구서 템플릿을 저장했습니다. 결제일에 결제건이 자동 생성됩니다.");
      invalidatePaymentsQueries(queryClient);
      queryClient.invalidateQueries({ queryKey: ["payments", "templates"] }).catch(() => {});
      queryClient.invalidateQueries({ queryKey: ["payments-create", "templates"] }).catch(() => {});
      queryClient.invalidateQueries({ queryKey: ["payments-create", "students"] }).catch(() => {});
      setSelectedIds([]);
    },
    onError: (err: unknown) => {
      toastError(err instanceof Error ? err.message : "청구서 템플릿 저장에 실패했습니다.");
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

  const primaryStudent: Student | null = useMemo(() => (selectedStudents.length ? selectedStudents[0] : null), [selectedStudents]);
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

  const primaryOriginalAmount = useMemo(() => primaryBaseAmount, [primaryBaseAmount]);

  const primaryFinalAmount = useMemo(() => {
    const base = Math.max(0, Math.round(primaryOriginalAmount ?? 0));
    if (base <= 0 && primaryExtrasTotal <= 0) return 0;
    if (!form.discountEnabled || !form.discountType || !form.discountValue) {
      return base + primaryExtrasTotal;
    }
    if (form.discountType === "AMOUNT") {
      const discounted = base - form.discountValue;
      return (discounted > 0 ? discounted : 0) + primaryExtrasTotal;
    }
    const percent = form.discountValue / 100;
    const discounted = base - base * percent;
    return (discounted > 0 ? Math.round(discounted) : 0) + primaryExtrasTotal;
  }, [primaryOriginalAmount, primaryExtrasTotal, form.discountEnabled, form.discountType, form.discountValue]);

  const primaryCourseTitles = useMemo(() => {
    if (!primaryStudent) return "-";
    return (
      primaryStudent.courses
        ?.map((c) => c?.title ?? null)
        .filter((t): t is string => Boolean(t && t.trim()))
        .join(", ") ?? "-"
    );
  }, [primaryStudent]);

  const totalPagesRaw = Math.ceil(filteredStudents.length / pageSize);
  const totalPages = totalPagesRaw > 0 ? totalPagesRaw : 1;
  return (
    <Page>
      <PageHeader>
        <div>
          <h2>청구서 생성</h2>
          <p>학생별 청구서 템플릿을 저장하면 결제일에 결제건이 자동으로 생성됩니다.</p>
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
                <SmallText>템플릿이 없는 학생만 표시됩니다.</SmallText>
              </div>
              <GhostButton
                type="button"
                onClick={handleSelectAll}
                disabled={!filteredStudents.length || studentsQuery.isLoading || templatesQuery.isLoading}
              >
                {allFilteredSelected ? "전체 해제" : "전체 선택"}
              </GhostButton>
            </RightHeader>
            <SearchLabel>
              학생 검색
              <Input
                type="text"
                placeholder="이름 검색"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </SearchLabel>
            <div style={{ margin: "-4px 0 12px" }}>
              <HintText>
                이미 템플릿이 있는 학생은 목록에서 제외됩니다
                {excludedTemplatesCount > 0 ? ` (숨김 ${excludedTemplatesCount}명)` : ""}.
              </HintText>
            </div>
            <TableWrapper>
              <StyledTable>
                <colgroup>
                  <col style={{ width: "48px" }} />
                  <col style={{ width: "18%" }} />
                  <col style={{ width: "34%" }} />
                  <col style={{ width: "14%" }} />
                  <col style={{ width: "22%" }} />
                </colgroup>
                <thead>
                  <tr>
                    <th />
                    <th>이름</th>
                    <th>수강 수업</th>
                    <th>상태</th>
                    <th>청구 금액</th>
                  </tr>
                </thead>
                <tbody>
                  {studentsQuery.isLoading || templatesQuery.isLoading ? (
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
                      const courseNameList =
                        (student.courses ?? [])
                          .map((course: NonNullable<Student["courses"]>[number]) => {
                            const title = course?.title?.trim();
                            const code = course?.code?.trim();
                            return title || code || null;
                          })
                          .filter((value: string | null): value is string => Boolean(value && value.trim()));
                      const courseTitles = courseNameList.length ? courseNameList.join(", ") : "-";
                      const fee = defaultAmountForStudent(student);
                      const selected = selectedIds.includes(student.id);
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
                          <td>
                            <StudentStatusBadge data-status={student.status ?? undefined}>
                              {resolveStudentStatus(student.status)}
                            </StudentStatusBadge>
                          </td>
                          <td className="amount-cell">{formatMoney(fee)}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </StyledTable>
            </TableWrapper>
            <Pagination page={studentPage} totalPages={totalPages} onChangePage={setStudentPage} />
          </SectionCard>
        </LeftColumn>

        <RightColumn>
          <ReceiptCard>
            <ReceiptHeader>
              <h3>템플릿 설정</h3>
              <p>선택된 학생에게 저장될 템플릿 내용입니다.</p>
            </ReceiptHeader>

            {!selectedIds.length ? (
              <EmptyReceipt>
                <div className="icon">🧾</div>
                <p>왼쪽 목록에서<br/>템플릿을 저장할 학생을<br/>선택해주세요.</p>
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
                      <div className="label">보호자 연락처</div>
                      <div className="value" style={{ fontWeight: 700 }}>
                        {formatPhoneKR(primaryStudent.guardianPhone ?? primaryStudent.phoneNumber ?? "") || "-"}
                      </div>
                    </div>
                  </RepresentativeCard>
                )}


                <ReceiptSection>
                  <SectionTitle>결제 정보</SectionTitle>
                  <FormGrid>
                    <label>
                      결제일 (매월 1~28일)
                      <SelectLike
                        value={String(form.dueDay ?? 1)}
                        onChange={(event) => handleDueDayChange(event.target.value)}
                      >
                        {Array.from({ length: 28 }, (_, idx) => idx + 1).map((d) => (
                          <option key={d} value={String(d)}>
                            매월 {d}일
                          </option>
                        ))}
                      </SelectLike>
                    </label>
                    <label>
                      결제 주기
                      <SelectLike
                        value={`${form.cycleUnit === "DAYS" ? "D" : form.cycleUnit === "WEEKS" ? "W" : "M"}:${form.cycleValue ?? 1}`}
                        onChange={(event) => handleCycleOptionChange(event.target.value)}
                      >
                        <option value="M:1">1개월</option>
                        <option value="M:2">2개월</option>
                        <option value="M:3">3개월</option>
                        <option value="M:6">6개월</option>
                        <option value="M:12">12개월</option>
                      </SelectLike>
                    </label>
                  </FormGrid>
                  <SmallText>청구 기간은 결제일/주기에 따라 결제건 생성 시 자동으로 적용됩니다.</SmallText>
                </ReceiptSection>

                <ReceiptSection>
                  <SectionTitle>추가 설정</SectionTitle>

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
                          showTitle={false}
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
                          showTitle={false}
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
                      setForm((prev) => ({ ...prev, memo: nextValue }));
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

const SearchLabel = styled.label`
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 13px;
  color: ${(p) => p.theme.colors.textMuted};
  margin-bottom: 12px;
`;

const HintText = styled.span`
  font-size: 12px;
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
  tbody td:nth-child(3),
  tbody td:nth-child(4),
  tbody td:nth-child(5) {
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

const Meta = styled.span`
  display: block;
  font-size: 12px;
  color: ${(p) => p.theme.colors.textMuted};
`;

const StudentStatusBadge = styled.span<{ "data-status"?: string }>`
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  background: ${({ "data-status": status }) =>
    (studentStatusColor[status ?? ""] ?? "#94a3b8")}1A;
  color: ${({ "data-status": status }) => studentStatusColor[status ?? ""] ?? "#475569"};
`;
