import { jsx as _jsx } from "react/jsx-runtime";
import { KPI, ClassIcon, DeltaPill } from "./KPI";
export default function KpiClasses({ data, loading, error, onRetry }) {
    const value = data ? `${data.classCountToday}개` : "—";
    const date = data ? data.dateLabel : "—";
    return (_jsx(KPI, { title: "\uC624\uB298 \uC218\uC5C5", icon: _jsx(ClassIcon, {}), iconAccent: "violet", value: value, footerLeft: date, footerRight: _jsx(DeltaPill, { "$tone": "neutral", children: "\uC77C\uC815" }), loading: loading, error: error, onRetry: onRetry }));
}
