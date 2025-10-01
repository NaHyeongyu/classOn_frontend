import styled from "styled-components";
import { SmallBtn as UISmallBtn } from "../common/UI";

type Props = {
  title?: string | null;
  label: string;
  onPrev: () => void;
  onNext: () => void;
  onToday?: () => void;
};

export default function CalendarHeader({
  title = "월별 캘린더",
  label,
  onPrev,
  onNext,
  onToday,
}: Props) {
  const showTitle = Boolean(title && title.trim().length);
  return (
    <Header>
      {showTitle ? (
        <HeaderLeft>
          <HeaderIcon aria-hidden>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </HeaderIcon>
          <h3>{title}</h3>
        </HeaderLeft>
      ) : null}
      <HeaderRight>
        <NavBtn onClick={onPrev} aria-label="이전 달">
          ‹
        </NavBtn>
        <MonthLabel>{label}</MonthLabel>
        <NavBtn onClick={onNext} aria-label="다음 달">
          ›
        </NavBtn>
        {onToday ? <TodayBtn onClick={onToday}>오늘</TodayBtn> : null}
      </HeaderRight>
    </Header>
  );
}

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 8px 12px;
`;
const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  h3 {
    margin: 0;
    font-size: 16px;
    color: #111827;
  }
`;
const HeaderIcon = styled.span`
  width: 28px;
  height: 28px;
  border-radius: 8px;
  display: grid;
  place-items: center;
  color: #4f46e5;
  background: #eef2ff;
`;
const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
`;
const MonthLabel = styled.div`
  font-weight: 700;
  color: #111827;
  min-width: 140px;
  text-align: center;
`;
const NavBtn = styled(UISmallBtn)`
  width: 40px;
  height: 40px;
  padding: 0;
  font-size: 18px;
  font-weight: 700;
`;
const TodayBtn = styled(UISmallBtn)`
  height: 40px;
  padding: 0 16px;
  font-weight: 700;
`;
