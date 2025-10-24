import { FeedbackChangelogPageView } from "@/components/feedback/FeedbackChangelogPageView";
import { useFeedbackChangelogPage } from "@/features/feedback/hooks/useFeedbackChangelogPage";

export default function FeedbackChangelogPage() {
  const { entries } = useFeedbackChangelogPage();
  return <FeedbackChangelogPageView entries={entries} />;
}
