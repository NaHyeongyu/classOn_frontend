import{d as o}from"./index-B0K7mn4q.js";import{c as t,e as a}from"./UI-Cj3YhchZ.js";const n=o(a)`
  height: 32px;
  padding: 0 12px;
  font-size: 13px;
`,i=o.div`
  color: #6b7280;
  font-size: 12px;
  margin-top: 4px;
`,s=o.span`
  color: #9ca3af;
  font-size: 12px;
`,p=o.div`
  background: #fee2e2;
  color: #b91c1c;
  border: 1px solid #fecaca;
  padding: 10px 12px;
  border-radius: 10px;
  font-size: 13px;
`,c=o.div`
  color: #6b7280;
  font-size: 12px;
`,l=o.span`
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
`,f=o.div`
  display: grid;
  gap: 6px;
`,g=o.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 10px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: #fff;
`,x=o.div`
  display: flex;
  align-items: center;
  gap: 6px;
`,b=o.input`
  height: 26px;
  width: 140px;
  padding: 0 8px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 12px;
  background: #fff;
`,u=o.div`
  display: inline-flex;
  gap: 6px;
`,h=o.button`
  ${t.base};
  height: 32px;
  padding: 0 12px;
  font-size: 13px;
  background: ${e=>e.theme.colors.surfaceMuted};
  border: 1px solid ${e=>e.theme.colors.border};
  color: ${e=>e.theme.colors.text};
  &:hover:not(:disabled) {
    background: ${e=>e.theme.colors.surfaceAlt};
  }
  &:active:not(:disabled) {
    transform: translateY(1px);
    background: ${e=>e.theme.colors.surface};
  }
  &[data-active="true"] {
    background: #ecfdf5;
    border-color: #a7f3d0;
    color: #065f46;
  }
  &[data-variant="danger"] {
    background: ${e=>e.theme.colors.dangerSurface};
    border-color: ${e=>e.theme.colors.dangerSurface};
    color: ${e=>e.theme.colors.danger};
  }
  &[data-variant="danger"][data-active="true"] {
    background: ${e=>e.theme.colors.danger};
    border-color: ${e=>e.theme.colors.danger};
    color: ${e=>e.theme.colors.textInverted};
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`,m=o.span`
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
`,k=o.div`
  padding: 12px;
  color: #6b7280;
  font-size: 13px;
`,y=o.div`
  display: grid;
  gap: ${e=>e.theme.spacing.sm};
  font-size: 14px;
  color: #334155;
`,v=o.div`
  display: grid;
  gap: ${e=>e.theme.spacing.xs};
  max-height: 240px;
  overflow-y: auto;
  padding-right: 4px;
`,z=o.label`
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
`,w=o.div`
  display: flex;
  justify-content: flex-end;
  font-size: 12px;
  color: #475569;
`,$=o.button`
  ${t.outline};
  height: 40px;
  padding: 0 16px;
  font-weight: 600;
  font-size: 14px;
`,B=o.span`
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
`,S=o.span`
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
`;export{p as A,$ as B,B as D,k as E,i as H,g as I,f as L,c as M,b as N,m as P,x as R,s as S,S as T,n as a,l as b,u as c,h as d,y as e,v as f,z as g,w as h};
