import{r as a,u as ze,b as Se,j as t,d as o}from"./index-B92ulgNv.js";import{b as Ce,k as ie,f as Re,j as De,S as ge}from"./UI-ktOMpaj3.js";import{E as B}from"./EmptyPlaceholder-BiDxf_Ts.js";import{b as Te}from"./courses-BqfN_zpR.js";import{f as Be}from"./format-Do6vjlY3.js";import{M as K}from"./constants-DQX3OTK7.js";import{u as Ee}from"./hooks-35CwLTFQ.js";import{y as Q,r as re,f as Fe,a as Ne,n as E,b as Pe,t as ae}from"./utils-BiUlBUyf.js";function Ht(){const{courses:e,loading:P,error:f}=Ee(),[h,b]=a.useState(""),[c,$]=a.useState([]),[d,w]=a.useState(""),[p,v]=a.useState(""),[k,M]=a.useState(null),[Y,W]=a.useState(!1),[he,O]=a.useState(!1),[y,A]=a.useState({}),[ue,L]=a.useState({}),[U,I]=a.useState({}),[q,z]=a.useState({}),[Z,H]=a.useState(null),xe=ze(),{error:G,warning:X}=Se(),fe=a.useMemo(()=>{const s=h.trim().toLowerCase();return s?e.filter(i=>i.title.toLowerCase().includes(s)):e},[e,h]),u=a.useMemo(()=>e.filter(s=>c.includes(s.id)),[e,c]),be=a.useMemo(()=>Q(new Date),[]),$e=a.useMemo(()=>{const s=[];for(const i of u){const n=y[i.id]||[];for(const r of n){const l=re(r);s.push({date:r.recordDate,content:l,courseTitle:i.title})}}return s.sort((i,n)=>i.date.localeCompare(n.date)),s},[y,u]),S=a.useMemo(()=>u.map(s=>{const i=(y[s.id]||[]).slice().sort((n,r)=>n.recordDate.localeCompare(r.recordDate));return{course:s,rows:i}}),[y,u]),C=a.useMemo(()=>S.reduce((s,i)=>s+i.rows.length,0),[S]),_=a.useMemo(()=>Fe(d,p),[d,p]);function J(s){$(i=>i.includes(s)?i.filter(r=>r!==s):i.length>=K?i:[...i,s])}function R(s,i,n){w(Q(i)),v(Q(n)),M(s)}function D(s){const i=new Date,n=new Date(i.getFullYear(),i.getMonth(),i.getDate());if(s==="7d"){const r=new Date(n);r.setDate(n.getDate()-6),R(s,r,n)}else if(s==="30d"){const r=new Date(n);r.setDate(n.getDate()-29),R(s,r,n)}else if(s==="thisMonth"){const r=new Date(n.getFullYear(),n.getMonth(),1);R(s,r,n)}else if(s==="lastMonth"){const r=new Date(n.getFullYear(),n.getMonth()-1,1),l=new Date(n.getFullYear(),n.getMonth(),0);R(s,r,l)}}function ee(s){try{s.showPicker?.()}catch{}}const te=30;function ye(s,i){if(!s.recordDate||s.recordDate!==i||!s.startTime||!s.endTime)return!1;const n=se(s.recordDate,s.startTime),r=se(s.recordDate,s.endTime);if(!n||!r)return!1;const l=new Date;return l>=n&&l<=r}function se(s,i){const[n,r,l]=s.split("-").map(Number),m=i.match(/(\d{2}):(\d{2})/);if(!Number.isFinite(n)||!Number.isFinite(r)||!Number.isFinite(l)||!m)return null;const[,T,g]=m,x=new Date;return x.setFullYear(n,r-1,l),x.setHours(Number(T),Number(g),0,0),Number.isNaN(x.getTime())?null:x}async function oe(s,i){if(!(!d||!p)){z(n=>({...n,[s]:!0}));try{const n=await Te(s,{from:d,to:p,page:i,size:te});A(r=>{const l=r[s]||[],m=new Set(l.map(g=>g.id)),T=l.concat(n.filter(g=>!m.has(g.id)));return{...r,[s]:T}}),L(r=>({...r,[s]:i})),I(r=>({...r,[s]:n.length>=te}))}finally{z(n=>({...n,[s]:!1}))}}}async function je(){if(!c.length){X("수업을 하나 이상 선택해주세요.");return}if(!d||!p){X("조회 기간(시작/종료일)을 선택해주세요.");return}if(d>p){G("조회 기간이 올바르지 않습니다. 시작일이 종료일보다 늦습니다.");return}try{O(!0),W(!0),H(null),A({});const s={},i={},n={};for(const r of c)s[r]=-1,i[r]=!0,n[r]=!1;L(s),I(i),z(n),await Promise.all(c.map(r=>oe(r,0)))}catch(s){const i=ae(s,"수업 내역을 불러오지 못했습니다.");H(i),G(i)}finally{W(!1)}}function we(){$([]),b(""),w(""),v(""),M(null),O(!1),A({}),L({}),I({}),z({})}async function ve(){if(!C){X("먼저 조회를 실행해주세요.");return}xe("/marketing/generating",{state:{items:$e,tone:"WARM_VIVID",speechStyle:"SEUMNIDA",platformChoice:"INSTAGRAM"}})}return t.jsxs(Ae,{children:[t.jsxs(Le,{children:[t.jsxs(Ce,{children:[t.jsxs("div",{children:[t.jsx("h2",{children:"마케팅"}),t.jsx("p",{children:"수업 기록을 모아 AI 요약과 콘텐츠로 이어가세요."})]}),t.jsxs(He,{children:[t.jsx(ie,{to:"/marketing/saved",children:"저장 내역"}),t.jsx(ie,{to:"/classes",children:"수업 관리"})]})]}),t.jsxs(Ie,{role:"status",children:[t.jsx("strong",{children:"안내"}),t.jsx("p",{children:"마케팅 기능 출력 결과가 아직 원활하지 않을 수 있습니다."}),t.jsx("p",{children:"빠른시일 내 데이터를 확인 & 분석해서 개선하겠습니다."})]})]}),t.jsxs(Ge,{children:[t.jsx(Xe,{children:t.jsxs(Qe,{children:[t.jsx(le,{children:t.jsx(ce,{children:"수업 내역 조회"})}),t.jsxs(Ke,{children:[t.jsxs(F,{children:[t.jsx(Oe,{children:t.jsx(Ue,{id:"course-search",placeholder:"수업을 검색해 선택하세요",value:h,onChange:s=>b(s.target.value)})}),P?t.jsx(de,{children:"수업을 불러오는 중입니다…"}):null,f?t.jsx(qe,{children:f}):null]}),t.jsxs(F,{children:[t.jsxs(Ze,{children:[t.jsx(V,{children:"수업 선택"}),t.jsxs(Je,{children:[t.jsxs("span",{children:["선택 ",c.length,"/3"]}),c.length>0?t.jsx(it,{type:"button",onClick:()=>$([]),children:"전체 해제"}):null]})]}),u.length>0?t.jsx(ot,{children:u.map(s=>t.jsxs(nt,{children:[t.jsx("span",{className:"t",children:s.title}),t.jsx("button",{type:"button","aria-label":"제거",onClick:()=>J(s.id),children:"×"})]},s.id))}):null,t.jsx(st,{children:t.jsx(et,{role:"list","aria-label":"수업 목록",children:fe.map(s=>{const i=c.includes(s.id),n=!i&&c.length>=K;return t.jsxs(tt,{type:"button",role:"listitem","data-selected":i||void 0,"data-disabled":n||void 0,onClick:()=>{(!n||i)&&J(s.id)},children:[t.jsx("div",{className:"title",children:s.title}),t.jsx("div",{className:"meta",children:Ne(s)})]},s.id)})})}),c.length?null:t.jsxs(de,{children:["최대 ",K,"개까지 선택할 수 있어요."]})]}),t.jsxs(F,{children:[t.jsx(V,{children:"빠른 기간 선택"}),t.jsxs(rt,{children:[t.jsx(N,{type:"button","data-active":k==="7d",onClick:()=>D("7d"),children:"최근 7일"}),t.jsx(N,{type:"button","data-active":k==="30d",onClick:()=>D("30d"),children:"최근 30일"}),t.jsx(N,{type:"button","data-active":k==="thisMonth",onClick:()=>D("thisMonth"),children:"이번 달"}),t.jsx(N,{type:"button","data-active":k==="lastMonth",onClick:()=>D("lastMonth"),children:"지난 달"})]})]}),t.jsxs(F,{children:[t.jsx(V,{children:"직접 선택"}),t.jsxs(at,{children:[t.jsxs(pe,{children:[t.jsx("span",{children:"시작일"}),t.jsx(me,{type:"date",lang:"ko-KR",inputMode:"numeric",pattern:"^\\\\d{4}-\\\\d{2}-\\\\d{2}$",placeholder:"YYYY-MM-DD",onFocus:s=>ee(s.currentTarget),value:d,onChange:s=>{const i=E(s.target.value);w(i),M(null)},onBlur:s=>{const i=E(s.currentTarget.value);i!==d&&w(i)}})]}),t.jsxs(pe,{children:[t.jsx("span",{children:"종료일"}),t.jsx(me,{type:"date",lang:"ko-KR",inputMode:"numeric",pattern:"^\\\\d{4}-\\\\d{2}-\\\\d{2}$",placeholder:"YYYY-MM-DD",onFocus:s=>ee(s.currentTarget),value:p,onChange:s=>{const i=E(s.target.value);v(i),M(null)},onBlur:s=>{const i=E(s.currentTarget.value);i!==p&&v(i)}})]})]}),t.jsxs(lt,{children:[_.label,_.days?` · 총 ${_.days}일`:null]})]})]}),t.jsx(ct,{children:t.jsxs(dt,{children:[t.jsx(Re,{type:"button",onClick:je,disabled:Y,children:Y?"조회 중...":"조회하기"}),t.jsx(De,{as:"button",type:"button",onClick:we,children:"초기화"})]})})]})}),t.jsx(_e,{children:t.jsxs(Ve,{children:[t.jsxs(le,{children:[t.jsx(ce,{children:"조회 결과"}),t.jsx(We,{children:"선택한 수업과 기간에 해당하는 기록이 표시돼요."})]}),t.jsx(pt,{children:Y?t.jsx(B,{title:"조회 중입니다..."}):he?S.length?C===0?t.jsx(B,{title:"선택한 기간에 해당하는 수업 기록이 없습니다."}):t.jsxs(mt,{children:[t.jsxs(gt,{children:[t.jsxs("span",{children:["총 ",C,"건"]}),d&&p?t.jsxs("span",{children:[d," ~ ",p]}):null]}),t.jsxs(ut,{children:[Z?t.jsx(ht,{role:"alert",children:Z}):null,S.map(({course:s,rows:i})=>t.jsxs(xt,{children:[t.jsxs(ft,{children:[t.jsx("span",{className:"title",children:s.title}),t.jsxs("span",{className:"count",children:[y[s.id]?.length||0,"건"]})]}),t.jsxs(bt,{children:[i.map(n=>{const r=Be(n.startTime,n.endTime),l=!r.includes("--"),m=n.topic?.trim(),g=re(n).split(/\n+/).map(j=>j.trim()).filter(Boolean),x=g[0]??"(기록된 내용이 없습니다)",ne=g.slice(1).map(j=>j.replace(/^[-•]\s*/u,"")).filter(Boolean),ke=ye(n,be);return t.jsxs($t,{children:[t.jsxs(yt,{children:[t.jsx(jt,{children:Pe(n.recordDate)}),l?t.jsx(wt,{children:r}):null]}),t.jsxs(vt,{children:[t.jsxs(kt,{children:[m?t.jsx(Mt,{children:m}):null,ke?t.jsx(St,{children:"진행 중"}):null]}),t.jsx(zt,{children:x}),ne.length?t.jsx(Ct,{children:ne.map((j,Me)=>t.jsx(Rt,{children:j},`${n.id}-detail-${Me}`))}):null]})]},`${s.id}:${n.id}`)}),t.jsx(Ye,{onVisible:()=>{const n=s.id;if(q[n]||U[n]===!1)return;const r=(ue[n]??0)+1;oe(n,r).catch(l=>{const m=ae(l,"수업 내역을 불러오지 못했습니다.");H(m),G(m)})},children:q[s.id]?t.jsx("span",{style:{color:"#64748b",fontSize:12},children:"불러오는 중…"}):U[s.id]?t.jsx("span",{style:{color:"#9ca3af",fontSize:12},children:"아래로 스크롤하면 더 불러옵니다"}):t.jsx("span",{style:{color:"#9ca3af",fontSize:12},children:"마지막입니다"})})]})]},s.id))]})]}):t.jsx(B,{title:"선택한 수업이 없어요. 왼쪽에서 수업을 선택해주세요."}):t.jsx(B,{title:"수업을 선택하고 기간을 설정한 후 조회해주세요."})}),t.jsx(Dt,{children:t.jsx(Tt,{children:t.jsx(Bt,{type:"button",onClick:ve,disabled:!C,"aria-label":"AI요약",children:"AI요약"})})})]})})]})]})}function Ye({onVisible:e,children:P}){const f=a.useRef(null);return a.useEffect(()=>{const h=f.current;if(!h)return;const b=new IntersectionObserver(c=>{for(const $ of c)if($.isIntersecting){e();break}},{root:null,rootMargin:"200px 0px",threshold:0});return b.observe(h),()=>b.disconnect()},[e]),t.jsx("div",{ref:f,style:{display:"grid",placeItems:"center",padding:"8px 0"},children:P})}const Ae=o.div`
  height: calc(100vh - 48px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
`,Le=o.div`
  padding: 0 ${e=>e.theme.spacing.xs};
  display: grid;
  gap: ${e=>e.theme.spacing.sm};
`,Ie=o.div`
  padding: 10px ${e=>e.theme.spacing.sm};
  border-radius: ${e=>e.theme.radii.md};
  background: #eef2ff;
  border: 1px solid #c7d2fe;
  color: #312e81;
  font-size: ${e=>e.theme.font.size.sm};
  line-height: 1.5;
  display: grid;
  gap: 4px;
  strong { font-weight: 700; }
  p { margin: 0; }
`,He=o.div`
  display: inline-flex;
  gap: ${e=>e.theme.spacing.sm};
  flex-wrap: wrap;
  justify-content: flex-end;
`,Ge=o.div`
  display: grid;
  gap: ${e=>e.theme.spacing.xl};
  grid-template-columns: 1fr;
  flex: 1;
  min-height: 0;
  overflow: hidden;
  @media (min-width: 1120px) {
    grid-template-columns: 360px 1fr;
  }
`,Xe=o.div`
  display: flex;
  min-height: 0;
  overflow: hidden;
`,_e=o.div`
  display: grid;
  gap: ${e=>e.theme.spacing.xl};
  min-height: 0;
`,Ke=o.div`
  flex: 1;
  min-height: 0;
  overflow: auto;
  display: grid;
  gap: ${e=>e.theme.spacing.xl};
`,Qe=o(ge)`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: ${e=>e.theme.spacing.xl};
`,Ve=o(ge)`
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: ${e=>e.theme.spacing.xl};
`,le=o.div`
  display: grid;
  gap: ${e=>e.theme.spacing.xs};
`,ce=o.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 800;
  letter-spacing: -0.01em;
  color: ${({theme:e})=>e.colors.text};
