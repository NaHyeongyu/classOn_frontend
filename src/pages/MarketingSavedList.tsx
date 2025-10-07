import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Page, PageHeader, SectionCard, GhostButtonSmall, Scroller, TableBase as Table } from "@/components/common/UI";
import { getSavedMarketingPosts, type SavedMarketing, clearSavedMarketingPosts } from "@/lib/savedMarketing";
import { listSaved, type SavedPost } from "@/api/marketingSaved";
import { useToast } from "@/components/common/Toast";
import { normalizeYMDInput, toErrorMessage } from "@/features/marketing/utils";
import { formatKoreanDateTime } from "@/lib/format";
import { useConfirmDialog } from "@/hooks/useConfirmDialog";

export default function MarketingSavedList() {
  const [rows, setRows] = useState<SavedMarketing[]>([]);
  const [page, setPage] = useState(0);
  const size = 20;
  const [totalPages, setTotalPages] = useState(0);
  const [platform, setPlatform] = useState<SavedPost["platform"] | "">("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { warning } = useToast();
  const navigate = useNavigate();
  const { confirm: confirmClear, dialog: confirmClearDialog } = useConfirmDialog({
    confirmLabel: "삭제",
    cancelLabel: "취소",
    tone: "danger",
  });

  const localFallback = useMemo(() => getSavedMarketingPosts(), []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setError(null);
        const res = await listSaved({
          page,
          size,
          platform: platform || undefined,
          from: from || undefined,
          to: to || undefined,
          q: query || undefined,
        });
        if (cancelled) return;
        const content = res.content ?? [];
        setRows(content.map(toLocalSaved));
        setTotalPages(res.totalPages ?? 1);
      } catch (err) {
        if (cancelled) return;
        setRows(localFallback);
        setTotalPages(1);
        setError(toErrorMessage(err, "서버에서 저장 내역을 불러오지 못했습니다. 로컬 데이터를 표시합니다."));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [page, size, platform, from, to, query, localFallback]);

  const hasRows = rows.length > 0;

  const handleClearAll = async () => {
    const confirmed = await confirmClear({
      title: "저장 내역을 모두 삭제할까요?",
      message: "로컬에 저장된 마케팅 캡션이 모두 삭제됩니다. 되돌릴 수 없습니다.",
    });
    if (!confirmed) return;
    clearSavedMarketingPosts();
    setRows([]);
    warning("저장 내역을 모두 삭제했습니다.");
  };

  return (
    <Page>
      {confirmClearDialog}
      <PageHeader>
        <div>
          <h2>저장 내역</h2>
          <p>Summary에서 저장한 캡션 목록입니다.</p>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <GhostButtonSmall as="a" href="/marketing">
            마케팅 홈
          </GhostButtonSmall>
          {hasRows && (
            <GhostButtonSmall as="button" data-variant="danger" onClick={() => void handleClearAll()}>
              전체 삭제
            </GhostButtonSmall>
          )}
        </div>
      </PageHeader>

      <SectionCard>
        <FilterRow>
          <select
            value={platform}
            onChange={(event) => {
              setPage(0);
              setPlatform(event.target.value as SavedPost["platform"] | "");
            }}
          >
            <option value="">전체 플랫폼</option>
            <option value="INSTAGRAM">인스타그램</option>
            <option value="NAVER_BLOG">블로그</option>
            <option value="KAKAO_CHANNEL">카카오 채널</option>
          </select>
          <input
            type="date"
            lang="ko-KR"
            inputMode="numeric"
            pattern="^\\d{4}-\\d{2}-\\d{2}$"
            placeholder="YYYY-MM-DD"
            value={from}
            onFocus={(event) => openNativeDatePicker(event.currentTarget)}
            onChange={(event) => {
              setPage(0);
              setFrom(normalizeYMDInput(event.target.value));
            }}
            onBlur={(event) => {
              const normalized = normalizeYMDInput(event.currentTarget.value);
              if (normalized !== from) setFrom(normalized);
            }}
          />
          <span>~</span>
          <input
            type="date"
            lang="ko-KR"
            inputMode="numeric"
            pattern="^\\d{4}-\\d{2}-\\d{2}$"
            placeholder="YYYY-MM-DD"
            value={to}
            onFocus={(event) => openNativeDatePicker(event.currentTarget)}
            onChange={(event) => {
              setPage(0);
              setTo(normalizeYMDInput(event.target.value));
            }}
            onBlur={(event) => {
              const normalized = normalizeYMDInput(event.currentTarget.value);
              if (normalized !== to) setTo(normalized);
            }}
          />
          <SearchBox>
            <input
              placeholder="본문 검색"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") setPage(0);
              }}
            />
            <GhostButtonSmall as="button" onClick={() => setPage(0)}>
              검색
            </GhostButtonSmall>
          </SearchBox>
          <GhostButtonSmall
            as="button"
            onClick={() => {
              setPlatform("");
              setFrom("");
              setTo("");
              setQuery("");
              setPage(0);
            }}
          >
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
                  {rows.map((row) => {
                    const createdAtRaw = formatKoreanDateTime(row.createdAt, { includeWeekday: true });
                    const createdAtLabel = createdAtRaw === "—"
                      ? new Date(row.createdAt).toLocaleString("ko-KR", { hour12: false })
                      : createdAtRaw;
                    return (
                      <tr
                        key={row.id}
                        className="row"
                        onClick={() => navigate(`/marketing/saved/${row.id}`)}
                        title="상세 보기"
                        style={{ cursor: "pointer" }}
                      >
                        <td>{createdAtLabel}</td>
                        <td>{platformLabel(row.platform)}</td>
                        <td className="mono">{row.body.slice(0, 140)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </Scroller>
            <Pager>
              <PageBtn onClick={() => setPage((prev) => Math.max(0, prev - 1))} disabled={page <= 0}>
                이전
              </PageBtn>
              <span>
                {page + 1} / {Math.max(1, totalPages)}
              </span>
              <PageBtn
                onClick={() => setPage((prev) => Math.min(totalPages - 1, prev + 1))}
                disabled={page >= totalPages - 1}
              >
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
    // ignore unsupported browsers
  }
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

function toLocalSaved(post: SavedPost): SavedMarketing {
  return {
    id: String(post.id),
    createdAt: post.createdAt ? new Date(post.createdAt).getTime() : Date.now(),
    platform: post.platform,
    speechStyle: post.speechStyle,
    tone: post.tone ?? undefined,
    title: post.title ?? undefined,
    body: post.body,
    tags: Array.isArray(post.tags) ? post.tags : [],
  };
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
