import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import styled from "styled-components";
import { Page as PageWrap, SectionCard as SectionCard } from "../components/common/UI";
import { useState } from "react";
import ClassesFilters from "../components/classes/ClassesFilters";
import ClassesTable from "../components/classes/ClassesTable";
import ClassesStats from "../components/classes/ClassesStats";
export default function Classes() {
    const [filters, setFilters] = useState({ status: "", q: "" });
    const [refreshKey, setRefreshKey] = useState(0);
    return (_jsxs(PageWrap, { children: [_jsx(Head, { children: _jsxs("div", { children: [_jsx("h2", { children: "\uC218\uC5C5 \uAD00\uB9AC" }), _jsx("p", { children: "\uAC1C\uC124\uB41C \uC218\uC5C5\uC744 \uC870\uD68C\uD558\uACE0 \uBE60\uB974\uAC8C \uAC80\uC0C9\uD558\uC138\uC694." })] }) }), _jsx(ClassesStats, {}), _jsx(SectionCard, { children: _jsx(ClassesFilters, { value: filters, onChange: setFilters, onApply: () => setRefreshKey(k => k + 1) }) }), _jsx(ClassesTable, { filters: filters, refreshKey: refreshKey })] }));
}
// Page wrapper provided by common UI
const Head = styled.div `
  display: grid; grid-template-columns: 1fr; gap: 6px; align-items: center;
  h2 { margin: 0; font-size: 22px; color: #0f172a; letter-spacing: -0.01em; }
  p { margin: 0; color: #6b7280; font-size: 13px; }
`;
