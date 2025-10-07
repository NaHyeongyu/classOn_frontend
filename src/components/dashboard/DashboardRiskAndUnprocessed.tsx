import { useCallback, useEffect, useMemo, useState } from "react";
import styled, { css } from "styled-components";
import { useNavigate } from "react-router-dom";
import { DashboardPanel } from "./DashboardLayout";
import { EmptyPlaceholder } from "../common/EmptyPlaceholder";
import { buttonVariants } from "../common/UI";
import { formatYMD } from "@/features/calendar/dateUtils";
import { formatTimeRangeLabel } from "@/lib/format";
import { getDailyAttendance, type AttendanceDailySummary, type AttendanceClassSummary } from "@/api/attendance";
import type { StudentAttendance } from "@/api/students";
import { calcRisk, type RiskResult } from "@/features/risk/riskUtils";
import type { GradeEntry } from "@/features/grades/gradesStorage";
import { listExamsByCourse } from "@/features/exams/examsStorage";
import { paths } from "@/routes";

type TabKey = "unprocessed"; // | "risk" (disabled)

export default function DashboardRiskAndUnprocessed() {
  const [, setTab] = useState<TabKey>("unprocessed");
  return (
    <DashboardPanel span={6}>
      <Head>
        <HeadLeft>
          <Title>미처리/이탈 위험</Title>
        </HeadLeft>
        {/* Tabs disabled while risk feature is off */}
        <Tabs role="tablist" aria-label="대시보드 보조 패널">
          <Tab
            type="button"
            role="tab"
            aria-selected={true}
            $active={true}
            onClick={() => setTab("unprocessed")}
          >
            미처리 출석
          </Tab>
          {/** 이탈 위험 탭 비활성화 */}
        </Tabs>
      </Head>
      <Body><UnprocessedList /></Body>
    </DashboardPanel>
  );
}

