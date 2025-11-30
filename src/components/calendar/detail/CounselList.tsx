import styled from "styled-components";
import type { CounselItem } from "../../../types/calendarDetail";
import { PrimaryButtonSm } from "../../common/UI";

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
            <AddBtn type="button" onClick={onAdd}>+ 상담 추가</AddBtn>
          ) : null}
        </Actions>
      </SectionHeader>
      <Grid>
        {items.map((c, i) => (
          <ItemCard 
            key={`cs-${i}`}
            onClick={() => {
              if (onDetail && c.studentId) {
                onDetail(c.studentId, c.id);
              }
            }}
            style={{ cursor: onDetail && c.studentId ? 'pointer' : 'default' }}
          >
            <ItemHeader>
              <div className="left">
                <strong>{c.with || '학생'}</strong>
              </div>
              <div className="right">
                <Time>{c.time}</Time>
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
  border: 1px solid #e5e7eb; border-radius: 16px; padding: 12px; background: #fff; display: flex; flex-direction: column;
  height: 100%;
  min-height: 0;
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
const AddBtn = styled(PrimaryButtonSm)``;
const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
  padding: 4px 2px;
  flex: 1 1 auto;
  min-height: 0;
  align-content: start; /* avoid vertical stretching when few items */
  align-items: start;
  grid-auto-rows: max-content;
  overflow: auto;
`;
const ItemCard = styled.div`
  border: 1px solid #e5e7eb; border-radius: 12px; padding: 12px; background: #fff;
  display: flex; flex-direction: column; gap: 4px;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
  &:hover { 
    transform: translateY(-2px); 
    box-shadow: 0 4px 12px rgba(0,0,0,0.08); 
  }

  strong {
    font-size: ${(p) => p.theme.font.size.md}; /* 14px */
    font-weight: ${(p) => p.theme.font.weight.semiBold};
    color: ${(p) => p.theme.colors.text};
    letter-spacing: -0.01em;
  }
  span {
    font-size: ${(p) => p.theme.font.size.sm}; /* 13px */
    color: ${(p) => p.theme.colors.textMuted};
  }
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
