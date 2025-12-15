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
import { useEffect, useMemo, useState } from "react";
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
  const [attempted, setAttempted] = useState(false);
  const [bankQuery, setBankQuery] = useState("");

  useEffect(() => {
    if (!modal.open) return;
    setAttempted(false);
    setBankQuery("");
  }, [modal.open]);

  const digitsOnly = (value: string) => value.replace(/\D/g, "");

  const filteredBanks = useMemo(() => {
    const q = bankQuery.trim();
    if (!q) return BANK_OPTIONS;
    const normalized = q.toLowerCase();
    return BANK_OPTIONS.filter((bank) => {
      return (
        bank.name.toLowerCase().includes(normalized) ||
        bank.code.toLowerCase().includes(normalized)
      );
    });
  }, [bankQuery]);

  const validation = useMemo(() => {
    const errors: Partial<Record<string, string>> = {};

    const accountBankCode = modal.form.accountBankCode.trim();
    const accountNumberDigits = digitsOnly(modal.form.accountNumber);
    const accountHolderName = modal.form.accountHolderName.trim();
    const companyName = modal.form.companyName.trim();
    const representativeName = modal.form.representativeName.trim();
    const companyEmail = modal.form.companyEmail.trim();
    const companyPhoneDigits = digitsOnly(modal.form.companyPhone);
    const bizNoDigits = digitsOnly(modal.form.businessRegistrationNumber);

    if (!accountBankCode) errors.accountBankCode = "은행을 선택해 주세요.";
    if (!accountNumberDigits) errors.accountNumber = "계좌번호를 입력해 주세요.";
    if (!accountHolderName) errors.accountHolderName = "예금주명을 입력해 주세요.";

    if (!profileLocked) {
      if (!companyName) errors.companyName = "사업자명을 입력해 주세요.";
      if (!representativeName) errors.representativeName = "대표자명을 입력해 주세요.";
      if (!companyEmail) errors.companyEmail = "사업자 이메일을 입력해 주세요.";
      if (!companyPhoneDigits) errors.companyPhone = "사업자 전화번호를 숫자만 입력해 주세요.";
      if (modal.form.businessType !== "INDIVIDUAL" && bizNoDigits.length !== 10) {
        errors.businessRegistrationNumber = "사업자등록번호 10자리를 입력해 주세요.";
      }
      if (modal.form.businessType === "INDIVIDUAL") {
        if (!modal.form.individualName.trim()) errors.individualName = "개인 이름을 입력해 주세요.";
        if (!modal.form.individualEmail.trim()) errors.individualEmail = "개인 이메일을 입력해 주세요.";
        if (!digitsOnly(modal.form.individualPhone)) {
          errors.individualPhone = "개인 연락처를 숫자만 입력해 주세요.";
        }
      }
    }

    return {
      canSubmit: Object.keys(errors).length === 0 && !modal.submitting,
      errors,
    };
  }, [modal.form, modal.submitting, profileLocked]);

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
      title={modal.creating ? "정산 계좌 등록" : "정산 계좌 정보 수정"}
      blockOutsideClose
    >
      <SellerForm
        onSubmit={(event) => {
          setAttempted(true);
          modal.submit(event);
        }}
      >
        <Notice tone={profileLocked ? "warning" : "info"}>
          {profileLocked
            ? "사업자 정보는 등록 후 수정할 수 없습니다. 정산 계좌만 변경할 수 있어요."
            : "정산 계좌 등록 요청 시 입력한 사업자·계좌 정보가 토스페이먼츠에 전달됩니다."}
        </Notice>

        <Section>
          <SectionTitle>정산 계좌</SectionTitle>

          <Field>
            <ModalLabel>
              은행 선택<Required aria-hidden>*</Required>
            </ModalLabel>
            <ModalInput
              value={bankQuery}
              disabled={disableAccountField}
              onChange={(event) => setBankQuery(event.target.value)}
              placeholder="은행 검색 (예: 국민, 카카오, 004)"
              autoComplete="off"
            />
            <BankGrid aria-label="은행 목록">
              {filteredBanks.map((bank) => (
                <BankButton
                  key={bank.code}
                  type="button"
                  disabled={disableAccountField}
                  aria-pressed={modal.form.accountBankCode === bank.code}
                  data-active={modal.form.accountBankCode === bank.code}
                  onClick={() => modal.updateField("accountBankCode", bank.code)}
                >
                  {bank.name}
                </BankButton>
              ))}
            </BankGrid>
            {filteredBanks.length === 0 ? (
              <BankEmpty>검색 결과가 없습니다.</BankEmpty>
            ) : (
              <ModalHint>
                선택된 은행:{" "}
                {selectedBank ? `${selectedBank.name} (${selectedBank.code})` : "미선택"}
              </ModalHint>
            )}
            {attempted && validation.errors.accountBankCode ? (
              <ModalHint danger>{validation.errors.accountBankCode}</ModalHint>
            ) : null}
          </Field>

          <Field>
            <ModalLabel htmlFor="seller-account-number">
              계좌번호<Required aria-hidden>*</Required>
            </ModalLabel>
            <ModalInput
              id="seller-account-number"
              value={modal.form.accountNumber}
              disabled={disableAccountField}
              inputMode="numeric"
              autoComplete="off"
              onChange={(event) =>
                modal.updateField("accountNumber", digitsOnly(event.target.value))
              }
              placeholder="하이픈 없이 숫자만 입력"
            />
            {attempted && validation.errors.accountNumber ? (
              <ModalHint danger>{validation.errors.accountNumber}</ModalHint>
            ) : (
              <ModalHint>숫자만 입력하면 자동으로 정리됩니다.</ModalHint>
            )}
          </Field>

          <Field>
            <ModalLabel htmlFor="seller-holder-name">
              예금주명<Required aria-hidden>*</Required>
            </ModalLabel>
            <ModalInput
              id="seller-holder-name"
              value={modal.form.accountHolderName}
              disabled={disableAccountField}
              onChange={(event) => modal.updateField("accountHolderName", event.target.value)}
              onBlur={() => {
                if (modal.form.accountHolderName.trim()) return;
                const fallback =
                  modal.form.representativeName.trim() || modal.form.companyName.trim();
                if (fallback) modal.updateField("accountHolderName", fallback);
              }}
              placeholder="예금주명을 입력하세요"
              autoComplete="name"
            />
            {attempted && validation.errors.accountHolderName ? (
              <ModalHint danger>{validation.errors.accountHolderName}</ModalHint>
            ) : (
              <ModalHint>미입력 시 대표자명/사업자명으로 자동 입력됩니다.</ModalHint>
            )}
          </Field>
        </Section>

        {modal.form.tossSellerId ? (
          <Section>
            <SectionTitle>토스 정보</SectionTitle>
            <Field>
              <ModalLabel htmlFor="seller-toss-id">토스 셀러 ID</ModalLabel>
              <InlineRow>
                <ModalInput
                  id="seller-toss-id"
                  value={modal.form.tossSellerId}
                  readOnly
                  disabled
                  placeholder="토스에서 발급된 ID"
                />
                <ModalGhostButton type="button" onClick={handleSync} disabled={syncing}>
                  {syncing ? "동기화 중..." : "상태 동기화"}
                </ModalGhostButton>
              </InlineRow>
              <ModalHint>토스 쪽 상태가 변경되었다면 동기화로 최신 정보를 반영할 수 있어요.</ModalHint>
            </Field>
          </Section>
        ) : null}

        <Section>
          <SectionTitle>사업자 정보</SectionTitle>

          <Field>
            <ModalLabel htmlFor="seller-business-type">
              사업자 유형<Required aria-hidden>*</Required>
            </ModalLabel>
            <SelectBox
              id="seller-business-type"
              ariaLabel="사업자 유형"
              value={modal.form.businessType}
              disabled={disableProfileField}
              placeholder="사업자 유형 선택"
              onChange={(value) =>
                modal.updateField(
                  "businessType",
                  value as SellerModalState["form"]["businessType"],
                )
              }
              options={BUSINESS_TYPES}
            />
          </Field>

          <Field>
            <ModalLabel htmlFor="seller-company-name">
              사업자명<Required aria-hidden>*</Required>
            </ModalLabel>
            <ModalInput
              id="seller-company-name"
              value={modal.form.companyName}
              disabled={disableProfileField}
              onChange={(event) => modal.updateField("companyName", event.target.value)}
              placeholder="사업자명을 입력하세요"
              autoComplete="organization"
            />
            {attempted && validation.errors.companyName ? (
              <ModalHint danger>{validation.errors.companyName}</ModalHint>
            ) : null}
          </Field>

          <Field>
            <ModalLabel htmlFor="seller-representative">
              대표자명<Required aria-hidden>*</Required>
            </ModalLabel>
            <ModalInput
              id="seller-representative"
              value={modal.form.representativeName}
              disabled={disableProfileField}
              onChange={(event) => modal.updateField("representativeName", event.target.value)}
              placeholder="대표자명을 입력하세요"
              autoComplete="name"
            />
            {attempted && validation.errors.representativeName ? (
              <ModalHint danger>{validation.errors.representativeName}</ModalHint>
            ) : null}
          </Field>

          <Field>
            <ModalLabel htmlFor="seller-biz-no">
              사업자등록번호
              {modal.form.businessType === "INDIVIDUAL" ? null : (
                <Required aria-hidden>*</Required>
              )}
            </ModalLabel>
            <ModalInput
              id="seller-biz-no"
              value={modal.form.businessRegistrationNumber}
              disabled={disableProfileField}
              inputMode="numeric"
              autoComplete="off"
              maxLength={10}
              onChange={(event) =>
                modal.updateField(
                  "businessRegistrationNumber",
                  digitsOnly(event.target.value).slice(0, 10),
                )
              }
              placeholder="하이픈 없이 숫자만 (10자리)"
            />
            {modal.form.businessType === "INDIVIDUAL" ? (
              <ModalHint>개인 유형은 사업자등록번호 입력이 필수가 아닙니다.</ModalHint>
            ) : attempted && validation.errors.businessRegistrationNumber ? (
              <ModalHint danger>{validation.errors.businessRegistrationNumber}</ModalHint>
            ) : (
              <ModalHint>10자리 숫자만 입력해 주세요.</ModalHint>
            )}
          </Field>

          <Field>
            <ModalLabel htmlFor="seller-email">
              사업자 이메일<Required aria-hidden>*</Required>
            </ModalLabel>
            <ModalInput
              id="seller-email"
              type="email"
              value={modal.form.companyEmail}
              disabled={disableProfileField}
              onChange={(event) => modal.updateField("companyEmail", event.target.value)}
              placeholder="billing@example.com"
              autoComplete="email"
            />
            {attempted && validation.errors.companyEmail ? (
              <ModalHint danger>{validation.errors.companyEmail}</ModalHint>
            ) : null}
          </Field>

          <Field>
            <ModalLabel htmlFor="seller-phone">
              사업자 전화번호<Required aria-hidden>*</Required>
            </ModalLabel>
            <ModalInput
              id="seller-phone"
              value={modal.form.companyPhone}
              disabled={disableProfileField}
              inputMode="numeric"
              autoComplete="tel"
              onChange={(event) =>
                modal.updateField("companyPhone", digitsOnly(event.target.value))
              }
              placeholder="숫자만 입력"
            />
            {attempted && validation.errors.companyPhone ? (
              <ModalHint danger>{validation.errors.companyPhone}</ModalHint>
            ) : null}
          </Field>

          {modal.form.businessType === "INDIVIDUAL" ? (
            <>
              <Divider />
              <Field>
                <ModalLabel htmlFor="seller-individual-name">
                  개인 이름<Required aria-hidden>*</Required>
                </ModalLabel>
                <ModalInput
                  id="seller-individual-name"
                  value={modal.form.individualName}
                  disabled={disableProfileField}
                  onChange={(event) => modal.updateField("individualName", event.target.value)}
                  placeholder="예: 홍길동"
                  autoComplete="name"
                />
                {attempted && validation.errors.individualName ? (
                  <ModalHint danger>{validation.errors.individualName}</ModalHint>
                ) : null}
              </Field>

              <Field>
                <ModalLabel htmlFor="seller-individual-email">
                  개인 이메일<Required aria-hidden>*</Required>
                </ModalLabel>
                <ModalInput
                  id="seller-individual-email"
                  type="email"
                  value={modal.form.individualEmail}
                  disabled={disableProfileField}
                  onChange={(event) => modal.updateField("individualEmail", event.target.value)}
                  placeholder="personal@example.com"
                  autoComplete="email"
                />
                {attempted && validation.errors.individualEmail ? (
                  <ModalHint danger>{validation.errors.individualEmail}</ModalHint>
                ) : null}
              </Field>

              <Field>
                <ModalLabel htmlFor="seller-individual-phone">
                  개인 연락처<Required aria-hidden>*</Required>
                </ModalLabel>
                <ModalInput
                  id="seller-individual-phone"
                  value={modal.form.individualPhone}
                  disabled={disableProfileField}
                  inputMode="numeric"
                  autoComplete="tel"
                  onChange={(event) =>
                    modal.updateField("individualPhone", digitsOnly(event.target.value))
                  }
                  placeholder="숫자만 입력"
                />
                {attempted && validation.errors.individualPhone ? (
                  <ModalHint danger>{validation.errors.individualPhone}</ModalHint>
                ) : (
                  <ModalHint>개인 유형은 담당자 연락처가 필수입니다.</ModalHint>
                )}
              </Field>
            </>
          ) : null}
        </Section>

        <Section>
          <SectionTitle>시스템 정보</SectionTitle>
          <Field>
            <ModalLabel htmlFor="seller-ref-id">셀러 ID</ModalLabel>
            <ModalInput
              id="seller-ref-id"
              value={modal.form.refSellerId || "(자동 생성됨)"}
              readOnly
              disabled
              placeholder="시스템 자동 생성"
            />
            <ModalHint>시스템에서 자동 생성된 값이며 변경할 수 없습니다.</ModalHint>
          </Field>
        </Section>

        {modal.error ? <ModalError>{modal.error}</ModalError> : null}

        <ModalActions>
          <ModalGhostButton type="button" onClick={modal.closeModal}>
            취소
          </ModalGhostButton>
          <ModalPrimaryButton type="submit" disabled={!validation.canSubmit}>
            {modal.submitting ? "저장 중..." : modal.creating ? "등록하기" : "수정하기"}
          </ModalPrimaryButton>
        </ModalActions>
      </SellerForm>
    </Modal>
  );
}

const SellerForm = styled(ModalForm)`
  min-width: 0;
  max-width: 560px;
  gap: 14px;
`;

const Section = styled.section`
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  background: #ffffff;
  padding: 14px;
  display: grid;
  gap: 14px;
`;

const SectionTitle = styled.h3`
  margin: 0;
  font-size: 13px;
  font-weight: 700;
  color: #0f172a;
`;

const Field = styled.div`
  display: grid;
  gap: 8px;
`;

const InlineRow = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  > input {
    flex: 1;
  }
  > button {
    white-space: nowrap;
    flex: none;
  }
`;

const Divider = styled.div`
  height: 1px;
  background: #e2e8f0;
`;

const Required = styled.span`
  margin-left: 4px;
  color: #dc2626;
  font-weight: 700;
`;

const BankGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
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
  transition: background 120ms ease, border-color 120ms ease, color 120ms ease, transform 120ms ease;
  &:hover:not(:disabled) {
    background: #f3f4f6;
    border-color: #d1d5db;
  }
  &:active:not(:disabled) {
    transform: translateY(1px);
  }
  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.18);
    border-color: #4f46e5;
  }
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

const BankEmpty = styled.div`
  font-size: 12px;
  color: #64748b;
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
