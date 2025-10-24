import styled from "styled-components";
import SelectBox from "@/components/common/SelectBox";
import {
  GhostButton as UIGhostButton,
  PrimaryButton as UIPrimaryButton,
} from "@/components/common/UI";
import type { Course } from "@/api/courses";

type ClassCreateModalProps = {
  open: boolean;
  courseRows: Course[];
  courseFilter: string;
  onChangeFilter: (value: string) => void;
  courseBusy: boolean;
  courseErr: string | null;
  selectedCourse: Course | null;
  onPickCourse: (course: Course) => void;
  hours24: string[];
  mins5: string[];
  startHour: string;
  startMin: string;
  endHour: string;
  endMin: string;
  onChangeStartHour: (value: string) => void;
  onChangeStartMin: (value: string) => void;
  onChangeEndHour: (value: string) => void;
  onChangeEndMin: (value: string) => void;
  addErr: string | null;
  savingClass: boolean;
  onClose: () => void;
  onSave: () => void;
};

export default function ClassCreateModal({
  open,
  courseRows,
  courseFilter,
  onChangeFilter,
  courseBusy,
  courseErr,
  selectedCourse,
  onPickCourse,
  hours24,
  mins5,
  startHour,
  startMin,
  endHour,
  endMin,
  onChangeStartHour,
  onChangeStartMin,
  onChangeEndHour,
  onChangeEndMin,
  addErr,
  savingClass,
  onClose,
  onSave,
}: ClassCreateModalProps) {
  if (!open) return null;

  const filteredCourses = (courseRows || []).filter((course) => {
    if (!courseFilter) return true;
    const query = courseFilter.toLowerCase();
    const title = course.title?.toLowerCase() ?? "";
    const code = course.code?.toLowerCase() ?? "";
    return title.includes(query) || code.includes(query);
  });

  return (
    <ModalBackdrop onClick={onClose}>
      <ModalCard onClick={(event) => event.stopPropagation()}>
        <ModalTitle>수업 추가</ModalTitle>
        <Label>수업 템플릿 선택</Label>
        <Input
          placeholder="검색어로 필터…"
          value={courseFilter}
          onChange={(event) => onChangeFilter(event.target.value)}
        />
        <CourseList>
          {courseBusy && <Muted>불러오는 중…</Muted>}
          {courseErr && <Err>{courseErr}</Err>}
          {!courseBusy &&
            !courseErr &&
            filteredCourses.map((course) => (
              <CourseRow
                key={course.id}
                data-selected={selectedCourse?.id === course.id}
                onClick={() => onPickCourse(course)}
              >
                <div>
                  <strong>{course.title}</strong>
                  <SmallText style={{ marginLeft: 8 }}>{course.code}</SmallText>
                </div>
                <SmallText>{formatRange(course.startTime, course.endTime)}</SmallText>
              </CourseRow>
            ))}
        </CourseList>
        <Label style={{ marginTop: 10 }}>시간</Label>
        <Row>
          <TimeSelect>
            <SelectBox
              ariaLabel="시"
              value={startHour}
              onChange={onChangeStartHour}
              placeholder="시"
              options={hours24.map((hour) => ({ label: hour, value: hour }))}
            />
          </TimeSelect>
          <span>:</span>
          <TimeSelect>
            <SelectBox
              ariaLabel="분"
              value={startMin}
              onChange={onChangeStartMin}
              placeholder="분"
              options={mins5.map((minute) => ({ label: minute, value: minute }))}
            />
          </TimeSelect>
          <span>~</span>
          <TimeSelect>
            <SelectBox
              ariaLabel="시"
              value={endHour}
              onChange={onChangeEndHour}
              placeholder="시"
              options={hours24.map((hour) => ({ label: hour, value: hour }))}
            />
          </TimeSelect>
          <span>:</span>
          <TimeSelect>
            <SelectBox
              ariaLabel="분"
              value={endMin}
              onChange={onChangeEndMin}
              placeholder="분"
              options={mins5.map((minute) => ({ label: minute, value: minute }))}
            />
          </TimeSelect>
        </Row>
        {addErr && <Err>{addErr}</Err>}
        <BtnRow>
          <UIGhostButton type="button" onClick={onClose}>
            취소
          </UIGhostButton>
          <UIPrimaryButton type="button" disabled={savingClass} onClick={onSave}>
            {savingClass ? "저장 중…" : "저장"}
          </UIPrimaryButton>
        </BtnRow>
      </ModalCard>
    </ModalBackdrop>
  );
}

function hhmm(value?: string | null) {
  if (!value) return "--:--";
  try {
    const str = String(value);
    const match = str.match(/(\d{2}):(\d{2})/);
    return match ? `${match[1]}:${match[2]}` : "--:--";
  } catch {
    return "--:--";
  }
}

function formatRange(start?: string | null, end?: string | null) {
  return `${hhmm(start)} ~ ${hhmm(end)}`;
}

const ModalBackdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.28);
  display: grid;
  place-items: center;
  z-index: 1200;
`;

const ModalCard = styled.div`
  width: 480px;
  max-width: calc(100% - 32px);
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  box-shadow: 0 8px 28px rgba(2, 6, 23, 0.08);
  padding: 18px;
`;

const ModalTitle = styled.h3`
  margin: 0 0 10px;
  font-size: 17px;
  font-weight: 700;
  color: #111827;
`;

const Label = styled.label`
  display: block;
  margin: 8px 0 6px;
  font-size: 12px;
  color: #6b7280;
`;

const Input = styled.input`
  width: 100%;
  height: 40px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 0 12px;
`;

const CourseList = styled.div`
  max-height: 220px;
  overflow: auto;
  border: 1px solid #f1f5f9;
  border-radius: 10px;
  margin-top: 6px;
  background: #fff;
`;

const CourseRow = styled.div`
  padding: 8px 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  border-bottom: 1px solid #f1f5f9;

  &[data-selected="true"] {
    background: #eef2ff;
  }

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceMuted};
  }
`;

const SmallText = styled.span`
  color: #9ca3af;
  font-size: 12px;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const TimeSelect = styled.div`
  flex: 1;
  min-width: 0;
`;

const BtnRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 12px;
`;

const Err = styled.div`
  color: #b91c1c;
  font-size: 12px;
  margin-top: 6px;
`;

const Muted = styled.div`
  color: #6b7280;
  font-size: 12px;
`;
