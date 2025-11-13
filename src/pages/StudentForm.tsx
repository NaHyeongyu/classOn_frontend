import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useStudentForm } from "@/features/studentForm/useStudentForm";
import { StudentFormHeader } from "@/components/studentForm/StudentFormHeader";
import { StudentFormMain } from "@/components/studentForm/StudentFormMain";
import { StudentFormSidebar } from "@/components/studentForm/StudentFormSidebar";
import { StudentFormSkeleton } from "@/components/studentForm/StudentFormSkeleton";
import {
  Page,
  Form as FormRoot,
  FormLayout,
  MainColumn,
  AlertError,
  AlertOk,
} from "@/components/studentForm/StudentForm.styles";
import { useAuth } from "@/hooks/useAuth";

export default function StudentForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isTeacher = (user?.role ?? "").toString().toUpperCase() === "TEACHER";
  const nameInputRef = useRef<HTMLInputElement | null>(null);

  const studentId = useMemo(() => {
    if (!id) return null;
    const numeric = Number(id);
    return Number.isFinite(numeric) ? numeric : null;
  }, [id]);

  const flow = useStudentForm({
    studentId,
    focusNameInput: () => nameInputRef.current?.focus(),
  });

  // Guard: teachers cannot open create form
  useEffect(() => {
    if (isTeacher && !studentId) {
      navigate("/students", { replace: true });
    }
  }, [isTeacher, studentId, navigate]);

  const [success, setSuccess] = useState<string | null>(null);

  async function submit(event?: React.FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    setSuccess(null);
    const result = await flow.handleSubmit(event);
    if (!result) return;
    setSuccess(
      result.mode === "create"
        ? "원생이 추가되었습니다."
        : "수정이 완료되었습니다."
    );
    navigate(`/students/${result.student.id}`, { replace: true });
  }

  return (
    <Page>
      <StudentFormHeader
        isEdit={flow.isEdit}
        saving={flow.saving}
        onSaveClick={() => {
          const formEl = document.getElementById(
            "student-form"
          ) as HTMLFormElement | null;
          if (!formEl) {
            void submit();
            return;
          }
          try {
            if (typeof formEl.requestSubmit === "function") {
              formEl.requestSubmit();
              return;
            }
          } catch {
            // Ignore requestSubmit failures and use React handler instead
          }
          void submit();
        }}
      />

      {flow.error ? <AlertError>{flow.error}</AlertError> : null}
      {success ? <AlertOk>{success}</AlertOk> : null}

      {flow.loading ? (
        <StudentFormSkeleton />
      ) : (
        <FormRoot
          id="student-form"
          onSubmit={(event) => {
            void submit(event);
          }}
        >
          <FormLayout>
            <MainColumn>
              <StudentFormMain flow={flow} nameInputRef={nameInputRef} />
            </MainColumn>
            <StudentFormSidebar flow={flow} />
          </FormLayout>
        </FormRoot>
      )}
    </Page>
  );
}
