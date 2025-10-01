import styled from "styled-components";
import type { ReactNode } from "react";

export function DetailPage({ children }: { children: ReactNode }) {
  return <Page>{children}</Page>;
}

export function DetailColumns({ children }: { children: ReactNode }) {
  return <Columns>{children}</Columns>;
}

export function DetailLeft({ children }: { children: ReactNode }) {
  return <Left>{children}</Left>;
}

export function DetailRight({ children }: { children: ReactNode }) {
  return <Right>{children}</Right>;
}

const Page = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  height: calc(100vh - 48px); /* account for main content padding */
  overflow: hidden; /* prevent page scroll; use internal scrolls */
`;
const Columns = styled.div`
  display: flex;
  gap: 12px;
  align-items: stretch;
  flex: 1 1 auto;
  min-height: 0; /* allow children to compute internal scroll */
  overflow: hidden;
  @media (max-width: 960px) { flex-direction: column; height: auto; overflow: visible; }
`;
const Left = styled.div`
  flex: 1 1 0;
  display: grid;
  grid-template-rows: 1fr 1fr; /* 5:5 (1:1) vertical split */
  gap: 12px;
  height: 100%;
  min-height: 0; /* enable internal scrolls in children */
`;
const Right = styled.div`
  flex: 1 1 0;
  display: grid;
  gap: 12px;
  align-content: flex-start;
  height: 100%;
  min-height: 0;
  overflow: auto; /* right column can scroll if long */
`;
