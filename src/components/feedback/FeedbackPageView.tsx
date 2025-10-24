import styled from "styled-components";
import {
  GhostButton,
  Page,
  PageHeader,
  PrimaryButton,
  SectionCard,
} from "@/components/common/UI";
import type {
  FeedbackKind,
  useFeedbackPage,
} from "@/features/feedback/useFeedbackPage";

type FeedbackPageViewProps = ReturnType<typeof useFeedbackPage>;

export function FeedbackPageView({
  kind,
  setKind,
  title,
  setTitle,
  body,
  setBody,
  contact,
  setContact,
  submitting,
  titlePlaceholder,
  onSubmit,
  onReset,
}: FeedbackPageViewProps) {
  return (
    <Page>
      <PageHeader>
        <div>
          <h2>오류 제보 · 기능 요청</h2>
          <p>
            개선이 필요하거나 버그가 있다면 편하게 보내주세요. 또는 이메일로 제보:
            <a href="mailto:nahg0525@gmail.com" style={{ marginLeft: 6 }}>
              nahg0525@gmail.com
            </a>
          </p>
        </div>
        <Actions>
          <PrimaryButton
            as="a"
            href="mailto:nahg0525@gmail.com?subject=%5BClassOn%5D%20%ED%94%BC%EB%93%9C%EB%B0%B1"
            style={{ whiteSpace: "nowrap" }}
          >
            ✉️ 이메일로 제보
          </PrimaryButton>
          {import.meta.env?.VITE_ENABLE_FEEDBACK === "true" && (
            <GhostButton
              as="a"
              href="/feedback/changelog"
              style={{ whiteSpace: "nowrap" }}
            >
              업데이트 안내 보기
            </GhostButton>
          )}
        </Actions>
      </PageHeader>

      <HighlightCard role="note" aria-label="서비스 안내">
        <HighlightTitle>Classon은 아직 성장하고 있습니다.</HighlightTitle>
        <HighlightBody>
          <p>선생님들의 목소리에 귀 기울이며,</p>
          <p>현장에서 정말 필요한 기능을 하나씩 만들어가고 있습니다.</p>
          <p>부족한 부분이 있을 수 있습니다.</p>
          <p>하지만 여러분과 함께 더 나은 서비스로 발전해 나가겠습니다.</p>
        </HighlightBody>
      </HighlightCard>

      <SectionCard as="form" onSubmit={onSubmit} aria-labelledby="fb-title">
        <Row>
          <Col>
            <Label htmlFor="fb-kind">유형</Label>
            <Select
              id="fb-kind"
              value={kind}
              onChange={(event) =>
                setKind(event.target.value as FeedbackKind)
              }
            >
              <option value="BUG">오류 제보</option>
              <option value="FEATURE">기능 요청</option>
            </Select>
          </Col>
          <Col>
            <Label htmlFor="fb-contact">연락처 (선택)</Label>
            <Input
              id="fb-contact"
              placeholder="답변을 받고 싶은 이메일 또는 연락처"
              value={contact}
              onChange={(event) => setContact(event.target.value)}
            />
          </Col>
        </Row>

        <Label htmlFor="fb-title">제목</Label>
        <Input
          id="fb-title"
          placeholder={titlePlaceholder}
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />

        <Label htmlFor="fb-body">내용</Label>
        <TextArea
          id="fb-body"
          placeholder={`어떤 문제가 있었는지 또는 어떤 기능이 필요한지 자세히 알려주세요.\n(가능하면 재현 방법과 기대 동작을 함께 적어주세요.)`}
          rows={8}
          value={body}
          onChange={(event) => setBody(event.target.value)}
        />

        <BtnRow>
          <GhostButton type="button" onClick={onReset}>
            초기화
          </GhostButton>
          <PrimaryButton type="submit" disabled={submitting}>
            {submitting ? "제출 중…" : "제출하기"}
          </PrimaryButton>
        </BtnRow>
      </SectionCard>
    </Page>
  );
}

const Actions = styled.div`
  display: inline-flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 8px;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Col = styled.div``;

const Label = styled.label`
  display: block;
  margin: 8px 0 6px;
  font-size: 12px;
  color: #6b7280;
`;

const Input = styled.input`
  width: 100%;
  height: 40px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 0 12px;
`;

const Select = styled.select`
  width: 100%;
  height: 40px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 0 8px;
  background: #fff;
`;

const TextArea = styled.textarea`
  width: 100%;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 10px 12px;
  resize: vertical;
`;

const BtnRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 14px;
`;

const HighlightCard = styled(SectionCard)`
  border-left: 4px solid #4f46e5;
  background: linear-gradient(
    135deg,
    rgba(79, 70, 229, 0.08),
    rgba(59, 130, 246, 0.05)
  );
  padding: 24px 28px;
  display: grid;
  gap: 12px;
`;

const HighlightTitle = styled.h3`
  margin: 0;
  font-size: 20px;
  font-weight: 800;
  color: #1f2937;
`;

const HighlightBody = styled.div`
  display: grid;
  gap: 6px;
  p {
    margin: 0;
    font-size: 15px;
    color: #374151;
    line-height: 1.6;
  }
`;
