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

export function DetailCenter({ children }: { children: ReactNode }) {
  return <Center>{children}</Center>;
}

export function DetailRight({ children }: { children: ReactNode }) {
  return <Right>{children}</Right>;
}

const Page = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  min-height: calc(100vh - 48px);
  overflow: auto;
  padding-bottom: 16px;
`;
const Columns = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 12px;
  flex: 1 1 auto;
  min-height: 720px; /* Increased min-height to fit 9 items */
  height: calc(100vh - 140px); /* Fixed height to fit on screen */
  overflow: hidden;
  @media (max-width: 960px) { 
    grid-template-columns: 1fr;
    height: auto; 
    overflow: visible; 
  }
`;
const Left = styled.div`
  display: grid;
  grid-template-rows: 1fr 1fr; /* 1:1 ratio including gap */
  gap: 12px;
  min-height: 0;
  overflow: hidden;
`;
const Center = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
`;
const Right = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
`;
