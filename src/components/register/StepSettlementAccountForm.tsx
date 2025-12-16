import type { FormEventHandler } from "react";
import styled from "styled-components";
import { PrimaryButtonLg as UIPrimaryBtn } from "@/components/common/UI";
import type { UseRegisterFlowResult } from "@/features/register/useRegisterFlow";
import { BANK_OPTIONS } from "@/features/myAcademy/banks";
import {
  ActionRow,
  BackButton,
  ErrorText,
  Form,
  Hint,
  Input,
  Label,
  Row,
  Sub,
} from "./RegisterForm.styles";

type StepSettlementAccountFormProps = {
  flow: UseRegisterFlowResult;
  onSubmit: FormEventHandler<HTMLFormElement>;
  onBack: () => void;
};

const BUSINESS_TYPES: Array<{ value: UseRegisterFlowResult["settlementForm"]["businessType"]; label: string }> = [
  { value: "INDIVIDUAL", label: "개인" },
  { value: "INDIVIDUAL_BUSINESS", label: "개인사업자" },
  { value: "CORPORATE", label: "법인사업자" },
];

export function StepSettlementAccountForm({ flow, onSubmit, onBack }: StepSettlementAccountFormProps) {
  const { settlementForm, updateSettlementField, canSubmitSettlement, loading, error } = flow;

  return (
    <>
      <Sub>Plus 요금제를 이용하려면 정산 계좌 등록이 필요합니다.</Sub>
      <Form onSubmit={onSubmit}>
        <Hint>
          입력한 정보는 토스페이먼츠로 전달되며, 등록 후 이메일/휴대폰 인증을 완료해야 정산이 가능합니다.
        </Hint>

        <Label>
          사업자 유형<span>*</span>
        </Label>
        <Select
          value={settlementForm.businessType}
          onChange={(event) =>
            updateSettlementField(
              "businessType",
              event.target.value as UseRegisterFlowResult["settlementForm"]["businessType"],
            )
          }
        >
          {BUSINESS_TYPES.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </Select>

        {settlementForm.businessType === "INDIVIDUAL" ? (
          <>
            <Label>
              개인 이름<span>*</span>
            </Label>
            <Input
              value={settlementForm.individualName}
              onChange={(event) => updateSettlementField("individualName", event.target.value)}
              placeholder="예: 홍길동"
              required
            />

            <Label>
              개인 이메일<span>*</span>
            </Label>
            <Input
              type="email"
              value={settlementForm.individualEmail}
              onChange={(event) => updateSettlementField("individualEmail", event.target.value)}
              placeholder="personal@example.com"
              required
            />

            <Label>
              개인 연락처<span>*</span>
            </Label>
            <Input
              value={settlementForm.individualPhone}
              onChange={(event) => updateSettlementField("individualPhone", event.target.value)}
              placeholder="숫자만 입력"
              required
            />
          </>
        ) : (
          <>
            <Label>
              사업자명<span>*</span>
            </Label>
            <Input
              value={settlementForm.companyName}
              onChange={(event) => updateSettlementField("companyName", event.target.value)}
              placeholder="사업자명을 입력하세요"
              required
            />

            <Label>
              대표자명<span>*</span>
            </Label>
            <Input
              value={settlementForm.representativeName}
              onChange={(event) => updateSettlementField("representativeName", event.target.value)}
              placeholder="대표자명을 입력하세요"
              required
            />

            <Label>사업자등록번호</Label>
            <Input
              value={settlementForm.businessRegistrationNumber}
              onChange={(event) => updateSettlementField("businessRegistrationNumber", event.target.value)}
              placeholder="숫자만 입력"
              required
            />

            <Label>
              사업자 이메일<span>*</span>
            </Label>
            <Input
              type="email"
              value={settlementForm.companyEmail}
              onChange={(event) => updateSettlementField("companyEmail", event.target.value)}
              placeholder="billing@example.com"
              required
            />

            <Label>
              사업자 전화번호<span>*</span>
            </Label>
            <Input
              value={settlementForm.companyPhone}
              onChange={(event) => updateSettlementField("companyPhone", event.target.value)}
              placeholder="숫자만 입력"
              required
            />
          </>
        )}

        <Label>
          은행<span>*</span>
        </Label>
        <Select
          value={settlementForm.bankCode}
          onChange={(event) => updateSettlementField("bankCode", event.target.value)}
          required
        >
          <option value="">은행을 선택하세요</option>
          {BANK_OPTIONS.map((bank) => (
            <option key={bank.code} value={bank.code}>
              {bank.name} ({bank.code})
            </option>
          ))}
        </Select>

        <Row>
          <div style={{ flex: 1 }}>
            <Label>
              계좌번호<span>*</span>
            </Label>
            <Input
              value={settlementForm.accountNumber}
              onChange={(event) => updateSettlementField("accountNumber", event.target.value)}
              placeholder="하이픈 없이 입력"
              required
            />
          </div>
        </Row>

        <Label>
          예금주명<span>*</span>
        </Label>
        <Input
          value={settlementForm.accountHolderName}
          onChange={(event) => updateSettlementField("accountHolderName", event.target.value)}
          placeholder="예금주명을 입력하세요"
          required
        />

        {error && <ErrorText>{error}</ErrorText>}

        <ActionRow>
          <BackButton label="이전" onClick={onBack} />
          <UIPrimaryBtn type="submit" disabled={!canSubmitSettlement}>
            {loading ? "완료 중..." : "가입 완료"}
          </UIPrimaryBtn>
        </ActionRow>
      </Form>
    </>
  );
}

const Select = styled.select`
  height: 64px;
  border: none;
  border-bottom: 2px solid ${(p) => p.theme.colors.borderMuted};
  border-radius: 0;
  padding: 0 ${(p) => p.theme.spacing.md};
  font-size: ${(p) => p.theme.font.size.lg};
  background: transparent;
  outline: none;
  transition: all 0.2s ease;
  color: ${(p) => p.theme.colors.text};

  &:focus {
    border-bottom-color: ${(p) => p.theme.colors.primary};
    background: transparent;
  }
`;
