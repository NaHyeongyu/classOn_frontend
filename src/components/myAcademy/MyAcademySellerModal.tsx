import Modal from "@/components/common/Modal";
import {
  ModalActions,
  ModalError,
  ModalForm,
  ModalGhostButton,
  ModalHint,
  ModalInput,
  ModalLabel,
  ModalPrimaryButton,
  ModalSelect,
} from "@/components/myAcademy/MyAcademyModalStyles";
import { BANK_OPTIONS } from "@/features/myAcademy/banks";
import type { FormEvent } from "react";
import styled from "styled-components";

type SellerFormState = {
  businessType: "INDIVIDUAL" | "INDIVIDUAL_BUSINESS" | "CORPORATE";
  refSellerId: string;
  companyName: string;
  representativeName: string;
  businessRegistrationNumber: string;
  companyEmail: string;
  companyPhone: string;
  accountBankCode: string;
  accountNumber: string;
  accountHolderName: string;
};

export type SellerModalState = {
  open: boolean;
  creating: boolean;
  submitting: boolean;
  error: string | null;
  form: SellerFormState;
  updateField: <K extends keyof SellerFormState>(field: K, value: SellerFormState[K]) => void;
  submit: (event: FormEvent<HTMLFormElement>) => void | Promise<void>;
  closeModal: () => void;
};

type Props = {
  modal: SellerModalState;
};

const BUSINESS_TYPES: { value: SellerModalState["form"]["businessType"]; label: string }[] = [
  { value: "INDIVIDUAL", label: "개인" },
  { value: "INDIVIDUAL_BUSINESS", label: "개인사업자" },
  { value: "CORPORATE", label: "법인사업자" },
] as const;

export function MyAcademySellerModal({ modal }: Props) {
  const selectedBank = BANK_OPTIONS.find(
    (bank) => bank.code === modal.form.accountBankCode,
  );

  return (
    <Modal
      open={modal.open}
      onClose={modal.closeModal}
      title={modal.creating ? "결제 관리 등록" : "결제 관리 수정"}
    >
      <ModalForm onSubmit={modal.submit}>
        <ModalLabel htmlFor="seller-ref-id">셀러 ID (자동 생성)</ModalLabel>
        <ModalInput
          id="seller-ref-id"
          value={modal.form.refSellerId}
          readOnly
          disabled
          placeholder="예: academy_seller_1"
        />
        <ModalHint>플랫폼에서 자동 발급해 사용하는 고유 ID입니다.</ModalHint>

        <ModalLabel htmlFor="seller-business-type">사업자 유형</ModalLabel>
        <ModalSelect
          id="seller-business-type"
          value={modal.form.businessType}
          onChange={(event) =>
            modal.updateField("businessType", event.target.value as SellerModalState["form"]["businessType"])
          }
        >
          {BUSINESS_TYPES.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </ModalSelect>

        <ModalLabel htmlFor="seller-company-name">사업자명</ModalLabel>
        <ModalInput
          id="seller-company-name"
          value={modal.form.companyName}
          onChange={(event) => modal.updateField("companyName", event.target.value)}
          placeholder="사업자명을 입력하세요"
        />

        <ModalLabel htmlFor="seller-representative">대표자명</ModalLabel>
        <ModalInput
          id="seller-representative"
          value={modal.form.representativeName}
          onChange={(event) => modal.updateField("representativeName", event.target.value)}
          placeholder="대표자명을 입력하세요"
        />

        <ModalLabel htmlFor="seller-biz-no">사업자등록번호</ModalLabel>
        <ModalInput
          id="seller-biz-no"
          value={modal.form.businessRegistrationNumber}
          onChange={(event) => modal.updateField("businessRegistrationNumber", event.target.value)}
          placeholder="하이픈 없이 숫자만 입력"
        />

        <ModalLabel htmlFor="seller-email">사업자 이메일</ModalLabel>
        <ModalInput
          id="seller-email"
          type="email"
          value={modal.form.companyEmail}
          onChange={(event) => modal.updateField("companyEmail", event.target.value)}
          placeholder="billing@example.com"
        />

        <ModalLabel htmlFor="seller-phone">사업자 전화번호</ModalLabel>
        <ModalInput
          id="seller-phone"
          value={modal.form.companyPhone}
          onChange={(event) => modal.updateField("companyPhone", event.target.value)}
          placeholder="숫자만 입력"
        />

        <ModalLabel>은행 선택</ModalLabel>
        <BankGrid>
          {BANK_OPTIONS.map((bank) => (
            <BankButton
              key={bank.code}
              type="button"
              data-active={modal.form.accountBankCode === bank.code}
              onClick={() => modal.updateField("accountBankCode", bank.code)}
            >
              {bank.name}
            </BankButton>
          ))}
        </BankGrid>
        <ModalHint>
          선택된 은행: {selectedBank ? `${selectedBank.name} (${selectedBank.code})` : "미선택"}
        </ModalHint>

        <ModalLabel htmlFor="seller-account-number">계좌번호</ModalLabel>
        <ModalInput
          id="seller-account-number"
          value={modal.form.accountNumber}
          onChange={(event) => modal.updateField("accountNumber", event.target.value)}
          placeholder="하이픈 없이 입력"
        />

        <ModalLabel htmlFor="seller-holder-name">예금주명</ModalLabel>
        <ModalInput
          id="seller-holder-name"
          value={modal.form.accountHolderName}
          onChange={(event) => modal.updateField("accountHolderName", event.target.value)}
          placeholder="예금주명을 입력하세요"
        />

        {modal.error ? <ModalError>{modal.error}</ModalError> : null}

        <ModalActions>
          <ModalGhostButton type="button" onClick={modal.closeModal}>
            취소
          </ModalGhostButton>
          <ModalPrimaryButton type="submit" disabled={modal.submitting}>
            {modal.submitting ? "저장 중..." : modal.creating ? "등록하기" : "수정하기"}
          </ModalPrimaryButton>
        </ModalActions>
      </ModalForm>
    </Modal>
  );
}

const BankGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 8px;
`;

const BankButton = styled.button`
  border: 1px solid #e5e7eb;
  background: #f9fafb;
  color: #374151;
  font-size: 13px;
  border-radius: 10px;
  padding: 10px;
  cursor: pointer;
  &[data-active="true"] {
    background: #4f46e5;
    color: #fff;
    border-color: transparent;
  }
`;
