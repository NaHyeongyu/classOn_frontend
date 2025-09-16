import { jsx as _jsx } from "react/jsx-runtime";
import { KPI, UsersIcon, DeltaPill } from "./KPI";
export default function KpiTotalStudents({ data, loading, error, onRetry, }) {
    const value = data ? `${data.totalStudents}명` : "—";
    const delta = data ? `+${data.deltaStudents}` : "—";
    return (_jsx(KPI, { title: "\uCD1D \uC6D0\uC0DD \uC218", icon: _jsx(UsersIcon, {}), iconAccent: "indigo", value: value, footerLeft: "\uC804\uC6D4 \uB300\uBE44", footerRight: _jsx(DeltaPill, { "$tone": "positive", children: delta }), loading: loading, error: error, onRetry: onRetry }));
}
