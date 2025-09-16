import { jsxs as _jsxs, jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { SectionCard as Section, TitleH3 as Title, GhostBtn as UIGhostBtn, GhostBtnSmall as UIGhostBtnSmall, PrimaryBtn as UIPrimaryBtn, TableBase as UITable } from "../components/common/UI";
import ConfirmDialog from "../components/common/ConfirmDialog";
import { getCourse, listCourseStudents, listCourseRecords, listRecordAttendance, deleteCourse } from "../api/courses";
import { listStudents } from "../api/students";
import { KPI, UsersIcon, ClassIcon, CheckIcon, DeltaPill } from "../components/dashboard/KPI";
import { formatPhone } from "../lib/format";
export default function CourseDetail() {
    const navigate = useNavigate();
    const { id } = useParams();
    const numericId = useMemo(() => (id ? Number(id) : null), [id]);
    // info/students를 하나의 관리 화면으로 통합 (탭 상태 제거)
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [students, setStudents] = useState([]);
    const [stuLoading, setStuLoading] = useState(false);
    const [stuError, setStuError] = useState(null);
    const [records, setRecords] = useState([]);
    const [recLoading, setRecLoading] = useState(false);
    const [recError, setRecError] = useState(null);
    // History filter state
    const [filterYear, setFilterYear] = useState(null);
    // 0 = 전체, 1..12 = 월
    const [filterMonth, setFilterMonth] = useState(new Date().getMonth() + 1);
    // removed: bulk generation state (replaced with manual create flow)
    // Danger confirm for deleting this course (template)
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const [confirmBusy, setConfirmBusy] = useState(false);
    const [attByRec, setAttByRec] = useState({});
    useEffect(() => {
        if (!numericId)
            return;
        let cancelled = false;
        async function load() {
            setLoading(true);
            setError(null);
            try {
                const c = await getCourse(numericId);
                if (!cancelled)
                    setCourse(c);
            }
            catch (e) {
                if (!cancelled)
                    setError(e?.message || "수업 정보를 불러오지 못했습니다.");
            }
            finally {
                if (!cancelled)
                    setLoading(false);
            }
        }
        void load();
        return () => { cancelled = true; };
    }, [numericId]);
    // Utility helpers for filter
    function pad2(n) { return String(n).padStart(2, '0'); }
    function endOfMonthDay(y, m1) { return new Date(y, m1, 0).getDate(); }
    // removed: generateNext14Days (replaced by create single record via detail page)
    // Initialize filter year after course loads
    useEffect(() => {
        if (!course)
            return;
        if (filterYear == null)
            setFilterYear(new Date().getFullYear());
    }, [course, filterYear]);
    // Load records for selected year/month
    useEffect(() => {
        if (!numericId || filterYear == null)
            return;
        let cancelled = false;
        async function loadByFilter() {
            setRecLoading(true);
            setRecError(null);
            try {
                let from = `${filterYear}-01-01`;
                let to = `${filterYear}-12-31`;
                if (filterMonth >= 1) {
                    from = `${filterYear}-${pad2(filterMonth)}-01`;
                    const end = endOfMonthDay(filterYear, filterMonth);
                    to = `${filterYear}-${pad2(filterMonth)}-${pad2(end)}`;
                }
                const list = await listCourseRecords(numericId, { from, to });
                if (!cancelled)
                    setRecords(list);
            }
            catch (e) {
                if (!cancelled) {
                    const msg = e?.message || '';
                    if (!msg.includes('404'))
                        setRecError(msg || '수업 내역을 불러오지 못했습니다.');
                    else
                        setRecords([]);
                }
            }
            finally {
                if (!cancelled)
                    setRecLoading(false);
            }
        }
        void loadByFilter();
        return () => { cancelled = true; };
    }, [numericId, filterYear, filterMonth]);
    // Load attendance for records (server) when available
    useEffect(() => {
        if (!numericId || records.length === 0)
            return;
        let cancelled = false;
        async function loadAll() {
            const ids = records.map(r => r.id).filter((x) => typeof x === 'number');
            if (ids.length === 0)
                return;
            try {
                const pairs = await Promise.all(ids.map(async (rid) => {
                    try {
                        const list = await listRecordAttendance(numericId, rid);
                        const map = {};
                        list.forEach(a => { map[a.studentId] = !!a.present; });
                        return [rid, map];
                    }
                    catch {
                        return [rid, undefined];
                    }
                }));
                if (!cancelled) {
                    setAttByRec(prev => {
                        const next = { ...prev };
                        pairs.forEach(([rid, map]) => { if (map)
                            next[rid] = map; });
                        return next;
                    });
                }
            }
            finally {
                // no-op
            }
        }
        void loadAll();
        return () => { cancelled = true; };
    }, [numericId, records]);
    useEffect(() => {
        if (!numericId)
            return;
        let cancelled = false;
        async function loadStudents() {
            setStuLoading(true);
            setStuError(null);
            try {
                const list = await listCourseStudents(numericId);
                if (!cancelled)
                    setStudents(list);
            }
            catch (e) {
                const msg = e?.message || "";
                if (msg.includes("404")) {
                    try {
                        // fallback: gather all then filter
                        let page = 0;
                        const size = 100;
                        let all = [];
                        while (true) {
                            const res = await listStudents({ page, size });
                            all = all.concat(res.content);
                            if (res.last || res.content.length === 0 || page > 100)
                                break;
                            page += 1;
                        }
                        const filtered = all.filter(s => (s.courses || []).some(c => c.id === numericId));
                        if (!cancelled)
                            setStudents(filtered);
                    }
                    catch (e2) {
                        if (!cancelled)
                            setStuError(e2?.message || "등록 학생을 불러오지 못했습니다.");
                    }
                }
                else {
                    if (!cancelled)
                        setStuError(msg || "등록 학생을 불러오지 못했습니다.");
                }
            }
            finally {
                if (!cancelled)
                    setStuLoading(false);
            }
        }
        void loadStudents();
        return () => { cancelled = true; };
    }, [numericId]);
    const info = useMemo(() => course ? buildInfo(course) : null, [course]);
    const history = useMemo(() => {
        if (!course)
            return [];
        return records.map(r => ({
            id: r.id,
            date: new Date(r.recordDate),
            dateLabel: `${r.recordDate} (${"일월화수목금토"[new Date(r.recordDate).getDay()]})`,
            time: formatCourseTime(course),
            type: new Date(r.recordDate) < new Date() ? '지난 수업' : '예정',
            notes: r.notes,
        }));
    }, [course, records]);
    function fmt(d) { const y = d.getFullYear(), m = String(d.getMonth() + 1).padStart(2, '0'), da = String(d.getDate()).padStart(2, '0'); return `${y}-${m}-${da}`; }
    function formatCourseTime(c) { return c.startTime && c.endTime ? `${hhmm(c.startTime)} ~ ${hhmm(c.endTime)}` : (c.courseTime || '-'); }
    // Attendance local storage helpers
    // removed unused getAttendanceMap
    // removed unused setAttendance
    // derived helpers removed (unused)
    // Attachments local storage helpers
    function getAttachments(recordId) {
        try {
            return JSON.parse(localStorage.getItem(`attachments:${numericId}:${recordId}`) || '[]');
        }
        catch {
            return [];
        }
    }
    // Attendance helpers (server-preferred, local fallback)
    function localAttendanceMap(recordId) {
        try {
            return JSON.parse(localStorage.getItem(`attendance:${numericId}:${recordId}`) || '{}');
        }
        catch {
            return {};
        }
    }
    // removed unused setAttachments
    // unused actions removed: local-only attendance bulk/update, attachments add/remove, notes editor
    const totalStudents = useMemo(() => (typeof course?.enrolledCount === 'number' ? course.enrolledCount : students.length), [course?.enrolledCount, students.length]);
    const activeStudents = useMemo(() => students.filter(s => s.status === 'ENROLLED').length, [students]);
    const capacity = course?.capacity;
    const activeRate = useMemo(() => (capacity && capacity > 0 ? Math.round((activeStudents / capacity) * 100) : null), [activeStudents, capacity]);
    const completedCount = useMemo(() => history.filter(h => h.type === '지난 수업').length, [history]);
    const progressPct = useMemo(() => {
        const total = history.length || 0;
        if (!total)
            return null;
        return Math.round((completedCount / total) * 100);
    }, [completedCount, history.length]);
    return (_jsxs(Wrap, { children: [_jsxs(Head, { children: [_jsxs(BackBtn, { type: "button", onClick: () => navigate("/classes"), children: [leftIcon, " \uB4A4\uB85C"] }), _jsx("h2", { children: course?.title || "수업 상세" }), _jsxs(Actions, { children: [_jsx(UIGhostBtn, { to: `/classes/${numericId || ''}/edit-students`, title: "\uC218\uAC15\uC0DD \uC218\uC815", children: "\uC218\uAC15\uC0DD \uC218\uC815" }), _jsx(UIPrimaryBtn, { to: `/classes/${numericId || ''}/edit`, title: "\uAE30\uBCF8 \uC815\uBCF4 \uC218\uC815", children: "\uAE30\uBCF8\uC815\uBCF4 \uC218\uC815" }), numericId && (_jsx(UIGhostBtn, { as: "button", onClick: () => setConfirmDeleteOpen(true), children: "\uC0AD\uC81C" }))] })] }), _jsx(ConfirmDialog, { open: confirmDeleteOpen, title: "\uC218\uC5C5(\uD15C\uD50C\uB9BF) \uC0AD\uC81C", message: "관련 수업 내역/출결/첨부가 모두 삭제됩니다. 이 작업은 되돌릴 수 없습니다.", confirmLabel: "\uC601\uAD6C \uC0AD\uC81C", cancelLabel: "\uCDE8\uC18C", tone: "danger", busy: confirmBusy, onCancel: () => { if (!confirmBusy)
                    setConfirmDeleteOpen(false); }, onConfirm: async () => {
                    if (!numericId)
                        return;
                    setConfirmBusy(true);
                    try {
                        await deleteCourse(numericId);
                        setConfirmDeleteOpen(false);
                        navigate('/classes');
                    }
                    catch (e) {
                        alert(e?.message || '삭제에 실패했습니다.');
                    }
                    finally {
                        setConfirmBusy(false);
                    }
                } }), error && _jsx(AlertError, { children: error }), loading && _jsx(Muted, { children: "\uBD88\uB7EC\uC624\uB294 \uC911..." }), _jsxs(KPIGrid, { children: [_jsx(KPI, { title: "\uCD1D \uC218\uAC15\uC0DD", icon: _jsx(UsersIcon, {}), iconAccent: "indigo", value: _jsx(_Fragment, { children: typeof totalStudents === 'number' ? `${totalStudents}명` : '—' }), footerLeft: _jsxs("span", { children: ["\uC815\uC6D0 ", capacity ?? '—', "\uBA85"] }) }), _jsx(KPI, { title: "\uD65C\uC131 \uC218\uAC15\uC0DD", icon: _jsx(UsersIcon, {}), iconAccent: "emerald", value: _jsxs(_Fragment, { children: [activeStudents, "\uBA85"] }), footerLeft: activeRate != null ? _jsxs(DeltaPill, { "$tone": "positive", children: [activeRate, "%"] }) : _jsx("span", { children: "\u2014" }), footerRight: _jsx("span", { children: "\uC218\uAC15\uC728" }) }), _jsx(KPI, { title: "\uD3C9\uADE0 \uCD9C\uC11D\uB960", icon: _jsx(CheckIcon, {}), iconAccent: "green", value: _jsx(_Fragment, { children: "\u2014" }), footerLeft: _jsx("span", { children: "\uC804\uCCB4 \uD3C9\uADE0" }) }), _jsx(KPI, { title: "\uC644\uB8CC\uB41C \uC218\uC5C5", icon: _jsx(ClassIcon, {}), iconAccent: "violet", value: _jsxs(_Fragment, { children: [completedCount || 0, "\uD68C"] }), footerRight: progressPct != null ? _jsxs("span", { children: ["\uC9C4\uD589\uB960 ", progressPct, "%"] }) : _jsx("span", { children: "\u2014" }) })] }), info && (_jsxs(Columns, { children: [_jsxs(Left, { children: [_jsxs(Section, { children: [_jsxs(SectionHead, { children: [_jsx(Title, { children: "\uC218\uC5C5 \uC815\uBCF4" }), _jsx("div", { children: _jsx(UIGhostBtnSmall, { to: `/classes/${numericId || ''}/edit`, children: "\uAE30\uBCF8\uC815\uBCF4 \uC218\uC815" }) })] }), _jsxs(GridTwo, { children: [_jsxs(Field, { children: [_jsx(Label, { children: "\uCF54\uB4DC" }), _jsx("div", { children: _jsx("code", { children: course?.code }) })] }), _jsxs(Field, { children: [_jsx(Label, { children: "\uC0C1\uD0DC" }), _jsx("div", { children: _jsx(StatusChip, { "data-type": course?.status, children: statusLabel(course?.status) }) })] }), _jsxs(Field, { children: [_jsx(Label, { children: "\uC694\uC77C" }), _jsx("div", { children: info.days || '-' })] }), _jsxs(Field, { children: [_jsx(Label, { children: "\uC2DC\uAC04" }), _jsx("div", { children: info.time || '-' })] }), _jsxs(Field, { children: [_jsx(Label, { children: "\uC815\uC6D0" }), _jsx("div", { children: course?.capacity ?? '-' })] }), _jsxs(Field, { children: [_jsx(Label, { children: "\uC218\uAC15\uB8CC" }), _jsx("div", { children: course?.fee ? `${course.fee.toLocaleString()}원` : '-' })] }), _jsxs(Field, { style: { gridColumn: '1 / -1' }, children: [_jsx(Label, { children: "\uC218\uC5C5 \uC124\uBA85" }), _jsx(Desc, { children: course?.description || '-' })] })] })] }), _jsxs(Section, { children: [_jsxs(SectionHead, { children: [_jsxs("div", { children: [_jsx(Title, { style: { margin: 0 }, children: "\uC218\uAC15\uC0DD \uBAA9\uB85D" }), _jsxs(Muted, { children: ["\uCD1D ", students.length, "\uBA85\uC758 \uD559\uC0DD\uC774 \uC218\uAC15\uC911\uC785\uB2C8\uB2E4."] })] }), _jsx(Actions, { children: _jsx(UIPrimaryBtn, { to: `/classes/${numericId || ''}/edit-students`, children: "\uD559\uC0DD \uCD94\uAC00" }) })] }), stuLoading && _jsx(Muted, { children: "\uBD88\uB7EC\uC624\uB294 \uC911..." }), stuError && _jsx(AlertError, { children: stuError }), _jsx(TableScroller, { children: _jsxs(TableEx, { children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "\uD559\uC0DD\uBA85" }), _jsx("th", { children: "\uC5F0\uB77D\uCC98" }), _jsx("th", { children: "\uB4F1\uB85D\uC77C" }), _jsx("th", { children: "\uC0C1\uD0DC" })] }) }), _jsx("tbody", { children: students.length === 0 && !stuLoading ? (_jsx("tr", { children: _jsx("td", { colSpan: 4, style: { color: '#6b7280' }, children: "\uB4F1\uB85D\uB41C \uD559\uC0DD\uC774 \uC5C6\uC2B5\uB2C8\uB2E4." }) })) : (students.map(s => (_jsxs("tr", { children: [_jsxs("td", { children: [_jsx("strong", { children: s.name }), _jsx(SmallMuted, { children: s.code })] }), _jsx("td", { children: formatPhone(s.phoneNumber) }), _jsx("td", { children: s.joinedDate || '-' }), _jsx("td", { children: _jsx(StatusTag, { "data-type": s.status, children: studentStatusText(s.status) }) })] }, s.id)))) })] }) })] })] }), _jsx(Right, { children: _jsxs(Section, { children: [_jsxs(SectionHead, { children: [_jsx(Title, { children: "\uC218\uC5C5 \uB0B4\uC5ED" }), _jsx(UIGhostBtnSmall, { to: `/classes/${numericId || ''}/history/date/${fmt(new Date())}`, children: "\uC218\uC5C5 \uC0DD\uC131" })] }), _jsxs(FilterRow, { children: [_jsxs(FilterItem, { children: [_jsx(SmallLabel, { children: "\uC5F0\uB3C4" }), _jsx(SmallSelect, { value: filterYear ?? '', onChange: (e) => setFilterYear(Number(e.currentTarget.value) || new Date().getFullYear()), children: (() => {
                                                        const todayY = new Date().getFullYear();
                                                        const startY = (() => { try {
                                                            return course ? new Date(course.createdAt).getFullYear() : todayY - 1;
                                                        }
                                                        catch {
                                                            return todayY - 1;
                                                        } })();
                                                        const endY = todayY + 1;
                                                        const opts = [];
                                                        for (let y = startY; y <= endY; y++)
                                                            opts.push(y);
                                                        return opts.map(y => (_jsxs("option", { value: y, children: [y, "\uB144"] }, y)));
                                                    })() })] }), _jsxs(FilterItem, { children: [_jsx(SmallLabel, { children: "\uC6D4" }), _jsxs(SmallSelect, { value: filterMonth, onChange: (e) => setFilterMonth(Number(e.currentTarget.value)), children: [_jsx("option", { value: 0, children: "\uC804\uCCB4" }), Array.from({ length: 12 }, (_, i) => i + 1).map(m => (_jsxs("option", { value: m, children: [m, "\uC6D4"] }, m)))] })] }), _jsx("div", { style: { flex: 1 } }), _jsx(SmallLink, { type: "button", onClick: () => { const now = new Date(); setFilterYear(now.getFullYear()); setFilterMonth(0); }, children: "\uCD08\uAE30\uD654" })] }), (recLoading || !course) && _jsx(Muted, { children: "\uBD88\uB7EC\uC624\uB294 \uC911..." }), recError && _jsx(AlertError, { children: recError }), history.length === 0 && !recLoading && _jsx(Muted, { children: "\uD45C\uC2DC\uD560 \uC77C\uC815\uC774 \uC5C6\uC2B5\uB2C8\uB2E4." }), history.map((h) => (_jsxs(RecordCard, { children: [_jsxs(RecordHead, { children: [_jsxs("div", { children: [_jsx("strong", { children: h.dateLabel }), _jsx(SmallMuted, { style: { marginLeft: 8 }, children: h.time }), _jsx(SmallMuted, { style: { marginLeft: 8 }, children: h.type }), h.id && (_jsx(RecBadge, { children: (() => {
                                                                const m = attByRec[h.id] || localAttendanceMap(h.id);
                                                                const cnt = Object.keys(m).length;
                                                                return cnt > 0 ? `처리 ${cnt}명` : '미처리';
                                                            })() }))] }), _jsx("div", { children: h.id ? (_jsx(UIGhostBtnSmall, { to: `/classes/${numericId}/history/${h.id}`, children: "\uC0C1\uC138" })) : (_jsx(UIGhostBtnSmall, { to: `/classes/${numericId}/history/date/${fmt(h.date)}`, children: "\uC0C1\uC138" })) })] }), _jsx(BlockTitle, { children: "\uCD9C\uC11D" }), (() => {
                                            const map = h.id ? (attByRec[h.id] || localAttendanceMap(h.id)) : {};
                                            const present = Object.values(map).filter(Boolean).length;
                                            const absent = Math.max(0, students.length - present);
                                            return (_jsxs("div", { style: { display: 'flex', gap: 12, alignItems: 'center' }, children: [_jsxs(CountPill, { "data-variant": 'present', children: ["\uCD9C\uC11D ", present, "\uBA85"] }), _jsxs(CountPill, { "data-variant": 'absent', children: ["\uACB0\uC11D ", absent, "\uBA85"] })] }));
                                        })(), _jsx(BlockTitle, { children: "\uC218\uC5C5 \uB0B4\uC6A9" }), _jsx(ReadOnlyBox, { children: (h.notes && h.notes.trim()) ? h.notes : '—' }), h.id && (_jsxs(_Fragment, { children: [_jsx(BlockTitle, { children: "\uCCA8\uBD80" }), _jsx(AttachList, { children: getAttachments(h.id).length === 0 ? (_jsx(SmallMuted, { children: "\uCCA8\uBD80 \uC5C6\uC74C" })) : (getAttachments(h.id).map((f, idx) => (_jsx(AttachRow, { children: _jsxs("div", { children: [f.name, " ", _jsxs(SmallMuted, { children: [(f.size / 1024).toFixed(1), "KB"] })] }) }, `${h.id}-${idx}`)))) })] }))] }, h.id || h.dateLabel)))] }) })] }))] }));
}
// utils
function hhmm(t) { if (!t)
    return ""; const [h, m] = t.split(":"); return `${h}:${m}`; }
