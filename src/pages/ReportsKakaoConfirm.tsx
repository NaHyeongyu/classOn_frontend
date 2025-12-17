import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import {
  Page,
  PageHeader,
  SectionCard,
  GhostButton,
  PrimaryButton,
  EmptyState,
  Skeleton,
  TableBase,
} from "@/components/common/UI";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "@/components/common/Toast";
import { useAuth } from "@/hooks/useAuth";
import { getStudent, sendStudentReportAlert, updateStudent } from "@/api/students";
import type { Student } from "@/api/students";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { routes } from "@/routes";
import { formatPhone } from "@/lib/format";
import { readableError } from "@/lib/errors";

type SelectionPair = { studentId: number; reportId: number };
type StudentCourse = Student["courses"][number];

const REPORT_TEMPLATE = [
  "[#{academyName}]",
  "",
  "안녕하세요 😊",
  "",
  "#{studentName} 학생의",
  "#{courseName} 수업 보고서가 있어 알려드립니다.",
  "",
  "자세한 내용은 아래에서 확인하실 수 있습니다.",
].join("\n");

const PREVIEW_EXPIRE_SEC = 86400;

export default function ReportsKakaoConfirm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const courseParam = searchParams.get("courseName") ?? "";
  const selectionParam = searchParams.get("selection");
  const fallbackStudentId = Number(searchParams.get("studentId") ?? NaN);
  const fallbackReportId = Number(searchParams.get("reportId") ?? NaN);
  const hasFallback = Number.isFinite(fallbackStudentId) && Number.isFinite(fallbackReportId);
  const selectionPairs = useMemo<SelectionPair[]>(() => {
    if (selectionParam) {
      return selectionParam
        .split(",")
        .map((entry) => {
          const [sid, rid] = entry.split(":").map((value) => Number(value));
          if (Number.isFinite(sid) && sid > 0 && Number.isFinite(rid) && rid > 0) {
            return { studentId: sid, reportId: rid };
          }
          return null;
        })
        .filter((pair): pair is SelectionPair => pair != null);
    }
    if (hasFallback && fallbackStudentId > 0 && fallbackReportId > 0) {
      return [{ studentId: fallbackStudentId, reportId: fallbackReportId }];
    }
    return [];
  }, [selectionParam, hasFallback, fallbackStudentId, fallbackReportId]);
  const selectionKey = selectionPairs.map((pair) => `${pair.studentId}:${pair.reportId}`).join(",");

  const { user } = useAuth();
  const { success, error: toastError, warning, show: showToast } = useToast();
  const queryClient = useQueryClient();
  const [academyName, setAcademyName] = useState("OO학원");
  const [courseName, setCourseName] = useState(courseParam);
  const [editingPhoneId, setEditingPhoneId] = useState<number | null>(null);
  const [phoneInput, setPhoneInput] = useState("");
  const [phoneSource, setPhoneSource] = useState<"guardianPhone" | "phoneNumber">("guardianPhone");
  const [selectedIds, setSelectedIds] = useState<number[]>(() => selectionPairs.map((pair) => pair.studentId));

  useEffect(() => {
    setSelectedIds(selectionPairs.map((pair) => pair.studentId));
  }, [selectionPairs]);

  useEffect(() => {
    const nextName = user?.academy?.name?.trim();
    if (!nextName) return;
    setAcademyName((prev) => {
      if (!prev.trim() || prev === "OO학원") return nextName;
      return prev;
    });
  }, [user?.academy?.name]);

  const renderReady = selectionPairs.length > 0;

  const studentsQuery = useQuery({
    queryKey: ["students", "reports-kakao-confirm", selectionKey],
    enabled: renderReady && Boolean(selectionKey),
    queryFn: async () => {
      const map: Record<number, Student> = {};
      for (const pair of selectionPairs) {
        if (!map[pair.studentId]) {
          map[pair.studentId] = await getStudent(pair.studentId);
        }
      }
      return map;
    },
  });

  useEffect(() => {
    if (courseParam) return;
    if (!selectionPairs.length) return;
    const first = studentsQuery.data?.[selectionPairs[0].studentId];
    const nextCourse =
      first?.courses
        ?.map((course: StudentCourse): string | null => course?.title?.trim() ?? null)
        .filter((title: string | null): title is string => Boolean(title))?.[0] ?? "";
    if (nextCourse && !courseName.trim()) {
      setCourseName(nextCourse);
    }
  }, [courseParam, courseName, selectionPairs, studentsQuery.data]);

  const studentsMap = useMemo(() => studentsQuery.data ?? {}, [studentsQuery.data]);
  const studentRecords = selectionPairs
    .map((pair) => studentsMap[pair.studentId])
    .filter((student): student is Student => Boolean(student));

  const getPrimaryPhone = (student?: Student) =>
    student?.guardianPhone?.trim() || student?.phoneNumber?.trim() || "";

  const selectedPairs = selectionPairs.filter((pair) => selectedIds.includes(pair.studentId));

  const previewMessages = useMemo(() => {
    if (!selectedPairs.length) return [];
    const representative = selectedPairs[0];
    const student = studentsMap[representative.studentId];
    const studentName = student?.name ?? "";
    return [
      {
        studentId: representative.studentId,
        text: renderTemplate(REPORT_TEMPLATE, {
          academyName: academyName || "OO학원",
          studentName: studentName || "#{studentName}",
          courseName: courseName || "#{courseName}",
        }),
      },
    ];
  }, [academyName, courseName, selectedPairs, studentsMap]);

  const handleStartEditPhone = (student: Student) => {
    const guardian = student.guardianPhone?.trim();
    const personal = student.phoneNumber?.trim();
    const initial = guardian || personal || "";
    setPhoneSource(guardian ? "guardianPhone" : "phoneNumber");
    setPhoneInput(initial);
    setEditingPhoneId(student.id);
  };

  const handleCancelEditPhone = () => {
    setEditingPhoneId(null);
    setPhoneInput("");
  };

  const updatePhoneMutation = useMutation({
    mutationFn: async (params: { studentId: number; value: string; source: "guardianPhone" | "phoneNumber" }) => {
      const payload = params.source === "phoneNumber" ? { phoneNumber: params.value } : { guardianPhone: params.value };
      return await updateStudent(params.studentId, payload);
    },
    onSuccess: (updated: Student) => {
      queryClient.setQueryData<Record<number, Student> | undefined>(
        ["students", "reports-kakao-confirm", selectionKey],
        (prev) => {
          if (!prev) return prev;
          return { ...prev, [updated.id]: updated };
        },
      );
      setEditingPhoneId(null);
      setPhoneInput("");
      success("연락처를 저장했습니다.");
    },
    onError: (error: unknown) => {
      toastError(readableError(error, "연락처를 저장하지 못했습니다."));
    },
  });

  const handleSavePhone = () => {
    if (editingPhoneId == null) return;
    const next = phoneInput.trim();
    if (!next) {
      showToast("전송 번호를 입력해 주세요.", { kind: "warning" });
      return;
    }
    updatePhoneMutation.mutate({ studentId: editingPhoneId, value: next, source: phoneSource });
  };

  const sendMutation = useMutation({
    mutationFn: async () => {
      const results: Array<{ studentId: number; status: "PENDING" | "SENT" | "FAILED"; message?: string | null }> = [];
      for (const pair of selectedPairs) {
        const res = await sendStudentReportAlert(pair.studentId, pair.reportId, PREVIEW_EXPIRE_SEC);
        results.push({ studentId: pair.studentId, status: res.status, message: res.message });
      }
      return results;
    },
    onSuccess: (results: Array<{ studentId: number; status: "PENDING" | "SENT" | "FAILED"; message?: string | null }>) => {
      if (!results.length) {
        toastError("전송할 학생이 없습니다.");
        return;
      }
      const failed = results.filter((r) => r.status === "FAILED");
      const pending = results.filter((r) => r.status === "PENDING");
      const successCount = results.filter((r) => r.status === "SENT").length;
      if (successCount) {
        success(`${successCount}건 보고서를 저장하고 알림톡을 발송했습니다.`);
      }
      if (pending.length) {
        warning(`${pending.length}건 알림톡 발송 대기 상태입니다. 잠시 후 상태를 확인해주세요.`);
      }
      if (failed.length) {
        toastError(failed[0].message || "일부 알림톡 발송에 실패했습니다.");
        return;
      }
      navigate(routes.reports);
    },
    onError: (error: unknown) => {
      toastError(readableError(error, "알림톡 발송에 실패했습니다."));
    },
  });

  if (!renderReady) {
    return (
      <Page>
        <PageHeader>
          <div>
            <h2>카카오톡 알림 전송 확인</h2>
            <p>전송할 학생 정보가 없습니다. 보고서 페이지에서 다시 시도해 주세요.</p>
          </div>
          <GhostButton type="button" onClick={() => navigate(routes.reports)}>
            보고서로 이동
          </GhostButton>
        </PageHeader>
        <EmptyState>학생 또는 보고서 정보가 누락되었습니다.</EmptyState>
      </Page>
    );
  }

  const hasStudentTable = studentsQuery.isSuccess && studentRecords.length === selectionPairs.length && studentRecords.length > 0;
  const missingPhones = studentRecords.filter((student) => selectedIds.includes(student.id) && !getPrimaryPhone(student));
  const disableSend =
    sendMutation.isPending ||
    !hasStudentTable ||
    !selectedPairs.length ||
    missingPhones.length > 0 ||
    !academyName.trim() ||
    !courseName.trim();
  const allSelected = selectedIds.length === selectionPairs.length && selectionPairs.length > 0;

  const toggleSelect = (studentId: number) => {
    setSelectedIds((prev) => (prev.includes(studentId) ? prev.filter((id) => id !== studentId) : [...prev, studentId]));
  };

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(selectionPairs.map((pair) => pair.studentId));
    }
  };

  return (
    <Page>
      <PageHeader>
        <div>
          <h2>카카오톡 알림 전송 확인</h2>
          <p>선택한 학생에게 전송할 보고서 알림톡 내용을 확인하세요.</p>
        </div>
        <GhostButton type="button" onClick={() => navigate(routes.reports)}>
          목록으로
        </GhostButton>
      </PageHeader>

      <ConfirmLayout>
        <SectionCard>
          <SectionHeader>
            <h3>학생 목록</h3>
            <SelectAllButton type="button" onClick={toggleSelectAll} disabled={!selectionPairs.length || studentsQuery.isLoading}>
              {allSelected ? "전체 해제" : "전체 선택"}
            </SelectAllButton>
          </SectionHeader>
          {studentsQuery.isLoading ? (
            <Skeleton h={120} />
          ) : !hasStudentTable ? (
            <EmptyState>표시할 학생이 없습니다.</EmptyState>
          ) : (
            <TableWrapper>
              <StyledTable>
                <thead>
                  <tr>
                    <th>선택</th>
                    <th>이름</th>
                    <th>학생 코드</th>
                    <th>전송 번호</th>
                  </tr>
                </thead>
                <tbody>
                  {selectionPairs.map((pair) => {
                    const student = studentsMap[pair.studentId];
                    if (!student) return null;
                    const phone = getPrimaryPhone(student);
                    const isEditing = editingPhoneId === student.id;
                    const checked = selectedIds.includes(student.id);
                    return (
                      <tr key={student.id}>
                        <td>
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleSelect(student.id)}
                          />
                        </td>
                        <td>{student.name || "-"}</td>
                        <td>{student.code || "-"}</td>
                        <td>
                          {isEditing ? (
                            <PhoneEditRow>
                              <PhoneInput
                                type="text"
                                value={phoneInput}
                                onChange={(event) => setPhoneInput(event.target.value)}
                                placeholder="숫자만 입력"
                              />
                              <PhoneEditButtons>
                                <InlineButton type="button" onClick={handleCancelEditPhone} disabled={updatePhoneMutation.isPending}>
                                  취소
                                </InlineButton>
                                <InlinePrimary
                                  type="button"
                                  onClick={handleSavePhone}
                                  disabled={updatePhoneMutation.isPending}
                                >
                                  {updatePhoneMutation.isPending ? "저장 중..." : "저장"}
                                </InlinePrimary>
                              </PhoneEditButtons>
                            </PhoneEditRow>
                          ) : (
                            <PhoneDisplay>
                              <span>{phone ? formatPhone(phone) : "-"}</span>
                              <InlineButton
                                type="button"
                                onClick={() => {
                                  handleStartEditPhone(student);
                                }}
                              >
                                수정
                              </InlineButton>
                            </PhoneDisplay>
                          )}
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
              학원명
              <Input
                type="text"
                value={academyName}
                onChange={(event) => setAcademyName(event.target.value)}
              />
            </label>
            <label>
              수업명
              <Input
                type="text"
                value={courseName}
                onChange={(event) => setCourseName(event.target.value)}
                placeholder="예: 수학 심화반"
              />
            </label>
            <label>
              메시지(템플릿 수정은 불가합니다.)
              <MessageTextarea value={REPORT_TEMPLATE} readOnly />
            </label>
          </FormStack>

          <PreviewSection>
            <PreviewTitle>메시지 미리보기 <small>대표 학생 기준으로 표시됩니다.</small></PreviewTitle>
            {previewMessages.length > 0 && hasStudentTable ? (
              <PreviewList>
                {previewMessages.map((preview) => (
                  <li key={preview.studentId}>
                    <span>{preview.text}</span>
                  </li>
                ))}
              </PreviewList>
            ) : (
              <EmptyState>전송 미리보기를 생성할 수 없습니다.</EmptyState>
            )}
          </PreviewSection>

          <Actions>
            <GhostButton type="button" onClick={() => navigate(routes.reports)}>
              취소
            </GhostButton>
            <PrimaryButton
              type="button"
              disabled={disableSend}
              onClick={() => {
                if (!hasStudentTable) {
                  showToast("전송할 학생 정보를 불러오지 못했습니다.", { kind: "error" });
                  return;
                }
                if (missingPhones.length) {
                  showToast("전송 번호가 없는 학생이 있습니다.", { kind: "warning" });
                  return;
                }
                sendMutation.mutate();
              }}
            >
              {sendMutation.isPending ? "전송 중..." : "전송"}
            </PrimaryButton>
          </Actions>
        </SectionCard>
      </ConfirmLayout>
    </Page>
  );
}

function renderTemplate(
  template: string,
  values: { academyName: string; studentName: string; courseName: string },
): string {
  return template
    .replaceAll("#{academyName}", values.academyName)
    .replaceAll("#{studentName}", values.studentName)
    .replaceAll("#{courseName}", values.courseName);
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
  thead th:first-child,
  tbody td:first-child {
    width: 60px;
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
  gap: 8px;
  align-items: baseline;
  small {
    font-size: 12px;
    color: ${(p) => p.theme.colors.textMuted};
  }
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

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
`;

const SelectAllButton = styled.button`
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 10px;
  background: #ffffff;
  font-size: 13px;
  padding: 6px 12px;
  cursor: pointer;
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PhoneDisplay = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
`;

const PhoneEditRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

const PhoneInput = styled.input`
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 8px;
  padding: 6px 10px;
  font-size: 14px;
  width: 160px;
`;

const PhoneEditButtons = styled.div`
  display: inline-flex;
  gap: 6px;
`;

const InlineButton = styled.button`
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 8px;
  background: #ffffff;
  font-size: 12px;
  padding: 4px 10px;
  cursor: pointer;
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const InlinePrimary = styled(InlineButton)`
  border-color: ${(p) => p.theme.colors.primary};
  color: #ffffff;
  background: ${(p) => p.theme.colors.primary};
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 16px;
`;
