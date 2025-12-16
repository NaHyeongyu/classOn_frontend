import styled, { keyframes } from "styled-components";
import {
  Page as PageWrap,
  SectionCard as Section,
  TitleH3 as Title,
  buttonVariants,
} from "@/components/common/UI";

export const Page = styled(PageWrap)`
  gap: ${(p) => p.theme.spacing.lg};
`;

export const Form = styled.form`
  display: grid;
  gap: ${(p) => p.theme.spacing.xl};
`;

export const AlertError = styled.div`
  background: #fee2e2;
  color: #b91c1c;
  border: 1px solid #fecaca;
  padding: ${(p) => p.theme.spacing.sm} ${(p) => p.theme.spacing.md};
  border-radius: ${(p) => p.theme.radii.md};
  font-size: ${(p) => p.theme.font.size.sm};
`;

export const AlertOk = styled.div`
  background: #dcfce7;
  color: #166534;
  border: 1px solid #bbf7d0;
  padding: ${(p) => p.theme.spacing.sm} ${(p) => p.theme.spacing.md};
  border-radius: ${(p) => p.theme.radii.md};
  font-size: ${(p) => p.theme.font.size.sm};
`;

export const Stepper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${(p) => p.theme.spacing.sm};
`;

export const StepChip = styled.button`
  display: inline-flex;
  align-items: center;
  gap: ${(p) => p.theme.spacing.sm};
  padding: ${(p) => p.theme.spacing.xs} ${(p) => p.theme.spacing.md};
  border-radius: 999px;
  border: 1px solid #dbeafe;
  background: #f8fafb;
  color: #334155;
  font-size: ${(p) => p.theme.font.size.sm};
  font-weight: 600;
  cursor: pointer;
  transition: background 0.18s ease, border-color 0.18s ease, color 0.18s ease;
  &:disabled {
    cursor: default;
    pointer-events: none;
  }
  &:not(:disabled):hover {
    border-color: #c7d2fe;
    background: #eef2ff;
  }
  .index {
    width: 22px;
    height: 22px;
    border-radius: 999px;
    background: #e0e7ff;
    color: #4338ca;
    display: grid;
    place-items: center;
    font-weight: 700;
  }
  &[data-active="true"] {
    border-color: #c7d2fe;
    background: #eef2ff;
    color: #1f2937;
    box-shadow: 0 6px 18px rgba(79, 70, 229, 0.15);
    .index {
      background: #6366f1;
      color: #fff;
    }
  }
  &[data-done="true"] {
    border-color: #c7d2fe;
    background: #f5f3ff;
    color: #1f2937;
    .index {
      background: #4f46e5;
      color: #fff;
    }
  }
`;

export const StepFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 12px;
  margin-top: 40px;
`;

export const NavButton = styled.button`
  ${buttonVariants.outline};
  height: 40px;
  padding: 0 ${(p) => p.theme.spacing.xl};
  font-size: ${(p) => p.theme.font.size.md};
  font-weight: 600;
`;

export const PrimaryAction = styled.button`
  ${buttonVariants.primary};
  height: 40px;
  padding: 0 ${(p) => p.theme.spacing.xl};
  font-size: ${(p) => p.theme.font.size.md};
  font-weight: 700;
`;

const shimmer = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: 200px 0; }
`;

const SkeletonLine = styled.div<{ $height?: number }>`
  background: linear-gradient(90deg, #eef2f7 25%, #f6f8fb 37%, #eef2f7 63%);
  background-size: 400px 100%;
  animation: ${shimmer} 1.2s ease-in-out infinite;
  border-radius: 8px;
  width: 100%;
  height: ${({ $height }) => $height || 12}px;
`;

const SkeletonGrid = styled.div`
  display: grid;
  gap: ${(p) => p.theme.spacing.md};
`;

export function CourseFormSkeleton() {
  return (
    <Section>
      <Title>기본 정보</Title>
      <SkeletonGrid>
        <SkeletonLine $height={38} />
        <SkeletonLine $height={38} />
        <SkeletonLine $height={38} />
        <SkeletonLine $height={38} />
        <SkeletonLine $height={120} />
      </SkeletonGrid>
    </Section>
  );
}
