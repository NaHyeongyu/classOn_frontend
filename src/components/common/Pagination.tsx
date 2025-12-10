import styled from "styled-components";
import { visiblePages } from "@/lib/pagination";

interface PaginationProps {
  page: number;
  totalPages: number;
  onChangePage: (page: number) => void;
  size?: number;
  onSizeChange?: (size: number) => void;
  className?: string;
}

export default function Pagination({
  page,
  totalPages,
  onChangePage,
  size,
  onSizeChange,
  className,
}: PaginationProps) {
  const isLastPage = totalPages === 0 || page >= totalPages - 1;

  return (
    <Pager className={className}>
      <PageBtn
        type="button"
        onClick={() => onChangePage(Math.max(0, page - 1))}
        disabled={page <= 0}
      >
        이전
      </PageBtn>
      {visiblePages(page, totalPages, 7).map((p) => (
        <PageBtn
          key={p}
          type="button"
          data-active={p === page}
          onClick={() => onChangePage(p)}
        >
          {p + 1}
        </PageBtn>
      ))}
      <PageBtn
        type="button"
        onClick={() => onChangePage(Math.min(totalPages - 1, page + 1))}
        disabled={isLastPage}
      >
        다음
      </PageBtn>
      {size && onSizeChange && (
        <PageSize>
          <span>페이지당</span>
          <select
            value={size}
            onChange={(e) => {
              onSizeChange(Number(e.target.value));
            }}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </PageSize>
      )}
    </Pager>
  );
}

const Pager = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
  margin-top: 12px;
  margin-bottom: 12px;
  width: 100%;
`;

const PageBtn = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  height: 32px;
  padding: 0 6px;
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.radii.sm};
  background: ${(p) => p.theme.colors.surface};
  color: #111827;
  font-size: 13px;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &[data-active="true"] {
    background: #111827;
    color: white;
    border-color: #111827;
    font-weight: 600;
  }

  &:hover:not(:disabled):not([data-active="true"]) {
    background: ${(p) => p.theme.colors.surfaceAlt};
  }
`;

const PageSize = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-left: 12px;
  color: ${(p) => p.theme.colors.textMuted};
  font-size: 12px;
  select {
    height: 28px;
    border: 1px solid ${(p) => p.theme.colors.border};
    border-radius: 8px;
    background: ${(p) => p.theme.colors.surface};
    padding: 0 8px;
    cursor: pointer;
  }
`;
