import { useState } from "react";
import styled from "styled-components";
import PageTopBar from "@/components/common/PageTopBar";
import {
  GhostBtn as UIGhostBtn,
  GhostButton as UIGhostButton,
  Skeleton as UISkeleton,
} from "@/components/common/UI";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import {
  DateBadge,
  TimePill,
} from "@/components/courseRecord/CourseRecordStyles";

type WhenInfo = {
  dateLabel: string;
  timeLabel: string;
  hasDate: boolean;
  hasTime: boolean;
};

type Props = {
  courseId: number | null;
  courseTitle?: string | null;
  headLoading: boolean;
  whenInfo: WhenInfo;
  canDelete: boolean;
  onBack: () => void;
  onDelete?: () => Promise<boolean>;
};

export function CourseRecordHeader({
  courseId,
  courseTitle,
  headLoading,
  whenInfo,
  canDelete,
  onBack,
  onDelete,
}: Props) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const goToCourse = courseId != null ? `/classes/${courseId}` : "/classes";

  return (
    <>
      <PageTopBar
        align="left"
        onBack={onBack}
        backLabel="뒤로"
        backSize="md"
        title={
          <HeadTitle>
            {headLoading ? (
              <UISkeleton w={220} h={26} />
            ) : (
              <h2 style={{ margin: 0 }}>{courseTitle || "수업 내역 상세"}</h2>
            )}
            <WhenMeta>
              {headLoading ? (
                <>
                  <UISkeleton w={120} h={20} />
                  <UISkeleton w={100} h={18} />
                </>
              ) : (
                <>
                  <DateBadge data-empty={String(!whenInfo.hasDate)}>
                    {whenInfo.dateLabel}
                  </DateBadge>
                  <TimePill data-empty={String(!whenInfo.hasTime)}>
                    {whenInfo.timeLabel}
                  </TimePill>
                </>
              )}
            </WhenMeta>
          </HeadTitle>
        }
        actions={
          <>
            <UIGhostBtn to={goToCourse} title="수업으로">
              수업으로
            </UIGhostBtn>
            {!headLoading && canDelete ? (
              <UIGhostButton
                type="button"
                data-variant="danger"
                onClick={() => setConfirmOpen(true)}
              >
                삭제
              </UIGhostButton>
            ) : null}
          </>
        }
      />
      <ConfirmDialog
        open={confirmOpen}
        title="수업 내역 삭제"
        message={
          "이 수업 내역을 삭제할까요?\n첨부/출결/파일도 함께 삭제됩니다. 되돌릴 수 없습니다."
        }
        confirmLabel="영구 삭제"
        cancelLabel="취소"
        tone="danger"
        busy={deleteBusy}
        onCancel={() => {
          if (!deleteBusy) setConfirmOpen(false);
        }}
        onConfirm={async () => {
          if (!onDelete) return;
          setDeleteBusy(true);
          try {
            const ok = await onDelete();
            if (ok) setConfirmOpen(false);
          } finally {
            setDeleteBusy(false);
          }
        }}
      />
    </>
  );
}

const HeadTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
`;

const WhenMeta = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;
