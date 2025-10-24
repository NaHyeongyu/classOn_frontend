import { useCallback, useEffect, useMemo, useState } from "react";
import { createCounsel, listCounsels, type Counsel, type PageResult as PageCounsel } from "@/api/counsels";
import { listStudents, type Student } from "@/api/students";
import type { CounselItem } from "@/types/calendarDetail";
import { readableError } from "@/lib/errors";

type UseCalendarDetailCounselOptions = {
  ymd: string;
  initialCounsels: CounselItem[];
};

export function useCalendarDetailCounsel({ ymd, initialCounsels }: UseCalendarDetailCounselOptions) {
  const [items, setItems] = useState<CounselItem[]>(initialCounsels);
  useEffect(() => {
    setItems(initialCounsels);
  }, [initialCounsels]);

  const [open, setOpen] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [studFilter, setStudFilter] = useState("");
  const [studBusy, setStudBusy] = useState(false);
  const [studErr, setStudErr] = useState<string | null>(null);
  const [selStudent, setSelStudent] = useState<Student | null>(null);
  const [counselNote, setCounselNote] = useState("");
  const [savingCounsel, setSavingCounsel] = useState(false);
  const [counselErr, setCounselErr] = useState<string | null>(null);
  const [counselHour, setCounselHour] = useState<string>("");
  const [counselMin, setCounselMin] = useState<string>("");

  const hours24 = useMemo(
    () => Array.from({ length: 24 }, (_, hour) => String(hour).padStart(2, "0")),
    [],
  );
  const mins5 = useMemo(
    () => ["00", "05", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55"],
    [],
  );

  const fetchStudentsList = useCallback(async () => {
    setStudBusy(true);
    setStudErr(null);
    try {
      const res = await listStudents({ status: "ENROLLED", size: 200 });
      setStudents(res.content);
    } catch (error) {
      setStudErr(readableError(error, "학생 목록을 불러오지 못했습니다."));
    } finally {
      setStudBusy(false);
    }
  }, []);

  const openModal = () => {
    setOpen(true);
    setCounselErr(null);
    setCounselHour("");
    setCounselMin("");
    void fetchStudentsList();
  };

  const closeModal = () => {
    setOpen(false);
  };

  const pickStudent = (student: Student) => {
    setSelStudent(student);
    setCounselErr(null);
  };

  const IsoFromYmdHm = (ymdValue: string, hm: string) => {
    if (!hm || !/^\d{2}:\d{2}$/.test(hm)) return `${ymdValue}T00:00:00`;
    return `${ymdValue}T${hm}:00`;
  };

  const refreshCounsels = useCallback(
    async (ymdValue: string) => {
      const res: PageCounsel<Counsel> = await listCounsels({ onYmd: ymdValue, size: 50 });
      const mapped: CounselItem[] = (res.content || []).map((counsel) => ({
        id: counsel.id,
        studentId: counsel.studentId,
        time: counsel.counselTime.replace("T", " ").slice(11, 16),
        title: (counsel.content || "").split(/\r?\n/)[0] || "상담",
        with: counsel.studentName,
        owner: "-",
        done: counsel.status === "CONVERTED",
      }));
      setItems(mapped);
    },
    [],
  );

  const saveCounsel = async () => {
    if (!selStudent) {
      setCounselErr("학생을 선택해 주세요.");
      return;
    }
    const hm = counselHour && counselMin ? `${counselHour}:${counselMin}` : "";
    if (!hm) {
      setCounselErr("시간을 선택해 주세요.");
      return;
    }
    const iso = IsoFromYmdHm(ymd, hm);
    setSavingCounsel(true);
    setCounselErr(null);
    try {
      await createCounsel({
        studentId: selStudent.id,
        counselTime: iso,
        content: counselNote || undefined,
      });
      await refreshCounsels(ymd);
      setOpen(false);
      setSelStudent(null);
      setCounselNote("");
    } catch (error) {
      setCounselErr(readableError(error, "상담 추가에 실패했습니다."));
    } finally {
      setSavingCounsel(false);
    }
  };

  return {
    items,
    open,
    students,
    studFilter,
    studBusy,
    studErr,
    selStudent,
    counselHour,
    counselMin,
    counselNote,
    counselErr,
    savingCounsel,
    hours24,
    mins5,
    onAddCounsel: openModal,
    onCloseCounsel: closeModal,
    onChangeFilter: setStudFilter,
    onChangeHour: setCounselHour,
    onChangeMin: setCounselMin,
    onChangeNote: setCounselNote,
    onPickStudent: pickStudent,
    onSaveCounsel: saveCounsel,
  };
}
