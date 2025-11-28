import type { RefObject } from "react";
import type { useStudentForm } from "@/features/studentForm/useStudentForm";
import {
  Section,
  SectionHeader,
  SectionTitle,
  SectionLead,
  Grid,
  Field,
  Label,
  Input,
  TripleGrid,
  Help,
  LabelHint,
  FieldErr,
  StatusSwitch,
  StatusButton,
} from "./StudentForm.styles";
import SelectBox from "@/components/common/SelectBox";

type StudentFormState = ReturnType<typeof useStudentForm>;

type StudentFormMainProps = {
  flow: StudentFormState;
  nameInputRef: RefObject<HTMLInputElement>;
};

export function StudentFormMain({ flow, nameInputRef }: StudentFormMainProps) {
  const {
    form,
    setForm,
    fieldErr,
    setFieldErr,
    touched,
    setTouched,
    statusOptions,
    currentStatus,
    currentStatusCopy,
    saving,
    dob,
  } = flow;

  return (
    <>
      <Section>
        <SectionHeader>
          <SectionTitle>기본 정보</SectionTitle>
          <SectionLead>수업 및 청구에 사용되는 핵심 정보입니다.</SectionLead>
        </SectionHeader>
        <Grid>
          <Field>
            <Label>
              이름<span>*</span>
            </Label>
            <Input
              ref={nameInputRef}
              value={form.name}
              onChange={(event) => {
                const nextName = event.target.value;
                setForm((prev) => ({ ...prev, name: nextName }));
                if (fieldErr.name) {
                  setFieldErr((prev) => ({ ...prev, name: undefined }));
                }
              }}
              onBlur={() => setTouched((prev) => ({ ...prev, name: true }))}
              placeholder="홍길동"
              required
              disabled={saving}
              aria-invalid={Boolean(touched.name && fieldErr.name)}
              aria-describedby={
                touched.name && fieldErr.name ? "err-name" : undefined
              }
            />
            {touched.name && fieldErr.name ? (
              <FieldErr id="err-name">{fieldErr.name}</FieldErr>
            ) : null}
            <Help>출석부/청구서에 표시될 이름입니다.</Help>
          </Field>

          <Field style={{ gridColumn: "1 / -1" }}>
            <Label>상태</Label>
            <StatusSwitch>
              {statusOptions.map((option) => (
                <StatusButton
                  key={option.value}
                  type="button"
                  data-active={currentStatus === option.value}
                  onClick={() =>
                    setForm((prev) => ({ ...prev, status: option.value }))
                  }
                  disabled={saving}
                >
                  {option.label}
                </StatusButton>
              ))}
            </StatusSwitch>
            <Help>{currentStatusCopy}</Help>
          </Field>

          <Field>
            <Label>생년월일</Label>
            <TripleGrid>
              <SelectBox
                ariaLabel="생년월일 연도"
                placeholder="연도"
                value={dob.y}
                onChange={(value) => dob.update(value || "", undefined, undefined)}
                disabled={saving}
                options={dob.years.map((year) => ({
                  label: String(year),
                  value: String(year),
                }))}
              />
              <SelectBox
                ariaLabel="생년월일 월"
                placeholder="월"
                value={dob.m}
                onChange={(value) => dob.update(undefined, value || "", undefined)}
                disabled={saving}
                options={dob.months.map((month) => ({
                  label: String(month),
                  value: String(month),
                }))}
              />
              <SelectBox
                ariaLabel="생년월일 일"
                placeholder="일"
                value={dob.d}
                onChange={(value) => dob.update(undefined, undefined, value || "")}
                disabled={saving}
                options={dob.days.map((day) => ({
                  label: String(day),
                  value: String(day),
                }))}
              />
            </TripleGrid>
            <Help>생년월일 입력 시 나이는 자동 계산됩니다.</Help>
          </Field>

          <Field>
            <Label>연락처</Label>
            <Input
              value={form.phoneNumber ?? ""}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  phoneNumber: event.target.value || undefined,
                }))
              }
              placeholder="010-1234-5678"
              disabled={saving}
            />
            <Help>가능한 경우 학부모 연락처와 구분해서 입력하세요.</Help>
          </Field>

          <Field>
            <Label>등록일</Label>
            <Input
              type="text"
              lang="ko-KR"
              inputMode="numeric"
              placeholder="YYYY-MM-DD"
              value={form.joinedDate ?? ""}
              readOnly
              disabled
            />
          </Field>
        </Grid>
      </Section>

      <Section>
        <SectionHeader>
          <SectionTitle>부모님/주소</SectionTitle>
          <SectionLead>
            연락 경로와 청구 주소를 정돈해 두면 업무가 편해져요.
          </SectionLead>
        </SectionHeader>
        <Grid>
          <Field>
            <Label>보호자 이름</Label>
            <Input
              value={form.guardianName ?? ""}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  guardianName: event.target.value || undefined,
                }))
              }
              placeholder="김철수"
              disabled={saving}
            />
          </Field>
          <Field>
            <Label>
              보호자 연락처
              <LabelHint>비상 연락을 위해 입력해 주세요.</LabelHint>
            </Label>
            <Input
              value={form.guardianPhone ?? ""}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  guardianPhone: event.target.value || undefined,
                }))
              }
              placeholder="010-0000-0000"
              disabled={saving}
            />
          </Field>
          <Field style={{ gridColumn: "1 / -1" }}>
            <Label>주소</Label>
            <Input
              value={form.address ?? ""}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  address: event.target.value || undefined,
                }))
              }
              placeholder="서울시 강남구 ..."
              disabled={saving}
            />
          </Field>
        </Grid>
      </Section>
    </>
  );
}
