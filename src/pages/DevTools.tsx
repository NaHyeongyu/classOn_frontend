import { useEffect, useState } from "react";
import styled from "styled-components";
import { GhostBtn as UIGhostBtn, PrimaryBtn as UIPrimaryBtn } from "../components/common/UI";
import { fetchJSON } from "../lib/fetcher";
import { seedDemo } from "../api/dev";

type Stats = { academyId: number | null; students: number; courses: number; counsels: number };

export default function DevTools() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [busy, setBusy] = useState(false);
  const [busyCourses, setBusyCourses] = useState(false);
  const [busySeed, setBusySeed] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [msgCourses, setMsgCourses] = useState<string | null>(null);
  const [msgSeed, setMsgSeed] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [errCourses, setErrCourses] = useState<string | null>(null);
  const [errSeed, setErrSeed] = useState<string | null>(null);
  const [seedStudents, setSeedStudents] = useState(50);
  const [seedCourses, setSeedCourses] = useState(8);
  const [seedCounsels, setSeedCounsels] = useState(40);

  async function loadStats() {
    try {
      const s = await fetchJSON<Stats>(`/api/dev/stats`);
      setStats(s);
    } catch (e: any) {
      setErr(e?.message || "통계 조회 실패");
    }
  }

  useEffect(() => { void loadStats(); }, []);

  async function onReset() {
    setBusy(true); setErr(null); setMsg(null);
    try {
      const res = await fetchJSON<any>(`/api/dev/reset`, { method: 'POST' });
      setMsg(`초기화 완료: records=${res.recordsDeleted}, attendance=${res.attendanceDeleted}, files=${res.filesDeleted}, counsels=${res.counselsDeleted}`);
      await loadStats();
    } catch (e: any) {
      setErr(e?.message || "초기화 실패");
    } finally {
      setBusy(false);
    }
  }

  async function onResetCourses() {
    setBusyCourses(true); setErrCourses(null); setMsgCourses(null);
    try {
      const res = await fetchJSON<any>(`/api/dev/reset-courses`, { method: 'POST' });
      setMsgCourses(`수업 초기화 완료: courses=${res.coursesDeleted}, records=${res.recordsDeleted}, attendance=${res.attendanceDeleted}, files=${res.filesDeleted}, enrollmentsCleared=${res.enrollmentsCleared}`);
      await loadStats();
    } catch (e: any) {
      setErrCourses(e?.message || "수업 초기화 실패");
    } finally {
      setBusyCourses(false);
    }
  }

  async function onSeed() {
    setBusySeed(true); setErrSeed(null); setMsgSeed(null);
    try {
      const res = await seedDemo({ students: seedStudents, courses: seedCourses, counsels: seedCounsels });
      setMsgSeed(`생성 완료: students=${(res as any).studentsCreated ?? '-'}, courses=${(res as any).coursesCreated ?? '-'}, counsels=${(res as any).counselsCreated ?? '-'}`);
      await loadStats();
    } catch (e: any) {
      setErrSeed(e?.message || '데이터 생성 실패');
    } finally {
      setBusySeed(false);
    }
  }

  return (
    <Wrap>
      <Head>
        <h2>개발 도구</h2>
      </Head>
      <Card>
        <Row>
          <div>
            <h3>데이터 생성</h3>
            <p>테스트용 더미 데이터를 생성합니다. 수업 내역(1주)도 함께 준비됩니다.</p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 120px)', gap:8, alignItems:'center' }}>
            <div>
              <SmallLabel>학생 수</SmallLabel>
              <input type="number" min={0} value={seedStudents} onChange={(e)=>setSeedStudents(Number(e.target.value||0))} />
            </div>
            <div>
              <SmallLabel>수업 수</SmallLabel>
              <input type="number" min={0} value={seedCourses} onChange={(e)=>setSeedCourses(Number(e.target.value||0))} />
            </div>
            <div>
              <SmallLabel>상담 수</SmallLabel>
              <input type="number" min={0} value={seedCounsels} onChange={(e)=>setSeedCounsels(Number(e.target.value||0))} />
            </div>
            <div style={{ gridColumn:'1 / -1', textAlign:'right' }}>
              <UIPrimaryBtn as={"button" as any} disabled={busySeed} onClick={onSeed}>{busySeed ? '진행중…' : '데이터 생성'}</UIPrimaryBtn>
            </div>
          </div>
        </Row>
        {msgSeed && <Ok>{msgSeed}</Ok>}
        {errSeed && <Err>{errSeed}</Err>}
      </Card>

      <Card>
        <Row>
          <div>
            <h3>데이터 초기화</h3>
            <p>수업기록/출석/첨부/상담 데이터를 모두 삭제합니다. 학생/수업/등록은 유지됩니다.</p>
          </div>
          <div>
            <UIPrimaryBtn as={"button" as any} disabled={busy} onClick={onReset}>{busy ? '진행중…' : '초기화 실행'}</UIPrimaryBtn>
          </div>
        </Row>
        {msg && <Ok>{msg}</Ok>}
        {err && <Err>{err}</Err>}
      </Card>
      <Card>
        <Row>
          <div>
            <h3>수업 초기화</h3>
            <p>수업과 수업 내역(출결/첨부)을 모두 삭제합니다. 학생/상담은 유지됩니다.</p>
          </div>
          <div>
            <UIPrimaryBtn as={"button" as any} disabled={busyCourses} onClick={onResetCourses}>{busyCourses ? '진행중…' : '수업 초기화 실행'}</UIPrimaryBtn>
          </div>
        </Row>
        {msgCourses && <Ok>{msgCourses}</Ok>}
        {errCourses && <Err>{errCourses}</Err>}
      </Card>
      <Card>
        <h3>현재 통계</h3>
        {!stats ? (
          <Muted>불러오는 중…</Muted>
        ) : (
          <Grid>
            <Item><Label>학생 수</Label><Val>{stats.students}</Val></Item>
            <Item><Label>수업 수</Label><Val>{stats.courses}</Val></Item>
            <Item><Label>상담 수</Label><Val>{stats.counsels}</Val></Item>
          </Grid>
        )}
        <UIGhostBtn as={"button" as any} onClick={loadStats} style={{ marginTop: 8 }}>새로고침</UIGhostBtn>
      </Card>
      <Hint>백엔드 설정(app.dev-endpoints=true)에서만 동작합니다.</Hint>
    </Wrap>
  );
}

