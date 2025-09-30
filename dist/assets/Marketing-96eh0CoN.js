import{r as a,u as me,g as ge,j as t,a as xe,w as q,q as _,h as K,d as o,S as se}from"./index-CJzRppoi.js";import{E as w}from"./EmptyPlaceholder-BCvoQRx5.js";import{I as fe}from"./InfoBanner-lPRSlCHw.js";import{l as $e,f as be}from"./courses-l4AOqPcF.js";function pt(){const[e,l]=a.useState([]),[c,d]=a.useState(!0),[g,E]=a.useState(null),[z,P]=a.useState(""),[p,M]=a.useState([]),[h,k]=a.useState(""),[u,D]=a.useState(""),[x,f]=a.useState(null),[R,B]=a.useState(!1),oe=!1,ne=null,[ie,H]=a.useState(!1),[$,L]=a.useState({}),[G,Y]=a.useState(!0),[re,ae]=a.useState(!1),le=me(),{error:Q,warning:N}=ge();a.useEffect(()=>{let s=!1;async function i(){try{d(!0),E(null);const n=await $e({status:"IN_PROGRESS",size:500});s||l(n.content??[])}catch(n){console.error(n),s||E("수업 목록을 불러오는 데 실패했습니다.")}finally{s||d(!1)}}return i(),()=>{s=!0}},[]);const ce=a.useMemo(()=>{const s=z.trim().toLowerCase();return s?e.filter(i=>i.title.toLowerCase().includes(s)):e},[e,z]),m=a.useMemo(()=>e.filter(s=>p.includes(s.id)),[e,p]),de=a.useMemo(()=>{const s=[];for(const i of m){const n=$[i.id]||[];for(const r of n){const T=O(r);s.push({date:r.recordDate,content:T,courseTitle:i.title})}}return s.sort((i,n)=>i.date.localeCompare(n.date)),s},[$,m]),b=a.useMemo(()=>m.map(s=>{const i=($[s.id]||[]).slice().sort((n,r)=>n.recordDate.localeCompare(r.recordDate));return{course:s,rows:i}}),[$,m]),I=a.useMemo(()=>b.reduce((s,i)=>s+i.rows.length,0),[b]),F=a.useMemo(()=>ve(h,u),[h,u]);function V(s){M(i=>i.includes(s)?i.filter(r=>r!==s):i.length>=3?i:[...i,s])}function W(s){const i=s.getFullYear(),n=String(s.getMonth()+1).padStart(2,"0"),r=String(s.getDate()).padStart(2,"0");return`${i}-${n}-${r}`}function j(s,i,n){k(W(i)),D(W(n)),f(s)}function y(s){const i=new Date,n=new Date(i.getFullYear(),i.getMonth(),i.getDate());if(s==="7d"){const r=new Date(n);r.setDate(n.getDate()-6),j(s,r,n)}else if(s==="30d"){const r=new Date(n);r.setDate(n.getDate()-29),j(s,r,n)}else if(s==="thisMonth"){const r=new Date(n.getFullYear(),n.getMonth(),1);j(s,r,n)}else if(s==="lastMonth"){const r=new Date(n.getFullYear(),n.getMonth()-1,1),T=new Date(n.getFullYear(),n.getMonth(),0);j(s,r,T)}}async function pe(){if(!p.length){N("수업을 하나 이상 선택해주세요.");return}if(!h||!u){N("조회 기간(시작/종료일)을 선택해주세요.");return}if(h>u){Q("조회 기간이 올바르지 않습니다. 시작일이 종료일보다 늦습니다.");return}try{H(!0),B(!0);const s=await Promise.all(p.map(async n=>[n,await be(n,{from:h,to:u})])),i={};for(const[n,r]of s)i[n]=r;L(i)}catch(s){console.error(s),Q("수업 내역을 불러오지 못했습니다.")}finally{B(!1)}}function he(){M([]),P(""),k(""),D(""),f(null),H(!1),L({})}async function ue(){if(!I){N("먼저 조회를 실행해주세요.");return}le("/marketing/generating",{state:{items:de,tone:"WARM_VIVID",speechStyle:"SEUMNIDA",platformChoice:"INSTAGRAM"}})}return t.jsxs(Ce,{children:[t.jsxs(Se,{children:[t.jsxs(xe,{children:[t.jsxs("div",{children:[t.jsx("h2",{children:"마케팅"}),t.jsx("p",{children:"수업 기록을 모아 AI 요약과 콘텐츠로 이어가세요."})]}),t.jsxs(ze,{children:[t.jsx(q,{to:"/marketing/saved",children:"저장 내역"}),t.jsx(q,{to:"/classes",children:"수업 관리"}),!G&&re?t.jsx(_,{as:"button",type:"button",onClick:()=>Y(!0),children:"도움말 보기"}):null]})]}),G?t.jsx(fe,{title:"AI 마케팅 요약 시작 가이드",description:"수업 기록을 선택하고 조회한 뒤 요약 만들기로 넘어가세요. 1분 안에 결과를 확인할 수 있어요.",tips:["좌측에서 최대 3개의 수업을 선택하고 조회 기간을 정해주세요.","조회 결과가 아래에 나타나면 내용을 확인한 뒤 필요하면 기간을 다시 조정해보세요.","요약 만들기 버튼을 누르면 AI 분석 화면으로 이동해 콘텐츠 초안을 받을 수 있어요."],onClose:()=>{Y(!1),ae(!0)}}):null]}),t.jsxs(Me,{children:[t.jsx(ke,{children:t.jsxs(Ne,{children:[t.jsxs(U,{children:[t.jsx(J,{children:"수업 내역 조회"}),t.jsx(X,{children:"수업을 선택하고 기간을 지정해 기록을 불러올 수 있어요."})]}),t.jsxs(Re,{children:[t.jsxs(v,{children:[t.jsx(Fe,{children:t.jsx(Te,{id:"course-search",placeholder:"수업을 검색해 선택하세요",value:z,onChange:s=>P(s.target.value)})}),c?t.jsx(Z,{children:"수업을 불러오는 중입니다…"}):null,g?t.jsx(Ae,{children:g}):null]}),t.jsxs(v,{children:[t.jsxs(Ee,{children:[t.jsx(A,{children:"수업 선택"}),t.jsxs(Pe,{children:[t.jsxs("span",{children:["선택 ",p.length,"/3"]}),p.length>0?t.jsx(Qe,{type:"button",onClick:()=>M([]),children:"전체 해제"}):null]})]}),m.length>0?t.jsx(Ge,{children:m.map(s=>t.jsxs(Ye,{children:[t.jsx("span",{className:"t",children:s.title}),t.jsx("button",{type:"button","aria-label":"제거",onClick:()=>V(s.id),children:"×"})]},s.id))}):null,t.jsx(Le,{children:t.jsx(Be,{role:"list","aria-label":"수업 목록",children:ce.map(s=>{const i=p.includes(s.id),n=!i&&p.length>=3;return t.jsxs(He,{type:"button",role:"listitem","data-selected":i||void 0,"data-disabled":n||void 0,onClick:()=>{(!n||i)&&V(s.id)},children:[t.jsx("div",{className:"title",children:s.title}),t.jsx("div",{className:"meta",children:je(s)})]},s.id)})})}),p.length?null:t.jsx(Z,{children:"최대 3개까지 선택할 수 있어요."})]}),t.jsxs(v,{children:[t.jsx(A,{children:"빠른 기간 선택"}),t.jsxs(Ve,{children:[t.jsx(C,{type:"button","data-active":x==="7d",onClick:()=>y("7d"),children:"최근 7일"}),t.jsx(C,{type:"button","data-active":x==="30d",onClick:()=>y("30d"),children:"최근 30일"}),t.jsx(C,{type:"button","data-active":x==="thisMonth",onClick:()=>y("thisMonth"),children:"이번 달"}),t.jsx(C,{type:"button","data-active":x==="lastMonth",onClick:()=>y("lastMonth"),children:"지난 달"})]})]}),t.jsxs(v,{children:[t.jsx(A,{children:"직접 선택"}),t.jsxs(We,{children:[t.jsxs(ee,{children:[t.jsx("span",{children:"시작일"}),t.jsx(te,{type:"date",value:h,onChange:s=>{k(s.target.value),f(null)}})]}),t.jsxs(ee,{children:[t.jsx("span",{children:"종료일"}),t.jsx(te,{type:"date",value:u,onChange:s=>{D(s.target.value),f(null)}})]})]}),t.jsxs(qe,{children:[F.label,F.days?` · 총 ${F.days}일`:null]})]})]}),t.jsx(_e,{children:t.jsxs(Ke,{children:[t.jsx(K,{type:"button",onClick:pe,disabled:R,children:R?"조회 중...":"조회하기"}),t.jsx(_,{as:"button",type:"button",onClick:he,children:"초기화"})]})})]})}),t.jsx(De,{children:t.jsxs(Ie,{children:[t.jsxs(U,{children:[t.jsx(J,{children:"조회 결과"}),t.jsx(X,{children:"선택한 수업과 기간에 해당하는 기록이 표시돼요."})]}),t.jsx(Oe,{children:R?t.jsx(w,{title:"조회 중입니다..."}):ie?b.length?I===0?t.jsx(w,{title:"선택한 기간에 해당하는 수업 기록이 없습니다."}):t.jsxs(Ue,{children:[t.jsxs(Je,{children:[t.jsxs("span",{children:["총 ",I,"건"]}),h&&u?t.jsxs("span",{children:[h," ~ ",u]}):null]}),t.jsx(Xe,{children:b.map(({course:s,rows:i})=>t.jsxs(Ze,{children:[t.jsxs(et,{children:[t.jsx("span",{className:"title",children:s.title}),t.jsxs("span",{className:"count",children:[i.length,"건"]})]}),t.jsx(tt,{children:i.map(n=>t.jsxs(st,{children:[t.jsx(ot,{children:S(n.recordDate)}),t.jsx(nt,{children:O(n)})]},`${s.id}:${n.id}`))})]},s.id))})]}):t.jsx(w,{title:"선택한 수업이 없어요. 왼쪽에서 수업을 선택해주세요."}):t.jsx(w,{title:"수업을 선택하고 기간을 설정한 후 조회해주세요."})}),t.jsx(it,{children:t.jsxs(rt,{children:[ne,t.jsx(K,{type:"button",onClick:ue,disabled:oe,children:"요약 만들기"})]})})]})})]})]})}function je(e){const l=e.courseTime||ye(e.startTime,e.endTime),c=e.nextClassDate?`다음 수업 ${S(e.nextClassDate)}`:"";return[l,c].filter(Boolean).join(" · ")||"일정 정보 없음"}function ye(e,l){if(!e&&!l)return"";const c=e?e.slice(0,5):"?",d=l?l.slice(0,5):"?";return`${c} ~ ${d}`}function S(e){if(!e)return"-";const[l,c,d]=e.split("-");return!l||!c||!d?e:`${Number(l)}년 ${Number(c)}월 ${Number(d)}일`}function we(e,l){if(!e||!l)return null;try{const c=new Date(e),d=new Date(l);if(Number.isNaN(c.getTime())||Number.isNaN(d.getTime()))return null;const g=Math.abs(d.getTime()-c.getTime());return Math.floor(g/(1e3*60*60*24))+1}catch{return null}}function ve(e,l){if(!e||!l)return{label:"기간을 선택하면 조회 안내가 표시돼요.",days:null};const c=`${S(e)} ~ ${S(l)}`,d=we(e,l);return{label:c,days:d}}function O(e){return e.content?.trim()||e.notes?.trim()||e.topic?.trim()||"(기록된 내용이 없습니다)"}const Ce=o.div`
  height: calc(100vh - 48px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
`,Se=o.div`
  padding: 0 ${e=>e.theme.spacing.xs};
  display: grid;
  gap: ${e=>e.theme.spacing.sm};
`,ze=o.div`
  display: inline-flex;
  gap: ${e=>e.theme.spacing.sm};
  flex-wrap: wrap;
  justify-content: flex-end;
`,Me=o.div`
  display: grid;
  gap: ${e=>e.theme.spacing.xl};
  grid-template-columns: 1fr;
  flex: 1;
  min-height: 0;
  overflow: hidden;
  @media (min-width: 1120px) {
    grid-template-columns: 360px 1fr;
  }
`,ke=o.div`
  display: flex;
  min-height: 0;
  overflow: hidden;
`,De=o.div`
  display: grid;
  gap: ${e=>e.theme.spacing.xl};
  min-height: 0;
`,Re=o.div`
  flex: 1;
  min-height: 0;
  overflow: auto;
  display: grid;
  gap: ${e=>e.theme.spacing.xl};
`,Ne=o(se)`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: ${e=>e.theme.spacing.xl};
`,Ie=o(se)`
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: ${e=>e.theme.spacing.xl};
`,U=o.div`
  display: grid;
  gap: ${e=>e.theme.spacing.xs};
`,J=o.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 800;
  letter-spacing: -0.01em;
  color: ${({theme:e})=>e.colors.text};
