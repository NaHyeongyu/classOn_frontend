import { FeedbackPageView } from "@/components/feedback/FeedbackPageView";
import { useFeedbackPage } from "@/features/feedback/useFeedbackPage";

export default function Feedback() {
  const state = useFeedbackPage();
  return <FeedbackPageView {...state} />;
}
