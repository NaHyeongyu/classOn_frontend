import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import styled from "styled-components";
import { useState, useRef, useEffect } from "react";
export default function ClassesFilters({ value, onChange, onApply }) {
    const v = value;
    const [qDraft, setQDraft] = useState(v.q);
    const inputRef = useRef(null);
    const [composing, setComposing] = useState(false);
    const [pendingEnter, setPendingEnter] = useState(false);
    useEffect(() => { setQDraft(v.q); }, [v.q]);
    function set(k, val) { onChange({ ...v, [k]: val }); }
    function apply() {
        const current = (inputRef.current?.value ?? qDraft).trim();
        onChange({ ...v, q: current });
        onApply?.();
    }
    return (_jsxs(Bar, { children: [_jsxs(Group, { children: [_jsx(Label, { children: "\uC0C1\uD0DC" }), _jsxs(Select, { value: v.status, onChange: (e) => set("status", e.target.value), children: [_jsx("option", { value: "", children: "\uC804\uCCB4" }), _jsx("option", { value: "IN_PROGRESS", children: "\uC9C4\uD589\uC911" }), _jsx("option", { value: "STOPPED", children: "\uC911\uB2E8" }), _jsx("option", { value: "PENDING", children: "\uB300\uAE30" })] })] }), _jsxs(Group, { children: [_jsx(Label, { children: "\uAC80\uC0C9" }), _jsxs(SearchBox, { children: [_jsx(SearchInput, { ref: inputRef, placeholder: "\uC218\uC5C5\uBA85, \uCF54\uB4DC, \uC124\uBA85 \uAC80\uC0C9", value: qDraft, onChange: (e) => setQDraft(e.target.value), onCompositionStart: () => setComposing(true), onCompositionEnd: () => { setComposing(false); if (pendingEnter) {
                                    setPendingEnter(false);
                                    apply();
                                } }, onKeyDown: (e) => { if (e.key === 'Enter') {
                                    e.preventDefault();
                                    if (composing)
                                        setPendingEnter(true);
                                    else
                                        apply();
                                } } }), _jsx(PrimaryBtn, { type: "button", onClick: apply, children: "\uAC80\uC0C9" })] })] })] }));
}
const Bar = styled.div `
  display: grid; grid-template-columns: 0.7fr 2.3fr; gap: 12px; align-items: end;
  @media (max-width: 720px) { grid-template-columns: 1fr; }
`;
const Group = styled.div ` display: grid; gap: 8px; `;
const Label = styled.span ` color:#6b7280; font-size:12px; font-weight:700; `;
const Select = styled.select ` height:36px; border:1px solid #e5e7eb; border-radius:10px; padding:0 10px; width:100%; `;
const SearchBox = styled.div ` display:grid; grid-template-columns:1fr auto; gap:8px; `;
const SearchInput = styled.input ` height:36px; border:1px solid #e5e7eb; border-radius:10px; padding:0 12px; width:100%; `;
const PrimaryBtn = styled.button ` height:36px; padding:0 12px; border-radius:10px; border:1px solid #111827; background:#111827; color:#fff; font-weight:700; `;
