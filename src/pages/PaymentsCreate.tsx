import { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import {
  Page,
  SectionCard,
  PageHeader,
  PrimaryButton,
  GhostButton,
  TableBase,
  EmptyState,
  Skeleton,
} from "@/components/common/UI";
import Modal from "@/components/common/Modal";
import { useToast } from "@/components/common/Toast";
import { DiscountFields } from "@/components/payments/DiscountFields";
import { createPaymentInvoice, listPaymentInvoices, type PaymentInvoicePayload } from "@/api/payments";
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

export default function PaymentsCreate() {
  const navigate = useNavigate();
  const { success, error: toastError } = useToast();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [studentPage, setStudentPage] = useState(0);
  const pageSize = 10;
  const [overrides, setOverrides] = useState<Record<number, StudentOverride>>({});
  const [overrideTarget, setOverrideTarget] = useState<Student | null>(null);
  const [overrideOpen, setOverrideOpen] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const handleDueDateChange = (value: string) => {
    setForm((prev) => ({ ...prev, dueDate: value }));
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
    queryKey: ["payments-create", "open-invoices"],
    queryFn: async () => {
      const pageSize = 500;
      const [unpaid, pending] = await Promise.all([
        listPaymentInvoices({ status: "UNPAID", page: 0, size: pageSize }),
        listPaymentInvoices({ status: "PENDING", page: 0, size: pageSize }),
      ]);
      return [...(unpaid.content ?? []), ...(pending.content ?? [])];
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
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((value) => value !== id) : [...prev, id],
    );
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
    return {
      studentId: student.id,
      dueDate: override?.dueDate ?? form.dueDate,
      periodStart: override?.periodStart ?? form.periodStart,
      periodEnd: override?.periodEnd ?? form.periodEnd,
      amount: defaultAmountForStudent(student),
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
      await Promise.all(
        selectedStudents.map((student: Student) => {
          const override = overrides[student.id];
          const payload = buildPayload(student, override);
          return createPaymentInvoice(payload);
        }),
      );
    },
    onSuccess: () => {
      success("청구서를 생성했습니다.");
      invalidatePaymentsQueries(queryClient);
      queryClient.invalidateQueries({ queryKey: ["payments-create", "open-invoices"] }).catch(() => {});
      navigate(routes.payments);
    },
    onError: (err: unknown) => {
      toastError(err instanceof Error ? err.message : "청구서 생성에 실패했습니다.");
    },
  });

  const openOverrideModal = (student: Student) => {
    setOverrideTarget(student);
    setOverrideOpen(true);
  };

  const handleOverrideSave = (values: StudentOverride) => {
    if (!overrideTarget) return;
    setOverrides((prev) => ({
      ...prev,
      [overrideTarget.id]: values,
    }));
    setOverrideOpen(false);
  };

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

  const primaryStudent: Student | null = selectedStudents.length ? selectedStudents[0] : null;

  const primaryRecipientPhone = useMemo(() => {
    if (!primaryStudent) return "";
    const raw =
      (primaryStudent.guardianPhone && primaryStudent.guardianPhone.trim()) ||
      (primaryStudent.phoneNumber && primaryStudent.phoneNumber.trim()) ||
      "";
    const digits = raw.replace(/[^0-9]/g, "");
    return digits || raw || "";
  }, [primaryStudent]);

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
                      <tr key={student.id}>
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
                        <td>{formatMoney(fee)}</td>
                        <td>
                          {showIcon ? (
                            <IconButton
                              type="button"
                              onClick={() => canEdit && openOverrideModal(student)}
                              aria-label={overrideApplied ? "개별 설정 완료" : "개별 설정"}
                              $active={overrideApplied}
                              disabled={!canEdit}
                            >
                              {overrideApplied ? "✔️" : "✏️"}
                            </IconButton>
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

        <SectionCard>
          <LeftHeader>
            <div>
              <h3>결제 상세 설정</h3>
              <SmallText>선택된 학생에게 동일한 설정이 적용됩니다.</SmallText>
            </div>
            <PrimaryButton
              type="button"
              disabled={!selectedIds.length || createMutation.isPending}
              onClick={() => createMutation.mutate()}
            >
              {selectedIds.length ? `청구서 생성 (${selectedIds.length}명)` : "학생을 선택하세요"}
            </PrimaryButton>
          </LeftHeader>
          {primaryStudent && (
            <InfoList>
              <li>
                <span>대표 학생</span>
                <strong>{primaryStudent.name}</strong>
              </li>
              <li>
                <span>발송 번호</span>
                <strong>{primaryRecipientPhone || "-"}</strong>
              </li>
            </InfoList>
          )}
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
              결제 주기 (개월)
              <Input
                type="number"
                min={1}
                value={form.cycleValue}
                onChange={(event) => handleCycleValueChange(event.target.value)}
              />
            </label>
          </FormGrid>
          <PeriodText>
            청구 기간 (자동 갱신)
            <SmallHint>입력한 결제 주기(개월)에 따라 다음 청구 기간이 자동 생성됩니다.</SmallHint>
          </PeriodText>
          <PeriodGrid>
            <label>
              시작일
              <Input
                type="date"
                value={form.periodStart}
                onChange={(event) => handlePeriodStartChange(event.target.value)}
              />
            </label>
            <label>
              종료일
              <Input
                type="date"
                value={form.periodEnd}
                onChange={(event) => setForm((prev) => ({ ...prev, periodEnd: event.target.value }))}
              />
            </label>
          </PeriodGrid>
          <DiscountBox>
            <DiscountFields
              enabled={Boolean(form.discountEnabled)}
              discountType={form.discountType ?? undefined}
              discountValue={form.discountValue}
              startDate={form.discountStartDate}
              endDate={form.discountEndDate}
              onToggleEnabled={(next) => setForm((prev) => ({ ...prev, discountEnabled: next }))}
              onChangeType={(next) => setForm((prev) => ({ ...prev, discountType: next }))}
              onChangeValue={(value) =>
                setForm((prev) => ({ ...prev, discountValue: typeof value === "number" ? value : undefined }))
              }
              onChangeStartDate={(value) => setForm((prev) => ({ ...prev, discountStartDate: value }))}
              onChangeEndDate={(value) => setForm((prev) => ({ ...prev, discountEndDate: value }))}
              showPeriod
            />
          </DiscountBox>
          <label>
            메모
            <Textarea
              value={form.memo}
              onChange={(event) => {
                const nextValue = event.target.value;
                setForm((prev) => ({ ...prev, memo: nextValue, managerMemo: nextValue }));
              }}
            />
          </label>
        </SectionCard>
      </CreateLayout>

      <StudentOverrideModal
        open={overrideOpen}
        onClose={() => setOverrideOpen(false)}
        student={overrideTarget}
        baseForm={form}
        initialValues={overrideTarget ? overrides[overrideTarget.id] : undefined}
        onSave={handleOverrideSave}
      />
    </Page>
  );
}

type OverrideModalProps = {
  open: boolean;
  onClose: () => void;
  student: Student | null;
  baseForm: typeof defaultForm;
  initialValues?: StudentOverride;
  onSave: (values: StudentOverride) => void;
};

function StudentOverrideModal({ open, onClose, student, baseForm, initialValues, onSave }: OverrideModalProps) {
  const [local, setLocal] = useState<StudentOverride>(initialValues ?? {});

  useEffect(() => {
    if (open) {
      setLocal(initialValues ?? {});
    }
  }, [open, initialValues]);

  const localDiscountEnabled = local.discountEnabled ?? baseForm.discountEnabled;

  const handleLocalCycleChange = (raw: string) => {
    const nextValue = normalizeCycle(raw);
    setLocal((prev) => ({
      ...prev,
      cycleValue: nextValue,
      periodEnd: computePeriodEnd(prev.periodStart ?? baseForm.periodStart, nextValue),
    }));
  };

  const handleLocalPeriodStartChange = (value: string) => {
    setLocal((prev) => ({
      ...prev,
      periodStart: value,
      periodEnd: computePeriodEnd(value, prev.cycleValue ?? baseForm.cycleValue),
    }));
  };

  if (!open || !student) return null;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSave(local);
  };

  return (
    <Modal open={open} onClose={onClose} title={`${student.name} 개별 설정`} maxWidth={520}>
      <form onSubmit={handleSubmit}>
        <ModalGrid>
          <label>
            결제 예정일
            <Input
              type="date"
              value={local.dueDate ?? baseForm.dueDate}
              onChange={(event) => setLocal((prev) => ({ ...prev, dueDate: event.target.value }))}
            />
          </label>
          <label>
            결제 주기 (개월)
            <Input
              type="number"
              min={1}
              value={local.cycleValue ?? baseForm.cycleValue}
              onChange={(event) => handleLocalCycleChange(event.target.value)}
            />
          </label>
          <label>
            청구 기간
            <Input
              type="date"
              value={local.periodStart ?? baseForm.periodStart}
              onChange={(event) => handleLocalPeriodStartChange(event.target.value)}
            />
          </label>
          <label>
            &nbsp;
            <Input
              type="date"
              value={local.periodEnd ?? baseForm.periodEnd}
              onChange={(event) =>
                setLocal((prev) => ({ ...prev, periodEnd: event.target.value }))
              }
            />
          </label>
        </ModalGrid>
        <DiscountBox>
          <DiscountFields
            enabled={Boolean(localDiscountEnabled)}
            discountType={local.discountType ?? baseForm.discountType ?? undefined}
            discountValue={local.discountValue ?? undefined}
            startDate={local.discountStartDate ?? baseForm.discountStartDate}
            endDate={local.discountEndDate ?? baseForm.discountEndDate}
            onToggleEnabled={(next) =>
              setLocal((prev) => ({
                ...prev,
                discountEnabled: next,
              }))
            }
            onChangeType={(next) => setLocal((prev) => ({ ...prev, discountType: next }))}
            onChangeValue={(value) =>
              setLocal((prev) => ({
                ...prev,
                discountValue: typeof value === "number" ? value : undefined,
              }))
            }
            onChangeStartDate={(value) => setLocal((prev) => ({ ...prev, discountStartDate: value }))}
            onChangeEndDate={(value) => setLocal((prev) => ({ ...prev, discountEndDate: value }))}
            showPeriod
          />
        </DiscountBox>
        <label>
          메모
          <Textarea
            value={local.memo ?? baseForm.memo}
            onChange={(event) => {
              const nextValue = event.target.value;
              setLocal((prev) => ({ ...prev, memo: nextValue, managerMemo: nextValue }));
            }}
          />
        </label>
        <ModalActions>
          <GhostButton type="button" onClick={onClose}>
            취소
          </GhostButton>
          <PrimaryButton type="submit">저장</PrimaryButton>
        </ModalActions>
      </form>
    </Modal>
  );
}

const CreateLayout = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
  gap: 24px;
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
  }
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

const ModalActions = styled.div`
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;
