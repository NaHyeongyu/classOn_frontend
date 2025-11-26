import styled from "styled-components";
import { useEffect, useMemo, useState } from "react";
import { listCourses, type Course, type PageResult } from "../../api/courses";
import { formatYMD } from "../../features/calendar/dateUtils";
import { readableError } from "@/lib/errors";
import { useAuth } from "@/hooks/useAuth";

export default function ClassesStats() {
  const { authGeneration, user } = useAuth();
  const isTeacher = (user?.role ?? "").toString().toUpperCase() === "TEACHER";
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState<number>(0);
  const [inProgress, setInProgress] = useState<number>(0);
  const [todayCount, setTodayCount] = useState<number>(0);
  const [version, setVersion] = useState(0);

  const today = useMemo(() => formatYMD(new Date()), []);

  useEffect(() => {
    const handleRefresh = () => setVersion((v) => v + 1);
    window.addEventListener('courses:refresh', handleRefresh);
    return () => window.removeEventListener('courses:refresh', handleRefresh);
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true); setError(null);
      try {
        const [t, p, d] = await Promise.all([
          listCourses({ size: 1 }),
          listCourses({ status: "IN_PROGRESS", size: 1 }),
          listCourses({ onYmd: today, size: 1 }),
        ]) as PageResult<Course>[];
        if (!cancelled) {
          setTotal(t.totalElements);
          setInProgress(p.totalElements);
          setTodayCount(d.totalElements);
        }
      } catch (e) {
        if (!cancelled) setError(readableError(e, "수업 요약 정보를 불러오지 못했습니다."));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => { cancelled = true; };
  }, [today, version, authGeneration]);

  return (
    <Row>
      <StatCard>
        <Head>
          <Title>{isTeacher ? "담당 수업 수" : "총 수업 수"}</Title>
          <IconBox aria-hidden>{booksIcon}</IconBox>
        </Head>
        <Value>{loading ? "…" : `${total}개`}</Value>
        {error && <Err>{error}</Err>}
      </StatCard>
      <StatCard>
        <Head>
          <Title>{isTeacher ? "진행중 (담당)" : "진행중 수업"}</Title>
          <IconBox aria-hidden>{playIcon}</IconBox>
        </Head>
        <Value>{loading ? "…" : `${inProgress}개`}</Value>
      </StatCard>
      <StatCard>
        <Head>
          <Title>{isTeacher ? "오늘 담당 수업" : "오늘 수업"}</Title>
          <IconBox aria-hidden>{calendarIcon}</IconBox>
        </Head>
        <Value>{loading ? "…" : `${todayCount}개`}</Value>
      </StatCard>
    </Row>
  );
}

const Row = styled.div`
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;
`;
const StatCard = styled.article`
  background: #fff; border: 1px solid #e5e7eb; border-radius: 14px; padding: 14px; display: flex; flex-direction: column; gap: 8px;
`;
const Head = styled.div` display: flex; align-items: center; justify-content: space-between; `;
const Title = styled.h4` margin: 0; font-size: 14px; color: #6b7280; font-weight: 600; `;
const IconBox = styled.span` width: 34px; height: 34px; border-radius: 10px; display: grid; place-items: center; background: #eef2ff; color: #4f46e5; `;
const Value = styled.div` font-size: 28px; font-weight: 800; color: #111827; letter-spacing: -0.02em; `;
const Err = styled.div` color: #b91c1c; font-size: 12px; `;

const booksIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M4 4v15.5A2.5 2.5 0 0 0 6.5 22H20" />
    <path d="M20 22V6a2 2 0 0 0-2-2H6" />
  </svg>
);
const playIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);
const calendarIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);
