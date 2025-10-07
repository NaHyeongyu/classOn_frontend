import{r as a,u as Se,k as ze,j as t,b as Ce,x as ie,m as Re,y as De,d as n,S as me}from"./index-DuqOyKVg.js";import{E as B}from"./EmptyPlaceholder-BTOahZwW.js";import{l as Ee,b as Te}from"./courses-Bib7YEXJ.js";import{f as Be}from"./format-Do6vjlY3.js";import{M as Fe,a as K}from"./constants-LflU8o8-.js";import{t as U,y as O,r as ae,f as Ne,a as Pe,n as F,b as Ye}from"./utils-BiUlBUyf.js";function Ae(){const[e,$]=a.useState([]),[x,g]=a.useState(!0),[b,c]=a.useState(null);return a.useEffect(()=>{let p=!0;async function d(){try{g(!0),c(null);const h=await Ee({status:"IN_PROGRESS",size:Fe});if(!p)return;$(h.content??[])}catch(h){if(!p)return;$([]),c(U(h,"수업 목록을 불러오지 못했습니다."))}finally{p&&g(!1)}}return d(),()=>{p=!1}},[]),{courses:e,loading:x,error:b}}function Lt(){const{courses:e,loading:$,error:x}=Ae(),[g,b]=a.useState(""),[c,p]=a.useState([]),[d,h]=a.useState(""),[u,k]=a.useState(""),[M,S]=a.useState(null),[Y,V]=a.useState(!1),[ge,W]=a.useState(!1),[w,A]=a.useState({}),[he,I]=a.useState({}),[Z,L]=a.useState({}),[q,z]=a.useState({}),[J,H]=a.useState(null),fe=Se(),{error:G,warning:_}=ze(),xe=a.useMemo(()=>{const s=g.trim().toLowerCase();return s?e.filter(r=>r.title.toLowerCase().includes(s)):e},[e,g]),y=a.useMemo(()=>e.filter(s=>c.includes(s.id)),[e,c]),be=a.useMemo(()=>O(new Date),[]),$e=a.useMemo(()=>{const s=[];for(const r of y){const o=w[r.id]||[];for(const i of o){const l=ae(i);s.push({date:i.recordDate,content:l,courseTitle:r.title})}}return s.sort((r,o)=>r.date.localeCompare(o.date)),s},[w,y]),C=a.useMemo(()=>y.map(s=>{const r=(w[s.id]||[]).slice().sort((o,i)=>o.recordDate.localeCompare(i.recordDate));return{course:s,rows:r}}),[w,y]),R=a.useMemo(()=>C.reduce((s,r)=>s+r.rows.length,0),[C]),X=a.useMemo(()=>Ne(d,u),[d,u]);function ee(s){p(r=>r.includes(s)?r.filter(i=>i!==s):r.length>=K?r:[...r,s])}function D(s,r,o){h(O(r)),k(O(o)),S(s)}function E(s){const r=new Date,o=new Date(r.getFullYear(),r.getMonth(),r.getDate());if(s==="7d"){const i=new Date(o);i.setDate(o.getDate()-6),D(s,i,o)}else if(s==="30d"){const i=new Date(o);i.setDate(o.getDate()-29),D(s,i,o)}else if(s==="thisMonth"){const i=new Date(o.getFullYear(),o.getMonth(),1);D(s,i,o)}else if(s==="lastMonth"){const i=new Date(o.getFullYear(),o.getMonth()-1,1),l=new Date(o.getFullYear(),o.getMonth(),0);D(s,i,l)}}function te(s){try{s.showPicker?.()}catch{}}const se=30;function ye(s,r){if(!s.recordDate||s.recordDate!==r||!s.startTime||!s.endTime)return!1;const o=oe(s.recordDate,s.startTime),i=oe(s.recordDate,s.endTime);if(!o||!i)return!1;const l=new Date;return l>=o&&l<=i}function oe(s,r){const[o,i,l]=s.split("-").map(Number),m=r.match(/(\d{2}):(\d{2})/);if(!Number.isFinite(o)||!Number.isFinite(i)||!Number.isFinite(l)||!m)return null;const[,T,f]=m,j=new Date;return j.setFullYear(o,i-1,l),j.setHours(Number(T),Number(f),0,0),Number.isNaN(j.getTime())?null:j}async function ne(s,r){if(!(!d||!u)){z(o=>({...o,[s]:!0}));try{const o=await Te(s,{from:d,to:u,page:r,size:se});A(i=>{const l=i[s]||[],m=new Set(l.map(f=>f.id)),T=l.concat(o.filter(f=>!m.has(f.id)));return{...i,[s]:T}}),I(i=>({...i,[s]:r})),L(i=>({...i,[s]:o.length>=se}))}finally{z(o=>({...o,[s]:!1}))}}}async function je(){if(!c.length){_("수업을 하나 이상 선택해주세요.");return}if(!d||!u){_("조회 기간(시작/종료일)을 선택해주세요.");return}if(d>u){G("조회 기간이 올바르지 않습니다. 시작일이 종료일보다 늦습니다.");return}try{W(!0),V(!0),H(null),A({});const s={},r={},o={};for(const i of c)s[i]=-1,r[i]=!0,o[i]=!1;I(s),L(r),z(o),await Promise.all(c.map(i=>ne(i,0)))}catch(s){const r=U(s,"수업 내역을 불러오지 못했습니다.");H(r),G(r)}finally{V(!1)}}function we(){p([]),b(""),h(""),k(""),S(null),W(!1),A({}),I({}),L({}),z({})}async function ve(){if(!R){_("먼저 조회를 실행해주세요.");return}fe("/marketing/generating",{state:{items:$e,tone:"WARM_VIVID",speechStyle:"SEUMNIDA",platformChoice:"INSTAGRAM"}})}return t.jsxs(Le,{children:[t.jsx(He,{children:t.jsxs(Ce,{children:[t.jsxs("div",{children:[t.jsx("h2",{children:"마케팅"}),t.jsx("p",{children:"수업 기록을 모아 AI 요약과 콘텐츠로 이어가세요."})]}),t.jsxs(Ge,{children:[t.jsx(ie,{to:"/marketing/saved",children:"저장 내역"}),t.jsx(ie,{to:"/classes",children:"수업 관리"})]})]})}),t.jsxs(_e,{children:[t.jsx(Xe,{children:t.jsxs(Qe,{children:[t.jsx(le,{children:t.jsx(ce,{children:"수업 내역 조회"})}),t.jsxs(Oe,{children:[t.jsxs(N,{children:[t.jsx(We,{children:t.jsx(Ze,{id:"course-search",placeholder:"수업을 검색해 선택하세요",value:g,onChange:s=>b(s.target.value)})}),$?t.jsx(de,{children:"수업을 불러오는 중입니다…"}):null,x?t.jsx(qe,{children:x}):null]}),t.jsxs(N,{children:[t.jsxs(Je,{children:[t.jsx(Q,{children:"수업 선택"}),t.jsxs(et,{children:[t.jsxs("span",{children:["선택 ",c.length,"/3"]}),c.length>0?t.jsx(it,{type:"button",onClick:()=>p([]),children:"전체 해제"}):null]})]}),y.length>0?t.jsx(nt,{children:y.map(s=>t.jsxs(rt,{children:[t.jsx("span",{className:"t",children:s.title}),t.jsx("button",{type:"button","aria-label":"제거",onClick:()=>ee(s.id),children:"×"})]},s.id))}):null,t.jsx(ot,{children:t.jsx(tt,{role:"list","aria-label":"수업 목록",children:xe.map(s=>{const r=c.includes(s.id),o=!r&&c.length>=K;return t.jsxs(st,{type:"button",role:"listitem","data-selected":r||void 0,"data-disabled":o||void 0,onClick:()=>{(!o||r)&&ee(s.id)},children:[t.jsx("div",{className:"title",children:s.title}),t.jsx("div",{className:"meta",children:Pe(s)})]},s.id)})})}),c.length?null:t.jsxs(de,{children:["최대 ",K,"개까지 선택할 수 있어요."]})]}),t.jsxs(N,{children:[t.jsx(Q,{children:"빠른 기간 선택"}),t.jsxs(at,{children:[t.jsx(P,{type:"button","data-active":M==="7d",onClick:()=>E("7d"),children:"최근 7일"}),t.jsx(P,{type:"button","data-active":M==="30d",onClick:()=>E("30d"),children:"최근 30일"}),t.jsx(P,{type:"button","data-active":M==="thisMonth",onClick:()=>E("thisMonth"),children:"이번 달"}),t.jsx(P,{type:"button","data-active":M==="lastMonth",onClick:()=>E("lastMonth"),children:"지난 달"})]})]}),t.jsxs(N,{children:[t.jsx(Q,{children:"직접 선택"}),t.jsxs(lt,{children:[t.jsxs(pe,{children:[t.jsx("span",{children:"시작일"}),t.jsx(ue,{type:"date",lang:"ko-KR",inputMode:"numeric",pattern:"^\\\\d{4}-\\\\d{2}-\\\\d{2}$",placeholder:"YYYY-MM-DD",onFocus:s=>te(s.currentTarget),value:d,onChange:s=>{const r=F(s.target.value);h(r),S(null)},onBlur:s=>{const r=F(s.currentTarget.value);r!==d&&h(r)}})]}),t.jsxs(pe,{children:[t.jsx("span",{children:"종료일"}),t.jsx(ue,{type:"date",lang:"ko-KR",inputMode:"numeric",pattern:"^\\\\d{4}-\\\\d{2}-\\\\d{2}$",placeholder:"YYYY-MM-DD",onFocus:s=>te(s.currentTarget),value:u,onChange:s=>{const r=F(s.target.value);k(r),S(null)},onBlur:s=>{const r=F(s.currentTarget.value);r!==u&&k(r)}})]})]}),t.jsxs(ct,{children:[X.label,X.days?` · 총 ${X.days}일`:null]})]})]}),t.jsx(dt,{children:t.jsxs(pt,{children:[t.jsx(Re,{type:"button",onClick:je,disabled:Y,children:Y?"조회 중...":"조회하기"}),t.jsx(De,{as:"button",type:"button",onClick:we,children:"초기화"})]})})]})}),t.jsx(Ke,{children:t.jsxs(Ue,{children:[t.jsxs(le,{children:[t.jsx(ce,{children:"조회 결과"}),t.jsx(Ve,{children:"선택한 수업과 기간에 해당하는 기록이 표시돼요."})]}),t.jsx(ut,{children:Y?t.jsx(B,{title:"조회 중입니다..."}):ge?C.length?R===0?t.jsx(B,{title:"선택한 기간에 해당하는 수업 기록이 없습니다."}):t.jsxs(mt,{children:[t.jsxs(gt,{children:[t.jsxs("span",{children:["총 ",R,"건"]}),d&&u?t.jsxs("span",{children:[d," ~ ",u]}):null]}),t.jsxs(ft,{children:[J?t.jsx(ht,{role:"alert",children:J}):null,C.map(({course:s,rows:r})=>t.jsxs(xt,{children:[t.jsxs(bt,{children:[t.jsx("span",{className:"title",children:s.title}),t.jsxs("span",{className:"count",children:[w[s.id]?.length||0,"건"]})]}),t.jsxs($t,{children:[r.map(o=>{const i=Be(o.startTime,o.endTime),l=!i.includes("--"),m=o.topic?.trim(),f=ae(o).split(/\n+/).map(v=>v.trim()).filter(Boolean),j=f[0]??"(기록된 내용이 없습니다)",re=f.slice(1).map(v=>v.replace(/^[-•]\s*/u,"")).filter(Boolean),ke=ye(o,be);return t.jsxs(yt,{children:[t.jsxs(jt,{children:[t.jsx(wt,{children:Ye(o.recordDate)}),l?t.jsx(vt,{children:i}):null]}),t.jsxs(kt,{children:[t.jsxs(Mt,{children:[m?t.jsx(St,{children:m}):null,ke?t.jsx(Ct,{children:"진행 중"}):null]}),t.jsx(zt,{children:j}),re.length?t.jsx(Rt,{children:re.map((v,Me)=>t.jsx(Dt,{children:v},`${o.id}-detail-${Me}`))}):null]})]},`${s.id}:${o.id}`)}),t.jsx(Ie,{onVisible:()=>{const o=s.id;if(q[o]||Z[o]===!1)return;const i=(he[o]??0)+1;ne(o,i).catch(l=>{const m=U(l,"수업 내역을 불러오지 못했습니다.");H(m),G(m)})},children:q[s.id]?t.jsx("span",{style:{color:"#64748b",fontSize:12},children:"불러오는 중…"}):Z[s.id]?t.jsx("span",{style:{color:"#9ca3af",fontSize:12},children:"아래로 스크롤하면 더 불러옵니다"}):t.jsx("span",{style:{color:"#9ca3af",fontSize:12},children:"마지막입니다"})})]})]},s.id))]})]}):t.jsx(B,{title:"선택한 수업이 없어요. 왼쪽에서 수업을 선택해주세요."}):t.jsx(B,{title:"수업을 선택하고 기간을 설정한 후 조회해주세요."})}),t.jsx(Et,{children:t.jsx(Tt,{children:t.jsx(Bt,{type:"button",onClick:ve,disabled:!R,"aria-label":"AI요약",children:"AI요약"})})})]})})]})]})}function Ie({onVisible:e,children:$}){const x=a.useRef(null);return a.useEffect(()=>{const g=x.current;if(!g)return;const b=new IntersectionObserver(c=>{for(const p of c)if(p.isIntersecting){e();break}},{root:null,rootMargin:"200px 0px",threshold:0});return b.observe(g),()=>b.disconnect()},[e]),t.jsx("div",{ref:x,style:{display:"grid",placeItems:"center",padding:"8px 0"},children:$})}const Le=n.div`
  height: calc(100vh - 48px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
`,He=n.div`
  padding: 0 ${e=>e.theme.spacing.xs};
  display: grid;
  gap: ${e=>e.theme.spacing.sm};
`,Ge=n.div`
  display: inline-flex;
  gap: ${e=>e.theme.spacing.sm};
  flex-wrap: wrap;
  justify-content: flex-end;
`,_e=n.div`
  display: grid;
  gap: ${e=>e.theme.spacing.xl};
  grid-template-columns: 1fr;
  flex: 1;
  min-height: 0;
  overflow: hidden;
  @media (min-width: 1120px) {
    grid-template-columns: 360px 1fr;
  }
`,Xe=n.div`
  display: flex;
  min-height: 0;
  overflow: hidden;
`,Ke=n.div`
  display: grid;
  gap: ${e=>e.theme.spacing.xl};
  min-height: 0;
`,Oe=n.div`
  flex: 1;
  min-height: 0;
  overflow: auto;
  display: grid;
  gap: ${e=>e.theme.spacing.xl};
`,Qe=n(me)`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: ${e=>e.theme.spacing.xl};
`,Ue=n(me)`
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: ${e=>e.theme.spacing.xl};
`,le=n.div`
  display: grid;
  gap: ${e=>e.theme.spacing.xs};
`,ce=n.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 800;
  letter-spacing: -0.01em;
  color: ${({theme:e})=>e.colors.text};
