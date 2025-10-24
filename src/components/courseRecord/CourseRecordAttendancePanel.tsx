import { Fragment, type Dispatch, type SetStateAction } from "react";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import {
  AttBtn,
  AttSeg,
  BulkDialogBody,
  BulkFooter,
  BulkItem,
  BulkList,
  EmptyHint,
  Hint,
  Item,
  List,
  Muted,
  NoteInput,
  Processed,
  RowRight,
  SmallBtn,
  SmallMuted,
  AlertError,
} from "@/components/courseRecord/CourseRecordStyles";
import type { AttendanceRow } from "@/features/courseRecord/useCourseRecordAttendance";
import type { Student } from "@/api/students";

type ConfirmTarget = {
  open: boolean;
  studentId: number | null;
  target: boolean | null;
};

type Props = {
  recordId: number | null;
  rows: AttendanceRow[];
  attLoading: boolean;
  attError: string | null;
  attSavingMap: Record<number, boolean>;
  bulkStatus: "present" | "absent" | null;
  actionableRows: AttendanceRow[];
  selectedIds: Record<number, boolean>;
  setSelectedIds: Dispatch<SetStateAction<Record<number, boolean>>>;
  selectedCount: number;
  bulkDialogOpen: boolean;
  cancelBulkDialog: () => void;
  confirmBulkSelection: () => Promise<void>;
  attNoteMap: Record<number, string>;
  updateNote: (
    studentId: number,
    value: string,
    status: "present" | "absent" | "none"
  ) => void;
  clearAttendanceLocal: (studentId: number) => void;
  confirmOne: ConfirmTarget;
  setConfirmOne: Dispatch<SetStateAction<ConfirmTarget>>;
  promptSetAttendance: (studentId: number, present: boolean) => void;
  confirmAndSetAttendance: (studentId: number, present: boolean) => Promise<void>;
  students: Student[];
  showLocalHint: boolean;
};

export function CourseRecordAttendancePanel({
  recordId,
  rows,
  attLoading,
  attError,
  attSavingMap,
  bulkStatus,
  actionableRows,
  selectedIds,
  setSelectedIds,
  selectedCount,
  bulkDialogOpen,
  cancelBulkDialog,
  confirmBulkSelection,
  attNoteMap,
  updateNote,
  clearAttendanceLocal,
  confirmOne,
  setConfirmOne,
  promptSetAttendance,
  confirmAndSetAttendance,
  students,
  showLocalHint,
}: Props) {
  return (
    <Fragment>
      {showLocalHint && (
        <Hint>서버 기록이 없어 출석 정보가 로컬에만 저장됩니다.</Hint>
      )}
      {attLoading && <Muted>출석 불러오는 중...</Muted>}
      {attError && <AlertError>{attError}</AlertError>}
      <List>
        {rows.length === 0 ? (
          <EmptyHint>등록된 학생이 없습니다.</EmptyHint>
        ) : (
          rows.map((row) => {
            const status = row.status;
            const has = status !== "none";
            const present = status === "present";
            const isSaving = !!attSavingMap[row.id] || bulkStatus !== null;
            return (
              <Item key={row.id}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <strong>{row.name}</strong>
                  {row.isExtra && (
                    <SmallMuted style={{ marginLeft: 8 }}>
                      (과거 수강생)
                    </SmallMuted>
                  )}
                  <Processed data-type={status}>
                    {status === "present"
                      ? "출석"
                      : status === "absent"
                      ? "결석"
                      : "미처리"}
                  </Processed>
                </div>
                <RowRight>
                  <NoteInput
                    placeholder="메모"
                    value={attNoteMap[row.id] || ""}
                    onChange={(e) =>
                      updateNote(row.id, e.currentTarget.value, status)
                    }
                    disabled={isSaving}
                  />
                  <AttSeg>
                    <AttBtn
                      data-active={String(has && present === true)}
                      onClick={() => {
                        if (!isSaving && status !== "present") {
                          promptSetAttendance(row.id, true);
                        }
                      }}
                      disabled={isSaving}
                    >
                      출석
                    </AttBtn>
                    <AttBtn
                      data-variant="danger"
                      data-active={String(has && present === false)}
                      onClick={() => {
                        if (!isSaving && status !== "absent") {
                          promptSetAttendance(row.id, false);
                        }
                      }}
                      disabled={isSaving}
                    >
                      결석
                    </AttBtn>
                  </AttSeg>
                  <SmallBtn
                    title={
                      recordId
                        ? "서버 기록은 미처리로 되돌릴 수 없습니다."
                        : "미처리로 초기화"
                    }
                    onClick={() => {
                      if (!recordId) clearAttendanceLocal(row.id);
                    }}
                    disabled={!!recordId || isSaving}
                  >
                    미처리
                  </SmallBtn>
                  {isSaving && <SmallMuted>저장 중...</SmallMuted>}
                </RowRight>
              </Item>
            );
          })
        )}
      </List>

      <ConfirmDialog
        open={confirmOne.open}
        title="출결 처리 확인"
        message={(() => {
          const sid = confirmOne.studentId;
          const tgt = confirmOne.target;
          const sName =
            sid != null
              ? students.find((s) => s.id === sid)?.name || `학생#${sid}`
              : "학생";
          const label = tgt ? "출석" : "결석";
          return `${sName}을(를) ${label} 처리하시겠어요?`;
        })()}
        confirmLabel="확인"
        cancelLabel="취소"
        onCancel={() =>
          setConfirmOne({ open: false, studentId: null, target: null })
        }
        onConfirm={async () => {
          const sid = confirmOne.studentId;
          const tgt = confirmOne.target;
          setConfirmOne({ open: false, studentId: null, target: null });
          if (sid == null || tgt == null) return;
          await confirmAndSetAttendance(sid, tgt);
        }}
      />

      <ConfirmDialog
        open={bulkDialogOpen}
        title="선택 출석 처리"
        message={
          <BulkDialogBody>
            <p>출석 처리할 학생을 선택하세요.</p>
            <BulkList>
              {actionableRows.map((row) => {
                const disabled = row.status === "present";
                return (
                  <BulkItem key={row.id} data-disabled={String(disabled)}>
                    <input
                      type="checkbox"
                      checked={selectedIds[row.id] || false}
                      onChange={(e) => {
                        const targetInput = e.target as HTMLInputElement | null;
                        if (!targetInput) return;
                        const { checked } = targetInput;
                        setSelectedIds((prev) => ({
                          ...prev,
                          [row.id]: checked,
                        }));
                      }}
                      disabled={disabled || bulkStatus !== null}
                    />
                    <span className="name">{row.name}</span>
                    <span className="status">
                      {row.status === "present"
                        ? "이미 출석"
                        : row.status === "absent"
                        ? "결석"
                        : "미처리"}
                    </span>
                  </BulkItem>
                );
              })}
            </BulkList>
            <BulkFooter>
              <span>선택된 학생: {selectedCount}명</span>
            </BulkFooter>
          </BulkDialogBody>
        }
        confirmLabel="출석 처리"
        cancelLabel="취소"
        onCancel={cancelBulkDialog}
        onConfirm={() => {
          if (!bulkStatus) void confirmBulkSelection();
        }}
        busy={bulkStatus === "present"}
        hideCancel={false}
      />
    </Fragment>
  );
}
