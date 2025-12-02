import {
  SectionCard as Section,
  TitleH3 as Title,
  PrimaryButtonSm as UIPrimaryButtonSm,
  GhostButton as UIGhostButton,
} from "@/components/common/UI";
import {
  Muted,
  SmallBtn,
  SmallMuted,
  SuccessBadge,
} from "@/components/courseRecord/CourseRecordStyles";
import { CourseRecordAttendancePanel } from "@/components/courseRecord/CourseRecordAttendancePanel";
import { CourseRecordGradesPanel } from "@/components/courseRecord/CourseRecordGradesPanel";
import type { UseCourseRecordGradesReturn } from "@/features/courseRecord/useCourseRecordGrades";
import {
  AttSticky,
  BulkActions,
  HeaderText,
  SectionHeader,
  TabBar,
  TabBtn,
  TopTabs,
} from "./CourseRecordDetail.styles";
import type { Dispatch, SetStateAction } from "react";

export type CourseRecordRightTab = "attendance" | "grades";

export type CourseRecordAttendanceProps = React.ComponentProps<typeof CourseRecordAttendancePanel>;

export type CourseRecordGradesPanelProps = {
  gradeView: "intro" | "list" | "scores";
  setGradeView: Dispatch<SetStateAction<"intro" | "list" | "scores">>;
  scoreStudents: { id: number; name: string }[];
  grades: UseCourseRecordGradesReturn;
  openExamModal: () => void;
  closeExamModal: () => void;
};

type Props = {
  tab: CourseRecordRightTab;
  onChangeTab: (tab: CourseRecordRightTab) => void;
  attendanceProps: CourseRecordAttendanceProps;
  attendanceMeta: {
    actionableCount: number;
    onBulkAllPresent: () => void;
    onOpenBulkSelect: () => void;
  };
  gradesProps: CourseRecordGradesPanelProps;
  gradesMeta: {
    examCreateOk: boolean;
    selectedExamId: number | null;
    examLoading: boolean;
    onOpenExamModal: () => void;
    onDeleteExam: () => Promise<void> | void;
  };
};

export function CourseRecordRightPanel({
  tab,
  onChangeTab,
  attendanceProps,
  attendanceMeta,
  gradesProps,
  gradesMeta,
}: Props) {
  const {
    actionableCount,
    onBulkAllPresent,
    onOpenBulkSelect,
  } = attendanceMeta;
  const {
    examCreateOk,
    selectedExamId,
    examLoading,
    onOpenExamModal,
    onDeleteExam,
  } = gradesMeta;

  return (
    <>
      <TopTabs>
        <TabBar>
          <TabBtn
            data-active={String(tab === "attendance")}
            onClick={() => onChangeTab("attendance")}
          >
            출결 현황
          </TabBtn>
          <TabBtn
            data-active={String(tab === "grades")}
            onClick={() => onChangeTab("grades")}
          >
            시험/테스트
          </TabBtn>
        </TabBar>
      </TopTabs>
      <Section>
        <AttSticky>
          <SectionHeader>
            <HeaderText>
              <Title>{tab === "attendance" ? "출결 현황" : "시험/테스트"}</Title>
              {tab === "attendance" ? (
                <Muted>학생별 출석 상태를 수동으로 처리하세요. 변경 시 확인 창이 표시됩니다.</Muted>
              ) : (
                <Muted>시험 선택 버튼을 눌러 기존 시험을 선택하세요.</Muted>
              )}
            </HeaderText>
            {tab === "attendance" ? (
              <BulkActions>
                <SmallBtn
                  type="button"
                  onClick={onBulkAllPresent}
                  disabled={
                    attendanceProps.bulkStatus !== null ||
                    attendanceProps.attLoading ||
                    actionableCount === 0
                  }
                >
                  전체 출석
                </SmallBtn>
                <SmallBtn
                  type="button"
                  onClick={onOpenBulkSelect}
                  disabled={
                    attendanceProps.bulkStatus !== null ||
                    attendanceProps.attLoading ||
                    actionableCount === 0
                  }
                >
                  선택 출석
                </SmallBtn>
                {attendanceProps.bulkStatus && (
                  <SmallMuted>일괄 출석 처리 중…</SmallMuted>
                )}
              </BulkActions>
            ) : (
              <BulkActions>
                {examCreateOk ? <SuccessBadge role="status">시험 생성됨</SuccessBadge> : null}
                <UIPrimaryButtonSm
                  type="button"
                  onClick={() => onOpenExamModal()}
                  disabled={examLoading}
                >
                  시험 선택
                </UIPrimaryButtonSm>
                {selectedExamId ? (
                  <UIGhostButton
                    type="button"
                    data-variant="danger"
                    onClick={() => {
                      void onDeleteExam();
                    }}
                    disabled={examLoading}
                  >
                    삭제
                  </UIGhostButton>
                ) : null}
              </BulkActions>
            )}
          </SectionHeader>
        </AttSticky>
        {tab === "attendance" ? (
          <CourseRecordAttendancePanel {...attendanceProps} />
        ) : (
          <CourseRecordGradesPanel {...gradesProps} />
        )}
      </Section>
    </>
  );
}
