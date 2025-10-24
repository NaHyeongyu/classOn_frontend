import styled from "styled-components";
import {
  SectionCard as Section,
  TitleH3 as Title,
} from "@/components/common/UI";
import {
  CourseRecordAttachmentsPanel,
  type CourseRecordAttachmentsPanelProps,
} from "@/components/courseRecord/CourseRecordAttachmentsPanel";

type Props = CourseRecordAttachmentsPanelProps;

export function CourseRecordAttachmentsSection(props: Props) {
  return (
    <Section>
      <SectionHeader>
        <Title>수업 파일</Title>
      </SectionHeader>
      <CourseRecordAttachmentsPanel {...props} />
    </Section>
  );
}

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
`;
