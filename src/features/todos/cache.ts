import { invalidateCache } from "../../lib/fetcher";

// EN: Invalidate cached responses for a given date-based todos endpoint
// KO: 특정 날짜 기준의 할 일 API 캐시 무효화
export function invalidateTodosCache(ymd: string) {
  invalidateCache(`/api/todos?dueYmd=${ymd}`);
}

