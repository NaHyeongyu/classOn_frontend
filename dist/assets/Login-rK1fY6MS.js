import{y as k,u as z,z as E,r as a,j as t,A,L as M,d as n}from"./index-Da2dCk2M.js";import{C as B}from"./ConfirmDialog-CNfMp7Cm.js";function I(){const{login:h}=k(),b=z(),j=E(),[c,y]=a.useState(""),[l,v]=a.useState(""),[u,d]=a.useState(!1),[w,i]=a.useState(!1),[L,f]=a.useState("");async function S(e){if(e.preventDefault(),!c||!l){f("아이디와 비밀번호를 입력해 주세요."),i(!0);return}d(!0);try{await h(c,l);const r=j.state?.from||"/";b(r,{replace:!0})}catch(r){f(C(r)),i(!0)}finally{d(!1)}}function C(e){const r="로그인에 실패했습니다.",o=e&&typeof e=="object"&&"status"in e?Number(e.status):void 0,p=e&&typeof e=="object"&&"message"in e?String(e.message):String(e??""),s=p.toLowerCase();if(o===401)return"아이디 또는 비밀번호가 올바르지 않습니다.";if(o===403)return"접근이 거부되었습니다.";if(o===429)return"요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.";if(o&&o>=500)return"서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.";if(s.includes("401"))return"아이디 또는 비밀번호가 올바르지 않습니다.";if(s.includes("403"))return"접근이 거부되었습니다.";if(s.includes("429"))return"요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.";if(s.includes("abort")||s.includes("timeout"))return"서버 응답이 지연되고 있습니다. 잠시 후 다시 시도해 주세요.";if(s.includes("network")||s.includes("failed to fetch"))return"네트워크 연결을 확인해 주세요.";if(s.includes("500"))return"서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.";const g=p.split(`
`).filter(Boolean);return g.length>1&&g.slice(-1)[0].trim()||r}return t.jsxs("div",{children:[t.jsx(N,{children:t.jsx("img",{src:"/logo/logo.svg",alt:"Academy Manager 로고"})}),t.jsx(D,{children:"로그인"}),t.jsx(O,{children:"계정에 접속하여 서비스를 이용하세요."}),t.jsxs(P,{onSubmit:S,children:[t.jsx(x,{children:"아이디"}),t.jsx(m,{type:"text",value:c,onChange:e=>y(e.target.value),placeholder:"아이디를 입력하세요"}),t.jsx(x,{children:"비밀번호"}),t.jsx(m,{type:"password",value:l,onChange:e=>v(e.target.value),placeholder:"••••••••"}),t.jsx(A,{as:"button",type:"submit",disabled:u,children:u?"로그인 중...":"로그인"})]}),t.jsx(B,{open:w,title:"로그인 실패",message:L,hideCancel:!0,onCancel:()=>i(!1),onConfirm:()=>i(!1)}),t.jsxs(T,{children:["계정이 없으신가요? ",t.jsx(M,{to:"/register",children:"회원가입"})]})]})}const D=n.h1`
  margin: 0 0 12px;
  font-size: 30px;
  color: #111827;
`,N=n.div`
  display: grid;
  place-items: center;
  margin: 20px 0 8px;
  img { height: 48px; width: auto; }
`,O=n.p`
  margin: 0 0 24px;
  color: #6b7280;
  font-size: 15px;
`,P=n.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`,x=n.label`
  font-size: 13px;
  color: #6b7280;
`,m=n.input`
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
`,T=n.div`
  margin-top: 18px;
  color: #6b7280;
  font-size: 14px;
  a {
    color: #4f46e5;
    font-weight: 700;
  }
`;export{I as default};
