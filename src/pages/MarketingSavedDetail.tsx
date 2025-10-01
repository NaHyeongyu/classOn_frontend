import { useMemo } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { Page, SectionCard, GhostButtonSmall, TitleH3, PageHeader } from '@/components/common/UI';
import { getSavedMarketingPosts, removeSavedMarketingPost, type SavedMarketing, SAVED_MARKETING_KEY } from '@/lib/savedMarketing';
import { getSaved } from '@/api/marketingSaved';
import { useToast } from '@/components/common/Toast';

export default function MarketingSavedDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { success, error: showError } = useToast();
  const rec = useMemo(() => {
    const local = getSavedMarketingPosts().find((p) => p.id === id);
    return local;
  }, [id]);
  // Try server fetch if local not found (direct entry from URL)
  // Note: simplistic – converts to local shape without state mgmt; could add local state for robustness
  if (!rec && id && /^\d+$/.test(id)) {
    // eslint-disable-next-line no-console
    getSaved(Number(id)).then((srv) => {
      const post = { id: String(srv.id), platform: srv.platform as any, speechStyle: srv.speechStyle as any, tone: srv.tone || undefined, title: srv.title || undefined, body: srv.body, tags: srv.tags || [], createdAt: srv.createdAt ? new Date(srv.createdAt).getTime() : Date.now() } as SavedMarketing;
      try {
        const list = getSavedMarketingPosts();
        if (!list.find(l => l.id === post.id)) {
          // cache to local for quick open
          const arr = [post, ...list].slice(0, 50);
          localStorage.setItem(SAVED_MARKETING_KEY, JSON.stringify(arr));
        }
      } catch {}
    }).catch(()=>{});
  }
  if (!rec) {
    return (
      <Page>
        <PageHeader>
          <div>
            <h2>저장 내역 상세</h2>
            <p>항목을 찾을 수 없습니다.</p>
          </div>
          <GhostButtonSmall as="button" onClick={() => navigate('/marketing/saved')}>목록</GhostButtonSmall>
        </PageHeader>
      </Page>
    );
  }
  const tags = rec.tags?.join(' ') || '';
  const date = new Date(rec.createdAt).toLocaleString();
  return (
    <Page>
      <PageHeader>
        <div>
          <h2>저장 내역 상세</h2>
          <p>{pf(rec.platform)} · {date}</p>
        </div>
        <div style={{ display:'flex', gap: 8 }}>
          <GhostButtonSmall as="button" onClick={() => navigate('/marketing/saved')}>목록</GhostButtonSmall>
          <GhostButtonSmall as="button" onClick={() => { const text = [rec.body, tags].filter(Boolean).join('\n\n'); navigator.clipboard?.writeText(text).then(()=>success('복사되었습니다.')).catch(()=>showError('복사 실패')); }}>복사</GhostButtonSmall>
          <GhostButtonSmall as="button" onClick={() => { removeSavedMarketingPost(rec.id); navigate('/marketing/saved'); success('삭제했습니다.'); }}>삭제</GhostButtonSmall>
        </div>
      </PageHeader>

      <SplitGrid>
        <SectionCard>
          <TitleH3>저장한 캡션</TitleH3>
          <MetaRow>
            <Chip>{pf(rec.platform)}</Chip>
            <Chip>{date}</Chip>
          </MetaRow>
          <Label>본문</Label>
          <Pre aria-label="body">{rec.body}</Pre>
          {tags ? (<>
            <Label>태그</Label>
            <Block aria-label="tags">{tags}</Block>
          </>) : null}
        </SectionCard>

        <SectionCard>
          <TitleH3>모바일 예시</TitleH3>
          <IGPreviewWrap>
            <IGPhone>
              <IGTopBar>
                <IGAvatar />
                <IGUser>our_academy</IGUser>
              </IGTopBar>
              <IGImage role="img" aria-label="이미지 예시">
                <span>미리보기</span>
              </IGImage>
              <IGText>
                <strong>our_academy</strong> {rec.body}
                {tags ? (<><br/><span className="tags">{tags}</span></>) : null}
              </IGText>
            </IGPhone>
          </IGPreviewWrap>
        </SectionCard>
      </SplitGrid>
    </Page>
  );
}

function pf(p: SavedMarketing['platform']): string { return p==='INSTAGRAM'?'인스타그램':p==='NAVER_BLOG'?'블로그':'카카오 채널'; }

const Empty = styled.div`
  color: ${({ theme }) => theme.colors.textMuted}; font-size: 13px;
`;
const SplitGrid = styled.div`
  display: grid; gap: 12px; grid-template-columns: 1fr; @media (min-width: 960px){ grid-template-columns: 2fr 1fr; }
`;
const MetaRow = styled.div`
  display: flex; gap: 6px; flex-wrap: wrap; margin: 6px 0 10px;
`;
const Chip = styled.span`
  display: inline-flex; align-items: center; height: 24px; padding: 0 10px; border-radius: 999px; border: 1px solid ${({ theme }) => theme.colors.border}; font-size: 12px; color: ${({ theme }) => theme.colors.text};
`;
const Label = styled.div`
  font-size: 12px; font-weight: 700; color: ${({ theme }) => theme.colors.textMuted}; margin: 6px 0 4px;
`;
const Block = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border}; border-radius: 10px; padding: 10px; background: #fff; font-size: 13px; color: ${({ theme }) => theme.colors.text};
`;
const Pre = styled.pre`
  white-space: pre-wrap; word-break: break-word; border: 1px solid ${({ theme }) => theme.colors.border}; border-radius: 10px; padding: 10px; background: #fff; font-size: 13px; color: ${({ theme }) => theme.colors.text}; margin: 0;
`;

// simple IG preview
const IGPreviewWrap = styled.div`
  display: grid; place-items: center; padding: 8px;
`;
const IGPhone = styled.div`
  width: 360px; max-width: 100%; background: #fff; border: 1px solid ${({theme}) => theme.colors.border}; border-radius: 18px; overflow: hidden; box-shadow: 0 8px 24px rgba(0,0,0,0.08);
`;
const IGTopBar = styled.div`
  display: flex; align-items: center; gap: 8px; padding: 10px;
`;
const IGAvatar = styled.div`
  width: 28px; height: 28px; border-radius: 50%; background: ${({theme}) => theme.colors.surfaceMuted}; border: 1px solid ${({theme}) => theme.colors.border};
`;
const IGUser = styled.div`
  font-weight: 800; color: ${({theme}) => theme.colors.text}; font-size: 13px;
`;
const IGImage = styled.div`
  position: relative; width: 100%; aspect-ratio: 4/5; background: #e5e7eb; display: grid; place-items: center; color: #6b7280;
  span{ font-size: 12px; padding: 4px 8px; background: rgba(255,255,255,0.7); border-radius: 8px; }
`;
const IGText = styled.div`
  padding: 10px; font-size: 13px; line-height: 1.5; color: ${({theme}) => theme.colors.text}; white-space: pre-wrap; word-break: break-word;
  strong{ margin-right: 6px; }
  .tags{ display: block; margin-top: 6px; color: ${({theme}) => theme.colors.textMuted}; }
`;
