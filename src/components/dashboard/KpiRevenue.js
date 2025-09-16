import { jsx as _jsx } from "react/jsx-runtime";
import { KPI, CreditIcon, DeltaPill } from "./KPI";
export default function KpiRevenue({ data, loading, error, onRetry }) {
    const value = data ? `₩${data.thisMonthRevenue.toLocaleString()}` : "—";
    const delta = data ? `+${data.revenueMoMPercent}%` : "—";
    return (_jsx(KPI, { title: "\uC774\uBC88 \uB2EC \uB9E4\uCD9C", icon: _jsx(CreditIcon, {}), iconAccent: "emerald", value: value, footerLeft: "\uC804\uC6D4 \uB300\uBE44", footerRight: _jsx(DeltaPill, { "$tone": "positive", children: delta }), loading: loading, error: error, onRetry: onRetry }));
}
