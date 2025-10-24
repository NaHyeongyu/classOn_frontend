import styled from "styled-components";
import {
  CounselContent,
  CounselHeader,
  CounselRow,
  EditGrid,
  Empty,
  Field,
  Input,
  Label,
  List,
  ListItem,
  ModalBtn,
  Muted,
  RowActions,
  TextArea,
  TimeRow,
  TimeSelect,
  When,
  SmallTitle,
} from "./StudentDetailStyles";
import {
  PrimaryButton as UIPrimaryButton,
  PrimaryButtonSm as UIPrimaryButtonSm,
} from "@/components/common/UI";
import SelectBox from "@/components/common/SelectBox";
import type { Counsel } from "@/api/counsels";

type Props = {
  counsels: Counsel[];
  loading: boolean;
  error: string | null;
  exporting: boolean;
  onExport: () => void;
  onAddCounsel: () => void;
  addDisabled: boolean;
  editingCounselId: number | null;
  editDate: string;
  editHour: string;
  editMin: string;
  editContent: string;
  onChangeDate: (value: string) => void;
  onChangeHour: (value: string) => void;
  onChangeMin: (value: string) => void;
  onChangeContent: (value: string) => void;
  onStartEdit: (counsel: Counsel) => void;
  onCancelEdit: () => void;
  onSaveEdit: (id: number) => void;
  onRequestDelete: (id: number) => void;
  savingEdit: boolean;
  hourOptions: string[];
  minuteOptions: string[];
  isAddingModalOpen: boolean;
};

export function StudentCounselTab({
  counsels,
  loading,
  error,
  exporting,
  onExport,
  onAddCounsel,
  addDisabled,
  editingCounselId,
  editDate,
  editHour,
  editMin,
  editContent,
  onChangeDate,
  onChangeHour,
  onChangeMin,
  onChangeContent,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onRequestDelete,
  savingEdit,
  hourOptions,
  minuteOptions,
  isAddingModalOpen,
}: Props) {
  return (
    <>
      <CounselHeader>
        <div>
          <SmallTitle>상담기록</SmallTitle>
        </div>
        <div style={{ display: "inline-flex", gap: 8, alignItems: "center" }}>
          <ModalBtn type="button" onClick={onExport} disabled={exporting}>
            {exporting ? "엑셀 준비 중..." : "엑셀 추출"}
          </ModalBtn>
          <UIPrimaryButtonSm
            type="button"
            onClick={onAddCounsel}
            disabled={addDisabled}
          >
            상담 추가
          </UIPrimaryButtonSm>
        </div>
      </CounselHeader>

      {error && !isAddingModalOpen && <ErrorMessage>{error}</ErrorMessage>}

      {loading ? (
        <Muted>불러오는 중...</Muted>
      ) : counsels.length === 0 ? (
        <Empty>상담 기록이 없습니다.</Empty>
      ) : (
        <List>
          {counsels.map((counsel) => {
            const isEditing = editingCounselId === counsel.id;
            return (
              <ListItem key={counsel.id}>
                {!isEditing ? (
                  <>
                    <CounselRow>
                      <When>{formatCounselTime(counsel.counselTime)}</When>
                      <RowActions>
                        <ModalBtn type="button" onClick={() => onStartEdit(counsel)}>
                          편집
                        </ModalBtn>
                        <ModalBtn
                          type="button"
                          data-variant="danger"
                          onClick={() => onRequestDelete(counsel.id)}
                        >
                          삭제
                        </ModalBtn>
                      </RowActions>
                    </CounselRow>
                    <CounselContent>
                      {(counsel.content || "").trim() || "내용 없음"}
                    </CounselContent>
                  </>
                ) : (
                  <>
                    <EditGrid>
                      <Field>
                        <Label>상담 일자</Label>
                        <Input
                          type="date"
                          lang="ko-KR"
                          value={editDate}
                          onChange={(e) => onChangeDate(e.target.value)}
                        />
                      </Field>
                      <Field>
                        <Label>시간</Label>
                        <TimeRow>
                          <TimeSelect>
                            <SelectBox
                              ariaLabel="시"
                              value={editHour}
                              onChange={onChangeHour}
                              placeholder="시"
                              options={hourOptions.map((h) => ({
                                label: h,
                                value: h,
                              }))}
                            />
                          </TimeSelect>
                          <span>:</span>
                          <TimeSelect>
                            <SelectBox
                              ariaLabel="분"
                              value={editMin}
                              onChange={onChangeMin}
                              placeholder="분"
                              options={minuteOptions.map((m) => ({
                                label: m,
                                value: m,
                              }))}
                            />
                          </TimeSelect>
                        </TimeRow>
                      </Field>
                      <Field style={{ gridColumn: "1 / -1" }}>
                        <Label>내용</Label>
                        <TextArea
                          rows={4}
                          value={editContent}
                          onChange={(e) => onChangeContent(e.target.value)}
                        />
                      </Field>
                    </EditGrid>
                    <RowActions>
                      <ModalBtn type="button" onClick={onCancelEdit}>
                        취소
                      </ModalBtn>
                      <UIPrimaryButton
                        type="button"
                        disabled={
                          savingEdit || !editDate || !editHour || !editMin
                        }
                        onClick={() => onSaveEdit(counsel.id)}
                      >
                        저장
                      </UIPrimaryButton>
                    </RowActions>
                  </>
                )}
              </ListItem>
            );
          })}
        </List>
      )}
    </>
  );
}

function formatCounselTime(iso: string) {
  try {
    const d = new Date(iso);
    const yoil = ["일", "월", "화", "수", "목", "금", "토"][d.getDay()];
    const y = d.getFullYear();
    const m = d.getMonth() + 1;
    const da = d.getDate();
    const hh = String(d.getHours()).padStart(2, "0");
    const mi = String(d.getMinutes()).padStart(2, "0");
    return `${y}년 ${m}월 ${da}일 (${yoil}) ${hh}:${mi}`;
  } catch {
    return iso;
  }
}

const ErrorMessage = ({ children }: { children: string }) => (
  <ErrorText>{children}</ErrorText>
);

const ErrorText = styled.div`
  color: #b91c1c;
  font-size: 12px;
  font-weight: 700;
  margin-bottom: 8px;
`;
