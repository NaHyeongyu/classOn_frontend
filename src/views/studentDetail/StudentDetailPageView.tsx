import styled, { keyframes } from "styled-components";
import BackButton from "@/components/common/BackButton";
import {
  Badge,
  Card,
  Divider,
  SectionTitle,
  Tabs,
  TabButton,
} from "@/components/studentDetail/StudentDetailStyles";
import { StudentInfoSection } from "@/components/studentDetail/StudentInfoSection";
import { StudentMemoCard } from "@/components/studentDetail/StudentMemoCard";
import { StudentCoursesTab } from "@/components/studentDetail/StudentCoursesTab";
import { StudentAttendanceTab } from "@/components/studentDetail/StudentAttendanceTab";
import { StudentGradesTab } from "@/components/studentDetail/StudentGradesTab";
import { StudentCounselTab } from "@/components/studentDetail/StudentCounselTab";
import {
  courseStatusLabel,
  formatStudentMemoDate,
} from "@/features/studentDetail/utils";
import type {
  StudentDetailPageState,
  TabKey,
} from "@/features/studentDetail/hooks/useStudentDetailPage";

type StudentDetailPageViewProps = {
  loading: boolean;
  studentError: string | null;
  student: StudentDetailPageState["student"];
  intlAge?: number;
  deleting: boolean;
  editHref: string;
  onDeleteStudent: () => void;
  memos: StudentDetailPageState["memos"];
  activeTab: TabKey;
  onSelectTab: (tab: TabKey) => void;
  coursesCount: number;
  attendance: StudentDetailPageState["attendance"];
  grades: StudentDetailPageState["grades"];
  counsels: StudentDetailPageState["counsels"];
  deleteConfirmDialog?: React.ReactNode;
  onOpenCourse: (courseId: number) => void;
};

export function StudentDetailPageView({
  loading,
  studentError,
  student,
  intlAge,
  deleting,
  editHref,
  onDeleteStudent,
  memos,
  activeTab,
  onSelectTab,
  coursesCount,
  attendance,
  grades,
  counsels,
  deleteConfirmDialog,
  onOpenCourse,
}: StudentDetailPageViewProps) {
  return (
    <Page>
      <TopBar>
        <BackButton to="/students" label="뒤로" />
        <h2>원생 상세</h2>
      </TopBar>

      {loading ? <StudentDetailSkeleton /> : null}
      {studentError ? <Error>{studentError}</Error> : null}

      {!loading ? (
        <Columns>
          <Left>
            <StudentInfoSection
              student={student}
              intlAge={intlAge}
              deleting={deleting}
              editHref={editHref}
              onDelete={onDeleteStudent}
            />
            {/* 특이사항 입력 기능 제거됨 */}
            <StudentMemoCard
              memos={memos.memos}
              newMemo={memos.newMemo}
              onChangeNewMemo={memos.setNewMemo}
              onAddMemo={memos.addMemo}
              editingMemoId={memos.editingMemoId}
              editingMemoText={memos.editingMemoText}
              onChangeEditingMemoText={memos.setEditingMemoText}
              onBeginEditMemo={memos.beginEditMemo}
              onCancelEditMemo={memos.cancelEditMemo}
              onSaveEditMemo={memos.saveEditMemo}
              onDeleteMemo={memos.requestDeleteMemo}
              formatDate={formatStudentMemoDate}
            />
          </Left>

          <Right>
            <Card>
              <MiniHead>
                <Tabs>
                  <TabButton
                    data-active={activeTab === "courses"}
                    onClick={() => onSelectTab("courses")}
                  >
                    수강수업 <Badge>{coursesCount}</Badge>
                  </TabButton>
                  <TabButton
                    data-active={activeTab === "attendance"}
                    onClick={() => onSelectTab("attendance")}
                  >
                    출석현황
                  </TabButton>
                  <TabButton
                    data-active={activeTab === "grades"}
                    onClick={() => onSelectTab("grades")}
                  >
                    성적
                  </TabButton>
                  <TabButton
                    data-active={activeTab === "counsels"}
                    onClick={() => onSelectTab("counsels")}
                  >
                    상담기록
                  </TabButton>
                </Tabs>
              </MiniHead>

              <Divider />

              {activeTab === "courses" ? (
                <SectionBody>
                  <StudentCoursesTab
                    courses={student?.courses}
                    onOpenCourse={onOpenCourse}
                    statusLabel={courseStatusLabel}
                  />
                </SectionBody>
              ) : null}

              {activeTab === "attendance" ? (
                <SectionBody>
                  <StudentAttendanceTab
                    rows={attendance.rows}
                    loading={attendance.loading}
                    error={attendance.error}
                  />
                </SectionBody>
              ) : null}

              {activeTab === "grades" ? (
                <SectionBody>
                  <StudentGradesTab
                    grades={grades.grades}
                    courses={student?.courses}
                    loading={grades.loading}
                    error={grades.error}
                  />
                </SectionBody>
              ) : null}

              {activeTab === "counsels" ? (
                <SectionBody>
                  <StudentCounselTab
                    counsels={counsels.counsels}
                    loading={counsels.loading}
                    error={counsels.tabError}
                    exporting={counsels.exporting}
                    onExport={counsels.handleExport}
                    onAddCounsel={counsels.openAddModal}
                    addDisabled={counsels.addModalOpen}
                    editingCounselId={counsels.editState.editingId}
                    editDate={counsels.editState.editDate}
                    editHour={counsels.editState.editHour}
                    editMin={counsels.editState.editMinute}
                    editContent={counsels.editState.editContent}
                    onChangeDate={counsels.editState.setEditDate}
                    onChangeHour={counsels.editState.setEditHour}
                    onChangeMin={counsels.editState.setEditMinute}
                    onChangeContent={counsels.editState.setEditContent}
                    onStartEdit={counsels.editState.beginEdit}
                    onCancelEdit={counsels.editState.cancelEdit}
                    onSaveEdit={counsels.editState.saveEdit}
                    onRequestDelete={counsels.requestDelete}
                    savingEdit={counsels.editState.saving}
                    hourOptions={counsels.hourOptions}
                    minuteOptions={counsels.minuteOptions}
                    isAddingModalOpen={counsels.addModalOpen}
                  />
                </SectionBody>
              ) : null}
            </Card>
          </Right>
        </Columns>
      ) : null}

      {deleteConfirmDialog}
    </Page>
  );
}

