import { Fragment, type Dispatch, type SetStateAction } from "react";
import Modal from "@/components/common/Modal";
import {
  AlertError,
  EmptyHint,
  Muted,
  SmallMuted,
  SuccessBadge,
} from "@/components/courseRecord/CourseRecordStyles";
import {
  PrimaryButton as UIPrimaryButton,
  PrimaryButtonSm as UIPrimaryButtonSm,
  GhostButton as UIGhostButton,
  SmallBtn as UISmallBtn,
} from "@/components/common/UI";
import type { UseCourseRecordGradesReturn } from "@/features/courseRecord/useCourseRecordGrades";
import styled from "styled-components";
import type { Exam } from "@/api/exams";

type GradeView = "intro" | "list" | "scores";

type Props = {
  gradeView: GradeView;
  setGradeView: Dispatch<SetStateAction<GradeView>>;
  scoreStudents: { id: number; name: string }[];
  grades: UseCourseRecordGradesReturn;
  openExamModal: () => void;
  closeExamModal: () => void;
};

export function CourseRecordGradesPanel({
  gradeView,
  setGradeView,
  scoreStudents,
  grades,
  openExamModal,
  closeExamModal,
}: Props) {
  const {
    exams,
    examLoading,
    examError,
    selectedExamId,
    setSelectedExamId,
    examFormTitle,
    setExamFormTitle,
    examFormMode,
    setExamFormMode,
    examFormSaving,
    examFormError,
    setExamFormError,
    examModalOpen,
    examQuery,
    setExamQuery,
    selectedExam,
    filteredExams,
    examResultsMap,
    gradeMap,
    setGradeMap,
    gradeSaving,
    gradeFeedback,
    setGradeFeedback,
    lastGradeEditAtRef,
    handleConfirmExamSelection,
  } = grades;

  const hasExistingExams = exams.length > 0;

  return (
    <Fragment>
      <GradesWrapper data-view={gradeView}>
        {gradeView === "intro" && (
          <GradesIntro>
            <IntroText>
              출석 학생의 성적을 기록하려면 우측 상단에서 시험을 생성하거나
              선택하세요.
            </IntroText>
            {examLoading && (
              <SmallMuted>시험 정보를 불러오는 중입니다...</SmallMuted>
            )}
            {examError && <AlertError>{examError}</AlertError>}
          </GradesIntro>
        )}

        {gradeView === "list" && (
          <GradesList>
            <GradesListHead>
              <div>
                <Title>등록된 시험/테스트</Title>
                <SmallMuted>이 수업과 연결된 시험입니다.</SmallMuted>
              </div>
              <div className="actions">
                {hasExistingExams && (
                  <UIPrimaryButtonSm
                    type="button"
                    onClick={openExamModal}
                    disabled={examLoading}
                  >
                    시험 선택
                  </UIPrimaryButtonSm>
                )}
              </div>
            </GradesListHead>
            {examLoading ? (
              <Muted>시험을 불러오는 중입니다...</Muted>
            ) : examError ? (
              <AlertError>{examError}</AlertError>
            ) : hasExistingExams ? (
              <EmptyHint>시험 선택 버튼을 눌러 성적을 입력할 시험을 선택하세요.</EmptyHint>
            ) : (
              <EmptyHint>등록된 시험이 없습니다. 수업 상세 페이지에서 시험을 먼저 생성해 주세요.</EmptyHint>
            )}
          </GradesList>
        )}

        {gradeView === "scores" &&
          (selectedExam ? (
            <ScorePanel>
              <ScoreHead>
                <strong>성적 입력</strong>
                <div className="right">
                  <ModeBadge
                    data-variant={
                      selectedExam.inputMode === "percent" ? "percent" : "letter"
                    }
                  >
                    {selectedExam.inputMode === "percent" ? "백분율" : "등급"}
                  </ModeBadge>
                  {gradeFeedback === "success" && (
                    <SuccessBadge role="status">저장 완료!</SuccessBadge>
                  )}
                  {gradeSaving && (
                    <SmallMuted style={{ marginLeft: 8 }}>
                      저장 중...
                    </SmallMuted>
                  )}
                  <UISmallBtn
                    type="button"
                    onClick={() => {
                      setGradeMap({});
                      setGradeFeedback("idle");
                    }}
                    disabled={gradeSaving || Object.keys(gradeMap).length === 0}
                  >
                    초기화
                  </UISmallBtn>
                </div>
              </ScoreHead>
              <ScoreTable>
                <div className="row head">
                  <span>학생명</span>
                  <span>
                    {selectedExam.inputMode === "percent"
                      ? "점수(0~100)"
                      : "등급"}
                  </span>
                </div>
                {scoreStudents.length === 0 ? (
                  <div className="row">
                    <SmallMuted>학생이 없습니다.</SmallMuted>
                  </div>
                ) : (
                  scoreStudents.map((student) => {
                    const values = gradeMap[student.id] || {};
                    const existing = examResultsMap[student.id];
                    return (
                      <div key={`score-${student.id}`} className="row">
                        <span className="name">
                          {student.name}
                          {gradeMap[student.id] ? (
                            <ChangedDot title="변경됨" />
                          ) : null}
                        </span>
                        <span className="control">
                          {selectedExam.inputMode === "percent" ? (
                            <ScoreInput
                              type="number"
                              min={0}
                              step={1}
                              max={100}
                              value={
                                values.percent !== undefined
                                  ? values.percent
                                  : existing?.score != null
                                  ? String(existing.score)
                                  : ""
                              }
                              placeholder="0~100"
                              onChange={(e) => {
                                const raw = e.currentTarget.value;
                                if (raw === "") {
                                  lastGradeEditAtRef.current = Date.now();
                                  setGradeFeedback("idle");
                                  setGradeMap((map) => ({
                                    ...map,
                                    [student.id]: { percent: "" },
                                  }));
                                  return;
                                }
                                const numeric = Number(raw);
                                if (!Number.isFinite(numeric)) return;
                                const clamped = Math.max(
                                  0,
                                  Math.min(100, Math.round(numeric))
                                );
                                lastGradeEditAtRef.current = Date.now();
                                setGradeFeedback("idle");
                                setGradeMap((map) => ({
                                  ...map,
                                  [student.id]: { percent: String(clamped) },
                                }));
                              }}
                              onWheel={(e) =>
                                (
                                  e.currentTarget as HTMLInputElement
                                ).blur()
                              }
                              onKeyDown={(e) => {
                                if (["e", "E", "+", "-"].includes(e.key))
                                  e.preventDefault();
                              }}
                              inputMode="numeric"
                              pattern="[0-9]*"
                              disabled={gradeSaving}
                            />
                          ) : (
                            <ScoreSelect
                              value={
                                values.letter !== undefined
                                  ? values.letter ?? ""
                                  : existing?.level ?? ""
                              }
                              onChange={(e) => {
                                const raw = e.currentTarget.value;
                                const val =
                                  raw === ""
                                    ? undefined
                                    : (raw as "A" | "B" | "C" | "D" | "E" | "F");
                                lastGradeEditAtRef.current = Date.now();
                                setGradeFeedback("idle");
                                setGradeMap((map) => ({
                                  ...map,
                                  [student.id]: { letter: val },
                                }));
                              }}
                              disabled={gradeSaving}
                            >
                              <option value="">-</option>
                              <option value="A">A</option>
                              <option value="B">B</option>
                              <option value="C">C</option>
                              <option value="D">D</option>
                              <option value="E">E</option>
                              <option value="F">F</option>
                            </ScoreSelect>
                          )}
                        </span>
                      </div>
                    );
                  })
                )}
              </ScoreTable>
            </ScorePanel>
          ) : (
            <EmptyHint>시험을 먼저 선택하세요.</EmptyHint>
          ))}
      </GradesWrapper>

      <Modal
        open={examModalOpen}
        title="시험/테스트 선택"
        onClose={closeExamModal}
        blockOutsideClose
        footer={
          <>
            <UIGhostButton type="button" onClick={closeExamModal}>
              닫기
            </UIGhostButton>
            <UIPrimaryButton
              type="button"
              onClick={() => {
                void (async () => {
                  const instanceId = await handleConfirmExamSelection();
                  if (instanceId != null) {
                    setGradeView("scores");
                    closeExamModal();
                  }
                })();
              }}
              disabled={!selectedExamId || examLoading}
            >
              선택
            </UIPrimaryButton>
          </>
        }
      >
        <ModalListBody>
          {examLoading ? (
            <Muted>시험을 불러오는 중입니다...</Muted>
          ) : examError ? (
            <AlertError>{examError}</AlertError>
          ) : exams.length === 0 ? (
            <EmptyHint>등록된 시험이 없습니다. 수업 상세 페이지에서 시험을 먼저 생성해 주세요.</EmptyHint>
          ) : (
            <ModalListScroller>
              <ExamList>
                {filteredExams.map((exam) => {
                  const examIdStr = String(exam.id);
                  const selected = selectedExamId === examIdStr;
                  return (
                    <ExamListItem
                      key={`modal-exam-${exam.id}`}
                      type="button"
                      data-selected={String(selected)}
                      onClick={() => setSelectedExamId(examIdStr)}
                      disabled={examLoading}
                    >
                      <div className="meta">
                        <strong>{exam.title || "시험"}</strong>
                        <span>{formatExamMeta(exam)}</span>
                      </div>
                      {selected && <span className="indicator">선택됨</span>}
                    </ExamListItem>
                  );
                })}
              </ExamList>
              {filteredExams.length === 0 && (
                <SmallMuted>조건에 맞는 시험이 없습니다.</SmallMuted>
              )}
            </ModalListScroller>
          )}
        </ModalListBody>
      </Modal>
    </Fragment>
  );
}

