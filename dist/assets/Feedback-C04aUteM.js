import{f as C,k,r as s,j as e,P as F,b as _,m as f,G as g,S as A,d as a}from"./index-_dJHzZeb.js";async function T(n){return await C("/api/feedback",{method:"POST",body:JSON.stringify(n)})}const U={};function I(){const{success:n,error:o}=k(),[i,l]=s.useState("BUG"),[d,c]=s.useState(""),[h,p]=s.useState(""),[u,x]=s.useState(""),[m,b]=s.useState(!1),v=s.useMemo(()=>window.location.href,[]),w=s.useMemo(()=>navigator.userAgent,[]);async function B(t){if(t.preventDefault(),!d.trim())return o("제목을 입력해주세요.");if(!h.trim())return o("내용을 입력해주세요.");b(!0);try{await T({type:i,title:d.trim(),body:h.trim(),contact:u.trim()||void 0,pageUrl:v,userAgent:w}),n("소중한 의견이 접수되었습니다. 감사합니다!"),c(""),p(""),x(""),l("BUG")}catch(S){o(S?.message||"제출에 실패했습니다. 다시 시도해 주세요.")}finally{b(!1)}}const E=s.useMemo(()=>i==="FEATURE"?"예: 출결 화면에 자동 저장 기능이 있으면 좋겠어요":"예: 출결 화면에서 저장이 안됩니다",[i]);return e.jsxs(F,{children:[e.jsxs(_,{children:[e.jsxs("div",{children:[e.jsx("h2",{children:"오류 제보 · 기능 요청"}),e.jsxs("p",{children:["개선이 필요하거나 버그가 있다면 편하게 보내주세요. 또는 이메일로 제보:",e.jsx("a",{href:"mailto:nahg0525@gmail.com",style:{marginLeft:6},children:"nahg0525@gmail.com"})]})]}),e.jsxs("div",{style:{display:"inline-flex",gap:8,alignItems:"center",flexWrap:"wrap"},children:[e.jsx(f,{as:"a",href:"mailto:nahg0525@gmail.com?subject=%5BClassOn%5D%20%ED%94%BC%EB%93%9C%EB%B0%B1",style:{whiteSpace:"nowrap"},children:"✉️ 이메일로 제보"}),U?.VITE_ENABLE_FEEDBACK==="true"&&e.jsx(g,{as:"a",href:"/feedback/changelog",style:{whiteSpace:"nowrap"},children:"업데이트 안내 보기"})]})]}),e.jsxs(A,{as:"form",onSubmit:B,"aria-labelledby":"fb-title",children:[e.jsxs(G,{children:[e.jsxs(j,{children:[e.jsx(r,{htmlFor:"fb-kind",children:"유형"}),e.jsxs(P,{id:"fb-kind",value:i,onChange:t=>l(t.target.value),children:[e.jsx("option",{value:"BUG",children:"오류 제보"}),e.jsx("option",{value:"FEATURE",children:"기능 요청"})]})]}),e.jsxs(j,{children:[e.jsx(r,{htmlFor:"fb-contact",children:"연락처 (선택)"}),e.jsx(y,{id:"fb-contact",placeholder:"답변을 받고 싶은 이메일 또는 연락처",value:u,onChange:t=>x(t.target.value)})]})]}),e.jsx(r,{htmlFor:"fb-title",children:"제목"}),e.jsx(y,{id:"fb-title",placeholder:E,value:d,onChange:t=>c(t.target.value)}),e.jsx(r,{htmlFor:"fb-body",children:"내용"}),e.jsx(R,{id:"fb-body",placeholder:`어떤 문제가 있었는지 또는 어떤 기능이 필요한지 자세히 알려주세요.
(가능하면 재현 방법과 기대 동작을 함께 적어주세요.)`,rows:8,value:h,onChange:t=>p(t.target.value)}),e.jsxs(D,{children:[e.jsx(g,{type:"button",onClick:()=>{c(""),p(""),x(""),l("BUG")},children:"초기화"}),e.jsx(f,{type:"submit",disabled:m,children:m?"제출 중…":"제출하기"})]})]})]})}const G=a.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 8px;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`,j=a.div``,r=a.label`
  display: block;
  margin: 8px 0 6px;
  font-size: 12px;
  color: #6b7280;
`,y=a.input`
  width: 100%;
  height: 40px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 0 12px;
`,P=a.select`
  width: 100%;
  height: 40px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 0 8px;
  background: #fff;
`,R=a.textarea`
  width: 100%;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 10px 12px;
  resize: vertical;
`,D=a.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 14px;
`;export{I as default};
