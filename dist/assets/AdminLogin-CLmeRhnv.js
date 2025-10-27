import{j as e,d as a,l as f,R as j,r as u,u as w,a as m}from"./index-B0K7mn4q.js";import{j as v}from"./UI-Cj3YhchZ.js";import{r as y}from"./errors-C6OcbAl5.js";function S({username:t,password:i,loading:o,error:n,onChangeUsername:r,onChangePassword:l,onSubmit:s,onCancel:c}){return e.jsx(k,{children:e.jsxs(C,{children:[e.jsx("h2",{children:"관리자 로그인"}),e.jsx("p",{style:{color:"#6b7280"},children:"관리 전용 기능 접근을 위해 로그인하세요."}),e.jsxs(A,{onSubmit:s,children:[e.jsx("label",{htmlFor:"admin-login-username",children:"아이디"}),e.jsx(g,{id:"admin-login-username",value:t,onChange:d=>r(d.target.value),placeholder:"classonadmin",required:!0}),e.jsx("label",{htmlFor:"admin-login-password",children:"비밀번호"}),e.jsx(g,{id:"admin-login-password",type:"password",value:i,onChange:d=>l(d.target.value),placeholder:"비밀번호",required:!0}),n?e.jsx(E,{role:"alert",children:n}):null,e.jsxs(P,{children:[e.jsx(v,{as:"button",type:"button",onClick:c,children:"취소"}),e.jsx(B,{type:"submit",disabled:o,children:o?"로그인 중…":"로그인"})]})]})]})})}const k=a.div`
  min-height: 60vh;
  display: grid;
  place-items: center;
  background: #fff;
`,C=a.div`
  width: 100%;
  max-width: 540px;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 20px;
  background: #fff;
  display: grid;
  gap: 14px;
`,A=a.form`
  display: grid;
  gap: 10px;
`,g=a.input`
  height: 42px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 0 12px;
  font-size: 14px;
  background: #fff;
  color: #111827;
`,P=a.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`,E=a.div`
  color: #b91c1c;
  font-size: 13px;
`,z=f`
  height: 40px;
  padding: 0 16px;
  border-radius: 10px;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  transition:
    background 0.15s ease,
    color 0.15s ease,
    border-color 0.15s ease;
`,B=a.button`
  ${z};
  background: #111827;
  color: #fff;
  border: 1px solid #111827;

  &:hover {
    background: #000;
    border-color: #000;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;function F(t){const{onSuccess:i}=t??{},{login:o,loading:n}=j(),[r,l]=u.useState(""),[s,c]=u.useState(""),[d,p]=u.useState(null),x=u.useCallback(async h=>{h?.preventDefault(),p(null);try{await o(r.trim(),s),i?.()}catch(b){p(y(b,"로그인에 실패했습니다."))}},[o,i,s,r]);return{...u.useMemo(()=>({username:r,password:s,error:d,loading:n}),[d,n,s,r]),setUsername:l,setPassword:c,handleSubmit:x}}function R(){const t=w(),{username:i,password:o,error:n,loading:r,setUsername:l,setPassword:s,handleSubmit:c}=F({onSuccess:()=>t(m.admin,{replace:!0})});return e.jsx(S,{username:i,password:o,loading:r,error:n,onChangeUsername:l,onChangePassword:s,onSubmit:c,onCancel:()=>t(m.admin)})}export{R as default};
