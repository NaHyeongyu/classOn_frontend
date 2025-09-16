import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useNavigate, useParams } from "react-router-dom";
import CalendarDetailHeader from "../components/calendar/detail/CalendarDetailHeader";
import ClassList from "../components/calendar/detail/ClassList";
import CounselList from "../components/calendar/detail/CounselList";
import TodoList from "../components/calendar/detail/TodoList";
import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { GhostBtn as UIGhostBtn, PrimaryBtn as UIPrimaryBtn } from "../components/common/UI";
import { formatYMD } from "../features/calendar/dateUtils";
import { createTodo, deleteTodo, updateTodo } from "../api/todos";
import { listCourses, createCourseRecord } from "../api/courses";
import { invalidateCacheByPrefix } from "../lib/fetcher";
import { useCalendarDetail } from "../hooks/useCalendarDetail";
import { getClassesOn } from "../api/calendar";
import { useTodosByDate } from "../features/todos/useTodosByDate";
import { listStudents } from "../api/students";
import { createCounsel, listCounsels } from "../api/counsels";
import { invalidateTodosCache } from "../features/todos/cache";
import { formatPhone } from "../lib/format";
import { DetailPage, DetailColumns, DetailLeft, DetailRight, } from "../components/calendar/detail/DetailLayout";
export default function CalendarDetail() {
    const navigate = useNavigate();
    const { ymd } = useParams();
    const ymdSafe = ymd ?? formatYMD(new Date());
    const { label, classes: classesDerived, counsels, prevYMD, nextYMD, todayYMD } = useCalendarDetail(ymdSafe);
    const [classes, setClasses] = useState([]);
    const [counselItems, setCounselItems] = useState([]);
    // Add-class modal state
    const [addOpen, setAddOpen] = useState(false);
    const [courseRows, setCourseRows] = useState([]);
    const [courseFilter, setCourseFilter] = useState("");
    const [courseBusy, setCourseBusy] = useState(false);
    const [courseErr, setCourseErr] = useState(null);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [timeStart, setTimeStart] = useState(""); // HH:mm
    const [timeEnd, setTimeEnd] = useState(""); // HH:mm
    const [savingClass, setSavingClass] = useState(false);
    const [addErr, setAddErr] = useState(null);
    function numOr(...vals) {
        for (const v of vals) {
            if (typeof v === 'number' && Number.isFinite(v))
                return v;
        }
        return 0;
    }
    function mapRows(list) {
        return list.map((r) => {
            const s = r.startTime ?? r.start_at ?? r.startAt ?? r.start ?? null;
            const e = r.endTime ?? r.end_at ?? r.endAt ?? r.end ?? null;
            const present = numOr(r.attPresent, r.presentCount, r.attendancePresent, r?.attendance?.present);
            const absent = numOr(r.attAbsent, r.absentCount, r.attendanceAbsent, r?.attendance?.absent);
            return {
                subject: r.courseTitle || '수업',
                time: formatRange(s, e),
                room: '-',
                teacher: '-',
                student: '-',
                done: false,
                courseId: r.courseId || undefined,
                date: r.recordDate || r.date || ymdSafe,
                recordId: r.recordId || r.id,
                notes: r.topic || r.notes || r.content || null,
                attPresent: present,
                attAbsent: absent,
            };
        });
    }
    // Load classes via unified API (same as dashboard)
    useMemo(() => { void 0; }, []);
    useEffect(() => {
        let cancelled = false;
        async function load() {
            try {
                const list = await getClassesOn(ymdSafe);
                if (cancelled)
                    return;
                setClasses(mapRows(list));
            }
            catch (e) {
                if (!cancelled) {
                    // fallback to derived client-side list to avoid blank
                    setClasses(classesDerived);
                }
            }
        }
        void load();
        return () => { cancelled = true; };
    }, [ymdSafe, classesDerived]);
    // Lightweight auto-refresh to catch mobile/other updates
    useEffect(() => {
        let cancelled = false;
        const t = setInterval(async () => {
            try {
                const list = await getClassesOn(ymdSafe);
                if (cancelled)
                    return;
                setClasses(mapRows(list));
            }
            catch { }
        }, 15000);
        return () => { cancelled = true; clearInterval(t); };
    }, [ymdSafe]);
    // Keep local counselItems in sync with hook
    useEffect(() => { setCounselItems(counsels); }, [counsels]);
    // Refresh immediately when the tab becomes visible (e.g., after editing attendance)
    useEffect(() => {
        function onVis() {
            if (document.visibilityState === 'visible') {
                getClassesOn(ymdSafe).then((list) => setClasses(mapRows(list))).catch(() => { });
            }
        }
        document.addEventListener('visibilitychange', onVis);
        return () => document.removeEventListener('visibilitychange', onVis);
    }, [ymdSafe]);
    const { data, error, refresh } = useTodosByDate(ymdSafe);
    const [mutationError, setMutationError] = useState(null);
    const [open, setOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formTitle, setFormTitle] = useState("");
    const [formNotes, setFormNotes] = useState("");
    // 데이터 로딩은 useTodosByDate 훅으로 일원화됨
    async function onAdd() {
        setEditingId(null);
        setFormTitle("");
        setFormNotes("");
        setOpen(true);
    }
    function onEdit(id) {
        const t = (data || []).find((x) => x.id === id);
        if (!t)
            return;
        setEditingId(id);
        setFormTitle(t.title);
        setFormNotes(t.notes || "");
        setOpen(true);
    }
    async function onSubmitModal(e) {
        e.preventDefault();
        if (!formTitle.trim())
            return;
        const calendarDate = ymdSafe;
        try {
            if (editingId == null) {
                const created = await createTodo({
                    title: formTitle.trim(),
                    notes: formNotes || undefined,
                    calendarDate,
                });
                void created; // suppress unused var in no-op since we refresh
                invalidateTodosCache(ymdSafe);
                await refresh();
            }
            else {
                const updated = await updateTodo(editingId, {
                    title: formTitle.trim(),
                    notes: formNotes || undefined,
                });
                void updated;
                invalidateTodosCache(ymdSafe);
                await refresh();
            }
            setOpen(false);
        }
        catch (e) {
            setMutationError(e?.message || "저장에 실패했습니다.");
        }
    }
    // Toggle removed in UI; status changes handled in detail edit or future bulk actions
    async function onDelete(id) {
        try {
            await deleteTodo(id);
            invalidateTodosCache(ymdSafe);
            await refresh();
        }
        catch (e) {
            setMutationError(e?.message || "삭제에 실패했습니다.");
        }
    }
    // Launch add-class modal
    async function onAddClass() {
        setAddOpen(true);
        setAddErr(null);
        if (courseRows.length === 0) {
            setCourseBusy(true);
            setCourseErr(null);
            try {
                const res = await listCourses({ status: "IN_PROGRESS", size: 200 });
                setCourseRows(res.content);
            }
            catch (e) {
                setCourseErr(e?.message || "수업 목록을 불러오지 못했습니다.");
            }
            finally {
                setCourseBusy(false);
            }
        }
    }
    function onPickCourse(c) {
        setSelectedCourse(c);
        const s = toHHMM(c.startTime) || '00:00';
        const e = toHHMM(c.endTime) || '00:00';
        setTimeStart(s);
        setTimeEnd(e);
        try {
            const [sh, sm] = s.split(":");
            setStartHour(sh);
            setStartMin(sm);
        }
        catch { }
        try {
            const [eh, em] = e.split(":");
            setEndHour(eh);
            setEndMin(em);
        }
        catch { }
        setAddErr(null);
    }
    async function onSaveClass() {
        if (!selectedCourse) {
            alert("수업 템플릿을 선택해 주세요.");
            return;
        }
        const start = toHHMMSS(`${(startHour || '00').padStart(2, '0')}:${(startMin || '00').padStart(2, '0')}`);
        const end = toHHMMSS(`${(endHour || '00').padStart(2, '0')}:${(endMin || '00').padStart(2, '0')}`);
        setSavingClass(true);
        setAddErr(null);
        try {
            await createCourseRecord(selectedCourse.id, { recordDate: ymdSafe, startTime: start, endTime: end });
            invalidateCacheByPrefix('/api/calendar/classes');
            const list = await getClassesOn(ymdSafe);
            setClasses(mapRows(list));
            setAddOpen(false);
            setSelectedCourse(null);
        }
        catch (e) {
            const msg = String(e?.message || '');
            if (msg.includes('HTTP 409'))
                setAddErr('이미 등록된 수업이 있습니다.');
            else
                setAddErr('수업 추가에 실패했습니다.');
        }
        finally {
            setSavingClass(false);
        }
    }
    const inProgress = useMemo(() => (data || [])
        .filter((t) => t.status !== "DONE")
        .map((t) => ({
        id: t.id,
        title: t.title,
        content: t.notes,
        done: false,
    })), [data]);
    const done = useMemo(() => (data || [])
        .filter((t) => t.status === "DONE")
        .map((t) => ({
        id: t.id,
        title: t.title,
        content: t.notes,
        done: true,
    })), [data]);
    // Counsel add modal state
    const [counselOpen, setCounselOpen] = useState(false);
    const [students, setStudents] = useState([]);
    const [studFilter, setStudFilter] = useState("");
    const [studBusy, setStudBusy] = useState(false);
    const [studErr, setStudErr] = useState(null);
    const [selStudent, setSelStudent] = useState(null);
    const [counselTime, setCounselTime] = useState(""); // HH:mm
    const [counselNote, setCounselNote] = useState("");
    const [savingCounsel, setSavingCounsel] = useState(false);
    const [counselErr, setCounselErr] = useState(null);
    // Time pickers: hours (00-23) and minutes (00,05,...,55)
    const hours24 = useMemo(() => Array.from({ length: 24 }, (_, h) => String(h).padStart(2, '0')), []);
    const mins5 = useMemo(() => ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'], []);
    // Counsel time (split)
    const [counselHour, setCounselHour] = useState("");
    const [counselMin, setCounselMin] = useState("");
    // Class add time (split)
    const [startHour, setStartHour] = useState("");
    const [startMin, setStartMin] = useState("");
    const [endHour, setEndHour] = useState("");
    const [endMin, setEndMin] = useState("");
    async function onAddCounsel() {
        setCounselOpen(true);
        setCounselErr(null);
        if (!counselTime) {
            const now = nowHHMM5();
            setCounselTime(now);
            try {
                const [hh, mm] = now.split(":");
                setCounselHour(hh);
                setCounselMin(mm);
            }
            catch { }
        }
        else {
            try {
                const [hh, mm] = counselTime.split(":");
                setCounselHour(hh);
                setCounselMin(mm);
            }
            catch { }
        }
        if (students.length === 0) {
            setStudBusy(true);
            setStudErr(null);
            try {
                const res = await listStudents({ status: 'ENROLLED', size: 200 });
                setStudents(res.content);
            }
            catch (e) {
                setStudErr(e?.message || '학생 목록을 불러오지 못했습니다.');
            }
            finally {
                setStudBusy(false);
            }
        }
    }
    function onPickStudent(s) { setSelStudent(s); setCounselErr(null); }
    function isoFromYmdHm(ymd, hm) {
        if (!hm || !/^\d{2}:\d{2}$/.test(hm))
            return `${ymd}T00:00:00`;
        return `${ymd}T${hm}:00`;
    }
    async function onSaveCounsel() {
        if (!selStudent) {
            setCounselErr('학생을 선택해 주세요.');
            return;
        }
        const iso = isoFromYmdHm(ymdSafe, counselTime);
        setSavingCounsel(true);
        setCounselErr(null);
        try {
            await createCounsel({ studentId: selStudent.id, counselTime: iso, content: counselNote || undefined });
            // Refresh counsel list for the day
            const res = await listCounsels({ onYmd: ymdSafe, size: 50 });
            const items = (res.content || []).map(c => ({ id: c.id, studentId: c.studentId, time: c.counselTime.replace('T', ' ').slice(11, 16), title: (c.content || '').split(/\r?\n/)[0] || '상담', with: c.studentName, owner: '-', done: c.status === 'CONVERTED' }));
            setCounselItems(items);
            setCounselOpen(false);
            setSelStudent(null);
            setCounselTime("");
            setCounselNote("");
        }
        catch (e) {
            setCounselErr(e?.message || '상담 추가에 실패했습니다.');
        }
        finally {
            setSavingCounsel(false);
        }
    }
    return (_jsxs(DetailPage, { children: [_jsx(CalendarDetailHeader, { label: label, onBack: () => navigate(-1), onPrev: () => navigate(`/calendar/${prevYMD()}`), onNext: () => navigate(`/calendar/${nextYMD()}`), onToday: () => navigate(`/calendar/${todayYMD()}`) }), _jsxs(DetailColumns, { children: [_jsxs(DetailLeft, { children: [_jsx(ClassList, { items: classes, titleMode: "subject", showNotes: false, onAdd: onAddClass }), _jsx(CounselList, { items: counselItems, onAdd: onAddCounsel, onDetail: (studentId) => navigate(`/students/${studentId}/counsels`) })] }), _jsxs(DetailRight, { children: [_jsx(TodoList, { inProgress: inProgress, done: done, onAdd: onAdd, onDelete: onDelete, onEdit: onEdit }), open && (_jsx(ModalBackdrop, { onClick: () => setOpen(false), children: _jsxs(ModalCard, { onClick: (e) => e.stopPropagation(), children: [_jsx(ModalTitle, { children: editingId == null ? "할 일 추가" : "할 일 수정" }), _jsxs("form", { onSubmit: onSubmitModal, children: [_jsx(Label, { children: "\uC81C\uBAA9" }), _jsx(Input, { value: formTitle, onChange: (e) => setFormTitle(e.target.value), placeholder: "\uC608: \uC0C1\uB2F4 \uC900\uBE44" }), _jsx(Label, { children: "\uBA54\uBAA8 (\uC120\uD0DD)" }), _jsx(TextArea, { rows: 4, value: formNotes, onChange: (e) => setFormNotes(e.target.value), placeholder: "\uC138\uBD80 \uB0B4\uC6A9 \uB610\uB294 \uCC38\uACE0\uC0AC\uD56D" }), _jsxs(BtnRow, { children: [_jsx(UIGhostBtn, { as: "button", onClick: () => setOpen(false), children: "\uCDE8\uC18C" }), _jsx(UIPrimaryBtn, { as: "button", type: "submit", children: "\uC800\uC7A5" })] })] })] }) })), counselOpen && (_jsx(ModalBackdrop, { onClick: () => setCounselOpen(false), children: _jsxs(ModalCard, { onClick: (e) => e.stopPropagation(), children: [_jsx(ModalTitle, { children: "\uC0C1\uB2F4 \uCD94\uAC00" }), _jsx(Label, { children: "\uD559\uC0DD \uC120\uD0DD" }), _jsx(Input, { placeholder: "\uD559\uC0DD \uAC80\uC0C9\u2026", value: studFilter, onChange: (e) => setStudFilter(e.target.value) }), _jsxs(StudentList, { children: [studBusy && _jsx(Muted, { children: "\uBD88\uB7EC\uC624\uB294 \uC911\u2026" }), studErr && _jsx(Err, { children: studErr }), !studBusy && !studErr && ((students || [])
                                                    .filter(s => !studFilter || s.name.toLowerCase().includes(studFilter.toLowerCase()) || (s.code || '').toLowerCase().includes(studFilter.toLowerCase()))
                                                    .map(s => (_jsxs(StudentRow, { type: "button", "data-selected": selStudent?.id === s.id, onClick: () => onPickStudent(s), onKeyDown: (e) => { if (e.key === 'Enter' || e.key === ' ') {
                                                        e.preventDefault();
                                                        onPickStudent(s);
                                                    } }, children: [_jsxs("div", { children: [_jsx("strong", { children: s.name }), _jsx(SmallText, { style: { marginLeft: 8 }, children: s.code })] }), _jsx(SmallText, { children: formatPhone(s.phoneNumber) })] }, s.id))))] }), _jsx("div", { style: { marginTop: 8 }, children: selStudent ? (_jsxs(SelectedBox, { children: [_jsx("span", { className: "label", children: "\uC120\uD0DD\uB41C \uD559\uC0DD" }), _jsx("span", { className: "name", children: selStudent.name }), selStudent.code && _jsx(SmallText, { style: { marginLeft: 6 }, children: selStudent.code })] })) : (_jsx(Muted, { children: "\uD559\uC0DD\uC744 \uC120\uD0DD\uD574 \uC8FC\uC138\uC694." })) }), _jsx(Label, { style: { marginTop: 10 }, children: "\uC2DC\uAC04" }), _jsxs(Row, { children: [_jsx(Select, { "aria-label": "\uC2DC", value: counselHour, onChange: (e) => setCounselHour(e.target.value), children: hours24.map(h => (_jsx("option", { value: h, children: h }, h))) }), _jsx("span", { children: ":" }), _jsx(Select, { "aria-label": "\uBD84", value: counselMin, onChange: (e) => setCounselMin(e.target.value), children: mins5.map(m => (_jsx("option", { value: m, children: m }, m))) })] }), _jsx(Label, { style: { marginTop: 10 }, children: "\uBA54\uBAA8 (\uC120\uD0DD)" }), _jsx(TextArea, { rows: 3, value: counselNote, onChange: (e) => setCounselNote(e.target.value), placeholder: "\uC0C1\uB2F4 \uBA54\uBAA8" }), counselErr && _jsx(Err, { children: counselErr }), _jsxs(BtnRow, { children: [_jsx(UIGhostBtn, { as: "button", onClick: () => setCounselOpen(false), children: "\uCDE8\uC18C" }), _jsx(UIPrimaryBtn, { as: "button", disabled: savingCounsel, onClick: onSaveCounsel, children: savingCounsel ? '저장 중…' : '저장' })] })] }) })), addOpen && (_jsx(ModalBackdrop, { onClick: () => setAddOpen(false), children: _jsxs(ModalCard, { onClick: (e) => e.stopPropagation(), children: [_jsx(ModalTitle, { children: "\uC218\uC5C5 \uCD94\uAC00" }), _jsx(Label, { children: "\uC218\uC5C5 \uD15C\uD50C\uB9BF \uC120\uD0DD" }), _jsx(Input, { placeholder: "\uAC80\uC0C9\uC5B4\uB85C \uD544\uD130\u2026", value: courseFilter, onChange: (e) => setCourseFilter(e.target.value) }), _jsxs(CourseList, { children: [courseBusy && _jsx(Muted, { children: "\uBD88\uB7EC\uC624\uB294 \uC911\u2026" }), courseErr && _jsx(Err, { children: courseErr }), !courseBusy && !courseErr && ((courseRows || [])
                                                    .filter(c => !courseFilter || (c.title?.toLowerCase().includes(courseFilter.toLowerCase()) || c.code?.toLowerCase().includes(courseFilter.toLowerCase())))
                                                    .map(c => (_jsxs(CourseRow, { "data-selected": selectedCourse?.id === c.id, onClick: () => onPickCourse(c), children: [_jsxs("div", { children: [_jsx("strong", { children: c.title }), _jsx(SmallText, { style: { marginLeft: 8 }, children: c.code })] }), _jsx(SmallText, { children: formatRange(c.startTime, c.endTime) })] }, c.id))))] }), _jsx(Label, { style: { marginTop: 10 }, children: "\uC2DC\uAC04" }), _jsxs(Row, { children: [_jsx(Select, { "aria-label": "\uC2DC", value: startHour, onChange: (e) => { const v = e.target.value; setStartHour(v); setTimeStart(`${v}:${(startMin || '00').padStart(2, '0')}`); }, children: hours24.map(h => (_jsx("option", { value: h, children: h }, h))) }), _jsx("span", { children: ":" }), _jsx(Select, { "aria-label": "\uBD84", value: startMin, onChange: (e) => { const v = e.target.value; setStartMin(v); setTimeStart(`${(startHour || '00').padStart(2, '0')}:${v}`); }, children: mins5.map(m => (_jsx("option", { value: m, children: m }, m))) }), _jsx("span", { children: "~" }), _jsx(Select, { "aria-label": "\uC2DC", value: endHour, onChange: (e) => { const v = e.target.value; setEndHour(v); setTimeEnd(`${v}:${(endMin || '00').padStart(2, '0')}`); }, children: hours24.map(h => (_jsx("option", { value: h, children: h }, h))) }), _jsx("span", { children: ":" }), _jsx(Select, { "aria-label": "\uBD84", value: endMin, onChange: (e) => { const v = e.target.value; setEndMin(v); setTimeEnd(`${(endHour || '00').padStart(2, '0')}:${v}`); }, children: mins5.map(m => (_jsx("option", { value: m, children: m }, m))) })] }), addErr && _jsx(Err, { children: addErr }), _jsxs(BtnRow, { children: [_jsx(UIGhostBtn, { as: "button", onClick: () => setAddOpen(false), children: "\uCDE8\uC18C" }), _jsx(UIPrimaryBtn, { as: "button", disabled: savingClass, onClick: onSaveClass, children: savingClass ? '저장 중…' : '저장' })] })] }) })), (error || mutationError) && (_jsx("div", { style: { color: "#b91c1c", marginTop: 8 }, children: mutationError || error }))] })] })] }));
}
const ModalBackdrop = styled.div `
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  display: grid;
  place-items: center;
  z-index: 50;
`;
const ModalCard = styled.div `
  width: 520px;
  max-width: calc(100% - 32px);
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 16px;
`;
const ModalTitle = styled.h3 `
  margin: 0 0 10px;
  font-size: 18px;
  color: #111827;
`;
const Row = styled.div ` display:flex; align-items:center; gap:8px; `;
const CourseList = styled.div ` max-height: 220px; overflow: auto; border: 1px solid #f1f5f9; border-radius: 10px; margin-top: 6px; `;
const CourseRow = styled.div `
  padding: 8px 10px; display:flex; align-items:center; justify-content:space-between; cursor:pointer;
  border-bottom: 1px solid #f1f5f9;
  &[data-selected='true']{ background:#eef2ff; }
  &:hover{ background:#f9fafb; }
`;
// Separate list styles for student picker (use button for better accessibility)
const StudentList = styled(CourseList) ``;
const StudentRow = styled.button `
  width: 100%; text-align: left; background: transparent; border: 0; padding: 8px 10px; display:flex; align-items:center; justify-content:space-between; cursor:pointer;
  border-bottom: 1px solid #f1f5f9;
  &[data-selected='true']{ background:#eef2ff; }
  &:hover{ background:#f9fafb; }
`;
const Err = styled.div ` color:#b91c1c; font-size:12px; margin-top:6px; `;
function hhmm(s) {
    if (!s)
        return "--:--";
    try {
        const str = String(s);
        const m = str.match(/(\d{2}):(\d{2})/);
        return m ? `${m[1]}:${m[2]}` : "--:--";
    }
    catch {
        return "--:--";
    }
}
function formatRange(start, end) {
    return `${hhmm(start)} ~ ${hhmm(end)}`;
}
function toHHMM(s) { if (!s)
    return ""; try {
    const str = String(s);
    const m = str.match(/(\d{2}):(\d{2})/);
    return m ? `${m[1]}:${m[2]}` : "";
}
catch {
    return "";
} }
function toHHMMSS(s) { if (!s)
    return undefined; const [h, m] = s.split(":"); return `${h?.padStart(2, '0')}:${m?.padStart(2, '0')}:00`; }
function buildTimes5() { const out = []; for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 5) {
        out.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
    }
} return out; }
function nowHHMM5() { const d = new Date(); let h = d.getHours(), m = d.getMinutes(); const r = Math.round(m / 5) * 5; if (r === 60) {
    h = (h + 1) % 24;
    m = 0;
}
else
    m = r; return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`; }
const Label = styled.label `
  display: block;
  margin: 8px 0 6px;
  font-size: 12px;
  color: #6b7280;
`;
const Input = styled.input `
  width: 100%;
  height: 40px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 0 12px;
`;
const Select = styled.select `
  width: 100%;
  height: 40px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 0 8px;
  background: #fff;
`;
const TextArea = styled.textarea `
  width: 100%;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 8px 12px;
  resize: vertical;
`;
const BtnRow = styled.div `
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 12px;
`;
// Buttons from common UI
const SmallText = styled.span ` color:#9ca3af; font-size:12px; `;
const Muted = styled.div ` color:#6b7280; font-size:12px; `;
const SelectedBox = styled.div `
  display: inline-flex; align-items: center; gap: 8px; padding: 6px 10px; border:1px solid #c7d2fe; background:#eef2ff; color:#1f2937; border-radius: 8px; font-size: 13px;
  .label { color:#4f46e5; font-weight: 800; }
  .name { font-weight: 800; }
`;
