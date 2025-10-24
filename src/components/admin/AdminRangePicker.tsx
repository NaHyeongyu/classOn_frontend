import styled from "styled-components";

type Props = {
  from: string;
  to: string;
  onChangeFrom: (value: string) => void;
  onChangeTo: (value: string) => void;
  loginsInRange: number | null;
};

export function AdminRangePicker({
  from,
  to,
  onChangeFrom,
  onChangeTo,
  loginsInRange,
}: Props) {
  return (
    <RangeCard>
      <LabelRow>
        <span className="label">기간</span>
        <RangeInputs>
          <Input type="date" lang="ko-KR" value={from} onChange={(e) => onChangeFrom(e.target.value)} />
          <span>~</span>
          <Input type="date" lang="ko-KR" value={to} onChange={(e) => onChangeTo(e.target.value)} />
          {loginsInRange != null ? (
            <RangeInfo>
              선택 기간 로그인 수: <b>{loginsInRange.toLocaleString("ko-KR")}</b>
            </RangeInfo>
          ) : null}
        </RangeInputs>
      </LabelRow>
      <Hint>아래 학원 목록의 통계 범위가 위 기간에 맞춰 적용됩니다.</Hint>
    </RangeCard>
  );
}

const RangeCard = styled.div`
  display: grid;
  gap: 8px;
`;

const LabelRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
  .label {
    color: #6b7280;
    font-size: 12px;
    font-weight: 700;
  }
`;

const RangeInputs = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
`;

const Input = styled.input`
  height: 40px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 0 12px;
  font-size: 14px;
  background: #fff;
  color: #0f172a;
`;

const RangeInfo = styled.span`
  color: #334155;
  font-size: 12px;
`;

const Hint = styled.p`
  margin: 0;
  color: #6b7280;
  font-size: 12px;
`;
