import styled from "styled-components";

export default function ReportWip() {
  return (
    <Center>
      <div>
        <MainText>개발중에 있습니다.</MainText>
        <DescText>입력한 정보를 토대로 학생 리포트를 편리하게 작성하는 기능입니다.</DescText>
        <SubText>10월 20일 출시 예정</SubText>
      </div>
    </Center>
  );
}

const Center = styled.div`
  min-height: 60vh;
  display: grid;
  align-items: center;
  place-items: center;
  color: #111827;
  text-align: center;
`;

const MainText = styled.div`
  font-size: 18px;
  font-weight: 700;
`;

const DescText = styled.div`
  margin-top: 6px;
  font-size: 14px;
  color: #374151;
`;

const SubText = styled.div`
  margin-top: 8px;
  font-size: 14px;
  color: #6b7280;
`;
