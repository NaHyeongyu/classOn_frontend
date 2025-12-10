import styled from "styled-components";
import { SmallBtn as UISmallBtn } from "@/components/common/UI";

export const Card = styled.section`
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.radii.lg};
  padding: ${(p) => p.theme.spacing.lg};
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: ${(p) => p.theme.spacing.md};
  box-shadow: ${(p) => p.theme.shadow.low};
  height: 100%;
`;

export const SectionTitle = styled.h3`
  margin: 0;
  font-size: ${(p) => p.theme.font.size.lg};
  color: ${(p) => p.theme.colors.text};
`;

export const CardHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${(p) => p.theme.spacing.sm};
`;

export const CardActions = styled.div`
  display: inline-flex;
  gap: ${(p) => p.theme.spacing.xs};
`;

export const Divider = styled.div`
  height: 1px;
  background: ${(p) => p.theme.colors.borderMuted};
`;

export const InfoList = styled.div`
  display: grid;
  gap: ${(p) => p.theme.spacing.sm};
`;

export const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${(p) => p.theme.spacing.sm};
  flex-wrap: wrap;
`;

export const Name = styled.div`
  font-size: 20px;
  font-weight: ${(p) => p.theme.font.weight.extraBold ?? 800};
  color: ${(p) => p.theme.colors.text};
  letter-spacing: -0.01em;
`;

export const SmallMuted = styled.div`
  color: ${(p) => p.theme.colors.textMuted};
  font-size: ${(p) => p.theme.font.size.sm};
`;

export const KPI = styled.div`
  font-size: 28px;
  font-weight: ${(p) => p.theme.font.weight.extraBold ?? 800};
  color: ${(p) => p.theme.colors.text};
  line-height: 1.2;
`;

export const StatusChip = styled.span`
  padding: 4px 10px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 800;
  white-space: nowrap;
  &[data-type="ENROLLED"] {
    background: #dcfce7;
    color: #16a34a;
  }
  &[data-type="ON_LEAVE"] {
    background: #fef3c7;
    color: #b45309;
  }
  &[data-type="PENDING"] {
    background: #f3e8ff;
    color: #7c3aed;
  }
`;

export const Field = styled.div`
  display: grid;
  grid-template-columns: 110px 1fr;
  gap: ${(p) => p.theme.spacing.xs};
  align-items: center;
`;

export const Label = styled.div`
  color: ${(p) => p.theme.colors.textMuted};
  font-size: ${(p) => p.theme.font.size.sm};
`;

export const Value = styled.div`
  color: ${(p) => p.theme.colors.text};
  font-size: ${(p) => p.theme.font.size.md};
`;

export const Muted = styled.div`
  color: ${(p) => p.theme.colors.textMuted};
  font-size: ${(p) => p.theme.font.size.sm};
`;

export const Tabs = styled.div`
  display: inline-flex;
  gap: ${(p) => p.theme.spacing.xs};
  flex-wrap: wrap;
`;

export const TabButton = styled.button`
  height: 40px;
  padding: 0 20px;
  font-size: 14px;
  font-weight: 600;
  border-radius: 10px;
  transition: all 0.2s ease;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  /* Active State */
  &[data-active="true"] {
    background: ${(p) => p.theme.colors.primary};
    color: #ffffff;
    border: 1px solid ${(p) => p.theme.colors.primary};
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  }

  /* Inactive State */
  &[data-active="true"] .badge-count {
    background: rgba(255, 255, 255, 0.2);
    color: #fff;
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

export const Badge = styled.span.attrs({ className: "badge-count" })`
  min-width: 20px;
  height: 20px;
  padding: 0 5px;
  border-radius: 99px;
  background: #f3f4f6;
  color: #4b5563;
  font-weight: 700;
  font-size: 11px;
  line-height: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-feature-settings: "tnum";
  font-variant-numeric: tabular-nums;
`;

export const Empty = styled.div`
  color: #6b7280;
  font-size: 13px;
  text-align: center;
  border: 1px dashed #e5e7eb;
  border-radius: 10px;
  padding: 16px;
  background: #fafafa;
`;

export const ModalBtn = styled(UISmallBtn)`
  height: 40px;
  padding: 0 16px;
  font-size: 14px;
`;

// Notes UI removed

export const MemoNew = styled.div`
  display: grid;
  gap: 8px;
`;

export const MemoList = styled.div`
  display: grid;
  gap: 8px;
`;

export const MemoItemBox = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 10px 12px;
  background: #fff;
  display: grid;
  gap: 6px;
`;

export const MemoHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

export const MemoDate = styled.div`
  color: #6b7280;
  font-size: 12px;
`;

export const MemoActions = styled.div`
  display: inline-flex;
  gap: 6px;
`;

export const MemoTextarea = styled.textarea`
  width: 100%;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 8px 10px;
  resize: vertical;
  font-size: 14px;
  color: #111827;
`;

export const MemoText = styled.pre`
  margin: 0;
  white-space: pre-wrap;
  color: #111827;
  font-size: 14px;
`;

export const CourseList = styled.div`
  display: grid;
  gap: 8px;
`;

export const CourseItem = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 10px 12px;
  display: grid;
  gap: 6px;
  background: #fff;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    border-color: #d1d5db;
  }
`;

export const CourseHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

export const CourseTitle = styled.div`
  font-weight: 800;
  color: #0f172a;
  font-size: 14px;
`;

export const CourseFee = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #6b7280;
  span {
    font-weight: 600;
  }
  strong {
    font-size: 14px;
    font-weight: 800;
    color: #4b5563;
  }
`;

export const CourseMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: #6b7280;
  font-size: 12px;
  code {
    background: #f3f4f6;
    padding: 2px 6px;
    border-radius: 6px;
  }
`;

export const CourseStatus = styled.span`
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

export const Input = styled.input`
  height: 32px;
  padding: 0 10px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 13px;
`;

export const TextArea = styled.textarea`
  width: 100%;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 8px 10px;
  resize: vertical;
  font-size: 14px;
  color: #111827;
`;

export const List = styled.div`
  display: grid;
  gap: 8px;
`;

export const ListItem = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 12px 14px;
  background: #fff;
  display: grid;
  gap: 10px;
`;

export const CounselHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

export const CounselRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

export const RowActions = styled.div`
  display: inline-flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: flex-end;
`;

export const When = styled.span`
  font-size: 13px;
  font-weight: 700;
  color: #1f2937;
`;

export const CounselContent = styled.pre`
  margin: 0;
  white-space: pre-wrap;
  color: #111827;
  font-size: 14px;
  background: #f9fafb;
  padding: 12px 14px;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
`;

export const EditGrid = styled.div`
  display: grid;
  gap: 10px;
`;

export const TimeRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const TimeSelect = styled.div`
  flex: 1;
`;

export const Subgrid = styled.div`
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  margin-bottom: 16px;
`;

export const SmallCard = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 14px 16px;
  background: #ffffff;
  display: grid;
  gap: 6px;
`;

export const SmallTitle = styled.span`
  color: #6b7280;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.02em;
  text-transform: uppercase;
`;