function formatExamMeta(exam: Exam): string {
  const parts: string[] = [];
  if (exam.examDate) parts.push(exam.examDate);
  if (exam.inputMode === "percent") parts.push("백분율 입력");
  else if (exam.inputMode === "letter") parts.push("등급 입력");
  return parts.length > 0 ? parts.join(" · ") : "등록된 정보 없음";
}

const Title = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: #111827;
`;

const GradesWrapper = styled.div`
  display: grid;
  gap: 16px;
`;

const GradesIntro = styled.div`
  border: 1px dashed #d1d5db;
  border-radius: 12px;
  padding: 18px 20px;
  background: #f9fafb;
  display: grid;
  gap: 12px;
  max-width: 520px;
`;

const IntroText = styled.p`
  margin: 0;
  font-size: 13px;
  color: #475569;
  line-height: 1.6;
`;

const GradesList = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: #fff;
  padding: 16px;
  display: grid;
  gap: 16px;
`;

const GradesListHead = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  .actions {
    display: inline-flex;
    gap: 8px;
    flex-wrap: wrap;
  }
  h2,
  h3,
  h4 {
    margin: 0;
  }
`;

const ScorePanel = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: #fff;
  padding: 12px;
  display: grid;
  gap: 10px;
`;

const ScoreHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  .right {
    display: inline-flex;
    gap: 8px;
    align-items: center;
  }
