import styled from "styled-components";
import type { AdminLoginLog } from "@/features/admin/useAdminDashboard";

type Props = {
  logs: AdminLoginLog[];
};

export function AdminLoginTable({ logs }: Props) {
  return (
    <TableWrap>
      <Table>
        <thead>
          <tr>
            <th>시간</th>
            <th>아이디</th>
            <th>IP</th>
            <th>성공</th>
          </tr>
        </thead>
        <tbody>
          {logs.length === 0 ? (
            <tr>
              <td colSpan={4}>
                <TableStatus>표시할 데이터가 없습니다.</TableStatus>
              </td>
            </tr>
          ) : (
            logs.map((log, index) => (
              <tr key={log.id || index}>
                <td>
                  {new Date(log.createdAt).toLocaleString("ko-KR", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </td>
                <td>{log.username}</td>
                <td>{log.ip || "-"}</td>
                <td>{log.success ? "Y" : "N"}</td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </TableWrap>
  );
}

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
