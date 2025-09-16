import styled from "styled-components";

type Props = {
  label: string;
  onBack: () => void;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
};

export default function CalendarDetailHeader({ label, onBack, onPrev, onNext, onToday }: Props) {
  return (
    <TopBar>
      <BackBtn type="button" onClick={onBack}>← 돌아가기</BackBtn>
      <TopCenter>
        <NavBtn onClick={onPrev} aria-label="이전 날짜">‹</NavBtn>
        <DateLabel>{label}</DateLabel>
        <NavBtn onClick={onNext} aria-label="다음 날짜">›</NavBtn>
      </TopCenter>
      <TodayBtn type="button" onClick={onToday}>오늘</TodayBtn>
    </TopBar>
  );
}

const TopBar = styled.div`
  display: flex; align-items: center; justify-content: space-between; gap: 10px;
`;
const TopCenter = styled.div`
  display: flex; align-items: center; gap: 8px;
`;
const DateLabel = styled.div`
  font-weight: 800; color: #111827;
`;
const BackBtn = styled.button`
  height: 36px; padding: 0 12px; border-radius: 10px; border: 1px solid #e5e7eb; background: #fff; color: #374151; cursor: pointer;
  &:hover { background: #f9fafb; }
`;
const NavBtn = styled.button`
  width: 32px; height: 32px; border-radius: 8px; border: 1px solid #e5e7eb; background: #fff; color: #374151; cursor: pointer;
  &:hover { background: #f3f4f6; }
`;
const TodayBtn = styled.button`
  height: 36px; padding: 0 12px; border-radius: 10px; border: none; background: #4f46e5; color: #fff; font-weight: 700; cursor: pointer;
`;

