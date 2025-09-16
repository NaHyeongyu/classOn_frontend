import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import styled from "styled-components";
import { SectionCard as TableCard, Scroller, TableBase as Table, GhostBtn as UIGhostBtn, PrimaryBtn as UIPrimaryBtn } from "../common/UI";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listStudents } from "../../api/students";
import { formatPhone } from "../../lib/format";
import { visiblePages } from "../../lib/pagination";
function statusKr(s) {
    return s === "ENROLLED" ? "수강중" : s === "ON_LEAVE" ? "휴학" : "대기중";
}
export default function StudentsTable({ filters, refreshKey }) {
    const navigate = useNavigate();
    const [rows, setRows] = useState([]);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        let cancelled = false;
        async function load() {
            setError(null);
            setLoading(true);
            try {
                const res = await listStudents({
                    page,
                    size,
                    status: filters.status || undefined,
                    q: filters.q || undefined,
                    from: filters.from || undefined,
                    to: filters.to || undefined,
                    ageMin: filters.ageMin ? Number(filters.ageMin) : undefined,
                    ageMax: filters.ageMax ? Number(filters.ageMax) : undefined,
                });
                if (!cancelled) {
                    setRows(res.content);
                    setTotalPages(res.totalPages);
                    setTotalElements(res.totalElements);
                }
            }
            catch (e) {
                if (!cancelled)
                    setError(e?.message || "원생 불러오기에 실패했습니다.");
            }
            finally {
                if (!cancelled)
                    setLoading(false);
            }
        }
        void load();
        return () => { cancelled = true; };
    }, [page, size, filters.status, filters.q, filters.from, filters.to, filters.ageMin, filters.ageMax, refreshKey]);
    // Reset to first page when filters change
    useEffect(() => { setPage(0); }, [filters.status, filters.q, filters.from, filters.to, filters.ageMin, filters.ageMax]);
    const view = useMemo(() => rows.map((r, idx) => {
        let ageText;
        if (r.birthDate) {
            const y = Number(r.birthDate.split('-')[0]);
            const now = new Date();
            const korean = now.getFullYear() - y + 1;
            ageText = String(korean);
        }
        else {
            ageText = r.age != null ? String(r.age) : '-';
        }
        return ({
            seq: page * size + idx + 1,
            id: r.id,
            name: r.name,
            age: ageText,
            phone: formatPhone(r.phoneNumber),
            course: r.courses?.map(c => c.title).join(", ") || "-",
            guardian: formatPhone(r.guardianPhone),
            status: statusKr(r.status),
            joinedAt: r.joinedDate || (r.createdAt?.slice(0, 10)) || "-",
        });
    }), [rows, page, size]);
    function changePage(p) {
        if (p < 0 || p >= totalPages)
            return;
        setPage(p);
    }
    return (_jsxs(TableCard, { children: [_jsxs(TableHead, { children: [_jsxs("div", { children: [_jsx("strong", { children: "\uC6D0\uC0DD \uBAA9\uB85D" }), _jsx(Muted, { children: loading ? "불러오는 중..." : `총 ${totalElements}명의 원생이 조회되었습니다.` }), error && _jsx(ErrText, { children: error })] }), _jsxs(HeadActions, { children: [_jsx(UIGhostBtn, { as: "button", children: "\uC5D1\uC140\uB85C \uB2E4\uC6B4\uBC1B\uAE30" }), _jsx(UIPrimaryBtn, { as: "button", onClick: () => navigate('/students/new'), children: "\uC6D0\uC0DD \uCD94\uAC00\uD558\uAE30" })] })] }), _jsx(Scroller, { children: _jsxs(Table, { style: { minWidth: 960 }, children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "\uBC88\uD638" }), _jsx("th", { children: "\uC774\uB984" }), _jsx("th", { children: "\uB098\uC774" }), _jsx("th", { children: "\uC5F0\uB77D\uCC98" }), _jsx("th", { children: "\uC218\uAC15\uC218\uC5C5" }), _jsx("th", { children: "\uBCF4\uD638\uC790 \uC5F0\uB77D\uCC98" }), _jsx("th", { children: "\uC0C1\uD0DC" }), _jsx("th", { children: "\uB4F1\uB85D\uC77C" })] }) }), _jsx("tbody", { children: view.map((r) => (_jsxs("tr", { children: [_jsx("td", { children: r.seq }), _jsx("td", { children: _jsx(NameLink, { type: "button", onClick: () => navigate(`/students/${r.id}/courses`), title: "\uC0C1\uC138 \uBCF4\uAE30", children: r.name }) }), _jsx("td", { children: r.age }), _jsx("td", { children: r.phone || '-' }), _jsx("td", { children: r.course || '-' }), _jsx("td", { children: r.guardian || '-' }), _jsx("td", { children: _jsx(Chip, { type: r.status, children: r.status }) }), _jsx("td", { children: r.joinedAt })] }, r.id))) })] }) }), _jsxs(Pager, { children: [_jsx(PageBtn, { onClick: () => changePage(page - 1), disabled: page === 0, children: "\uC774\uC804" }), visiblePages(page, totalPages, 7).map(p => (_jsx(PageBtn, { "data-active": p === page, onClick: () => changePage(p), children: p + 1 }, p))), _jsx(PageBtn, { onClick: () => changePage(page + 1), disabled: page >= totalPages - 1, children: "\uB2E4\uC74C" }), _jsxs(PageSize, { children: [_jsx("span", { children: "\uD398\uC774\uC9C0\uB2F9" }), _jsxs("select", { value: size, onChange: (e) => { setPage(0); setSize(Number(e.target.value)); }, children: [_jsx("option", { value: 10, children: "10" }), _jsx("option", { value: 20, children: "20" }), _jsx("option", { value: 50, children: "50" })] })] })] })] }));
}
// Card provided by common UI
const TableHead = styled.div `
  display: flex; align-items: center; justify-content: space-between;
`;
const Muted = styled.div `
  color: #6b7280; font-size: 12px; margin-top: 4px;
`;
const HeadActions = styled.div `
  display: inline-flex; gap: 8px;
`;
// Buttons from common UI
// Scroller/Table from common UI
const NameLink = styled.button `
  all: unset; cursor: pointer; color: #1f2937; font-weight: 800;
  &:hover { text-decoration: underline; }
`;
const Chip = styled.span `
  padding: 2px 8px; border-radius: 9999px; font-size: 12px; font-weight: 800;
  ${({ type }) => type === '수강중' ? 'background:#dcfce7; color:#16a34a;' : type === '휴학' ? 'background:#fef3c7; color:#b45309;' : 'background:#f3e8ff; color:#7c3aed;'}
`;
const ErrText = styled.div `
  color: #b91c1c; font-size: 12px; margin-top: 4px;
`;
const Pager = styled.div `
  display: flex; gap: 6px; justify-content: center; padding-top: 4px;
`;
const PageBtn = styled.button `
  min-width: 28px; height: 28px; padding: 0 8px; border-radius: 8px; border: 1px solid #e5e7eb; background: #fff; font-size: 12px; color: #111827;
  &[data-active='true'] { background: #111827; color: #fff; border-color: #111827; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;
const PageSize = styled.div `
  display: inline-flex; align-items: center; gap: 6px; margin-left: 12px; color: #6b7280; font-size: 12px;
  select { height: 28px; border: 1px solid #e5e7eb; border-radius: 8px; background: #fff; padding: 0 8px; }
`;
