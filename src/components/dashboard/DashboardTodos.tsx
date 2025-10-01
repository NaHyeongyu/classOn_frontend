/**
 * EN: Compact widget for today's todos shown on the dashboard.
 * KO: 대시보드에 표시되는 '오늘 할 일' 위젯(간략 버전).
 */
import styled from "styled-components";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { formatYMD } from "../../features/calendar/dateUtils";
import { useTodosByDate } from "../../features/todos/useTodosByDate";
import { EmptyPlaceholder } from "../common/EmptyPlaceholder";

export default function DashboardTodos() {
  const navigate = useNavigate();
  const today = useMemo(() => formatYMD(new Date()), []);
  const { data, loading, error } = useTodosByDate(today);
  const inProgress = useMemo(() => (data || []).filter((t) => t.status !== "DONE"), [data]);
  const shortlist = inProgress.slice(0, 5);

  return (
    <Wrap>
      <Head>
        <HeadLeft>
          <Icon>{checkIcon}</Icon>
          <h4>오늘 할 일</h4>
          <Count>{inProgress.length}</Count>
        </HeadLeft>
        <More type="button" onClick={() => navigate(`/calendar/${today}`)}>더보기</More>
      </Head>
      {loading && <Hint>불러오는 중...</Hint>}
      {error && <Error>{error}</Error>}
      {!loading && !error && (
        shortlist.length === 0 ? (
          <EmptyPlaceholder title="오늘 등록된 할 일이 없습니다." />
        ) : (
          <List>
            {shortlist.map((t) => (
              <Item key={t.id}>
                <Dot aria-hidden />
                <TextBox>
                  <Title title={t.title}>{t.title}</Title>
                  {t.notes && <Body title={t.notes}>{t.notes}</Body>}
                </TextBox>
              </Item>
            ))}
          </List>
        )
      )}
    </Wrap>
  );
}

const Wrap = styled.div`
  width: 100%; height: 100%; display: flex; flex-direction: column; min-height: 0;
`;
const Head = styled.div`
  display: flex; align-items: center; justify-content: space-between;
`;
const HeadLeft = styled.div`
  display: flex; align-items: center; gap: 8px;
  h4 { margin: 0; font-size: 15px; color: #0f172a; }
`;
const Icon = styled.span`
  width: 28px; height: 28px; border-radius: 8px; display: grid; place-items: center; background: #eef2ff; color: #4f46e5;
`;
const Count = styled.span`
  background: #e5e7eb; color: #374151; height: 20px; min-width: 22px; padding: 0 6px; border-radius: 9999px; display: inline-flex; align-items: center; justify-content: center; font-weight: 700; font-size: 12px;
`;
const More = styled.button`
  height: 40px; padding: 0 16px; border-radius: 10px; border: 1px solid #e5e7eb; background: #fff; color: #111827; font-weight: 700; font-size: 14px; cursor: pointer;
  &:hover { background: #f9fafb; }
`;
const List = styled.div`
  margin-top: 10px;
  display: grid;
  gap: 8px;
  overflow: auto;
  max-height: 320px; /* scroll when list grows */
  padding-bottom: 4px;
`;
const Item = styled.div`
  display: grid;
  grid-template-columns: 10px 1fr;
  align-items: start; /* align to first text line */
  gap: 10px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 10px 12px;
  background: #fff;
  transition: background 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
  &:hover { background: #fafafa; border-color: #e2e8f0; box-shadow: 0 1px 2px rgba(0,0,0,0.04); }
`;
const Dot = styled.span`
  width: 10px; height: 10px; border-radius: 9999px; background: #4f46e5; margin-top: 3px;
`;
const TextBox = styled.div`
  min-width: 0; display: flex; flex-direction: column; gap: 2px; overflow: hidden;
`;
const Title = styled.div`
  font-weight: 800; color: #0f172a; font-size: 14px; letter-spacing: -0.01em;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
`;
const Body = styled.div`
  color: #64748b; font-size: 12.5px; line-height: 1.45; overflow: hidden;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
`;
const Hint = styled.div`
  color: #6b7280; font-size: 12px; margin-top: 8px;
`;
const Error = styled.div`
  color: #b91c1c; font-size: 12px; font-weight: 700; margin-top: 8px;
`;

const checkIcon = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6L9 17l-5-5" />
  </svg>
);
