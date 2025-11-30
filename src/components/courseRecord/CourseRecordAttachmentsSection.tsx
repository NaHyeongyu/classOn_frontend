import styled from "styled-components";
import {
  SectionCard as Section,
  TitleH3 as Title,
  PrimaryButtonSm as UIPrimaryButtonSm,
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
        <label>
          <UIPrimaryButtonSm as="span">파일 추가</UIPrimaryButtonSm>
          <input
            type="file"
            accept="image/*,application/pdf"
            multiple
            style={{ display: "none" }}
            onChange={(e) => {
              void props.onUpload(e.currentTarget.files);
              e.currentTarget.value = "";
            }}
          />
        </label>
      </SectionHeader>
      <CourseRecordAttachmentsPanel {...props} />
    </Section>
  );
}

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;
