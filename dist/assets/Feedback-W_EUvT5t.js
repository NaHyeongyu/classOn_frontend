import{f as E,k as C,r as a,j as e,P as k,b as _,m as f,G as g,S as F,d as s}from"./index-DuqOyKVg.js";async function A(r){return await E("/api/feedback",{method:"POST",body:JSON.stringify(r)})}const G={};function R(){const{success:r,error:n}=C(),[x,o]=a.useState("BUG"),[l,d]=a.useState(""),[c,h]=a.useState(""),[u,p]=a.useState(""),[m,b]=a.useState(!1),v=a.useMemo(()=>window.location.href,[]),w=a.useMemo(()=>navigator.userAgent,[]);async function B(t){if(t.preventDefault(),!l.trim())return n("제목을 입력해주세요.");if(!c.trim())return n("내용을 입력해주세요.");b(!0);try{await A({type:x,title:l.trim(),body:c.trim(),contact:u.trim()||void 0,pageUrl:v,userAgent:w}),r("소중한 의견이 접수되었습니다. 감사합니다!"),d(""),h(""),p(""),o("BUG")}catch(S){n(S?.message||"제출에 실패했습니다. 다시 시도해 주세요.")}finally{b(!1)}}return e.jsxs(k,{children:[e.jsxs(_,{children:[e.jsxs("div",{children:[e.jsx("h2",{children:"오류 제보 · 기능 요청"}),e.jsxs("p",{children:["개선이 필요하거나 버그가 있다면 편하게 보내주세요. 또는 이메일로 제보:",e.jsx("a",{href:"mailto:nahg0525@gmail.com",style:{marginLeft:6},children:"nahg0525@gmail.com"})]})]}),e.jsxs("div",{style:{display:"inline-flex",gap:8,alignItems:"center",flexWrap:"wrap"},children:[e.jsx(f,{as:"a",href:"mailto:nahg0525@gmail.com?subject=%5BClassOn%5D%20%ED%94%BC%EB%93%9C%EB%B0%B1",style:{whiteSpace:"nowrap"},children:"✉️ 이메일로 제보"}),G?.VITE_ENABLE_FEEDBACK==="true"&&e.jsx(g,{as:"a",href:"/feedback/changelog",style:{whiteSpace:"nowrap"},children:"업데이트 안내 보기"})]})]}),e.jsxs(F,{as:"form",onSubmit:B,"aria-labelledby":"fb-title",children:[e.jsxs(T,{children:[e.jsxs(j,{children:[e.jsx(i,{htmlFor:"fb-kind",children:"유형"}),e.jsxs(U,{id:"fb-kind",value:x,onChange:t=>o(t.target.value),children:[e.jsx("option",{value:"BUG",children:"오류 제보"}),e.jsx("option",{value:"FEATURE",children:"기능 요청"})]})]}),e.jsxs(j,{children:[e.jsx(i,{htmlFor:"fb-contact",children:"연락처 (선택)"}),e.jsx(y,{id:"fb-contact",placeholder:"답변을 받고 싶은 이메일 또는 연락처",value:u,onChange:t=>p(t.target.value)})]})]}),e.jsx(i,{htmlFor:"fb-title",children:"제목"}),e.jsx(y,{id:"fb-title",placeholder:"예: 출결 화면에서 저장이 안됩니다",value:l,onChange:t=>d(t.target.value)}),e.jsx(i,{htmlFor:"fb-body",children:"내용"}),e.jsx(P,{id:"fb-body",placeholder:`어떤 문제가 있었는지 또는 어떤 기능이 필요한지 자세히 알려주세요.
(가능하면 재현 방법과 기대 동작을 함께 적어주세요.)`,rows:8,value:c,onChange:t=>h(t.target.value)}),e.jsxs(D,{children:[e.jsx(g,{type:"button",onClick:()=>{d(""),h(""),p(""),o("BUG")},children:"초기화"}),e.jsx(f,{type:"submit",disabled:m,children:m?"제출 중…":"제출하기"})]})]})]})}const T=s.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 8px;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`,j=s.div``,i=s.label`
  display: block;
  margin: 8px 0 6px;
  font-size: 12px;
  color: #6b7280;
`,y=s.input`
  width: 100%;
  height: 40px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 0 12px;
`,U=s.select`
  width: 100%;
  height: 40px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 0 8px;
  background: #fff;
`,P=s.textarea`
  width: 100%;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 10px 12px;
  resize: vertical;
`,D=s.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 14px;
`;export{R as default};
