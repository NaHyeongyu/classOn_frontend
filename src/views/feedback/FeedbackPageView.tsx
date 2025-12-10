import styled, { css } from "styled-components";
import {
  GhostButton,
  Page,
  PageHeader,
  PrimaryButton,
  SectionCard,
} from "@/components/common/UI";
import SelectBox from "@/components/common/SelectBox";
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
          <h2>오류/피드백</h2>
          <p>
            개선이 필요하거나 버그가 있다면 편하게 보내주세요. 또는 이메일로 제보:
            <EmailLink href="mailto:nahg0525@gmail.com">
              nahg0525@gmail.com
            </EmailLink>
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
              업데이트 안내
            </GhostButton>
          )}
        </Actions>
      </PageHeader>

      <SectionCard as="form" onSubmit={onSubmit} aria-labelledby="fb-title">
        <Row>
          <Col>
            <Label htmlFor="fb-kind">유형</Label>
            <SelectBox
              ariaLabel="유형"
              value={kind}
              onChange={(value) => setKind((value as FeedbackKind) ?? "BUG")}
              options={[
                { label: "오류", value: "BUG" },
                { label: "피드백", value: "FEATURE" },
              ]}
            />
          </Col>
          <Col>
            <Label htmlFor="fb-contact">
              연락처 <OptionalBadge>선택</OptionalBadge>
            </Label>
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
          placeholder={`어떤 문제가 있었는지 또는 어떤 기능이 필요한지 자세히 알려주세요.\n\n• 재현 방법\n• 기대했던 동작\n• 실제 발생한 동작\n\n위 내용을 포함해주시면 더 빠르게 해결할 수 있습니다.`}
          rows={10}
          value={body}
          onChange={(event) => setBody(event.target.value)}
        />

        <BtnRow>
          <GhostButton type="button" onClick={onReset}>
            초기화
          </GhostButton>
          <PrimaryButton type="submit" disabled={submitting}>
            {submitting ? (
              <>
                <Spinner />
                제출 중…
              </>
            ) : (
              "제출하기"
            )}
          </PrimaryButton>
        </BtnRow>
      </SectionCard>
    </Page>
  );
}

const EmailLink = styled.a`
  color: ${(p) => p.theme.colors.primary};
  text-decoration: none;
  margin-left: 6px;
  font-weight: ${(p) => p.theme.font.weight.medium};
  transition: color ${(p) => p.theme.motion.duration.base};

  &:hover {
    color: ${(p) => p.theme.colors.primaryHover};
    text-decoration: underline;
  }
`;

const Actions = styled.div`
  display: inline-flex;
  gap: ${(p) => p.theme.spacing.xs};
  align-items: center;
  flex-wrap: wrap;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${(p) => p.theme.spacing.md};
  margin-bottom: ${(p) => p.theme.spacing.md};
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Col = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  display: block;
  margin-bottom: ${(p) => p.theme.spacing.xs};
  margin-top: ${(p) => p.theme.spacing.md};
  font-size: ${(p) => p.theme.font.size.sm};
  font-weight: ${(p) => p.theme.font.weight.semiBold};
  color: ${(p) => p.theme.colors.text};
  
  &:first-of-type {
    margin-top: 0;
  }
`;

const OptionalBadge = styled.span`
  font-size: ${(p) => p.theme.font.size.xs};
  font-weight: ${(p) => p.theme.font.weight.medium};
  color: ${(p) => p.theme.colors.textMuted};
  background: ${(p) => p.theme.colors.surfaceMuted};
  padding: 2px 6px;
  border-radius: ${(p) => p.theme.radii.xs};
  margin-left: 4px;
`;

const inputStyles = css`
  width: 100%;
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.radii.sm};
  padding: 0 12px;
  background: ${(p) => p.theme.colors.surface};
  color: ${(p) => p.theme.colors.text};
  font-size: ${(p) => p.theme.font.size.md};
  font-family: inherit;
  transition: all ${(p) => p.theme.motion.duration.base} ${(p) => p.theme.motion.easing.standard};

  &:hover {
    border-color: ${(p) => p.theme.colors.borderStrong};
  }

  &:focus {
    outline: none;
    border-color: ${(p) => p.theme.colors.primary};
    box-shadow: ${(p) => p.theme.shadow.focusPrimary};
  }

  &::placeholder {
    color: ${(p) => p.theme.colors.textMuted};
  }
`;

const Input = styled.input`
  ${inputStyles}
  height: 40px;
`;

const TextArea = styled.textarea`
  ${inputStyles}
  padding: 12px;
  resize: vertical;
  min-height: 160px;
  line-height: ${(p) => p.theme.font.lineHeight.relaxed};
  font-family: inherit;
`;

const BtnRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${(p) => p.theme.spacing.sm};
  margin-top: ${(p) => p.theme.spacing.md};

  @media (max-width: 480px) {
    flex-direction: column-reverse;
    
    button {
      width: 100%;
    }
  }
`;

const spin = css`
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const Spinner = styled.span`
  ${spin}
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  margin-right: 8px;
`;
