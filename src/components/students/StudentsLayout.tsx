import styled from "styled-components";
import type { ReactNode } from "react";
import { Page as PageWrap, SectionCard as SectionCard } from "../common/UI";

// EN: Base layout wrappers for the Students page
// KO: 원생 관리 페이지 기본 레이아웃 래퍼

export function Page({ children }: { children: ReactNode }) { return <PageWrap>{children}</PageWrap>; }

export function Card({ children }: { children: ReactNode }) { return <SectionCard>{children}</SectionCard>; }

export function Row({ children }: { children: ReactNode }) {
  return <RowBox>{children}</RowBox>;
}

// Page and Card provided by common UI

const RowBox = styled.div`
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: 12px;
`;
