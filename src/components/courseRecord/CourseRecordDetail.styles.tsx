import styled from "styled-components";

export const Wrap = styled.div`
  display: grid;
  gap: 12px;
`;

export const Columns = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-start;
  @media (max-width: 1024px) {
    flex-direction: column;
  }
`;

export const Left = styled.div`
  flex: 1 1 0;
  display: grid;
  gap: 10px;
  align-content: flex-start;
  @media (max-width: 1024px) {
    order: 2;
  }
`;

export const Right = styled.div`
  flex: 1 1 0;
  display: grid;
  gap: 10px;
  align-content: flex-start;
  @media (max-width: 1024px) {
    order: 1;
  }
`;

export const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
`;

export const AttSticky = styled.div`
  position: sticky;
  top: 0;
  z-index: 20;
  background: ${({ theme }) => theme.colors.surface};
  padding-top: 4px;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

export const BulkActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-wrap: wrap;
  justify-content: flex-end;
  margin-left: ${({ theme }) => theme.spacing.sm};
`;

export const TabBar = styled.div`
  display: inline-flex;
  gap: 6px;
  align-items: center;
`;

export const HeaderText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const TabBtn = styled.button`
  height: 40px;
  padding: 0 20px;
  font-size: 14px;
  font-weight: 600;
  border-radius: 10px;
  transition: all 0.2s ease;
  cursor: pointer;

  /* Active State */
  &[data-active="true"] {
    background: ${(p) => p.theme.colors.primary};
    color: #ffffff;
    border: 1px solid ${(p) => p.theme.colors.primary};
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  }

  /* Inactive State */
  &:not([data-active="true"]) {
    background: #ffffff;
    color: ${(p) => p.theme.colors.text};
    border: 1px solid ${(p) => p.theme.colors.border};
    &:hover {
      background: ${(p) => p.theme.colors.surfaceMuted};
      border-color: ${(p) => p.theme.colors.borderMuted};
    }
  }
`;

export const TopTabs = styled.div`
  position: sticky;
  top: 0;
  z-index: 22;
  background: ${({ theme }) => theme.colors.surface};
  padding: 6px 0;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;
