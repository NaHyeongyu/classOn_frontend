import {
  GhostBtn as UIGhostBtn,
  GhostButton as UIGhostButton,
} from "@/components/common/UI";
import {
  Actions,
  BackButton,
  Head,
} from "./CourseDetail.styles";

type CourseDetailHeaderProps = {
  title?: string | null;
  onBack: () => void;
  editHref: string;
  editStudentsHref: string;
  showDelete: boolean;
  onDelete: () => void;
};

const leftIcon = (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

export function CourseDetailHeader({
  title,
  onBack,
  editHref,
  editStudentsHref,
  showDelete,
  onDelete,
}: CourseDetailHeaderProps) {
  return (
    <Head>
      <BackButton type="button" onClick={onBack}>
        {leftIcon} 뒤로
      </BackButton>
      <h2>{title || "수업 상세"}</h2>
      <Actions>
        <UIGhostBtn to={editStudentsHref} title="수강생 수정" data-variant="edit">
          수강생 수정
        </UIGhostBtn>
        <UIGhostBtn to={editHref} title="기본 정보 수정" data-variant="edit">
          기본정보 수정
        </UIGhostBtn>
        {showDelete ? (
          <UIGhostButton type="button" onClick={onDelete}>
            삭제
          </UIGhostButton>
        ) : null}
      </Actions>
    </Head>
  );
}
