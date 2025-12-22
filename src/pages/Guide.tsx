import { Page, PageHeader, SectionCard } from "@/components/common/UI";
import styled from "styled-components";

export default function Guide() {
  return (
    <Page>
      <PageHeader>
        <div>
          <h2>가이드</h2>
          <p>자주 쓰는 안내/문서 링크를 모아둘게요.</p>
        </div>
      </PageHeader>

      <SectionCard>
        <NoticeTitle>준비 중</NoticeTitle>
        <NoticeBody>필요한 항목부터 하나씩 추가해볼게요.</NoticeBody>
      </SectionCard>
    </Page>
  );
}

const NoticeTitle = styled.h3`
  margin: 0 0 ${(p) => p.theme.spacing.xs};
  font-size: ${(p) => p.theme.font.size.lg};
  font-weight: 800;
  color: ${(p) => p.theme.colors.text};
`;

const NoticeBody = styled.p`
  margin: 0;
  color: ${(p) => p.theme.colors.textMuted};
  font-size: ${(p) => p.theme.font.size.sm};
  line-height: ${(p) => p.theme.font.lineHeight.relaxed};
`;
