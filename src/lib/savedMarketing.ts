export type SavedMarketing = {
  id: string;
  createdAt: number;
  platform: 'INSTAGRAM'|'NAVER_BLOG'|'KAKAO_CHANNEL';
  speechStyle?: 'SEUMNIDA'|'YO';
  tone?: string;
  title?: string;
  body: string;
  tags: string[];
};

export const SAVED_MARKETING_KEY = 'marketing:saved:v1';

export function getSavedMarketingPosts(): SavedMarketing[] {
  try {
    const raw = localStorage.getItem(SAVED_MARKETING_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return [];
    return arr as SavedMarketing[];
  } catch { return []; }
}

export function saveMarketingPost(post: Omit<SavedMarketing, 'id'|'createdAt'>): SavedMarketing {
  const now = Date.now();
  const rec: SavedMarketing = { id: String(now), createdAt: now, ...post };
  const list = getSavedMarketingPosts();
  const next = [rec, ...list].slice(0, 50);
  try { localStorage.setItem(SAVED_MARKETING_KEY, JSON.stringify(next)); } catch {}
  return rec;
}

export function clearSavedMarketingPosts() {
  try { localStorage.removeItem(SAVED_MARKETING_KEY); } catch {}
}

export function removeSavedMarketingPost(id: string) {
  const list = getSavedMarketingPosts();
  const next = list.filter((p) => p.id !== id);
  try { localStorage.setItem(SAVED_MARKETING_KEY, JSON.stringify(next)); } catch {}
}
