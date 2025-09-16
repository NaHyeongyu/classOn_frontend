import { jsx as _jsx } from "react/jsx-runtime";
import { KPI, CheckIcon, DeltaPill } from "./KPI";
export default function KpiAttendance({ data, loading, error, onRetry, }) {
    const value = data ? `${data.attendanceRate}%` : "—";
    const denom = data
        ? `${data.attendanceNumerator}/${data.attendanceDenominator}`
        : "—";
    return (_jsx(KPI, { title: "\uC624\uB298 \uCD9C\uC11D\uB960", icon: _jsx(CheckIcon, {}), iconAccent: "green", value: value, footerLeft: denom, footerRight: _jsx(DeltaPill, { "$tone": "neutral", children: "\uC624\uB298" }), loading: loading, error: error, onRetry: onRetry }));
}
