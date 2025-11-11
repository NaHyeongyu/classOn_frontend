import { useMemo } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { CourseRecordDetailPageView } from "@/views/courseRecord/CourseRecordDetailPageView";
import { useCourseRecordDetailPage } from "@/features/courseRecord/useCourseRecordDetailPage";

export default function CourseRecordDetail() {
  const { id, recordId, ymd } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const courseId = useMemo(() => {
    if (!id) return null;
    const parsed = Number(id);
    return Number.isFinite(parsed) ? parsed : null;
  }, [id]);

  const recId = useMemo(() => {
    if (!recordId) return null;
    const parsed = Number(recordId);
    return Number.isFinite(parsed) ? parsed : null;
  }, [recordId]);

  const detail = useCourseRecordDetailPage({
    courseId,
    recordId: recId,
    ymd,
    searchParams,
  });

  const handleBack = () => {
    if (courseId != null) {
      navigate(`/classes/${courseId}`);
    } else {
      navigate("/classes");
    }
  };

  const handleDelete = async () => {
    const ok = await detail.deleteRecord();
    if (ok) {
      handleBack();
    }
    return ok;
  };

  const recordExists = Boolean(detail.record?.id);
  const instructorName =
    typeof detail.course?.instructorName === "string"
      ? detail.course.instructorName
      : typeof detail.record?.instructorName === "string"
        ? detail.record.instructorName
        : null;

  const courseTitle: string | null = useMemo(() => {
    if (detail.course?.title) return detail.course.title;
    if (
      detail.course &&
      typeof detail.course === "object" &&
      "name" in detail.course
    ) {
      const maybeName = (detail.course as { name?: unknown }).name;
      if (typeof maybeName === "string" && maybeName.trim()) {
        return maybeName;
      }
    }
    return null;
  }, [detail.course]);

  return (
    <CourseRecordDetailPageView
      header={{
        courseId,
        courseTitle,
        headLoading: detail.headLoading,
        whenInfo: detail.editor.meta.whenInfo,
        canDelete: recordExists,
      }}
      instructorName={instructorName}
      onBack={handleBack}
      onDeleteRecord={handleDelete}
      error={detail.error}
      loading={detail.loading}
      stats={detail.stats}
      editor={detail.editor}
      attachments={{ ...detail.attachments, maxFileSizeMb: detail.maxFileSizeMb }}
      recordExists={recordExists}
      attendancePanelProps={detail.attendancePanelProps}
      attendanceMeta={detail.attendanceMeta}
      gradesPanelProps={detail.gradesPanelProps}
      gradesMeta={detail.gradesMeta}
      rightTab={detail.rightTab}
      onChangeRightTab={detail.setRightTab}
      headLoading={detail.headLoading}
    />
  );
}
