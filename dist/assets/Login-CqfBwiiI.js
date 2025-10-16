import{g as E,u as A,h as M,r as o,j as e,k as q,d as s}from"./index-CyW3XeFu.js";import{m as B}from"./UI-evna17pR.js";import{C as D}from"./ConfirmDialog-Ba2sBuvj.js";function U(){const{login:b}=E(),j=A(),v=M(),[i,y]=o.useState(""),[l,w]=o.useState(""),[u,d]=o.useState(!1),[S,c]=o.useState(!1),[L,f]=o.useState(""),[p,k]=o.useState(!1);async function C(t){if(t.preventDefault(),k(!0),!i||!l){f("아이디와 비밀번호를 입력해 주세요."),c(!0);return}d(!0);try{await b(i,l);const n=v.state?.from||"/";j(n,{replace:!0})}catch(n){f(z(n)),c(!0)}finally{d(!1)}}function z(t){const n="로그인에 실패했습니다.",a=t&&typeof t=="object"&&"status"in t?Number(t.status):void 0,g=t&&typeof t=="object"&&"message"in t?String(t.message):String(t??""),r=g.toLowerCase();if(a===401)return"아이디 또는 비밀번호가 올바르지 않습니다.";if(a===403)return"접근이 거부되었습니다.";if(a===429)return"요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.";if(a&&a>=500)return"서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.";if(r.includes("401"))return"아이디 또는 비밀번호가 올바르지 않습니다.";if(r.includes("403"))return"접근이 거부되었습니다.";if(r.includes("429"))return"요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.";if(r.includes("abort")||r.includes("timeout"))return"서버 응답이 지연되고 있습니다. 잠시 후 다시 시도해 주세요.";if(r.includes("network")||r.includes("failed to fetch"))return"네트워크 연결을 확인해 주세요.";if(r.includes("500"))return"서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.";const x=g.split(`
`).filter(Boolean);return x.length>1&&x.slice(-1)[0].trim()||n}return e.jsxs("div",{children:[e.jsx(O,{children:e.jsx("img",{src:"/logo/logo.svg",alt:"Academy Manager 로고"})}),e.jsx(N,{children:"로그인"}),e.jsx(P,{children:"계정에 접속하여 서비스를 이용하세요."}),e.jsxs(T,{onSubmit:C,children:[e.jsxs(m,{children:["아이디",e.jsx("span",{children:"*"})]}),e.jsx(h,{type:"text",value:i,onChange:t=>y(t.target.value),placeholder:"아이디를 입력하세요",required:!0,"aria-invalid":p&&!i}),e.jsxs(m,{children:["비밀번호",e.jsx("span",{children:"*"})]}),e.jsx(h,{type:"password",value:l,onChange:t=>w(t.target.value),placeholder:"••••••••",required:!0,"aria-invalid":p&&!l}),e.jsx(B,{as:"button",type:"submit",disabled:u,children:u?"로그인 중...":"로그인"})]}),e.jsx(D,{open:S,title:"로그인 실패",message:L,hideCancel:!0,onCancel:()=>c(!1),onConfirm:()=>c(!1)}),e.jsxs(F,{children:["계정이 없으신가요? ",e.jsx(q,{to:"/register",children:"회원가입"})]})]})}const N=s.h1`
  margin: 0 0 12px;
  font-size: 30px;
  color: #111827;
`,O=s.div`
  display: grid;
  place-items: center;
  margin: 20px 0 8px;
  img { height: 48px; width: auto; }
`,P=s.p`
  margin: 0 0 24px;
  color: #6b7280;
  font-size: 15px;
`,T=s.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`,m=s.label`
  font-size: 13px;
  color: #6b7280;
  span { color: #ef4444; margin-left: 4px; }
`,h=s.input`
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
  &[aria-invalid='true'] {
    background: #fee2e2;
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.18);
  }
`,F=s.div`
  margin-top: 18px;
  color: #6b7280;
  font-size: 14px;
  a {
    color: #4f46e5;
    font-weight: 700;
  }
`;export{U as default};
