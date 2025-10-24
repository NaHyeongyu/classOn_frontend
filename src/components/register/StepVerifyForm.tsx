import type { FormEventHandler } from "react";
import { PrimaryButtonLg as UIPrimaryBtn } from "@/components/common/UI";
import { Sub, Form, Label, Input, Row, SmallButton, Hint, ErrorText } from "./RegisterForm.styles";
import { formatPhone } from "@/lib/format";

type StepVerifyFormProps = {
  phone: string;
  code: string;
  setCode: (value: string) => void;
  resendCooldown: number;
  onResendCode: () => Promise<void>;
  onSubmit: FormEventHandler<HTMLFormElement>;
  onBackToPhone: () => void;
  devCodeHint: string | null;
  stepError?: string;
  error: string | null;
};

export function StepVerifyForm({
  phone,
  code,
  setCode,
  resendCooldown,
  onResendCode,
  onSubmit,
  onBackToPhone,
  devCodeHint,
  stepError,
  error,
}: StepVerifyFormProps) {
  return (
    <>
      <Sub>인증 번호를 보냈어요. 3분 내 입력해 주세요.</Sub>
      <Form onSubmit={onSubmit}>
        <Label>휴대폰 번호</Label>
        <Row>
          <Input style={{ flex: 1 }} value={formatPhone(phone)} disabled />
          <SmallButton type="button" onClick={onBackToPhone}>
            번호 변경
          </SmallButton>
        </Row>

        <Label>
          인증코드<span>*</span>
        </Label>
        <Row>
          <Input
            style={{ flex: 1 }}
            value={code}
            onChange={(event) => setCode(event.target.value)}
            placeholder="6자리"
            aria-invalid={Boolean(stepError)}
            required
          />
          <SmallButton
            type="button"
            onClick={() => {
              void onResendCode();
            }}
            disabled={resendCooldown > 0}
          >
            {resendCooldown > 0 ? `${resendCooldown}s` : "재전송"}
          </SmallButton>
        </Row>

        {stepError && <Hint danger>{stepError}</Hint>}
        {devCodeHint && <Hint>인증코드 힌트: {devCodeHint}</Hint>}
        {error && <ErrorText>{error}</ErrorText>}

        <UIPrimaryBtn type="submit">다음</UIPrimaryBtn>
      </Form>
    </>
  );
}
