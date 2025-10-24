import type { Course } from "@/api/courses";
import { formatMoney } from "@/lib/format";
import {
  courseTypeLabel,
  statusLabel,
} from "@/features/courseDetail/utils";
import {
  Description,
  Field,
  GridTwo,
  Label,
  Section,
  SectionHead,
  StatusChip,
  Title,
} from "./CourseDetail.styles";
import { GhostBtnSmall as UIGhostBtnSmall } from "@/components/common/UI";

type CourseInfo = {
  days: string;
  time: string;
} | null;

type CourseDetailInfoSectionProps = {
  course: Course | null;
  info: CourseInfo;
  editHref: string;
};

export function CourseDetailInfoSection({
  course,
  info,
  editHref,
}: CourseDetailInfoSectionProps) {
  if (!info) return null;

  return (
    <Section>
      <SectionHead>
        <Title>수업 정보</Title>
        <div>
          <UIGhostBtnSmall to={editHref} data-variant="edit">
            기본정보 수정
          </UIGhostBtnSmall>
        </div>
      </SectionHead>
      <GridTwo>
        <Field>
          <Label>코드</Label>
          <div>
            <code>{course?.code}</code>
          </div>
        </Field>
        <Field>
          <Label>상태</Label>
          <div>
            <StatusChip data-type={course?.status}>
              {statusLabel(course?.status)}
            </StatusChip>
          </div>
        </Field>
        <Field>
          <Label>수업 형태</Label>
          <div>{courseTypeLabel(course?.courseType)}</div>
        </Field>
        <Field>
          <Label>요일</Label>
          <div>{info?.days || "-"}</div>
        </Field>
        <Field>
          <Label>시간</Label>
          <div>{info?.time || "-"}</div>
        </Field>
        <Field>
          <Label>정원</Label>
          <div>{course?.capacity ?? "-"}</div>
        </Field>
        <Field>
          <Label>수강료</Label>
          <div>{course?.fee != null ? formatMoney(course.fee) : "-"}</div>
        </Field>
        <Field>
          <Label>생성일</Label>
          <div>
            {course?.createdAt
              ? new Date(course.createdAt).toLocaleDateString()
              : "-"}
          </div>
        </Field>
        <Field style={{ gridColumn: "1 / -1" }}>
          <Label>수업 설명</Label>
          <Description>{course?.description || "-"}</Description>
        </Field>
      </GridTwo>
    </Section>
  );
}
