import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

export const LoadingSpinner = styled.div`
  width: 20px; height: 20px; border-radius: 9999px;
  border: 2px solid rgba(99,102,241,0.25); border-top-color: #4f46e5;
  animation: ${spin} 700ms linear infinite;
`;

export function PageLoading() {
  return (
    <div style={{ display: 'grid', gap: 10 }}>
      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
        <LoadingSpinner />
        <span style={{ color:'#6b7280', fontSize:13 }}>페이지를 불러오는 중…</span>
      </div>
      <div style={{ display:'grid', gap:6 }}>
        <Skeleton w={220} />
        <Skeleton w={'100%'} />
        <Skeleton w={'92%'} />
      </div>
    </div>
  );
}

// lightweight local Skeleton to avoid cyclic deps with UI.tsx
const Shimmer = keyframes`
  0% { background-position: 100% 0; }
  100% { background-position: 0 0; }
`;
const Skeleton = styled.div<{ w?: number | string; h?: number }>`
  --w: ${({w}) => (typeof w === 'number' ? `${w}px` : (w || '100%'))};
  --h: ${({h}) => (h ? `${h}px` : '14px')};
  width: var(--w); height: var(--h);
  border-radius: 8px;
  background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 37%, #f3f4f6 63%);
  background-size: 400% 100%;
  animation: ${Shimmer} 1.2s ease-in-out infinite;
`;