`,Ve=n.p`
  margin: 0;
  font-size: ${e=>e.theme.font.size.sm};
  color: ${({theme:e})=>e.colors.textMuted};
`,N=n.div`
  display: grid;
  gap: ${e=>e.theme.spacing.sm};
`,We=n.div`
  display: flex;
  align-items: center;
  height: 40px;
  padding: 0 ${e=>e.theme.spacing.md};
  border-radius: ${e=>e.theme.radii.md};
  border: 1px solid ${({theme:e})=>e.colors.border};
  background: #fff;
  box-shadow: inset 0 1px 2px rgba(15, 23, 42, 0.04);
`,Ze=n.input`
  flex: 1;
  border: 0;
  background: transparent;
  font-size: 14px;
  color: ${({theme:e})=>e.colors.text};
  &:focus {
    outline: none;
  }
`,de=n.span`
  font-size: ${e=>e.theme.font.size.sm};
  color: ${({theme:e})=>e.colors.textMuted};
`,qe=n.span`
  font-size: ${e=>e.theme.font.size.sm};
  color: #dc2626;
  font-weight: 600;
`,Je=n.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${e=>e.theme.spacing.sm};
`,Q=n.div`
  font-size: ${e=>e.theme.font.size.sm};
  font-weight: 800;
  color: ${({theme:e})=>e.colors.text};
`,et=n.div`
  display: inline-flex;
  align-items: center;
  gap: ${e=>e.theme.spacing.sm};
  font-size: ${e=>e.theme.font.size.sm};
  color: ${({theme:e})=>e.colors.textMuted};
`,tt=n.div`
  display: grid;
  gap: ${e=>e.theme.spacing.sm};
  grid-template-columns: 1fr;
  @media (min-width: 720px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`,st=n.button`
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
`,ot=n.div`
  flex: 0 0 auto;
  max-height: 220px;
  overflow: auto;
  border-radius: ${e=>e.theme.radii.md};
  padding: ${e=>e.theme.spacing.sm};
  background: ${({theme:e})=>e.colors.surfaceMuted};
  border: 1px solid ${({theme:e})=>e.colors.borderMuted};
`,nt=n.div`
  display: flex;
  gap: ${e=>e.theme.spacing.xs};
  flex-wrap: wrap;
  margin-bottom: ${e=>e.theme.spacing.xs};
`,rt=n.span`
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
`,it=n.button`
  border: 0;
  background: transparent;
  color: ${({theme:e})=>e.colors.textMuted};
  font-size: ${e=>e.theme.font.size.sm};
  text-decoration: underline;
  cursor: pointer;
`,at=n.div`
  display: grid;
  gap: ${e=>e.theme.spacing.sm};
  grid-template-columns: repeat(2, minmax(0, 1fr));
`,P=n.button`
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
`,lt=n.div`
  display: grid;
  gap: ${e=>e.theme.spacing.sm};
  grid-template-columns: repeat(2, minmax(0, 1fr));
`,pe=n.label`
  display: grid;
  gap: ${e=>e.theme.spacing.xs};
  font-size: ${e=>e.theme.font.size.sm};
  color: ${({theme:e})=>e.colors.textMuted};
`,ue=n.input`
  height: 38px;
  border-radius: ${e=>e.theme.radii.md};
  border: 1px solid ${({theme:e})=>e.colors.border};
  padding: 0 ${e=>e.theme.spacing.md};
  background: #fff;
  font-size: ${e=>e.theme.font.size.sm};
`,ct=n.div`
  font-size: ${e=>e.theme.font.size.sm};
  color: ${({theme:e})=>e.colors.textMuted};
  padding-top: ${e=>e.theme.spacing.xs};
`,dt=n.div`
  position: sticky;
  bottom: 0;
  background: ${({theme:e})=>e.colors.surface};
  /* remove dividing line under filter section */
  border-top: 0;
  padding-top: ${e=>e.theme.spacing.md};
  margin-top: ${e=>e.theme.spacing.sm};
`,pt=n.div`
  display: flex;
  justify-content: flex-end;
  gap: ${e=>e.theme.spacing.sm};
`,ut=n.div`
  flex: 1;
  min-height: 0;
  overflow: auto;
`,mt=n.div`
  display: grid;
  gap: ${e=>e.theme.spacing.xl};
`,gt=n.div`
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
`,ht=n.span`
  display: block;
  color: #b91c1c;
  font-weight: 700;
  font-size: ${e=>e.theme.font.size.sm};
`,ft=n.div`
  display: grid;
  gap: ${e=>e.theme.spacing.lg};
`,xt=n.section`
  border: 1px solid ${({theme:e})=>e.colors.border};
  border-radius: ${({theme:e})=>e.radii.xl};
  background: ${({theme:e})=>e.colors.surface};
  padding: ${e=>e.theme.spacing.xl};
  display: grid;
  gap: ${e=>e.theme.spacing.md};
`,bt=n.div`
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
`,$t=n.div`
  display: grid;
  gap: ${e=>e.theme.spacing.md};
`,yt=n.div`
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
`,jt=n.div`
  min-width: 124px;
  display: grid;
  gap: 4px;
  padding: 10px 12px;
  border-radius: 12px;
  background: ${({theme:e})=>e.colors.surfaceMuted};
  border: 1px solid ${({theme:e})=>e.colors.borderMuted};
  color: ${({theme:e})=>e.colors.text};
  text-align: center;
`,wt=n.span`
  font-size: 13px;
  font-weight: 700;
  line-height: 1.35;
`,vt=n.span`
  font-size: 11px;
  font-weight: 600;
  color: ${({theme:e})=>e.colors.textMuted};
  letter-spacing: 0.04em;
`,kt=n.div`
  flex: 1;
  min-width: 0;
  display: grid;
  gap: 8px;
`,Mt=n.div`
  display: flex;
  align-items: center;
  gap: ${e=>e.theme.spacing.xs};
  flex-wrap: wrap;
`,St=n.span`
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
`,zt=n.p`
  margin: 0;
  font-size: 13px;
  font-weight: 600;
  color: ${({theme:e})=>e.colors.text};
  line-height: 1.6;
  padding-left: ${e=>e.theme.spacing.md};
  border-left: 3px solid ${({theme:e})=>e.colors.primary};
  word-break: break-word;
`,Ct=n.span`
  font-size: 11px;
  font-weight: 700;
  color: #047857;
  background: rgba(16, 185, 129, 0.14);
  border-radius: 999px;
  padding: 4px 10px;
  letter-spacing: 0.04em;
`,Rt=n.ul`
  margin: 0;
  padding-left: 18px;
  display: grid;
  gap: 6px;
  list-style: disc;
  font-size: 12.5px;
  color: ${({theme:e})=>e.colors.textMuted};
  line-height: 1.6;
`,Dt=n.li`
  margin: 0;
  padding: 0;
  word-break: break-word;
`,Et=n.div`
  position: sticky;
  bottom: 0;
  background: ${({theme:e})=>e.colors.surface};
  border-top: 1px solid ${({theme:e})=>e.colors.borderMuted};
  padding-top: ${e=>e.theme.spacing.md};
  margin-top: ${e=>e.theme.spacing.md};
  display: flex;
  justify-content: flex-end;
`,Tt=n.div`
  display: flex;
  align-items: center;
  gap: ${e=>e.theme.spacing.sm};
`,Bt=n.button`
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
`;export{Lt as default};
