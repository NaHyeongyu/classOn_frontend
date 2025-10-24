import { useCallback, useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  createStudent,
  getStudent,
  updateStudent,
  type Student,
  type StudentPayload,
} from "@/api/students";
import { readableError } from "@/lib/errors";

const DEFAULT_STATUS: Student["status"] = "ENROLLED";
const STATUS_LABEL_FALLBACK = "미지정";
const STATUS_COPY_FALLBACK = "현재 수업 상태를 선택하세요.";

const STATUS_LABEL: Record<Student["status"], string> = {
  ENROLLED: "수강중",
  ON_LEAVE: "휴학",
  PENDING: "대기중",
};

const STATUS_COPY: Record<Student["status"], string> = {
  ENROLLED: "현재 수업을 듣고 있는 원생입니다.",
  ON_LEAVE: "일시 휴학 상태로 관리됩니다.",
  PENDING: "상담/등록 대기 중인 원생입니다.",
};

const STATUS_OPTIONS: Array<{
  value: Student["status"];
  label: string;
}> = [
  { value: "ENROLLED", label: "수강중" },
  { value: "ON_LEAVE", label: "휴학" },
  { value: "PENDING", label: "대기중" },
];

type SubmitResult = {
  student: Student;
  mode: "create" | "update";
};

type UseStudentFormOptions = {
  studentId: number | null;
  focusNameInput?: () => void;
};

export function useStudentForm({
  studentId,
  focusNameInput,
}: UseStudentFormOptions) {
  const isEdit = useMemo(() => Number.isFinite(studentId), [studentId]);
  const queryClient = useQueryClient();

  const today = useCallback(() => {
    const d = new Date();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${d.getFullYear()}-${mm}-${dd}`;
  }, []);

  const [form, setForm] = useState<StudentPayload>({
    name: "",
    status: DEFAULT_STATUS,
    joinedDate: today(),
  });
  const [dobY, setDobY] = useState("");
  const [dobM, setDobM] = useState("");
  const [dobD, setDobD] = useState("");

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErr, setFieldErr] = useState<{ name?: string }>({});
  const [touched, setTouched] = useState<{ name?: boolean }>({});

  useEffect(() => {
    if (!isEdit || !studentId) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const student = await getStudent(studentId);
        if (cancelled) return;
        setForm({
          name: student.name,
          status: student.status,
          age: student.age,
          phoneNumber: student.phoneNumber,
          guardianPhone: student.guardianPhone,
          joinedDate: student.joinedDate ?? student.createdAt?.slice(0, 10),
          birthDate: student.birthDate,
          address: student.address,
          parentName: student.parentName,
        });
        if (student.birthDate) {
          const [y, m, d] = student.birthDate.split("-");
          setDobY(y || "");
          setDobM(m || "");
          setDobD(d || "");
        } else {
          setDobY("");
          setDobM("");
          setDobD("");
        }
      } catch (err) {
        if (!cancelled) {
          setError(readableError(err, "원생 정보를 불러오지 못했습니다."));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isEdit, studentId]);

  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 40 }, (_, i) => String(currentYear - i));
  }, []);

  const months = useMemo(
    () => Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0")),
    []
  );

  const daysInMonth = useCallback((y?: string, m?: string) => {
    const yy = Number(y);
    const mm = Number(m);
    if (!yy || !mm) return 31;
    return new Date(yy, mm, 0).getDate();
  }, []);

  const days = useMemo(
    () =>
      Array.from({ length: daysInMonth(dobY, dobM) }, (_, i) =>
        String(i + 1).padStart(2, "0")
      ),
    [dobY, dobM, daysInMonth]
  );

  const updateDOB = useCallback(
    (y?: string, m?: string, d?: string) => {
      const nextY = y ?? dobY;
      const nextM = m ?? dobM;
      const nextD = d ?? dobD;
      setDobY(nextY);
      setDobM(nextM);
      setDobD(nextD);
      setForm((prev) => ({
        ...prev,
        birthDate:
          nextY && nextM && nextD ? `${nextY}-${nextM}-${nextD}` : undefined,
      }));
    },
    [dobD, dobM, dobY]
  );

  const parseYMD = useCallback((value: string) => {
    const [y, m, d] = value.split("-").map((part) => Number(part));
    if (!y || !m || !d) return null;
    return { y, m, d };
  }, []);

  const intlAge = useMemo(() => {
    const birth = form.birthDate;
    if (!birth) return undefined;
    const parts = parseYMD(birth);
    if (!parts) return undefined;
    const now = new Date();
    let age = now.getFullYear() - parts.y;
    const month = now.getMonth() + 1;
    const day = now.getDate();
    if (month < parts.m || (month === parts.m && day < parts.d)) age -= 1;
    return age;
  }, [form.birthDate, parseYMD]);

  const koreanAge = useMemo(() => {
    const birth = form.birthDate;
    if (!birth) return undefined;
    const parts = parseYMD(birth);
    if (!parts) return undefined;
    const now = new Date();
    return now.getFullYear() - parts.y + 1;
  }, [form.birthDate, parseYMD]);

  const currentStatus = (form.status ?? DEFAULT_STATUS) as Student["status"];
  const currentStatusLabel =
    STATUS_LABEL[currentStatus] ?? STATUS_LABEL_FALLBACK;
  const currentStatusCopy = STATUS_COPY[currentStatus] ?? STATUS_COPY_FALLBACK;

  const handleSubmit = useCallback(
    async (event?: React.FormEvent<HTMLFormElement>): Promise<SubmitResult | null> => {
      event?.preventDefault();
      setError(null);
      if (!form.name || !form.name.trim()) {
        setFieldErr((prev) => ({ ...prev, name: "이름은 필수입니다." }));
        setTouched((prev) => ({ ...prev, name: true }));
        focusNameInput?.();
        return null;
      }
      setSaving(true);
      try {
        const payload: StudentPayload = {
          ...form,
          name: form.name.trim(),
          status: form.status || DEFAULT_STATUS,
        };
        if (intlAge != null) payload.age = intlAge;
        let saved: Student;
        if (isEdit && studentId) {
          saved = await updateStudent(studentId, payload);
          void queryClient.invalidateQueries({ queryKey: ["students"] });
          void queryClient.invalidateQueries({ queryKey: ["dashboard", "summary"] });
          return { student: saved, mode: "update" };
        }
        saved = await createStudent(payload);
        void queryClient.invalidateQueries({ queryKey: ["students"] });
        void queryClient.invalidateQueries({ queryKey: ["dashboard", "summary"] });
        return { student: saved, mode: "create" };
      } catch (err) {
        setError(readableError(err, "저장에 실패했습니다."));
        return null;
      } finally {
        setSaving(false);
      }
    },
    [focusNameInput, form, intlAge, isEdit, queryClient, studentId]
  );

  return {
    isEdit,
    form,
    setForm,
    loading,
    saving,
    error,
    setError,
    fieldErr,
    setFieldErr,
    touched,
    setTouched,
    statusOptions: STATUS_OPTIONS,
    currentStatus,
    currentStatusLabel,
    currentStatusCopy,
    statusLabelFallback: STATUS_LABEL_FALLBACK,
    statusCopyFallback: STATUS_COPY_FALLBACK,
    intlAge,
    koreanAge,
    dob: {
      y: dobY,
      m: dobM,
      d: dobD,
      years,
      months,
      days,
      update: updateDOB,
    },
    handleSubmit,
  };
}
