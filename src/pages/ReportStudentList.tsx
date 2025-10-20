import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { Page, PageHeader, SectionCard } from "@/components/common/UI";
import { useNavigate } from "react-router-dom";
import { routes, paths } from "@/routes";
import { listStudents, type Student } from "@/api/students";
import { readableError } from "@/lib/errors";
import { formatPhone } from "@/lib/format";

export default function ReportStudentList() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [students, setStudents] = useState<Student[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    const timer = window.setTimeout(() => {
      (async () => {
        try {
          const page = await listStudents({
            q: query.trim() || undefined,
            status: "ENROLLED",
            size: 40,
          });
          if (!active) return;
          setStudents(page.content ?? []);
          setTotal(page.totalElements ?? 0);
        } catch (err) {
          if (!active) return;
          setStudents([]);
          setTotal(0);
          setError(readableError(err, "학생 목록을 불러오지 못했습니다."));
        } finally {
          if (active) setLoading(false);
        }
      })();
    }, 250);
    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [query]);

  const subtitle = useMemo(() => {
    if (loading) return "학생 목록을 불러오는 중입니다…";
    if (error) return error;
    return `총 ${total.toLocaleString()}명`;
  }, [loading, error, total]);

  function handleSelect(student: Student) {
    navigate(paths.report.studentDetail(student.id));
  }

  return (
    <Page>
      <PageHeader>
        <div>
          <h2>학생 리포트</h2>
          <p>리포트를 만들 학생을 선택하세요.</p>
        </div>
        <HeaderActions>
          <BackButton type="button" onClick={() => navigate(routes.report)}>
            리포트 홈으로
          </BackButton>
        </HeaderActions>
      </PageHeader>

      <SectionCard data-animated="true">
        <PanelHeader>
          <div>
            <PanelTitle>학생 선택</PanelTitle>
            <PanelSubtitle>학생별 상세 리포트는 다음 단계에서 설정합니다.</PanelSubtitle>
          </div>
          <PanelMeta>{subtitle}</PanelMeta>
        </PanelHeader>

        <SearchField>
          <SearchInput
            id="student-search"
            placeholder="학생 이름 또는 연락처로 검색하세요"
            aria-label="학생 검색"
            value={query}
            onChange={(event) => setQuery(event.currentTarget.value)}
          />
        </SearchField>

        {error ? <InlineError>{error}</InlineError> : null}
        {!loading && !error && students.length === 0 ? (
          <InlineHint>조건에 맞는 학생이 없습니다.</InlineHint>
        ) : null}

        <StudentList>
          {students.map((student) => (
            <StudentButton
              key={student.id}
              type="button"
              onClick={() => handleSelect(student)}
            >
              <strong>{student.name}</strong>
              <span>{student.phoneNumber ? formatPhone(student.phoneNumber) : "연락처 없음"}</span>
              {student.courses && student.courses.length ? (
                <MetaText>{`${student.courses.length}개 수업 수강 중`}</MetaText>
              ) : null}
            </StudentButton>
          ))}
        </StudentList>
      </SectionCard>
    </Page>
  );
}

const HeaderActions = styled.div`
  display: inline-flex;
  gap: ${(p) => p.theme.spacing.sm};
  align-items: center;
`;

const BackButton = styled.button`
  height: 40px;
  padding: 0 ${(p) => p.theme.spacing.md};
  border-radius: ${(p) => p.theme.radii.md};
  border: 1px solid ${(p) => p.theme.colors.border};
  background: ${(p) => p.theme.colors.surface};
  font-size: ${(p) => p.theme.font.size.sm};
  font-weight: ${(p) => p.theme.font.weight.semiBold};
  cursor: pointer;
  &:hover {
    border-color: ${(p) => p.theme.colors.borderStrong};
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

const PanelMeta = styled.span`
  font-size: ${(p) => p.theme.font.size.sm};
  color: ${(p) => p.theme.colors.textMuted};
`;

const SearchField = styled.div`
  margin-bottom: ${(p) => p.theme.spacing.sm};
`;

const SearchInput = styled.input`
  width: 100%;
  height: 40px;
  border-radius: ${(p) => p.theme.radii.md};
  border: 1px solid ${(p) => p.theme.colors.borderStrong};
  padding: 0 ${(p) => p.theme.spacing.sm};
  font-size: ${(p) => p.theme.font.size.md};
  transition:
    border-color ${(p) => p.theme.motion.duration.base} ${(p) => p.theme.motion.easing.standard},
    box-shadow ${(p) => p.theme.motion.duration.base} ${(p) => p.theme.motion.easing.standard};
  &:focus {
    outline: none;
    border-color: ${(p) => p.theme.colors.primary};
    box-shadow: ${(p) => p.theme.shadow.focusPrimary};
  }
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

const StudentList = styled.div`
  display: grid;
  gap: ${(p) => p.theme.spacing.sm};
  margin-top: ${(p) => p.theme.spacing.sm};
`;

const StudentButton = styled.button`
  display: grid;
  gap: ${(p) => p.theme.spacing.xs};
  padding: ${(p) => p.theme.spacing.md};
  border-radius: ${(p) => p.theme.radii.md};
  border: 1px solid ${(p) => p.theme.colors.border};
  background: ${(p) => p.theme.colors.surface};
  text-align: left;
  cursor: pointer;
  transition:
    border-color ${(p) => p.theme.motion.duration.base} ${(p) => p.theme.motion.easing.standard},
    box-shadow ${(p) => p.theme.motion.duration.base} ${(p) => p.theme.motion.easing.standard},
    transform ${(p) => p.theme.motion.duration.short} ${(p) => p.theme.motion.easing.standard};
  strong {
    font-size: ${(p) => p.theme.font.size.md};
    font-weight: ${(p) => p.theme.font.weight.semiBold};
    color: ${(p) => p.theme.colors.text};
  }
  span {
    font-size: ${(p) => p.theme.font.size.sm};
    color: ${(p) => p.theme.colors.textMuted};
  }
  &:hover {
    border-color: ${(p) => p.theme.colors.borderStrong};
    box-shadow: ${(p) => p.theme.shadow.medium};
    transform: translateY(-2px);
  }
`;

const MetaText = styled.small`
  font-size: ${(p) => p.theme.font.size.sm};
  color: ${(p) => p.theme.colors.primary};
  font-style: normal;
`;
