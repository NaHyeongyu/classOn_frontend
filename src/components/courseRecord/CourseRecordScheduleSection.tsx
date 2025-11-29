import styled from "styled-components";
import SelectBox from "@/components/common/SelectBox";
import {
  SectionCard as Section,
  TitleH3 as Title,
  Skeleton as UISkeleton,
} from "@/components/common/UI";
import {
  SmallBtn,
  Hint,
  SmallMuted,
  AlertError,
  DateBadge,
  TimePill,
} from "@/components/courseRecord/CourseRecordStyles";
import {
  HOUR_OPTIONS,
  MINUTE_OPTIONS,
} from "@/components/courseForm/courseFormHelpers";

const HOUR_SELECT_OPTIONS = HOUR_OPTIONS.map((value) => ({
  label: value,
  value,
}));
const MINUTE_SELECT_OPTIONS = MINUTE_OPTIONS.map((value) => ({
  label: value,
  value,
}));

type Props = {
  headLoading: boolean;
  editing: boolean;
  displayDateValue: string;
  displayTimeValue: string;
  durationLabel: string;
  instructorName?: string | null;
  onStartEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  saveDisabled: boolean;
  editDate: string;
  editStart: string;
  editEnd: string;
  onChangeDate: (value: string) => void;
  onChangeStart: (value: string) => void;
  onChangeEnd: (value: string) => void;
  previewDateLabel: string;
  previewTimeLabel: string;
  previewDateEmpty: boolean;
  previewTimeEmpty: boolean;
  showCreationHint: boolean;
  whenError: string | null;
};

export function CourseRecordScheduleSection({
  headLoading,
  editing,
  displayDateValue,
  displayTimeValue,
  durationLabel,
  instructorName,
  onStartEdit,
  onSave,
  onCancel,
  saveDisabled,
  editDate,
  editStart,
  editEnd,
  onChangeDate,
  onChangeStart,
  onChangeEnd,
  previewDateLabel,
  previewTimeLabel,
  previewDateEmpty,
  previewTimeEmpty,
  showCreationHint,
  whenError,
}: Props) {
  return (
    <Section>
      <SectionHeader>
        <Title>일정/시간</Title>
        {!editing ? (
          <SmallBtn type="button" onClick={onStartEdit}>
            편집
          </SmallBtn>
        ) : (
          <div style={{ display: "inline-flex", gap: 8 }}>
            <SmallBtn type="button" onClick={onSave} disabled={saveDisabled}>
              저장
            </SmallBtn>
            <SmallBtn type="button" onClick={onCancel}>
              취소
            </SmallBtn>
          </div>
        )}
      </SectionHeader>

      {!editing ? (
        <InfoList>
          <li>
            <Label>수업일</Label>
            {headLoading ? (
              <Value>
                <UISkeleton w={140} h={14} />
              </Value>
            ) : (
              <StrongValue>{displayDateValue}</StrongValue>
            )}
          </li>
          <li>
            <Label>수업시간</Label>
            {headLoading ? (
              <Value>
                <UISkeleton w={160} h={14} />
              </Value>
            ) : (
              <StrongValue>{displayTimeValue}</StrongValue>
            )}
          </li>
          <li>
            <Label>담당 강사</Label>
            {headLoading ? (
              <Value>
                <UISkeleton w={120} h={14} />
              </Value>
            ) : (
              <StrongValue>{instructorName?.trim().length ? instructorName : "-"}</StrongValue>
            )}
          </li>
          <li>
            <Label>진행 시간</Label>
            {headLoading ? (
              <Value>
                <UISkeleton w={90} h={14} />
              </Value>
            ) : (
              <StrongValue>{durationLabel}</StrongValue>
            )}
          </li>
        </InfoList>
      ) : (
        <InfoList>
          <li>
            <Label>날짜</Label>
            <Value>
              <Input
                type="date"
                value={editDate}
                onChange={(e) => onChangeDate(e.currentTarget.value)}
              />
            </Value>
          </li>
          <li>
            <Label>시간</Label>
            <Value style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
              <TimePicker>
                <TimeSelect
                  ariaLabel="시작 시간 시"
                  value={getHourPart(editStart)}
                  onChange={(value) =>
                    onChangeStart(mergeTimeParts(value, getMinutePart(editStart)))
                  }
                  options={HOUR_SELECT_OPTIONS}
                />
                <TimeSeparator>:</TimeSeparator>
                <TimeSelect
                  ariaLabel="시작 시간 분"
                  value={getMinutePart(editStart)}
                  onChange={(value) =>
                    onChangeStart(mergeTimeParts(getHourPart(editStart), value))
                  }
                  options={MINUTE_SELECT_OPTIONS}
                />
              </TimePicker>
              <span>~</span>
              <TimePicker>
                <TimeSelect
                  ariaLabel="종료 시간 시"
                  value={getHourPart(editEnd)}
                  onChange={(value) =>
                    onChangeEnd(mergeTimeParts(value, getMinutePart(editEnd)))
                  }
                  options={HOUR_SELECT_OPTIONS}
                />
                <TimeSeparator>:</TimeSeparator>
                <TimeSelect
                  ariaLabel="종료 시간 분"
                  value={getMinutePart(editEnd)}
                  onChange={(value) =>
                    onChangeEnd(mergeTimeParts(getHourPart(editEnd), value))
                  }
                  options={MINUTE_SELECT_OPTIONS}
                />
              </TimePicker>
            </Value>
          </li>
          <PreviewRow>
            <PreviewLabel>미리보기</PreviewLabel>
            <PreviewMeta>
              <DateBadge data-empty={String(previewDateEmpty)}>
                {previewDateLabel}
              </DateBadge>
              <TimePill data-empty={String(previewTimeEmpty)}>
                {previewTimeLabel}
              </TimePill>
            </PreviewMeta>
          </PreviewRow>
          <RowHelp>
            {showCreationHint && <Hint>저장 시 새 수업 내역을 생성합니다.</Hint>}
            {saveDisabled && <SmallMuted>저장 중...</SmallMuted>}
            {whenError && <AlertError style={{ marginLeft: 8 }}>{whenError}</AlertError>}
          </RowHelp>
        </InfoList>
      )}
    </Section>
  );
}

