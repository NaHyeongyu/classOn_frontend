import styled from "styled-components";
import { SectionCard, PrimaryButtonSm } from "@/components/common/UI";

export const Stepper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  flex-wrap: wrap;
`;

export const Step = styled.div`
  padding: 4px 10px;
  border-radius: 999px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
  &[data-active='true'] {
    background: ${({ theme }) => theme.colors.primarySurface};
    color: ${({ theme }) => theme.colors.primary};
    border-color: ${({ theme }) => theme.colors.border};
    font-weight: 800;
  }
  &[data-done='true'] {
    background: ${({ theme }) => theme.colors.surfaceMuted};
    color: ${({ theme }) => theme.colors.text};
  }
`;

export const StepSep = styled.span`
  width: 10px;
  height: 1px;
  background: ${({ theme }) => theme.colors.border};
  display: inline-block;
`;

export const Header = styled.header`
  display: grid;
  gap: 16px;
  margin-bottom: 12px;
`;

export const Hero = styled.section`
  display: grid;
  gap: 12px;
  padding: 18px;
  border-radius: 18px;
  background: linear-gradient(135deg, rgba(248, 250, 252, 0.94), rgba(224, 231, 255, 0.8));
  border: 1px solid rgba(203, 213, 225, 0.4);
`;

export const HeroText = styled.div`
  display: grid;
  gap: 4px;
  h1 {
    margin: 0;
    font-size: 24px;
    font-weight: 800;
    color: #111827;
  }
  p {
    margin: 0;
    font-size: 14px;
    color: #475569;
  }
`;

export const HeroMeta = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

export const MetaPill = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  font-size: 12px;
  border-radius: 999px;
  background: rgba(99, 102, 241, 0.08);
  color: #4338ca;
  font-weight: 600;
`;

export const Layout = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
  gap: 16px;
  align-items: start;
  @media (max-width: 1080px) {
    grid-template-columns: 1fr;
  }
`;

export const MainColumn = styled.div`
  display: grid;
  gap: 16px;
`;

export const Aside = styled.div`
  display: grid;
  gap: 16px;
`;

export const GuideCard = styled(SectionCard)`
  display: grid;
  gap: 12px;
  padding: 18px;
  border-radius: 18px;
  border: none;
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.05);
  h2 {
    margin: 0;
    font-size: 18px;
    color: #111827;
  }
  .hint {
    margin: 0;
    font-size: 13px;
    color: #64748b;
  }
`;

export const SummaryBox = styled.div`
  border-radius: 18px;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  padding: 20px;
  min-height: 220px;
  display: grid;
  gap: 10px;
  box-shadow: 0 18px 42px rgba(15, 23, 42, 0.08);
  border: 1px solid rgba(226, 232, 240, 0.7);
  max-height: 380px;
  overflow-y: auto;
`;

export const SummaryBody = styled.div`
  display: grid;
  gap: 14px;
  font-size: 14px;
  line-height: 1.8;
  color: #1f2937;
  white-space: pre-wrap;
  p {
    margin: 0;
  }
`;

export const DirectionList = styled.div`
  display: grid;
  gap: 12px;
`;

export const DirectionCard = styled.button`
  display: grid;
  gap: 10px;
  padding: 16px;
  border-radius: 18px;
  border: 1px solid rgba(203, 213, 225, 0.7);
  background: #ffffff;
  text-align: left;
  cursor: pointer;
  transition: border-color 0.18s ease, box-shadow 0.18s ease, transform 0.12s ease;
  &[data-active='true'] {
    border-color: #4f46e5;
    box-shadow: 0 16px 32px rgba(79, 70, 229, 0.16);
    transform: translateY(-1px);
  }
`;

export const DirectionCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 8px;
`;

export const DirectionBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  background: rgba(59, 130, 246, 0.12);
  color: #1d4ed8;
`;

export const DirectionPlatform = styled.span`
  font-size: 12px;
  color: #475569;
`;

export const DirectionTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  color: #111827;
`;

export const DirectionBecause = styled.p`
  margin: 0;
  font-size: 13px;
  color: #475569;
`;

export const DirectionHook = styled.p`
  margin: 0;
  font-size: 14px;
  font-weight: 700;
  color: #1f2937;
`;

export const DirectionTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

export const DirectionTag = styled.span<DirectionTagProps>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  background: ${({ tone }) => (tone === "neutral" ? "#f1f5f9" : "#eef2ff")};
  color: ${({ tone }) => (tone === "neutral" ? "#475569" : "#4338ca")};
`;

export const DirectionSelectLabel = styled.span`
  font-size: 12px;
  color: #64748b;
`;

export const DirectionEditor = styled.div`
  display: grid;
  gap: 8px;
`;

export const DirectionEditorLabel = styled.span`
  font-size: 13px;
  font-weight: 700;
  color: #1f2937;
`;

export const DirectionTextarea = styled.textarea`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 14px;
  padding: 12px 14px;
  resize: vertical;
  font-size: 14px;
  min-height: 80px;
`;

export const DirectionHint = styled.span`
  font-size: 12px;
  color: #64748b;
`;

export const BulletList = styled.div`
  display: grid;
  gap: 8px;
`;

export const BulletItem = styled.div<BulletItemProps>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surfaceMuted};
  .index {
    font-weight: 700;
    color: ${({ theme }) => theme.colors.text};
  }
`;

