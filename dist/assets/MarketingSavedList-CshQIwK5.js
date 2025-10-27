import{j as e,d as u,r as i,u as N,c as F}from"./index-B0K7mn4q.js";import{P as R,b as E,j as d,S as L,g as z,T as B}from"./UI-Cj3YhchZ.js";import{d as K}from"./format-DW-Kl_C3.js";import{g as G,l as Q,a as q}from"./savedMarketing-QiWyiSGP.js";import{u as O}from"./useConfirmDialog-DCN8mg1d.js";import{t as $,n as M}from"./utils-D2trpR9j.js";import"./ConfirmDialog-ClQeXE4D.js";function I({rows:t,page:r,totalPages:s,platform:l,from:g,to:v,query:x,error:p,confirmDialog:m,onPlatformChange:y,onFromChange:c,onToChange:h,onQueryChange:f,onSearch:j,onReset:k,onClearAll:P,onOpenDetail:T,onPrevPage:A,onNextPage:C}){const S=t.length>0;return e.jsxs(R,{children:[m,e.jsxs(E,{children:[e.jsxs("div",{children:[e.jsx("h2",{children:"저장 내역"}),e.jsx("p",{children:"Summary에서 저장한 캡션 목록입니다."})]}),e.jsxs("div",{style:{display:"flex",gap:12},children:[e.jsx(d,{as:"a",href:"/marketing",children:"마케팅 홈"}),S?e.jsx(d,{as:"button","data-variant":"danger",onClick:P,children:"전체 삭제"}):null]})]}),e.jsxs(L,{children:[e.jsxs(Y,{children:[e.jsxs("select",{value:l,onChange:a=>y(a.target.value),children:[e.jsx("option",{value:"",children:"전체 플랫폼"}),e.jsx("option",{value:"INSTAGRAM",children:"인스타그램"}),e.jsx("option",{value:"NAVER_BLOG",children:"블로그"}),e.jsx("option",{value:"KAKAO_CHANNEL",children:"카카오 채널"})]}),e.jsx("input",{type:"date",lang:"ko-KR",value:g,onFocus:a=>D(a.currentTarget),onChange:a=>c(a.target.value),onBlur:a=>c(a.currentTarget.value)}),e.jsx("span",{children:"~"}),e.jsx("input",{type:"date",lang:"ko-KR",value:v,onFocus:a=>D(a.currentTarget),onChange:a=>h(a.target.value),onBlur:a=>h(a.currentTarget.value)}),e.jsxs(J,{children:[e.jsx("input",{placeholder:"본문 검색",value:x,onChange:a=>f(a.target.value),onKeyDown:a=>{a.key==="Enter"&&j()}}),e.jsx(d,{as:"button",onClick:j,children:"검색"})]}),e.jsx(d,{as:"button",onClick:k,children:"초기화"})]}),p?e.jsx(H,{role:"alert",children:p}):null,S?e.jsxs(e.Fragment,{children:[e.jsx(z,{children:e.jsxs(B,{style:{minWidth:720},children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"저장일"}),e.jsx("th",{children:"플랫폼"}),e.jsx("th",{children:"본문 요약"})]})}),e.jsx("tbody",{children:t.map(a=>e.jsxs("tr",{className:"row",onClick:()=>T(a.id),title:"상세 보기",style:{cursor:"pointer"},children:[e.jsx("td",{children:V(a.createdAt)}),e.jsx("td",{children:_(a.platform)}),e.jsx("td",{className:"mono",children:a.body.slice(0,140)})]},a.id))})]})}),e.jsxs(U,{children:[e.jsx(w,{onClick:A,disabled:r<=0,children:"이전"}),e.jsxs("span",{children:[r+1," / ",Math.max(1,s)]}),e.jsx(w,{onClick:C,disabled:r>=s-1,children:"다음"})]})]}):e.jsxs(e.Fragment,{children:[e.jsx(W,{children:"아직 저장된 항목이 없습니다."}),e.jsx("div",{style:{display:"flex",gap:8,justifyContent:"flex-start",marginTop:8},children:e.jsx(d,{as:"a",href:"/marketing",children:"마케팅 홈으로"})})]})]})]})}function D(t){try{t.showPicker?.()}catch{}}function V(t){const r=K(t,{includeWeekday:!0});if(r==="—")try{return new Date(t).toLocaleString("ko-KR",{hour12:!1})}catch{return"-"}return r}function _(t){switch(t){case"INSTAGRAM":return"인스타그램";case"NAVER_BLOG":return"블로그";default:return"카카오 채널"}}const H=u.p`
  color: #b91c1c;
  font-size: 13px;
  margin: 0 0 10px;
`,W=u.div`
  color: ${({theme:t})=>t.colors.textMuted};
  font-size: 13px;
`,Y=u.div`
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 10px;
  select,
  input[type="date"] {
    height: 36px;
    border: 1px solid ${({theme:t})=>t.colors.border};
    border-radius: 10px;
    background: #fff;
    padding: 0 10px;
    font-size: 13px;
  }
`,J=u.div`
  display: flex;
  gap: 6px;
  align-items: center;
  input {
    height: 36px;
    border: 1px solid ${({theme:t})=>t.colors.border};
    border-radius: 10px;
    background: #fff;
    padding: 0 10px;
    font-size: 13px;
  }
`,U=u.div`
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: flex-end;
  margin-top: 10px;
`,w=u(d)`
  height: 40px;
  padding: 0 16px;
  font-size: 14px;
`;function X(t){return{id:String(t.id),createdAt:t.createdAt?new Date(t.createdAt).getTime():Date.now(),platform:t.platform,speechStyle:t.speechStyle,tone:t.tone??void 0,title:t.title??void 0,body:t.body,tags:Array.isArray(t.tags)?t.tags:[]}}function Z(){const[t,r]=i.useState([]),[s,l]=i.useState(0),[g,v]=i.useState(0),[x,p]=i.useState(""),[m,y]=i.useState(""),[c,h]=i.useState(""),[f,j]=i.useState(""),[k,P]=i.useState(null),T=N(),{warning:A}=F(),{confirm:C,dialog:S}=O({confirmLabel:"삭제",cancelLabel:"취소",tone:"danger"}),a=i.useMemo(()=>G(),[]);return i.useEffect(()=>{let n=!1;return(async()=>{try{P(null);const o=await Q({page:s,size:20,platform:x||void 0,from:m||void 0,to:c||void 0,q:f||void 0});if(n)return;const b=o.content??[];r(b.map(X)),v(o.totalPages??1)}catch(o){if(n)return;r(a),v(1),P($(o,"서버에서 저장 내역을 불러오지 못했습니다. 로컬 데이터를 표시합니다."))}})(),()=>{n=!0}},[s,x,m,c,f,a]),{state:{rows:t,page:s,totalPages:g,platform:x,from:m,to:c,query:f,error:k,confirmDialog:S},handlers:{updatePlatform:n=>{l(0),p(n)},updateFrom:n=>{const o=M(n);l(0),y(o)},updateTo:n=>{const o=M(n);l(0),h(o)},updateQuery:n=>{j(n)},resetFilters:()=>{p(""),y(""),h(""),j(""),l(0)},goToPage:n=>{l(o=>{const b=Math.max(0,Math.min(n,Math.max(0,g-1)));return b===o?o:b})},goPrevPage:()=>l(n=>Math.max(0,n-1)),goNextPage:()=>l(n=>Math.min(g-1,n+1)),openDetail:n=>{T(`/marketing/saved/${n}`)},clearAll:async()=>{await C({title:"저장 내역을 모두 삭제할까요?",message:"로컬에 저장된 마케팅 캡션이 모두 삭제됩니다. 되돌릴 수 없습니다."})&&(q(),r([]),A("저장 내역을 모두 삭제했습니다."))}}}}function fe(){const{state:t,handlers:r}=Z();return e.jsx(I,{rows:t.rows,page:t.page,totalPages:t.totalPages,platform:t.platform,from:t.from,to:t.to,query:t.query,error:t.error,confirmDialog:t.confirmDialog,onPlatformChange:r.updatePlatform,onFromChange:s=>r.updateFrom(s),onToChange:s=>r.updateTo(s),onQueryChange:r.updateQuery,onSearch:()=>r.goToPage(0),onReset:r.resetFilters,onClearAll:()=>{r.clearAll()},onOpenDetail:r.openDetail,onPrevPage:r.goPrevPage,onNextPage:r.goNextPage})}export{fe as default};