`,X=o.p`
  margin: 0;
  font-size: ${e=>e.theme.font.size.sm};
  color: ${({theme:e})=>e.colors.textMuted};
`,v=o.div`
  display: grid;
  gap: ${e=>e.theme.spacing.sm};
`,Fe=o.div`
  display: flex;
  align-items: center;
  height: 40px;
  padding: 0 ${e=>e.theme.spacing.md};
  border-radius: ${e=>e.theme.radii.md};
  border: 1px solid ${({theme:e})=>e.colors.border};
  background: #fff;
  box-shadow: inset 0 1px 2px rgba(15, 23, 42, 0.04);
`,Te=o.input`
  flex: 1;
  border: 0;
  background: transparent;
  font-size: 14px;
  color: ${({theme:e})=>e.colors.text};
  &:focus {
    outline: none;
  }
`,Z=o.span`
  font-size: ${e=>e.theme.font.size.sm};
  color: ${({theme:e})=>e.colors.textMuted};
`,Ae=o.span`
  font-size: ${e=>e.theme.font.size.sm};
  color: #dc2626;
  font-weight: 600;
`,Ee=o.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${e=>e.theme.spacing.sm};
`,A=o.div`
  font-size: ${e=>e.theme.font.size.sm};
  font-weight: 800;
  color: ${({theme:e})=>e.colors.text};
`,Pe=o.div`
  display: inline-flex;
  align-items: center;
  gap: ${e=>e.theme.spacing.sm};
  font-size: ${e=>e.theme.font.size.sm};
  color: ${({theme:e})=>e.colors.textMuted};
`,Be=o.div`
  display: grid;
  gap: ${e=>e.theme.spacing.sm};
  grid-template-columns: 1fr;
  @media (min-width: 720px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`,He=o.button`
  position: relative;
  display: grid;
  gap: ${e=>e.theme.spacing.xs};
  padding: ${e=>e.theme.spacing.md};
  border-radius: ${e=>e.theme.radii.md};
  border: 1px solid ${({theme:e})=>e.colors.border};
  background: #fff;
  text-align: left;
  cursor: pointer;
  min-height: 64px;
  transition: border-color 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
  .title {
    font-weight: 700;
    font-size: 13px;
    color: ${({theme:e})=>e.colors.text};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    letter-spacing: -0.01em;
  }
  .meta {
    font-size: 11.5px;
    color: ${({theme:e})=>e.colors.textMuted};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  &:hover {
    border-color: ${({theme:e})=>e.colors.borderMuted};
    box-shadow: 0 2px 6px rgba(15, 23, 42, 0.06);
  }
  &[data-selected="true"] {
    border-color: ${({theme:e})=>e.colors.primary};
    background: ${({theme:e})=>e.colors.primarySurface};
    box-shadow: 0 2px 10px rgba(79, 70, 229, 0.12);
  }
  &[data-selected="true"]::after {
    content: '✓';
    position: absolute;
    top: ${e=>e.theme.spacing.sm};
    right: ${e=>e.theme.spacing.sm};
    width: 20px;
    height: 20px;
    border-radius: 999px;
    display: grid;
    place-items: center;
    background: ${({theme:e})=>e.colors.primary};
    color: #fff;
    font-size: ${e=>e.theme.font.size.sm};
    font-weight: 800;
  }
  &[data-disabled="true"] {
    opacity: 0.5;
    cursor: not-allowed;
  }
`,Le=o.div`
  flex: 0 0 auto;
  max-height: 220px;
  overflow: auto;
  border-radius: ${e=>e.theme.radii.md};
  padding: ${e=>e.theme.spacing.sm};
  background: ${({theme:e})=>e.colors.surfaceMuted};
  border: 1px solid ${({theme:e})=>e.colors.borderMuted};
`,Ge=o.div`
  display: flex;
  gap: ${e=>e.theme.spacing.xs};
  flex-wrap: wrap;
  margin-bottom: ${e=>e.theme.spacing.xs};
`,Ye=o.span`
  display: inline-flex;
  align-items: center;
  gap: ${e=>e.theme.spacing.xs};
  padding: ${e=>e.theme.spacing.xs} ${e=>e.theme.spacing.sm};
  border-radius: 999px;
  border: 1px solid ${({theme:e})=>e.colors.border};
  background: ${({theme:e})=>e.colors.surface};
  color: ${({theme:e})=>e.colors.text};
  font-size: ${e=>e.theme.font.size.sm};
  .t { max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  button {
    border: 0;
    background: transparent;
    color: ${({theme:e})=>e.colors.textMuted};
    cursor: pointer;
    font-size: ${e=>e.theme.font.size.md};
    line-height: 1;
  }
`,Qe=o.button`
  border: 0;
  background: transparent;
  color: ${({theme:e})=>e.colors.textMuted};
  font-size: ${e=>e.theme.font.size.sm};
  text-decoration: underline;
  cursor: pointer;
`,Ve=o.div`
  display: grid;
  gap: ${e=>e.theme.spacing.sm};
  grid-template-columns: repeat(2, minmax(0, 1fr));
`,C=o.button`
  height: 34px;
  border-radius: 999px;
  border: 1px solid ${({theme:e})=>e.colors.border};
  background: #fff;
  font-size: ${e=>e.theme.font.size.sm};
  font-weight: 600;
  color: ${({theme:e})=>e.colors.text};
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease;
  &[data-active="true"] {
    border-color: ${({theme:e})=>e.colors.primary};
    background: ${({theme:e})=>e.colors.primarySurface};
    color: ${({theme:e})=>e.colors.primary};
    font-weight: 700;
  }
`,We=o.div`
  display: grid;
  gap: ${e=>e.theme.spacing.sm};
  grid-template-columns: repeat(2, minmax(0, 1fr));
`,ee=o.label`
  display: grid;
  gap: ${e=>e.theme.spacing.xs};
  font-size: ${e=>e.theme.font.size.sm};
  color: ${({theme:e})=>e.colors.textMuted};
`,te=o.input`
  height: 38px;
  border-radius: ${e=>e.theme.radii.md};
  border: 1px solid ${({theme:e})=>e.colors.border};
  padding: 0 ${e=>e.theme.spacing.md};
  background: #fff;
  font-size: ${e=>e.theme.font.size.sm};
`,qe=o.div`
  font-size: ${e=>e.theme.font.size.sm};
  color: ${({theme:e})=>e.colors.textMuted};
  padding-top: ${e=>e.theme.spacing.xs};
`,_e=o.div`
  position: sticky;
  bottom: 0;
  background: ${({theme:e})=>e.colors.surface};
  border-top: 1px solid ${({theme:e})=>e.colors.borderMuted};
  padding-top: ${e=>e.theme.spacing.md};
  margin-top: ${e=>e.theme.spacing.sm};
`,Ke=o.div`
  display: flex;
  justify-content: flex-end;
  gap: ${e=>e.theme.spacing.sm};
`,Oe=o.div`
  flex: 1;
  min-height: 0;
  overflow: auto;
`,Ue=o.div`
  display: grid;
  gap: ${e=>e.theme.spacing.xl};
`,Je=o.div`
  display: flex;
  align-items: center;
  gap: ${e=>e.theme.spacing.sm};
  font-size: ${e=>e.theme.font.size.sm};
  color: ${({theme:e})=>e.colors.textMuted};
  span:first-child {
    font-weight: 600;
    color: ${({theme:e})=>e.colors.text};
    font-size: ${e=>e.theme.font.size.sm};
  }
`,Xe=o.div`
  display: grid;
  gap: ${e=>e.theme.spacing.lg};
`,Ze=o.section`
  border: 1px solid ${({theme:e})=>e.colors.border};
  border-radius: ${({theme:e})=>e.radii.xl};
  background: ${({theme:e})=>e.colors.surface};
  padding: ${e=>e.theme.spacing.xl};
  display: grid;
  gap: ${e=>e.theme.spacing.md};
`,et=o.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  .title {
    font-weight: 700;
    color: ${({theme:e})=>e.colors.text};
    font-size: 14px;
  }
  .count {
    font-size: ${e=>e.theme.font.size.sm};
    color: ${({theme:e})=>e.colors.textMuted};
    font-weight: 600;
  }
