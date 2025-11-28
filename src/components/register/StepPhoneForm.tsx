import type { FormEventHandler } from "react";
import { PrimaryButtonLg as UIPrimaryBtn } from "@/components/common/UI";
import { Sub, Form, Label, Input, Hint, ErrorText } from "./RegisterForm.styles";

type StepPhoneFormProps = {
  phone: string;
  setPhone: (value: string) => void;
  normalizeMobile: (value: string) => string | null;
  onSubmit: FormEventHandler<HTMLFormElement>;
  stepError?: string;
  error: string | null;
};

export function StepPhoneForm({
  phone,
  setPhone,
  normalizeMobile,
  onSubmit,
  stepError,
  error,
}: StepPhoneFormProps) {
  return (
    <>
      <Sub>휴대폰 번호를 입력해 주세요. 인증번호를 보내 드립니다.</Sub>
      <Form onSubmit={onSubmit}>
        <Label>
          휴대폰<span>*</span>
        </Label>
        <Input
          value={phone}
          inputMode="tel"
          autoComplete="tel"
          onChange={(event) => setPhone(event.target.value)}
          placeholder="010-1234-5678"
          onBlur={(event) => {
            const normalized = normalizeMobile(event.currentTarget.value);
            setPhone(normalized ?? event.currentTarget.value.trim());
          }}
          aria-invalid={Boolean(stepError)}
          required
        />
        {stepError && <Hint danger>{stepError}</Hint>}
        {!stepError && <Hint>입력하신 번호로 문자 인증번호를 발송합니다.</Hint>}
        {error && <ErrorText>{error}</ErrorText>}
        <UIPrimaryBtn type="submit">인증번호 받기</UIPrimaryBtn>
      </Form>
    </>
  );
}
