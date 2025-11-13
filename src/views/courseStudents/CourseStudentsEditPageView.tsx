import { ReactNode } from "react";
import styled from "styled-components";
import {
  SectionCard as Section,
  TitleH3 as Title,
  SmallBtn as UISmallBtn,
  PrimaryButtonSm as UIPrimaryButtonSm,
} from "@/components/common/UI";
import BackButton from "@/components/common/BackButton";
import type { Student } from "@/api/students";

const STATUS_LABEL: Record<Student["status"], string> = {
  ENROLLED: "수강중",
  ON_LEAVE: "휴학",
  PENDING: "대기",
  WITHDRAWN: "퇴원",
};

function statusText(status: Student["status"] | undefined) {
  if (!status) return "-";
  return STATUS_LABEL[status] ?? status;
}

type CourseStudentsEditPageViewProps = {
  title: string;
  capacity: number | null;
  studentSearch: string;
  onChangeStudentSearch: (value: string) => void;
  studentOptions: Student[];
  studentLoading: boolean;
  studentError: string | null;
  enrolledStudents: Student[];
  enrolledLoading: boolean;
  enrolledError: string | null;
  addingId: number | null;
  removingId: number | null;
  onEnroll: (student: Student) => void;
  onUnenroll: (student: Student) => void;
  confirmUnenrollDialog: ReactNode;
  onBack: () => void;
  atCapacity: boolean;
};

export function CourseStudentsEditPageView({
  title,
  capacity,
  studentSearch,
  onChangeStudentSearch,
  studentOptions,
  studentLoading,
  studentError,
  enrolledStudents,
  enrolledLoading,
  enrolledError,
  addingId,
  removingId,
  onEnroll,
  onUnenroll,
  confirmUnenrollDialog,
  onBack,
  atCapacity,
}: CourseStudentsEditPageViewProps) {
  return (
    <Wrap>
      {confirmUnenrollDialog}
      <Head>
        <TopLeft>
          <BackButton onClick={onBack} label="뒤로" />
          <h2>수강생 수정</h2>
        </TopLeft>
        <Actions />
      </Head>
      {(studentError || enrolledError) && (
        <AlertError>{studentError || enrolledError}</AlertError>
      )}

      <Section>
        <Title>{title || "수업"} - 학생 관리</Title>
        <Grid>
          <div>
            <Field>
              <Label>학생 검색</Label>
              <Input
                placeholder="이름/연락처로 검색 (빈칸=전체)"
                value={studentSearch}
                onChange={(event) => onChangeStudentSearch(event.target.value)}
              />
              <Hint>
                {studentLoading
                  ? "검색 중..."
                  : studentError
                  ? studentError
                  : `총 ${studentOptions.length}명 조회됨`}
              </Hint>
            </Field>
            <Field>
              <Label>검색 결과</Label>
              <ListBox>
                {studentOptions.length === 0 && !studentLoading ? (
                  <Muted>검색 결과가 없습니다.</Muted>
                ) : null}
                {studentOptions.map((student) => {
                  const alreadyEnrolled = enrolledStudents.some(
                    (enrolled) => enrolled.id === student.id,
                  );
                  const disabled = alreadyEnrolled || atCapacity;
                  return (
                    <Row key={student.id}>
                      <div>
                        <strong>{student.name}</strong>
                        <SmallMuted>{student.code}</SmallMuted>
                        <StatusTag data-type={student.status}>
                          {statusText(student.status)}
                        </StatusTag>
                      </div>
                      <RowActions>
                        {alreadyEnrolled ? (
                          <SmallBtn type="button" disabled title="이미 등록됨">
                            등록됨
                          </SmallBtn>
                        ) : (
                          <UIPrimaryButtonSm
                            type="button"
                            onClick={() => onEnroll(student)}
                            disabled={disabled || addingId === student.id}
                            title={atCapacity ? "정원 초과" : "추가"}
                          >
                            {addingId === student.id ? "추가 중..." : "추가"}
                          </UIPrimaryButtonSm>
                        )}
                      </RowActions>
                    </Row>
                  );
                })}
              </ListBox>
            </Field>
          </div>

          <div>
            <Field>
              <Label>
                등록된 학생 ({enrolledStudents.length}명
                {capacity ? ` / 정원 ${capacity}명` : ""})
              </Label>
              <ListBox>
                {enrolledLoading ? <Muted>불러오는 중...</Muted> : null}
                {!enrolledLoading && enrolledStudents.length === 0 ? (
                  <Muted>아직 등록된 학생이 없습니다.</Muted>
                ) : null}
                {enrolledStudents.map((student) => (
                  <Row key={`en-${student.id}`}>
                    <div>
                      <strong>{student.name}</strong>
                      <SmallMuted>{student.code}</SmallMuted>
                      <StatusTag data-type={student.status}>
                        {statusText(student.status)}
                      </StatusTag>
                    </div>
                    <RowActions>
                      <SmallBtn
                        type="button"
                        data-variant="danger"
                        onClick={() => onUnenroll(student)}
                        disabled={removingId === student.id}
                      >
                        {removingId === student.id ? "해제 중..." : "해제"}
                      </SmallBtn>
                    </RowActions>
                  </Row>
                ))}
              </ListBox>
            </Field>
          </div>
        </Grid>
      </Section>
    </Wrap>
  );
}

const Wrap = styled.div`
  display: grid;
  gap: 12px;
`;

const Head = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: nowrap; /* keep on one line */
`;

const TopLeft = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  /* Prevent title from breaking to next line */
  h2 {
    margin: 0;
    font-size: 20px;
    font-weight: 800;
    line-height: 1.2;
    white-space: nowrap;
  }
`;

const Actions = styled.div`
  display: inline-flex;
  gap: 8px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const Field = styled.div`
  display: grid;
  gap: 6px;
`;

const Label = styled.div`
  color: #6b7280;
  font-size: 12px;
  font-weight: 700;
`;

const Input = styled.input`
  height: 38px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 0 10px;
  font-size: 14px;
`;

const Hint = styled.div`
  color: #6b7280;
  font-size: 12px;
`;

const ListBox = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  min-height: 40px;
  max-height: 420px;
  overflow: auto;
  padding: 6px;
  display: grid;
  gap: 6px;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 8px 10px;
  border: 1px solid #f1f5f9;
  border-radius: 10px;
`;

const RowActions = styled.div`
  display: inline-flex;
  gap: 6px;
`;

const SmallBtn = styled(UISmallBtn)`
  height: 40px;
  padding: 0 16px;
  font-size: 14px;
  &[data-active='true'] {
    background: #111827;
    color: #fff;
    border-color: #111827;
  }
`;

const SmallMuted = styled.span`
  margin-left: 8px;
  color: #9ca3af;
  font-size: 12px;
`;

const StatusTag = styled.span`
  margin-left: 8px;
  padding: 2px 6px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  border: 1px solid #e5e7eb;
  color: #374151;
  background: #f9fafb;

  &[data-type='ENROLLED'] {
    background: #ecfdf5;
    color: #047857;
    border-color: #a7f3d0;
  }
  &[data-type='ON_LEAVE'] {
    background: #fff7ed;
    color: #b45309;
    border-color: #fed7aa;
  }
  &[data-type='PENDING'] {
    background: #f5f3ff;
    color: #6d28d9;
    border-color: #ddd6fe;
  }
`;

const AlertError = styled.div`
  background: #fee2e2;
  color: #b91c1c;
  border: 1px solid #fecaca;
  padding: 10px 12px;
  border-radius: 10px;
  font-size: 13px;
`;

const Muted = styled.div`
  color: #6b7280;
  font-size: 12px;
`;
