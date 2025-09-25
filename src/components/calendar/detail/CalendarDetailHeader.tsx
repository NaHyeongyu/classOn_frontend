import styled from "styled-components";
import { buttonVariants } from "../../common/UI";

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
  ${buttonVariants.outline};
  height: 36px;
  padding: 0 14px;
  font-weight: 600;
`;
const NavBtn = styled.button`
  ${buttonVariants.outline};
  width: 34px;
  height: 34px;
  padding: 0;
  font-weight: 700;
  font-size: 18px;
`;
const TodayBtn = styled.button`
  ${buttonVariants.primary};
  height: 40px;
  padding: 0 18px;
  font-weight: 600;
`;