function dayLabel(code) { const map = { MON: "월", TUE: "화", WED: "수", THU: "목", FRI: "금", SAT: "토", SUN: "일" }; return map[code.toUpperCase()] || code; }
function statusLabel(s) {
    switch (s) {
        case "IN_PROGRESS": return "진행중";
        case "PENDING": return "대기";
        case "STOPPED": return "중단";
        default: return s || "-";
    }
}
function studentStatusText(s) { switch (s) {
    case "ENROLLED": return "수강중";
    case "ON_LEAVE": return "휴학";
    case "PENDING": return "대기";
    default: return s;
} }
function buildInfo(c) {
    const days = (c.recurrenceDays || '').split(',').map(s => s.trim()).filter(Boolean).map(dayLabel).join('/');
    const time = c.startTime && c.endTime ? `${hhmm(c.startTime)} ~ ${hhmm(c.endTime)}` : (c.courseTime || '-');
    return { days, time };
}
function buildHistory(c, fromOffset = 0, toOffset = 6) {
    // Generate limited future window (default: today..+6)
    const start = new Date();
    start.setDate(start.getDate() + fromOffset);
    const end = new Date();
    end.setDate(end.getDate() + toOffset);
    const days = (c.recurrenceDays || '')
        .split(',').map(s => s.trim().toUpperCase()).filter(Boolean);
    const dow = days.map(d => ({ SUN: 0, MON: 1, TUE: 2, WED: 3, THU: 4, FRI: 5, SAT: 6 }[d])).filter((n) => typeof n === 'number');
    const list = [];
    if (dow.length === 0)
        return list;
    const time = c.startTime && c.endTime ? `${hhmm(c.startTime)} ~ ${hhmm(c.endTime)}` : (c.courseTime || '-');
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const day = d.getDay();
        if (dow.includes(day)) {
            list.push({
                date: new Date(d),
                dateLabel: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} (${"일월화수목금토"[day]})`,
                time,
                type: d < new Date() ? '지난 수업' : '예정',
            });
        }
    }
    // sort by date ascending
    list.sort((a, b) => a.date.getTime() - b.date.getTime());
    return list;
}
// styles
const Wrap = styled.div ` display:grid; gap:12px; `;
const Head = styled.div ` display:grid; grid-template-columns:auto 1fr auto; gap:12px; align-items:center; `;
const Actions = styled.div ` display:inline-flex; gap:8px; `;
// (tabs removed)
// Section, Title from common UI
const GridTwo = styled.div ` display:grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap:12px; @media(max-width:900px){ grid-template-columns:1fr; }`;
const Field = styled.div ` display:grid; gap:6px; `;
const Label = styled.div ` color:#6b7280; font-size:12px; font-weight:700; `;
const Desc = styled.div `
  color:#111827;
  white-space: pre-wrap;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 6; /* clamp to ~6 lines */
  -webkit-box-orient: vertical;
`;
// removed unused ListBox/Row styles
const SmallMuted = styled.span ` margin-left:8px; color:#9ca3af; font-size:12px; `;
const StatusChip = styled.span `
  padding: 2px 8px; border-radius: 9999px; font-size: 12px; font-weight: 800;
  &[data-type='IN_PROGRESS'] { background:#dcfce7; color:#16a34a; }
  &[data-type='PENDING'] { background:#f3e8ff; color:#7c3aed; }
  &[data-type='STOPPED'] { background:#e5e7eb; color:#374151; }
`;
const StatusTag = styled.span `
  margin-left:8px; padding:2px 6px; border-radius:999px; font-size:11px; font-weight:700; border:1px solid #e5e7eb; color:#374151; background:#f9fafb;
  &[data-type='ENROLLED'] { background:#ecfdf5; color:#047857; border-color:#a7f3d0; }
  &[data-type='ON_LEAVE'] { background:#fff7ed; color:#b45309; border-color:#fed7aa; }
  &[data-type='PENDING'] { background:#f5f3ff; color:#6d28d9; border-color:#ddd6fe; }
`;
// Buttons from common UI
const AlertError = styled.div ` background:#fee2e2; color:#b91c1c; border:1px solid #fecaca; padding:10px 12px; border-radius:10px; font-size:13px; `;
const Muted = styled.div ` color:#6b7280; font-size:12px; `;
const BackBtn = styled.button ` height:32px; padding:0 10px; border-radius:8px; border:1px solid #e5e7eb; background:#fff; color:#111827; font-weight:800; font-size:12px; display:inline-flex; align-items:center; gap:6px; `;
const leftIcon = (_jsx("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: _jsx("polyline", { points: "15 18 9 12 15 6" }) }));
// new layout styles
const KPIGrid = styled.div ` display:grid; grid-template-columns: repeat(12, minmax(0, 1fr)); gap:12px; `;
const Columns = styled.div ` display:flex; gap:12px; align-items:flex-start; `;
const Left = styled.div ` flex:4 1 0; display:grid; gap:12px; align-content:flex-start; `;
const Right = styled.div ` flex:6 1 0; display:grid; gap:12px; align-content:flex-start; `;
const SectionHead = styled.div ` display:flex; align-items:flex-end; justify-content:space-between; margin-bottom:8px; `;
// 진행 현황 섹션 제거로 불필요한 스타일 삭제됨
const SmallLabel = styled.span ` display:block; color:#6b7280; font-size:12px; margin-bottom:4px; `;
const SmallSelect = styled.select `
  height:32px; padding:0 10px; border:1px solid #e5e7eb; border-radius:8px; font-size:12px; background:#fff;
  min-width: 110px;
`;
const FilterRow = styled.div `
  display:flex; gap:12px; align-items:flex-end; margin-bottom:8px;
  background:#f9fafb; border:1px solid #f1f5f9; border-radius:10px; padding:8px 10px;
`;
const FilterItem = styled.label ` display:grid; gap:4px; `;
const SmallLink = styled.button `
  height:28px; padding:0 8px; border:1px solid transparent; background:transparent; color:#6b7280; font-size:12px; border-radius:8px;
  &:hover{ background:#eef2ff; color:#1f2937; border-color:#e0e7ff; }
`;
const TableEx = styled(UITable) `
  thead th { background:#f9fafb; }
  tbody tr:nth-child(even) td { background:#fcfcfd; }
  tbody tr:hover td { background:#f8fafc; }
`;
const TableScroller = styled.div `
  max-height: 420px;
  overflow: auto;
  border: 1px solid #f1f5f9;
  border-radius: 10px;
`;
// Records UI
const RecordCard = styled.div ` border:1px solid #e5e7eb; border-radius:12px; padding:12px; display:grid; gap:10px; margin-bottom:10px; `;
const RecordHead = styled.div ` display:flex; align-items:center; justify-content:space-between; `;
const BlockTitle = styled.div ` font-size:12px; font-weight:800; color:#6b7280; margin-top:4px; `;
const RecBadge = styled.span ` margin-left:8px; padding:2px 6px; border-radius:999px; font-size:11px; font-weight:700; border:1px solid #e5e7eb; color:#374151; background:#f3f4f6; `;
const ReadOnlyBox = styled.div ` white-space:pre-wrap; border:1px solid #f1f5f9; border-radius:10px; padding:10px; background:#f9fafb; color:#111827; font-size:14px; `;
const AttachList = styled.div ` display:grid; gap:6px; margin-top:6px; `;
const AttachRow = styled.div ` display:flex; align-items:center; justify-content:space-between; padding:6px 8px; border:1px solid #f1f5f9; border-radius:8px; `;
// removed unused SmallBtn/Hint styles
const CountPill = styled.span `
  display:inline-flex; align-items:center; gap:4px; padding:2px 8px; border-radius:999px; border:1px solid #e5e7eb; font-size:12px; font-weight:800; color:#374151; background:#fff;
  &[data-variant='present']{ background:#ecfdf5; color:#065f46; border-color:#a7f3d0; }
  &[data-variant='absent']{ background:#fee2e2; color:#7f1d1d; border-color:#fecaca; }
`;
