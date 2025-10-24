import styled from "styled-components";
import { SmallBtn as UISmallBtn } from "@/components/courseRecord/CourseRecordStyles";

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
  padding: 4px 0 0 0;
  margin-top: -4px;
  border-bottom: 0;
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

export const TabBtn = styled(UISmallBtn)`
  height: 40px;
  padding: 0 16px;
  font-size: 14px;
  &[data-active="true"] {
    background: #f3f4f6;
    color: #111827;
    border-color: #e5e7eb;
  }
`;

export const TopTabs = styled.div`
  position: sticky;
  top: 0;
  z-index: 22;
  background: ${({ theme }) => theme.colors.surface};
  padding: 4px 0;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 6px;
`;
