import{r as a,u as $e,g as be,j as t,a as je,w as U,q as J,h as X,d as o,S as ie}from"./index-DOSOOkBD.js";import{E as D}from"./EmptyPlaceholder-DeD2MjsD.js";import{I as ye}from"./InfoBanner-Ba864uZD.js";import{l as we,f as ve}from"./courses-DTk-37pS.js";function gt(){const[e,l]=a.useState([]),[c,d]=a.useState(!0),[b,H]=a.useState(null),[F,L]=a.useState(""),[p,I]=a.useState([]),[h,j]=a.useState(""),[m,y]=a.useState(""),[w,v]=a.useState(null),[P,G]=a.useState(!1),ae=!1,le=null,[ce,Q]=a.useState(!1),[M,K]=a.useState({}),[V,W]=a.useState(!0),[de,ue]=a.useState(!1),pe=$e(),{error:q,warning:Y}=be();a.useEffect(()=>{let s=!1;async function n(){try{d(!0),H(null);const r=await we({status:"IN_PROGRESS",size:500});s||l(r.content??[])}catch(r){console.error(r),s||H("수업 목록을 불러오는 데 실패했습니다.")}finally{s||d(!1)}}return n(),()=>{s=!0}},[]);const he=a.useMemo(()=>{const s=F.trim().toLowerCase();return s?e.filter(n=>n.title.toLowerCase().includes(s)):e},[e,F]),x=a.useMemo(()=>e.filter(s=>p.includes(s.id)),[e,p]),me=a.useMemo(()=>{const s=[];for(const n of x){const r=M[n.id]||[];for(const i of r){const u=Z(i);s.push({date:i.recordDate,content:u,courseTitle:n.title})}}return s.sort((n,r)=>n.date.localeCompare(r.date)),s},[M,x]),S=a.useMemo(()=>x.map(s=>{const n=(M[s.id]||[]).slice().sort((r,i)=>r.recordDate.localeCompare(i.recordDate));return{course:s,rows:n}}),[M,x]),B=a.useMemo(()=>S.reduce((s,n)=>s+n.rows.length,0),[S]),A=a.useMemo(()=>ze(h,m),[h,m]);function _(s){I(n=>n.includes(s)?n.filter(i=>i!==s):n.length>=3?n:[...n,s])}function O(s){const n=s.getFullYear(),r=String(s.getMonth()+1).padStart(2,"0"),i=String(s.getDate()).padStart(2,"0");return`${n}-${r}-${i}`}function C(s,n,r){j(O(n)),y(O(r)),v(s)}function z(s){const n=new Date,r=new Date(n.getFullYear(),n.getMonth(),n.getDate());if(s==="7d"){const i=new Date(r);i.setDate(r.getDate()-6),C(s,i,r)}else if(s==="30d"){const i=new Date(r);i.setDate(r.getDate()-29),C(s,i,r)}else if(s==="thisMonth"){const i=new Date(r.getFullYear(),r.getMonth(),1);C(s,i,r)}else if(s==="lastMonth"){const i=new Date(r.getFullYear(),r.getMonth()-1,1),u=new Date(r.getFullYear(),r.getMonth(),0);C(s,i,u)}}function k(s){const n=(s||"").trim();if(!n)return"";if(/^\d{4}-\d{2}-\d{2}$/.test(n))return n;const r=n.match(/^(\d{4})[./-]?(\d{2})[./-]?(\d{2})$/);if(r){const[,g,f,$]=r;return`${g}-${f}-${$}`}const i=n.match(/^(\d{1,2})[./-](\d{1,2})[./-](\d{4})$/);if(i){let[,g,f,$]=i;return g=String(g).padStart(2,"0"),f=String(f).padStart(2,"0"),`${$}-${g}-${f}`}const u=n.replace(/\D/g,"");if(u.length===8)if(/^\d{4}/.test(u)){const g=u.slice(0,4),f=u.slice(4,6),$=u.slice(6,8);return`${g}-${f}-${$}`}else{const g=u.slice(0,2),f=u.slice(2,4);return`${u.slice(4,8)}-${g}-${f}`}return n}async function ge(){if(!p.length){Y("수업을 하나 이상 선택해주세요.");return}if(!h||!m){Y("조회 기간(시작/종료일)을 선택해주세요.");return}if(h>m){q("조회 기간이 올바르지 않습니다. 시작일이 종료일보다 늦습니다.");return}try{Q(!0),G(!0);const s=await Promise.all(p.map(async r=>[r,await ve(r,{from:h,to:m})])),n={};for(const[r,i]of s)n[r]=i;K(n)}catch(s){console.error(s),q("수업 내역을 불러오지 못했습니다.")}finally{G(!1)}}function fe(){I([]),L(""),j(""),y(""),v(null),Q(!1),K({})}async function xe(){if(!B){Y("먼저 조회를 실행해주세요.");return}pe("/marketing/generating",{state:{items:me,tone:"WARM_VIVID",speechStyle:"SEUMNIDA",platformChoice:"INSTAGRAM"}})}return t.jsxs(ke,{children:[t.jsxs(De,{children:[t.jsxs(je,{children:[t.jsxs("div",{children:[t.jsx("h2",{children:"마케팅"}),t.jsx("p",{children:"수업 기록을 모아 AI 요약과 콘텐츠로 이어가세요."})]}),t.jsxs(Re,{children:[t.jsx(U,{to:"/marketing/saved",children:"저장 내역"}),t.jsx(U,{to:"/classes",children:"수업 관리"}),!V&&de?t.jsx(J,{as:"button",type:"button",onClick:()=>W(!0),children:"도움말 보기"}):null]})]}),V?t.jsx(ye,{title:"AI 마케팅 요약 시작 가이드",description:"수업 기록을 선택하고 조회한 뒤 요약 만들기로 넘어가세요. 1분 안에 결과를 확인할 수 있어요.",tips:["좌측에서 최대 3개의 수업을 선택하고 조회 기간을 정해주세요.","조회 결과가 아래에 나타나면 내용을 확인한 뒤 필요하면 기간을 다시 조정해보세요.","요약 만들기 버튼을 누르면 AI 분석 화면으로 이동해 콘텐츠 초안을 받을 수 있어요."],onClose:()=>{W(!1),ue(!0)}}):null]}),t.jsxs(Te,{children:[t.jsx(Ne,{children:t.jsxs(Pe,{children:[t.jsxs(ee,{children:[t.jsx(te,{children:"수업 내역 조회"}),t.jsx(se,{children:"수업을 선택하고 기간을 지정해 기록을 불러올 수 있어요."})]}),t.jsxs(Ie,{children:[t.jsxs(R,{children:[t.jsx(Be,{children:t.jsx(Ae,{id:"course-search",placeholder:"수업을 검색해 선택하세요",value:F,onChange:s=>L(s.target.value)})}),c?t.jsx(ne,{children:"수업을 불러오는 중입니다…"}):null,b?t.jsx(Ee,{children:b}):null]}),t.jsxs(R,{children:[t.jsxs(He,{children:[t.jsx(E,{children:"수업 선택"}),t.jsxs(Le,{children:[t.jsxs("span",{children:["선택 ",p.length,"/3"]}),p.length>0?t.jsx(qe,{type:"button",onClick:()=>I([]),children:"전체 해제"}):null]})]}),x.length>0?t.jsx(Ve,{children:x.map(s=>t.jsxs(We,{children:[t.jsx("span",{className:"t",children:s.title}),t.jsx("button",{type:"button","aria-label":"제거",onClick:()=>_(s.id),children:"×"})]},s.id))}):null,t.jsx(Ke,{children:t.jsx(Ge,{role:"list","aria-label":"수업 목록",children:he.map(s=>{const n=p.includes(s.id),r=!n&&p.length>=3;return t.jsxs(Qe,{type:"button",role:"listitem","data-selected":n||void 0,"data-disabled":r||void 0,onClick:()=>{(!r||n)&&_(s.id)},children:[t.jsx("div",{className:"title",children:s.title}),t.jsx("div",{className:"meta",children:Me(s)})]},s.id)})})}),p.length?null:t.jsx(ne,{children:"최대 3개까지 선택할 수 있어요."})]}),t.jsxs(R,{children:[t.jsx(E,{children:"빠른 기간 선택"}),t.jsxs(_e,{children:[t.jsx(T,{type:"button","data-active":w==="7d",onClick:()=>z("7d"),children:"최근 7일"}),t.jsx(T,{type:"button","data-active":w==="30d",onClick:()=>z("30d"),children:"최근 30일"}),t.jsx(T,{type:"button","data-active":w==="thisMonth",onClick:()=>z("thisMonth"),children:"이번 달"}),t.jsx(T,{type:"button","data-active":w==="lastMonth",onClick:()=>z("lastMonth"),children:"지난 달"})]})]}),t.jsxs(R,{children:[t.jsx(E,{children:"직접 선택"}),t.jsxs(Oe,{children:[t.jsxs(oe,{children:[t.jsx("span",{children:"시작일"}),t.jsx(re,{type:"date",lang:"ko-KR",inputMode:"numeric",pattern:"^\\\\d{4}-\\\\d{2}-\\\\d{2}$",placeholder:"YYYY-MM-DD",onFocus:s=>{try{s.currentTarget.showPicker?.()}catch{}},value:h,onChange:s=>{const n=k(s.target.value);j(n),v(null)},onBlur:s=>{const n=k(s.currentTarget.value);n!==h&&j(n)}})]}),t.jsxs(oe,{children:[t.jsx("span",{children:"종료일"}),t.jsx(re,{type:"date",lang:"ko-KR",inputMode:"numeric",pattern:"^\\\\d{4}-\\\\d{2}-\\\\d{2}$",placeholder:"YYYY-MM-DD",onFocus:s=>{try{s.currentTarget.showPicker?.()}catch{}},value:m,onChange:s=>{const n=k(s.target.value);y(n),v(null)},onBlur:s=>{const n=k(s.currentTarget.value);n!==m&&y(n)}})]})]}),t.jsxs(Ue,{children:[A.label,A.days?` · 총 ${A.days}일`:null]})]})]}),t.jsx(Je,{children:t.jsxs(Xe,{children:[t.jsx(X,{type:"button",onClick:ge,disabled:P,children:P?"조회 중...":"조회하기"}),t.jsx(J,{as:"button",type:"button",onClick:fe,children:"초기화"})]})})]})}),t.jsx(Fe,{children:t.jsxs(Ye,{children:[t.jsxs(ee,{children:[t.jsx(te,{children:"조회 결과"}),t.jsx(se,{children:"선택한 수업과 기간에 해당하는 기록이 표시돼요."})]}),t.jsx(Ze,{children:P?t.jsx(D,{title:"조회 중입니다..."}):ce?S.length?B===0?t.jsx(D,{title:"선택한 기간에 해당하는 수업 기록이 없습니다."}):t.jsxs(et,{children:[t.jsxs(tt,{children:[t.jsxs("span",{children:["총 ",B,"건"]}),h&&m?t.jsxs("span",{children:[h," ~ ",m]}):null]}),t.jsx(st,{children:S.map(({course:s,rows:n})=>t.jsxs(nt,{children:[t.jsxs(ot,{children:[t.jsx("span",{className:"title",children:s.title}),t.jsxs("span",{className:"count",children:[n.length,"건"]})]}),t.jsx(rt,{children:n.map(r=>t.jsxs(it,{children:[t.jsx(at,{children:N(r.recordDate)}),t.jsx(lt,{children:Z(r)})]},`${s.id}:${r.id}`))})]},s.id))})]}):t.jsx(D,{title:"선택한 수업이 없어요. 왼쪽에서 수업을 선택해주세요."}):t.jsx(D,{title:"수업을 선택하고 기간을 설정한 후 조회해주세요."})}),t.jsx(ct,{children:t.jsxs(dt,{children:[le,t.jsx(X,{type:"button",onClick:xe,disabled:ae,children:"요약 만들기"})]})})]})})]})]})}function Me(e){const l=e.courseTime||Se(e.startTime,e.endTime),c=e.nextClassDate?`다음 수업 ${N(e.nextClassDate)}`:"";return[l,c].filter(Boolean).join(" · ")||"일정 정보 없음"}function Se(e,l){if(!e&&!l)return"";const c=e?e.slice(0,5):"?",d=l?l.slice(0,5):"?";return`${c} ~ ${d}`}function N(e){if(!e)return"-";const[l,c,d]=e.split("-");return!l||!c||!d?e:`${Number(l)}년 ${Number(c)}월 ${Number(d)}일`}function Ce(e,l){if(!e||!l)return null;try{const c=new Date(e),d=new Date(l);if(Number.isNaN(c.getTime())||Number.isNaN(d.getTime()))return null;const b=Math.abs(d.getTime()-c.getTime());return Math.floor(b/(1e3*60*60*24))+1}catch{return null}}function ze(e,l){if(!e||!l)return{label:"기간을 선택하면 조회 안내가 표시돼요.",days:null};const c=`${N(e)} ~ ${N(l)}`,d=Ce(e,l);return{label:c,days:d}}function Z(e){return e.content?.trim()||e.notes?.trim()||e.topic?.trim()||"(기록된 내용이 없습니다)"}const ke=o.div`
  height: calc(100vh - 48px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
`,De=o.div`
  padding: 0 ${e=>e.theme.spacing.xs};
  display: grid;
  gap: ${e=>e.theme.spacing.sm};
`,Re=o.div`
  display: inline-flex;
  gap: ${e=>e.theme.spacing.sm};
  flex-wrap: wrap;
  justify-content: flex-end;
`,Te=o.div`
  display: grid;
  gap: ${e=>e.theme.spacing.xl};
  grid-template-columns: 1fr;
  flex: 1;
  min-height: 0;
  overflow: hidden;
  @media (min-width: 1120px) {
    grid-template-columns: 360px 1fr;
  }
`,Ne=o.div`
  display: flex;
  min-height: 0;
  overflow: hidden;
`,Fe=o.div`
  display: grid;
  gap: ${e=>e.theme.spacing.xl};
  min-height: 0;
`,Ie=o.div`
  flex: 1;
  min-height: 0;
  overflow: auto;
  display: grid;
  gap: ${e=>e.theme.spacing.xl};
`,Pe=o(ie)`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: ${e=>e.theme.spacing.xl};
`,Ye=o(ie)`
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: ${e=>e.theme.spacing.xl};
`,ee=o.div`
  display: grid;
  gap: ${e=>e.theme.spacing.xs};
`,te=o.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 800;
  letter-spacing: -0.01em;
  color: ${({theme:e})=>e.colors.text};
