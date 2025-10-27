
import styled from "styled-components";
import { Page, PageHeader, SectionCard, GhostButtonSmall, Scroller, TableBase as Table } from "@/components/common/UI";
import { formatKoreanDateTime } from "@/lib/format";
import type { SavedMarketing } from "@/lib/savedMarketing";
import type { SavedPost } from "@/api/marketingSaved";

export type MarketingSavedListViewProps = {
  rows: SavedMarketing[];
  page: number;
  totalPages: number;
  platform: SavedPost["platform"] | "";
  from: string;
  to: string;
  query: string;
  error: string | null;
  confirmDialog: React.ReactNode;
  onPlatformChange: (value: SavedPost["platform"] | "") => void;
  onFromChange: (value: string) => void;
  onToChange: (value: string) => void;
  onQueryChange: (value: string) => void;
  onSearch: () => void;
  onReset: () => void;
  onClearAll: () => void;
  onOpenDetail: (id: string) => void;
  onPrevPage: () => void;
  onNextPage: () => void;
};

export function MarketingSavedListPageView({
  rows,
  page,
  totalPages,
  platform,
  from,
  to,
  query,
  error,
  confirmDialog,
  onPlatformChange,
  onFromChange,
  onToChange,
  onQueryChange,
  onSearch,
  onReset,
  onClearAll,
  onOpenDetail,
  onPrevPage,
  onNextPage,
}: MarketingSavedListViewProps) {
  const hasRows = rows.length > 0;

  return (
    <Page>
      {confirmDialog}
      <PageHeader>
        <div>
          <h2>저장 내역</h2>
          <p>Summary에서 저장한 캡션 목록입니다.</p>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <GhostButtonSmall as="a" href="/marketing">
            마케팅 홈
          </GhostButtonSmall>
          {hasRows ? (
            <GhostButtonSmall as="button" data-variant="danger" onClick={onClearAll}>
              전체 삭제
            </GhostButtonSmall>
          ) : null}
        </div>
      </PageHeader>

      <SectionCard>
        <FilterRow>
          <select
            value={platform}
            onChange={(event) => onPlatformChange(event.target.value as SavedPost["platform"] | "")}
          >
            <option value="">전체 플랫폼</option>
            <option value="INSTAGRAM">인스타그램</option>
            <option value="NAVER_BLOG">블로그</option>
            <option value="KAKAO_CHANNEL">카카오 채널</option>
          </select>
          <input
            type="date"
            lang="ko-KR"
            value={from}
            onFocus={(event) => openNativeDatePicker(event.currentTarget)}
            onChange={(event) => onFromChange(event.target.value)}
            onBlur={(event) => onFromChange(event.currentTarget.value)}
          />
          <span>~</span>
          <input
            type="date"
            lang="ko-KR"
            value={to}
            onFocus={(event) => openNativeDatePicker(event.currentTarget)}
            onChange={(event) => onToChange(event.target.value)}
            onBlur={(event) => onToChange(event.currentTarget.value)}
          />
          <SearchBox>
            <input
              placeholder="본문 검색"
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") onSearch();
              }}
            />
            <GhostButtonSmall as="button" onClick={onSearch}>
              검색
            </GhostButtonSmall>
          </SearchBox>
          <GhostButtonSmall as="button" onClick={onReset}>
            초기화
          </GhostButtonSmall>
        </FilterRow>

        {error ? <ErrorText role="alert">{error}</ErrorText> : null}

        {!hasRows ? (
          <>
            <Empty>아직 저장된 항목이 없습니다.</Empty>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-start", marginTop: 8 }}>
              <GhostButtonSmall as="a" href="/marketing">
                마케팅 홈으로
              </GhostButtonSmall>
            </div>
          </>
        ) : (
          <>
            <Scroller>
              <Table style={{ minWidth: 720 }}>
                <thead>
                  <tr>
                    <th>저장일</th>
                    <th>플랫폼</th>
                    <th>본문 요약</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr
                      key={row.id}
                      className="row"
                      onClick={() => onOpenDetail(row.id)}
                      title="상세 보기"
                      style={{ cursor: "pointer" }}
                    >
                      <td>{formatCreatedAt(row.createdAt)}</td>
                      <td>{platformLabel(row.platform)}</td>
                      <td className="mono">{row.body.slice(0, 140)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Scroller>
            <Pager>
              <PageBtn onClick={onPrevPage} disabled={page <= 0}>
                이전
              </PageBtn>
              <span>
                {page + 1} / {Math.max(1, totalPages)}
              </span>
              <PageBtn onClick={onNextPage} disabled={page >= totalPages - 1}>
                다음
              </PageBtn>
            </Pager>
          </>
        )}
      </SectionCard>
    </Page>
  );
}

function openNativeDatePicker(input: HTMLInputElement) {
  try {
    (input as HTMLInputElement & { showPicker?: () => void }).showPicker?.();
  } catch {
    /* ignore unsupported browsers */
  }
}

function formatCreatedAt(value: number): string {
  const formatted = formatKoreanDateTime(value, { includeWeekday: true });
  if (formatted === "—") {
    try {
      return new Date(value).toLocaleString("ko-KR", { hour12: false });
    } catch {
      return "-";
    }
  }
  return formatted;
}

function platformLabel(platform: SavedMarketing["platform"]): string {
  switch (platform) {
    case "INSTAGRAM":
      return "인스타그램";
    case "NAVER_BLOG":
      return "블로그";
    default:
      return "카카오 채널";
  }
}

const ErrorText = styled.p`
  color: #b91c1c;
  font-size: 13px;
  margin: 0 0 10px;
`;

const Empty = styled.div`
  color: ${({ theme }) => theme.colors.textMuted };
  font-size: 13px;
`;

const FilterRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 10px;
  select,
  input[type="date"] {
    height: 36px;
    border: 1px solid ${({ theme }) => theme.colors.border };
    border-radius: 10px;
    background: #fff;
    padding: 0 10px;
    font-size: 13px;
  }
`;

const SearchBox = styled.div`
  display: flex;
  gap: 6px;
  align-items: center;
  input {
    height: 36px;
    border: 1px solid ${({ theme }) => theme.colors.border };
    border-radius: 10px;
    background: #fff;
    padding: 0 10px;
    font-size: 13px;
  }
`;

const Pager = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: flex-end;
  margin-top: 10px;
`;

const PageBtn = styled(GhostButtonSmall)`
  height: 40px;
  padding: 0 16px;
  font-size: 14px;
`;
