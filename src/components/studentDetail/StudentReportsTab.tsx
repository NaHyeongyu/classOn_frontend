import styled from "styled-components";
import { TableBase as UITable, GhostButtonSmall } from "@/components/common/UI";
import { downloadStudentReportBlob, deleteStudentReport } from "@/api/students";
import type { StudentReport } from "@/api/students";

type Props = {
  reports: StudentReport[];
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
  studentId: number | null;
};

export function StudentReportsTab({ reports, loading, error, onRefresh, studentId }: Props) {
  const handleDownload = async (reportId: number) => {
    if (!studentId) return;
    try {
      const blob = await downloadStudentReportBlob(studentId, reportId);
      const objectUrl = URL.createObjectURL(blob);
      window.open(objectUrl, "_blank", "noopener");
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 10_000);
    } catch {
      // ignore; simple UX fallback already tried
    }
  };

  const handleDelete = async (reportId: number) => {
    if (!studentId) return;
    const ok = window.confirm("이 보고서를 삭제할까요?");
    if (!ok) return;
    try {
      await deleteStudentReport(studentId, reportId);
      onRefresh();
    } catch {
      // ignore simple errors
    }
  };

  return (
    <div>
      <HeaderRow>
        <div>
          <Title>저장된 보고서</Title>
          <Subtitle>PDF로 저장한 보고서를 다시 열람/다운로드할 수 있습니다.</Subtitle>
        </div>
        <GhostButtonSmall as="button" type="button" onClick={onRefresh}>
          새로고침
        </GhostButtonSmall>
      </HeaderRow>
      {error && <ErrorBox>{error}</ErrorBox>}
      {loading ? (
        <Muted>불러오는 중...</Muted>
      ) : (
        <UITable style={{ minWidth: 720 }}>
          <thead>
            <tr>
              <th>생성일</th>
              <th>과목</th>
              <th>기간</th>
              <th>파일명</th>
              <th>용량</th>
              <th>다운로드</th>
              <th>삭제</th>
            </tr>
          </thead>
          <tbody>
            {reports.length === 0 ? (
              <tr>
                <td colSpan={6}>
                  <Muted>저장된 보고서가 없습니다.</Muted>
                </td>
              </tr>
              ) : (
                reports.map((r) => (
                  <tr key={r.id}>
                    <td>{formatDateTime(r.createdAt)}</td>
                    <td>{r.courseTitle || "미지정"}</td>
                    <td>{formatPeriod(r.periodFrom, r.periodTo)}</td>
                    <td>{r.filename}</td>
                    <td>{formatSize(r.size)}</td>
                    <td>
                      <DownloadButton type="button" onClick={() => handleDownload(r.id)} disabled={!studentId}>
                        열기
                      </DownloadButton>
                    </td>
                    <td>
                      <DeleteButton type="button" onClick={() => handleDelete(r.id)} disabled={!studentId}>
                        삭제
                      </DeleteButton>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </UITable>
      )}
    </div>
  );
}

function formatDateTime(iso?: string | null) {
  if (!iso) return "-";
  try {
    const date = new Date(iso);
    return date.toLocaleString("ko-KR", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });
  } catch {
    return iso;
  }
}

function formatPeriod(from?: string | null, to?: string | null) {
  if (!from && !to) return "-";
  if (from && to) return `${from} ~ ${to}`;
  return from || to || "-";
}

function formatSize(bytes: number) {
  if (!bytes || bytes < 1024) return `${bytes || 0}B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)}KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(1)}MB`;
}

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 12px;
  flex-wrap: wrap;
`;

const Title = styled.h4`
  margin: 0;
  font-size: 16px;
  font-weight: 700;
`;

const Subtitle = styled.p`
  margin: 4px 0 0;
  font-size: 13px;
  color: #6b7280;
`;

const Muted = styled.span`
  color: #6b7280;
  font-size: 13px;
`;

const ErrorBox = styled.div`
  color: #b91c1c;
  font-size: 12px;
  font-weight: 700;
  margin-bottom: 8px;
`;

const DownloadButton = styled.button`
  border: 1px solid #e5e7eb;
  background: #ffffff;
  color: #2563eb;
  padding: 6px 10px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 12px;
  &:hover {
    background: #eff6ff;
    border-color: #bfdbfe;
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const DeleteButton = styled.button`
  border: 1px solid #fee2e2;
  background: #fff;
  color: #dc2626;
  padding: 6px 10px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 12px;
  &:hover {
    background: #fef2f2;
    border-color: #fecdd3;
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