function getHourPart(value?: string) {
  if (!value) return "";
  return value.slice(0, 2) || "";
}

function getMinutePart(value?: string) {
  if (!value) return "";
  return value.slice(3, 5) || "";
}

function mergeTimeParts(hour: string, minute: string) {
  if (!hour && !minute) return "";
  const hh = hour || "00";
  const mm = minute || "00";
  return `${hh}:${mm}`;
}
const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const InfoList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 12px;
  li {
    display: grid;
    grid-template-columns: 110px 1fr;
    align-items: center;
  }
`;

const Label = styled.span`
  color: #6b7280;
  font-size: 12px;
  font-weight: 700;
`;

const Value = styled.div`
  color: #111827;
  font-size: 14px;
  display: flex;
  align-items: center;
  min-height: 20px;
  column-gap: 6px;
`;

const StrongValue = styled(Value)`
  font-weight: 800;
  font-size: 15px;
`;

const PreviewRow = styled.div`
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border: 1px dashed #e5e7eb;
  border-radius: 10px;
  background: #f9fafb;
`;

const PreviewLabel = styled.span`
  color: #6b7280;
  font-size: 12px;
  font-weight: 700;
`;

const PreviewMeta = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  align-items: center;
`;

const Input = styled.input`
  height: 32px;
  padding: 0 10px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 13px;
`;
const TimePicker = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
`;
const TimeSeparator = styled.span`
  color: #6b7280;
  font-weight: 700;
`;
const TimeSelect = styled(SelectBox)`
  min-width: 80px;
`;

const RowHelp = styled.div`
  grid-column: 1 / -1;
  display: flex;
  gap: 8px;
  align-items: center;
  margin-top: 2px;
`;
