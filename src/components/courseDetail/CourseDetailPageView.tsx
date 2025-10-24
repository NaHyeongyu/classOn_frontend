import type { ComponentProps, ReactNode } from "react";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { Wrap, PageLocal, AlertError, Muted, Columns, Left, Right, StickyLeft } from "./CourseDetail.styles";
import { CourseDetailHeader } from "./CourseDetailHeader";
import { CourseDetailInfoSection } from "./CourseDetailInfoSection";
import { CourseDetailKpis } from "./CourseDetailKpis";
import CourseExamsPanel from "@/components/courses/CourseExamsPanel";
import CourseStudentsPanel from "@/components/courses/CourseStudentsPanel";
import CourseRecordsPanel from "@/components/courses/CourseRecordsPanel";
import type { Course } from "@/api/courses";
import type { Student } from "@/api/students";
import type { UseCourseExamsResult } from "@/features/courseDetail/useCourseExams";
import type { UseCourseDetailResult } from "@/features/courseDetail/useCourseDetail";

export type CourseDetailHeaderProps = {
  title?: string | null;
  onBack: () => void;
  editHref: string;
  editStudentsHref: string;
  showDelete: boolean;
  onDelete: () => void;
};

export type CourseDetailKpiProps = {
  totalStudents: number | null;
  capacity: number | null;
  avgAttendance: number | null;
  completedCount: number | null;
  progressPct: number | null;
};

export type CourseStudentsPanelProps = {
  students: Student[];
  loading: boolean;
  error: string | null;
  editHref: string;
};

type CourseRecordsPanelProps = ComponentProps<typeof CourseRecordsPanel>;

export type CourseRecordsProps = Pick<
  CourseRecordsPanelProps,
  | "history"
  | "filterYear"
  | "filterMonth"
  | "onChangeYear"
  | "onChangeMonth"
  | "onResetFilters"
  | "exporting"
  | "onExport"
  | "collapsed"
  | "onToggleCollapsed"
  | "todayHref"
  | "detailHrefFor"
  | "getAttendanceMap"
>;

export type CourseDetailPageViewProps = {
  confirmDangerDialog: ReactNode;
  confirmDelete: {
    open: boolean;
    busy: boolean;
    onCancel: () => void;
    onConfirm: () => void;
  };
  header: CourseDetailHeaderProps;
  courseError: string | null;
  loading: boolean;
  kpis: CourseDetailKpiProps;
  info: UseCourseDetailResult["info"];
  course: Course | null;
  students: CourseStudentsPanelProps;
  exams: UseCourseExamsResult;
  records: CourseRecordsProps;
};

export function CourseDetailPageView({
  confirmDangerDialog,
  confirmDelete,
  header,
  courseError,
  loading,
  kpis,
  info,
  course,
  students,
  exams,
  records,
}: CourseDetailPageViewProps) {
  return (
    <PageLocal>
      <Wrap>
        <CourseDetailHeader
          title={header.title}
          onBack={header.onBack}
          editHref={header.editHref}
          editStudentsHref={header.editStudentsHref}
          showDelete={header.showDelete}
          onDelete={header.onDelete}
        />

        {confirmDangerDialog}
        <ConfirmDialog
          open={confirmDelete.open}
          title="수업(템플릿) 삭제"
          message="관련 수업 내역/출결/첨부가 모두 삭제됩니다. 이 작업은 되돌릴 수 없습니다."
          confirmLabel="영구 삭제"
          cancelLabel="취소"
          tone="danger"
          busy={confirmDelete.busy}
          onCancel={confirmDelete.onCancel}
          onConfirm={confirmDelete.onConfirm}
        />

        {courseError ? <AlertError>{courseError}</AlertError> : null}
        {loading ? <Muted>불러오는 중...</Muted> : null}

        <CourseDetailKpis
          totalStudents={kpis.totalStudents}
          capacity={kpis.capacity}
          avgAttendance={kpis.avgAttendance}
          completedCount={kpis.completedCount}
          progressPct={kpis.progressPct}
        />

        {info ? (
          <Columns>
            <Left>
              <StickyLeft>
                <CourseDetailInfoSection
                  course={course}
                  info={info}
                  editHref={header.editHref}
                />
                <CourseStudentsPanel
                  students={students.students}
                  loading={students.loading}
                  error={students.error}
                  editHref={header.editStudentsHref}
                />
                <CourseExamsPanel
                  exams={exams.exams}
                  loading={exams.loading}
                  error={exams.error}
                  onCreate={exams.onOpenCreate}
                  onEdit={exams.onOpenEdit}
                  onDelete={exams.onDeleteExam}
                  modalOpen={exams.modalOpen}
                  modalMode={exams.modalMode}
                  examMode={exams.examMode}
                  examFormError={exams.examFormError}
                  examSaving={exams.examSaving}
                  onCloseModal={exams.onCloseModal}
                  onSubmitModal={exams.onSubmitModal}
                  onExamModeChange={exams.onExamModeChange}
                  examTitleRef={exams.examTitleRef}
                  onExamTitleChange={exams.onExamTitleChange}
                />
              </StickyLeft>
            </Left>
            <Right>
              <CourseRecordsPanel
                history={records.history}
                filterYear={records.filterYear}
                filterMonth={records.filterMonth}
                onChangeYear={records.onChangeYear}
                onChangeMonth={records.onChangeMonth}
                onResetFilters={records.onResetFilters}
                exporting={records.exporting}
                onExport={records.onExport}
                collapsed={records.collapsed}
                onToggleCollapsed={records.onToggleCollapsed}
                todayHref={records.todayHref}
                detailHrefFor={records.detailHrefFor}
                getAttendanceMap={records.getAttendanceMap}
              />
            </Right>
          </Columns>
        ) : null}
      </Wrap>
    </PageLocal>
  );
}
