import {
  Card,
  CardActions,
  CardHead,
  ModalBtn,
  NotesBox,
  NotesTextarea,
  SectionTitle,
  Empty,
} from "./StudentDetailStyles";
import {
  GhostButton as UIGhostButton,
  PrimaryButton as UIPrimaryButton,
  PrimaryButtonSm as UIPrimaryButtonSm,
} from "@/components/common/UI";

type Props = {
  notes: string;
  editing: boolean;
  notesInput: string;
  onChange: (value: string) => void;
  onEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
};

export function StudentNotesCard({
  notes,
  editing,
  notesInput,
  onChange,
  onEdit,
  onCancel,
  onSave,
}: Props) {
  return (
    <Card>
      <CardHead>
        <SectionTitle>특이사항</SectionTitle>
        <CardActions>
          {editing ? (
            <>
              <ModalBtn type="button" onClick={onCancel}>
                취소
              </ModalBtn>
              <UIPrimaryButton type="button" onClick={onSave}>
                저장
              </UIPrimaryButton>
            </>
          ) : notes ? (
            <UIGhostButton type="button" onClick={onEdit}>
              편집
            </UIGhostButton>
          ) : (
            <UIPrimaryButtonSm type="button" onClick={onEdit}>
              메모 추가
            </UIPrimaryButtonSm>
          )}
        </CardActions>
      </CardHead>
      {editing ? (
        <NotesTextarea
          rows={8}
          value={notesInput}
          onChange={(e) => onChange(e.target.value)}
          placeholder="예: 과학고 진학 관심, 수학 약점 보완 필요, 알러지 등"
        />
      ) : notes ? (
        <NotesBox title={notes}>{notes}</NotesBox>
      ) : (
        <EmptyMessage />
      )}
    </Card>
  );
}

function EmptyMessage() {
  return <Empty>특이사항이 없습니다. 메모를 추가해 주세요.</Empty>;
}