`;

const ScoreTable = styled.div`
  display: grid;
  gap: 8px;
  .row {
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
    gap: 8px;
  }
  .row.head {
    color: #6b7280;
    font-size: 12px;
    font-weight: 800;
  }
  .row.head span:last-child {
    justify-self: end;
    text-align: right;
  }
  .name {
    font-weight: 700;
    color: #111827;
  }
  .control {
    display: inline-flex;
    justify-self: end;
  }
`;

const ScoreInput = styled.input`
  height: 32px;
  padding: 0 10px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 12px;
  width: 100px;
`;

const ScoreSelect = styled.select`
  height: 32px;
  padding: 0 10px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 12px;
  width: 100px;
  background: #fff;
`;

const ModeBadge = styled.span`
  display: inline-flex;
  align-items: center;
  height: 22px;
  padding: 0 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 800;
  border: 1px solid #e5e7eb;
  color: #374151;
  background: #f8fafc;
  &[data-variant="percent"] {
    background: #ecfdf5;
    color: #065f46;
    border-color: #a7f3d0;
  }
  &[data-variant="letter"] {
    background: #eef2ff;
    color: #3730a3;
    border-color: #c7d2fe;
  }
`;

const ChangedDot = styled.span`
  display: inline-block;
  width: 6px;
  height: 6px;
  margin-left: 6px;
  border-radius: 50%;
  background: #f59e0b;
  vertical-align: middle;
`;

const ModalListBody = styled.div`
  display: grid;
  gap: 12px;
`;

const ModalListScroller = styled.div`
  max-height: 360px;
  overflow-y: auto;
  padding-right: 4px;
`;

const CreateForm = styled.div`
  display: grid;
  gap: 12px;
  label {
    font-size: 12px;
    font-weight: 700;
    color: #475569;
  }
`;

const TitleInput = styled.input`
  width: 100%;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 10px 12px;
  font-size: 14px;
`;

const RadioRow = styled.div`
  display: inline-flex;
  gap: 16px;
  align-items: center;
`;

const RadioLabel = styled.label`
  display: inline-flex;
  gap: 6px;
  align-items: center;
  font-size: 13px;
  color: #374151;
  cursor: pointer;
  input {
    width: 16px;
    height: 16px;
  }
`;

const TemplateSelect = styled.select`
  width: 100%;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 10px 12px;
  font-size: 14px;
  background: #fff;
`;

const TemplateHint = styled.div`
  color: #6b7280;
  font-size: 12px;
  line-height: 1.4;
  margin-top: -6px;
`;

const ModalToolbar = styled.div`
  display: flex;
  gap: 8px;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  flex-wrap: wrap;
  input {
    flex: 1;
    min-width: 160px;
  }
`;

const ExamList = styled.div`
  display: grid;
  gap: 10px;
`;

const ExamListItem = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  text-align: left;
  padding: 12px 14px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: #f9fafb;
  cursor: pointer;
  transition: border-color 0.18s ease, background-color 0.18s ease;
  .meta {
    display: grid;
    gap: 4px;
  }
  .meta strong {
    font-size: 14px;
    color: #111827;
  }
  .meta span {
    font-size: 12px;
    color: #475569;
  }
  .indicator {
    font-size: 12px;
    color: #4f46e5;
    font-weight: 700;
  }
  &[data-selected="true"] {
    border-color: #6366f1;
    background: #eef2ff;
  }
`;

const SearchInput = styled.input`
  height: 30px;
  padding: 0 10px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 12px;
`;
