import styled from "styled-components";
import type { CounselItem } from "../../../types/calendarDetail";
import { buttonVariants } from "../../common/UI";

type Props = {
  items: CounselItem[];
  onAdd?: () => void;
  onDetail?: (studentId: number, counselId?: number) => void;
};

export default function CounselList({ items, onAdd, onDetail }: Props) {
  return (
    <Section>
      <SectionHeader>
        <HeaderLeft>
          <SectionIcon aria-hidden>{chatIcon}</SectionIcon>
          <h4>상담 일정</h4>
        </HeaderLeft>
        <Actions>
          {onAdd ? (
            <ActionBtn type="button" onClick={onAdd}>+ 상담 추가</ActionBtn>
          ) : null}
        </Actions>
      </SectionHeader>
      <Grid>
        {items.map((c, i) => (
          <ItemCard key={`cs-${i}`}>
            <ItemHeader>
              <div className="left">
                <strong>{c.with || '학생'}</strong>
              </div>
              <div className="right">
                <Time>{c.time}</Time>
                {onDetail && c.studentId ? (
                  <ActionBtn type="button" onClick={() => onDetail(c.studentId!, c.id)}>상세</ActionBtn>
                ) : null}
              </div>
            </ItemHeader>
            <ContentSmall>{(c.title || '').trim() || '내용 없음'}</ContentSmall>
          </ItemCard>
        ))}
      </Grid>
    </Section>
  );
}

const Section = styled.section`
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 12px;
  background: #fff;
  display: flex;
  flex-direction: column;
  height: 100%; /* fill half container */
  min-height: 0; /* allow Grid to scroll */
`;
const SectionHeader = styled.div`
  display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;
  h4 { margin: 0; font-size: 15px; color: #111827; }
`;
const HeaderLeft = styled.div`
  display: flex; align-items: center; gap: 8px;
`;
const SectionIcon = styled.span`
  width: 28px; height: 28px; border-radius: 8px; display: grid; place-items: center; background: #f3f4f6; color: #4f46e5;
`;
const Actions = styled.div``;
const ActionBtn = styled.button`
  ${buttonVariants.outline};
  height: 40px;
  padding: 0 16px;
  font-size: 14px;
  font-weight: 600;
`;
const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
  padding: 4px 2px;
  overflow: auto; /* scroll within fixed half */
  flex: 1 1 auto;
  min-height: 0;
  align-content: start; /* avoid vertical stretching when few items */
  align-items: start;
  grid-auto-rows: max-content;
`;
const ItemCard = styled.div`
  border: 1px solid #e5e7eb; border-radius: 12px; padding: 12px; background: #fff;
`;
const ItemHeader = styled.div`
  display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;
  .right { display:inline-flex; align-items:center; gap:8px; }
`;
const ContentSmall = styled.div` color:#374151; font-size:13px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; `;
// meta rows removed per updated UI
const Time = styled.span`
  color: #6b7280; font-size: 12px; font-weight: 700;
`;

const chatIcon = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a4 4 0 0 1-4 4H7l-4 4V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
  </svg>
);
