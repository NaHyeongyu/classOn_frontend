import { jsxs as _jsxs, jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { TableBase as UITable, GhostBtn as UIGhostBtn, PrimaryBtn as UIPrimaryBtn } from "../components/common/UI";
import ConfirmDialog from "../components/common/ConfirmDialog";
import { listCounsels, createCounsel, updateCounsel, deleteCounsel } from "../api/counsels";
import { getStudent, getStudentAttendance } from "../api/students";
import { formatPhone } from "../lib/format";
export default function StudentDetail() {
    const navigate = useNavigate();
    const { id, tab: tabParam } = useParams();
    const numericId = useMemo(() => Number(id), [id]);
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [notes, setNotes] = useState("");
    const [editingNotes, setEditingNotes] = useState(false);
    const [notesInput, setNotesInput] = useState("");
    const [memos, setMemos] = useState([]);
    const [newMemo, setNewMemo] = useState("");
    const [editingMemoId, setEditingMemoId] = useState(null);
    const [editingMemoText, setEditingMemoText] = useState("");
    // Attendance state
    const [attRows, setAttRows] = useState([]);
    const [attLoading, setAttLoading] = useState(false);
    const [attError, setAttError] = useState(null);
    // Payments (history) – placeholder state, default empty
    const [payments] = useState([]);
    // Counsels state (loaded per student)
    const [counsels, setCounsels] = useState([]);
    const [counselLoading, setCounselLoading] = useState(false);
    const [counselError, setCounselError] = useState(null);
    const [addingCounsel, setAddingCounsel] = useState(false);
    const [newWhen, setNewWhen] = useState(""); // datetime-local
    const [newContent, setNewContent] = useState("");
    const [newSubmitting, setNewSubmitting] = useState(false);
    // Edit existing counsel
    const [editingCounselId, setEditingCounselId] = useState(null);
    const [confirmCounselId, setConfirmCounselId] = useState(null);
    const [confirmCounselBusy, setConfirmCounselBusy] = useState(false);
    const [editWhen, setEditWhen] = useState("");
    const [editContent, setEditContent] = useState("");
    const [savingEdit, setSavingEdit] = useState(false);
    const intlAge = useMemo(() => {
        if (!student?.birthDate)
            return undefined;
        const [y, m, d] = student.birthDate.split("-").map(Number);
        if (!y || !m || !d)
            return undefined;
        const now = new Date();
        let age = now.getFullYear() - y;
        const mm = now.getMonth() + 1;
        const dd = now.getDate();
        if (mm < m || (mm === m && dd < d))
            age -= 1;
        return age;
    }, [student?.birthDate]);
    // koreanAge removed (unused)
    const activeTab = useMemo(() => {
        switch (tabParam) {
            case "courses":
            case "attendance":
            case "payments":
            case "counsels":
                return tabParam;
            default:
                return "courses";
        }
    }, [tabParam]);
    function courseStatusLabel(s) {
        switch (s) {
            case "IN_PROGRESS": return "진행중";
            case "PENDING": return "대기";
            case "STOPPED": return "중단";
            default: return s;
        }
    }
    useEffect(() => {
        if (!numericId || Number.isNaN(numericId))
            return;
        let cancelled = false;
        async function load() {
            setLoading(true);
            setError(null);
            try {
                const res = await getStudent(numericId);
                if (!cancelled)
                    setStudent(res);
            }
            catch (e) {
                if (!cancelled)
                    setError(e?.message || "원생 정보를 불러오지 못했습니다.");
            }
            finally {
                if (!cancelled)
                    setLoading(false);
            }
        }
        void load();
        return () => { cancelled = true; };
    }, [numericId]);
    // Load counsels when switching to the tab or student changes
    useEffect(() => {
        if (!numericId || activeTab !== "counsels")
            return;
        let cancelled = false;
        async function load() {
            setCounselLoading(true);
            setCounselError(null);
            try {
                const res = await listCounsels({ studentId: numericId, size: 100 });
                if (!cancelled)
                    setCounsels(res.content || []);
            }
            catch (e) {
                if (!cancelled)
                    setCounselError(e?.message || "상담 기록을 불러오지 못했습니다.");
            }
            finally {
                if (!cancelled)
                    setCounselLoading(false);
            }
        }
        void load();
        return () => { cancelled = true; };
    }, [numericId, activeTab]);
    // Load saved notes from localStorage (temporary persistence until API exists)
    useEffect(() => {
        if (!numericId)
            return;
        try {
            const saved = localStorage.getItem(`student:notes:${numericId}`) || "";
            setNotes(saved);
            setNotesInput(saved);
        }
        catch { }
    }, [numericId]);
    // Load memo list
    useEffect(() => {
        if (!numericId)
            return;
        try {
            const raw = localStorage.getItem(`student:memos:${numericId}`);
            const arr = raw ? JSON.parse(raw) : [];
            setMemos(Array.isArray(arr) ? arr : []);
        }
        catch {
            setMemos([]);
        }
    }, [numericId]);
    // Load attendance when tab is active
    useEffect(() => {
        if (!numericId || activeTab !== 'attendance')
            return;
        let cancelled = false;
        async function load() {
            setAttLoading(true);
            setAttError(null);
            try {
                const list = await getStudentAttendance(numericId, { size: 200 });
                if (!cancelled)
                    setAttRows(list || []);
            }
            catch (e) {
                if (!cancelled)
                    setAttError(e?.message || '출석 정보를 불러오지 못했습니다.');
            }
            finally {
                if (!cancelled)
                    setAttLoading(false);
            }
        }
        void load();
        return () => { cancelled = true; };
    }, [numericId, activeTab]);
    function saveNotes() {
        if (!numericId)
            return;
        const text = (notesInput || "").trim();
        setNotes(text);
        setEditingNotes(false);
        try {
            localStorage.setItem(`student:notes:${numericId}`, text);
        }
        catch { }
    }
    function persistMemos(next) {
        setMemos(next);
        try {
            localStorage.setItem(`student:memos:${numericId}`, JSON.stringify(next));
        }
        catch { }
    }
    function addMemo() {
        if (!numericId)
            return;
        const text = (newMemo || "").trim();
        if (!text)
            return;
        const now = new Date().toISOString();
        const item = { id: Date.now(), text, createdAt: now };
        persistMemos([item, ...memos]);
        setNewMemo("");
    }
    function beginEditMemo(id) {
        const found = memos.find(m => m.id === id);
        if (!found)
            return;
        setEditingMemoId(id);
        setEditingMemoText(found.text);
    }
    function saveEditMemo() {
        if (editingMemoId == null)
            return;
        const text = (editingMemoText || "").trim();
        const now = new Date().toISOString();
        const next = memos.map(m => m.id === editingMemoId ? { ...m, text, updatedAt: now } : m);
        persistMemos(next);
        setEditingMemoId(null);
        setEditingMemoText("");
    }
    function cancelEditMemo() {
        setEditingMemoId(null);
        setEditingMemoText("");
    }
    function removeMemo(id) {
        const next = memos.filter(m => m.id !== id);
        persistMemos(next);
    }
    async function onSubmitNewCounsel() {
        if (!numericId || !newWhen)
            return;
        setNewSubmitting(true);
        setCounselError(null);
        try {
            await createCounsel({ studentId: numericId, counselTime: fromLocalInput(newWhen), content: newContent || undefined });
            const res = await listCounsels({ studentId: numericId, size: 100 });
            setCounsels(res.content || []);
            setAddingCounsel(false);
            setNewWhen("");
            setNewContent("");
        }
        catch (e) {
            setCounselError(e?.message || '저장에 실패했습니다.');
        }
        finally {
            setNewSubmitting(false);
        }
    }
    async function onSaveEdit(id) {
        if (!editWhen)
            return;
        setSavingEdit(true);
        setCounselError(null);
        try {
            await updateCounsel(id, { counselTime: fromLocalInput(editWhen), content: editContent || undefined });
            const res = await listCounsels({ studentId: numericId, size: 100 });
            setCounsels(res.content || []);
            setEditingCounselId(null);
            setEditWhen("");
            setEditContent("");
        }
        catch (e) {
            setCounselError(e?.message || '수정에 실패했습니다.');
        }
        finally {
            setSavingEdit(false);
        }
    }
    return (_jsxs(Page, { children: [_jsxs(TopBar, { children: [_jsxs(BackBtn, { type: "button", onClick: () => navigate("/students"), children: [leftIcon, " \uB4A4\uB85C"] }), _jsx("h2", { children: "\uC6D0\uC0DD \uC0C1\uC138" })] }), loading && (_jsxs(Columns, { children: [_jsxs(Left, { children: [_jsxs(Card, { children: [_jsx(SectionTitle, { children: "\uAE30\uBCF8 \uC815\uBCF4" }), _jsxs(SkeletonRow, { children: [_jsx(AvatarSkeleton, {}), _jsxs("div", { children: [_jsx(Skeleton, { w: 140, h: 18 }), _jsx(Skeleton, { w: 120, h: 12, mt: 6 })] }), _jsx(SkeletonChip, {})] }), _jsx(SkField, {}), _jsx(SkField, {}), _jsx(SkField, {}), _jsx(SkField, {})] }), _jsxs(Card, { children: [_jsx(SectionTitle, { children: "\uBD80\uBAA8\uB2D8 \uC815\uBCF4" }), _jsx(SkField, {}), _jsx(SkField, {})] })] }), _jsx(Right, { children: _jsxs(Card, { children: [_jsx(MiniHead, { children: _jsxs(Tabs, { children: [_jsxs(TabButton, { "data-active": true, children: ["\uC218\uAC15\uC218\uC5C5 ", _jsx(Badge, { children: "0" })] }), _jsx(TabButton, { children: "\uCD9C\uC11D\uD604\uD669" }), _jsx(TabButton, { children: "\uACB0\uC81C \uB0B4\uC5ED" }), _jsx(TabButton, { children: "\uC0C1\uB2F4\uAE30\uB85D" })] }) }), _jsx(Divider, {}), _jsxs(SectionBody, { children: [_jsx(Skeleton, { w: 240, h: 14 }), _jsx(Skeleton, { w: 560, h: 120, mt: 10 })] })] }) })] })), error && _jsx(Error, { children: error }), !loading && (_jsxs(Columns, { children: [_jsxs(Left, { children: [_jsxs(Card, { children: [_jsxs(CardHead, { children: [_jsx(SectionTitle, { children: "\uAE30\uBCF8 \uC815\uBCF4" }), _jsx(CardActions, { children: _jsx(UIGhostBtn, { as: "button", onClick: () => navigate(`/students/${numericId}/edit`), children: "\uC218\uC815" }) })] }), student ? (_jsx(_Fragment, { children: _jsxs(InfoList, { children: [_jsxs(Row, { children: [_jsx(Avatar, { children: student.name.slice(0, 1) }), _jsxs("div", { children: [_jsx(Name, { children: student.name }), _jsxs(SmallMuted, { children: ["\uCF54\uB4DC ", student.code, " \u00B7 ID ", student.id] })] }), _jsx(StatusChip, { "data-type": student.status, children: student.status === "ENROLLED" ? "수강중" : student.status === "ON_LEAVE" ? "휴학" : "대기중" })] }), _jsxs(Field, { children: [_jsx(Label, { children: "\uC5F0\uB77D\uCC98" }), _jsx(Value, { children: formatPhone(student.phoneNumber) })] }), _jsxs(Field, { children: [_jsx(Label, { children: "\uC0DD\uB144\uC6D4\uC77C" }), _jsxs(Value, { children: [student.birthDate || "-", student.birthDate ? (_jsxs(_Fragment, { children: [" ", `(만 ${intlAge ?? "-"}세)`] })) : null] })] }), _jsxs(Field, { children: [_jsx(Label, { children: "\uC8FC\uC18C" }), _jsx(Value, { children: student.address || "-" })] }), _jsxs(Field, { children: [_jsx(Label, { children: "\uB4F1\uB85D\uC77C" }), _jsx(Value, { children: student.joinedDate || student.createdAt?.slice(0, 10) || "-" })] })] }) })) : (_jsx(Muted, { children: "\uC6D0\uC0DD \uC815\uBCF4\uB97C \uCC3E\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4." }))] }), _jsxs(Card, { children: [_jsx(CardHead, { children: _jsx(SectionTitle, { children: "\uBD80\uBAA8\uB2D8 \uC815\uBCF4" }) }), student ? (_jsxs(InfoList, { children: [_jsxs(Field, { children: [_jsx(Label, { children: "\uBCF4\uD638\uC790 \uC774\uB984" }), _jsx(Value, { children: student.parentName || "-" })] }), _jsxs(Field, { children: [_jsx(Label, { children: "\uBCF4\uD638\uC790 \uC5F0\uB77D\uCC98" }), _jsx(Value, { children: formatPhone(student.guardianPhone) })] })] })) : (_jsx(Muted, { children: "\uBD80\uBAA8\uB2D8 \uC815\uBCF4\uB97C \uCC3E\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4." }))] }), _jsxs(Card, { children: [_jsxs(CardHead, { children: [_jsx(SectionTitle, { children: "\uD2B9\uC774\uC0AC\uD56D" }), _jsx(CardActions, { children: editingNotes ? (_jsxs(_Fragment, { children: [_jsx(ModalBtn, { type: "button", onClick: () => { setEditingNotes(false); setNotesInput(notes); }, children: "\uCDE8\uC18C" }), _jsx(UIPrimaryBtn, { as: "button", onClick: saveNotes, children: "\uC800\uC7A5" })] })) : (_jsx(UIGhostBtn, { as: "button", onClick: () => setEditingNotes(true), children: notes ? "편집" : "메모 추가" })) })] }), editingNotes ? (_jsx(NotesTextarea, { rows: 8, value: notesInput, onChange: (e) => setNotesInput(e.target.value), placeholder: "\uC608: \uACFC\uD559\uACE0 \uC9C4\uD559 \uAD00\uC2EC, \uC218\uD559 \uC57D\uC810 \uBCF4\uC644 \uD544\uC694, \uC54C\uB7EC\uC9C0 \uB4F1" })) : (_jsx(_Fragment, { children: notes ? (_jsx(NotesBox, { title: notes, children: notes })) : (_jsx(Empty, { children: "\uD2B9\uC774\uC0AC\uD56D\uC774 \uC5C6\uC2B5\uB2C8\uB2E4. \uBA54\uBAA8\uB97C \uCD94\uAC00\uD574 \uC8FC\uC138\uC694." })) }))] }), _jsxs(Card, { children: [_jsxs(CardHead, { children: [_jsx(SectionTitle, { children: "\uBA54\uBAA8 \uC0AC\uD56D" }), _jsx(CardActions, { children: _jsx(UIGhostBtn, { as: "button", onClick: addMemo, children: "\uCD94\uAC00" }) })] }), _jsx(MemoNew, { children: _jsx(MemoTextarea, { rows: 3, value: newMemo, onChange: (e) => setNewMemo(e.target.value), placeholder: "\uBA54\uBAA8\uB97C \uC785\uB825\uD558\uC138\uC694" }) }), _jsxs(MemoList, { children: [memos.length === 0 && (_jsx(Empty, { children: "\uBA54\uBAA8\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4. \uBA54\uBAA8\uB97C \uCD94\uAC00\uD574 \uC8FC\uC138\uC694." })), memos.map(m => (_jsxs(MemoItemBox, { children: [_jsxs(MemoHeader, { children: [_jsxs(MemoDate, { children: [formatDate(m.updatedAt || m.createdAt), m.updatedAt ? _jsx("span", { style: { marginLeft: 6, color: '#6b7280' }, children: "(\uC218\uC815\uB428)" }) : null] }), _jsx(MemoActions, { children: editingMemoId === m.id ? (_jsxs(_Fragment, { children: [_jsx(ModalBtn, { type: "button", onClick: cancelEditMemo, children: "\uCDE8\uC18C" }), _jsx(UIPrimaryBtn, { as: "button", onClick: saveEditMemo, children: "\uC800\uC7A5" })] })) : (_jsxs(_Fragment, { children: [_jsx(ModalBtn, { type: "button", onClick: () => beginEditMemo(m.id), children: "\uD3B8\uC9D1" }), _jsx(ModalBtn, { type: "button", onClick: () => removeMemo(m.id), children: "\uC0AD\uC81C" })] })) })] }), editingMemoId === m.id ? (_jsx(MemoTextarea, { rows: 4, value: editingMemoText, onChange: (e) => setEditingMemoText(e.target.value) })) : (_jsx(MemoText, { children: m.text }))] }, m.id)))] })] })] }), _jsx(Right, { children: _jsxs(Card, { children: [_jsx(MiniHead, { children: _jsxs(Tabs, { children: [_jsxs(TabButton, { "data-active": activeTab === "courses", onClick: () => navigate(`/students/${numericId}/courses`), children: ["\uC218\uAC15\uC218\uC5C5 ", _jsx(Badge, { children: student?.courses?.length ?? 0 })] }), _jsx(TabButton, { "data-active": activeTab === "attendance", onClick: () => navigate(`/students/${numericId}/attendance`), children: "\uCD9C\uC11D\uD604\uD669" }), _jsx(TabButton, { "data-active": activeTab === "payments", onClick: () => navigate(`/students/${numericId}/payments`), children: "\uACB0\uC81C \uB0B4\uC5ED" }), _jsx(TabButton, { "data-active": activeTab === "counsels", onClick: () => navigate(`/students/${numericId}/counsels`), children: "\uC0C1\uB2F4\uAE30\uB85D" })] }) }), _jsx(Divider, {}), activeTab === "courses" && (_jsx(SectionBody, { children: student?.courses?.length ? (_jsx(CourseList, { children: student.courses.map((c) => (_jsxs(CourseItem, { children: [_jsxs(CourseHeader, { children: [_jsx(CourseTitle, { children: c.title }), _jsx(ModalBtn, { type: "button", onClick: () => navigate(`/classes/${c.id}`), children: "\uC0C1\uC138" })] }), _jsxs(CourseMeta, { children: [_jsx("code", { children: c.code }), _jsx(CourseStatus, { "data-type": c.status, children: courseStatusLabel(c.status) })] })] }, c.id))) })) : (_jsx(Empty, { children: "\uC218\uAC15 \uC911\uC778 \uC218\uC5C5\uC774 \uC5C6\uC2B5\uB2C8\uB2E4." })) })), activeTab === "attendance" && (_jsxs(SectionBody, { children: [attError && _jsx(Error, { children: attError }), _jsxs(Subgrid, { children: [_jsxs(SmallCard, { children: [_jsx(SmallTitle, { children: "\uC774\uBC88 \uB2EC \uCD9C\uC11D\uB960" }), _jsx(KPI, { children: formatMonthRate(attRows) }), _jsx(SmallMuted, { children: formatMonthCounts(attRows) })] }), _jsxs(SmallCard, { children: [_jsx(SmallTitle, { children: "\uCD5C\uADFC \uACB0\uC11D" }), _jsx(SmallMuted, { children: formatRecentAbsents(attRows) })] })] }), attLoading ? (_jsx(Muted, { children: "\uBD88\uB7EC\uC624\uB294 \uC911..." })) : (_jsxs(UITable, { style: { minWidth: 640 }, children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "\uB0A0\uC9DC" }), _jsx("th", { children: "\uACFC\uBAA9" }), _jsx("th", { children: "\uC0C1\uD0DC" }), _jsx("th", { children: "\uBA54\uBAA8" })] }) }), _jsx("tbody", { children: attRows.length === 0 ? (_jsx("tr", { children: _jsx("td", { colSpan: 4, children: _jsx(Muted, { children: "\uCD9C\uC11D \uAE30\uB85D\uC774 \uC5C6\uC2B5\uB2C8\uB2E4." }) }) })) : (attRows.map((r, i) => (_jsxs("tr", { children: [_jsx("td", { children: r.date }), _jsx("td", { children: r.courseTitle }), _jsx("td", { children: r.present ? '출석' : '결석' }), _jsx("td", { children: r.reason || '-' })] }, i)))) })] }))] })), activeTab === "payments" && (_jsx(SectionBody, { children: _jsxs(UITable, { style: { minWidth: 640 }, children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "\uACB0\uC81C\uC77C" }), _jsx("th", { children: "\uD56D\uBAA9" }), _jsx("th", { children: "\uAE08\uC561" }), _jsx("th", { children: "\uC0C1\uD0DC" })] }) }), _jsx("tbody", { children: payments.length === 0 ? (_jsx("tr", { children: _jsx("td", { colSpan: 4, children: _jsx(Muted, { children: "\uACB0\uC81C \uAE30\uB85D\uC774 \uC5C6\uC2B5\uB2C8\uB2E4." }) }) })) : (payments.map((p, i) => (_jsxs("tr", { children: [_jsx("td", { children: p.date }), _jsx("td", { children: p.item }), _jsx("td", { children: p.amount }), _jsx("td", { children: p.status })] }, i)))) })] }) })), activeTab === "counsels" && (_jsxs(SectionBody, { children: [_jsxs(CounselHeader, { children: [_jsx("div", { children: _jsx(SmallTitle, { children: "\uC0C1\uB2F4\uAE30\uB85D" }) }), _jsx("div", { children: addingCounsel ? (_jsxs(_Fragment, { children: [_jsx(ModalBtn, { type: "button", onClick: () => { setAddingCounsel(false); setNewContent(""); setNewWhen(""); }, children: "\uCDE8\uC18C" }), _jsx(UIPrimaryBtn, { as: "button", onClick: onSubmitNewCounsel, disabled: newSubmitting || !newWhen, children: "\uC800\uC7A5" })] })) : (_jsx(UIGhostBtn, { as: "button", onClick: () => { setAddingCounsel(true); setNewWhen(nowLocalInput()); }, children: "\uC0C1\uB2F4 \uCD94\uAC00" })) })] }), counselError && _jsx(Error, { children: counselError }), addingCounsel && (_jsxs(NewCounselForm, { children: [_jsxs(Field, { children: [_jsx(Label, { children: "\uC0C1\uB2F4 \uC77C\uC2DC" }), _jsx(Input, { type: "datetime-local", value: newWhen, onChange: (e) => setNewWhen(e.target.value), step: 300 })] }), _jsxs(Field, { style: { gridColumn: "1 / -1" }, children: [_jsx(Label, { children: "\uB0B4\uC6A9" }), _jsx(TextArea, { rows: 4, value: newContent, onChange: (e) => setNewContent(e.target.value), placeholder: "\uC0C1\uB2F4 \uB0B4\uC6A9 \uB610\uB294 \uBA54\uBAA8" })] })] })), counselLoading ? (_jsx(Muted, { children: "\uBD88\uB7EC\uC624\uB294 \uC911..." })) : counsels.length === 0 ? (_jsx(Empty, { children: "\uC0C1\uB2F4 \uAE30\uB85D\uC774 \uC5C6\uC2B5\uB2C8\uB2E4." })) : (_jsx(List, { children: counsels.map((c) => {
                                                const isEditing = editingCounselId === c.id;
                                                return (_jsx(ListItem, { children: !isEditing ? (_jsxs(_Fragment, { children: [_jsxs(CounselRow, { children: [_jsx(When, { children: formatKDateTime(c.counselTime) }), _jsxs(RowActions, { children: [_jsx(ModalBtn, { type: "button", onClick: () => { setEditingCounselId(c.id); setEditWhen(isoToLocalInput(c.counselTime)); setEditContent(c.content || ""); }, children: "\uD3B8\uC9D1" }), _jsx(ModalBtn, { type: "button", onClick: () => setConfirmCounselId(c.id), children: "\uC0AD\uC81C" })] })] }), _jsx(CounselContent, { children: (c.content || '').trim() || '내용 없음' })] })) : (_jsxs(_Fragment, { children: [_jsxs(EditGrid, { children: [_jsxs(Field, { children: [_jsx(Label, { children: "\uC0C1\uB2F4 \uC77C\uC2DC" }), _jsx(Input, { type: "datetime-local", value: editWhen, onChange: (e) => setEditWhen(e.target.value), step: 300 })] }), _jsxs(Field, { style: { gridColumn: '1 / -1' }, children: [_jsx(Label, { children: "\uB0B4\uC6A9" }), _jsx(TextArea, { rows: 4, value: editContent, onChange: (e) => setEditContent(e.target.value) })] })] }), _jsxs(RowActions, { children: [_jsx(ModalBtn, { type: "button", onClick: () => { setEditingCounselId(null); setEditWhen(""); setEditContent(""); }, children: "\uCDE8\uC18C" }), _jsx(UIPrimaryBtn, { as: "button", disabled: savingEdit || !editWhen, onClick: () => onSaveEdit(c.id), children: "\uC800\uC7A5" })] })] })) }, c.id));
                                            }) }))] }))] }) })] })), _jsx(ConfirmDialog, { open: confirmCounselId != null, title: "\uC0C1\uB2F4 \uC77C\uC815 \uC0AD\uC81C", message: "\uC774 \uC0C1\uB2F4 \uC77C\uC815\uC744 \uC0AD\uC81C\uD558\uC2DC\uACA0\uC5B4\uC694? \uB418\uB3CC\uB9B4 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.", confirmLabel: "\uC0AD\uC81C", cancelLabel: "\uCDE8\uC18C", tone: "danger", busy: confirmCounselBusy, onCancel: () => { if (!confirmCounselBusy)
                    setConfirmCounselId(null); }, onConfirm: async () => {
                    if (!numericId || confirmCounselId == null)
                        return;
                    setConfirmCounselBusy(true);
                    try {
                        await deleteCounsel(confirmCounselId);
                        const res = await listCounsels({ studentId: numericId, size: 100 });
                        setCounsels(res.content || []);
                        setConfirmCounselId(null);
                    }
                    catch (e) {
                        alert(e?.message || '삭제에 실패했습니다.');
                    }
                    finally {
                        setConfirmCounselBusy(false);
                    }
                } })] }));
}
// 결제내역: 현재 API 미구현으로 더미/목업 데이터 제거, 빈 상태로 표시합니다.
// Layout
const Page = styled.div `
  display: grid; gap: 14px;
`;
const TopBar = styled.div `
  display: flex; align-items: center; gap: 10px;
  h2 { margin: 0; font-size: 20px; color: #0f172a; }
`;
const BackBtn = styled.button `
  height: 32px; padding: 0 10px; border-radius: 8px; border: 1px solid #e5e7eb; background: #fff; color: #111827; font-weight: 700; font-size: 12px; display: inline-flex; align-items: center; gap: 6px;
`;
const Columns = styled.div `
  display: grid; grid-template-columns: 360px 1fr; gap: 14px; align-items: start;
  @media (max-width: 1200px) { grid-template-columns: 1fr; }
`;
const Left = styled.aside `
  display: grid; gap: 18px;
`;
const Right = styled.section ``;
// Cards/blocks
const Card = styled.section `
  background: #fff; border: 1px solid #e5e7eb; border-radius: 14px; padding: 16px; min-width: 0;
  box-shadow: 0 1px 2px rgba(0,0,0,0.03);
`;
const SectionTitle = styled.h3 `
  margin: 0; font-size: 16px; color: #0f172a;
`;
const CardHead = styled.div `
  display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;
`;
const CardActions = styled.div `
  display: inline-flex; gap: 8px;
`;
const Divider = styled.div `
  height: 1px; background: #e5e7eb; margin: 6px 0 10px;
`;
const InfoList = styled.div `
  display: grid; gap: 14px;
`;
const Row = styled.div `
  display: grid; grid-template-columns: 44px 1fr auto; gap: 12px; align-items: center; margin-bottom: 6px;
`;
const Avatar = styled.div `
  width: 44px; height: 44px; border-radius: 12px; background: #eef2ff; color: #4f46e5; display: grid; place-items: center; font-weight: 800;
`;
const Name = styled.div `
  font-size: 19px; font-weight: 900; color: #0f172a; letter-spacing: -0.01em;
`;
const SmallMuted = styled.div `
  color: #6b7280; font-size: 12px;
`;
const StatusChip = styled.span `
  padding: 4px 10px; border-radius: 9999px; font-size: 12px; font-weight: 800;
  &[data-type='ENROLLED'] { background:#dcfce7; color:#16a34a; }
  &[data-type='ON_LEAVE'] { background:#fef3c7; color:#b45309; }
  &[data-type='PENDING'] { background:#f3e8ff; color:#7c3aed; }
`;
const Field = styled.div `
  display: grid; grid-template-columns: 100px 1fr; gap: 8px;
`;
const Label = styled.div `
  color: #6b7280; font-size: 13px; align-self: center;
`;
const Value = styled.div `
  color: #111827; font-size: 15px;
`;
const Muted = styled.div `
  color: #6b7280; font-size: 13px;
`;
// Hint removed (unused)
const Error = styled.div `
  color: #b91c1c; font-size: 12px; font-weight: 700;
`;
// Right side mini header and content
const MiniHead = styled.div `
  display: flex; align-items: center; justify-content: space-between;
  position: sticky; top: 0; background: #fff; z-index: 5; padding-top: 2px;
`;
const Tabs = styled.div `
  display: inline-flex; gap: 6px; flex-wrap: wrap;
`;
const TabButton = styled.button `
  height: 32px; padding: 0 10px; border-radius: 8px; border: 1px solid #e5e7eb; background: #fff; color: #111827; font-weight: 700; font-size: 12px; display: inline-flex; align-items: center; gap: 6px;
  &[data-active='true'] { background:#111827; color:#fff; border-color:#111827; }
`;
const Badge = styled.span `
  min-width: 18px; height: 18px; padding: 0 6px; border-radius: 9999px; background:#e5e7eb; color:#374151; font-weight: 800; font-size: 11px; display: inline-flex; align-items: center; justify-content: center;
`;
const SectionBody = styled.div `
  display: grid; gap: 10px;
`;
const CourseList = styled.div `
  display: grid; gap: 8px;
`;
const CourseItem = styled.div `
  border: 1px solid #e5e7eb; border-radius: 10px; padding: 10px 12px; display: grid; gap: 6px; background: #fff;
`;
const CourseHeader = styled.div `
  display: flex; align-items: center; justify-content: space-between; gap: 8px;
`;
const CourseTitle = styled.div `
  font-weight: 800; color: #0f172a; font-size: 14px;
`;
const CourseMeta = styled.div `
  display: flex; align-items: center; gap: 10px; color: #6b7280; font-size: 12px;
  code { background:#f3f4f6; padding: 2px 6px; border-radius: 6px; }
`;
const CourseStatus = styled.span `
  padding: 2px 8px; border-radius: 9999px; font-size: 12px; font-weight: 800;
  &[data-type='IN_PROGRESS'] { background:#dcfce7; color:#16a34a; }
  &[data-type='PENDING'] { background:#f3e8ff; color:#7c3aed; }
  &[data-type='STOPPED'] { background:#e5e7eb; color:#374151; }
`;
const Subgrid = styled.div `
  display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px;
`;
const SmallCard = styled.div `
  border: 1px solid #e5e7eb; border-radius: 10px; padding: 10px 12px; background: #fff;
`;
const SmallTitle = styled.div `
  color: #6b7280; font-size: 12px;
`;
const KPI = styled.div `
  font-size: 22px; font-weight: 900; color: #0f172a; margin-top: 4px;
`;
// Table from common UI
const List = styled.div `
  display: grid; gap: 8px;
`;
const ListItem = styled.div `
  border: 1px solid #e5e7eb; border-radius: 10px; padding: 10px 12px; background: #fff; display: grid; gap: 4px;
  strong { color: #0f172a; }
`;
const Empty = styled.div `
  color: #6b7280; font-size: 13px; text-align: center; border: 1px dashed #e5e7eb; border-radius: 10px; padding: 16px; background: #fafafa;
`;
// Actions under basic info
// Button from common UI
// BtnRow removed (unused)
const ModalBtn = styled.button `
  height: 32px; padding: 0 12px; border-radius: 8px; border: 1px solid #e5e7eb; background: #fff; color: #111827; font-weight: 700; font-size: 12px;
`;
// Button from common UI
// Notes section styles
const NotesBox = styled.pre `
  margin: 0; white-space: pre-line; color: #111827; font-size: 15px; line-height: 1.7;
  background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 10px; padding: 12px 14px; text-wrap: pretty;
`;
const NotesTextarea = styled.textarea `
  width: 100%; border: 1px solid #e5e7eb; border-radius: 10px; padding: 10px 12px; resize: vertical; font-size: 14px; color: #111827; min-height: 120px;
  &:focus { outline: none; box-shadow: 0 0 0 3px rgba(79,70,229,0.15); }
`;
// Memo list styles
const MemoNew = styled.div ` display:grid; gap:8px; `;
const MemoList = styled.div ` display:grid; gap:8px; `;
const MemoItemBox = styled.div `
  border: 1px solid #e5e7eb; border-radius: 10px; padding: 10px 12px; background: #fff; display: grid; gap: 6px;
`;
const MemoHeader = styled.div ` display:flex; align-items:center; justify-content:space-between; gap:8px; `;
const MemoDate = styled.div ` color:#6b7280; font-size:12px; `;
const MemoActions = styled.div ` display:inline-flex; gap:6px; `;
const MemoTextarea = styled.textarea `
  width: 100%; border: 1px solid #e5e7eb; border-radius: 10px; padding: 8px 10px; resize: vertical; font-size: 14px; color: #111827;
`;
const MemoText = styled.pre ` margin:0; white-space:pre-wrap; color:#111827; font-size:14px; `;
// Skeletons
const shimmer = keyframes `
  0% { background-position: -200px 0; }
  100% { background-position: 200px 0; }
`;
const SkeletonBase = styled.div `
  background: linear-gradient(90deg, #eef2f7 25%, #f6f8fb 37%, #eef2f7 63%);
  background-size: 400px 100%;
  animation: ${shimmer} 1.2s ease-in-out infinite;
  border-radius: 8px;
  width: ${({ w }) => (w ? `${w}px` : "100%")};
  height: ${({ h }) => (h ? `${h}px` : "12px")};
  margin-top: ${({ mt }) => (mt ? `${mt}px` : 0)};
`;
const Skeleton = SkeletonBase;
const AvatarSkeleton = styled(SkeletonBase).attrs({ w: 44, h: 44 }) `
  border-radius: 12px;
`;
const SkeletonRow = styled.div `
  display: grid; grid-template-columns: 44px 1fr 80px; gap: 10px; align-items: center; margin-bottom: 8px;
`;
const SkeletonChip = styled(SkeletonBase).attrs({ w: 80, h: 24 }) ``;
const SkField = styled(SkeletonBase).attrs({ h: 16, mt: 10 }) ``;
const leftIcon = (_jsx("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: _jsx("polyline", { points: "15 18 9 12 15 6" }) }));
function two(n) { return String(n).padStart(2, '0'); }
function formatDate(iso) {
    try {
        const d = new Date(iso);
        const y = d.getFullYear();
        const m = two(d.getMonth() + 1);
        const da = two(d.getDate());
        const hh = two(d.getHours());
        const mi = two(d.getMinutes());
        return `${y}-${m}-${da} ${hh}:${mi}`;
    }
    catch {
        return iso;
    }
}
// Attendance helpers
function formatMonthRate(rows) {
    const now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth() + 1;
    const monthRows = rows.filter(r => {
        const [yy, mm] = r.date.split('-').map(Number);
        return yy === y && mm === m;
    });
    if (monthRows.length === 0)
        return '—';
    const present = monthRows.filter(r => r.present).length;
    const rate = Math.round((present / monthRows.length) * 100);
    return `${rate}%`;
}
function formatMonthCounts(rows) {
    const now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth() + 1;
    const monthRows = rows.filter(r => {
        const [yy, mm] = r.date.split('-').map(Number);
        return yy === y && mm === m;
    });
    if (monthRows.length === 0)
        return '—';
    const present = monthRows.filter(r => r.present).length;
    return `${present}/${monthRows.length}회 출석`;
}
function formatRecentAbsents(rows) {
    const abs = rows.filter(r => !r.present).slice(0, 2).map(r => r.date);
    if (abs.length === 0)
        return '없음';
    return abs.join(', ');
}
// Counsel helpers
function formatKDateTime(iso) {
    try {
        const d = new Date(iso);
        const yoil = ['일', '월', '화', '수', '목', '금', '토'][d.getDay()];
        const y = d.getFullYear();
        const m = d.getMonth() + 1;
        const da = d.getDate();
        const hh = two(d.getHours());
        const mi = two(d.getMinutes());
        return `${y}년 ${m}월 ${da}일 (${yoil}) ${hh}:${mi}`;
    }
    catch {
        return iso;
    }
}
function nowLocalInput() {
    const d = new Date();
    const y = d.getFullYear();
    const m = two(d.getMonth() + 1);
    const da = two(d.getDate());
    const hh = two(d.getHours());
    const mi = two(d.getMinutes());
    return `${y}-${m}-${da}T${hh}:${mi}`;
}
function fromLocalInput(local) {
    if (!local)
        return local;
    return local.length === 16 ? `${local}:00` : local;
}
function isoToLocalInput(iso) {
    try {
        const d = new Date(iso);
        const y = d.getFullYear();
        const m = two(d.getMonth() + 1);
        const da = two(d.getDate());
        const hh = two(d.getHours());
        const mi = two(d.getMinutes());
        return `${y}-${m}-${da}T${hh}:${mi}`;
    }
    catch {
        return '';
    }
}
// Styles for counsel section
const CounselHeader = styled.div `
  display: flex; align-items: center; justify-content: space-between; gap: 8px;
`;
const NewCounselForm = styled.div `
  display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 4px 0 8px;
  @media (max-width: 900px) { grid-template-columns: 1fr; }
`;
const Input = styled.input `
  height: 36px; border: 1px solid #e5e7eb; border-radius: 10px; padding: 0 10px; font-size: 14px;
`;
const TextArea = styled.textarea `
  width: 100%; border: 1px solid #e5e7eb; border-radius: 10px; padding: 8px 10px; font-size: 14px; resize: vertical;
`;
const CounselRow = styled.div ` display:flex; align-items:center; justify-content:space-between; gap:8px; `;
const RowActions = styled.div ` display:inline-flex; gap:8px; `;
const When = styled.div ` font-weight:900; color:#0f172a; `;
const CounselContent = styled.pre ` margin:4px 0 0; white-space:pre-wrap; color:#111827; font-size:14px; `;
const EditGrid = styled.div ` display:grid; grid-template-columns: 1fr 1fr; gap:10px; @media(max-width:900px){ grid-template-columns:1fr; }`;
