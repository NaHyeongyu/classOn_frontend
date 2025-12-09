import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { listMaterials, type MaterialItem } from "@/api/materials";
import { PageTitle, SectionCard } from "@/components/common/UI";
import { LoadingSpinner } from "@/components/common/Loading";
import { useAuth } from "@/hooks/useAuth";

function formatBytes(size: number) {
  if (!Number.isFinite(size)) return "-";
  if (size < 1024) return `${size} B`;
  const kb = size / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(1)} MB`;
}

function formatDate(value?: string | null) {
  if (!value) return "-";
  try {
    const d = new Date(value);
    return new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(d);
  } catch {
    return value;
  }
}

export default function Materials() {
  const { user } = useAuth();
  const [items, setItems] = useState<MaterialItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const list = await listMaterials({ presign: true });
        if (!cancelled) setItems(list);
      } catch (err) {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : "자료를 불러오지 못했습니다.";
          setError(message);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => { cancelled = true; };
  }, []);

  const rows = useMemo(() => items, [items]);

  return (
    <Wrap>
      <Header>
        <PageTitle>자료실</PageTitle>
        <Sub>수업 내역에 업로드된 모든 파일을 한눈에 모아봅니다.</Sub>
        {user?.name ? <Muted>업로드: 강사 전용 · 다운로드: 링크 클릭</Muted> : null}
      </Header>

      <SectionCard style={{ padding: 0 }}>
        {loading ? (
          <LoadingState>
            <LoadingSpinner />
            <span>불러오는 중...</span>
          </LoadingState>
        ) : error ? (
          <ErrorState>{error}</ErrorState>
        ) : rows.length === 0 ? (
          <EmptyState>아직 업로드된 자료가 없습니다.</EmptyState>
        ) : (
          <Table role="table">
            <thead>
              <tr>
                <th scope="col">수업명</th>
                <th scope="col">자료명</th>
                <th scope="col">크기</th>
                <th scope="col">업로드</th>
                <th scope="col">다운로드</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td title={row.courseTitle || undefined}>{row.courseTitle || "-"}</td>
                  <td>
                    <strong>{row.filename}</strong>
                    {row.recordDate ? <SmallMuted>{row.recordDate}</SmallMuted> : null}
                  </td>
                  <td>{formatBytes(row.size)}</td>
                  <td>{formatDate(row.createdAt)}</td>
                  <td>
                    {row.downloadUrl ? (
                      <a href={row.downloadUrl} download target="_blank" rel="noreferrer">다운로드</a>
                    ) : (
                      <span style={{ color: "#9ca3af" }}>링크 없음</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </SectionCard>
    </Wrap>
  );
}

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Sub = styled.div`
  color: #4b5563;
  font-size: 14px;
`;

const Muted = styled.div`
  color: #9ca3af;
  font-size: 12px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  thead th {
    text-align: left;
    font-size: 13px;
    color: #374151;
    background: #f8fafc;
    padding: 12px;
    border-bottom: 1px solid #e5e7eb;
  }
  tbody td {
    padding: 10px 12px;
    border-bottom: 1px solid #f1f5f9;
    color: #0f172a;
    font-size: 13px;
    vertical-align: middle;
  }
  tbody tr:hover td {
    background: #f8fafc;
  }
`;

const LoadingState = styled.div`
  padding: 32px;
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: center;
  color: #4b5563;
`;

const ErrorState = styled.div`
  padding: 32px;
  color: #b91c1c;
  text-align: center;
`;

const EmptyState = styled.div`
  padding: 32px;
  color: #64748b;
  text-align: center;
`;

const SmallMuted = styled.div`
  color: #9ca3af;
  font-size: 12px;
  margin-top: 2px;
`;
