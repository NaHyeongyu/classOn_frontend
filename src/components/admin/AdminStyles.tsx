import styled, { keyframes } from 'styled-components';

export const PageWrap = styled.div`
  display: grid;
  gap: 16px;
`;

export const PageHeader = styled.header`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 0;
`;

export const PageTitle = styled.h2`
  margin: 0;
  font-size: 20px;
  font-weight: 800;
  color: #0f172a;
`;

export const PageSubtitle = styled.span`
  display: block;
  margin-top: 4px;
  font-size: 12px;
  color: #64748b;
`;

export const HeaderBlock = styled.div`
  display: grid;
  gap: 4px;
`;

export const Toolbar = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

export const ToolbarGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
`;

export const ToolbarInfo = styled.span`
  font-size: 12px;
  color: #64748b;
  font-weight: 700;
`;

export const FieldLabel = styled.label`
  font-size: 12px;
  font-weight: 700;
  color: #475569;
  display: inline-flex;
  align-items: center;
  gap: 6px;
`;

export const Input = styled.input`
  height: 40px;
  padding: 0 12px;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  color: #0f172a;
  font-size: 14px;
`;

export const Select = styled.select`
  height: 40px;
  padding: 0 12px;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  color: #0f172a;
  font-size: 14px;
  cursor: pointer;
`;

const monoButtonBase = `
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 40px;
  padding: 0 14px;
  border-radius: 10px;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  transition: background .15s ease, color .15s ease, border-color .15s ease;
`;

export const MonoPrimary = styled.button`
  ${monoButtonBase};
  background: #111827;
  color: #ffffff;
  border: 1px solid #111827;
  &:hover {
    background: #000000;
    border-color: #000000;
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const MonoGhost = styled.button`
  ${monoButtonBase};
  background: #ffffff;
  color: #111827;
  border: 1px solid #e5e7eb;
  &:hover {
    background: #f9fafb;
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    pointer-events: none;
  }
`;

export const Card = styled.section`
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: #ffffff;
  padding: 16px;
  display: grid;
  gap: 12px;
`;

export const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 800;
    color: #0f172a;
  }
`;

export const CardMeta = styled.span`
  font-size: 12px;
  color: #94a3b8;
`;

export const GridTwo = styled.div`
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
`;

export const GridFull = styled.div`
  display: grid;
  gap: 16px;
`;

export const StatsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 10px;
  li {
    display: grid;
    grid-template-columns: 140px 1fr;
    gap: 12px;
    font-size: 13px;
    color: #0f172a;
  }
  .label {
    font-weight: 700;
    color: #64748b;
    font-size: 12px;
    letter-spacing: .01em;
  }
  .value {
    font-weight: 800;
  }
`;

export const TableWrap = styled.div`
  width: 100%;
  overflow: auto;
  border: 1px solid #f1f5f9;
  border-radius: 12px;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  thead th {
    position: sticky;
    top: 0;
    background: #f8fafc;
    font-size: 12px;
    font-weight: 800;
    color: #64748b;
    padding: 10px 12px;
    border-bottom: 1px solid #e5e7eb;
    text-align: left;
  }
  tbody td {
    padding: 10px 12px;
    border-bottom: 1px solid #f1f5f9;
    font-size: 13px;
    color: #0f172a;
  }
  tbody tr:nth-child(odd) td {
    background: #fcfcfd;
  }
  tbody tr:hover td {
    background: #f9fafb;
  }
`;

const shimmer = keyframes`
  0% { background-position: 100% 0; }
  100% { background-position: 0 0; }
`;

export const SkeletonLine = styled.span<{ $width?: number | string; $height?: number }>`
  display: block;
  width: ${({ $width }) =>
    typeof $width === 'number' ? `${$width}px` : $width || '100%'};
  height: ${({ $height }) => ($height ? `${$height}px` : '12px')};
  border-radius: 999px;
  background: linear-gradient(90deg, #f1f5f9 0%, #e2e8f0 50%, #f1f5f9 100%);
  background-size: 200% 100%;
  animation: ${shimmer} 1.2s ease-in-out infinite;
`;

export const TableStatus = styled.div<{ $variant?: 'default' | 'error' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 18px;
  font-size: 13px;
  font-weight: 600;
  color: ${({ $variant }) => ($variant === 'error' ? '#b91c1c' : '#475569')};
`;

export const Pager = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
`;

export const PagerGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const InlineBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 999px;
  background: #e0f2fe;
  color: #0369a1;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: .02em;
`;

export const Muted = styled.span`
  font-size: 12px;
  color: #94a3b8;
`;

export const ErrorBanner = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  border: 1px solid #fecaca;
  background: #fee2e2;
  color: #b91c1c;
  font-weight: 600;
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 13px;
`;
