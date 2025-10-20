import { Page, PageHeader, SectionCard } from "@/components/common/UI";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { routes } from "@/routes";

export default function Report() {
  const navigate = useNavigate();
  return (
    <Page>
      <PageHeader>
        <div>
          <h2>리포트</h2>
          <p>수업별 혹은 학생별 리포트를 빠르게 시작하세요.</p>
        </div>
      </PageHeader>

      <SectionCard data-animated="true">
        <SectionTitle>어떤 리포트를 준비할까요?</SectionTitle>
        <SectionDescription>
          필요한 리포트 유형을 선택하면 다음 화면에서 세부 정보를 이어서 설정할 수 있어요.
        </SectionDescription>
        <SelectionGrid>
          <SelectionCard
            type="button"
            onClick={() => navigate(routes.reportCourse)}
          >
            <CardTitle>수업 리포트</CardTitle>
            <CardMeta>수업 전체 학생을 포함한 리포트</CardMeta>
            <CardDesc>
              수업별 진행 현황과 출결, 시험 요약을 모아 학부모나 내부 공유용 리포트를 준비합니다.
            </CardDesc>
          </SelectionCard>
          <SelectionCard
            type="button"
            onClick={() => navigate(routes.reportStudent)}
          >
            <CardTitle>학생 개별 리포트</CardTitle>
            <CardMeta>학생 한 명에 집중한 리포트</CardMeta>
            <CardDesc>
              상담 기록과 수업, 시험 참석 내역을 정리해 학부모 소통용 또는 내부 기록용 리포트를 만듭니다.
            </CardDesc>
          </SelectionCard>
        </SelectionGrid>
      </SectionCard>
    </Page>
  );
}

const SectionTitle = styled.h3`
  margin: 0 0 ${(p) => p.theme.spacing.xs};
  font-size: ${(p) => p.theme.font.size.xl};
  font-weight: ${(p) => p.theme.font.weight.bold};
  letter-spacing: -0.01em;
  color: ${(p) => p.theme.colors.text};
`;

const SectionDescription = styled.p`
  margin: 0 0 ${(p) => p.theme.spacing.lg};
  font-size: ${(p) => p.theme.font.size.sm};
  line-height: ${(p) => p.theme.font.lineHeight.relaxed};
  color: ${(p) => p.theme.colors.textMuted};
`;

const SelectionGrid = styled.div`
  display: grid;
  gap: ${(p) => p.theme.spacing.lg};
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
`;

const SelectionCard = styled.button`
  display: grid;
  gap: ${(p) => p.theme.spacing.sm};
  padding: ${(p) => p.theme.spacing.xl};
  border-radius: ${(p) => p.theme.radii.xl};
  border: 1px solid ${(p) => p.theme.colors.border};
  background: ${(p) => p.theme.colors.surface};
  text-align: left;
  cursor: pointer;
  transition:
    border-color ${(p) => p.theme.motion.duration.base} ${(p) => p.theme.motion.easing.standard},
    box-shadow ${(p) => p.theme.motion.duration.base} ${(p) => p.theme.motion.easing.standard},
    transform ${(p) => p.theme.motion.duration.short} ${(p) => p.theme.motion.easing.standard},
    background ${(p) => p.theme.motion.duration.base} ${(p) => p.theme.motion.easing.standard};
  &:hover {
    border-color: ${(p) => p.theme.colors.borderStrong};
    transform: translateY(-2px);
    box-shadow: ${(p) => p.theme.shadow.medium};
  }
`;

const CardTitle = styled.span`
  font-size: ${(p) => p.theme.font.size.lg};
  font-weight: ${(p) => p.theme.font.weight.bold};
  color: ${(p) => p.theme.colors.text};
`;

const CardMeta = styled.span`
  font-size: ${(p) => p.theme.font.size.sm};
  font-weight: ${(p) => p.theme.font.weight.semiBold};
  color: ${(p) => p.theme.colors.primary};
`;

const CardDesc = styled.span`
  font-size: ${(p) => p.theme.font.size.sm};
  line-height: ${(p) => p.theme.font.lineHeight.relaxed};
  color: ${(p) => p.theme.colors.textMuted};
`;
