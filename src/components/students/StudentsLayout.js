import { jsx as _jsx } from "react/jsx-runtime";
import styled from "styled-components";
import { Page as PageWrap, SectionCard as SectionCard } from "../common/UI";
// EN: Base layout wrappers for the Students page
// KO: 원생 관리 페이지 기본 레이아웃 래퍼
export function Page({ children }) { return _jsx(PageWrap, { children: children }); }
export function Card({ children }) { return _jsx(SectionCard, { children: children }); }
export function Row({ children }) {
    return _jsx(RowBox, { children: children });
}
// Page and Card provided by common UI
const RowBox = styled.div `
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: 12px;
`;
