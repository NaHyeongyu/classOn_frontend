import styled from "styled-components";
import {
  Page as PageWrap,
  PrimaryButton,
  SectionCard as Card,
  TableBase,
  buttonVariants,
} from "@/components/common/UI";

export const PageLocal = styled(PageWrap)`
  gap: 16px;
`;

export const Controls = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4px;
  flex-wrap: wrap;
  margin: 0 0 6px;
`;

export const ViewTabs = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const TabButton = styled.button`
  height: 40px;
  padding: 0 20px;
  font-size: 14px;
  font-weight: 600;
  border-radius: 10px;
  transition: all 0.2s ease;
  cursor: pointer;

  /* Active State */
  &[data-active] {
    background: ${(p) => p.theme.colors.primary};
    color: #ffffff;
    border: 1px solid ${(p) => p.theme.colors.primary};
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  }

  /* Inactive State */
  &:not([data-active]) {
    background: #ffffff;
    color: ${(p) => p.theme.colors.text};
    border: 1px solid ${(p) => p.theme.colors.border};
    &:hover {
      background: ${(p) => p.theme.colors.surfaceMuted};
      border-color: ${(p) => p.theme.colors.borderMuted};
    }
  }
`;

export const StatusFilterBar = styled.div`
  display: inline-flex;
  align-items: center;
  background: #ffffff;
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 9999px;
  padding: 4px;
  gap: 2px;
`;

export const FilterButton = styled.button<{ $active?: boolean }>`
  border: none;
  background: ${({ $active, theme }) =>
    $active ? theme.colors.primarySurface : "transparent"};
  color: ${({ $active, theme }) =>
    $active ? theme.colors.primary : theme.colors.textMuted};
  padding: 6px 16px;
  border-radius: 9999px;
  font-size: 13px;
  font-weight: ${({ $active }) => ($active ? 700 : 500)};
  cursor: pointer;
  line-height: 1;
  white-space: nowrap;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ $active, theme }) =>
      $active ? theme.colors.primarySurface : theme.colors.surfaceMuted};
    color: ${({ $active, theme }) =>
      $active ? theme.colors.primary : theme.colors.text};
  }
`;

export const FiltersForm = styled.form`
  width: 100%;
`;

export const Filters = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${(p) => p.theme.spacing.sm};
  align-items: flex-end;
`;

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(p) => p.theme.spacing.xs};
  label {
    font-size: 13px;
    font-weight: 600;
    color: ${(p) => p.theme.colors.text};
  }
  input[type="date"] {
    height: 40px;
    padding: 0 14px;
    border-radius: ${(p) => p.theme.radii.md};
    border: 1px solid ${(p) => p.theme.colors.border};
    background: ${(p) => p.theme.colors.surface};
    color: ${(p) => p.theme.colors.text};
    font-size: 14px;
    transition: all 0.2s;
    &:focus {
      outline: none;
      border-color: ${(p) => p.theme.colors.primary};
      box-shadow: ${(p) => p.theme.shadow.focusPrimary};
    }
  }
`;

export const SearchField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  min-width: 200px;
  label {
    font-size: 13px;
    color: #4b5563;
  }
`;

export const SearchInput = styled.input`
  height: 40px;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  padding: 0 12px;
  font-size: 14px;
  color: #111827;
  width: 100%;
  &::placeholder {
    color: #9ca3af;
  }
`;

export const QuickButtons = styled.div`
  display: inline-flex;
  flex-wrap: wrap;
  gap: 2px;
`;

export const QuickButton = styled.button`
  ${buttonVariants.outline};
  height: 40px;
  padding: 0 16px;
  font-size: 13px;
  font-weight: 600;
`;

export const ApplyButton = styled(PrimaryButton)`
  height: 40px;
  padding: 0 20px;
`;

export const ButtonRow = styled.div`
  display: inline-flex;
  gap: ${(p) => p.theme.spacing.xs};
  align-items: center;
`;

export const ResetButton = styled.button`
  ${buttonVariants.outline};
  height: 40px;
  padding: 0 18px;
  font-size: 13px;
  font-weight: 600;
`;

export const ErrorText = styled.div`
  margin-top: 12px;
  color: #b91c1c;
  font-size: 13px;
`;

export const LoadingBox = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 2px;
  padding: 12px 16px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  background: #fff;
  color: #4b5563;
  font-size: 14px;
