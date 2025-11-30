import styled from "styled-components";
import {
  SectionCard as SectionCardBase,
  TitleH3 as SectionTitleBase,
  ToggleSwitch,
} from "@/components/common/UI";
import type { Student } from "@/api/students";

export const Page = styled.div`
  display: grid;
  gap: 14px;
  padding-bottom: 32px;
`;

export const Header = styled.div`
  position: sticky;
  top: 0;
  z-index: 10;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 10px 2px 6px;
  h2 {
    margin: 0;
    font-size: 20px;
    color: #0f172a;
  }
  p {
    margin: 0;
    color: #6b7280;
  }
  &:after {
    content: "";
    display: block;
    position: absolute;
    left: 0;
    right: 0;
    bottom: -6px;
    height: 6px;
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.85),
      rgba(255, 255, 255, 0)
    );
    pointer-events: none;
  }
`;

export const HeadLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const HeadActions = styled.div`
  display: inline-flex;
  gap: 8px;
`;

export const Form = styled.form`
  display: grid;
  gap: 16px;
`;

export const Section = styled(SectionCardBase)`
  display: grid;
  gap: 18px;
`;
export const SectionTitle = SectionTitleBase;

export const SectionHeader = styled.div`
  display: grid;
  gap: 6px;
`;

export const SectionLead = styled.p`
  margin: 0;
  color: #6b7280;
  font-size: 13px;
`;

export const Grid = styled.div`
  display: grid;
  gap: 16px;
  grid-template-columns: minmax(0, 1fr);
  @media (min-width: 720px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

export const Field = styled.label`
  display: grid;
  gap: 6px;
  align-items: start;
`;

export const Label = styled.div`
  color: #475569;
  font-size: 13px;
  font-weight: 800;
  display: inline-flex;
  gap: 8px;
  align-items: baseline;
  text-align: left;
  span {
    color: #ef4444;
  }
`;

export const LabelHint = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: #475569;
`;

export const Input = styled.input`
  height: 42px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 0 12px;
  font-size: 14px;
  color: #111827;
  width: 100%;
  &::placeholder {
    color: #9ca3af;
  }
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.15);
  }
  &:disabled {
    background: #f9fafb;
    color: #6b7280;
  }
  &[aria-invalid="true"] {
    border-color: #ef4444;
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.12);
  }
`;

export const Select = styled.select`
  height: 42px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 0 12px;
  font-size: 14px;
  background: #fff;
  color: #111827;
  width: 100%;
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.15);
  }
  &:disabled {
    background: #f9fafb;
    color: #6b7280;
  }
`;

export const TripleGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  min-width: 0;
  @media (max-width: 480px) {
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
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

export const AlertOk = styled.div`
  background: #dcfce7;
  color: #166534;
  border: 1px solid #bbf7d0;
  padding: 10px 12px;
  border-radius: 10px;
  font-size: 13px;
`;

export const Help = styled.div`
  color: #6b7280;
  font-size: 12px;
`;

export const FieldErr = styled.div`
  color: #b91c1c;
  font-size: 12px;
`;

export const FormLayout = styled.div`
  display: grid;
  gap: 18px;
  align-items: start;
  grid-template-columns: minmax(0, 1fr);
  @media (min-width: 1080px) {
    grid-template-columns: minmax(0, 1.6fr) minmax(0, 0.9fr);
  }
`;

export const MainColumn = styled.div`
  display: grid;
  gap: 16px;
`;

export const SideColumn = styled.aside`
  display: grid;
  gap: 16px;
`;

export const StatusToggle = styled(ToggleSwitch)`
  margin-top: ${(p) => p.theme.spacing.xs};
`;

export const StickyCard = styled.div`
  display: grid;
  gap: 14px;
  position: sticky;
  top: 84px;
`;

export const SummaryTitle = styled.h4`
  margin: 0;
  font-size: 15px;
  color: #111827;
  font-weight: 800;
`;

export const PreviewSection = styled(SectionCardBase)`
  display: grid;
  gap: 12px;
`;

export const PreviewSectionTitle = styled.h5`
  margin: 0;
  font-size: 15px;
  color: #0f172a;
  font-weight: 700;
  letter-spacing: -0.01em;
`;

export const PreviewHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
`;

export const PreviewName = styled.div`
  font-size: 18px;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.015em;
`;

export const PreviewFields = styled.div`
  display: grid;
  gap: 10px;
`;

export const PreviewField = styled.div`
  display: grid;
  grid-template-columns: 110px 1fr;
  gap: 10px;
  align-items: center;
  font-size: 13px;
`;

export const PreviewLabel = styled.div`
  color: #94a3b8;
  font-weight: 700;
`;

export const PreviewValue = styled.div`
  color: #111827;
  font-weight: 600;
  line-height: 1.4;
  word-break: break-word;
`;

export const StatusBadge = styled.span<{ $variant: Student["status"] }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  background: ${({ $variant: variant }) =>
    variant === "ON_LEAVE"
      ? "rgba(251, 191, 36, 0.18)"
      : variant === "PENDING"
      ? "rgba(96, 165, 250, 0.16)"
      : "rgba(34, 197, 94, 0.18)"};
  color: ${({ $variant: variant }) =>
    variant === "ON_LEAVE"
      ? "#92400e"
      : variant === "PENDING"
      ? "#1d4ed8"
      : "#166534"};
`;

export const TipNote = styled.div`
  font-size: 12px;
  color: #6b7280;
`;

export const InfoCard = styled(SectionCardBase)`
  display: grid;
  gap: 10px;
  h4 {
    margin: 0;
    font-size: 14px;
    color: #111827;
  }
  ul {
    margin: 0;
    padding-left: 18px;
    display: grid;
    gap: 6px;
    font-size: 13px;
    color: #4b5563;
  }
`;

export const StatusSwitch = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

export const StatusButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0;
  padding: 8px 12px;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  background: #fff;
  color: #1f2937;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: border-color 0.18s ease, background 0.18s ease,
    transform 0.12s ease;
  &[data-active="true"] {
    border-color: #6366f1;
    background: rgba(99, 102, 241, 0.08);
    color: #312e81;
    transform: translateY(-1px);
  }
  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;
