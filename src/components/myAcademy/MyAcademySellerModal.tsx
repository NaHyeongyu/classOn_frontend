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
} from "@/components/myAcademy/MyAcademyModalStyles";
import { BANK_OPTIONS } from "@/features/myAcademy/banks";
import type { SellerModalState } from "@/features/myAcademy/hooks/useMyAcademyPage";
import styled from "styled-components";
import { apiSyncSeller } from "@/api/account";
import { useToast } from "@/components/common/Toast";
import { useState } from "react";
import SelectBox from "@/components/common/SelectBox";

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
  const profileLocked = !modal.creating;
  const disableProfileField = profileLocked || modal.submitting;
  const disableAccountField = modal.submitting;
  const toast = useToast();
  const [syncing, setSyncing] = useState(false);

  const handleSync = async () => {
    if (syncing) return;
    setSyncing(true);
    try {
      await apiSyncSeller();
      toast.success("토스 정보와 동기화되었습니다.");
      modal.closeModal();
    } catch {
      toast.error("동기화에 실패했습니다.");
    } finally {
      setSyncing(false);
    }
  };

  return (
    <Modal
      open={modal.open}
      onClose={modal.closeModal}
      title={modal.creating ? "셀러 등록" : "셀러 정보 수정"}
      blockOutsideClose
    >
      <ModalForm onSubmit={modal.submit}>
        <Notice tone={profileLocked ? "warning" : "info"}>
          {profileLocked
            ? "사업자 정보는 등록 후 수정할 수 없습니다. 정산 계좌만 변경할 수 있어요."
            : "셀러 등록 요청 시 입력한 사업자·계좌 정보가 토스페이먼츠에 전달됩니다."}
        </Notice>

        {/* refSellerId is now auto-generated, so we can hide it or show it as read-only system ID */}
        <ModalLabel htmlFor="seller-ref-id">셀러 ID (시스템 자동생성)</ModalLabel>
        <ModalInput
          id="seller-ref-id"
          value={modal.form.refSellerId || "(자동 생성됨)"}
          readOnly
          disabled
          placeholder="시스템 자동 생성"
        />

        {modal.form.tossSellerId ? (
          <>
            <ModalLabel htmlFor="seller-toss-id">토스 셀러 ID</ModalLabel>
            <div style={{ display: 'flex', gap: '8px' }}>
              <ModalInput
                id="seller-toss-id"
                value={modal.form.tossSellerId}
                readOnly
                disabled
                placeholder="토스에서 발급된 ID"
                style={{ flex: 1 }}
              />
              <ModalGhostButton type="button" onClick={handleSync} disabled={syncing}>
                {syncing ? "동기화 중..." : "상태 동기화"}
              </ModalGhostButton>
            </div>
          </>
        ) : null}

        <ModalLabel htmlFor="seller-business-type">사업자 유형</ModalLabel>
        <SelectBox
          id="seller-business-type"
          ariaLabel="사업자 유형"
          value={modal.form.businessType}
          disabled={disableProfileField}
          placeholder="사업자 유형 선택"
          onChange={(value) =>
            modal.updateField("businessType", value as SellerModalState["form"]["businessType"])
          }
          options={BUSINESS_TYPES}
        />

        <ModalLabel htmlFor="seller-company-name">사업자명</ModalLabel>
        <ModalInput
          id="seller-company-name"
          value={modal.form.companyName}
          disabled={disableProfileField}
          onChange={(event) => modal.updateField("companyName", event.target.value)}
          placeholder="사업자명을 입력하세요"
        />

        <ModalLabel htmlFor="seller-representative">대표자명</ModalLabel>
        <ModalInput
          id="seller-representative"
          value={modal.form.representativeName}
          disabled={disableProfileField}
          onChange={(event) => modal.updateField("representativeName", event.target.value)}
          placeholder="대표자명을 입력하세요"
        />

        <ModalLabel htmlFor="seller-biz-no">사업자등록번호</ModalLabel>
        <ModalInput
          id="seller-biz-no"
          value={modal.form.businessRegistrationNumber}
          disabled={disableProfileField}
          onChange={(event) => modal.updateField("businessRegistrationNumber", event.target.value)}
          placeholder="하이픈 없이 숫자만 입력"
        />

        <ModalLabel htmlFor="seller-email">사업자 이메일</ModalLabel>
        <ModalInput
          id="seller-email"
          type="email"
          value={modal.form.companyEmail}
          disabled={disableProfileField}
          onChange={(event) => modal.updateField("companyEmail", event.target.value)}
          placeholder="billing@example.com"
        />

        <ModalLabel htmlFor="seller-phone">사업자 전화번호</ModalLabel>
        <ModalInput
          id="seller-phone"
          value={modal.form.companyPhone}
          disabled={disableProfileField}
          onChange={(event) => modal.updateField("companyPhone", event.target.value)}
          placeholder="숫자만 입력"
        />

        {modal.form.businessType === "INDIVIDUAL" ? (
          <>
            <ModalLabel htmlFor="seller-individual-name">개인 이름</ModalLabel>
            <ModalInput
              id="seller-individual-name"
              value={modal.form.individualName}
              disabled={disableProfileField}
              onChange={(event) => modal.updateField("individualName", event.target.value)}
              placeholder="예: 홍길동"
            />

            <ModalLabel htmlFor="seller-individual-email">개인 이메일</ModalLabel>
            <ModalInput
              id="seller-individual-email"
              type="email"
              value={modal.form.individualEmail}
              disabled={disableProfileField}
              onChange={(event) => modal.updateField("individualEmail", event.target.value)}
              placeholder="personal@example.com"
            />

            <ModalLabel htmlFor="seller-individual-phone">개인 연락처</ModalLabel>
            <ModalInput
              id="seller-individual-phone"
              value={modal.form.individualPhone}
              disabled={disableProfileField}
              onChange={(event) => modal.updateField("individualPhone", event.target.value)}
              placeholder="숫자만 입력"
            />
            <ModalHint>개인 사업자 유형은 담당자 연락처가 필수입니다.</ModalHint>
          </>
        ) : null}

        <ModalLabel>은행 선택</ModalLabel>
        <BankGrid>
          {BANK_OPTIONS.map((bank) => (
            <BankButton
              key={bank.code}
              type="button"
              disabled={disableAccountField}
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
          disabled={disableAccountField}
          onChange={(event) => modal.updateField("accountNumber", event.target.value)}
          placeholder="하이픈 없이 입력"
        />

        <ModalLabel htmlFor="seller-holder-name">예금주명</ModalLabel>
        <ModalInput
          id="seller-holder-name"
          value={modal.form.accountHolderName}
          disabled={disableAccountField}
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
  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
  &[data-active="true"] {
    background: #4f46e5;
    color: #fff;
    border-color: transparent;
  }
`;

const Notice = styled.div<{ tone: "info" | "warning" }>`
  margin-bottom: 12px;
  padding: 12px;
  border-radius: 10px;
  font-size: 13px;
  line-height: 1.5;
  background: ${({ tone }) => (tone === "warning" ? "#fef3c7" : "#eef2ff")};
  color: ${({ tone }) => (tone === "warning" ? "#b45309" : "#3730a3")};
  border: 1px solid ${({ tone }) => (tone === "warning" ? "#fcd34d" : "#c7d2fe")};
`;
