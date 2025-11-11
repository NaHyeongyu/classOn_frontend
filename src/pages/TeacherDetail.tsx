import { useNavigate, useParams } from "react-router-dom";
import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { TeacherDetailPageView } from "@/views/myAcademy/TeacherDetailPageView";
import { useTeacherDetailPage } from "@/features/myAcademy/hooks/useTeacherDetailPage";
import { routes } from "@/routes";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/common/Toast";
import { getErrorMessage } from "@/lib/errors";
import {
  updateTeacherMenus,
  listTeachers,
  deleteTeacher,
  type TeacherCourseBrief,
  type TeacherListItem,
} from "@/api/teachers";
import { updateCourseInstructor } from "@/api/courses";
import Modal from "@/components/common/Modal";
import styled from "styled-components";
import { TEACHER_MENU_OPTIONS } from "@/constants/teacherMenus";

type TeacherMenuKey = (typeof TEACHER_MENU_OPTIONS)[number]["key"];

export default function TeacherDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const teacherId = useMemo(() => {
    if (!id) return null;
    const parsed = Number(id);
    return Number.isFinite(parsed) ? parsed : null;
  }, [id]);
  const { detail, loading, error, refresh } = useTeacherDetailPage(teacherId);
  const { user } = useAuth();
  const { success: showSuccess } = useToast();
  const [savingMenus, setSavingMenus] = useState(false);
  const [menuModalOpen, setMenuModalOpen] = useState(false);
  const [menuDraft, setMenuDraft] = useState<TeacherMenuKey[]>([]);
  const [menuModalError, setMenuModalError] = useState<string | null>(null);
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

  const userRole = (user?.role ?? "").toString().toUpperCase();
  const canEditMenus = !!detail && (userRole.includes("ADMIN") || userRole.includes("OWNER"));

  const normalizedOptions = useMemo(
    () => new Set<TeacherMenuKey>(TEACHER_MENU_OPTIONS.map((option) => option.key)),
    [],
  );

  const filterValidMenus = useCallback(
    (menus: readonly string[]) =>
      menus.filter((key): key is TeacherMenuKey =>
        normalizedOptions.has(key as TeacherMenuKey),
      ),
    [normalizedOptions],
  );

  const availableTeachers = useMemo(() => {
    if (!detail) return [];
    return teacherOptions.filter((teacher) => teacher.id !== detail.id);
  }, [teacherOptions, detail]);

  const loadTeacherOptions = useCallback(async () => {
    setTeacherOptionsLoading(true);
    setTeacherOptionsError(null);
    try {
      const list = await listTeachers();
      setTeacherOptions(list);
    } catch (err) {
      setTeacherOptionsError(getErrorMessage(err, "강사 목록을 불러오지 못했습니다."));
    } finally {
      setTeacherOptionsLoading(false);
    }
  }, []);

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

  const openMenuModal = useCallback(() => {
    if (!detail || !canEditMenus) return;
    setMenuDraft(filterValidMenus(detail.menus));
    setMenuModalError(null);
    setMenuModalOpen(true);
  }, [detail, canEditMenus, filterValidMenus]);

  const closeMenuModal = useCallback(() => {
    if (savingMenus) return;
    setMenuModalOpen(false);
    setMenuModalError(null);
  }, [savingMenus]);

  const handleSaveMenus = async (menus: TeacherMenuKey[]) => {
    if (!teacherId || !canEditMenus) return false;
    setSavingMenus(true);
    setMenuModalError(null);
    let ok = false;
    try {
      await updateTeacherMenus(teacherId, { menus });
      showSuccess("강사 메뉴 권한이 저장되었습니다.");
      await refresh();
      ok = true;
    } catch (err) {
      setMenuModalError(getErrorMessage(err, "메뉴 권한 저장에 실패했습니다."));
    } finally {
      setSavingMenus(false);
    }
    return ok;
  };

  const toggleMenuDraft = (key: TeacherMenuKey) => {
    setMenuDraft((prev) => {
      const exists = prev.includes(key);
      if (exists) return prev.filter((menu) => menu !== key);
      return Array.from(new Set([...prev, key]));
    });
  };

  const filteredCurrentMenus = useMemo(() => {
    if (!detail) return [];
    return filterValidMenus(detail.menus);
  }, [detail, filterValidMenus]);

  const menuDirty = useMemo(() => {
    if (!detail) return false;
    if (filteredCurrentMenus.length !== menuDraft.length) return true;
    const current = new Set(filteredCurrentMenus);
    return menuDraft.some((menu) => !current.has(menu));
  }, [filteredCurrentMenus, menuDraft, detail]);

  const saveDisabled = !detail || savingMenus || menuDraft.length === 0 || !menuDirty;

  const handleSubmitMenus = async () => {
    if (saveDisabled) return;
    const ok = await handleSaveMenus(menuDraft);
    if (ok) {
      setMenuModalOpen(false);
    }
  };

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
    if (!teacherId || !courseModalTarget || !selectedInstructorId) return;
    setCourseModalSaving(true);
    setCourseModalError(null);
    try {
      await updateCourseInstructor(courseModalTarget.id, selectedInstructorId);
      showSuccess("담당 강사가 변경되었습니다.");
      await refresh();
      closeCourseModal();
    } catch (err) {
      setCourseModalError(getErrorMessage(err, "담당 강사 변경에 실패했습니다."));
    } finally {
      setCourseModalSaving(false);
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
        onOpenMenuModal={openMenuModal}
        onRequestDelete={handleRequestDelete}
        onChangeInstructor={canEditMenus ? handleOpenCourseModal : undefined}
        coursesRef={coursesSectionRef}
      />
      <Modal
        open={menuModalOpen}
        onClose={closeMenuModal}
        title="강사 메뉴 권한"
        description="강사 사이드바에 표시할 메뉴를 선택하세요."
      >
        <ModalBody>
          <MenuCheckboxGroup>
            {TEACHER_MENU_OPTIONS.map((option) => {
              const checked = menuDraft.includes(option.key);
              return (
                <MenuRow key={option.key}>
                  <label>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleMenuDraft(option.key)}
                    />
                    <span>{option.label}</span>
                  </label>
                  <MenuHint>{option.description}</MenuHint>
                </MenuRow>
              );
            })}
          </MenuCheckboxGroup>
          {menuDraft.length === 0 ? (
            <MenuInfo role="alert">최소 한 개 이상의 메뉴 권한을 선택해 주세요.</MenuInfo>
          ) : (
            <MenuInfo>선택된 메뉴만 강사 사이드바에 노출됩니다.</MenuInfo>
          )}
          {menuModalError ? <MenuError role="alert">{menuModalError}</MenuError> : null}
          <MenuActions>
            <MenuGhostButton
              type="button"
              onClick={() => setMenuDraft(filteredCurrentMenus)}
              disabled={savingMenus || !menuDirty}
            >
              변경 취소
            </MenuGhostButton>
            <MenuPrimaryButton type="button" onClick={handleSubmitMenus} disabled={saveDisabled}>
              {savingMenus ? "저장 중…" : "저장"}
            </MenuPrimaryButton>
          </MenuActions>
        </ModalBody>
      </Modal>

      <Modal
        open={courseModalOpen}
        onClose={closeCourseModal}
        title="담당 강사 변경"
        description={
          courseModalTarget ? `“${courseModalTarget.title}” 수업의 담당 강사를 선택하세요.` : undefined
        }
      >
        <ModalBody>
          {teacherOptionsLoading ? (
            <ModalMessage>강사 목록을 불러오는 중입니다…</ModalMessage>
          ) : teacherOptionsError ? (
            <ModalMessage role="alert">{teacherOptionsError}</ModalMessage>
          ) : availableTeachers.length === 0 ? (
            <ModalMessage role="alert">
              다른 강사가 없습니다. 새 강사를 먼저 등록해 주세요.
            </ModalMessage>
          ) : (
            <div>
              <ModalLabel>새 담당 강사</ModalLabel>
              <SelectInput
                value={selectedInstructorId ?? ""}
                onChange={(event) => {
                  const value = event.target.value;
                  setSelectedInstructorId(value ? Number(value) : null);
                }}
              >
                <option value="">강사를 선택해 주세요</option>
                {availableTeachers.map((teacher) => {
                  const label = teacher.name || teacher.username || `강사 #${teacher.id}`;
                  return (
                    <option key={teacher.id} value={teacher.id}>
                      {label}
                    </option>
                  );
                })}
              </SelectInput>
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
              !selectedInstructorId ||
              availableTeachers.length === 0 ||
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

const MenuCheckboxGroup = styled.div`
  display: grid;
  gap: 12px;
`;

const MenuRow = styled.div`
  display: grid;
  gap: 4px;
  label {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 13px;
    color: #1f2937;
    input {
      width: 16px;
      height: 16px;
      accent-color: #4f46e5;
    }
  }
`;

const MenuHint = styled.span`
  font-size: 12px;
  color: #64748b;
  padding-left: 26px;
`;

const ModalMessage = styled.p`
  margin: 0;
  font-size: 14px;
  color: #374151;
  line-height: 1.5;
`;

const ModalLabel = styled.span`
  display: block;
  margin-bottom: 6px;
  font-size: 13px;
  font-weight: 600;
  color: #1f2937;
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
