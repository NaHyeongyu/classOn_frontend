import {
  Card,
  CardActions,
  CardHead,
  MemoActions,
  MemoDate,
  MemoHeader,
  MemoItemBox,
  MemoList,
  MemoNew,
  MemoText,
  MemoTextarea,
  ModalBtn,
  SectionTitle,
  Empty,
} from "./StudentDetailStyles";
import {
  PrimaryButton as UIPrimaryButton,
  PrimaryButtonSm as UIPrimaryButtonSm,
} from "@/components/common/UI";
type MemoEntry = {
  id: number;
  text: string;
  createdAt: string;
  updatedAt?: string;
};

type Props = {
  memos: MemoEntry[];
  newMemo: string;
  onChangeNewMemo: (value: string) => void;
  onAddMemo: () => void;
  editingMemoId: number | null;
  editingMemoText: string;
  onChangeEditingMemoText: (value: string) => void;
  onBeginEditMemo: (id: number) => void;
  onCancelEditMemo: () => void;
  onSaveEditMemo: () => void;
  onDeleteMemo: (id: number) => void | Promise<void>;
  formatDate: (iso: string) => string;
};

export function StudentMemoCard({
  memos,
  newMemo,
  onChangeNewMemo,
  onAddMemo,
  editingMemoId,
  editingMemoText,
  onChangeEditingMemoText,
  onBeginEditMemo,
  onCancelEditMemo,
  onSaveEditMemo,
  onDeleteMemo,
  formatDate,
}: Props) {
  return (
    <Card>
      <CardHead>
        <SectionTitle>메모 사항</SectionTitle>
        <CardActions>
          <UIPrimaryButtonSm type="button" onClick={onAddMemo}>
            추가
          </UIPrimaryButtonSm>
        </CardActions>
      </CardHead>
      <MemoNew>
        <MemoTextarea
          rows={3}
          value={newMemo}
          onChange={(e) => onChangeNewMemo(e.target.value)}
          placeholder="메모를 입력하세요"
        />
      </MemoNew>
      <MemoList>
        {memos.length === 0 && (
          <Empty>메모가 없습니다. 메모를 추가해 주세요.</Empty>
        )}
        {memos.map((memo) => {
          const isEditing = editingMemoId === memo.id;
          const dateLabel = formatDate(memo.updatedAt || memo.createdAt);
          return (
            <MemoItemBox key={memo.id}>
              <MemoHeader>
                <MemoDate>
                  {dateLabel}
                  {memo.updatedAt ? (
                    <span style={{ marginLeft: 6, color: "#6b7280" }}>
                      (수정됨)
                    </span>
                  ) : null}
                </MemoDate>
                <MemoActions>
                  {isEditing ? (
                    <>
                      <ModalBtn type="button" onClick={onCancelEditMemo}>
                        취소
                      </ModalBtn>
                      <UIPrimaryButton type="button" onClick={onSaveEditMemo}>
                        저장
                      </UIPrimaryButton>
                    </>
                  ) : (
                    <>
                      <ModalBtn
                        type="button"
                        onClick={() => onBeginEditMemo(memo.id)}
                      >
                        편집
                      </ModalBtn>
                      <ModalBtn
                        type="button"
                        data-variant="danger"
                        onClick={() => void onDeleteMemo(memo.id)}
                      >
                        삭제
                      </ModalBtn>
                    </>
                  )}
                </MemoActions>
              </MemoHeader>
              {isEditing ? (
                <MemoTextarea
                  rows={4}
                  value={editingMemoText}
                  onChange={(e) => onChangeEditingMemoText(e.target.value)}
                />
              ) : (
                <MemoText>{memo.text}</MemoText>
              )}
            </MemoItemBox>
          );
        })}
      </MemoList>
    </Card>
  );
}
