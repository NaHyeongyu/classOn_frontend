import { FeedbackPageView } from "@/views/feedback/FeedbackPageView";
import { useFeedbackPage } from "@/features/feedback/useFeedbackPage";

export default function Feedback() {
  const state = useFeedbackPage();
  return <FeedbackPageView {...state} />;
}
