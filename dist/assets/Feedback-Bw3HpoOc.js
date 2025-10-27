import{j as e,d as t,f as F,c as _,r as s}from"./index-B0K7mn4q.js";import{P as A,b as P,f as j,G as y,S as B}from"./UI-Cj3YhchZ.js";const T={};function R({kind:a,setKind:r,title:n,setTitle:c,body:o,setBody:p,contact:l,setContact:h,submitting:d,titlePlaceholder:x,onSubmit:f,onReset:g}){return e.jsxs(A,{children:[e.jsxs(P,{children:[e.jsxs("div",{children:[e.jsx("h2",{children:"오류 제보 · 기능 요청"}),e.jsxs("p",{children:["개선이 필요하거나 버그가 있다면 편하게 보내주세요. 또는 이메일로 제보:",e.jsx("a",{href:"mailto:nahg0525@gmail.com",style:{marginLeft:6},children:"nahg0525@gmail.com"})]})]}),e.jsxs(U,{children:[e.jsx(j,{as:"a",href:"mailto:nahg0525@gmail.com?subject=%5BClassOn%5D%20%ED%94%BC%EB%93%9C%EB%B0%B1",style:{whiteSpace:"nowrap"},children:"✉️ 이메일로 제보"}),T?.VITE_ENABLE_FEEDBACK==="true"&&e.jsx(y,{as:"a",href:"/feedback/changelog",style:{whiteSpace:"nowrap"},children:"업데이트 안내 보기"})]})]}),e.jsxs(O,{role:"note","aria-label":"서비스 안내",children:[e.jsx(L,{children:"Classon은 아직 성장하고 있습니다."}),e.jsxs(M,{children:[e.jsx("p",{children:"선생님들의 목소리에 귀 기울이며,"}),e.jsx("p",{children:"현장에서 정말 필요한 기능을 하나씩 만들어가고 있습니다."}),e.jsx("p",{children:"부족한 부분이 있을 수 있습니다."}),e.jsx("p",{children:"하지만 여러분과 함께 더 나은 서비스로 발전해 나가겠습니다."})]})]}),e.jsxs(B,{as:"form",onSubmit:f,"aria-labelledby":"fb-title",children:[e.jsxs(G,{children:[e.jsxs(v,{children:[e.jsx(u,{htmlFor:"fb-kind",children:"유형"}),e.jsxs(z,{id:"fb-kind",value:a,onChange:i=>r(i.target.value),children:[e.jsx("option",{value:"BUG",children:"오류 제보"}),e.jsx("option",{value:"FEATURE",children:"기능 요청"})]})]}),e.jsxs(v,{children:[e.jsx(u,{htmlFor:"fb-contact",children:"연락처 (선택)"}),e.jsx(w,{id:"fb-contact",placeholder:"답변을 받고 싶은 이메일 또는 연락처",value:l,onChange:i=>h(i.target.value)})]})]}),e.jsx(u,{htmlFor:"fb-title",children:"제목"}),e.jsx(w,{id:"fb-title",placeholder:x,value:n,onChange:i=>c(i.target.value)}),e.jsx(u,{htmlFor:"fb-body",children:"내용"}),e.jsx(D,{id:"fb-body",placeholder:`어떤 문제가 있었는지 또는 어떤 기능이 필요한지 자세히 알려주세요.
(가능하면 재현 방법과 기대 동작을 함께 적어주세요.)`,rows:8,value:o,onChange:i=>p(i.target.value)}),e.jsxs(H,{children:[e.jsx(y,{type:"button",onClick:g,children:"초기화"}),e.jsx(j,{type:"submit",disabled:d,children:d?"제출 중…":"제출하기"})]})]})]})}const U=t.div`
  display: inline-flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
`,G=t.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 8px;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`,v=t.div``,u=t.label`
  display: block;
  margin: 8px 0 6px;
  font-size: 12px;
  color: #6b7280;
`,w=t.input`
  width: 100%;
  height: 40px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 0 12px;
`,z=t.select`
  width: 100%;
  height: 40px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 0 8px;
  background: #fff;
`,D=t.textarea`
  width: 100%;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 10px 12px;
  resize: vertical;
`,H=t.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 14px;
`,O=t(B)`
  border-left: 4px solid #4f46e5;
  background: linear-gradient(
    135deg,
    rgba(79, 70, 229, 0.08),
    rgba(59, 130, 246, 0.05)
  );
  padding: 24px 28px;
  display: grid;
  gap: 12px;
`,L=t.h3`
  margin: 0;
  font-size: 20px;
  font-weight: 800;
  color: #1f2937;
`,M=t.div`
  display: grid;
  gap: 6px;
  p {
    margin: 0;
    font-size: 15px;
    color: #374151;
    line-height: 1.6;
  }
`;async function N(a){return await F("/api/feedback",{method:"POST",body:JSON.stringify(a)})}function I(){const{success:a,error:r}=_(),[n,c]=s.useState("BUG"),[o,p]=s.useState(""),[l,h]=s.useState(""),[d,x]=s.useState(""),[f,g]=s.useState(!1),i=s.useMemo(()=>window.location.href,[]),S=s.useMemo(()=>navigator.userAgent,[]),E=s.useMemo(()=>n==="FEATURE"?"예: 출결 화면에 자동 저장 기능이 있으면 좋겠어요":"예: 출결 화면에서 저장이 안됩니다",[n]),b=()=>{p(""),h(""),x(""),c("BUG")};return{kind:n,setKind:c,title:o,setTitle:p,body:l,setBody:h,contact:d,setContact:x,submitting:f,titlePlaceholder:E,onSubmit:async C=>{if(C.preventDefault(),!o.trim()){r("제목을 입력해주세요.");return}if(!l.trim()){r("내용을 입력해주세요.");return}g(!0);try{await N({type:n,title:o.trim(),body:l.trim(),contact:d.trim()||void 0,pageUrl:i,userAgent:S}),a("소중한 의견이 접수되었습니다. 감사합니다!"),b()}catch(m){const k=m instanceof Error?m.message:"제출에 실패했습니다. 다시 시도해 주세요.";r(k)}finally{g(!1)}},onReset:b}}function q(){const a=I();return e.jsx(R,{...a})}export{q as default};