`,We=o.p`
  margin: 0;
  font-size: ${e=>e.theme.font.size.sm};
  color: ${({theme:e})=>e.colors.textMuted};
`,F=o.div`
  display: grid;
  gap: ${e=>e.theme.spacing.sm};
`,Oe=o.div`
  display: flex;
  align-items: center;
  height: 40px;
  padding: 0 ${e=>e.theme.spacing.md};
  border-radius: ${e=>e.theme.radii.md};
  border: 1px solid ${({theme:e})=>e.colors.border};
  background: #fff;
  box-shadow: inset 0 1px 2px rgba(15, 23, 42, 0.04);
`,Ue=o.input`
  flex: 1;
  border: 0;
  background: transparent;
  font-size: 14px;
  color: ${({theme:e})=>e.colors.text};
  &:focus {
    outline: none;
  }
`,de=o.span`
  font-size: ${e=>e.theme.font.size.sm};
  color: ${({theme:e})=>e.colors.textMuted};
`,qe=o.span`
  font-size: ${e=>e.theme.font.size.sm};
  color: #dc2626;
  font-weight: 600;
`,Ze=o.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${e=>e.theme.spacing.sm};
`,V=o.div`
  font-size: ${e=>e.theme.font.size.sm};
  font-weight: 800;
  color: ${({theme:e})=>e.colors.text};
`,Je=o.div`
  display: inline-flex;
  align-items: center;
  gap: ${e=>e.theme.spacing.sm};
  font-size: ${e=>e.theme.font.size.sm};
  color: ${({theme:e})=>e.colors.textMuted};
`,et=o.div`
  display: grid;
  gap: ${e=>e.theme.spacing.sm};
  grid-template-columns: 1fr;
  @media (min-width: 720px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`,tt=o.button`
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
    background: ${({theme:e})=>e.colors.surfaceMuted};
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
`,st=o.div`
  flex: 0 0 auto;
  max-height: 220px;
  overflow: auto;
  border-radius: ${e=>e.theme.radii.md};
  padding: ${e=>e.theme.spacing.sm};
  background: ${({theme:e})=>e.colors.surfaceMuted};
  border: 1px solid ${({theme:e})=>e.colors.borderMuted};
`,ot=o.div`
  display: flex;
  gap: ${e=>e.theme.spacing.xs};
  flex-wrap: wrap;
  margin-bottom: ${e=>e.theme.spacing.xs};
`,nt=o.span`
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
`,it=o.button`
  border: 0;
  background: transparent;
  color: ${({theme:e})=>e.colors.textMuted};
  font-size: ${e=>e.theme.font.size.sm};
  text-decoration: underline;
  cursor: pointer;
`,rt=o.div`
  display: grid;
  gap: ${e=>e.theme.spacing.sm};
  grid-template-columns: repeat(2, minmax(0, 1fr));
`,N=o.button`
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
`,at=o.div`
  display: grid;
  gap: ${e=>e.theme.spacing.sm};
  grid-template-columns: repeat(2, minmax(0, 1fr));
`,pe=o.label`
  display: grid;
  gap: ${e=>e.theme.spacing.xs};
  font-size: ${e=>e.theme.font.size.sm};
  color: ${({theme:e})=>e.colors.textMuted};
`,me=o.input`
  height: 38px;
  border-radius: ${e=>e.theme.radii.md};
  border: 1px solid ${({theme:e})=>e.colors.border};
  padding: 0 ${e=>e.theme.spacing.md};
  background: #fff;
  font-size: ${e=>e.theme.font.size.sm};
`,lt=o.div`
  font-size: ${e=>e.theme.font.size.sm};
  color: ${({theme:e})=>e.colors.textMuted};
  padding-top: ${e=>e.theme.spacing.xs};
`,ct=o.div`
  position: sticky;
  bottom: 0;
  background: ${({theme:e})=>e.colors.surface};
  /* remove dividing line under filter section */
  border-top: 0;
  padding-top: ${e=>e.theme.spacing.md};
  margin-top: ${e=>e.theme.spacing.sm};
`,dt=o.div`
  display: flex;
  justify-content: flex-end;
  gap: ${e=>e.theme.spacing.sm};
`,pt=o.div`
  flex: 1;
  min-height: 0;
  overflow: auto;
`,mt=o.div`
  display: grid;
  gap: ${e=>e.theme.spacing.xl};
`,gt=o.div`
  position: sticky;
  top: 0;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: ${e=>e.theme.spacing.sm};
  font-size: ${e=>e.theme.font.size.sm};
  color: ${({theme:e})=>e.colors.textMuted};
  padding: ${e=>e.theme.spacing.sm} 0;
  margin-bottom: ${e=>e.theme.spacing.md};
  background: ${({theme:e})=>e.colors.surface};
  box-shadow: 0 12px 16px -14px rgba(15, 23, 42, 0.25);
  span:first-child {
    font-weight: 600;
    color: ${({theme:e})=>e.colors.text};
    font-size: ${e=>e.theme.font.size.sm};
  }
`,ht=o.span`
  display: block;
  color: #b91c1c;
  font-weight: 700;
  font-size: ${e=>e.theme.font.size.sm};
`,ut=o.div`
  display: grid;
  gap: ${e=>e.theme.spacing.lg};
`,xt=o.section`
  border: 1px solid ${({theme:e})=>e.colors.border};
  border-radius: ${({theme:e})=>e.radii.xl};
  background: ${({theme:e})=>e.colors.surface};
  padding: ${e=>e.theme.spacing.xl};
  display: grid;
  gap: ${e=>e.theme.spacing.md};
`,ft=o.div`
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
`,bt=o.div`
  display: grid;
  gap: ${e=>e.theme.spacing.md};
`,$t=o.div`
  display: flex;
  align-items: flex-start;
  gap: ${e=>e.theme.spacing.lg};
  padding: ${e=>e.theme.spacing.md};
  border-radius: ${e=>e.theme.radii.lg};
  border: 1px solid ${({theme:e})=>e.colors.borderMuted};
  background: #ffffff;
  box-shadow: 0 10px 24px -18px rgba(15, 23, 42, 0.35);
  transition: transform 0.16s ease, border-color 0.16s ease, box-shadow 0.16s ease;

  &:hover {
    transform: translateY(-2px);
    border-color: ${({theme:e})=>e.colors.primarySurface};
    box-shadow: 0 16px 32px -20px rgba(79, 70, 229, 0.28);
  }
`,yt=o.div`
  min-width: 124px;
  display: grid;
  gap: 4px;
  padding: 10px 12px;
  border-radius: 12px;
  background: ${({theme:e})=>e.colors.surfaceMuted};
  border: 1px solid ${({theme:e})=>e.colors.borderMuted};
  color: ${({theme:e})=>e.colors.text};
  text-align: center;
`,jt=o.span`
  font-size: 13px;
  font-weight: 700;
  line-height: 1.35;
`,wt=o.span`
  font-size: 11px;
  font-weight: 600;
  color: ${({theme:e})=>e.colors.textMuted};
  letter-spacing: 0.04em;
`,vt=o.div`
  flex: 1;
  min-width: 0;
  display: grid;
  gap: 8px;
`,kt=o.div`
  display: flex;
  align-items: center;
  gap: ${e=>e.theme.spacing.xs};
  flex-wrap: wrap;
`,Mt=o.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${({theme:e})=>e.colors.primary};
  background: rgba(99, 102, 241, 0.14);
  border-radius: 999px;
  padding: 4px 12px;
