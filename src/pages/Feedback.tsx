import { useMemo, useState, type FormEvent } from "react";
import styled from "styled-components";
import { Page, SectionCard, PageHeader, PrimaryButton, GhostButton } from "@/components/common/UI";
import { useToast } from "@/components/common/Toast";
import { submitFeedback } from "@/api/feedback";

type Kind = "BUG" | "FEATURE";

export default function Feedback() {
  const { success, error: showError } = useToast();
  const [kind, setKind] = useState<Kind>("BUG");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [contact, setContact] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const pageUrl = useMemo(() => window.location.href, []);
  const userAgent = useMemo(() => navigator.userAgent, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) return showError("제목을 입력해주세요.");
    if (!body.trim()) return showError("내용을 입력해주세요.");
    setSubmitting(true);
    try {
      await submitFeedback({ type: kind, title: title.trim(), body: body.trim(), contact: contact.trim() || undefined, pageUrl, userAgent });
      success("소중한 의견이 접수되었습니다. 감사합니다!");
      setTitle("");
      setBody("");
      setContact("");
      setKind("BUG");
    } catch (e: any) {
      showError(e?.message || "제출에 실패했습니다. 다시 시도해 주세요.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Page>
      <PageHeader>
        <div>
          <h2>오류 제보 · 기능 요청</h2>
          <p>
            개선이 필요하거나 버그가 있다면 편하게 보내주세요. 또는 이메일로 제보: 
            <a href="mailto:nahg0525@gmail.com" style={{ marginLeft: 6 }}>nahg0525@gmail.com</a>
          </p>
        </div>
        <div style={{ display: 'inline-flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <PrimaryButton as="a" href="mailto:nahg0525@gmail.com?subject=%5BClassOn%5D%20%ED%94%BC%EB%93%9C%EB%B0%B1" style={{ whiteSpace: 'nowrap' }}>
            ✉️ 이메일로 제보
          </PrimaryButton>
          {(import.meta as any).env?.VITE_ENABLE_FEEDBACK === 'true' && (
            <GhostButton as="a" href="/feedback/changelog" style={{ whiteSpace: 'nowrap' }}>
              업데이트 안내 보기
            </GhostButton>
          )}
        </div>
      </PageHeader>

      <SectionCard as="form" onSubmit={onSubmit} aria-labelledby="fb-title">
        <Row>
          <Col>
            <Label htmlFor="fb-kind">유형</Label>
            <Select id="fb-kind" value={kind} onChange={(e) => setKind(e.target.value as Kind)}>
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
              onChange={(e) => setContact(e.target.value)}
            />
          </Col>
        </Row>

        <Label htmlFor="fb-title">제목</Label>
        <Input id="fb-title" placeholder="예: 출결 화면에서 저장이 안됩니다" value={title} onChange={(e) => setTitle(e.target.value)} />

        <Label htmlFor="fb-body">내용</Label>
        <TextArea
          id="fb-body"
          placeholder={`어떤 문제가 있었는지 또는 어떤 기능이 필요한지 자세히 알려주세요.\n(가능하면 재현 방법과 기대 동작을 함께 적어주세요.)`}
          rows={8}
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />

        {/* Meta information is still sent with submission but hidden from UI */}

        <BtnRow>
          <GhostButton type="button" onClick={() => { setTitle(""); setBody(""); setContact(""); setKind("BUG"); }}>
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
