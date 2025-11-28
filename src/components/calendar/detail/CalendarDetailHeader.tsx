import styled from "styled-components";
import BackButton from "@/components/common/BackButton";
import { SmallBtn as UISmallBtn } from "@/components/common/UI";

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
  grid-template-columns: 1fr auto 1fr;
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
  min-width: 160px;
  text-align: center;
  font-weight: 700;
  font-size: 20px;
  letter-spacing: -0.01em;
  color: ${(p) => p.theme.colors.text};
  padding: 6px 12px;
`;

const NavBackBtn = styled(BackButton)`
  height: 40px;
  padding: 0 16px;
  font-weight: 700;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  &:hover {
    color: #6c5ce7;
  }
  &:focus-visible {
    outline: 2px solid #6c5ce7;
    outline-offset: 2px;
  }
`;

const NavBtn = styled.button`
  width: 40px;
  height: 40px;
  padding: 0;
  font-size: 18px;
  font-weight: 700;
  border-radius: 50%;
  border: none;
  background: transparent;
  color: ${(p) => p.theme.colors.text};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: color 0.15s ease;
  &:hover {
    color: ${(p) => p.theme.colors.text};
    background: transparent;
  }
  &:focus-visible {
    outline: none;
    box-shadow: none;
  }
`;

const TodayBtn = styled(UISmallBtn)`
  height: 40px;
  padding: 0 16px;
  border-radius: 8px;
  font-weight: 700;
  &:hover {
    color: #6c5ce7;
  }
  &:focus-visible {
    outline: 2px solid #6c5ce7;
    outline-offset: 2px;
  }
`;
