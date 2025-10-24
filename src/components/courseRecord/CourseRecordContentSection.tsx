import { SectionCard as Section, TitleH3 as Title } from "@/components/common/UI";
import styled from "styled-components";
import {
  Muted,
  SmallMuted,
  SuccessBadge,
} from "./CourseRecordStyles";

type Props = {
  recordExists: boolean;
  contentValue: string;
  saving: boolean;
  feedback: "idle" | "success";
  onChange: (value: string) => void;
  textareaId?: string;
};

export function CourseRecordContentSection({
  recordExists,
  contentValue,
  saving,
  feedback,
  onChange,
  textareaId = "contentArea",
}: Props) {
  return (
    <Section>
      <ContentHeader>
        <Title>수업 내용</Title>
        {recordExists && (
          <ContentActions>
            {saving ? (
              <SmallMuted>저장 중...</SmallMuted>
            ) : feedback === "success" ? (
              <SuccessBadge role="status">저장 완료!</SuccessBadge>
            ) : null}
          </ContentActions>
        )}
      </ContentHeader>
      {recordExists ? (
        <ContentTextArea
          id={textareaId}
          rows={8}
          value={contentValue}
          onChange={(e) => onChange(e.currentTarget.value)}
          placeholder="수업 내용을 입력하세요"
        />
      ) : (
        <Muted>서버 기록이 없는 일정입니다. 생성 후 편집 가능합니다.</Muted>
      )}
    </Section>
  );
}

const ContentHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
`;

const ContentActions = styled.div`
  display: inline-flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
`;

const ContentTextArea = styled.textarea`
  width: 100%;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 8px 10px;
  font-size: 14px;
  resize: vertical;
  min-height: 160px;
`;