function StudentDetailSkeleton() {
  return (
    <Columns>
      <Left>
        <Card>
          <SectionTitle>기본 정보</SectionTitle>
          <SkeletonRow>
            <AvatarSkeleton />
            <div>
              <Skeleton w={140} h={18} />
              <Skeleton w={120} h={12} mt={6} />
            </div>
            <SkeletonChip />
          </SkeletonRow>
          <SkField />
          <SkField />
          <SkField />
          <SkField />
        </Card>
        <Card>
          <SectionTitle>부모님 정보</SectionTitle>
          <SkField />
          <SkField />
        </Card>
      </Left>
      <Right>
        <Card>
          <MiniHead>
            <Tabs>
              <TabButton data-active>
                수강수업 <Badge>0</Badge>
              </TabButton>
              <TabButton>출석현황</TabButton>
              <TabButton>성적</TabButton>
              <TabButton>상담기록</TabButton>
            </Tabs>
          </MiniHead>
          <Divider />
          <SectionBody>
            <Skeleton w={240} h={14} />
            <Skeleton w={560} h={120} mt={10} />
          </SectionBody>
        </Card>
      </Right>
    </Columns>
  );
}

const Page = styled.div`
  display: grid;
  gap: 14px;
`;

const TopBar = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  h2 {
    margin: 0;
    font-size: 20px;
    color: #0f172a;
  }
`;

const Columns = styled.div`
  display: grid;
  grid-template-columns: 360px 1fr;
  gap: 14px;
  align-items: start;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

const Left = styled.aside`
  display: grid;
  gap: 18px;
`;

const Right = styled.section``;

const Error = styled.div`
  color: #b91c1c;
  font-size: 12px;
  font-weight: 700;
`;

const MiniHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  background: #fff;
  z-index: 5;
  padding-top: 2px;
`;

const SectionBody = styled.div`
  display: grid;
  gap: 10px;
`;

const shimmer = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: 200px 0; }
`;

const SkeletonBase = styled.div<{ w?: number; h?: number; mt?: number }>`
  background: linear-gradient(90deg, #eef2f7 25%, #f6f8fb 37%, #eef2f7 63%);
  background-size: 400px 100%;
  animation: ${shimmer} 1.2s ease-in-out infinite;
  border-radius: 8px;
  width: ${({ w }) => (w ? `${w}px` : "100%")};
  height: ${({ h }) => (h ? `${h}px` : "12px")};
  margin-top: ${({ mt }) => (mt ? `${mt}px` : 0)};
`;

const Skeleton = SkeletonBase;

const AvatarSkeleton = styled(SkeletonBase).attrs({ w: 44, h: 44 })`
  border-radius: 12px;
`;

const SkeletonRow = styled.div`
  display: grid;
  grid-template-columns: 44px 1fr 80px;
  gap: 10px;
  align-items: center;
  margin-bottom: 8px;
`;

const SkeletonChip = styled(SkeletonBase).attrs({ w: 80, h: 24 })``;

const SkField = styled(SkeletonBase).attrs({ h: 16, mt: 10 })``;
