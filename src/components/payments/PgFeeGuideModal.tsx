import Modal from "@/components/common/Modal";
import styled from "styled-components";

type Props = {
  open: boolean;
  onClose: () => void;
  effectiveFrom?: string;
};

export function PgFeeGuideModal({ open, onClose, effectiveFrom = "2025-11-10" }: Props) {
  return (
    <Modal open={open} onClose={onClose} title="PG 수수료 안내" maxWidth={860}>
      <Notice>
        <ul>
          <li>수수료는 토스페이먼츠(PG) 결제 처리 수수료이며, 각 결제서비스 이용 여부와 무관합니다.</li>
          <li>수수료율/금액 표기는 부가세 포함 기준입니다.</li>
          <li>수수료 계산 시 1원 미만은 절사됩니다.</li>
        </ul>
      </Notice>

      <MetaRow>
        <span className="label">적용일</span>
        <span className="value">{effectiveFrom}~</span>
      </MetaRow>

      <Section>
        <h4>신용·체크카드</h4>
        <Table>
          <thead>
            <tr>
              <th>구분</th>
              <th>기본</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>전체</td>
              <td>3.4%</td>
            </tr>
          </tbody>
        </Table>
      </Section>

      <Section>
        <h4>간편결제</h4>
        <Table>
          <thead>
            <tr>
              <th>결제서비스</th>
              <th>카드</th>
              <th>포인트/머니</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>토스페이</td>
              <td>3.4%</td>
              <td>3.4%</td>
            </tr>
            <tr>
              <td>카카오페이</td>
              <td>3.4%</td>
              <td>3.4%</td>
            </tr>
            <tr>
              <td>삼성페이</td>
              <td>3.7%</td>
              <td>-</td>
            </tr>
            <tr>
              <td>네이버페이</td>
              <td>3.5%</td>
              <td>3.5%</td>
            </tr>
          </tbody>
        </Table>
        <SubNote>별도 설정되지 않은 간편결제 수수료는 신용·체크카드 수수료를 따라갑니다.</SubNote>
      </Section>

      <Section>
        <h4>신용·체크카드 무이자 할부</h4>
        <Table>
          <thead>
            <tr>
              <th>개월</th>
              <th>수수료</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>전체</td><td>-</td></tr>
            <tr><td>2개월</td><td>2.08%</td></tr>
            <tr><td>3개월</td><td>3.36%</td></tr>
            <tr><td>4개월</td><td>4.34%</td></tr>
            <tr><td>5개월</td><td>5.2%</td></tr>
            <tr><td>6개월</td><td>6.16%</td></tr>
            <tr><td>7개월</td><td>7.04%</td></tr>
            <tr><td>8개월</td><td>7.92%</td></tr>
            <tr><td>9개월</td><td>8.8%</td></tr>
            <tr><td>10개월</td><td>9.94%</td></tr>
            <tr><td>11개월</td><td>10.86%</td></tr>
            <tr><td>12개월</td><td>11.76%</td></tr>
          </tbody>
        </Table>
      </Section>

      <Section>
        <h4>다른 결제서비스</h4>
        <Table>
          <thead>
            <tr>
              <th>결제수단</th>
              <th>기본</th>
              <th>취소</th>
              <th>에스크로</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>계좌이체</td>
              <td>2% (최소 200원~)</td>
              <td>2% (최소 200원~)</td>
              <td>0.2% (최소 200원~)</td>
            </tr>
            <tr>
              <td>가상계좌</td>
              <td>400원</td>
              <td>-</td>
              <td>200원</td>
            </tr>
          </tbody>
        </Table>
      </Section>

      <Footnote>
        실제 수수료는 토스페이먼츠 계약 조건/정책에 따라 변경될 수 있습니다.
      </Footnote>
    </Modal>
  );
}

const Notice = styled.div`
  border: 1px solid ${(p) => p.theme.colors.border};
  background: ${(p) => p.theme.colors.surfaceMuted};
  border-radius: ${(p) => p.theme.radii.md};
  padding: 12px 14px;
  margin-bottom: 14px;
  ul {
    margin: 0;
    padding-left: 18px;
    color: ${(p) => p.theme.colors.text};
    font-size: 14px;
    line-height: 1.6;
  }
`;

const MetaRow = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  padding: 10px 0 16px;
  border-bottom: 1px solid ${(p) => p.theme.colors.borderMuted};
  margin-bottom: 16px;
  .label {
    font-size: 12px;
    color: ${(p) => p.theme.colors.textMuted};
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }
  .value {
    font-size: 13px;
    color: ${(p) => p.theme.colors.text};
    font-weight: 700;
  }
`;

const Section = styled.section`
  margin-bottom: 18px;
  h4 {
    margin: 0 0 10px 0;
    font-size: 15px;
    font-weight: 800;
    color: ${(p) => p.theme.colors.text};
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.radii.md};
  overflow: hidden;

  th,
  td {
    padding: 10px 12px;
    border-bottom: 1px solid ${(p) => p.theme.colors.borderMuted};
    font-size: 13px;
    color: ${(p) => p.theme.colors.text};
    text-align: left;
    vertical-align: top;
    white-space: nowrap;
  }
  th {
    background: ${(p) => p.theme.colors.surfaceAlt};
    font-weight: 800;
  }
  tr:last-child td {
    border-bottom: none;
  }

  @media (max-width: 640px) {
    th,
    td {
      white-space: normal;
    }
  }
`;

const SubNote = styled.div`
  margin-top: 10px;
  font-size: 12px;
  color: ${(p) => p.theme.colors.textMuted};
`;

const Footnote = styled.div`
  margin-top: 4px;
  font-size: 12px;
  color: ${(p) => p.theme.colors.textMuted};
`;

