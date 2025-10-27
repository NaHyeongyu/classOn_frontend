import { useMemo } from "react";
import type { FeedbackChangelogEntry } from "@/views/feedback/FeedbackChangelogPageView";

export function useFeedbackChangelogPage() {
  const entries = useMemo<FeedbackChangelogEntry[]>(
    () => [
      {
        date: "2025-10-08",
        items: [
          "오류/요청 페이지에 email 제보 버튼 추가 (✉️ 이메일로 제보)",
          "오류/요청 폼에서 현재 페이지/브라우저 정보는 화면 비표시 처리 (서버 전송은 유지)",
          "관리자(Admin)에서 피드백 목록/상태 변경 화면 추가 (/admin/feedbacks)",
          "좌측 사이드바에 “오류/요청”, “업데이트 안내(패치노트)” 항목 추가",
        ],
      },
      {
        date: "2025-10-07",
        items: [
          "기능: 사용자 피드백 제출 API 추가 (/api/feedback)",
          "개선: 피드백 데이터 구조 및 저장 테이블(feedbacks) 도입",
        ],
      },
      {
        date: "2025-10-06",
        items: [
          "안정성: 일부 페이지 로딩 및 라우팅 전환 애니메이션 최적화",
          "UI: 사이드바/헤더 여백과 버튼 정렬 개선",
        ],
      },
    ],
    [],
  );

  return { entries };
}
