import styled from "styled-components";
import {
  SmallBtn as UISmallBtn,
  buttonVariants,
} from "@/components/common/UI";

export const SmallBtn = styled(UISmallBtn)`
  height: 32px;
  padding: 0 12px;
  font-size: 13px;
`;

export const Hint = styled.div`
  color: #6b7280;
  font-size: 12px;
  margin-top: 4px;
`;

export const SmallMuted = styled.span`
  color: #9ca3af;
  font-size: 12px;
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

export const SuccessBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: 999px;
  background: #d1fae5;
  color: #047857;
  font-size: 11px;
  font-weight: 700;
  &:before {
    content: "✔";
  }
`;

export const List = styled.div`
  display: grid;
  gap: 12px;
`;

export const Item = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: #fff;
`;

export const RowRight = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const NoteInput = styled.input`
  height: 26px;
  width: 140px;
  padding: 0 8px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 12px;
  background: #fff;
`;

export const AttSeg = styled.div`
  display: inline-flex;
  gap: 6px;
`;

export const AttBtn = styled.button`
  ${buttonVariants.base};
  height: 32px;
  padding: 0 12px;
  font-size: 13px;
  background: ${(p) => p.theme.colors.surfaceMuted};
  border: 1px solid ${(p) => p.theme.colors.border};
  color: ${(p) => p.theme.colors.text};
  &:hover:not(:disabled) {
    background: ${(p) => p.theme.colors.surfaceAlt};
  }
  &:active:not(:disabled) {
    transform: translateY(1px);
    background: ${(p) => p.theme.colors.surface};
  }
  &[data-active="true"] {
    background: #ecfdf5;
    border-color: #a7f3d0;
    color: #065f46;
  }
  &[data-variant="danger"] {
    background: ${(p) => p.theme.colors.dangerSurface};
    border-color: ${(p) => p.theme.colors.dangerSurface};
    color: ${(p) => p.theme.colors.danger};
  }
  &[data-variant="danger"][data-active="true"] {
    background: ${(p) => p.theme.colors.danger};
    border-color: ${(p) => p.theme.colors.danger};
    color: ${(p) => p.theme.colors.textInverted};
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const Processed = styled.span`
  margin-left: 8px;
  padding: 2px 6px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  border: 1px solid #e5e7eb;
  color: #374151;
  background: #f3f4f6;
  &[data-type="present"] {
    background: #ecfdf5;
    color: #065f46;
    border-color: #a7f3d0;
  }
  &[data-type="absent"] {
    background: #fee2e2;
    color: #7f1d1d;
    border-color: #fecaca;
  }
  &[data-type="none"] {
    background: #f3f4f6;
    color: #6b7280;
    border-color: #e5e7eb;
  }
`;

export const EmptyHint = styled.div`
  padding: 12px;
  color: #6b7280;
  font-size: 13px;
`;

export const BulkDialogBody = styled.div`
  display: grid;
  gap: ${(p) => p.theme.spacing.sm};
  font-size: 14px;
  color: #334155;
`;

export const BulkList = styled.div`
  display: grid;
  gap: ${(p) => p.theme.spacing.xs};
  max-height: 240px;
  overflow-y: auto;
  padding-right: 4px;
`;

export const BulkItem = styled.label`
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: #f9fafb;
  font-size: 13px;
  color: #1f2937;
  &[data-disabled="true"] {
    opacity: 0.6;
  }
  input {
    width: 16px;
    height: 16px;
  }
  .name {
    font-weight: 600;
  }
  .status {
    font-size: 12px;
    color: #6b7280;
    text-align: right;
  }
`;

export const BulkFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  font-size: 12px;
  color: #475569;
`;

export const DateBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 6px 14px;
  border-radius: 999px;
  background: linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%);
  color: #312e81;
  font-weight: 800;
  font-size: 13px;
  white-space: nowrap;
  &[data-empty="true"] {
    background: #f3f4f6;
    color: #6b7280;
  }
`;

export const TimePill = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 999px;
  background: #f9fafb;
  color: #1f2937;
  font-weight: 700;
  font-size: 12px;
  border: 1px solid #e5e7eb;
  white-space: nowrap;
  &[data-empty="true"] {
    color: #6b7280;
    border-color: #e5e7eb;
  }
`;
