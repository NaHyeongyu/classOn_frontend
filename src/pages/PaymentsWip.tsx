import styled from "styled-components";
import { useMyAcademyPage } from "@/features/myAcademy/hooks/useMyAcademyPage";
import { useNavigate } from "react-router-dom";
import { routes } from "@/routes";

// 결제 관리 페이지는 학부모 결제용입니다.
// 결제 기능이 없는 요금제(무료, Basic 등)에서는 진입을 막고 업그레이드를 안내합니다.
export default function PaymentsWip() {
  const state = useMyAcademyPage();
  const navigate = useNavigate();
  const paymentEnabled = state.academy.paymentEnabled;

  if (!paymentEnabled) {
    return (
      <Center>
        <Card>
          <Title>결제 관리</Title>
          <Subtitle>현재 요금제로 이용할 수 없습니다.</Subtitle>
          <Notice>결제 기능이 포함된 요금제로 업그레이드 후 이용해 주세요.</Notice>
          <UpgradeButton type="button" onClick={() => navigate(routes.myAcademyPlan)}>
            요금제 변경하기
          </UpgradeButton>
        </Card>
      </Center>
    );
  }

  return (
    <Center>
      <Card>
        <Title>결제 관리</Title>
        <Subtitle>학부모 결제 관리 화면은 준비 중입니다.</Subtitle>
        <Notice>현재 학원 요금제/카드 관리는 마이페이지에서 확인해 주세요.</Notice>
      </Card>
    </Center>
  );
}

const Center = styled.div`
  min-height: 60vh;
  display: grid;
  place-items: center;
  padding: 24px;
  background: #f8fafc;
`;

const Card = styled.div`
  max-width: 480px;
  width: 100%;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 24px 20px;
  box-shadow: 0 10px 25px rgba(15, 23, 42, 0.08);
  text-align: center;
`;

const Title = styled.h1`
  margin: 0 0 8px;
  font-size: 20px;
  color: #0f172a;
`;

const Subtitle = styled.p`
  margin: 0 0 10px;
  font-size: 14px;
  color: #475569;
`;

const Notice = styled.p`
  margin: 0;
  font-size: 13px;
  color: #1d4ed8;
  font-weight: 700;
`;

const UpgradeButton = styled.button`
  margin-top: 16px;
  padding: 8px 16px;
  border-radius: 999px;
  border: none;
  background: #4f46e5;
  color: #ffffff;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
`;
