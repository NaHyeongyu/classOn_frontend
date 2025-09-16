import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import styled from "styled-components";
import { useEffect, useRef, useState } from "react";
export default function StudentsFilters({ value, onChange, onApply }) {
    const v = value;
    const [composing, setComposing] = useState(false);
    const [qDraft, setQDraft] = useState(v.q);
    const inputRef = useRef(null);
    const [pendingEnter, setPendingEnter] = useState(false);
    useEffect(() => { setQDraft(v.q); }, [v.q]);
    function set(k, val) { onChange({ ...v, [k]: val }); }
    function reset() { onChange({ status: "", from: "", to: "", ageMin: "", ageMax: "", q: "" }); }
    function applySearch() {
        const current = (inputRef.current?.value ?? qDraft).trim();
        onChange({ ...v, q: current });
        onApply?.();
    }
    return (_jsxs(Bar, { children: [_jsxs(Group, { children: [_jsx(Label, { children: "\uC0C1\uD0DC" }), _jsxs(Select, { value: v.status, onChange: (e) => set("status", e.target.value), children: [_jsx("option", { value: "", children: "\uC804\uCCB4" }), _jsx("option", { value: "ENROLLED", children: "\uC218\uAC15\uC911" }), _jsx("option", { value: "ON_LEAVE", children: "\uD734\uD559" }), _jsx("option", { value: "PENDING", children: "\uB300\uAE30\uC911" })] })] }), _jsxs(Group, { children: [_jsx(Label, { children: "\uB4F1\uB85D\uC77C" }), _jsxs(RangeWrap, { children: [_jsx(Input, { type: "date", value: v.from, onChange: (e) => set("from", e.target.value) }), _jsx(Sep, { children: "~" }), _jsx(Input, { type: "date", value: v.to, onChange: (e) => set("to", e.target.value) })] })] }), _jsxs(Group, { children: [_jsx(Label, { children: "\uB098\uC774" }), _jsxs(RangeWrap, { children: [_jsx(Input, { type: "number", placeholder: "12", value: v.ageMin, onChange: (e) => set("ageMin", e.target.value) }), _jsx(Sep, { children: "~" }), _jsx(Input, { type: "number", placeholder: "16", value: v.ageMax, onChange: (e) => set("ageMax", e.target.value) })] })] }), _jsxs(Group, { children: [_jsx(Label, { children: "\uAC80\uC0C9" }), _jsxs(SearchBox, { children: [_jsx(SearchInput, { ref: inputRef, placeholder: "\uD559\uC0DD\uBA85, \uBCF4\uD638\uC790, \uC5F0\uB77D\uCC98 \uB4F1 \uAC80\uC0C9", value: qDraft, onChange: (e) => setQDraft(e.target.value), onCompositionStart: () => setComposing(true), onCompositionEnd: () => { setComposing(false); if (pendingEnter) {
                                    setPendingEnter(false);
                                    applySearch();
                                } }, onKeyDown: (e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        if (composing)
                                            setPendingEnter(true);
                                        else
                                            applySearch();
                                    }
                                } }), _jsx(SearchBtn, { type: "button", onClick: applySearch, children: "\uAC80\uC0C9" }), _jsx(GhostBtn, { type: "button", onClick: reset, children: "\uCD08\uAE30\uD654" })] })] })] }));
}
const Bar = styled.div `
  display: grid; grid-template-columns: 0.6fr 1.2fr 1fr 2.7fr; gap: 12px; align-items: end;
  @media (max-width: 1080px) { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  @media (max-width: 720px) { grid-template-columns: 1fr; }
`;
const Group = styled.div `
  display: grid; gap: 8px; align-items: start;
`;
// (inline search layout)
const Label = styled.span `
  color: #6b7280; font-size: 12px; font-weight: 700;
`;
const Select = styled.select `
  height: 36px; border: 1px solid #e5e7eb; border-radius: 10px; padding: 0 10px; background: #fff; width: 100%;
`;
const Input = styled.input `
  height: 36px; border: 1px solid #e5e7eb; border-radius: 10px; padding: 0 10px; width: 100%;
`;
const RangeWrap = styled.div `
  display: grid; grid-template-columns: 1fr auto 1fr; gap: 6px; align-items: center;
`;
const Sep = styled.span `
  color: #6b7280; font-size: 12px; text-align: center;
`;
const SearchBox = styled.div `
  display: grid; grid-template-columns: 1fr auto auto; gap: 8px; align-items: end;
`;
const SearchInput = styled.input `
  height: 36px; border: 1px solid #e5e7eb; border-radius: 10px; padding: 0 12px; width: 100%;
`;
const SearchBtn = styled.button `
  height: 36px; padding: 0 12px; border-radius: 10px; border: 1px solid #111827; background: #111827; color: #fff; font-weight: 700;
`;
const GhostBtn = styled.button `
  height: 36px; padding: 0 12px; border-radius: 10px; border: 1px solid #e5e7eb; background: #fff; color: #111827; font-weight: 700;
`;
