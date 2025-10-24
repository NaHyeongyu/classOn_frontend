import { useMemo, useState, type FormEvent } from "react";
import { useToast } from "@/components/common/Toast";
import { submitFeedback } from "@/api/feedback";

export type FeedbackKind = "BUG" | "FEATURE";

export function useFeedbackPage() {
  const { success, error } = useToast();
  const [kind, setKind] = useState<FeedbackKind>("BUG");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [contact, setContact] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const pageUrl = useMemo(() => window.location.href, []);
  const userAgent = useMemo(() => navigator.userAgent, []);

  const titlePlaceholder = useMemo(
    () =>
      kind === "FEATURE"
        ? "예: 출결 화면에 자동 저장 기능이 있으면 좋겠어요"
        : "예: 출결 화면에서 저장이 안됩니다",
    [kind],
  );

  const reset = () => {
    setTitle("");
    setBody("");
    setContact("");
    setKind("BUG");
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title.trim()) {
      error("제목을 입력해주세요.");
      return;
    }
    if (!body.trim()) {
      error("내용을 입력해주세요.");
      return;
    }
    setSubmitting(true);
    try {
      await submitFeedback({
        type: kind,
        title: title.trim(),
        body: body.trim(),
        contact: contact.trim() || undefined,
        pageUrl,
        userAgent,
      });
      success("소중한 의견이 접수되었습니다. 감사합니다!");
      reset();
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "제출에 실패했습니다. 다시 시도해 주세요.";
      error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return {
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
    onReset: reset,
  };
}
