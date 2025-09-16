import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Page, Card } from "../components/students/StudentsLayout";
import StudentsStats from "../components/students/StudentsStats";
import StudentsFilters from "../components/students/StudentsFilters";
import StudentsTable from "../components/students/StudentsTable";
import { useState } from "react";
import styled from "styled-components";
export default function Students() {
    const [filters, setFilters] = useState({
        status: "",
        from: "",
        to: "",
        ageMin: "",
        ageMax: "",
        q: "",
    });
    const [refreshKey, setRefreshKey] = useState(0);
    return (_jsxs(Page, { children: [_jsx(Header, { children: _jsxs("div", { children: [_jsx("h2", { children: "\uC6D0\uC0DD \uAD00\uB9AC" }), _jsx("p", { children: "\uB4F1\uB85D\uB41C \uC6D0\uC0DD\uB4E4\uC744 \uD55C\uB208\uC5D0 \uD655\uC778\uD574\uBCF4\uC138\uC694!" })] }) }), _jsx(StudentsStats, {}), _jsx(Card, { children: _jsx(StudentsFilters, { value: filters, onChange: setFilters, onApply: () => setRefreshKey((k) => k + 1) }) }), _jsx(StudentsTable, { filters: filters, refreshKey: refreshKey })] }));
}
const Header = styled.div `
  display: grid; grid-template-columns: 1fr; gap: 6px; align-items: center; margin-bottom: 4px;
  h2 { margin: 0 0 2px; font-size: 22px; color: #0f172a; letter-spacing: -0.01em; }
  p { margin: 0; color: #6b7280; font-size: 13px; }
`;
