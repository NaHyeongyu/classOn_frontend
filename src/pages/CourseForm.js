import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { GhostBtn as UIGhostBtn, PrimaryBtn as UIPrimaryBtn } from "../components/common/UI";
import { SectionCard as Section, TitleH3 as Title } from "../components/common/UI";
import { createCourse, getCourse, updateCourse } from "../api/courses";
export default function CourseForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = useMemo(() => !!id, [id]);
    const numericId = useMemo(() => (id ? Number(id) : null), [id]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [form, setForm] = useState({
        title: "",
        description: "",
        status: "IN_PROGRESS",
    });
    const toggleDay = useToggleDay(form, setForm);
    const [recurring, setRecurring] = useState(true);
    function pad2(n) { return String(n).padStart(2, '0'); }
    useEffect(() => {
        if (!isEdit || !numericId)
            return;
        let cancelled = false;
        async function load() {
            setLoading(true);
            setError(null);
            try {
                const found = await getCourse(numericId);
                if (!cancelled && found) {
                    setForm({
                        title: found.title,
                        description: found.description,
                        status: found.status,
                        capacity: found.capacity,
                        fee: found.fee,
                        courseTime: found.courseTime,
                        recurrenceDays: found.recurrenceDays,
                        startTime: found.startTime ? found.startTime.slice(0, 5) : "",
                        endTime: found.endTime ? found.endTime.slice(0, 5) : "",
                    });
                }
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
    }, [isEdit, numericId]);
    async function onSubmit(e) {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        if (!form.title || !form.title.trim()) {
            setError("수업명은 필수입니다.");
            return;
        }
        setSaving(true);
        try {
            // validation: recurrence days/time required
            if (recurring) {
                if (!form.recurrenceDays || !form.recurrenceDays.trim() || !form.startTime || !form.endTime) {
                    setError("반복 요일과 시작/종료 시간은 필수입니다.");
                    return;
                }
            }
            if (isEdit && numericId) {
                await updateCourse(numericId, {
                    ...form,
                    // send LocalTime-compatible strings (HH:mm:ss)
                    startTime: form.startTime?.length === 5 ? `${form.startTime}:00` : form.startTime,
                    endTime: form.endTime?.length === 5 ? `${form.endTime}:00` : form.endTime,
                    recurring,
                });
                setSuccess("수정이 완료되었습니다.");
            }
            else {
                await createCourse({
                    ...form,
                    startTime: form.startTime?.length === 5 ? `${form.startTime}:00` : form.startTime,
                    endTime: form.endTime?.length === 5 ? `${form.endTime}:00` : form.endTime,
                    recurring,
                });
                setSuccess("수업이 추가되었습니다.");
            }
            // 학생 추가는 편집 화면에서 즉시 반영하므로 여기서는 별도 처리 없음
            navigate(`/classes`, { replace: true });
        }
        catch (e) {
            setError(e?.message || "저장에 실패했습니다.");
        }
        finally {
            setSaving(false);
        }
    }
    return (_jsxs(Wrap, { children: [_jsxs(Head, { children: [_jsxs(BackBtn, { type: "button", onClick: () => navigate("/classes"), children: [leftIcon, " \uB4A4\uB85C"] }), _jsx("h2", { children: isEdit ? "수업 수정" : "수업 추가하기" }), _jsxs(Actions, { children: [_jsx(UIGhostBtn, { as: "button", onClick: () => navigate("/classes"), children: "\uCDE8\uC18C" }), _jsx(UIPrimaryBtn, { as: "button", type: "submit", form: "course-form", disabled: saving, children: saving ? "저장 중..." : "저장" })] })] }), error && _jsx(AlertError, { children: error }), success && _jsx(AlertOk, { children: success }), loading ? _jsx(FormSk, {}) : (_jsxs(Form, { id: "course-form", onSubmit: onSubmit, children: [_jsxs(Section, { children: [_jsx(Title, { children: "\uAE30\uBCF8 \uC815\uBCF4" }), _jsxs(GridOne, { children: [_jsxs(Field, { children: [_jsxs(Label, { children: ["\uC218\uC5C5\uBA85", _jsx("span", { children: "*" })] }), _jsx(Input, { value: form.title, onChange: (e) => setForm(f => ({ ...f, title: e.target.value })), placeholder: "\uC608: \uC601\uC5B4 \uD68C\uD654 A\uBC18" })] }), _jsxs(Field, { children: [_jsx(Label, { children: "\uC0C1\uD0DC" }), _jsxs(Select, { value: form.status, onChange: (e) => setForm(f => ({ ...f, status: e.target.value })), children: [_jsx("option", { value: "IN_PROGRESS", children: "\uC9C4\uD589\uC911" }), _jsx("option", { value: "PENDING", children: "\uB300\uAE30" }), _jsx("option", { value: "STOPPED", children: "\uC911\uB2E8" })] })] }), _jsxs(Field, { children: [_jsx(Label, { children: "\uBC18\uBCF5 \uC5EC\uBD80" }), _jsxs(Toggle, { children: [_jsx("input", { id: "recurring", type: "checkbox", checked: recurring, onChange: (e) => setRecurring(e.currentTarget.checked) }), _jsx("label", { htmlFor: "recurring", children: "\uC815\uAE30 \uBC18\uBCF5" })] })] }), _jsxs(Field, { children: [_jsx(Label, { children: "\uBC18\uBCF5 \uC694\uC77C" }), _jsx(Days, { children: dayOptions.map(d => (_jsxs("label", { children: [_jsx("input", { type: "checkbox", disabled: !recurring, checked: hasDay(form.recurrenceDays, d.value), onChange: (e) => toggleDay(d.value, e.currentTarget.checked) }), " ", d.label] }, d.value))) }), _jsx(Hint, { children: "\uC608: \uC6D4/\uC218\uB294 MON,WED \uB85C \uC800\uC7A5\uB429\uB2C8\uB2E4." })] }), _jsxs(Field, { children: [_jsx(Label, { children: "\uBC18\uBCF5 \uC2DC\uAC04" }), _jsxs(TimeRow, { children: [_jsx("select", { disabled: !recurring, value: (form.startTime ?? '').slice(0, 2) || '00', onChange: (e) => {
                                                            const hh = e.target.value;
                                                            const mm = (form.startTime ?? '00:00').slice(3, 5) || '00';
                                                            setForm(f => ({ ...f, startTime: `${hh}:${mm}` }));
                                                        }, children: Array.from({ length: 24 }, (_, i) => pad2(i)).map(h => _jsx("option", { value: h, children: h }, h)) }), _jsx("span", { children: ":" }), _jsx("select", { disabled: !recurring, value: (form.startTime ?? '').slice(3, 5) || '00', onChange: (e) => {
                                                            const mm = e.target.value;
                                                            const hh = (form.startTime ?? '00:00').slice(0, 2) || '00';
                                                            setForm(f => ({ ...f, startTime: `${hh}:${mm}` }));
                                                        }, children: ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'].map(m => _jsx("option", { value: m, children: m }, m)) }), _jsx("span", { children: "~" }), _jsx("select", { disabled: !recurring, value: (form.endTime ?? '').slice(0, 2) || '00', onChange: (e) => {
                                                            const hh = e.target.value;
                                                            const mm = (form.endTime ?? '00:00').slice(3, 5) || '00';
                                                            setForm(f => ({ ...f, endTime: `${hh}:${mm}` }));
                                                        }, children: Array.from({ length: 24 }, (_, i) => pad2(i)).map(h => _jsx("option", { value: h, children: h }, h)) }), _jsx("span", { children: ":" }), _jsx("select", { disabled: !recurring, value: (form.endTime ?? '').slice(3, 5) || '00', onChange: (e) => {
                                                            const mm = e.target.value;
                                                            const hh = (form.endTime ?? '00:00').slice(0, 2) || '00';
                                                            setForm(f => ({ ...f, endTime: `${hh}:${mm}` }));
                                                        }, children: ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'].map(m => _jsx("option", { value: m, children: m }, m)) })] }), _jsx(Hint, { children: "\uC2DC/\uBD84\uC744 \uACE0\uC815 \uC635\uC158\uC73C\uB85C \uC120\uD0DD\uD569\uB2C8\uB2E4(5\uBD84 \uB2E8\uC704)." })] }), _jsxs(Field, { children: [_jsx(Label, { children: "\uC815\uC6D0" }), _jsx(Input, { type: "number", value: form.capacity ?? "", onChange: (e) => setForm(f => ({ ...f, capacity: e.target.value ? Number(e.target.value) : undefined })), placeholder: "\uC608: 12" })] }), _jsxs(Field, { children: [_jsx(Label, { children: "\uC218\uAC15\uB8CC(\uC6D0)" }), _jsx(Input, { type: "number", value: form.fee ?? "", onChange: (e) => setForm(f => ({ ...f, fee: e.target.value ? Number(e.target.value) : undefined })), placeholder: "\uC608: 150000" })] }), _jsxs(Field, { style: { gridColumn: "1 / -1" }, children: [_jsx(Label, { children: "\uC124\uBA85" }), _jsx(TextArea, { rows: 5, value: form.description ?? "", onChange: (e) => setForm(f => ({ ...f, description: e.target.value })), placeholder: "\uC218\uC5C5\uC5D0 \uB300\uD55C \uAC04\uB2E8\uD55C \uC124\uBA85" })] })] })] }), _jsxs(Section, { children: [_jsx(Title, { children: "\uD559\uC0DD \uAD00\uB9AC" }), _jsx(Hint, { children: "\uD559\uC0DD \uAD00\uB9AC\uB294 \uC0C1\uC138 \uD398\uC774\uC9C0\uC758 \u2018\uC218\uAC15\uC0DD \uC218\uC815\u2019\uC5D0\uC11C \uBCC0\uACBD\uD558\uC138\uC694." }), isEdit && (_jsx("div", { children: _jsx(UIGhostBtn, { as: "button", onClick: () => navigate(`/classes/${numericId}/edit-students`), children: "\uC218\uAC15\uC0DD \uC218\uC815 \uBC14\uB85C\uAC00\uAE30" }) }))] })] }))] }));
}
const Wrap = styled.div ` display:grid; gap:12px; `;
const Head = styled.div ` display:grid; grid-template-columns:auto 1fr auto; gap:12px; align-items:center; `;
const Actions = styled.div ` display:inline-flex; gap:8px; `;
const Form = styled.form `
  display: grid;
  gap: 12px;
  /* 3.5 : 6.5 ratio (35% : 65%) */
  grid-template-columns: 7fr 13fr;
  align-items: start;
  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
  }
`;
// Section, Title from common UI
const GridOne = styled.div ` display:grid; grid-template-columns: 1fr; gap:12px; `;
const Field = styled.label ` display:grid; gap:6px; `;
const Label = styled.div ` color:#6b7280; font-size:12px; font-weight:700; span{ color:#ef4444; }`;
const Input = styled.input ` height:38px; border:1px solid #e5e7eb; border-radius:10px; padding:0 10px; font-size:14px; `;
const Select = styled.select ` height:38px; border:1px solid #e5e7eb; border-radius:10px; padding:0 10px; font-size:14px; background:#fff; `;
const TextArea = styled.textarea ` border:1px solid #e5e7eb; border-radius:10px; padding:10px; font-size:14px; resize:vertical; `;
const Hint = styled.div ` color:#6b7280; font-size:12px; `;
const Days = styled.div ` display:flex; flex-wrap:wrap; gap:10px; `;
const TimeRow = styled.div ` display:grid; grid-template-columns: 1fr auto 1fr auto 1fr auto 1fr; gap:8px; align-items:center; `;
// Buttons from common UI
const AlertError = styled.div ` background:#fee2e2; color:#b91c1c; border:1px solid #fecaca; padding:10px 12px; border-radius:10px; font-size:13px; `;
const AlertOk = styled.div ` background:#dcfce7; color:#166534; border:1px solid #bbf7d0; padding:10px 12px; border-radius:10px; font-size:13px; `;
// removed unused Muted style
const shimmer = keyframes ` 0%{ background-position:-200px 0; } 100%{ background-position:200px 0; }`;
const Sk = styled.div ` background:linear-gradient(90deg,#eef2f7 25%,#f6f8fb 37%,#eef2f7 63%); background-size:400px 100%; animation:${shimmer} 1.2s ease-in-out infinite; border-radius:8px; width:100%; height:${p => p.h || 12}px; `;
function FormSk() {
    return (_jsxs(Section, { children: [_jsx(Title, { children: "\uAE30\uBCF8 \uC815\uBCF4" }), _jsxs(GridOne, { children: [_jsx(Sk, { h: 38 }), _jsx(Sk, { h: 38 }), _jsx(Sk, { h: 38 }), _jsx(Sk, { h: 38 }), _jsx(Sk, { h: 120 })] })] }));
}
const BackBtn = styled.button ` height:32px; padding:0 10px; border-radius:8px; border:1px solid #e5e7eb; background:#fff; color:#111827; font-weight:800; font-size:12px; display:inline-flex; align-items:center; gap:6px; `;
const leftIcon = (_jsx("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: _jsx("polyline", { points: "15 18 9 12 15 6" }) }));
const dayOptions = [
    { value: "MON", label: "월" },
    { value: "TUE", label: "화" },
    { value: "WED", label: "수" },
    { value: "THU", label: "목" },
    { value: "FRI", label: "금" },
    { value: "SAT", label: "토" },
    { value: "SUN", label: "일" },
];
function hasDay(recurrenceDays, d) {
    if (!recurrenceDays || !d)
        return false;
    return recurrenceDays.split(',').map(s => s.trim().toUpperCase()).includes(d);
}
function joinDays(list) {
    return Array.from(new Set(list)).filter(Boolean).join(',');
}
function useToggleDay(form, setForm) {
    return (d, checked) => {
        const current = (form.recurrenceDays || '').split(',').map((s) => s.trim()).filter((s) => s);
        const next = checked ? [...current, d] : current.filter((x) => x !== d);
        setForm((f) => ({ ...f, recurrenceDays: joinDays(next) }));
    };
}
const Toggle = styled.div ` display:inline-flex; gap:8px; align-items:center; input[type='checkbox']{ width:18px; height:18px; }`;