`,se=o.p`
  margin: 0;
  font-size: ${e=>e.theme.font.size.sm};
  color: ${({theme:e})=>e.colors.textMuted};
`,R=o.div`
  display: grid;
  gap: ${e=>e.theme.spacing.sm};
`,Be=o.div`
  display: flex;
  align-items: center;
  height: 40px;
  padding: 0 ${e=>e.theme.spacing.md};
  border-radius: ${e=>e.theme.radii.md};
  border: 1px solid ${({theme:e})=>e.colors.border};
  background: #fff;
  box-shadow: inset 0 1px 2px rgba(15, 23, 42, 0.04);
`,Ae=o.input`
  flex: 1;
  border: 0;
  background: transparent;
  font-size: 14px;
  color: ${({theme:e})=>e.colors.text};
  &:focus {
    outline: none;
  }
`,ne=o.span`
  font-size: ${e=>e.theme.font.size.sm};
  color: ${({theme:e})=>e.colors.textMuted};
`,Ee=o.span`
  font-size: ${e=>e.theme.font.size.sm};
  color: #dc2626;
  font-weight: 600;
`,He=o.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${e=>e.theme.spacing.sm};
`,E=o.div`
  font-size: ${e=>e.theme.font.size.sm};
  font-weight: 800;
  color: ${({theme:e})=>e.colors.text};
`,Le=o.div`
  display: inline-flex;
  align-items: center;
  gap: ${e=>e.theme.spacing.sm};
  font-size: ${e=>e.theme.font.size.sm};
  color: ${({theme:e})=>e.colors.textMuted};
`,Ge=o.div`
  display: grid;
  gap: ${e=>e.theme.spacing.sm};
  grid-template-columns: 1fr;
  @media (min-width: 720px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`,Qe=o.button`
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
`,Ke=o.div`
  flex: 0 0 auto;
  max-height: 220px;
  overflow: auto;
  border-radius: ${e=>e.theme.radii.md};
  padding: ${e=>e.theme.spacing.sm};
  background: ${({theme:e})=>e.colors.surfaceMuted};
  border: 1px solid ${({theme:e})=>e.colors.borderMuted};
`,Ve=o.div`
  display: flex;
  gap: ${e=>e.theme.spacing.xs};
  flex-wrap: wrap;
  margin-bottom: ${e=>e.theme.spacing.xs};
`,We=o.span`
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
`,qe=o.button`
  border: 0;
  background: transparent;
  color: ${({theme:e})=>e.colors.textMuted};
  font-size: ${e=>e.theme.font.size.sm};
  text-decoration: underline;
  cursor: pointer;
`,_e=o.div`
  display: grid;
  gap: ${e=>e.theme.spacing.sm};
  grid-template-columns: repeat(2, minmax(0, 1fr));
`,T=o.button`
  height: 40px;
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
`,Oe=o.div`
  display: grid;
  gap: ${e=>e.theme.spacing.sm};
  grid-template-columns: repeat(2, minmax(0, 1fr));
`,oe=o.label`
  display: grid;
  gap: ${e=>e.theme.spacing.xs};
  font-size: ${e=>e.theme.font.size.sm};
  color: ${({theme:e})=>e.colors.textMuted};
`,re=o.input`
  height: 38px;
  border-radius: ${e=>e.theme.radii.md};
  border: 1px solid ${({theme:e})=>e.colors.border};
  padding: 0 ${e=>e.theme.spacing.md};
  background: #fff;
  font-size: ${e=>e.theme.font.size.sm};
`,Ue=o.div`
  font-size: ${e=>e.theme.font.size.sm};
  color: ${({theme:e})=>e.colors.textMuted};
  padding-top: ${e=>e.theme.spacing.xs};
`,Je=o.div`
  position: sticky;
  bottom: 0;
  background: ${({theme:e})=>e.colors.surface};
  border-top: 1px solid ${({theme:e})=>e.colors.borderMuted};
  padding-top: ${e=>e.theme.spacing.md};
  margin-top: ${e=>e.theme.spacing.sm};
`,Xe=o.div`
  display: flex;
  justify-content: flex-end;
  gap: ${e=>e.theme.spacing.sm};
`,Ze=o.div`
  flex: 1;
  min-height: 0;
  overflow: auto;
`,et=o.div`
  display: grid;
  gap: ${e=>e.theme.spacing.xl};
`,tt=o.div`
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
`,st=o.div`
  display: grid;
  gap: ${e=>e.theme.spacing.lg};
`,nt=o.section`
  border: 1px solid ${({theme:e})=>e.colors.border};
  border-radius: ${({theme:e})=>e.radii.xl};
  background: ${({theme:e})=>e.colors.surface};
  padding: ${e=>e.theme.spacing.xl};
  display: grid;
  gap: ${e=>e.theme.spacing.md};
`,ot=o.div`
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
`,rt=o.div`
  display: grid;
  gap: ${e=>e.theme.spacing.md};
`,it=o.div`
  display: grid;
  gap: ${e=>e.theme.spacing.xs};
  border-radius: ${e=>e.theme.radii.md};
  border: 1px solid ${({theme:e})=>e.colors.borderMuted};
  padding: ${e=>e.theme.spacing.md};
  background: ${({theme:e})=>e.colors.surfaceMuted};
`,at=o.div`
  font-size: ${e=>e.theme.font.size.sm};
  color: ${({theme:e})=>e.colors.textMuted};
  font-weight: 600;
`,lt=o.p`
  margin: 0;
  font-size: 13px;
  color: ${({theme:e})=>e.colors.text};
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-word;
`,ct=o.div`
  position: sticky;
  bottom: 0;
  background: ${({theme:e})=>e.colors.surface};
  border-top: 1px solid ${({theme:e})=>e.colors.borderMuted};
  padding-top: ${e=>e.theme.spacing.md};
  margin-top: ${e=>e.theme.spacing.md};
  display: flex;
  justify-content: flex-end;
`,dt=o.div`
  display: flex;
  align-items: center;
  gap: ${e=>e.theme.spacing.sm};
`;o.span`
  color: #b91c1c;
  font-size: ${e=>e.theme.font.size.sm};
  font-weight: 600;
`;export{gt as default};
