import type { StudentAttendance } from "@/api/students";
import type { Counsel } from "@/api/counsels";

export type RiskLevel = 'LOW' | 'CAUTION' | 'RISK';

export type RiskMetrics = {
  attRate30: number | null;
  totalSessions30: number;
  absences30: number;
  lastAbsentDays?: number | null;
  negativeCounselCount30: number;
};

export type RiskResult = {
  level: RiskLevel;
  metrics: RiskMetrics;
  reasons: string[];
};

const NEGATIVE_KEYWORDS = [
  '지각', '결석', '무단', '집중', '주의', '경고', '낙제', '미제출', '과제 미제출',
  '태도', '불참', '늦음', '지속', '하락', '학습 저하', '동기 저하'
];

function daysBetween(a: Date, b: Date) {
  const ms = Math.abs(+a - +b);
  return Math.floor(ms / (1000 * 60 * 60 * 24));
}

export function calcRisk(
  attendance: StudentAttendance[],
  counsels: Counsel[],
  options?: { days?: number }
): RiskResult {
  const windowDays = options?.days ?? 30;
  const now = new Date();
  const since = new Date(now);
  since.setDate(since.getDate() - windowDays);

  // Filter attendances within window
  const attWin = attendance.filter(a => {
    try { return new Date(a.date) >= since; } catch { return false; }
  });
  const totalSessions30 = attWin.length;
  const presentCount = attWin.filter(a => !!a.present).length;
  const absences30 = totalSessions30 - presentCount;
  const attRate30 = totalSessions30 > 0 ? presentCount / totalSessions30 : null;

  // Find last absent days ago
  let lastAbsentDays: number | null | undefined = null;
  const latestAbsent = attWin.filter(a => !a.present).sort((a,b) => (a.date < b.date ? 1 : -1))[0];
  if (latestAbsent) {
    try { lastAbsentDays = daysBetween(now, new Date(latestAbsent.date)); } catch { lastAbsentDays = null; }
  }

  // Counsel negativity (simple keyword scan) within window
  const negativeCounselCount30 = (counsels || []).filter(c => {
    try {
      if (new Date(c.counselTime) < since) return false;
      const text = (c.content || '').toLowerCase();
      return NEGATIVE_KEYWORDS.some(k => text.includes(k.toLowerCase()));
    } catch { return false; }
  }).length;

  // Heuristic risk rules
  const reasons: string[] = [];
  let level: RiskLevel = 'LOW';
  if (attRate30 != null) {
    if (attRate30 < 0.6) { level = 'RISK'; reasons.push('최근 출석률 60% 미만'); }
    else if (attRate30 < 0.8) { level = level === 'RISK' ? 'RISK' : 'CAUTION'; reasons.push('최근 출석률 80% 미만'); }
  } else {
    reasons.push('최근 30일 출석 데이터 없음');
  }
  if (absences30 >= 2) { level = 'RISK'; reasons.push(`최근 30일 결석 ${absences30}회`); }
  if (negativeCounselCount30 >= 2) { level = 'RISK'; reasons.push('상담 메모 부정 신호 다수'); }
  else if (negativeCounselCount30 >= 1) { level = level === 'RISK' ? 'RISK' : 'CAUTION'; reasons.push('상담 메모 부정 신호'); }

  const metrics: RiskMetrics = { attRate30: attRate30 != null ? Math.round(attRate30 * 100) : null, totalSessions30, absences30, lastAbsentDays, negativeCounselCount30 };
  return { level, metrics, reasons };
}

export function recommendActions(res: RiskResult): string[] {
  const out: string[] = [];
  if (res.level === 'RISK') {
    out.push('1:1 상담을 예약하고 보호자와 공유하세요.');
    out.push('주 2회 보강 수업을 2주간 배정하세요.');
    out.push('과제 체크리스트를 도입하고 주간 점검을 설정하세요.');
  } else if (res.level === 'CAUTION') {
    out.push('다음 주 학습 계획을 간단히 점검하세요.');
    out.push('출결/과제 알림을 일시 강화하세요.');
    out.push('짧은 전화 상담을 제안하세요.');
  } else {
    out.push('양호합니다. 현재 루틴을 유지하세요.');
  }
  return out;
}

