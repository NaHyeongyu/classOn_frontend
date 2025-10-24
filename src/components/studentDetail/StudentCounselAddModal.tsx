import Modal from "@/components/common/Modal";
import SelectBox from "@/components/common/SelectBox";
import {
  Input,
  Label,
  TextArea,
  TimeRow,
  TimeSelect,
} from "@/components/studentDetail/StudentDetailStyles";
import {
  GhostButton as UIGhostButton,
  PrimaryButton as UIPrimaryButton,
} from "@/components/common/UI";
import styled from "styled-components";
import type { StudentDetailPageState } from "@/features/studentDetail/hooks/useStudentDetailPage";

type StudentCounselAddModalProps = {
  open: boolean;
  onClose: () => void;
  addForm: StudentDetailPageState["counsels"]["addForm"];
  hourOptions: string[];
  minuteOptions: string[];
};

export function StudentCounselAddModal({
  open,
  onClose,
  addForm,
  hourOptions,
  minuteOptions,
}: StudentCounselAddModalProps) {
  return (
    <Modal
      open={open}
      title="상담 추가"
      onClose={onClose}
      initialFocusRef={addForm.textareaRef}
      footer={
        <>
          <UIGhostButton
            type="button"
            onClick={onClose}
            disabled={addForm.submitting}
          >
            취소
          </UIGhostButton>
          <UIPrimaryButton
            type="button"
            onClick={() => void addForm.submit()}
            disabled={
              addForm.submitting ||
              !addForm.date ||
              !addForm.hour ||
              !addForm.minute
            }
          >
            {addForm.submitting ? "저장 중..." : "저장"}
          </UIPrimaryButton>
        </>
      }
    >
      <ModalForm>
        <ModalField>
          <Label style={{ alignSelf: "auto" }}>상담 일자</Label>
          <Input
            type="date"
            lang="ko-KR"
            value={addForm.date}
            onChange={(event) => addForm.setDate(event.target.value)}
          />
        </ModalField>
        <ModalField>
          <Label style={{ alignSelf: "auto" }}>시간</Label>
          <TimeRow>
            <TimeSelect>
              <SelectBox
                ariaLabel="시"
                value={addForm.hour}
                onChange={addForm.setHour}
                placeholder="시"
                options={hourOptions.map((hour) => ({
                  label: hour,
                  value: hour,
                }))}
              />
            </TimeSelect>
            <span>:</span>
            <TimeSelect>
              <SelectBox
                ariaLabel="분"
                value={addForm.minute}
                onChange={addForm.setMinute}
                placeholder="분"
                options={minuteOptions.map((minute) => ({
                  label: minute,
                  value: minute,
                }))}
              />
            </TimeSelect>
          </TimeRow>
        </ModalField>
        <ModalField>
          <Label style={{ alignSelf: "auto" }}>내용</Label>
          <TextArea
            ref={addForm.textareaRef}
            rows={4}
            value={addForm.content}
            onChange={(event) => addForm.setContent(event.target.value)}
            placeholder="상담 내용 또는 메모"
            autoFocus
          />
        </ModalField>
        {addForm.formError ? <ModalError role="alert">{addForm.formError}</ModalError> : null}
      </ModalForm>
    </Modal>
  );
}

const ModalForm = styled.div`
  display: grid;
  gap: 14px;
`;

const ModalField = styled.div`
  display: grid;
  gap: 6px;
`;

const ModalError = styled.p`
  margin: 0;
  font-size: 12px;
  color: #dc2626;
`;
