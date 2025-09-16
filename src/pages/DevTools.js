import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { GhostBtn as UIGhostBtn, PrimaryBtn as UIPrimaryBtn } from "../components/common/UI";
import { fetchJSON } from "../lib/fetcher";
import { seedDemo } from "../api/dev";
export default function DevTools() {
    const [stats, setStats] = useState(null);
    const [busy, setBusy] = useState(false);
    const [busyCourses, setBusyCourses] = useState(false);
    const [busySeed, setBusySeed] = useState(false);
    const [msg, setMsg] = useState(null);
    const [msgCourses, setMsgCourses] = useState(null);
    const [msgSeed, setMsgSeed] = useState(null);
    const [err, setErr] = useState(null);
    const [errCourses, setErrCourses] = useState(null);
    const [errSeed, setErrSeed] = useState(null);
    const [seedStudents, setSeedStudents] = useState(50);
    const [seedCourses, setSeedCourses] = useState(8);
    const [seedCounsels, setSeedCounsels] = useState(40);
    async function loadStats() {
        try {
            const s = await fetchJSON(`/api/dev/stats`);
            setStats(s);
        }
        catch (e) {
            setErr(e?.message || "통계 조회 실패");
        }
    }
    useEffect(() => { void loadStats(); }, []);
    async function onReset() {
        setBusy(true);
        setErr(null);
        setMsg(null);
        try {
            const res = await fetchJSON(`/api/dev/reset`, { method: 'POST' });
            setMsg(`초기화 완료: records=${res.recordsDeleted}, attendance=${res.attendanceDeleted}, files=${res.filesDeleted}, counsels=${res.counselsDeleted}`);
            await loadStats();
        }
        catch (e) {
            setErr(e?.message || "초기화 실패");
        }
        finally {
            setBusy(false);
        }
    }
    async function onResetCourses() {
        setBusyCourses(true);
        setErrCourses(null);
        setMsgCourses(null);
        try {
            const res = await fetchJSON(`/api/dev/reset-courses`, { method: 'POST' });
            setMsgCourses(`수업 초기화 완료: courses=${res.coursesDeleted}, records=${res.recordsDeleted}, attendance=${res.attendanceDeleted}, files=${res.filesDeleted}, enrollmentsCleared=${res.enrollmentsCleared}`);
            await loadStats();
        }
        catch (e) {
            setErrCourses(e?.message || "수업 초기화 실패");
        }
        finally {
            setBusyCourses(false);
        }
    }
    async function onSeed() {
        setBusySeed(true);
        setErrSeed(null);
        setMsgSeed(null);
        try {
            const res = await seedDemo({ students: seedStudents, courses: seedCourses, counsels: seedCounsels });
            setMsgSeed(`생성 완료: students=${res.studentsCreated ?? '-'}, courses=${res.coursesCreated ?? '-'}, counsels=${res.counselsCreated ?? '-'}`);
            await loadStats();
        }
        catch (e) {
            setErrSeed(e?.message || '데이터 생성 실패');
        }
        finally {
            setBusySeed(false);
        }
    }
    return (_jsxs(Wrap, { children: [_jsx(Head, { children: _jsx("h2", { children: "\uAC1C\uBC1C \uB3C4\uAD6C" }) }), _jsxs(Card, { children: [_jsxs(Row, { children: [_jsxs("div", { children: [_jsx("h3", { children: "\uB370\uC774\uD130 \uC0DD\uC131" }), _jsx("p", { children: "\uD14C\uC2A4\uD2B8\uC6A9 \uB354\uBBF8 \uB370\uC774\uD130\uB97C \uC0DD\uC131\uD569\uB2C8\uB2E4. \uC218\uC5C5 \uB0B4\uC5ED(1\uC8FC)\uB3C4 \uD568\uAED8 \uC900\uBE44\uB429\uB2C8\uB2E4." })] }), _jsxs("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(3, 120px)', gap: 8, alignItems: 'center' }, children: [_jsxs("div", { children: [_jsx(SmallLabel, { children: "\uD559\uC0DD \uC218" }), _jsx("input", { type: "number", min: 0, value: seedStudents, onChange: (e) => setSeedStudents(Number(e.target.value || 0)) })] }), _jsxs("div", { children: [_jsx(SmallLabel, { children: "\uC218\uC5C5 \uC218" }), _jsx("input", { type: "number", min: 0, value: seedCourses, onChange: (e) => setSeedCourses(Number(e.target.value || 0)) })] }), _jsxs("div", { children: [_jsx(SmallLabel, { children: "\uC0C1\uB2F4 \uC218" }), _jsx("input", { type: "number", min: 0, value: seedCounsels, onChange: (e) => setSeedCounsels(Number(e.target.value || 0)) })] }), _jsx("div", { style: { gridColumn: '1 / -1', textAlign: 'right' }, children: _jsx(UIPrimaryBtn, { as: "button", disabled: busySeed, onClick: onSeed, children: busySeed ? '진행중…' : '데이터 생성' }) })] })] }), msgSeed && _jsx(Ok, { children: msgSeed }), errSeed && _jsx(Err, { children: errSeed })] }), _jsxs(Card, { children: [_jsxs(Row, { children: [_jsxs("div", { children: [_jsx("h3", { children: "\uB370\uC774\uD130 \uCD08\uAE30\uD654" }), _jsx("p", { children: "\uC218\uC5C5\uAE30\uB85D/\uCD9C\uC11D/\uCCA8\uBD80/\uC0C1\uB2F4 \uB370\uC774\uD130\uB97C \uBAA8\uB450 \uC0AD\uC81C\uD569\uB2C8\uB2E4. \uD559\uC0DD/\uC218\uC5C5/\uB4F1\uB85D\uC740 \uC720\uC9C0\uB429\uB2C8\uB2E4." })] }), _jsx("div", { children: _jsx(UIPrimaryBtn, { as: "button", disabled: busy, onClick: onReset, children: busy ? '진행중…' : '초기화 실행' }) })] }), msg && _jsx(Ok, { children: msg }), err && _jsx(Err, { children: err })] }), _jsxs(Card, { children: [_jsxs(Row, { children: [_jsxs("div", { children: [_jsx("h3", { children: "\uC218\uC5C5 \uCD08\uAE30\uD654" }), _jsx("p", { children: "\uC218\uC5C5\uACFC \uC218\uC5C5 \uB0B4\uC5ED(\uCD9C\uACB0/\uCCA8\uBD80)\uC744 \uBAA8\uB450 \uC0AD\uC81C\uD569\uB2C8\uB2E4. \uD559\uC0DD/\uC0C1\uB2F4\uC740 \uC720\uC9C0\uB429\uB2C8\uB2E4." })] }), _jsx("div", { children: _jsx(UIPrimaryBtn, { as: "button", disabled: busyCourses, onClick: onResetCourses, children: busyCourses ? '진행중…' : '수업 초기화 실행' }) })] }), msgCourses && _jsx(Ok, { children: msgCourses }), errCourses && _jsx(Err, { children: errCourses })] }), _jsxs(Card, { children: [_jsx("h3", { children: "\uD604\uC7AC \uD1B5\uACC4" }), !stats ? (_jsx(Muted, { children: "\uBD88\uB7EC\uC624\uB294 \uC911\u2026" })) : (_jsxs(Grid, { children: [_jsxs(Item, { children: [_jsx(Label, { children: "\uD559\uC0DD \uC218" }), _jsx(Val, { children: stats.students })] }), _jsxs(Item, { children: [_jsx(Label, { children: "\uC218\uC5C5 \uC218" }), _jsx(Val, { children: stats.courses })] }), _jsxs(Item, { children: [_jsx(Label, { children: "\uC0C1\uB2F4 \uC218" }), _jsx(Val, { children: stats.counsels })] })] })), _jsx(UIGhostBtn, { as: "button", onClick: loadStats, style: { marginTop: 8 }, children: "\uC0C8\uB85C\uACE0\uCE68" })] }), _jsx(Hint, { children: "\uBC31\uC5D4\uB4DC \uC124\uC815(app.dev-endpoints=true)\uC5D0\uC11C\uB9CC \uB3D9\uC791\uD569\uB2C8\uB2E4." })] }));
}
const Wrap = styled.div ` display:grid; gap:12px; `;
const Head = styled.div ` display:flex; align-items:center; gap:8px; h2{ margin:0; font-size:20px; } `;
const Card = styled.section ` background:#fff; border:1px solid #e5e7eb; border-radius:12px; padding:14px; `;
const Row = styled.div ` display:flex; align-items:center; justify-content:space-between; gap:12px; `;
const Ok = styled.div ` margin-top:8px; background:#dcfce7; color:#166534; border:1px solid #bbf7d0; padding:8px 10px; border-radius:8px; font-size:13px; `;
const Err = styled.div ` margin-top:8px; background:#fee2e2; color:#b91c1c; border:1px solid #fecaca; padding:8px 10px; border-radius:8px; font-size:13px; `;
const Muted = styled.div ` color:#6b7280; font-size:13px; `;
const Grid = styled.div ` display:grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap:10px; `;
const Item = styled.div ` border:1px solid #e5e7eb; border-radius:10px; padding:10px; background:#fafafa; `;
const Label = styled.div ` color:#6b7280; font-size:12px; `;
const Val = styled.div ` font-size:18px; font-weight:900; color:#0f172a; `;
const Hint = styled.div ` color:#6b7280; font-size:12px; `;
const SmallLabel = styled.div ` color:#6b7280; font-size:12px; margin-bottom:4px; `;