function UnprocessedList() {
  const navigate = useNavigate();
  const today = useMemo(() => formatYMD(new Date()), []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rows, setRows] = useState<{
    studentId: number | null;
    name: string | null;
    courseId: number | null;
    recordId: number | null;
    courseTitle: string | null;
    startTime: string | null;
    endTime: string | null;
  }[]>([]);

  const load = useCallback(async (): Promise<void> => {
    setLoading(true); setError(null);
    try {
      const list: AttendanceDailySummary[] = await getDailyAttendance({ from: today, to: today });
      const day = list[0];
      const items: typeof rows = [];
      (day?.classes || []).forEach((klass: AttendanceClassSummary) => {
        const { recordId, courseId, courseTitle, startTime, endTime } = klass;
        (klass.unprocessedStudents || []).forEach((stu) => {
          items.push({
            studentId: stu.id,
            name: stu.name,
            courseId,
            recordId,
            courseTitle,
            startTime,
            endTime,
          });
        });
      });
      // De-duplicate by (studentId, recordId)
      const seen = new Set<string>();
      const unique = items.filter((it) => {
        const key = `${it.studentId ?? 'x'}-${it.recordId ?? 'x'}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
      setRows(unique);
    } catch (err) {
      setError(toErrorMessage(err, "미처리 출석을 불러오지 못했습니다."));
    } finally { setLoading(false); }
  }, [today]);

  useEffect(() => {
    void load();
    const t = setInterval(load, 60_000);
    const onRefresh: () => void = () => { void load(); };
    const onVis = () => { if (document.visibilityState === 'visible') void load(); };
    window.addEventListener('calendar:classes-refresh', onRefresh as EventListener);
    window.addEventListener('dashboard:attendance-refresh', onRefresh as EventListener);
    document.addEventListener('visibilitychange', onVis);
    return () => {
      clearInterval(t);
      window.removeEventListener('calendar:classes-refresh', onRefresh as EventListener);
      window.removeEventListener('dashboard:attendance-refresh', onRefresh as EventListener);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [load]);

  return (
    <div>
      <SubHead>
        <strong>미처리 출석</strong>
        <SubMeta>
          {loading ? '불러오는 중…' : `${rows.length}건`}
          {error ? <Err>{error}</Err> : null}
        </SubMeta>
      </SubHead>
      {rows.length === 0 && !loading ? (
        <EmptyPlaceholder title="오늘 미처리된 출석이 없습니다." />
      ) : (
        <List>
          {rows.map((r, i) => (
            <Item key={`${r.studentId ?? 'x'}-${r.recordId ?? i}`}>
              <Main>
                <strong>{r.name || '학생'}</strong>
                <span className="course">{r.courseTitle || '-'}</span>
              </Main>
              <Meta>
                <Time>{formatTimeRangeLabel(r.startTime, r.endTime)}</Time>
                {r.courseId ? (
                  <Action type="button" onClick={() => {
                    if (r.recordId) navigate(paths.classes.historyRecord(r.courseId!, r.recordId!));
                    else navigate(paths.classes.historyDate(r.courseId!, today));
                  }}>처리하기</Action>
                ) : null}
              </Meta>
            </Item>
          ))}
        </List>
      )}
    </div>
  );
}

function RiskList() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rows, setRows] = useState<Array<{ studentId: number; studentName: string; risk: RiskResult }>>([]);

  const load = useCallback(async (): Promise<void> => {
    setLoading(true); setError(null);
    try {
      const today = new Date();
      const start = new Date(today);
      start.setDate(today.getDate() - 29);
      const from = formatYMD(start);
      const to = formatYMD(today);

      // Attendance over range
      const daily = await getDailyAttendance({ from, to });
      const attByStudent = new Map<number, StudentAttendance[]>();
      for (const d of daily) {
        for (const a of (d.attendances || [])) {
          if (a.studentId == null) continue;
          const arr = attByStudent.get(a.studentId) || [];
          arr.push({
            date: d.date,
            courseId: a.courseId || 0,
            courseTitle: a.courseTitle || '',
            present: !!a.present,
            reason: a.reason || undefined,
            recordId: a.recordId || 0,
            // time fields not present in this summary; omit
          });
          attByStudent.set(a.studentId, arr);
        }
      }

      // Compute risk for students with attendance data
      const out: Array<{ studentId: number; studentName: string; risk: RiskResult }> = [];
      const studentIds = new Set<number>([...Array.from(attByStudent.keys())]);
      for (const id of studentIds) {
        const att = attByStudent.get(id) || [];
        const result = calcRisk(att, [], { days: 30 });
        const name = findStudentName(daily, id) || '학생';
        out.push({ studentId: id, studentName: name, risk: result });
      }

      // Augment with exam decline rule: last 3 exams avg worse than previous avg
      // by >= 2 levels (letter) or >= 30 points (percent)
      try {
        const declines = computeExamDeclineFlags(2, 30);
        const presentIds = new Set(out.map(r => r.studentId));
        for (const row of out) {
          const d = declines.get(row.studentId);
          if (!d) continue;
          if (typeof d.rankDelta === 'number' && d.rankDelta >= 2) {
            row.risk.reasons.push(`최근 3회 시험 평균 ${Math.round(d.rankDelta)}단계 하락`);
            row.risk.level = 'RISK';
          }
          if (typeof d.percentDelta === 'number' && d.percentDelta >= 30) {
            row.risk.reasons.push(`최근 3회 시험 평균 ${Math.round(d.percentDelta)}점 하락`);
            row.risk.level = 'RISK';
          }
        }
        // Include additional students flagged only by exams (no recent att/counsel)
        for (const [sid, d] of declines) {
          if (presentIds.has(sid)) continue;
          const reasons: string[] = [];
          if (typeof d.rankDelta === 'number' && d.rankDelta >= 2) reasons.push(`최근 3회 시험 평균 ${Math.round(d.rankDelta)}단계 하락`);
          if (typeof d.percentDelta === 'number' && d.percentDelta >= 30) reasons.push(`최근 3회 시험 평균 ${Math.round(d.percentDelta)}점 하락`);
          if (!reasons.length) continue;
          out.push({
            studentId: sid,
            studentName: findStudentName(daily, sid) || '학생',
            risk: {
              level: 'RISK',
              metrics: { attRate30: null, totalSessions30: 0, absences30: 0, lastAbsentDays: null, negativeCounselCount30: 0 },
              reasons,
            }
          });
        }
      } catch { /* ignore exam errors */ }

      // Sort by level and metrics
      const scoreLevel = (lv: RiskResult["level"]) => lv === 'RISK' ? 2 : lv === 'CAUTION' ? 1 : 0;
      out.sort((a, b) => {
        const diffLevel = scoreLevel(b.risk.level) - scoreLevel(a.risk.level);
        if (diffLevel !== 0) return diffLevel;
        const aRate = a.risk.metrics.attRate30 ?? 101;
        const bRate = b.risk.metrics.attRate30 ?? 101;
        if (aRate !== bRate) return aRate - bRate; // 낮은 출석률 우선
        return b.risk.metrics.negativeCounselCount30 - a.risk.metrics.negativeCounselCount30;
      });

      setRows(out.slice(0, 5));
    } catch (err) {
      setError(toErrorMessage(err, "이탈 위험 정보를 불러오지 못했습니다."));
    } finally { setLoading(false); }
  }, []);

  useEffect(() => {
    void load();
    const onVis = () => { if (document.visibilityState === 'visible') void load(); };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, [load]);

  return (
    <div>
      <SubHead>
        <strong>이탈 위험 학생</strong>
        <SubMeta>
          {loading ? '불러오는 중…' : `${rows.length}명`}
          {error ? <Err>{error}</Err> : null}
        </SubMeta>
      </SubHead>
      {rows.length === 0 && !loading ? (
        <EmptyPlaceholder title="최근 30일 기준 고위험 학생이 없습니다." />
      ) : (
        <List>
          {rows.map((r) => (
            <Item key={r.studentId}>
              <Main>
                <strong>{r.studentName}</strong>
                <span className="course">
                  <RiskBadge data-level={r.risk.level}>
                    {r.risk.level === 'RISK' ? '위험' : r.risk.level === 'CAUTION' ? '주의' : '양호'}
                  </RiskBadge>
                </span>
              </Main>
              <Meta>
                <Reason>{formatReason(r.risk)}</Reason>
                <Action type="button" onClick={() => navigate(paths.students.detail(r.studentId))}>자세히</Action>
              </Meta>
            </Item>
          ))}
        </List>
      )}
    </div>
  );
}

function findStudentName(daily: AttendanceDailySummary[], studentId: number): string | null {
  for (const d of daily) {
    for (const a of (d.attendances || [])) {
      if (a.studentId === studentId && a.studentName) return a.studentName;
    }
  }
  return null;
}

function formatReason(res: RiskResult): string {
  const bits: string[] = [];
  if (typeof res.metrics.attRate30 === 'number') bits.push(`출석률 ${res.metrics.attRate30}%`);
  for (const r of res.reasons) {
    if (bits.length >= 2) break;
    bits.push(r);
  }
  return bits.join(' · ');
}

// ----- Exam decline utilities (last 3 vs previous average) -----
function computeExamDeclineFlags(thresholdSteps = 2, thresholdPercentDrop = 30): Map<number, { rankDelta?: number; percentDelta?: number }> {
  type Entry = { studentId: number; date: string; mode: 'percent' | 'letter'; percent?: number | null; rank?: number | null };
  const perStudent = new Map<number, Entry[]>();
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i) || '';
      if (!k.startsWith('examResults:')) continue;
      const parts = k.split(':');
      if (parts.length !== 3) continue;
      const courseId = Number(parts[1]);
      const examId = parts[2];
      if (!Number.isFinite(courseId)) continue;
      const exams = listExamsByCourse(courseId);
      const meta = exams.find(e => e.id === examId);
      if (!meta) continue;
      let list: unknown[] = [];
      try { const raw = localStorage.getItem(k); list = raw ? JSON.parse(raw) : []; } catch (e) { list = []; }
      if (!Array.isArray(list)) continue;
      for (const it of list) {
        if (!isPlainObject(it)) continue;
        const sid = toNumber((it as any).studentId);
        if (sid == null) continue;
        if (meta.inputMode === 'percent') {
          const outOfRaw = (it as any).outOf;
          const scoreRaw = (it as any).score;
          const outOf = toNumber(outOfRaw) ?? 100;
          const score = toNumber(scoreRaw);
          const pct = score == null ? null : Math.max(0, Math.min(100, (score / (outOf > 0 ? outOf : 100)) * 100));
          const arr = perStudent.get(sid) || [];
          arr.push({ studentId: sid, date: meta.date || '', mode: 'percent', percent: pct });
          perStudent.set(sid, arr);
        } else {
          const level = toString((it as any).level);
          const rank = letterToRankStr(level);
          const arr = perStudent.get(sid) || [];
          arr.push({ studentId: sid, date: meta.date || '', mode: 'letter', rank });
          perStudent.set(sid, arr);
        }
      }
    }
  } catch (e) { /* ignore */ }

  const flags = new Map<number, { rankDelta?: number; percentDelta?: number }>();
  for (const [sid, entries] of perStudent) {
    const sorted = entries.slice().sort((a, b) => (a.date || '').localeCompare(b.date || ''));
    // Percent-mode decline
    const pctItems = sorted.filter(e => e.mode === 'percent' && typeof e.percent === 'number') as Array<Required<Pick<Entry, 'percent'>> & Entry>;
    if (pctItems.length >= 3) {
      const last3 = pctItems.slice(-3);
      const prev = pctItems.slice(0, pctItems.length - 3);
      const prevAvg = prev.length ? avg(prev.map(p => p.percent!)) : null;
      const recentAvg = avg(last3.map(p => p.percent!));
      if (prevAvg != null && recentAvg != null && prevAvg - recentAvg >= thresholdPercentDrop) {
        const cur = flags.get(sid) || {};
        cur.percentDelta = prevAvg - recentAvg;
        flags.set(sid, cur);
      }
    }
    // Letter(rank)-mode decline
    const rankItems = sorted.filter(e => e.mode === 'letter' && typeof e.rank === 'number') as Array<Required<Pick<Entry, 'rank'>> & Entry>;
    if (rankItems.length >= 3) {
      const last3 = rankItems.slice(-3);
      const prev = rankItems.slice(0, rankItems.length - 3);
      const prevAvg = prev.length ? avg(prev.map(r => r.rank!)) : null;
      const recentAvg = avg(last3.map(r => r.rank!));
      if (prevAvg != null && recentAvg != null && recentAvg - prevAvg >= thresholdSteps) {
        const cur = flags.get(sid) || {};
        cur.rankDelta = recentAvg - prevAvg;
        flags.set(sid, cur);
      }
    }
  }
  return flags;
}

function avg(nums: number[]): number | null {
  if (!nums.length) return null;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

// ----- Exam outlier utilities (localStorage-based, subject+date keyed) -----
function computeExamOutliers(thresholdSteps = 2): Map<number, { levelRank: number }> {
  // Prefer exam results storage; fall back to legacy grades
  const examFlagged = computeOutliersFromExamResults(thresholdSteps);
  if (examFlagged.size) return examFlagged;
  const all = readAllGrades();
  // Legacy fallback by subject+date
  let chosen: { key: string; date: string; subject: string } | null = null;
  const keys: Array<{ key: string; date: string; subject: string }> = [];
  for (const [, list] of all) {
    for (const g of list) {
      const date = (g.date || '').slice(0, 10);
      const subject = (g.subject || '').trim() || '시험';
      if (!date) continue;
      const key = `${subject}::${date}`;
      keys.push({ key, date, subject });
    }
  }
  if (keys.length === 0) return new Map();
  keys.sort((a, b) => a.date.localeCompare(b.date));
  chosen = keys[keys.length - 1];
  const perStudent: Array<{ studentId: number; entry: GradeEntry; rank: number | null }> = [];
  for (const [sid, list] of all) {
    const entry = list.find((g) => `${(g.subject || '').trim() || '시험'}::${(g.date || '').slice(0,10)}` === chosen!.key);
    if (!entry) continue;
    const rank = levelToRank(entry);
    perStudent.push({ studentId: sid, entry, rank });
  }
  const ranks = perStudent.map((p) => p.rank).filter((r): r is number => typeof r === 'number');
  if (ranks.length === 0) return new Map();
  const avg = ranks.reduce((a, b) => a + b, 0) / ranks.length;
  const flagged = new Map<number, { levelRank: number }>();
  for (const p of perStudent) {
    if (typeof p.rank !== 'number') continue;
    if (p.rank >= avg + thresholdSteps) {
      flagged.set(p.studentId, { levelRank: p.rank });
    }
  }
  return flagged;
}

function computeOutliersFromExamResults(thresholdSteps = 2): Map<number, { levelRank: number }> {
  type ExamSnapshot = { courseId: number; examId: string; date: string; mode: 'percent' | 'letter'; results: Array<{ studentId: number; rank: number | null }> };
  const snaps: ExamSnapshot[] = [];
  try {
    // Scan localStorage for examResults:courseId:examId keys
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i) || '';
      if (!k.startsWith('examResults:')) continue;
      const parts = k.split(':');
      if (parts.length !== 3) continue;
      const courseId = Number(parts[1]);
      const examId = parts[2];
      if (!Number.isFinite(courseId)) continue;
      const exams = listExamsByCourse(courseId);
      const meta = exams.find(e => e.id === examId);
      if (!meta) continue;
      const raw = localStorage.getItem(k);
      const parsed = raw ? JSON.parse(raw) : [];
      const list = Array.isArray(parsed) ? parsed : [];
      const results = list.reduce<Array<{ studentId: number; rank: number | null }>>((acc, entry) => {
        if (!isPlainObject(entry)) return acc;
        const studentId = toNumber(entry.studentId);
        if (studentId == null) return acc;
        const rank = meta.inputMode === 'percent'
          ? percentToRank(toNumber(entry.score))
          : letterToRankStr(toString(entry.level));
        acc.push({ studentId, rank });
        return acc;
      }, []);
      snaps.push({ courseId, examId, date: (meta.date || ''), mode: meta.inputMode, results });
    }
  } catch (e) { /* ignore */ }
  if (!snaps.length) return new Map();
  snaps.sort((a, b) => a.date.localeCompare(b.date));
  const chosen = snaps[snaps.length - 1];
  const ranks = chosen.results.map(r => r.rank).filter((v): v is number => typeof v === 'number');
  if (!ranks.length) return new Map();
  const avg = ranks.reduce((a,b)=>a+b,0) / ranks.length;
  const flagged = new Map<number, { levelRank: number }>();
  for (const r of chosen.results) {
    if (typeof r.rank !== 'number') continue;
    if (r.rank >= avg + thresholdSteps) flagged.set(r.studentId, { levelRank: r.rank });
  }
  return flagged;
}

function levelToRank(g: GradeEntry): number | null {
  const lv = (g.level || '').trim();
  if (lv) {
    const lower = lv.toLowerCase();
    const letter = ['a+','a','a-','b+','b','b-','c+','c','c-','d','f'];
    const kLevel1 = ['수','우','미','양','가']; // best->worst
    const kLevel2 = ['상','중상','중','중하','하'];
    const idxLetter = letter.indexOf(lower);
    if (idxLetter >= 0) return idxLetter; // 0 is best
    const idxK1 = kLevel1.indexOf(lv);
    if (idxK1 >= 0) return idxK1;
    const idxK2 = kLevel2.indexOf(lv);
    if (idxK2 >= 0) return idxK2;
    // Pure numeric levels (1=best .. 9=worst)
    const asNum = Number(lv);
    if (Number.isFinite(asNum) && asNum > 0) return asNum - 1;
  }
  // Fallback to score -> letter buckets
  if (typeof g.score === 'number') {
    const outOf = typeof g.outOf === 'number' && g.outOf > 0 ? g.outOf : 100;
    const pct = (g.score / outOf) * 100;
    if (pct >= 97) return 0; // A+
    if (pct >= 93) return 1; // A
    if (pct >= 90) return 2; // A-
    if (pct >= 87) return 3; // B+
    if (pct >= 83) return 4; // B
    if (pct >= 80) return 5; // B-
    if (pct >= 77) return 6; // C+
    if (pct >= 73) return 7; // C
    if (pct >= 70) return 8; // C-
    if (pct >= 60) return 9; // D
    return 10; // F
  }
  return null;
}

function percentToRank(score: number | null): number | null {
  if (score == null || !Number.isFinite(score)) return null;
  const pct = Math.max(0, Math.min(100, Math.round(score)));
  if (pct >= 97) return 0; // A+
  if (pct >= 93) return 1; // A
  if (pct >= 90) return 2; // A-
  if (pct >= 87) return 3; // B+
  if (pct >= 83) return 4; // B
  if (pct >= 80) return 5; // B-
  if (pct >= 77) return 6; // C+
  if (pct >= 73) return 7; // C
  if (pct >= 70) return 8; // C-
  if (pct >= 60) return 9; // D
  return 10; // F
}

function letterToRankStr(l: string): number | null {
  const s = (l || '').trim();
  if (!s) return null;
  const lower = s.toLowerCase();
  const letter = ['a+','a','a-','b+','b','b-','c+','c','c-','d','f'];
  const idxLetter = letter.indexOf(lower);
  if (idxLetter >= 0) return idxLetter;
  const k1 = ['수','우','미','양','가'];
  const k2 = ['상','중상','중','중하','하'];
  const idx1 = k1.indexOf(s);
  if (idx1 >= 0) return idx1;
  const idx2 = k2.indexOf(s);
  if (idx2 >= 0) return idx2;
  return null;
}

function readAllGrades(): Map<number, GradeEntry[]> {
  const out = new Map<number, GradeEntry[]>();
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i) || '';
      if (!k.startsWith('grades:')) continue;
      const sid = Number(k.slice('grades:'.length));
      if (!Number.isFinite(sid)) continue;
      try {
        const raw = localStorage.getItem(k);
        if (!raw) continue;
        const list = JSON.parse(raw) as GradeEntry[];
        if (Array.isArray(list)) out.set(sid, list);
      } catch (e) { /* ignore */ }
    }
  } catch (e) { /* ignore */ }
  return out;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function toNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
}

function toString(value: unknown): string {
  if (typeof value === 'string') return value;
  if (value == null) return '';
  return String(value);
}

function toErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === 'string' && error.trim()) return error;
  return fallback;
}

const Head = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${(p) => p.theme.spacing.md};
  flex-wrap: wrap;
`;

const HeadLeft = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${(p) => p.theme.spacing.sm};
`;

const Title = styled.h3`
  margin: 0;
  font-size: ${(p) => p.theme.font.size.lg};
  font-weight: ${(p) => p.theme.font.weight.semiBold};
  color: ${(p) => p.theme.colors.text};
`;

const Tabs = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${(p) => p.theme.spacing.xs};
  padding: 4px;
  border-radius: ${(p) => p.theme.radii.sm};
  background: ${(p) => p.theme.colors.surfaceMuted};
  border: 1px solid ${(p) => p.theme.colors.borderMuted};
`;

const Tab = styled.button<{ $active: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  padding: 0 ${(p) => p.theme.spacing.md};
  border-radius: ${(p) => p.theme.radii.sm};
  border: 1px solid transparent;
  font-size: ${(p) => p.theme.font.size.sm};
  font-weight: ${(p) => p.theme.font.weight.semiBold};
  cursor: pointer;
  color: ${(p) => (p.$active ? p.theme.colors.primary : p.theme.colors.textMuted)};
  background: ${(p) => (p.$active ? p.theme.colors.surface : "transparent")};
  transition:
    background ${(p) => p.theme.motion.duration.base} ${(p) => p.theme.motion.easing.standard},
    color ${(p) => p.theme.motion.duration.base} ${(p) => p.theme.motion.easing.standard},
    border-color ${(p) => p.theme.motion.duration.base} ${(p) => p.theme.motion.easing.standard};

  ${({ $active, theme }) =>
    $active
      ? css`
          border-color: ${theme.colors.primary};
        `
      : css`
          border-color: transparent;
        `}

  &:hover {
    background: ${(p) => (p.$active ? p.theme.colors.surface : p.theme.colors.surfaceAlt)};
    color: ${(p) => p.theme.colors.text};
  }

  &:focus-visible {
    outline: none;
    box-shadow: ${(p) => p.theme.shadow.focusPrimary};
  }
`;

const Body = styled.div`
  margin-top: ${(p) => p.theme.spacing.md};
  min-height: 0;
  overflow: auto;
  display: flex;
  flex-direction: column;
  gap: ${(p) => p.theme.spacing.md};
`;

const SubHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${(p) => p.theme.spacing.sm};
`;

const SubMeta = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${(p) => p.theme.spacing.xs};
  color: ${(p) => p.theme.colors.textMuted};
  font-size: ${(p) => p.theme.font.size.sm};
`;

const Err = styled.span`
  color: ${(p) => p.theme.colors.danger};
  font-size: ${(p) => p.theme.font.size.sm};
  font-weight: ${(p) => p.theme.font.weight.semiBold};
`;

const List = styled.div`
  display: grid;
  gap: ${(p) => p.theme.spacing.sm};
  margin-top: ${(p) => p.theme.spacing.sm};
`;

const Item = styled.article`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${(p) => p.theme.spacing.md};
  flex-wrap: wrap;
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.radii.sm};
  padding: ${(p) => p.theme.spacing.sm} ${(p) => p.theme.spacing.lg};
  background: ${(p) => p.theme.colors.surface};
  box-shadow: ${(p) => p.theme.shadow.low};
`;

const Main = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(p) => p.theme.spacing.xs};
  min-width: 0;

  strong {
    font-size: ${(p) => p.theme.font.size.md};
    font-weight: ${(p) => p.theme.font.weight.semiBold};
    color: ${(p) => p.theme.colors.text};
    letter-spacing: -0.01em;
  }

  .course {
    font-size: ${(p) => p.theme.font.size.sm};
    color: ${(p) => p.theme.colors.textMuted};
  }
`;

const Meta = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${(p) => p.theme.spacing.xs};
  flex-wrap: wrap;
`;

const Time = styled.span`
  font-size: ${(p) => p.theme.font.size.sm};
  color: ${(p) => p.theme.colors.textMuted};
`;

const Action = styled.button`
  ${buttonVariants.outline};
  height: 32px;
  padding: 0 ${(p) => p.theme.spacing.md};
  font-size: ${(p) => p.theme.font.size.sm};
  border-radius: ${(p) => p.theme.radii.sm};
`;

const RiskBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${(p) => p.theme.spacing.xs};
  padding: 4px ${(p) => p.theme.spacing.sm};
  border-radius: 9999px;
  font-size: ${(p) => p.theme.font.size.sm};
  font-weight: ${(p) => p.theme.font.weight.semiBold};
  border: 1px solid ${(p) => p.theme.colors.borderMuted};
  color: ${(p) => p.theme.colors.text};
  background: ${(p) => p.theme.colors.surfaceAlt};

  &[data-level='RISK'] {
    background: ${(p) => p.theme.colors.dangerSurface};
    color: ${(p) => p.theme.colors.danger};
    border-color: rgba(220, 38, 38, 0.3);
  }

  &[data-level='CAUTION'] {
    background: ${(p) => p.theme.colors.warningSurface};
    color: ${(p) => p.theme.colors.warning};
    border-color: rgba(245, 158, 11, 0.35);
  }
`;

const Reason = styled.span`
  font-size: ${(p) => p.theme.font.size.sm};
  color: ${(p) => p.theme.colors.textMuted};
  max-width: 260px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;
