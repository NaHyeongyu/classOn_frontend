import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { GhostBtn as UIGhostBtn, PrimaryBtn as UIPrimaryBtn, SectionCard as Section, TitleH3 as SectionTitle } from "../components/common/UI";
import { createStudent, getStudent, updateStudent } from "../api/students";
export default function StudentForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = useMemo(() => !!id, [id]);
    const numericId = useMemo(() => (id ? Number(id) : null), [id]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    function today() {
        const d = new Date();
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const dd = String(d.getDate()).padStart(2, "0");
        return `${d.getFullYear()}-${mm}-${dd}`;
    }
    const [form, setForm] = useState({
        name: "",
        status: "ENROLLED",
        joinedDate: today(),
    });
    // Birthdate pieces for friendlier selection (YYYY/MM/DD)
    const [dobY, setDobY] = useState("");
    const [dobM, setDobM] = useState("");
    const [dobD, setDobD] = useState("");
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 40 }, (_, i) => String(currentYear - i));
    const months = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"));
    function daysInMonth(y, m) {
        const yy = Number(y), mm = Number(m);
        if (!yy || !mm)
            return 31;
        return new Date(yy, mm, 0).getDate();
    }
    const days = Array.from({ length: daysInMonth(dobY, dobM) }, (_, i) => String(i + 1).padStart(2, "0"));
    function parseYMD(s) {
        const [y, m, d] = s.split("-").map((v) => Number(v));
        if (!y || !m || !d)
            return null;
        return { y, m, d };
    }
    function calcIntlAge(ymd) {
        if (!ymd)
            return undefined;
        const parts = parseYMD(ymd);
        if (!parts)
            return undefined;
        const now = new Date();
        let age = now.getFullYear() - parts.y;
        const month = now.getMonth() + 1;
        const day = now.getDate();
        if (month < parts.m || (month === parts.m && day < parts.d))
            age -= 1;
        return age;
    }
    function calcKoreanAge(ymd) {
        if (!ymd)
            return undefined;
        const parts = parseYMD(ymd);
        if (!parts)
            return undefined;
        const now = new Date();
        return now.getFullYear() - parts.y + 1;
    }
    const intlAge = useMemo(() => calcIntlAge(form.birthDate), [form.birthDate]);
    const koreanAge = useMemo(() => calcKoreanAge(form.birthDate), [form.birthDate]);
    useEffect(() => {
        if (!isEdit || !numericId)
            return;
        let cancelled = false;
        async function load() {
            setLoading(true);
            setError(null);
            try {
                const s = await getStudent(numericId);
                if (!cancelled) {
                    setForm({
                        name: s.name,
                        status: s.status,
                        age: s.age,
                        phoneNumber: s.phoneNumber,
                        guardianPhone: s.guardianPhone,
                        joinedDate: s.joinedDate ?? s.createdAt?.slice(0, 10),
                        birthDate: s.birthDate,
                        address: s.address,
                        parentName: s.parentName,
                    });
                    if (s.birthDate) {
                        const [y, m, d] = s.birthDate.split("-");
                        setDobY(y || "");
                        setDobM(m || "");
                        setDobD(d || "");
                    }
                    else {
                        setDobY("");
                        setDobM("");
                        setDobD("");
                    }
                }
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
    }, [isEdit, numericId]);
    // Update form.birthDate when dob pieces change
    function updateDOB(y, m, d) {
        const ny = y ?? dobY;
        const nm = m ?? dobM;
        const nd = d ?? dobD;
        setDobY(ny);
        setDobM(nm);
        setDobD(nd);
        if (ny && nm && nd) {
            setForm((f) => ({ ...f, birthDate: `${ny}-${nm}-${nd}` }));
        }
        else {
            setForm((f) => ({ ...f, birthDate: undefined }));
        }
    }
    async function onSubmit(e) {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        if (!form.name || !form.name.trim()) {
            setError("이름은 필수입니다.");
            return;
        }
        setSaving(true);
        try {
            const payload = {
                ...form,
                name: form.name.trim(),
                status: form.status || "ENROLLED",
            };
            if (intlAge != null)
                payload.age = intlAge;
            let res;
            if (isEdit && numericId) {
                res = await updateStudent(numericId, payload);
                setSuccess("수정이 완료되었습니다.");
                navigate(`/students/${res.id}`, { replace: true });
            }
            else {
                res = await createStudent(payload);
                setSuccess("원생이 추가되었습니다.");
                navigate(`/students/${res.id}`, { replace: true });
            }
        }
        catch (e) {
            setError(e?.message || "저장에 실패했습니다.");
        }
        finally {
            setSaving(false);
        }
    }
    return (_jsxs(Page, { children: [_jsxs(Header, { children: [_jsxs(HeadLeft, { children: [_jsxs(BackBtn, { type: "button", onClick: () => navigate("/students"), title: "\uBAA9\uB85D\uC73C\uB85C", children: [leftIcon, " \uB4A4\uB85C"] }), _jsxs("div", { children: [_jsx("h2", { children: isEdit ? "원생 정보 수정" : "원생 추가하기" }), _jsx("p", { children: "\uAE30\uBCF8 \uC815\uBCF4\uB97C \uC785\uB825\uD558\uACE0 \uC800\uC7A5\uD558\uC138\uC694." })] })] }), _jsxs(HeadActions, { children: [_jsx(UIGhostBtn, { as: "button", onClick: () => navigate("/students"), children: "\uCDE8\uC18C" }), _jsx(UIPrimaryBtn, { as: "button", type: "submit", form: "student-form", disabled: saving, children: saving ? "저장 중..." : "저장" })] })] }), error && _jsx(AlertError, { children: error }), success && _jsx(AlertOk, { children: success }), loading ? (_jsx(FormSkeleton, {})) : (_jsxs(Form, { id: "student-form", onSubmit: onSubmit, children: [_jsxs(Section, { children: [_jsx(SectionTitle, { children: "\uAE30\uBCF8 \uC815\uBCF4" }), _jsxs(Grid, { children: [_jsxs(Field, { children: [_jsxs(Label, { children: ["\uC774\uB984", _jsx("span", { children: "*" })] }), _jsx(Input, { value: form.name, onChange: (e) => setForm(f => ({ ...f, name: e.target.value })), placeholder: "\uD64D\uAE38\uB3D9", required: true, disabled: saving }), _jsx(Help, { children: "\uCD9C\uC11D\uBD80/\uCCAD\uAD6C\uC11C\uC5D0 \uD45C\uC2DC\uB420 \uC774\uB984\uC785\uB2C8\uB2E4." })] }), _jsxs(Field, { children: [_jsx(Label, { children: "\uC0C1\uD0DC" }), _jsxs(Select, { value: form.status || "ENROLLED", onChange: (e) => setForm(f => ({ ...f, status: e.target.value })), disabled: saving, children: [_jsx("option", { value: "ENROLLED", children: "\uC218\uAC15\uC911" }), _jsx("option", { value: "ON_LEAVE", children: "\uD734\uD559" }), _jsx("option", { value: "PENDING", children: "\uB300\uAE30\uC911" })] })] }), _jsxs(Field, { children: [_jsx(Label, { children: "\uC0DD\uB144\uC6D4\uC77C" }), _jsxs(TripleGrid, { children: [_jsxs(Select, { value: dobY, onChange: (e) => updateDOB(e.target.value || "", undefined, undefined), disabled: saving, children: [_jsx("option", { value: "", children: "\uC5F0\uB3C4" }), years.map((y) => (_jsx("option", { value: y, children: y }, y)))] }), _jsxs(Select, { value: dobM, onChange: (e) => updateDOB(undefined, e.target.value || "", undefined), disabled: saving, children: [_jsx("option", { value: "", children: "\uC6D4" }), months.map((m) => (_jsx("option", { value: m, children: m }, m)))] }), _jsxs(Select, { value: dobD, onChange: (e) => updateDOB(undefined, undefined, e.target.value || ""), disabled: saving, children: [_jsx("option", { value: "", children: "\uC77C" }), days.map((dd) => (_jsx("option", { value: dd, children: dd }, dd)))] })] }), _jsx(Help, { children: "\uC0DD\uB144\uC6D4\uC77C \uC785\uB825 \uC2DC \uB098\uC774\uB294 \uC790\uB3D9 \uACC4\uC0B0\uB429\uB2C8\uB2E4." })] }), _jsxs(Field, { children: [_jsx(Label, { children: "\uB098\uC774(\uC790\uB3D9)" }), _jsx(Input, { value: koreanAge != null ? `${koreanAge} (만 ${intlAge ?? "-"}세)` : "-", readOnly: true, disabled: true })] }), _jsxs(Field, { children: [_jsx(Label, { children: "\uC5F0\uB77D\uCC98" }), _jsx(Input, { value: form.phoneNumber ?? "", onChange: (e) => setForm(f => ({ ...f, phoneNumber: e.target.value || undefined })), placeholder: "010-1234-5678", disabled: saving })] }), _jsxs(Field, { children: [_jsx(Label, { children: "\uB4F1\uB85D\uC77C" }), _jsx(Input, { type: "date", value: form.joinedDate ?? "", readOnly: true, disabled: true })] })] })] }), _jsxs(Section, { children: [_jsx(SectionTitle, { children: "\uBD80\uBAA8\uB2D8/\uC8FC\uC18C" }), _jsxs(Grid, { children: [_jsxs(Field, { children: [_jsx(Label, { children: "\uBCF4\uD638\uC790 \uC774\uB984" }), _jsx(Input, { value: form.parentName ?? "", onChange: (e) => setForm(f => ({ ...f, parentName: e.target.value || undefined })), placeholder: "\uAE40\uCCA0\uC218", disabled: saving })] }), _jsxs(Field, { children: [_jsx(Label, { children: "\uBCF4\uD638\uC790 \uC5F0\uB77D\uCC98" }), _jsx(Input, { value: form.guardianPhone ?? "", onChange: (e) => setForm(f => ({ ...f, guardianPhone: e.target.value || undefined })), placeholder: "010-0000-0000", disabled: saving })] }), _jsxs(Field, { style: { gridColumn: "1 / -1" }, children: [_jsx(Label, { children: "\uC8FC\uC18C" }), _jsx(Input, { value: form.address ?? "", onChange: (e) => setForm(f => ({ ...f, address: e.target.value || undefined })), placeholder: "\uC11C\uC6B8\uC2DC \uAC15\uB0A8\uAD6C ...", disabled: saving })] })] })] }), isEdit && (_jsxs(DangerZone, { children: [_jsx(ZoneTitle, { children: "\uC704\uD5D8 \uAD6C\uC5ED" }), _jsx(ZoneDesc, { children: "\uC0AD\uC81C \uAE30\uB2A5\uC740 \uCD94\uD6C4 \uC5F0\uACB0\uB429\uB2C8\uB2E4. (\uB514\uC790\uC778 \uD504\uB9AC\uC14B)" }), _jsx(DangerBtn, { type: "button", disabled: true, children: "\uC6D0\uC0DD \uC0AD\uC81C" })] }))] }))] }));
}
const Page = styled.div `
  display: grid; gap: 12px;
`;
const Header = styled.div `
  position: sticky; top: 0; z-index: 10; background: #fff;
  display: flex; align-items: center; justify-content: space-between; gap: 10px;
  padding-top: 2px;
  h2 { margin: 0; font-size: 20px; color: #0f172a; }
  p { margin: 0; color: #6b7280; }
  &:after { content: ""; display: block; position: absolute; left: 0; right: 0; bottom: -6px; height: 6px; background: linear-gradient(180deg, rgba(255,255,255,0.85), rgba(255,255,255,0)); pointer-events: none; }
`;
const HeadLeft = styled.div `
  display: flex; align-items: center; gap: 10px;
`;
const HeadActions = styled.div `
  display: inline-flex; gap: 8px;
`;
const BackBtn = styled.button `
  height: 32px; padding: 0 10px; border-radius: 8px; border: 1px solid #e5e7eb; background: #fff; color: #111827; font-weight: 800; font-size: 12px; display: inline-flex; align-items: center; gap: 6px;
`;
const Form = styled.form `
  display: grid; gap: 12px;
`;
// Section/Title from common UI
const Grid = styled.div `
  display: grid; grid-template-columns: 1fr; gap: 12px;
`;
const Field = styled.label `
  display: grid; gap: 6px; align-items: start;
`;
const Label = styled.div `
  color: #475569; font-size: 13px; font-weight: 800; display: inline-flex; gap: 4px; align-items: center; text-align: left;
  span { color: #ef4444; }
`;
const Input = styled.input `
  height: 42px; border: 1px solid #e5e7eb; border-radius: 10px; padding: 0 12px; font-size: 14px; color: #111827; width: 100%;
  &::placeholder { color: #9ca3af; }
  &:focus { outline: none; box-shadow: 0 0 0 3px rgba(79,70,229,0.15); }
  &:disabled { background: #f9fafb; color: #6b7280; }
`;
const Select = styled.select `
  height: 42px; border: 1px solid #e5e7eb; border-radius: 10px; padding: 0 12px; font-size: 14px; background: #fff; color: #111827; width: 100%;
  &:focus { outline: none; box-shadow: 0 0 0 3px rgba(79,70,229,0.15); }
  &:disabled { background: #f9fafb; color: #6b7280; }
`;
const TripleGrid = styled.div `
  display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px;
`;
// Buttons from common UI
const AlertError = styled.div `
  background:#fee2e2; color:#b91c1c; border:1px solid #fecaca; padding:10px 12px; border-radius:10px; font-size:13px;
`;
const AlertOk = styled.div `
  background:#dcfce7; color:#166534; border:1px solid #bbf7d0; padding:10px 12px; border-radius:10px; font-size:13px;
`;
const Help = styled.div `
  color: #6b7280; font-size: 12px;
`;
// Danger Zone (edit only)
const DangerZone = styled.section `
  background: #fff1f2; border: 1px solid #ffe4e6; border-radius: 14px; padding: 14px; display: grid; gap: 8px;
`;
const ZoneTitle = styled.div `
  color: #be123c; font-weight: 900;
`;
const ZoneDesc = styled.div `
  color: #9f1239; font-size: 12px;
`;
const DangerBtn = styled.button `
  height: 36px; padding: 0 14px; border-radius: 10px; border: 1px solid #e11d48; background: #e11d48; color: #fff; font-weight: 800; font-size: 12px; justify-self: start; opacity: 0.6; cursor: not-allowed;
`;
// Skeletons
const shimmer = keyframes `
  0% { background-position: -200px 0; }
  100% { background-position: 200px 0; }
`;
const Sk = styled.div `
  background: linear-gradient(90deg, #eef2f7 25%, #f6f8fb 37%, #eef2f7 63%);
  background-size: 400px 100%;
  animation: ${shimmer} 1.2s ease-in-out infinite;
  border-radius: 8px;
  width: ${({ w }) => (w ? `${w}px` : "100%")};
  height: ${({ h }) => (h ? `${h}px` : "12px")};
`;
function FormSkeleton() {
    return (_jsxs("div", { style: { display: "grid", gap: 12 }, children: [_jsxs(Section, { children: [_jsx(SectionTitle, { children: "\uAE30\uBCF8 \uC815\uBCF4" }), _jsxs(Grid, { children: [_jsx(Sk, { h: 38 }), _jsx(Sk, { h: 38 }), _jsx(Sk, { h: 38 }), _jsx(Sk, { h: 38 }), _jsx(Sk, { h: 38 }), _jsx(Sk, { h: 38 })] })] }), _jsxs(Section, { children: [_jsx(SectionTitle, { children: "\uBD80\uBAA8\uB2D8/\uC8FC\uC18C" }), _jsxs(Grid, { children: [_jsx(Sk, { h: 38 }), _jsx(Sk, { h: 38 }), _jsx(Sk, { h: 38 })] })] })] }));
}
const leftIcon = (_jsx("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: _jsx("polyline", { points: "15 18 9 12 15 6" }) }));
