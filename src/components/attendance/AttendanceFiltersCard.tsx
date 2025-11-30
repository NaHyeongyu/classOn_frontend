import { type FormEvent } from "react";
import {
  ApplyButton,
  ButtonRow,
  ErrorText,
  Field,
  Filters,
  QuickButton,
  QuickButtons,
  ResetButton,
  SearchField,
  SearchInput,
  FiltersForm,
} from "./Attendance.styles";

type AttendanceFiltersCardProps = {
  formDate: string;
  onChangeDate: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onQuickSelect: (offset: number) => void;
  courseSearch: string;
  onChangeCourseSearch: (value: string) => void;
  onResetFilters: () => void;
  error?: string | null;
};

export function AttendanceFiltersCard({
  formDate,
  onChangeDate,
  onSubmit,
  onQuickSelect,
  courseSearch,
  onChangeCourseSearch,
  onResetFilters,
  error,
}: AttendanceFiltersCardProps) {
  return (
    <FiltersForm onSubmit={onSubmit}>
      <Filters>
        <Field>
          <label htmlFor="attendance-date">날짜</label>
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
        <SearchField>
          <label htmlFor="attendance-course-search">수업 이름</label>
          <SearchInput
            id="attendance-course-search"
            type="text"
            placeholder="수업명을 입력하세요."
            value={courseSearch}
            onChange={(event) => onChangeCourseSearch(event.target.value)}
          />
        </SearchField>
        <ButtonRow>
          <ApplyButton type="submit">조회</ApplyButton>
          <ResetButton type="button" onClick={onResetFilters}>
            초기화
          </ResetButton>
        </ButtonRow>
      </Filters>
      {error ? <ErrorText>{error}</ErrorText> : null}
    </FiltersForm>
  );
}