`;

export const DayHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${(p) => p.theme.spacing.md};
  margin-bottom: ${(p) => p.theme.spacing.md};
  padding: 0 4px;
  strong {
    display: block;
    font-size: 19px;
    font-weight: 800;
    color: ${(p) => p.theme.colors.text};
    letter-spacing: -0.01em;
  }
  span {
    display: block;
    font-size: 13px;
    color: ${(p) => p.theme.colors.textMuted};
    margin-top: 4px;
  }
  @media (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const Chips = styled.div`
  display: inline-flex;
  gap: 4px;
`;

export const CountChip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 9999px;
  font-size: 13px;
  font-weight: 700;
  border: 1px solid #e5e7eb;
  &[data-type="present"] {
    background: #dcfce7;
    color: #15803d;
    border-color: #bbf7d0;
  }
  &[data-type="absent"] {
    background: #fee2e2;
    color: #b91c1c;
    border-color: #fecaca;
  }
  &[data-type="unprocessed"] {
    background: #f3f4f6;
    color: #4b5563;
    border-color: #e5e7eb;
  }
`;

export const TableWrapper = styled.div`
  overflow-x: auto;
`;

export const StyledTable = styled(TableBase)`
  min-width: 820px;
  thead th {
    padding: 12px 20px;
    font-size: 12px;
    color: #6b7280;
    background: #fafafa;
  }
  tbody td {
    padding: 14px 20px;
    border-bottom: 1px solid #edf2f7;
    font-size: 14px;
  }
  tbody tr:last-child td {
    border-bottom: none;
  }
  tbody td.num {
    text-align: right;
    font-feature-settings: "tnum";
  }
  tbody td.actions {
    text-align: right;
    width: 120px;
  }
  tbody tr:hover td {
    background: #f9fafb;
  }
`;

export const TitleCell = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  button {
    all: unset;
    cursor: pointer;
    color: #1f2937;
    font-weight: 700;
    line-height: 1.2;
  }
  button:hover {
    text-decoration: underline;
  }
  small {
    color: #6b7280;
    font-size: 12px;
  }
`;

export const ViewButton = styled.button`
  ${buttonVariants.subtle};
  height: 32px;
  padding: 0 14px;
  font-size: 13px;
`;

export const NoClassText = styled.div`
  padding: 12px;
  border-radius: 10px;
  background: #f9fafb;
  color: #6b7280;
  font-size: 13px;
`;

export const AttendeeSection = styled.div`
  margin-top: 16px;
  display: grid;
  gap: 2px;
`;

export const AttendeeTitle = styled.h4`
  margin: 0;
  font-size: 15px;
  color: #111827;
  font-weight: 700;
`;

export const CardList = styled.div`
  display: grid;
  gap: 4px;
`;

export const AttendanceCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 14px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: #ffffff;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.06);
`;

export const CardTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  flex-wrap: wrap;
`;

export const CardMain = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  strong {
    font-size: 15px;
    color: #111827;
    letter-spacing: -0.01em;
  }
  .course {
    font-size: 13px;
    color: #6b7280;
  }
`;

export const CardMeta = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
`;

export const MetaItem = styled.span`
  font-size: 12px;
  color: #6b7280;
`;

export const CardFooter = styled.div`
  font-size: 12px;
  color: #4b5563;
  border-top: 1px solid #f3f4f6;
  padding-top: 6px;
`;

export const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 56px;
  padding: 4px 10px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 700;
  border: 1px solid transparent;
  &[data-type="present"] {
    background: #dcfce7;
    color: #15803d;
    border-color: #bbf7d0;
  }
  &[data-type="absent"] {
    background: #fee2e2;
    color: #b91c1c;
    border-color: #fecaca;
  }
  &[data-type="unprocessed"] {
    background: #fef3c7;
    color: #b45309;
    border-color: #fcd34d;
  }
`;

export const SourceBadge = styled.span`
  padding: 2px 8px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 700;
  border: 1px solid #e5e7eb;
  color: #374151;
  background: #f9fafb;
  &[data-type="MOBILE"] {
    background: #dcfce7;
    color: #16a34a;
    border-color: #bbf7d0;
  }
`;

export const CourseLink = styled.button`
  all: unset;
  cursor: pointer;
  color: #2563eb;
  font-weight: 600;
  &:hover {
    text-decoration: underline;
  }
`;

export const ReasonText = styled.div`
  font-size: 12px;
  color: #374151;
  line-height: 1.5;
`;

export const MutedNote = styled.div`
  font-size: 12px;
  color: #9ca3af;
`;

export const StudentList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 6px;
`;

export const StudentChip = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 9999px;
  background: #f3f4f6;
  color: #374151;
  font-size: 12px;
  border: 1px solid #e5e7eb;
`;

export const DayWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 24px;
`;

export { Card };
