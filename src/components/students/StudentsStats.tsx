import styled from "styled-components";
import { useEffect, useState } from "react";
import { listStudents, type PageResult, type Student } from "../../api/students";
import { readableError } from "@/lib/errors";

export default function StudentsStats() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState<number>(0);
  const [enrolled, setEnrolled] = useState<number>(0);
  const [onLeave, setOnLeave] = useState<number>(0);
  const [pending, setPending] = useState<number>(0);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true); setError(null);
      try {
        const [t, e, l, p] = await Promise.all([
          listStudents({ size: 1 }),
          listStudents({ status: "ENROLLED", size: 1 }),
          listStudents({ status: "ON_LEAVE", size: 1 }),
          listStudents({ status: "PENDING", size: 1 }),
        ]) as PageResult<Student>[];
        if (!cancelled) {
          setTotal(t.totalElements);
          setEnrolled(e.totalElements);
          setOnLeave(l.totalElements);
          setPending(p.totalElements);
        }
      } catch (e) {
        if (!cancelled) setError(readableError(e, "요약 정보를 불러오지 못했습니다."));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => { cancelled = true; };
  }, []);

  return (
    <Row>
      <StatCard>
        <Head>
          <Title>총 원생 수</Title>
          <IconBox aria-hidden>{usersIcon}</IconBox>
        </Head>
        <Value>{loading ? "…" : `${total}명`}</Value>
        {error && <Err>{error}</Err>}
      </StatCard>
      <StatCard>
        <Head>
          <Title>수강중</Title>
          <IconBox aria-hidden>{classIcon}</IconBox>
        </Head>
        <Value>{loading ? "…" : `${enrolled}명`}</Value>
      </StatCard>
      <StatCard>
        <Head>
          <Title>휴학</Title>
          <IconBox aria-hidden>{pauseIcon}</IconBox>
        </Head>
        <Value>{loading ? "…" : `${onLeave}명`}</Value>
      </StatCard>
      <StatCard>
        <Head>
          <Title>대기중</Title>
          <IconBox aria-hidden>{waitIcon}</IconBox>
        </Head>
        <Value>{loading ? "…" : `${pending}명`}</Value>
      </StatCard>
    </Row>
  );
}

const Row = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 12px;
`;

const StatCard = styled.article`
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
const Head = styled.div`
  display: flex; align-items: center; justify-content: space-between;
`;
const Title = styled.h4`
  margin: 0; font-size: 14px; color: #6b7280; font-weight: 600;
`;
const IconBox = styled.span`
  width: 34px; height: 34px; border-radius: 10px; display: grid; place-items: center; background: #eef2ff; color: #4f46e5;
`;
const Value = styled.div`
  font-size: 28px; font-weight: 800; color: #111827; letter-spacing: -0.02em;
`;
const Err = styled.div`
  color: #b91c1c; font-size: 12px;
`;

const usersIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M4 21v-2a4 4 0 0 1 3-3.87" />
    <circle cx="7" cy="7" r="4" />
    <circle cx="17" cy="7" r="4" />
  </svg>
);
const classIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10L12 4 2 10l10 6 10-6z" />
    <path d="M6 12v5l6 3 6-3v-5" />
  </svg>
);
const pauseIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="6" y="4" width="4" height="16" />
    <rect x="14" y="4" width="4" height="16" />
  </svg>
);
const waitIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l3 3" />
  </svg>
);