`,tt=o.div`
  display: grid;
  gap: ${e=>e.theme.spacing.md};
`,st=o.div`
  display: grid;
  gap: ${e=>e.theme.spacing.xs};
  border-radius: ${e=>e.theme.radii.md};
  border: 1px solid ${({theme:e})=>e.colors.borderMuted};
  padding: ${e=>e.theme.spacing.md};
  background: ${({theme:e})=>e.colors.surfaceMuted};
`,ot=o.div`
  font-size: ${e=>e.theme.font.size.sm};
  color: ${({theme:e})=>e.colors.textMuted};
  font-weight: 600;
`,nt=o.p`
  margin: 0;
  font-size: 13px;
  color: ${({theme:e})=>e.colors.text};
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-word;
`,it=o.div`
  position: sticky;
  bottom: 0;
  background: ${({theme:e})=>e.colors.surface};
  border-top: 1px solid ${({theme:e})=>e.colors.borderMuted};
  padding-top: ${e=>e.theme.spacing.md};
  margin-top: ${e=>e.theme.spacing.md};
  display: flex;
  justify-content: flex-end;
`,rt=o.div`
  display: flex;
  align-items: center;
  gap: ${e=>e.theme.spacing.sm};
`;o.span`
  color: #b91c1c;
  font-size: ${e=>e.theme.font.size.sm};
  font-weight: 600;
`;export{pt as default};
