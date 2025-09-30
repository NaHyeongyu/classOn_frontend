import{y as j,u as v,z as y,r as s,j as e,A as w,L,d as o}from"./index-CJzRppoi.js";function P(){const{login:u}=j(),g=v(),f=y(),[r,h]=s.useState(""),[a,b]=s.useState(""),[c,l]=s.useState(!1),[d,n]=s.useState(null);async function m(t){if(t.preventDefault(),n(null),!r||!a){n("아이디와 비밀번호를 입력해 주세요.");return}l(!0);try{await u(r,a);const i=f.state?.from||"/";g(i,{replace:!0})}catch(i){n(i?.message||"로그인에 실패했습니다.")}finally{l(!1)}}return e.jsxs("div",{children:[e.jsx(S,{children:e.jsx("img",{src:"/logo/logo.svg",alt:"Academy Manager 로고"})}),e.jsx(z,{children:"로그인"}),e.jsx(k,{children:"계정에 접속하여 서비스를 이용하세요."}),e.jsxs(A,{onSubmit:m,children:[e.jsx(p,{children:"아이디"}),e.jsx(x,{type:"text",value:r,onChange:t=>h(t.target.value),placeholder:"아이디를 입력하세요"}),e.jsx(p,{children:"비밀번호"}),e.jsx(x,{type:"password",value:a,onChange:t=>b(t.target.value),placeholder:"••••••••"}),d&&e.jsx(T,{children:d}),e.jsx(w,{as:"button",type:"submit",disabled:c,children:c?"로그인 중...":"로그인"})]}),e.jsxs(E,{children:["계정이 없으신가요? ",e.jsx(L,{to:"/register",children:"회원가입"})]})]})}const z=o.h1`
  margin: 0 0 12px;
  font-size: 30px;
  color: #111827;
`,S=o.div`
  display: grid;
  place-items: center;
  margin: 20px 0 8px;
  img { height: 48px; width: auto; }
`,k=o.p`
  margin: 0 0 24px;
  color: #6b7280;
  font-size: 15px;
`,A=o.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`,p=o.label`
  font-size: 13px;
  color: #6b7280;
`,x=o.input`
  height: 54px;
  border: none;
  border-radius: 14px;
  padding: 0 16px;
  font-size: 15px;
  background: #f3f4f6;
  outline: none;
  transition: box-shadow 0.15s ease, background 0.15s ease;
  &::placeholder {
    color: #9ca3af;
  }
  &:focus {
    background: #eef2ff;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.18);
  }
`,E=o.div`
  margin-top: 18px;
  color: #6b7280;
  font-size: 14px;
  a {
    color: #4f46e5;
    font-weight: 700;
  }
`,T=o.div`
  color: #b91c1c;
  background: #fee2e2;
  padding: 10px 12px;
  border-radius: 10px;
  font-size: 14px;
`;export{P as default};