const Wrap = styled.div` display:grid; gap:12px; `;
const Head = styled.div` display:flex; align-items:center; gap:8px; h2{ margin:0; font-size:20px; } `;
const Card = styled.section` background:#fff; border:1px solid #e5e7eb; border-radius:12px; padding:14px; `;
const Row = styled.div` display:flex; align-items:center; justify-content:space-between; gap:12px; `;
const Ok = styled.div` margin-top:8px; background:#dcfce7; color:#166534; border:1px solid #bbf7d0; padding:8px 10px; border-radius:8px; font-size:13px; `;
const Err = styled.div` margin-top:8px; background:#fee2e2; color:#b91c1c; border:1px solid #fecaca; padding:8px 10px; border-radius:8px; font-size:13px; `;
const Muted = styled.div` color:#6b7280; font-size:13px; `;
const Grid = styled.div` display:grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap:10px; `;
const Item = styled.div` border:1px solid #e5e7eb; border-radius:10px; padding:10px; background:#fafafa; `;
const Label = styled.div` color:#6b7280; font-size:12px; `;
const Val = styled.div` font-size:18px; font-weight:900; color:#0f172a; `;
const Hint = styled.div` color:#6b7280; font-size:12px; `;
const SmallLabel = styled.div` color:#6b7280; font-size:12px; margin-bottom:4px; `;
