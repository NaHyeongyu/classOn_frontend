import { Muted, AlertError } from "@/components/courseRecord/CourseRecordStyles";
import { CourseRecordHeader } from "@/components/courseRecord/CourseRecordHeader";
import { CourseRecordStatsPanel } from "@/components/courseRecord/CourseRecordStatsPanel";
import { CourseRecordScheduleSection } from "@/components/courseRecord/CourseRecordScheduleSection";
import { CourseRecordContentSection } from "@/components/courseRecord/CourseRecordContentSection";
import { CourseRecordAttachmentsSection } from "@/components/courseRecord/CourseRecordAttachmentsSection";
import {
  Wrap,
  Columns,
  Left,
  Right,
} from "@/components/courseRecord/CourseRecordDetail.styles";
import { CourseRecordRightPanel, type CourseRecordAttendanceProps, type CourseRecordGradesPanelProps, type CourseRecordRightTab } from "@/components/courseRecord/CourseRecordRightPanel";
import type { UseCourseRecordEditorReturn } from "@/features/courseRecord/useCourseRecordEditor";
import type { UseCourseRecordAttachmentsReturn } from "@/features/courseRecord/useCourseRecordAttachments";

export type CourseRecordDetailStatsProps = {
  loading: boolean;
  summaryRate: number | null;
  actionableTotal: number;
  actionablePresent: number;
  actionableAbsent: number;
  actionableNone: number;
  presentShare: number;
  absentShare: number;
  noneShare: number;
};

export type CourseRecordDetailPageViewProps = {
  header: {
    courseId: number | null;
    courseTitle?: string | null;
    headLoading: boolean;
    whenInfo: UseCourseRecordEditorReturn["meta"]["whenInfo"];
    canDelete: boolean;
  };
  onBack: () => void;
  onDeleteRecord: () => Promise<boolean>;
  error: string | null;
  loading: boolean;
  stats: CourseRecordDetailStatsProps;
  editor: UseCourseRecordEditorReturn;
  attachments: UseCourseRecordAttachmentsReturn & { maxFileSizeMb: number };
  recordExists: boolean;
  attendancePanelProps: CourseRecordAttendanceProps;
  attendanceMeta: {
    actionableCount: number;
    onBulkAllPresent: () => void;
    onOpenBulkSelect: () => void;
  };
  gradesPanelProps: CourseRecordGradesPanelProps;
  gradesMeta: {
    examCreateOk: boolean;
    selectedExamId: number | null;
    examLoading: boolean;
    onOpenExamModal: () => void;
    onDeleteExam: () => Promise<void> | void;
  };
  rightTab: CourseRecordRightTab;
  onChangeRightTab: (tab: CourseRecordRightTab) => void;
  headLoading: boolean;
};

export function CourseRecordDetailPageView({
  header,
  onBack,
  onDeleteRecord,
  error,
  loading,
  stats,
  editor,
  attachments,
  recordExists,
  attendancePanelProps,
  attendanceMeta,
  gradesPanelProps,
  gradesMeta,
  rightTab,
  onChangeRightTab,
  headLoading,
}: CourseRecordDetailPageViewProps) {
  return (
    <Wrap>
      <CourseRecordHeader
        courseId={header.courseId}
        courseTitle={header.courseTitle}
        headLoading={header.headLoading}
        whenInfo={header.whenInfo}
        canDelete={header.canDelete}
        onBack={onBack}
        onDelete={onDeleteRecord}
      />

      {error ? <AlertError>{error}</AlertError> : null}
      {loading && !headLoading ? <Muted>불러오는 중...</Muted> : null}

      <CourseRecordStatsPanel
        loading={stats.loading}
        summaryRate={stats.summaryRate}
        actionableTotal={stats.actionableTotal}
        actionablePresent={stats.actionablePresent}
        actionableAbsent={stats.actionableAbsent}
        actionableNone={stats.actionableNone}
        presentShare={stats.presentShare}
        absentShare={stats.absentShare}
        noneShare={stats.noneShare}
      />

      <Columns>
        <Left>
          <CourseRecordScheduleSection
            headLoading={headLoading}
            editing={editor.schedule.editing}
            displayDateValue={editor.meta.displayDateValue}
            displayTimeValue={editor.meta.displayTimeValue}
            durationLabel={editor.meta.durationLabel}
            onStartEdit={editor.schedule.onStartEdit}
            onSave={editor.schedule.onSave}
            onCancel={editor.schedule.onCancelEdit}
            saveDisabled={editor.schedule.saveDisabled}
            editDate={editor.schedule.editDate || ""}
            editStart={editor.schedule.editStart || ""}
            editEnd={editor.schedule.editEnd || ""}
            onChangeDate={editor.schedule.setEditDate}
            onChangeStart={editor.schedule.setEditStart}
            onChangeEnd={editor.schedule.setEditEnd}
            previewDateLabel={editor.meta.previewDateLabel}
            previewTimeLabel={editor.meta.previewTimeLabel}
            previewDateEmpty={editor.meta.previewDateEmpty}
            previewTimeEmpty={editor.meta.previewTimeEmpty}
            showCreationHint={editor.schedule.showCreationHint}
            whenError={editor.schedule.whenError}
          />

          <CourseRecordContentSection
            recordExists={recordExists}
            contentValue={editor.content.value}
            saving={editor.content.saving}
            feedback={editor.content.feedback}
            onChange={editor.content.onChange}
          />

          <CourseRecordAttachmentsSection
            files={attachments.files}
            filesLoading={attachments.filesLoading}
            filesError={attachments.filesError}
            uploadQueue={attachments.uploadQueue}
            previewBusy={attachments.previewBusy}
            fileBusy={attachments.fileBusy}
            thumbUrl={attachments.thumbUrl}
            onUpload={attachments.onUpload}
            onDropFiles={attachments.onDropFiles}
            openAttachment={attachments.openAttachment}
            onDeleteFile={attachments.onDeleteFile}
            recordExists={recordExists}
            maxFileSizeMb={attachments.maxFileSizeMb}
          />
        </Left>
        <Right>
          <CourseRecordRightPanel
            tab={rightTab}
            onChangeTab={onChangeRightTab}
            attendanceProps={attendancePanelProps}
            attendanceMeta={attendanceMeta}
            gradesProps={gradesPanelProps}
            gradesMeta={gradesMeta}
          />
        </Right>
      </Columns>
    </Wrap>
  );
}
