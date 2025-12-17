import PageTopBar from "@/components/common/PageTopBar";
import {
  GhostBtn as UIGhostBtn,
  GhostButton as UIGhostButton,
} from "@/components/common/UI";

type CourseDetailHeaderProps = {
  title?: string | null;
  onBack: () => void;
  editHref: string;
  editStudentsHref: string;
  showDelete: boolean;
  onDelete: () => void;
};

export function CourseDetailHeader({
  title,
  onBack,
  editHref,
  editStudentsHref,
  showDelete,
  onDelete,
}: CourseDetailHeaderProps) {
  return (
    <PageTopBar
      align="center"
      title={title || "수업 상세"}
      onBack={onBack}
      backLabel="뒤로"
      backSize="md"
      actions={
        <>
          <UIGhostBtn to={editStudentsHref} title="수강생 관리" data-variant="edit">
            수강생 관리
          </UIGhostBtn>
          <UIGhostBtn to={editHref} title="기본 정보 수정" data-variant="edit">
            기본정보 수정
          </UIGhostBtn>
          {showDelete ? (
            <UIGhostButton type="button" onClick={onDelete}>
              삭제
            </UIGhostButton>
          ) : null}
        </>
      }
    />
  );
}
