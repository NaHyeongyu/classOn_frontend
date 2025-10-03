import{u as m,K as j,r as s,j as e,I as v,M as c,d as r,w as y}from"./index-BONIAwcU.js";function B(){const t=m(),{login:x,loading:n}=j(),[a,b]=s.useState(""),[d,f]=s.useState(""),[i,l]=s.useState(null);async function h(o){o.preventDefault(),l(null);try{await x(a.trim(),d),t(c.admin,{replace:!0})}catch(g){l(g?.message||"로그인에 실패했습니다.")}}return e.jsx(k,{children:e.jsxs(w,{children:[e.jsx("h2",{children:"관리자 로그인"}),e.jsx("p",{style:{color:"#6b7280"},children:"관리 전용 기능 접근을 위해 로그인하세요."}),e.jsxs(S,{onSubmit:h,children:[e.jsx("label",{children:"아이디"}),e.jsx(p,{value:a,onChange:o=>b(o.target.value),placeholder:"classonadmin",required:!0}),e.jsx("label",{children:"비밀번호"}),e.jsx(p,{type:"password",value:d,onChange:o=>f(o.target.value),placeholder:"비밀번호",required:!0}),i&&e.jsx(A,{children:i}),e.jsxs(z,{children:[e.jsx(v,{as:"button",type:"button",onClick:()=>t(c.admin),children:"취소"}),e.jsx(C,{type:"submit",disabled:n,children:n?"로그인 중…":"로그인"})]})]})]})})}const k=r.div` min-height: 60vh; display:grid; place-items:center; background:#fff; `,w=r.div` width:100%; max-width:540px; border:1px solid #e5e7eb; border-radius:16px; padding:20px; background:#fff; display:grid; gap:14px; `,S=r.form` display:grid; gap:10px; `,p=r.input` height:42px; border:1px solid #e5e7eb; border-radius:10px; padding:0 12px; font-size:14px; background:#fff; color:#111827; `,z=r.div` display:flex; justify-content:flex-end; gap:8px; `,A=r.div` color:#b91c1c; font-size:13px; `;r.div` color:#6b7280; font-size:12px; `;const u=y`
  height: 40px; padding: 0 16px; border-radius: 10px; font-weight: 700; font-size: 14px; cursor: pointer; transition: background .15s ease, color .15s ease, border-color .15s ease;
`,C=r.button`
  ${u};
  background: #111827; color: #fff; border:1px solid #111827;
  &:hover{ background:#000; border-color:#000; }
  &:disabled{ opacity:.6; cursor:not-allowed; }
`;r.button`
  ${u};
  background:#fff; color:#111827; border:1px solid #e5e7eb; &:hover{ background:#f9fafb; }
`;export{B as default};
