import styled from "styled-components";
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
  ModalTextarea,
} from "@/components/myAcademy/MyAcademyModalStyles";
import type { AcademyModalState } from "@/features/myAcademy/hooks/useMyAcademyPage";
import { maskBiz, secondCategories } from "@/features/myAcademy/utils";

type MyAcademyAcademyModalProps = {
  modal: AcademyModalState;
};

const CATEGORY_OPTIONS = ["교과목", "예체능", "기타"] as const;

export function MyAcademyAcademyModal({ modal }: MyAcademyAcademyModalProps) {
  const secondaryOptions = secondCategories(modal.form.category1);

  return (
    <Modal
      open={modal.open}
      onClose={modal.closeModal}
      title="학원 정보 수정"
    >
      <ModalForm onSubmit={modal.submit}>
        <ModalLabel htmlFor="academy-name">학원명</ModalLabel>
        <ModalInput
          id="academy-name"
          value={modal.form.name}
          onChange={(event) => modal.updateField("name", event.target.value)}
          placeholder="예: 클라썬어학원"
        />

        <ModalLabel>카테고리</ModalLabel>
        <Pills>
          {CATEGORY_OPTIONS.map((option) => (
            <PillButton
              key={option}
              type="button"
              data-active={modal.form.category1 === option}
              onClick={() => modal.selectCategory1(option)}
            >
              {option}
            </PillButton>
          ))}
        </Pills>
        <ModalHint>
          주력 분야를 선택해 주세요. 기타를 선택하면 직접 입력할 수 있습니다.
        </ModalHint>

        {modal.form.category1 && modal.form.category1 !== "기타" && (
          <>
            <ModalLabel>세부 카테고리 (선택)</ModalLabel>
            <Pills>
              {secondaryOptions.map((option) => (
                <PillButton
                  key={option}
                  type="button"
                  data-active={modal.form.category2 === option}
                  onClick={() => modal.toggleCategory2(option)}
                >
                  {option}
                </PillButton>
              ))}
            </Pills>
          </>
        )}

        {modal.form.category1 === "기타" && (
          <>
            <ModalLabel htmlFor="academy-category-etc">기타 분류</ModalLabel>
            <ModalInput
              id="academy-category-etc"
              value={modal.form.categoryEtc}
              onChange={(event) => modal.updateField("categoryEtc", event.target.value)}
              placeholder="예: 코딩, 바둑 등"
            />
          </>
        )}

        <ModalLabel htmlFor="academy-address">주소</ModalLabel>
        <ModalTextarea
          id="academy-address"
          value={modal.form.address}
          onChange={(event) => modal.updateField("address", event.target.value)}
          placeholder="도로명 주소를 입력하세요"
        />

        <ModalLabel htmlFor="academy-representative">대표자명</ModalLabel>
        <ModalInput
          id="academy-representative"
          value={modal.form.representativeName}
          onChange={(event) => modal.updateField("representativeName", event.target.value)}
          placeholder="대표자명을 입력하세요"
        />

        <ModalLabel htmlFor="academy-phone">학원 대표번호</ModalLabel>
        <ModalInput
          id="academy-phone"
          value={modal.form.phone}
          onChange={(event) => modal.updateField("phone", event.target.value)}
          placeholder="예: 021234567"
        />

        <ModalLabel htmlFor="academy-email">청구용 이메일</ModalLabel>
        <ModalInput
          id="academy-email"
          type="email"
          value={modal.form.billingEmail}
          onChange={(event) => modal.updateField("billingEmail", event.target.value)}
          placeholder="billing@example.com"
        />

        <ModalLabel htmlFor="academy-bizno">사업자번호</ModalLabel>
        <ModalInput
          id="academy-bizno"
          value={modal.form.bizNo}
          onChange={(event) => modal.updateField("bizNo", maskBiz(event.target.value))}
          placeholder="###-##-#####"
          inputMode="numeric"
          maxLength={12}
        />
        <ModalHint>숫자만 입력해도 자동으로 형식에 맞춰집니다.</ModalHint>

        {modal.error ? <ModalError>{modal.error}</ModalError> : null}

        <ModalActions>
          <ModalGhostButton type="button" onClick={modal.closeModal}>
            취소
          </ModalGhostButton>
          <ModalPrimaryButton type="submit" disabled={modal.submitting}>
            {modal.submitting ? "저장 중..." : "학원 정보 저장"}
          </ModalPrimaryButton>
        </ModalActions>
      </ModalForm>
    </Modal>
  );
}

const Pills = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const PillButton = styled.button`
  border: 1px solid #e5e7eb;
  background: #f9fafb;
  color: #374151;
  font-weight: 600;
  border-radius: 999px;
  padding: 6px 14px;
  cursor: pointer;
  &[data-active="true"] {
    background: #4f46e5;
    color: #ffffff;
    border-color: transparent;
  }
`;