`,zt=o.p`
  margin: 0;
  font-size: 13px;
  font-weight: 600;
  color: ${({theme:e})=>e.colors.text};
  line-height: 1.6;
  padding-left: ${e=>e.theme.spacing.md};
  border-left: 3px solid ${({theme:e})=>e.colors.primary};
  word-break: break-word;
`,St=o.span`
  font-size: 11px;
  font-weight: 700;
  color: #047857;
  background: rgba(16, 185, 129, 0.14);
  border-radius: 999px;
  padding: 4px 10px;
  letter-spacing: 0.04em;
`,Ct=o.ul`
  margin: 0;
  padding-left: 18px;
  display: grid;
  gap: 6px;
  list-style: disc;
  font-size: 12.5px;
  color: ${({theme:e})=>e.colors.textMuted};
  line-height: 1.6;
`,Rt=o.li`
  margin: 0;
  padding: 0;
  word-break: break-word;
`,Dt=o.div`
  position: sticky;
  bottom: 0;
  background: ${({theme:e})=>e.colors.surface};
  border-top: 1px solid ${({theme:e})=>e.colors.borderMuted};
  padding-top: ${e=>e.theme.spacing.md};
  margin-top: ${e=>e.theme.spacing.md};
  display: flex;
  justify-content: flex-end;
