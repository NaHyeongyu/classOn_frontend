import { type FormEvent } from "react";
import { Card } from "./Attendance.styles";
import {
  ApplyButton,
  ErrorText,
  Field,
  Filters,
  QuickButton,
  QuickButtons,
} from "./Attendance.styles";

type AttendanceFiltersCardProps = {
  formDate: string;
  onChangeDate: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onQuickSelect: (offset: number) => void;
  error?: string | null;
};

export function AttendanceFiltersCard({
  formDate,
  onChangeDate,
  onSubmit,
  onQuickSelect,
  error,
}: AttendanceFiltersCardProps) {
  return (
    <Card as="form" onSubmit={onSubmit}>
      <Filters>
        <Field>
          <label htmlFor="attendance-date">조회일</label>
          <input
            id="attendance-date"
            type="date"
            value={formDate}
            onChange={(event) => onChangeDate(event.target.value)}
          />
        </Field>
        <QuickButtons>
          <QuickButton type="button" onClick={() => onQuickSelect(0)}>
            오늘
          </QuickButton>
          <QuickButton type="button" onClick={() => onQuickSelect(-1)}>
            어제
          </QuickButton>
          <QuickButton type="button" onClick={() => onQuickSelect(-2)}>
            이틀 전
          </QuickButton>
        </QuickButtons>
        <ApplyButton type="submit">조회</ApplyButton>
      </Filters>
      {error ? <ErrorText>{error}</ErrorText> : null}
    </Card>
  );
}
