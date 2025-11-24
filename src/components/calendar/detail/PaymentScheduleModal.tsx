import { useEffect, useState } from "react";
import Modal from "@/components/common/Modal";
import { PrimaryButton, GhostButton } from "@/components/common/UI";
import styled from "styled-components";

const OPTIONS = [7, 14, 21, 28];

type Props = {
  open: boolean;
  initialDays?: number | null;
  saving?: boolean;
  onClose: () => void;
  onSave: (days: number) => void;
};

export function PaymentScheduleModal({ open, initialDays = 7, saving, onClose, onSave }: Props) {
  const [selected, setSelected] = useState(initialDays);

  useEffect(() => {
    if (open) {
      setSelected(initialDays ?? OPTIONS[0]);
    }
  }, [open, initialDays]);

  return (
    <Modal open={open} onClose={onClose} title="결제 알림 주기 설정" maxWidth={420}>
      <Wrapper>
        <p>결제 예정일 전에 알림 받고 싶은 주기를 선택하세요. 선택한 기간 동안 결제 예정일이 있는 미납 학생이 표시됩니다.</p>
        <Options role="radiogroup" aria-label="알림 주기">
          {OPTIONS.map((days) => (
            <label key={days}>
              <input
                type="radio"
                name="payment-reminder-period"
                checked={selected === days}
                onChange={() => setSelected(days)}
              />
              <span>{days / 7}주일</span>
            </label>
          ))}
        </Options>
        <Actions>
          <GhostButton type="button" onClick={onClose}>
            취소
          </GhostButton>
          <PrimaryButton
            type="button"
            disabled={saving}
            onClick={() => {
              onSave(selected || OPTIONS[0]);
              onClose();
            }}
          >
            저장
          </PrimaryButton>
        </Actions>
      </Wrapper>
    </Modal>
  );
}

const Wrapper = styled.div`
  display: grid;
  gap: 16px;
  p {
    margin: 0;
    font-size: 14px;
    color: ${(p) => p.theme.colors.text};
  }
`;

const Options = styled.div`
  display: grid;
  gap: 12px;
  label {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 14px;
    padding: 10px 12px;
    border: 1px solid ${(p) => p.theme.colors.border};
    border-radius: ${(p) => p.theme.radii.md};
    cursor: pointer;
    input {
      margin: 0;
    }
    span {
      font-weight: 600;
      color: ${(p) => p.theme.colors.text};
    }
  }
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`;