`,Tt=o.div`
  display: flex;
  align-items: center;
  gap: ${e=>e.theme.spacing.sm};
`,Bt=o.button`
  @keyframes gradientMove {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  @keyframes glowPulse {
    0% { box-shadow: 0 16px 28px rgba(99, 102, 241, 0.22); }
    50% { box-shadow: 0 22px 42px rgba(236, 72, 153, 0.28); }
    100% { box-shadow: 0 16px 28px rgba(99, 102, 241, 0.22); }
  }
  @keyframes shimmer {
    0% { transform: translateX(-120%) skewX(-15deg); opacity: 0; }
    30% { opacity: 0.5; }
    60% { opacity: 0.25; }
    100% { transform: translateX(120%) skewX(-15deg); opacity: 0; }
  }

  appearance: none;
  height: 40px;
  padding: 0 22px;
  border-radius: 999px;
  border: none;
  background: linear-gradient(135deg, #4f46e5 0%, #8b5cf6 50%, #ec4899 100%);
  background-size: 200% 200%;
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.01em;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: transform 0.18s ease, filter 0.2s ease;
  animation: gradientMove 6s ease infinite, glowPulse 3.2s ease-in-out infinite;

  & > * { position: relative; z-index: 1; }

  &:before {
    content: "";
    position: absolute;
    inset: 0;
    background: radial-gradient(120% 120% at 10% 10%, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.06) 60%, rgba(255,255,255,0) 80%);
    mix-blend-mode: screen;
    opacity: 0.6;
    pointer-events: none;
    transition: opacity 0.2s ease;
  }

  &:after {
    content: "";
    position: absolute;
    top: -20%;
    bottom: -20%;
    left: -10%;
    width: 30%;
    background: linear-gradient(
      90deg,
      rgba(255,255,255,0) 0%,
      rgba(255,255,255,0.65) 50%,
      rgba(255,255,255,0) 100%
    );
    mix-blend-mode: screen;
    filter: blur(2px);
    transform: translateX(-120%) skewX(-15deg);
    animation: shimmer 2.4s ease-in-out infinite;
    pointer-events: none;
  }

  &:hover {
    transform: translateY(-2px) scale(1.02);
    filter: saturate(1.1);
    &:before { opacity: 0.8; }
  }
  &:active {
    transform: translateY(0) scale(1.0);
  }
  &:focus-visible {
    outline: 2px solid rgba(129, 140, 248, 0.7);
    outline-offset: 3px;
  }
  &:disabled {
    opacity: 0.55;
    cursor: progress;
    transform: none;
    animation-play-state: paused;
  }
`;export{Ht as default};
