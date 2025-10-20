import{r as n,b as N,u as z,j as e,d as i}from"./index-B92ulgNv.js";import{P as Y,b as B,j as o,S as F,g as K,T as $}from"./UI-ktOMpaj3.js";import{g as G,l as I,a as O}from"./savedMarketing-BJQkugXz.js";import{t as _,n as u}from"./utils-BiUlBUyf.js";import{d as q}from"./format-Do6vjlY3.js";import{u as H}from"./useConfirmDialog-Coomt2WM.js";import"./ConfirmDialog-B0Nr7O58.js";function ie(){const[a,x]=n.useState([]),[l,s]=n.useState(0),v=20,[h,y]=n.useState(0),[p,b]=n.useState(""),[c,g]=n.useState(""),[d,m]=n.useState(""),[f,S]=n.useState(""),[k,A]=n.useState(null),{warning:D}=N(),w=z(),{confirm:R,dialog:E}=H({confirmLabel:"삭제",cancelLabel:"취소",tone:"danger"}),M=n.useMemo(()=>G(),[]);n.useEffect(()=>{let t=!1;return(async()=>{try{A(null);const r=await I({page:l,size:v,platform:p||void 0,from:c||void 0,to:d||void 0,q:f||void 0});if(t)return;const j=r.content??[];x(j.map(W)),y(r.totalPages??1)}catch(r){if(t)return;x(M),y(1),A(_(r,"서버에서 저장 내역을 불러오지 못했습니다. 로컬 데이터를 표시합니다."))}})(),()=>{t=!0}},[l,v,p,c,d,f,M]);const C=a.length>0,L=async()=>{await R({title:"저장 내역을 모두 삭제할까요?",message:"로컬에 저장된 마케팅 캡션이 모두 삭제됩니다. 되돌릴 수 없습니다."})&&(O(),x([]),D("저장 내역을 모두 삭제했습니다."))};return e.jsxs(Y,{children:[E,e.jsxs(B,{children:[e.jsxs("div",{children:[e.jsx("h2",{children:"저장 내역"}),e.jsx("p",{children:"Summary에서 저장한 캡션 목록입니다."})]}),e.jsxs("div",{style:{display:"flex",gap:12},children:[e.jsx(o,{as:"a",href:"/marketing",children:"마케팅 홈"}),C&&e.jsx(o,{as:"button","data-variant":"danger",onClick:()=>void L(),children:"전체 삭제"})]})]}),e.jsxs(F,{children:[e.jsxs(U,{children:[e.jsxs("select",{value:p,onChange:t=>{s(0),b(t.target.value)},children:[e.jsx("option",{value:"",children:"전체 플랫폼"}),e.jsx("option",{value:"INSTAGRAM",children:"인스타그램"}),e.jsx("option",{value:"NAVER_BLOG",children:"블로그"}),e.jsx("option",{value:"KAKAO_CHANNEL",children:"카카오 채널"})]}),e.jsx("input",{type:"date",lang:"ko-KR",inputMode:"numeric",pattern:"^\\\\d{4}-\\\\d{2}-\\\\d{2}$",placeholder:"YYYY-MM-DD",value:c,onFocus:t=>T(t.currentTarget),onChange:t=>{s(0),g(u(t.target.value))},onBlur:t=>{const r=u(t.currentTarget.value);r!==c&&g(r)}}),e.jsx("span",{children:"~"}),e.jsx("input",{type:"date",lang:"ko-KR",inputMode:"numeric",pattern:"^\\\\d{4}-\\\\d{2}-\\\\d{2}$",placeholder:"YYYY-MM-DD",value:d,onFocus:t=>T(t.currentTarget),onChange:t=>{s(0),m(u(t.target.value))},onBlur:t=>{const r=u(t.currentTarget.value);r!==d&&m(r)}}),e.jsxs(X,{children:[e.jsx("input",{placeholder:"본문 검색",value:f,onChange:t=>S(t.target.value),onKeyDown:t=>{t.key==="Enter"&&s(0)}}),e.jsx(o,{as:"button",onClick:()=>s(0),children:"검색"})]}),e.jsx(o,{as:"button",onClick:()=>{b(""),g(""),m(""),S(""),s(0)},children:"초기화"})]}),k?e.jsx(Q,{role:"alert",children:k}):null,C?e.jsxs(e.Fragment,{children:[e.jsx(K,{children:e.jsxs($,{style:{minWidth:720},children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"저장일"}),e.jsx("th",{children:"플랫폼"}),e.jsx("th",{children:"본문 요약"})]})}),e.jsx("tbody",{children:a.map(t=>{const r=q(t.createdAt,{includeWeekday:!0}),j=r==="—"?new Date(t.createdAt).toLocaleString("ko-KR",{hour12:!1}):r;return e.jsxs("tr",{className:"row",onClick:()=>w(`/marketing/saved/${t.id}`),title:"상세 보기",style:{cursor:"pointer"},children:[e.jsx("td",{children:j}),e.jsx("td",{children:V(t.platform)}),e.jsx("td",{className:"mono",children:t.body.slice(0,140)})]},t.id)})})]})}),e.jsxs(Z,{children:[e.jsx(P,{onClick:()=>s(t=>Math.max(0,t-1)),disabled:l<=0,children:"이전"}),e.jsxs("span",{children:[l+1," / ",Math.max(1,h)]}),e.jsx(P,{onClick:()=>s(t=>Math.min(h-1,t+1)),disabled:l>=h-1,children:"다음"})]})]}):e.jsxs(e.Fragment,{children:[e.jsx(J,{children:"아직 저장된 항목이 없습니다."}),e.jsx("div",{style:{display:"flex",gap:8,justifyContent:"flex-start",marginTop:8},children:e.jsx(o,{as:"a",href:"/marketing",children:"마케팅 홈으로"})})]})]})]})}function T(a){try{a.showPicker?.()}catch{}}function V(a){switch(a){case"INSTAGRAM":return"인스타그램";case"NAVER_BLOG":return"블로그";default:return"카카오 채널"}}function W(a){return{id:String(a.id),createdAt:a.createdAt?new Date(a.createdAt).getTime():Date.now(),platform:a.platform,speechStyle:a.speechStyle,tone:a.tone??void 0,title:a.title??void 0,body:a.body,tags:Array.isArray(a.tags)?a.tags:[]}}const Q=i.p`
  color: #b91c1c;
  font-size: 13px;
  margin: 0 0 10px;
`,J=i.div`
  color: ${({theme:a})=>a.colors.textMuted};
  font-size: 13px;
`,U=i.div`
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 10px;
  select,
  input[type="date"] {
    height: 36px;
    border: 1px solid ${({theme:a})=>a.colors.border};
    border-radius: 10px;
    background: #fff;
    padding: 0 10px;
    font-size: 13px;
  }
`,X=i.div`
  display: flex;
  gap: 6px;
  align-items: center;
  input {
    height: 36px;
    border: 1px solid ${({theme:a})=>a.colors.border};
    border-radius: 10px;
    background: #fff;
    padding: 0 10px;
    font-size: 13px;
  }
`,Z=i.div`
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: flex-end;
  margin-top: 10px;
`,P=i(o)`
  height: 40px;
  padding: 0 16px;
  font-size: 14px;
`;export{ie as default};
