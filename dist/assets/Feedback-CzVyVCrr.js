import{f as k,b as F,r as s,j as e,d as t}from"./index-D-9d_yHo.js";import{P as _,b as T,f as b,G as m,S as v}from"./UI-DfwAVYB9.js";async function A(n){return await k("/api/feedback",{method:"POST",body:JSON.stringify(n)})}const U={};function M(){const{success:n,error:l}=F(),[a,o]=s.useState("BUG"),[d,c]=s.useState(""),[h,p]=s.useState(""),[g,x]=s.useState(""),[u,f]=s.useState(!1),w=s.useMemo(()=>window.location.href,[]),B=s.useMemo(()=>navigator.userAgent,[]);async function E(i){if(i.preventDefault(),!d.trim())return l("제목을 입력해주세요.");if(!h.trim())return l("내용을 입력해주세요.");f(!0);try{await A({type:a,title:d.trim(),body:h.trim(),contact:g.trim()||void 0,pageUrl:w,userAgent:B}),n("소중한 의견이 접수되었습니다. 감사합니다!"),c(""),p(""),x(""),o("BUG")}catch(C){l(C?.message||"제출에 실패했습니다. 다시 시도해 주세요.")}finally{f(!1)}}const S=s.useMemo(()=>a==="FEATURE"?"예: 출결 화면에 자동 저장 기능이 있으면 좋겠어요":"예: 출결 화면에서 저장이 안됩니다",[a]);return e.jsxs(_,{children:[e.jsxs(T,{children:[e.jsxs("div",{children:[e.jsx("h2",{children:"오류 제보 · 기능 요청"}),e.jsxs("p",{children:["개선이 필요하거나 버그가 있다면 편하게 보내주세요. 또는 이메일로 제보:",e.jsx("a",{href:"mailto:nahg0525@gmail.com",style:{marginLeft:6},children:"nahg0525@gmail.com"})]})]}),e.jsxs("div",{style:{display:"inline-flex",gap:8,alignItems:"center",flexWrap:"wrap"},children:[e.jsx(b,{as:"a",href:"mailto:nahg0525@gmail.com?subject=%5BClassOn%5D%20%ED%94%BC%EB%93%9C%EB%B0%B1",style:{whiteSpace:"nowrap"},children:"✉️ 이메일로 제보"}),U?.VITE_ENABLE_FEEDBACK==="true"&&e.jsx(m,{as:"a",href:"/feedback/changelog",style:{whiteSpace:"nowrap"},children:"업데이트 안내 보기"})]})]}),e.jsxs(D,{role:"note","aria-label":"서비스 안내",children:[e.jsx(H,{children:"Classon은 아직 성장하고 있습니다."}),e.jsxs(O,{children:[e.jsx("p",{children:"선생님들의 목소리에 귀 기울이며,"}),e.jsx("p",{children:"현장에서 정말 필요한 기능을 하나씩 만들어가고 있습니다."}),e.jsx("p",{children:"부족한 부분이 있을 수 있습니다."}),e.jsx("p",{children:"하지만 여러분과 함께 더 나은 서비스로 발전해 나가겠습니다."})]})]}),e.jsxs(v,{as:"form",onSubmit:E,"aria-labelledby":"fb-title",children:[e.jsxs(G,{children:[e.jsxs(j,{children:[e.jsx(r,{htmlFor:"fb-kind",children:"유형"}),e.jsxs(P,{id:"fb-kind",value:a,onChange:i=>o(i.target.value),children:[e.jsx("option",{value:"BUG",children:"오류 제보"}),e.jsx("option",{value:"FEATURE",children:"기능 요청"})]})]}),e.jsxs(j,{children:[e.jsx(r,{htmlFor:"fb-contact",children:"연락처 (선택)"}),e.jsx(y,{id:"fb-contact",placeholder:"답변을 받고 싶은 이메일 또는 연락처",value:g,onChange:i=>x(i.target.value)})]})]}),e.jsx(r,{htmlFor:"fb-title",children:"제목"}),e.jsx(y,{id:"fb-title",placeholder:S,value:d,onChange:i=>c(i.target.value)}),e.jsx(r,{htmlFor:"fb-body",children:"내용"}),e.jsx(R,{id:"fb-body",placeholder:`어떤 문제가 있었는지 또는 어떤 기능이 필요한지 자세히 알려주세요.
(가능하면 재현 방법과 기대 동작을 함께 적어주세요.)`,rows:8,value:h,onChange:i=>p(i.target.value)}),e.jsxs(z,{children:[e.jsx(m,{type:"button",onClick:()=>{c(""),p(""),x(""),o("BUG")},children:"초기화"}),e.jsx(b,{type:"submit",disabled:u,children:u?"제출 중…":"제출하기"})]})]})]})}const G=t.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 8px;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`,j=t.div``,r=t.label`
  display: block;
  margin: 8px 0 6px;
  font-size: 12px;
  color: #6b7280;
`,y=t.input`
  width: 100%;
  height: 40px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 0 12px;
`,P=t.select`
  width: 100%;
  height: 40px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 0 8px;
  background: #fff;
`,R=t.textarea`
  width: 100%;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 10px 12px;
  resize: vertical;
`,z=t.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 14px;
`,D=t(v)`
  border-left: 4px solid #4f46e5;
  background: linear-gradient(135deg, rgba(79, 70, 229, 0.08), rgba(59, 130, 246, 0.05));
  padding: 24px 28px;
  display: grid;
  gap: 12px;
`,H=t.h3`
  margin: 0;
  font-size: 20px;
  font-weight: 800;
  color: #1f2937;
`,O=t.div`
  display: grid;
  gap: 6px;
  p {
    margin: 0;
    font-size: 15px;
    color: #374151;
    line-height: 1.6;
  }
`;export{M as default};