export const AddInput = styled.input`
  flex: 1;
  min-width: 0;
  height: 40px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: 0 12px;
  background: #ffffff;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.text};
`;

export const EmptyHint = styled.div`
  display: grid;
  place-items: center;
  padding: 14px;
  border-radius: 12px;
  border: 1px dashed ${({ theme }) => theme.colors.border};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const ChoiceGrid = styled.div`
  display: grid;
  gap: 10px;
`;

export const ChoiceCard = styled.button<ChoiceCardProps>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
  text-align: left;
  border-radius: 16px;
  border: 1px solid rgba(203, 213, 225, 0.7);
  background: #ffffff;
  cursor: pointer;
  transition: border-color 0.18s ease, box-shadow 0.18s ease, transform 0.12s ease;
  .icon {
    font-size: 20px;
  }
  strong {
    font-size: 14px;
    color: #111827;
  }
  small {
    font-size: 12px;
    color: #64748b;
  }
  &[data-active='true'] {
    border-color: #4f46e5;
    box-shadow: 0 12px 24px rgba(79, 70, 229, 0.18);
    transform: translateY(-2px);
  }
`;

export const SmallLabel = styled.div`
  margin-top: 6px;
  font-size: 12px;
  font-weight: 700;
  color: #475569;
`;

export const ToneGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

export const ToneOption = styled.button<ToneOptionProps>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 9px 12px;
  border-radius: 999px;
  border: 1px solid rgba(203, 213, 225, 0.8);
  background: #ffffff;
  cursor: pointer;
  font-size: 13px;
  transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease;
  &[data-active='true'] {
    background: rgba(99, 102, 241, 0.16);
    color: #4338ca;
    border-color: rgba(99, 102, 241, 0.4);
    font-weight: 700;
  }
`;

export const Footer = styled.footer`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 18px;
`;

export const ActionButton = styled(PrimaryButtonSm)`
  min-width: 148px;
`;
export const DirectionBecause = styled.p`
  margin: 0;
  font-size: 13px;
  color: #475569;
`;

export const DirectionHook = styled.p`
  margin: 0;
  font-size: 14px;
  font-weight: 700;
  color: #1f2937;
`;

export const DirectionTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

export const DirectionTag = styled.span<{ tone?: "neutral" }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  background: ${({ tone }) => (tone === "neutral" ? "#f1f5f9" : "#eef2ff")};
  color: ${({ tone }) => (tone === "neutral" ? "#475569" : "#4338ca")};
`;

export const DirectionSelectLabel = styled.span`
  font-size: 12px;
  color: #64748b;
`;

export const DirectionEditor = styled.div`
  display: grid;
  gap: 8px;
`;

export const DirectionEditorLabel = styled.span`
  font-size: 13px;
  font-weight: 700;
  color: #1f2937;
`;

export const DirectionTextarea = styled.textarea`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 14px;
  padding: 12px 14px;
  resize: vertical;
  font-size: 14px;
  min-height: 80px;
`;

export const DirectionHint = styled.span`
  font-size: 12px;
  color: #64748b;
`;

export const BulletList = styled.div`
  display: grid;
  gap: 8px;
`;

export const BulletItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surfaceMuted};
  .index {
    font-weight: 700;
    color: ${({ theme }) => theme.colors.text};
  }
`;

export const AddInput = styled.input`
  flex: 1;
  min-width: 0;
  height: 40px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: 0 12px;
  background: #ffffff;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.text};
`;

export const EmptyHint = styled.div`
  display: grid;
  place-items: center;
  padding: 14px;
  border-radius: 12px;
  border: 1px dashed ${({ theme }) => theme.colors.border};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const ChoiceGrid = styled.div`
  display: grid;
  gap: 10px;
`;

export const ChoiceCard = styled.button<{ "data-active"?: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
  text-align: left;
  border-radius: 16px;
  border: 1px solid rgba(203, 213, 225, 0.7);
  background: #ffffff;
  cursor: pointer;
  transition: border-color 0.18s ease, box-shadow 0.18s ease, transform 0.12s ease;
  .icon {
    font-size: 20px;
  }
  strong {
    font-size: 14px;
    color: #111827;
  }
  small {
    font-size: 12px;
    color: #64748b;
  }
  &[data-active='true'] {
    border-color: #4f46e5;
    box-shadow: 0 12px 24px rgba(79, 70, 229, 0.18);
    transform: translateY(-2px);
  }
`;

export const SmallLabel = styled.div`
  margin-top: 6px;
  font-size: 12px;
  font-weight: 700;
  color: #475569;
`;

export const ToneGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

export const ToneOption = styled.button<{ "data-active"?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 9px 12px;
  border-radius: 999px;
  border: 1px solid rgba(203, 213, 225, 0.8);
  background: #ffffff;
  cursor: pointer;
  font-size: 13px;
  transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease;
  &[data-active='true'] {
    background: rgba(99, 102, 241, 0.16);
    color: #4338ca;
    border-color: rgba(99, 102, 241, 0.4);
    font-weight: 700;
  }
`;

export const Footer = styled.footer`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 18px;
`;

export const ActionButton = styled(PrimaryButtonSm)`
  min-width: 148px;
`;
