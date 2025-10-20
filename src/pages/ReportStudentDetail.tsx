import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { Page, PageHeader, SectionCard } from "@/components/common/UI";
import { getStudent, type Student } from "@/api/students";
import { readableError } from "@/lib/errors";
import { formatPhone, formatKoreanDate } from "@/lib/format";
import { routes, paths } from "@/routes";

type DateRange = { from: string; to: string };

export default function ReportStudentDetail() {
  const { studentId } = useParams();
  const navigate = useNavigate();

  const numericId = useMemo(() => {
    if (!studentId) return null;
    const n = Number(studentId);
    return Number.isFinite(n) ? n : null;
  }, [studentId]);

  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const defaultRange = useMemo<DateRange>(() => {
    const today = new Date();
    const to = today.toISOString().slice(0, 10);
    const monthAgo = new Date(today);
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    const from = monthAgo.toISOString().slice(0, 10);
    return { from, to };
  }, []);

  const [range, setRange] = useState<DateRange>(defaultRange);

  useEffect(() => {
    if (!numericId) return;
    let active = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getStudent(numericId);
        if (!active) return;
        setStudent(data);
      } catch (err) {
        if (!active) return;
        setError(readableError(err, "학생 정보를 불러오지 못했습니다."));
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [numericId]);

  useEffect(() => {
    setRange(defaultRange);
  }, [numericId, defaultRange]);

  const title = student ? `${student.name} 학생 리포트` : loading ? "불러오는 중…" : "학생 정보를 찾을 수 없습니다.";
  const summarySeed = useMemo(() => {
    const period =
      range.from || range.to ? `${range.from || "전체 기간 시작"} ~ ${range.to || "현재"}` : "전체 기간";
    if (student) {
      return `${student.name} 학생의 ${period} 학습 상황을 학생 관점에서 요약해 학부모 상담에 활용합니다. 출결 변화, 참여 수업, 시험·평가 결과를 개인 맞춤으로 정리하고 수업 리포트와 연결할 메모가 있다면 함께 기록하세요.`;
    }
    return "학생별 학습 결과 요약이 여기에 표시됩니다.";
  }, [student, range.from, range.to]);

  return (
    <Page>
      <PageHeader>
        <div>
          <h2>{title}</h2>
          <p>선택한 학생의 리포트 기간과 미리보기를 준비합니다.</p>
        </div>
        <HeaderActions>
          <GhostButton type="button" onClick={() => navigate(paths.report.studentList())}>
            학생 다시 선택
          </GhostButton>
          <PrimaryButton type="button" onClick={() => navigate(routes.report)}>
            리포트 홈
          </PrimaryButton>
        </HeaderActions>
      </PageHeader>

      {error ? <InlineError>{error}</InlineError> : null}

      <SectionCard data-animated="true">
        <PanelHeader>
          <div>
            <PanelTitle>학생 정보</PanelTitle>
            <PanelSubtitle>리포트에 포함될 기본 프로필입니다.</PanelSubtitle>
          </div>
        </PanelHeader>
        {student ? (
          <InfoGrid>
            <InfoRow>
              <InfoLabel>이름</InfoLabel>
              <InfoValue>{student.name}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>연락처</InfoLabel>
              <InfoValue>{formatPhone(student.phoneNumber)}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>등록일</InfoLabel>
              <InfoValue>{student.joinedDate ? formatKoreanDate(student.joinedDate) : "-"}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>현재 상태</InfoLabel>
              <InfoValue>{statusText(student.status)}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>수강 중인 수업</InfoLabel>
              <InfoValue>
                {student.courses && student.courses.length
                  ? student.courses.map((course) => course.title).join(", ")
                  : "등록된 수업이 없습니다."}
              </InfoValue>
            </InfoRow>
          </InfoGrid>
        ) : (
          <InlineHint>학생 정보를 불러오고 있습니다.</InlineHint>
        )}
      </SectionCard>

      <SectionCard data-animated="true">
        <PanelHeader>
          <div>
            <PanelTitle>기간 설정</PanelTitle>
            <PanelSubtitle>리포트에 포함할 상담/수업/시험 기록 범위를 선택하세요.</PanelSubtitle>
          </div>
        </PanelHeader>
        <DateGrid>
          <FieldBlock>
            <FieldLabel htmlFor="student-range-from">시작일</FieldLabel>
            <DateInput
              id="student-range-from"
              type="date"
              value={range.from}
              max={range.to || undefined}
              onChange={(event) => setRange({ ...range, from: event.currentTarget.value })}
            />
          </FieldBlock>
          <FieldBlock>
            <FieldLabel htmlFor="student-range-to">종료일</FieldLabel>
            <DateInput
              id="student-range-to"
              type="date"
              value={range.to}
              min={range.from || undefined}
              onChange={(event) => setRange({ ...range, to: event.currentTarget.value })}
            />
          </FieldBlock>
        </DateGrid>
        <InlineHint>기간을 비워두면 전체 기록을 기준으로 리포트를 준비합니다.</InlineHint>
      </SectionCard>

      <SectionCard data-animated="true">
        <PanelHeader>
          <div>
            <PanelTitle>다음 단계</PanelTitle>
            <PanelSubtitle>리포트 자동 생성 기능은 준비 중입니다.</PanelSubtitle>
          </div>
        </PanelHeader>
        <InlineHint>
          학생 상담 노트와 수업 기록, 시험 결과를 기반으로 한 리포트 자동화 기능을 개발하고 있습니다.
          설정한 기간과 정보는 향후 업데이트에서 바로 활용됩니다.
        </InlineHint>
      </SectionCard>

      <ActionFooter>
        <GhostButton type="button" onClick={() => navigate(paths.report.studentList())}>
          이전
        </GhostButton>
        <PrimaryButton
          type="button"
          onClick={() => {
            if (!numericId) return;
            navigate(paths.report.studentReview(numericId), {
              state: {
                student,
                range,
                summary: summarySeed,
              },
            });
          }}
          disabled={!numericId || loading}
        >
          다음
        </PrimaryButton>
      </ActionFooter>
    </Page>
  );
}

function statusText(status: Student["status"]): string {
  if (status === "ENROLLED") return "수강중";
  if (status === "ON_LEAVE") return "휴학";
  return "대기";
}

const HeaderActions = styled.div`
  display: inline-flex;
  gap: ${(p) => p.theme.spacing.sm};
  flex-wrap: wrap;
  justify-content: flex-end;
`;

const GhostButton = styled.button`
  height: 40px;
  padding: 0 ${(p) => p.theme.spacing.md};
  border-radius: ${(p) => p.theme.radii.md};
  border: 1px solid ${(p) => p.theme.colors.border};
  background: ${(p) => p.theme.colors.surface};
  font-size: ${(p) => p.theme.font.size.sm};
  font-weight: ${(p) => p.theme.font.weight.semiBold};
  cursor: pointer;
  &:hover:not(:disabled) {
    border-color: ${(p) => p.theme.colors.borderStrong};
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const PrimaryButton = styled.button`
  height: 40px;
  padding: 0 ${(p) => p.theme.spacing.lg};
  border-radius: ${(p) => p.theme.radii.md};
  border: 1px solid transparent;
  background: ${(p) => p.theme.colors.primary};
  color: ${(p) => p.theme.colors.textInverted};
  font-size: ${(p) => p.theme.font.size.sm};
  font-weight: ${(p) => p.theme.font.weight.semiBold};
  cursor: pointer;
  &:hover:not(:disabled) {
    background: ${(p) => p.theme.colors.primaryHover};
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const PanelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: ${(p) => p.theme.spacing.md};
  margin-bottom: ${(p) => p.theme.spacing.md};
`;

const PanelTitle = styled.h3`
  margin: 0;
  font-size: ${(p) => p.theme.font.size.xl};
  font-weight: ${(p) => p.theme.font.weight.bold};
  color: ${(p) => p.theme.colors.text};
`;

const PanelSubtitle = styled.p`
  margin: ${(p) => p.theme.spacing.xs} 0 0;
  font-size: ${(p) => p.theme.font.size.sm};
  color: ${(p) => p.theme.colors.textMuted};
`;

const InlineHint = styled.p`
  margin: ${(p) => p.theme.spacing.xs} 0 ${(p) => p.theme.spacing.sm};
  font-size: ${(p) => p.theme.font.size.sm};
  color: ${(p) => p.theme.colors.textMuted};
`;

const InlineError = styled.p`
  margin: ${(p) => p.theme.spacing.xs} 0 ${(p) => p.theme.spacing.sm};
  font-size: ${(p) => p.theme.font.size.sm};
  color: ${(p) => p.theme.colors.danger};
`;

const ActionFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: ${(p) => p.theme.spacing.sm};
  margin-top: ${(p) => p.theme.spacing.xl};
`;

const InfoGrid = styled.div`
  display: grid;
  gap: ${(p) => p.theme.spacing.sm};
`;

const InfoRow = styled.div`
  display: grid;
  gap: ${(p) => p.theme.spacing.xs};
  padding: ${(p) => p.theme.spacing.sm};
  border-radius: ${(p) => p.theme.radii.md};
  background: ${(p) => p.theme.colors.surfaceAlt};
`;

const InfoLabel = styled.span`
  font-size: ${(p) => p.theme.font.size.xs};
  color: ${(p) => p.theme.colors.textMuted};
  letter-spacing: 0.02em;
`;

const InfoValue = styled.span`
  font-size: ${(p) => p.theme.font.size.sm};
  color: ${(p) => p.theme.colors.text};
  line-height: ${(p) => p.theme.font.lineHeight.relaxed};
`;

const DateGrid = styled.div`
  display: grid;
  gap: ${(p) => p.theme.spacing.sm};
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
`;

const FieldBlock = styled.div`
  display: grid;
  gap: ${(p) => p.theme.spacing.xs};
`;

const FieldLabel = styled.label`
  font-size: ${(p) => p.theme.font.size.sm};
  color: ${(p) => p.theme.colors.textMuted};
`;

const DateInput = styled.input`
  height: 40px;
  border: 1px solid ${(p) => p.theme.colors.borderStrong};
  border-radius: ${(p) => p.theme.radii.md};
  padding: 0 ${(p) => p.theme.spacing.sm};
  font-size: ${(p) => p.theme.font.size.md};
  color: ${(p) => p.theme.colors.text};
  transition:
    border-color ${(p) => p.theme.motion.duration.base} ${(p) => p.theme.motion.easing.standard},
    box-shadow ${(p) => p.theme.motion.duration.base} ${(p) => p.theme.motion.easing.standard};
  &:focus {
    outline: none;
    border-color: ${(p) => p.theme.colors.primary};
    box-shadow: ${(p) => p.theme.shadow.focusPrimary};
  }
`;
