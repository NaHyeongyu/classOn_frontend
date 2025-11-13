import { useNavigate, useParams } from "react-router-dom";
import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { TeacherDetailPageView } from "@/views/myAcademy/TeacherDetailPageView";
import { useTeacherDetailPage } from "@/features/myAcademy/hooks/useTeacherDetailPage";
import { routes } from "@/routes";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/common/Toast";
import { getErrorMessage } from "@/lib/errors";
import { listTeachers, deleteTeacher, type TeacherCourseBrief, type TeacherListItem, resetTeacherPassword, checkPasswordStrength } from "@/api/teachers";
import { updateCourseInstructor } from "@/api/courses";
import Modal from "@/components/common/Modal";
import styled from "styled-components";
import { Input as RegInput } from "@/components/register/RegisterForm.styles";
import { useRepresentativeName } from "@/hooks/useRepresentativeName";
import { isMainAccountForTeacher } from "@/lib/users";

export default function TeacherDetail() {
  const { user } = useAuth();
  const repName = useRepresentativeName();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const teacherId = useMemo(() => {
    if (!id) return null;
    const parsed = Number(id);
    return Number.isFinite(parsed) ? parsed : null;
  }, [id]);
  const { detail, loading, error, refresh } = useTeacherDetailPage(teacherId);
  const { success: showSuccess } = useToast();
  // menu edit removed
  const coursesSectionRef = useRef<HTMLDivElement | null>(null);
  const [deleteGuardOpen, setDeleteGuardOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteSuccessOpen, setDeleteSuccessOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [courseModalOpen, setCourseModalOpen] = useState(false);
  const [courseModalTarget, setCourseModalTarget] = useState<TeacherCourseBrief | null>(null);
  const [courseModalSaving, setCourseModalSaving] = useState(false);
  const [courseModalError, setCourseModalError] = useState<string | null>(null);
  const [teacherOptions, setTeacherOptions] = useState<TeacherListItem[]>([]);
  const [teacherOptionsLoading, setTeacherOptionsLoading] = useState(false);
  const [teacherOptionsError, setTeacherOptionsError] = useState<string | null>(null);
  const [selectedInstructorId, setSelectedInstructorId] = useState<number | null>(null);
  const [pwModalOpen, setPwModalOpen] = useState(false);
  const [pwNew, setPwNew] = useState("");
  const [pwConfirm, setPwConfirm] = useState("");
  const [pwChecking, setPwChecking] = useState(false);
  const [pwValid, setPwValid] = useState<boolean | null>(null);
  const [pwMsg, setPwMsg] = useState<string>("");
  const [pwSaving, setPwSaving] = useState(false);
  const [pwError, setPwError] = useState<string | null>(null);

  const userRole = (user?.role ?? "").toString().toUpperCase();
  const canEditMenus = !!detail && (userRole === "ADMIN" || userRole === "OWNER");

  // menu edit removed

  const availableTeachers = useMemo(() => {
    if (!detail) return [];
    return teacherOptions.filter((teacher) => teacher.id !== detail.id);
  }, [teacherOptions, detail]);

  const loadTeacherOptions = useCallback(async () => {
    setTeacherOptionsLoading(true);
    setTeacherOptionsError(null);
    try {
      let list = await listTeachers();
      // Ensure current login appears as selectable when owner/admin
      const roleValue = (user?.role ?? "").toString().toUpperCase();
      const isOwnerOrAdmin = roleValue === 'OWNER' || roleValue === 'ADMIN';
      if (isOwnerOrAdmin && user) {
        const selfId = typeof user.id === 'number' ? user.id : Number(user.id);
        if (!Number.isNaN(selfId) && !list.some(t => t.id === selfId)) {
          list = list.concat({ id: selfId, name: user.name || user.username, username: user.username, phone: undefined, phoneVerified: false, courseCount: 0 });
        }
      }
      setTeacherOptions(list);
    } catch (err) {
      setTeacherOptionsError(getErrorMessage(err, "강사 목록을 불러오지 못했습니다."));
    } finally {
      setTeacherOptionsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!courseModalOpen || !detail) return;
    if (availableTeachers.length === 0) {
      setSelectedInstructorId(null);
      return;
    }
    const hasSelected = selectedInstructorId
      ? availableTeachers.some((teacher) => teacher.id === selectedInstructorId)
      : false;
    if (!hasSelected) {
      setSelectedInstructorId(availableTeachers[0]?.id ?? null);
    }
  }, [availableTeachers, courseModalOpen, detail, selectedInstructorId]);

  // menu modal removed

  const openPwModal = useCallback(() => {
    if (!detail || !canEditMenus) return;
    setPwModalOpen(true);
    setPwNew("");
    setPwConfirm("");
    setPwError(null);
    setPwValid(null);
    setPwMsg("");
  }, [detail, canEditMenus]);

  const closePwModal = useCallback(() => {
    if (pwSaving) return;
    setPwModalOpen(false);
    setPwError(null);
  }, [pwSaving]);

  // menu editing removed

  const handleOpenCourseModal = useCallback(
    (course: TeacherCourseBrief) => {
      if (!canEditMenus) return;
      setCourseModalTarget(course);
      setCourseModalError(null);
      setCourseModalOpen(true);
      void loadTeacherOptions();
    },
    [canEditMenus, loadTeacherOptions],
  );

  const closeCourseModal = () => {
    if (courseModalSaving) return;
    setCourseModalOpen(false);
    setCourseModalTarget(null);
    setCourseModalError(null);
    setSelectedInstructorId(null);
  };

  const handleSubmitInstructorChange = async () => {
    if (!teacherId || !courseModalTarget) return;
    setCourseModalSaving(true);
    setCourseModalError(null);
    try {
      await updateCourseInstructor(courseModalTarget.id, selectedInstructorId ?? null);
      showSuccess(selectedInstructorId == null ? "담당 강사가 해제되었습니다." : "담당 강사가 변경되었습니다.");
      await refresh();
      closeCourseModal();
    } catch (err) {
      setCourseModalError(getErrorMessage(err, "담당 강사 변경에 실패했습니다."));
    } finally {
      setCourseModalSaving(false);
    }
  };

  useEffect(() => {
    let t: number | undefined;
    if (pwModalOpen && pwNew.trim()) {
      setPwChecking(true);
      setPwError(null);
      setPwMsg("비밀번호 확인 중…");
      t = window.setTimeout(async () => {
        try {
          const res = await checkPasswordStrength(pwNew.trim());
          setPwValid(res.valid);
          setPwMsg(res.valid ? "안전한 비밀번호입니다." : res.message || "비밀번호가 정책을 만족하지 않습니다.");
        } catch {
          setPwValid(null);
          setPwMsg("비밀번호 확인에 실패했습니다.");
        } finally {
          setPwChecking(false);
        }
      }, 300);
    } else {
      setPwValid(null);
      setPwMsg("");
      setPwChecking(false);
    }
    return () => {
      if (t) window.clearTimeout(t);
    };
  }, [pwModalOpen, pwNew]);

  const handleSubmitPwReset = async () => {
    if (!teacherId) return;
    if (!pwNew.trim()) { setPwError("새 비밀번호를 입력해 주세요."); return; }
    if (pwNew !== pwConfirm) { setPwError("비밀번호가 일치하지 않습니다."); return; }
    if (pwValid === false || pwChecking) return;
    setPwSaving(true);
    setPwError(null);
    try {
      await resetTeacherPassword(teacherId, pwNew.trim());
      showSuccess("비밀번호가 재설정되었습니다.");
      closePwModal();
    } catch (err) {
      setPwError(getErrorMessage(err, "비밀번호 재설정에 실패했습니다."));
    } finally {
      setPwSaving(false);
    }
  };

  const handleRequestDelete = () => {
    if (!detail || !canEditMenus) return;
    if (detail.courses.length > 0) {
      setDeleteGuardOpen(true);
      return;
    }
    setDeleteError(null);
    setDeleteConfirmOpen(true);
  };

  const focusCoursesSection = () => {
    setTimeout(() => {
      coursesSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  };

  const handleGuardAcknowledge = () => {
    setDeleteGuardOpen(false);
    focusCoursesSection();
  };

  const handleConfirmDelete = async () => {
    if (!teacherId) return;
    setDeleteLoading(true);
    setDeleteError(null);
    try {
      await deleteTeacher(teacherId);
      setDeleteConfirmOpen(false);
      setDeleteSuccessOpen(true);
    } catch (err) {
      setDeleteError(getErrorMessage(err, "강사 삭제에 실패했습니다."));
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeleteSuccessClose = () => {
    setDeleteSuccessOpen(false);
    navigate(routes.myAcademy);
  };

  return (
    <>
      <TeacherDetailPageView
        detail={detail}
        loading={loading}
        error={error}
        onBack={() => navigate(routes.myAcademy)}
        onRetry={() => {
          void refresh();
        }}
        canEditMenus={canEditMenus}
        canDeleteTeacher={canEditMenus}
        onOpenPasswordModal={openPwModal}
        onRequestDelete={handleRequestDelete}
        onChangeInstructor={canEditMenus ? handleOpenCourseModal : undefined}
        coursesRef={coursesSectionRef}
      />

      <Modal
        open={pwModalOpen}
        onClose={closePwModal}
        title="비밀번호 재설정"
        description="새 비밀번호를 입력해 주세요."
        maxWidth={520}
      >
        <ModalBody>
          <div>
            <ModalLabel htmlFor="teacher-reset-password">새 비밀번호</ModalLabel>
            <PasswordInput
              id="teacher-reset-password"
              type="password"
              value={pwNew}
              onChange={(e) => setPwNew(e.target.value)}
              placeholder="8–64자, 문자+숫자"
            />
            {pwMsg ? (
              <MenuInfo role="status" style={{ color: pwValid ? '#065f46' : pwChecking ? '#6b7280' : pwValid === false ? '#b91c1c' : '#64748b' }}>
                {pwMsg}
              </MenuInfo>
            ) : null}
          </div>
          <div>
            <ModalLabel htmlFor="teacher-reset-password-confirm">비밀번호 확인</ModalLabel>
            <PasswordInput
              id="teacher-reset-password-confirm"
              type="password"
              value={pwConfirm}
              onChange={(e) => setPwConfirm(e.target.value)}
              placeholder="비밀번호 다시 입력"
            />
          </div>
          {pwError ? <MenuError role="alert">{pwError}</MenuError> : null}
        </ModalBody>
        <MenuActions>
          <MenuGhostButton type="button" onClick={closePwModal} disabled={pwSaving}>
            취소
          </MenuGhostButton>
          <MenuPrimaryButton type="button" onClick={handleSubmitPwReset} disabled={pwSaving || pwChecking || (pwValid === false) || !pwNew || !pwConfirm || pwNew !== pwConfirm}>
            {pwSaving ? "저장 중…" : "저장"}
          </MenuPrimaryButton>
        </MenuActions>
      </Modal>

      <Modal
        open={courseModalOpen}
        onClose={closeCourseModal}
        title="담당 강사 변경"
        description={
          courseModalTarget ? `“${courseModalTarget.title}” 수업의 담당 강사를 선택하세요.` : undefined
        }
        maxWidth={520}
      >
        <ModalBody>
          {teacherOptionsLoading ? (
            <ModalMessage>강사 목록을 불러오는 중입니다…</ModalMessage>
          ) : teacherOptionsError ? (
            <ModalMessage role="alert">{teacherOptionsError}</ModalMessage>
          ) : (
            <div>
              <ModalLabel>새 담당 강사</ModalLabel>
              <SelectInput
                value={selectedInstructorId ?? ""}
                onChange={(event) => {
                  const value = event.target.value;
                  if (value === "__NONE__" || value === "") setSelectedInstructorId(null);
                  else setSelectedInstructorId(Number(value));
                }}
              >
                <option value="">강사를 선택해 주세요</option>
                <option value="__NONE__">담당 강사 없음</option>
                {availableTeachers.map((teacher) => {
                  const labelBase = teacher.name || teacher.username || `강사 #${teacher.id}`;
                  const isMain = isMainAccountForTeacher(user, teacher, repName);
                  const label = isMain ? `${labelBase} [본계정]` : labelBase;
                  return (
                    <option key={teacher.id} value={teacher.id}>
                      {label}
                    </option>
                  );
                })}
              </SelectInput>
              {user && !availableTeachers.some((t) => isMainAccountForTeacher(user, t, repName)) ? (
                <MenuInfo style={{ marginTop: 6 }}>
                  본계정(담당자)이 보이지 않으면 강사로 등록해 주세요.
                </MenuInfo>
              ) : null}
              {availableTeachers.length === 0 ? (
                <MenuInfo style={{ marginTop: 6 }}>다른 강사가 없습니다. ‘담당 강사 없음’을 선택해 해제할 수 있어요.</MenuInfo>
              ) : null}
            </div>
          )}
          {courseModalError ? <MenuError role="alert">{courseModalError}</MenuError> : null}
        </ModalBody>
        <MenuActions>
          <MenuGhostButton type="button" onClick={closeCourseModal} disabled={courseModalSaving}>
            취소
          </MenuGhostButton>
          <MenuPrimaryButton
            type="button"
            onClick={handleSubmitInstructorChange}
            disabled={
              courseModalSaving ||
              !!teacherOptionsError
            }
          >
            {courseModalSaving ? "변경 중…" : "저장"}
          </MenuPrimaryButton>
        </MenuActions>
      </Modal>

      <Modal
        open={deleteGuardOpen}
        onClose={() => setDeleteGuardOpen(false)}
        title="강사를 삭제할 수 없습니다."
        maxWidth={520}
      >
        <ModalBody>
          <ModalMessage>
            이 강사는 현재 수업을 담당 중입니다. 수업 담당 강사를 먼저 변경해주세요.
          </ModalMessage>
        </ModalBody>
        <MenuActions>
          <MenuPrimaryButton type="button" onClick={handleGuardAcknowledge}>
            확인
          </MenuPrimaryButton>
        </MenuActions>
      </Modal>

      <Modal
        open={deleteConfirmOpen}
        onClose={() => {
          if (!deleteLoading) setDeleteConfirmOpen(false);
        }}
        title="강사 삭제"
        description="정말 삭제하시겠습니까?"
        maxWidth={520}
      >
        <ModalBody>
          {deleteError ? <MenuError role="alert">{deleteError}</MenuError> : null}
        </ModalBody>
        <MenuActions>
          <MenuGhostButton type="button" onClick={() => setDeleteConfirmOpen(false)} disabled={deleteLoading}>
            취소
          </MenuGhostButton>
          <DangerButton type="button" onClick={handleConfirmDelete} disabled={deleteLoading}>
            {deleteLoading ? "삭제 중…" : "삭제"}
          </DangerButton>
        </MenuActions>
      </Modal>

      <Modal
        open={deleteSuccessOpen}
        onClose={handleDeleteSuccessClose}
        title="삭제가 완료되었습니다."
        description="강사 계정이 삭제되었습니다."
        maxWidth={520}
      >
        <MenuActions>
          <MenuPrimaryButton type="button" onClick={handleDeleteSuccessClose}>
            확인
          </MenuPrimaryButton>
        </MenuActions>
      </Modal>
    </>
  );
}

const ModalBody = styled.div`
  display: grid;
  gap: 16px;
  min-width: 320px;
  max-width: 480px;
`;

/* removed: menu checkbox UI */

const ModalMessage = styled.p`
  margin: 0;
  font-size: 14px;
  color: #374151;
  line-height: 1.5;
`;

const ModalLabel = styled.label`
  display: block;
  margin-bottom: 6px;
  font-size: 13px;
  font-weight: 600;
  color: #1f2937;
`;

const PasswordInput = styled(RegInput)`
  width: 100%;
  height: 44px;
  border-radius: 10px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  padding: 0 12px;
  font-size: 14px;
  &:focus {
    background: #fff;
  }
`;

const SelectInput = styled.select`
  width: 100%;
  height: 44px;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  padding: 0 ${(p) => p.theme.spacing.sm};
  font-size: 14px;
  color: #0f172a;
  background: #fff;
`;

const MenuInfo = styled.p`
  margin: 0;
  font-size: 12px;
  color: #64748b;
`;

const MenuError = styled.p`
  margin: 0;
  font-size: 12px;
  color: #b91c1c;
`;

const MenuActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

const MenuGhostButton = styled.button`
  border: 1px solid #cbd5f5;
  background: #ffffff;
  color: #4f46e5;
  font-size: 13px;
  border-radius: 999px;
  padding: 6px 14px;
  cursor: pointer;
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const MenuPrimaryButton = styled.button`
  border: none;
  background: #4f46e5;
  color: #ffffff;
  font-size: 13px;
  font-weight: 600;
  border-radius: 999px;
  padding: 6px 16px;
  cursor: pointer;
  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }
`;

const DangerButton = styled(MenuPrimaryButton)`
  background: #dc2626;
  &:hover {
    background: #b91c1c;
  }
`;
