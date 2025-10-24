import { Page, PageHeader, SectionCard, TitleH3 } from "@/components/common/UI";
import styled from "styled-components";

export type FeedbackChangelogEntry = {
  date: string;
  items: string[];
};

type FeedbackChangelogPageViewProps = {
  entries: FeedbackChangelogEntry[];
};

export function FeedbackChangelogPageView({ entries }: FeedbackChangelogPageViewProps) {
  return (
    <Page>
      <PageHeader>
        <div>
          <h2>업데이트 안내</h2>
          <p>최근 변경 사항과 개선 내역을 한눈에 확인하세요.</p>
        </div>
        <div />
      </PageHeader>
      {entries.map((entry) => (
        <SectionCard key={entry.date}>
          <TitleH3>{entry.date}</TitleH3>
          <List>
            {entry.items.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </List>
        </SectionCard>
      ))}
    </Page>
  );
}

const List = styled.ul`
  margin: 0;
  padding-left: 18px;
  display: grid;
  gap: 6px;
  li {
    color: #0f172a;
  }
`;
