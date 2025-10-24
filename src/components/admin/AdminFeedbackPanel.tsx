import styled from "styled-components";
import { routes } from "@/routes";
import { formatKoreanDateTime } from "@/lib/format";
import type { AdminFeedbackRow } from "@/api/adminFeedback";

type Props = {
  rows: AdminFeedbackRow[];
  total: number | null;
  newCount: number | null;
  error: string | null;
};

export function AdminFeedbackPanel({ rows, total, newCount, error }: Props) {
  return (
    <div>
      <FeedbackMeta>
        <span>총 {total != null ? total.toLocaleString("ko-KR") : "—"}건</span>
        <span>
          신규 {newCount != null ? newCount.toLocaleString("ko-KR") : "—"}건
        </span>
        <LinkButton href={routes.admin + "/feedbacks"}>전체 목록 이동</LinkButton>
      </FeedbackMeta>
      {error ? <InlineMiniError role="status">⚠️ {error}</InlineMiniError> : null}
      <TableWrap>
        <Table>
          <thead>
            <tr>
              <th style={{ minWidth: 160 }}>시간</th>
              <th>제목 · 내용</th>
              <th style={{ width: 90 }}>유형</th>
              <th style={{ width: 90 }}>상태</th>
              <th style={{ width: 160 }}>연락처</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={5}>
                  <TableStatus>표시할 문의가 없습니다.</TableStatus>
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id}>
                  <td>{formatKoreanDateTime(row.createdAt)}</td>
                  <td>
                    <FeedbackCell>
                      <span className="subject">{row.title}</span>
                      {row.body ? (
                        <span className="excerpt">
                          {row.body.length > 120
                            ? `${row.body.slice(0, 120)}…`
                            : row.body}
                        </span>
                      ) : null}
                      {row.pageUrl ? (
                        <span className="meta">페이지: {row.pageUrl}</span>
                      ) : null}
                    </FeedbackCell>
                  </td>
                  <td>{row.type === "FEATURE" ? "기능" : "오류"}</td>
                  <td>
                    <FeedbackStatus data-status={row.status}>
                      {row.status === "NEW"
                        ? "신규"
                        : row.status === "ACK"
                        ? "확인"
                        : "종료"}
                    </FeedbackStatus>
                  </td>
                  <td>{row.contact || "—"}</td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </TableWrap>
    </div>
  );
}

const FeedbackMeta = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 10px;
  font-size: 12px;
  color: #475569;
  span {
    font-weight: 700;
  }
`;

const LinkButton = styled.a`
  margin-left: auto;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: underline;
`;

const InlineMiniError = styled.div`
  margin-bottom: 8px;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid #fecaca;
  background: #fef2f2;
  color: #b91c1c;
  font-size: 12px;
  font-weight: 600;
`;

const TableWrap = styled.div`
  width: 100%;
  overflow: auto;
  border: 1px solid #f1f5f9;
  border-radius: 12px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  overflow: hidden;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: #fff;
  thead th {
    text-align: left;
    font-size: 12px;
    color: #6b7280;
    font-weight: 800;
    padding: 10px 12px;
    border-bottom: 1px solid #e5e7eb;
    background: #f9fafb;
  }
  tbody td {
    font-size: 13px;
    color: #0f172a;
    padding: 10px 12px;
    border-bottom: 1px solid #f1f5f9;
  }
  tbody tr:nth-child(odd) td {
    background: #fcfcfd;
  }
  tbody tr:hover td {
    background: #f9fafb;
  }
`;

const TableStatus = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 18px;
  font-size: 13px;
  font-weight: 600;
  color: #475569;
  background: rgba(241, 245, 249, 0.9);
  border: 1px dashed rgba(148, 163, 184, 0.5);
  border-radius: 12px;
`;

const FeedbackCell = styled.div`
  display: grid;
  gap: 4px;
  .subject {
    font-weight: 700;
    color: #111827;
  }
  .excerpt {
    color: #475569;
    font-size: 12px;
    line-height: 1.5;
    white-space: pre-line;
  }
  .meta {
    color: #94a3b8;
    font-size: 11px;
  }
`;

const FeedbackStatus = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 52px;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  background: #e2e8f0;
  color: #0f172a;
  &[data-status="NEW"] {
    background: #fef3c7;
    color: #b45309;
  }
  &[data-status="ACK"] {
    background: #e0e7ff;
    color: #4338ca;
  }
  &[data-status="CLOSED"] {
    background: #dcfce7;
    color: #15803d;
  }
`;
