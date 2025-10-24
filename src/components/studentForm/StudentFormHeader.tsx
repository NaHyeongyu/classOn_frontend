import BackButton from "@/components/common/BackButton";
import { PrimaryButton as UIPrimaryBtn } from "@/components/common/UI";
import { HeadActions, HeadLeft, Header } from "./StudentForm.styles";

type StudentFormHeaderProps = {
  isEdit: boolean;
  saving: boolean;
  onSaveClick: () => void;
};

export function StudentFormHeader({
  isEdit,
  saving,
  onSaveClick,
}: StudentFormHeaderProps) {
  return (
    <Header>
      <HeadLeft>
        <BackButton to="/students" label="뒤로" />
        <div>
          <h2>{isEdit ? "원생 정보 수정" : "원생 추가하기"}</h2>
          <p>기본 정보를 입력하고 저장하세요.</p>
        </div>
      </HeadLeft>
      <HeadActions>
        <UIPrimaryBtn type="button" onClick={onSaveClick} disabled={saving}>
          {saving ? "저장 중..." : "저장"}
        </UIPrimaryBtn>
      </HeadActions>
    </Header>
  );
}
