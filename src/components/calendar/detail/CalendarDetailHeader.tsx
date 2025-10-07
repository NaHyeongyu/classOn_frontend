import styled from "styled-components";
import BackButton from "@/components/common/BackButton";

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
      <LeftWrap>
        <NavBackBtn label="돌아가기" onClick={onBack} />
      </LeftWrap>
      <CenterWrap>
        <NavBtn onClick={onPrev} aria-label="이전 날짜">{'<'}</NavBtn>
        <DateBadge>{label}</DateBadge>
        <NavBtn onClick={onNext} aria-label="다음 날짜">{'>'}</NavBtn>
      </CenterWrap>
      <RightWrap>
        <TodayBtn type="button" onClick={onToday}>오늘</TodayBtn>
      </RightWrap>
    </TopBar>
  );
}

const TopBar = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 12px;
  padding-bottom: 12px;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    justify-items: center;
    text-align: center;
  }
`;

const LeftWrap = styled.div`
  display: flex;
  @media (max-width: 768px) {
    order: 2;
  }
`;

const CenterWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

const RightWrap = styled.div`
  display: flex;
  justify-content: flex-end;
  @media (max-width: 768px) {
    justify-content: center;
    order: 3;
  }
`;

const DateBadge = styled.span`
  min-width: 150px;
  text-align: center;
  font-weight: 600;
  font-size: 25px;
  letter-spacing: -0.01em;
  color: #111827;
  padding: 6px 12px;
`;

const NavBackBtn = styled(BackButton)`
  button {
    appearance: none;
    background: transparent;
    border: none;
    color: #111827;
    font-size: 14px;
    font-weight: 600;
    padding: 0;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
  }
  button:hover { color: #1f2937; }
  button:focus-visible { outline: 2px solid #111827; border-radius: 10px; outline-offset: 2px; }
`;

const NavBtn = styled.button`
  appearance: none;
  width: 30px;
  height: 30px;
  border: none;
  background: transparent;
  color: #111827;
  font-size: 18px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  &:hover { color: #1f2937; }
  &:active { transform: translateY(1px); }
  &:focus-visible { outline: 2px solid #111827; border-radius: 12px; outline-offset: 2px; }
`;

const TodayBtn = styled.button`
  appearance: none;
  height: 36px;
  padding: 0 14px;
  border-radius: 12px;
  border: 1px solid #4f46e5;
  background: transparent;
  color: #4f46e5;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease;
  &:hover { background: rgba(79, 70, 229, 0.08); }
  &:active { background: rgba(79, 70, 229, 0.16); transform: translateY(1px); }
  &:focus-visible { outline: 2px solid #4f46e5; border-radius: 12px; outline-offset: 2px; }
`;
