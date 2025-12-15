import Modal from "@/components/common/Modal";
import { PrimaryButtonLg } from "@/components/common/UI";
import {
  ActionRow,
  BackButton,
  ErrorText,
  Form,
  Hint,
  Input,
  Label,
} from "@/components/register/RegisterForm.styles";
import { BANK_OPTIONS } from "@/features/myAcademy/banks";
import type { SellerModalState } from "@/features/myAcademy/hooks/useMyAcademyPage";
import styled from "styled-components";
import { useEffect, useMemo, useState } from "react";

type Props = {
  modal: SellerModalState;
};

const BUSINESS_TYPES: { value: SellerModalState["form"]["businessType"]; label: string }[] = [
  { value: "INDIVIDUAL", label: "개인" },
  { value: "INDIVIDUAL_BUSINESS", label: "개인사업자" },
  { value: "CORPORATE", label: "법인사업자" },
];

export function MyAcademySellerModal({ modal }: Props) {
  const profileLocked = !modal.creating;
  const disableProfileField = profileLocked || modal.submitting;
  const disableAccountField = modal.submitting;
  const [attempted, setAttempted] = useState(false);

  useEffect(() => {
    if (!modal.open) return;
    setAttempted(false);
  }, [modal.open]);

  const digitsOnly = (value: string) => value.replace(/\D/g, "");

  const validation = useMemo(() => {
    const bankOk = modal.form.accountBankCode.trim().length > 0;
    const accountOk = digitsOnly(modal.form.accountNumber).length > 0;
    const holderOk = modal.form.accountHolderName.trim().length > 0;
    const baseOk = bankOk && accountOk && holderOk;

    if (profileLocked) {
      return { canSubmit: baseOk && !modal.submitting };
    }

    const businessOk =
      modal.form.businessType === "INDIVIDUAL"
        ? modal.form.individualName.trim().length > 0 &&
          modal.form.individualEmail.trim().length > 0 &&
          digitsOnly(modal.form.individualPhone).length > 0
        : modal.form.companyName.trim().length > 0 &&
          modal.form.representativeName.trim().length > 0 &&
          modal.form.companyEmail.trim().length > 0 &&
          digitsOnly(modal.form.companyPhone).length > 0 &&
          digitsOnly(modal.form.businessRegistrationNumber).length === 10;

    return { canSubmit: baseOk && businessOk && !modal.submitting };
  }, [modal.form, modal.submitting, profileLocked]);

  return (
    <Modal
      open={modal.open}
      onClose={modal.closeModal}
      title={modal.creating ? "정산 계좌 등록" : "정산 계좌 정보 수정"}
      blockOutsideClose
    >
      <SellerForm
        onSubmit={(event) => {
          setAttempted(true);
          modal.submit(event);
        }}
      >
        <HintBox>
          {profileLocked
            ? "사업자 정보는 등록 후 수정할 수 없습니다. 정산 계좌만 변경할 수 있어요."
            : "입력한 정보는 토스페이먼츠로 전달되며, 등록 후 이메일/휴대폰 인증을 완료해야 정산이 가능합니다."}
        </HintBox>

        <Label>
          사업자 유형<span>*</span>
        </Label>
        <Select
          value={modal.form.businessType}
          onChange={(event) =>
            modal.updateField(
              "businessType",
              event.target.value as SellerModalState["form"]["businessType"],
            )
          }
          disabled={disableProfileField}
        >
          {BUSINESS_TYPES.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </Select>

        {modal.form.businessType === "INDIVIDUAL" ? (
          <>
            <Label>
              개인 이름<span>*</span>
            </Label>
            <Input
              value={modal.form.individualName}
              onChange={(event) => modal.updateField("individualName", event.target.value)}
              placeholder="예: 홍길동"
              disabled={disableProfileField}
              required
            />

            <Label>
              개인 이메일<span>*</span>
            </Label>
            <Input
              type="email"
              value={modal.form.individualEmail}
              onChange={(event) => modal.updateField("individualEmail", event.target.value)}
              placeholder="personal@example.com"
              disabled={disableProfileField}
              required
            />

            <Label>
              개인 연락처<span>*</span>
            </Label>
            <Input
              value={modal.form.individualPhone}
              onChange={(event) => modal.updateField("individualPhone", digitsOnly(event.target.value))}
              placeholder="숫자만 입력"
              disabled={disableProfileField}
              inputMode="numeric"
              autoComplete="tel"
              required
            />
          </>
        ) : (
          <>
            <Label>
              사업자명<span>*</span>
            </Label>
            <Input
              value={modal.form.companyName}
              onChange={(event) => modal.updateField("companyName", event.target.value)}
              placeholder="사업자명을 입력하세요"
              disabled={disableProfileField}
              required
              autoComplete="organization"
            />

            <Label>
              대표자명<span>*</span>
            </Label>
            <Input
              value={modal.form.representativeName}
              onChange={(event) => modal.updateField("representativeName", event.target.value)}
              placeholder="대표자명을 입력하세요"
              disabled={disableProfileField}
              required
              autoComplete="name"
            />

            <Label>
              사업자등록번호<span>*</span>
            </Label>
            <Input
              value={modal.form.businessRegistrationNumber}
              onChange={(event) =>
                modal.updateField(
                  "businessRegistrationNumber",
                  digitsOnly(event.target.value).slice(0, 10),
                )
              }
              placeholder="숫자만 입력 (10자리)"
              disabled={disableProfileField}
              inputMode="numeric"
              autoComplete="off"
              required
            />

            <Label>
              사업자 이메일<span>*</span>
            </Label>
            <Input
              type="email"
              value={modal.form.companyEmail}
              onChange={(event) => modal.updateField("companyEmail", event.target.value)}
              placeholder="billing@example.com"
              disabled={disableProfileField}
              required
              autoComplete="email"
            />

            <Label>
              사업자 전화번호<span>*</span>
            </Label>
            <Input
              value={modal.form.companyPhone}
              onChange={(event) => modal.updateField("companyPhone", digitsOnly(event.target.value))}
              placeholder="숫자만 입력"
              disabled={disableProfileField}
              inputMode="numeric"
              autoComplete="tel"
              required
            />
          </>
        )}

        <Label>
          은행<span>*</span>
        </Label>
        <Select
          value={modal.form.accountBankCode}
          onChange={(event) => modal.updateField("accountBankCode", event.target.value)}
          disabled={disableAccountField}
          required
        >
          <option value="">은행을 선택하세요</option>
          {BANK_OPTIONS.map((bank) => (
            <option key={bank.code} value={bank.code}>
              {bank.name} ({bank.code})
            </option>
          ))}
        </Select>

        <Label>
          계좌번호<span>*</span>
        </Label>
        <Input
          value={modal.form.accountNumber}
          onChange={(event) => modal.updateField("accountNumber", digitsOnly(event.target.value))}
          placeholder="하이픈 없이 입력"
          disabled={disableAccountField}
          inputMode="numeric"
          autoComplete="off"
          required
        />

        <Label>
          예금주명<span>*</span>
        </Label>
        <Input
          value={modal.form.accountHolderName}
          onChange={(event) => modal.updateField("accountHolderName", event.target.value)}
          onBlur={() => {
            if (modal.form.accountHolderName.trim()) return;
            const fallback =
              modal.form.representativeName.trim() ||
              modal.form.companyName.trim() ||
              modal.form.individualName.trim();
            if (fallback) modal.updateField("accountHolderName", fallback);
          }}
          placeholder="예금주명을 입력하세요"
          disabled={disableAccountField}
          autoComplete="name"
          required
        />

        {attempted && !validation.canSubmit ? (
          <Hint danger>필수 정보를 모두 입력해 주세요.</Hint>
        ) : null}

        {modal.error ? <ErrorText>{modal.error}</ErrorText> : null}

        <ActionRow>
          <BackButton type="button" onClick={modal.closeModal}>
            취소
          </BackButton>
          <PrimaryButtonLg type="submit" disabled={!validation.canSubmit}>
            {modal.submitting ? "저장 중..." : modal.creating ? "등록하기" : "수정하기"}
          </PrimaryButtonLg>
        </ActionRow>
      </SellerForm>
    </Modal>
  );
}

const SellerForm = styled(Form)`
  margin: 0;
  max-width: 560px;
`;

const HintBox = styled(Hint)`
  margin-top: 0;
`;

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
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
