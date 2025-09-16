import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { SectionCard as Section, TitleH3 as Title, GhostBtn as UIGhostBtn } from "../components/common/UI";
import { getCourse, listCourseStudents } from "../api/courses";
import { listStudents, updateStudent } from "../api/students";
export default function CourseStudentsEdit() {
    const navigate = useNavigate();
    const { id } = useParams();
    const numericId = useMemo(() => (id ? Number(id) : null), [id]);
    const [title, setTitle] = useState("");
    const [capacity, setCapacity] = useState(null);
    const [error, setError] = useState(null);
    const [studentSearch, setStudentSearch] = useState("");
    const [studentOptions, setStudentOptions] = useState([]);
    const [studentLoading, setStudentLoading] = useState(false);
    const [studentError, setStudentError] = useState(null);
    const [enrolledStudents, setEnrolledStudents] = useState([]);
    const [enrolledLoading, setEnrolledLoading] = useState(false);
    const [enrolledError, setEnrolledError] = useState(null);
    const [removingId, setRemovingId] = useState(null);
    const [addingId, setAddingId] = useState(null);
    useEffect(() => {
        if (!numericId)
            return;
        let cancelled = false;
        async function load() {
            try {
                const c = await getCourse(numericId);
                if (!cancelled) {
                    setTitle(c.title);
                    setCapacity(c.capacity ?? null);
                }
            }
            catch (e) {
                if (!cancelled)
                    setError(e?.message || "수업 정보를 불러오지 못했습니다.");
            }
        }
        void load();
        return () => { cancelled = true; };
    }, [numericId]);
    useEffect(() => {
        if (!numericId)
            return;
        let cancelled = false;
        async function loadEnrolled() {
            setEnrolledLoading(true);
            setEnrolledError(null);
            try {
                const list = await listCourseStudents(numericId);
                if (!cancelled)
                    setEnrolledStudents(list);
            }
            catch (e) {
                const msg = e?.message || "";
                if (msg.includes("404")) {
                    try {
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
                            setEnrolledStudents(filtered);
                    }
                    catch (e2) {
                        if (!cancelled)
                            setEnrolledError(e2?.message || "등록된 학생 목록을 불러오지 못했습니다.");
                    }
                }
                else {
                    if (!cancelled)
                        setEnrolledError(msg || "등록된 학생 목록을 불러오지 못했습니다.");
                }
            }
            finally {
                if (!cancelled)
                    setEnrolledLoading(false);
            }
        }
        void loadEnrolled();
        return () => { cancelled = true; };
    }, [numericId]);
    // Load all students with optional server-side query
    useEffect(() => {
        let cancelled = false;
        const t = setTimeout(() => {
            async function run() {
                setStudentLoading(true);
                setStudentError(null);
                try {
                    const size = 100;
                    let page = 0;
                    let all = [];
                    const qv = studentSearch.trim();
                    while (true) {
                        const res = await listStudents({ q: qv || undefined, page, size });
                        all = all.concat(res.content);
                        if (res.last || res.content.length === 0 || page > 200)
                            break;
                        page += 1;
                    }
                    if (!cancelled)
                        setStudentOptions(all);
                }
                catch (e) {
                    if (!cancelled)
                        setStudentError(e?.message || "학생 목록을 불러오지 못했습니다.");
                }
                finally {
                    if (!cancelled)
                        setStudentLoading(false);
                }
            }
            void run();
        }, 200);
        return () => { cancelled = true; clearTimeout(t); };
    }, [studentSearch]);
    async function onEnroll(s) {
        if (!numericId)
            return;
        try {
            // capacity guard
            const cap = capacity ?? undefined;
            if (cap && enrolledStudents.length >= cap) {
                setStudentError("정원이 가득 찼습니다.");
                return;
            }
            setAddingId(s.id);
            const existing = Array.isArray(s.courses) ? s.courses.map((c) => c.id) : [];
            if (existing.includes(numericId))
                return;
            const next = Array.from(new Set([...existing, numericId]));
            await updateStudent(s.id, { courseIds: next });
            setEnrolledStudents((prev) => (prev.some(p => p.id === s.id) ? prev : [...prev, s]));
            setStudentOptions((opts) => opts.map((x) => x.id === s.id ? { ...x, courses: [...(x.courses || []), { id: numericId, code: '', title: '', status: '' }] } : x));
        }
        catch (e) {
            setStudentError(e?.message || "추가에 실패했습니다.");
        }
        finally {
            setAddingId(null);
        }
    }
    async function onUnenroll(s) {
        if (!numericId)
            return;
        try {
            setRemovingId(s.id);
            const existing = Array.isArray(s.courses) ? s.courses.map((c) => c.id) : [];
            const next = existing.filter((cid) => cid !== numericId);
            await updateStudent(s.id, { courseIds: next });
            setEnrolledStudents((prev) => prev.filter((x) => x.id !== s.id));
            setStudentOptions((opts) => opts.map((x) => x.id === s.id ? { ...x, courses: (x.courses || []).filter(c => c.id !== numericId) } : x));
        }
        catch (e) {
            setEnrolledError(e?.message || "해제에 실패했습니다.");
        }
        finally {
            setRemovingId(null);
        }
    }
    function statusText(s) {
        switch (s) {
            case "ENROLLED": return "수강중";
            case "ON_LEAVE": return "휴학";
            case "PENDING": return "대기";
            default: return s;
        }
    }
    return (_jsxs(Wrap, { children: [_jsxs(Head, { children: [_jsxs(BackBtn, { type: "button", onClick: () => navigate(`/classes/${numericId}`), children: [leftIcon, " \uC0C1\uC138"] }), _jsx("h2", { children: "\uC218\uAC15\uC0DD \uC218\uC815" }), _jsx(Actions, { children: _jsx(UIGhostBtn, { as: "button", onClick: () => navigate(`/classes/${numericId}`), children: "\uC644\uB8CC" }) })] }), (error || enrolledError) && _jsx(AlertError, { children: error || enrolledError }), _jsxs(Section, { children: [_jsxs(Title, { children: [title || '수업', " - \uD559\uC0DD \uAD00\uB9AC"] }), _jsxs(Grid, { children: [_jsxs("div", { children: [_jsxs(Field, { children: [_jsx(Label, { children: "\uD559\uC0DD \uAC80\uC0C9" }), _jsx(Input, { placeholder: "\uC774\uB984/\uC5F0\uB77D\uCC98\uB85C \uAC80\uC0C9 (\uBE48\uCE78=\uC804\uCCB4)", value: studentSearch, onChange: (e) => setStudentSearch(e.target.value) }), _jsx(Hint, { children: studentLoading ? "검색 중..." : studentError ? studentError : `총 ${studentOptions.length}명 조회됨` })] }), _jsxs(Field, { children: [_jsx(Label, { children: "\uAC80\uC0C9 \uACB0\uACFC" }), _jsxs(ListBox, { children: [studentOptions.length === 0 && _jsx(Muted, { children: "\uAC80\uC0C9 \uACB0\uACFC\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4." }), studentOptions.map(s => {
                                                        const alreadyEnrolled = enrolledStudents.some(es => es.id === s.id);
                                                        const atCapacity = (capacity ?? 0) > 0 && enrolledStudents.length >= (capacity ?? 0);
                                                        return (_jsxs(Row, { children: [_jsxs("div", { children: [_jsx("strong", { children: s.name }), _jsx(SmallMuted, { children: s.code }), _jsx(StatusTag, { "data-type": s.status, children: statusText(s.status) })] }), _jsx(RowActions, { children: alreadyEnrolled ? (_jsx(SmallBtn, { type: "button", disabled: true, title: "\uC774\uBBF8 \uB4F1\uB85D\uB41C \uD559\uC0DD", children: "\uB4F1\uB85D\uB428" })) : (_jsx(SmallBtn, { type: "button", onClick: () => onEnroll(s), disabled: addingId === s.id || atCapacity, title: atCapacity ? "정원 초과" : "추가", children: addingId === s.id ? "추가 중..." : "추가" })) })] }, s.id));
                                                    })] })] })] }), _jsx("div", { children: _jsxs(Field, { children: [_jsxs(Label, { children: ["\uB4F1\uB85D\uB41C \uD559\uC0DD (", enrolledStudents.length, "\uBA85", capacity ? ` / 정원 ${capacity}명` : '', ")"] }), _jsxs(ListBox, { children: [enrolledLoading && _jsx(Muted, { children: "\uBD88\uB7EC\uC624\uB294 \uC911..." }), !enrolledLoading && enrolledStudents.length === 0 && _jsx(Muted, { children: "\uC544\uC9C1 \uB4F1\uB85D\uB41C \uD559\uC0DD\uC774 \uC5C6\uC2B5\uB2C8\uB2E4." }), enrolledStudents.map(s => (_jsxs(Row, { children: [_jsxs("div", { children: [_jsx("strong", { children: s.name }), _jsx(SmallMuted, { children: s.code }), _jsx(StatusTag, { "data-type": s.status, children: statusText(s.status) })] }), _jsx(RowActions, { children: _jsx(SmallBtn, { type: "button", "data-variant": "danger", onClick: () => onUnenroll(s), disabled: removingId === s.id, children: removingId === s.id ? "해제 중..." : "해제" }) })] }, `en-${s.id}`)))] })] }) })] })] })] }));
}
// styles
const Wrap = styled.div ` display:grid; gap:12px; `;
const Head = styled.div ` display:grid; grid-template-columns:auto 1fr auto; gap:12px; align-items:center; `;
const Actions = styled.div ` display:inline-flex; gap:8px; `;
// Section, Title from common UI
const Grid = styled.div ` display:grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap:12px; @media(max-width:900px){ grid-template-columns:1fr; }`;
const Field = styled.div ` display:grid; gap:6px; `;
const Label = styled.div ` color:#6b7280; font-size:12px; font-weight:700; `;
const Input = styled.input ` height:38px; border:1px solid #e5e7eb; border-radius:10px; padding:0 10px; font-size:14px; `;
const Hint = styled.div ` color:#6b7280; font-size:12px; `;
const ListBox = styled.div ` border:1px solid #e5e7eb; border-radius:10px; min-height:40px; max-height:420px; overflow:auto; padding:6px; display:grid; gap:6px; `;
const Row = styled.div ` display:flex; align-items:center; justify-content:space-between; gap:8px; padding:8px 10px; border:1px solid #f1f5f9; border-radius:10px; `;
const RowActions = styled.div ` display:inline-flex; gap:6px; `;
const SmallBtn = styled.button `
  height:28px; padding:0 10px; border-radius:8px; border:1px solid #e5e7eb; background:#fff; color:#111827; font-size:12px;
  &[data-active='true']{ background:#111827; color:#fff; border-color:#111827; }
  &[data-variant='danger']{ border-color:#fecaca; color:#b91c1c; background:#fff; }
`;
const SmallMuted = styled.span ` margin-left:8px; color:#9ca3af; font-size:12px; `;
const StatusTag = styled.span `
  margin-left:8px; padding:2px 6px; border-radius:999px; font-size:11px; font-weight:700; border:1px solid #e5e7eb; color:#374151; background:#f9fafb;
  &[data-type='ENROLLED'] { background:#ecfdf5; color:#047857; border-color:#a7f3d0; }
  &[data-type='ON_LEAVE'] { background:#fff7ed; color:#b45309; border-color:#fed7aa; }
  &[data-type='PENDING'] { background:#f5f3ff; color:#6d28d9; border-color:#ddd6fe; }
`;
const AlertError = styled.div ` background:#fee2e2; color:#b91c1c; border:1px solid #fecaca; padding:10px 12px; border-radius:10px; font-size:13px; `;
const Muted = styled.div ` color:#6b7280; font-size:12px; `;
// Buttons from common UI; keep BackBtn local
const BackBtn = styled.button ` height:32px; padding:0 10px; border-radius:8px; border:1px solid #e5e7eb; background:#fff; color:#111827; font-weight:800; font-size:12px; display:inline-flex; align-items:center; gap:6px; `;
const leftIcon = (_jsx("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: _jsx("polyline", { points: "15 18 9 12 15 6" }) }));
