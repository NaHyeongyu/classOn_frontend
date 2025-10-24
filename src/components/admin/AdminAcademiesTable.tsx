import { useCallback, useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import styled from "styled-components";
import { listAdminAcademies, type AdminAcademyRow } from "@/api/adminAcademies";
import { useToast } from "@/components/common/Toast";
import { LoadingSpinner } from "@/components/common/Loading";
import {
  Input,
  MonoGhost,
  MonoPrimary,
  Select,
  Table as AdminTable,
  TableWrap as AdminTableWrap,
  Toolbar,
  ToolbarGroup,
  ToolbarInfo,
} from "@/components/admin/AdminStyles";
import { formatKoreanDate, formatKoreanDateTime } from "@/lib/format";
import { routes } from "@/routes";

type AdminAcademiesTableProps = {
  from: string;
  to: string;
};

export function AdminAcademiesTable({ from, to }: AdminAcademiesTableProps) {
  const [rows, setRows] = useState<AdminAcademyRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [exporting, setExporting] = useState(false);
  const { success: toastSuccess, error: toastError, warning: toastWarning } = useToast();
  const sizeRef = useRef(size);
  const qRef = useRef(q);

  const load = useCallback(
    async (p: number, s: number, keyword: string) => {
      setLoading(true);
      setError(null);
      try {
        const res = await listAdminAcademies({ page: p, size: s, q: keyword || undefined, from, to });
        setRows(res.content || []);
        setPage(res.page);
        setSize(res.size);
        setTotalPages(res.totalPages);
        setTotalElements(res.totalElements ?? 0);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "불러오지 못했습니다.";
        setError(message);
        toastError(message);
      } finally {
        setLoading(false);
      }
    },
    [from, to, toastError]
  );

  useEffect(() => {
    sizeRef.current = size;
  }, [size]);

  useEffect(() => {
    qRef.current = q;
  }, [q]);

  useEffect(() => {
    void load(0, sizeRef.current, qRef.current);
  }, [from, to, load]);

  const pageStart = page * size + (rows.length > 0 ? 1 : 0);
  const pageEnd = page * size + rows.length;
  const totalPagesSafe = Math.max(1, totalPages);

  const summary = useMemo(() => {
    if (!rows.length) return null;
    return rows.reduce(
      (acc, row) => ({
        students: acc.students + (row.students ?? 0),
        courses: acc.courses + (row.courses ?? 0),
        apiCalls: acc.apiCalls + (row.apiCalls ?? 0),
        logins: acc.logins + (row.logins ?? 0),
        paymentCount: acc.paymentCount + (row.paymentCount ?? 0),
        paymentAmountCents: acc.paymentAmountCents + (row.paymentAmountCents ?? 0),
      }),
      { students: 0, courses: 0, apiCalls: 0, logins: 0, paymentCount: 0, paymentAmountCents: 0 }
    );
  }, [rows]);

  const topPaymentAcademy = useMemo(() => {
    if (!rows.length) return null;
    return rows.reduce<{ row: AdminAcademyRow | null; amount: number }>(
      (acc, row) => {
        const amount = row.paymentAmountCents || 0;
        if (amount > acc.amount) return { row, amount };
        return acc;
      },
      { row: null, amount: 0 }
    ).row;
  }, [rows]);

  const topActiveAcademy = useMemo(() => {
    if (!rows.length) return null;
    return rows.reduce<{ row: AdminAcademyRow | null; score: number }>(
      (acc, row) => {
        const score = (row.apiCalls || 0) + (row.logins || 0);
        if (score > acc.score) return { row, score };
        return acc;
      },
      { row: null, score: -Infinity }
    ).row;
  }, [rows]);

  const handleSearch = useCallback(() => {
    const keyword = q.trim();
    if (keyword !== q) setQ(keyword);
    void load(0, size, keyword);
  }, [load, size, q]);

  const handleReset = useCallback(() => {
    setQ("");
    qRef.current = "";
    void load(0, size, "");
  }, [load, size]);

  const handleSizeChange = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      const next = Number(event.target.value);
      setSize(next);
      sizeRef.current = next;
      void load(0, next, q);
    },
    [load, q]
  );

  const handleExportCsv = useCallback(() => {
    if (rows.length === 0) {
      toastWarning("표시된 데이터가 없어 내보낼 수 없습니다.");
      return;
    }
    try {
      setExporting(true);
      const header = ["학원명", "사업자번호", "학생수", "수업수", "오늘 수업", "API 호출", "로그인", "결제건수", "결제금액(원)", "최근활동"];
      const lines = rows.map((r) => {
        const lastActivity =
          [r.loginLastAt, r.apiLastAt, r.paymentLastAt]
            .filter(Boolean)
            .map((iso) => new Date(iso as string).toLocaleString("ko-KR", { dateStyle: "short", timeStyle: "short" }))
            .sort()
            .pop() || "";
        return [
          r.name,
          r.bizNo || "",
          String(r.students ?? 0),
          String(r.courses ?? 0),
          String(r.classesToday ?? 0),
          String(r.apiCalls ?? 0),
          String(r.logins ?? 0),
          String(r.paymentCount ?? 0),
          String(Math.round((r.paymentAmountCents || 0) / 100)),
          lastActivity,
        ]
          .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
          .join(",");
      });
      const csv = [header.join(","), ...lines].join("\n");
      const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `classon-academies-${from}-${to}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toastSuccess("현재 목록을 CSV로 내보냈습니다.");
    } catch (err: unknown) {
      if (import.meta.env?.DEV) {
        console.warn("CSV export failed", err);
      }
      toastError("CSV 내보내기에 실패했습니다.");
    } finally {
      setExporting(false);
    }
  }, [rows, toastWarning, toastSuccess, toastError, from, to]);

  const pageSizeOptions = [20, 50, 100];
  const rangeLabel =
    totalElements > 0
      ? `${(rows.length ? pageStart : 0).toLocaleString("ko-KR")} – ${(rows.length ? pageEnd : 0).toLocaleString("ko-KR")} / ${totalElements.toLocaleString("ko-KR")}`
      : "0 / 0";
  const currentPageDisplay = totalPagesSafe > 0 ? Math.min(page + 1, totalPagesSafe) : 1;
  const pageInfo = `페이지 ${currentPageDisplay.toLocaleString("ko-KR")} / ${totalPagesSafe.toLocaleString("ko-KR")} • ${rangeLabel}`;

  return (
    <SectionStack>
      <Toolbar>
        <ToolbarGroup>
          <Input
            placeholder="학원명/사업자번호 검색"
            value={q}
            onChange={(event) => setQ(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                handleSearch();
              }
            }}
          />
          <MonoGhost as="button" type="button" onClick={handleSearch} disabled={loading}>
            검색
          </MonoGhost>
          <MonoGhost as="button" type="button" onClick={handleReset} disabled={!q}>
            초기화
          </MonoGhost>
        </ToolbarGroup>
        <ToolbarGroup>
          <ToolbarInfo>{pageInfo}</ToolbarInfo>
          <Select value={size} onChange={handleSizeChange}>
            {pageSizeOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}개씩
              </option>
            ))}
          </Select>
          <MonoGhost as="button" type="button" onClick={() => load(Math.max(0, page - 1), size, q)} disabled={page <= 0 || loading}>
            이전
          </MonoGhost>
          <MonoGhost
            as="button"
            type="button"
            onClick={() => load(Math.min(totalPagesSafe - 1, page + 1), size, q)}
            disabled={page >= totalPagesSafe - 1 || loading}
          >
            다음
          </MonoGhost>
          <MonoPrimary as="button" type="button" onClick={handleExportCsv} disabled={exporting || rows.length === 0}>
            {exporting ? "CSV 생성 중…" : "CSV 내보내기"}
          </MonoPrimary>
        </ToolbarGroup>
      </Toolbar>

      <InsightStrip>
        <InsightCard>
          <InsightLabel>현재 페이지 학원</InsightLabel>
          <InsightValue>{rows.length.toLocaleString("ko-KR")}개</InsightValue>
          <InsightHint>
            전체 {totalElements.toLocaleString("ko-KR")}개 • {from} ~ {to}
          </InsightHint>
        </InsightCard>
        {summary ? (
          <InsightCard>
            <InsightLabel>범위 결제 합계</InsightLabel>
            <InsightValue>₩{Math.round(summary.paymentAmountCents / 100).toLocaleString("ko-KR")}</InsightValue>
            <InsightHint>
              {summary.paymentCount.toLocaleString("ko-KR")}건 • 학생 {summary.students.toLocaleString("ko-KR")}명
            </InsightHint>
          </InsightCard>
        ) : (
          <InsightCard>
            <InsightLabel>범위 결제 합계</InsightLabel>
            <InsightValue>—</InsightValue>
            <InsightHint>데이터 없음</InsightHint>
          </InsightCard>
        )}
        {topPaymentAcademy && (topPaymentAcademy.paymentAmountCents || 0) > 0 && (
          <InsightCard>
            <InsightLabel>최고 결제 학원</InsightLabel>
            <InsightValue>{topPaymentAcademy.name}</InsightValue>
            <InsightHint>
              ₩{Math.round((topPaymentAcademy.paymentAmountCents || 0) / 100).toLocaleString("ko-KR")} •{" "}
              {(topPaymentAcademy.paymentCount ?? 0).toLocaleString("ko-KR")}건
            </InsightHint>
          </InsightCard>
        )}
        {topActiveAcademy && (
          <InsightCard>
            <InsightLabel>활동량 상위</InsightLabel>
            <InsightValue>{topActiveAcademy.name}</InsightValue>
            <InsightHint>
              API {(topActiveAcademy.apiCalls ?? 0).toLocaleString("ko-KR")} • 로그인 {(topActiveAcademy.logins ?? 0).toLocaleString("ko-KR")}
            </InsightHint>
          </InsightCard>
        )}
      </InsightStrip>

      <TableContainer>
        <Table>
          <thead>
            <tr>
              <th>학원</th>
              <th>학생수</th>
              <th>수업수</th>
              <th>오늘 수업</th>
              <th>API(기간)</th>
              <th>로그인(기간)</th>
              <th>결제건수(기간)</th>
              <th>결제합계(기간/원)</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={8}>
                  <TableStatus>
                    <SpinnerInline aria-hidden />
                    <span>데이터를 불러오는 중…</span>
                  </TableStatus>
                </td>
              </tr>
            )}
            {!loading && error && (
              <tr>
                <td colSpan={8}>
                  <TableStatus $variant="error">⚠️ {error}</TableStatus>
                </td>
              </tr>
            )}
            {!loading &&
              !error &&
              rows.map((r, index) => (
                <tr key={r.id || index}>
                  <td>
                    <div style={{ display: "grid" }}>
                      <a href={routes.admin + "/academies/" + (r.id || "")} style={{ color: "#111827", textDecoration: "underline", fontWeight: 800 }}>
                        {r.name}
                      </a>
                      <div style={{ color: "#64748b", fontSize: 12 }}>
                        {r.bizNo || "-"}
                        {r.createdAt
                          ? (() => {
                              const label = formatKoreanDate(r.createdAt, { includeWeekday: true });
                              return ` • 가입일 ${label === "—" ? r.createdAt : label}`;
                            })()
                          : ""}
                        {(() => {
                          const timestamps = [r.loginLastAt, r.apiLastAt, r.paymentLastAt]
                            .filter(Boolean)
                            .map((value) => new Date(value as string).getTime())
                            .filter((value) => Number.isFinite(value));
                          if (timestamps.length === 0) return "";
                          const last = new Date(Math.max(...timestamps));
                          const label = formatKoreanDateTime(last, { includeWeekday: true });
                          return ` • 최근활동 ${label === "—" ? last.toLocaleString("ko-KR", { hour12: false }) : label}`;
                        })()}
                      </div>
                    </div>
                  </td>
                  <td>{r.students}</td>
                  <td>{r.courses}</td>
                  <td>{r.classesToday}</td>
                  <td>{r.apiCalls}</td>
                  <td>{r.logins}</td>
                  <td>{r.paymentCount}</td>
                  <td>{Math.round((r.paymentAmountCents || 0) / 100).toLocaleString("ko-KR")}</td>
                </tr>
              ))}
            {!loading && !error && rows.length === 0 && (
              <tr>
                <td colSpan={8}>
                  <TableStatus>표시할 데이터가 없습니다.</TableStatus>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </TableContainer>
    </SectionStack>
  );
}

const SectionStack = styled.div`
  display: grid;
  gap: 12px;
`;

const InsightStrip = styled.div`
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
`;

const InsightCard = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 12px 14px;
  background: linear-gradient(180deg, #f8fafc 0%, #ffffff 85%);
  display: grid;
  gap: 4px;
`;

const InsightLabel = styled.span`
  font-size: 12px;
  color: #64748b;
  font-weight: 700;
  letter-spacing: 0.02em;
`;

const InsightValue = styled.span`
  font-size: 16px;
  font-weight: 800;
  color: #0f172a;
`;

const InsightHint = styled.span`
  font-size: 12px;
  color: #94a3b8;
`;

const TableContainer = styled(AdminTableWrap)`
  table {
    min-width: 520px;
  }
`;

const Table = styled(AdminTable)`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  overflow: hidden;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: #fff;
`;

const TableStatus = styled.div<{ $variant?: "error" }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 18px;
  font-size: 13px;
  font-weight: 600;
  color: ${({ $variant }) => ($variant === "error" ? "#b91c1c" : "#475569")};
  background: ${({ $variant }) => ($variant === "error" ? "rgba(254, 242, 242, 0.9)" : "rgba(241, 245, 249, 0.9)")};
  border: 1px dashed ${({ $variant }) => ($variant === "error" ? "rgba(248, 113, 113, 0.6)" : "rgba(148, 163, 184, 0.5)")};
  border-radius: 12px;
`;

const SpinnerInline = styled(LoadingSpinner)`
  width: 16px;
  height: 16px;
  flex-shrink: 0;
`;
