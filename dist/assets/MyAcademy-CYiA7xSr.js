import{f as z,g as K,u as Q,b as X,r as c,j as e,n as Y,o as Z,d as a}from"./index-WIHyZsXz.js";async function _(){return z("/api/account/academy")}async function ee(r){return z("/api/account/academy",{method:"PUT",body:JSON.stringify(r)})}async function ne(r){await z("/api/account/user",{method:"PUT",body:JSON.stringify(r)})}function ue(){const{user:r,validate:h,logout:j}=K(),y=Q(),g=X(),[t,o]=c.useState(null),[$,D]=c.useState(!0),[k,s]=c.useState(null),[f,H]=c.useState(r?.name??""),[x,J]=c.useState(r?.phone??""),E=c.useMemo(()=>r?.phone??"",[r?.phone]),[m,V]=c.useState(""),[v,q]=c.useState(!1),[C,N]=c.useState(0);c.useEffect(()=>{const n=setInterval(()=>N(i=>i>0?i-1:0),1e3);return()=>clearInterval(n)},[]),c.useEffect(()=>{let n=!0;return(async()=>{try{const i=await _();if(!n)return;o(i)}catch(i){o({id:0,name:"",bizNo:"",address:"",representativeName:"",phone:"",billingEmail:"",category1:"",category2:"",categoryEtc:""}),s(i?.message||"학원 정보를 불러오지 못했습니다. 정보를 입력 후 저장해 주세요.")}finally{D(!1)}})(),()=>{n=!1}},[]);function b(n){const i=(n||"").replace(/\D/g,"");return i.length===11&&i.startsWith("010")?`010-${i.slice(3,7)}-${i.slice(7)}`:null}const w=c.useMemo(()=>(b(x)??x)!==E,[x,E]);async function L(){s(null);const n=b(x);if(!n){s("휴대폰 번호 형식을 확인해 주세요 (010-1234-5678)");return}try{await Y(n),N(60)}catch(i){s(i?.message||"인증코드 요청에 실패했습니다.")}}async function W(){s(null);const n=b(x);if(!n){s("휴대폰 번호 형식을 확인해 주세요");return}if(!m.trim()){s("인증코드를 입력해 주세요");return}try{const i=await Z(n,m.trim());q(!!i.success),i.success||s("인증코드가 올바르지 않습니다.")}catch(i){s(i?.message||"전화번호 인증에 실패했습니다.")}}async function G(){s(null);try{const n={};f&&f!==r?.name&&(n.name=f),w&&(n.phone=b(x)??x),await ne(n),await h(),g.success("프로필이 저장되었습니다.")}catch(n){s(n?.message||"프로필 저장에 실패했습니다.")}}async function F(){if(t){s(null);try{const n={id:t.id,name:t.name,bizNo:t.bizNo,address:t.address,representativeName:t.representativeName,phone:t.phone,billingEmail:t.billingEmail,category1:t.category1,category2:t.category2,categoryEtc:t.categoryEtc},i=await ee(n);o(i),g.success("학원 정보가 저장되었습니다.")}catch(n){s(n?.message||"학원 정보 저장에 실패했습니다.")}}}return $?e.jsx(P,{children:e.jsxs(S,{children:[e.jsx("h1",{children:"내 학원 정보"}),e.jsx("p",{children:"불러오는 중…"})]})}):e.jsxs(P,{children:[e.jsxs(S,{children:[e.jsxs("div",{children:[e.jsx("h1",{children:"내 학원 정보"}),e.jsx("p",{children:"계정 및 학원 정보를 확인하고 수정하세요."})]}),e.jsx(re,{children:e.jsx(ie,{type:"button",onClick:()=>{j(),y("/login",{replace:!0})},children:"로그아웃"})})]}),k&&e.jsx(ce,{children:k}),e.jsxs(A,{children:[e.jsx(B,{children:"계정 정보"}),e.jsxs(l,{children:[e.jsx(d,{children:"담당자 성함"}),e.jsx(p,{children:e.jsx(u,{value:f,onChange:n=>H(n.target.value),placeholder:"홍길동"})})]}),e.jsxs(l,{children:[e.jsx(d,{children:"휴대폰 번호"}),e.jsxs(p,{children:[e.jsxs(te,{children:[e.jsx(u,{style:{flex:1},value:x,onChange:n=>J(n.target.value),placeholder:"010-1234-5678"}),e.jsx(I,{type:"button",disabled:C>0,onClick:L,children:C>0?`${C}s`:"코드요청"}),e.jsx(ae,{value:m,onChange:n=>V(n.target.value),placeholder:"6자리"}),e.jsx(I,{type:"button",onClick:W,children:"인증"})]}),w&&!v&&e.jsx(O,{children:"번호 변경 시 인증이 필요합니다."}),v&&e.jsx(O,{success:!0,children:"인증 완료"})]})]}),e.jsx(M,{children:e.jsx(T,{onClick:G,disabled:w&&!v,children:"프로필 저장"})})]}),t&&e.jsxs(A,{children:[e.jsx(B,{children:"학원 정보"}),e.jsxs(l,{children:[e.jsx(d,{children:"학원명"}),e.jsx(p,{children:e.jsx(u,{value:t.name,onChange:n=>o({...t,name:n.target.value}),placeholder:"오픈AI어학원"})})]}),e.jsxs(l,{children:[e.jsx(d,{children:"카테고리"}),e.jsx(p,{children:e.jsx(R,{children:["교과목","예체능","기타"].map(n=>e.jsx(U,{type:"button","data-active":t.category1===n,onClick:()=>o({...t,category1:n,category2:void 0,categoryEtc:void 0}),children:n},n))})})]}),t.category1&&t.category1!=="기타"&&e.jsxs(l,{children:[e.jsx(d,{children:"세부 카테고리 (선택)"}),e.jsx(p,{children:e.jsx(R,{children:le(t.category1).map(n=>e.jsx(U,{type:"button","data-active":t.category2===n,onClick:()=>o({...t,category2:t.category2===n?void 0:n}),children:n},n))})})]}),t.category1==="기타"&&e.jsxs(l,{children:[e.jsx(d,{children:"기타 분류"}),e.jsx(p,{children:e.jsx(se,{children:e.jsx(oe,{value:t.categoryEtc??"",onChange:n=>o({...t,categoryEtc:n.target.value}),placeholder:"예: 코딩, 바둑 등"})})})]}),e.jsxs(l,{children:[e.jsx(d,{children:"주소"}),e.jsx(p,{children:e.jsx(u,{value:t.address??"",onChange:n=>o({...t,address:n.target.value}),placeholder:"도로명 주소"})})]}),e.jsxs(l,{children:[e.jsx(d,{children:"대표자명"}),e.jsx(p,{children:e.jsx(u,{value:t.representativeName??"",onChange:n=>o({...t,representativeName:n.target.value}),placeholder:"대표자명"})})]}),e.jsxs(l,{children:[e.jsx(d,{children:"학원 대표번호"}),e.jsx(p,{children:e.jsx(u,{value:t.phone??"",onChange:n=>o({...t,phone:n.target.value}),placeholder:"021234567"})})]}),e.jsxs(l,{children:[e.jsx(d,{children:"청구용 이메일"}),e.jsx(p,{children:e.jsx(u,{value:t.billingEmail??"",onChange:n=>o({...t,billingEmail:n.target.value}),placeholder:"billing@example.com"})})]}),e.jsxs(l,{children:[e.jsx(d,{children:"사업자번호"}),e.jsx(p,{children:e.jsx(u,{value:de(t.bizNo??""),onChange:n=>o({...t,bizNo:pe(n.target.value)}),placeholder:"###-##-#####"})})]}),e.jsx(M,{children:e.jsx(T,{onClick:F,children:"학원 정보 저장"})})]})]})}const P=a.div`
  display: grid;
  gap: 16px;
`,S=a.div`
  display: flex; align-items: center; justify-content: space-between; gap: 12px;
  h1 { margin: 0; font-size: 24px; color: #111827; }
  p { margin: 4px 0 0; color: #6b7280; }
`,A=a.div`
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  background: linear-gradient(180deg, #ffffff 0%, #f9fafb 100%);
  padding: 16px;
  display: grid;
  gap: 12px;
  box-shadow: 0 6px 18px rgba(15,23,42,0.04);
`,l=a.div`
  display: grid; grid-template-columns: 120px 1fr; gap: 12px; align-items: center;
  @media (max-width: 640px) { grid-template-columns: 1fr; gap: 6px; }
`,d=a.div`
  font-size: 12px; color: #6b7280; letter-spacing: .02em; text-transform: none;
`,p=a.div`
  font-size: 15px; color: #111827; font-weight: 600;
`;a.p`
  margin: 0; color: #9ca3af; font-size: 12px;
`;const B=a.h3`
  margin: 0 0 8px; color: #374151; font-size: 14px;
`,u=a.input`
  height: 44px; border: 1px solid #e5e7eb; border-radius: 10px; padding: 0 12px; font-size: 14px; background: #ffffff; width: 100%;
  &:focus { outline: none; box-shadow: 0 0 0 3px rgba(79,70,229,0.16); }
`,te=a.div`
  display: flex; gap: 8px; align-items: center;
`,I=a.button`
  height: 44px; padding: 0 14px; border-radius: 10px; border: 1px solid #e5e7eb; background: #f8fafc; font-weight: 700; color: #374151;
`,ae=a.input`
  height: 44px; width: 90px; border: 1px solid #e5e7eb; border-radius: 10px; padding: 0 10px; font-size: 14px; text-align: center;
`,M=a.div`
  display: flex; justify-content: flex-end; gap: 8px; margin-top: 6px;
`,T=a.button`
  height: 44px; padding: 0 18px; border-radius: 10px; border: 1px solid transparent; background: #4f46e5; color: #fff; font-weight: 700;
  &:disabled { opacity: 0.6; }
`,ie=a.button`
  height: 40px; padding: 0 14px; border-radius: 10px; border: 1px solid #e5e7eb; background: #ffffff; font-weight: 700; color: #374151;
  &:hover { background: #f8fafc; }
`,re=a.div`
  display: flex; gap: 8px; align-items: center;
`,O=a.div`
  margin-top: 6px; font-size: 12px; color: ${({success:r})=>r?"#065f46":"#6b7280"};
`,R=a.div`
  display: flex; gap: 8px; flex-wrap: wrap;
`,U=a.button`
  height: 36px; padding: 0 12px; border-radius: 999px; border: 1px solid #e5e7eb; background: #f9fafb; color: #374151; font-weight: 600;
  &[data-active='true'] { background: #4f46e5; color: #fff; border-color: transparent; }
`,se=a.div`
  display: inline-flex; align-items: center; min-height: 36px; padding: 0 12px; border-radius: 999px; border: 1px solid #e5e7eb; background: #f9fafb;
  &:focus-within { background: #eef2ff; box-shadow: 0 0 0 3px rgba(79,70,229,0.18); }
`,oe=a.input`
  border: none; background: transparent; outline: none; font-size: 14px; width: 100%;
`,ce=a.div`
  color: #b91c1c; background: #fee2e2; border-radius: 10px; padding: 10px 12px; font-size: 14px;
`;function le(r){return r==="교과목"?["국어","수학","사회","과학","영어"]:r==="예체능"?["스포츠","미술","음악"]:[]}function de(r){const h=(r||"").replace(/\D/g,"").slice(0,10),j=h.slice(0,3),y=h.slice(3,5),g=h.slice(5,10);return[j,y,g].filter(Boolean).join("-")}function pe(r){return(r||"").replace(/\D/g,"").slice(0,10)}export{ue as default};
