import styled from "styled-components";
import {
  Page as PageWrap,
  buttonVariants,
  SectionCard as SectionCardBase,
  TitleH3 as TitleBase,
} from "@/components/common/UI";

export const Wrap = styled.div`
  display: grid;
  gap: ${(p) => p.theme.spacing.pageGap};
`;

export const Head = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 12px;
  align-items: center;
  h2 {
    margin: 0;
  }
  @media (max-width: 720px) {
    grid-template-columns: 1fr;
    justify-items: flex-start;
    gap: 8px;
  }
`;

export const Actions = styled.div`
  display: inline-flex;
  gap: 12px;
  flex-wrap: wrap;
`;

export const BackButton = styled.button`
  ${buttonVariants.outline};
  height: 40px;
  padding: 0 16px;
  font-weight: 600;
  font-size: 14px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
`;

export const KPIGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: ${(p) => p.theme.spacing.sm};
  width: 100%;
`;

export const Columns = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(0, 0.9fr);
  gap: ${(p) => p.theme.spacing.pageGap};
  align-items: start;
  @media (max-width: 1080px) {
    grid-template-columns: 1fr;
  }
`;

export const Left = styled.div`
  display: grid;
  gap: ${(p) => p.theme.spacing.md};
  align-content: flex-start;
`;

export const StickyLeft = styled.div`
  position: sticky;
  top: var(--sticky-top, 72px);
  z-index: 31;
  display: grid;
  gap: ${(p) => p.theme.spacing.md};
  align-content: flex-start;
  align-self: start;
  background: ${(p) => p.theme.colors.surface};
  @media (max-width: 900px) {
    position: static;
  }
`;

export const Right = styled.div`
  display: grid;
  gap: ${(p) => p.theme.spacing.md};
  align-content: flex-start;
`;

export const SectionHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${(p) => p.theme.spacing.sm};
  flex-wrap: wrap;
`;

export const Section = styled(SectionCardBase)`
  display: grid;
  gap: ${(p) => p.theme.spacing.md};
`;
export const Title = TitleBase;

export const GridTwo = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: ${(p) => p.theme.spacing.md};
`;

export const Field = styled.div`
  display: grid;
  gap: ${(p) => p.theme.spacing.xs};
`;

export const Label = styled.div`
  color: ${(p) => p.theme.colors.textMuted};
  font-size: ${(p) => p.theme.font.size.sm};
  font-weight: ${(p) => p.theme.font.weight.semiBold};
`;

export const Description = styled.div`
  color: ${(p) => p.theme.colors.text};
  white-space: pre-wrap;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 6;
  -webkit-box-orient: vertical;
`;

export const StatusChip = styled.span`
  padding: 2px 8px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 800;
  &[data-type="IN_PROGRESS"] {
    background: #dcfce7;
    color: #16a34a;
  }
  &[data-type="PENDING"] {
    background: #f3e8ff;
    color: #7c3aed;
  }
  &[data-type="STOPPED"] {
    background: #e5e7eb;
    color: #374151;
  }
`;

export const AlertError = styled.div`
  background: #fee2e2;
  color: #b91c1c;
  border: 1px solid #fecaca;
  padding: 10px 12px;
  border-radius: 10px;
  font-size: 13px;
`;

export const Muted = styled.div`
  color: #6b7280;
  font-size: 12px;
`;

export const PageLocal = styled(PageWrap)`
  display: grid;
  gap: 16px;
`;
