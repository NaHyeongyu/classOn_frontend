import styled, { keyframes } from "styled-components";
import {
  Section,
  SectionTitle,
  Grid,
} from "./StudentForm.styles";

const shimmer = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: 200px 0; }
`;

const SkeletonBlock = styled.div<{ $width?: number; $height?: number }>`
  background: linear-gradient(90deg, #eef2f7 25%, #f6f8fb 37%, #eef2f7 63%);
  background-size: 400px 100%;
  animation: ${shimmer} 1.2s ease-in-out infinite;
  border-radius: 8px;
  width: ${({ $width }) => ($width ? `${$width}px` : "100%")};
  height: ${({ $height }) => ($height ? `${$height}px` : "12px")};
`;

export function StudentFormSkeleton() {
  return (
    <div style={{ display: "grid", gap: 12 }}>
      <Section>
        <SectionTitle>기본 정보</SectionTitle>
        <Grid>
          <SkeletonBlock $height={38} />
          <SkeletonBlock $height={38} />
          <SkeletonBlock $height={38} />
          <SkeletonBlock $height={38} />
          <SkeletonBlock $height={38} />
          <SkeletonBlock $height={38} />
        </Grid>
      </Section>
      <Section>
        <SectionTitle>부모님/주소</SectionTitle>
        <Grid>
          <SkeletonBlock $height={38} />
          <SkeletonBlock $height={38} />
          <SkeletonBlock $height={38} />
        </Grid>
      </Section>
    </div>
  );
}
