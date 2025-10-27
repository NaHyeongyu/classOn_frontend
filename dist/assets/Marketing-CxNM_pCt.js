import{j as t,d as s,r,u as ve,c as Se}from"./index-B0K7mn4q.js";import{f as re,j as we,S as ie,b as Me,k as Z}from"./UI-Cj3YhchZ.js";import{f as ke,r as ae,t as W,y as O,a as ze,n as q}from"./utils-D2trpR9j.js";import{E as _}from"./EmptyPlaceholder-0vR7E1DK.js";import{f as Re,b as De}from"./format-DW-Kl_C3.js";import{l as Pe,b as Te}from"./courses-DlbPyXYO.js";import{M as Ee,a as X}from"./constants-UoNuUtwe.js";const Fe=[{key:"7d",label:"최근 7일"},{key:"30d",label:"최근 30일"},{key:"thisMonth",label:"이번 달"},{key:"lastMonth",label:"지난 달"}];function Be({courseQuery:e,onCourseQueryChange:h,filteredCourses:x,selectedCourses:u,selectedCourseIds:p,onToggleCourse:d,onClearSelected:m,maxSelectable:c,loadingCourses:f,coursesError:g,preset:k,onSelectPreset:D,from:M,to:P,onChangeFrom:T,onChangeTo:z,rangeSummary:b,onSubmit:C,onReset:j,loading:R}){const v=i=>{try{i.showPicker?.()}catch{}},y=p.length;return t.jsxs(Ne,{children:[t.jsx(Le,{children:t.jsx(Ae,{children:"수업 내역 조회"})}),t.jsxs(He,{children:[t.jsxs(G,{children:[t.jsx(Ye,{children:t.jsx(Ie,{id:"marketing-course-search",placeholder:"수업을 검색해 선택하세요",value:e,onChange:i=>h(i.target.value)})}),f?t.jsx(J,{children:"수업을 불러오는 중입니다…"}):null,g?t.jsx(_e,{children:g}):null]}),t.jsxs(G,{children:[t.jsxs(Ge,{children:[t.jsx(V,{children:"수업 선택"}),t.jsxs(Qe,{children:[t.jsxs("span",{children:["선택 ",y,"/",c]}),y>0?t.jsx(Ke,{type:"button",onClick:m,children:"전체 해제"}):null]})]}),u.length>0?t.jsx(Oe,{children:u.map(i=>t.jsxs(Ve,{children:[t.jsx("span",{className:"title",children:i.title}),t.jsx("button",{type:"button","aria-label":"선택 해제",onClick:()=>d(i.id),children:"×"})]},i.id))}):null,t.jsx(We,{children:t.jsx(Ue,{role:"list","aria-label":"수업 목록",children:x.map(i=>{const $=p.includes(i.id),S=!$&&y>=c;return t.jsxs(Ze,{type:"button",role:"listitem","data-selected":$||void 0,"data-disabled":S||void 0,onClick:()=>{S&&!$||d(i.id)},children:[t.jsx("div",{className:"title",children:i.title}),t.jsx("div",{className:"meta",children:ke(i)})]},i.id)})})}),y===0?t.jsxs(J,{children:["최대 ",c,"개까지 선택할 수 있어요."]}):null]}),t.jsxs(G,{children:[t.jsx(V,{children:"빠른 기간 선택"}),t.jsx(qe,{children:Fe.map(i=>t.jsx(Xe,{type:"button","data-active":k===i.key,onClick:()=>D(i.key),children:i.label},i.key))})]}),t.jsxs(G,{children:[t.jsx(V,{children:"기간 직접 입력"}),t.jsxs(Je,{children:[t.jsxs(ee,{children:[t.jsx("span",{children:"시작일"}),t.jsx(te,{type:"date",lang:"ko-KR",inputMode:"numeric",pattern:"^\\\\d{4}-\\\\d{2}-\\\\d{2}$",placeholder:"YYYY-MM-DD",value:M,onFocus:i=>v(i.currentTarget),onChange:i=>T(i.target.value),onBlur:i=>T(i.currentTarget.value)})]}),t.jsxs(ee,{children:[t.jsx("span",{children:"종료일"}),t.jsx(te,{type:"date",lang:"ko-KR",inputMode:"numeric",pattern:"^\\\\d{4}-\\\\d{2}-\\\\d{2}$",placeholder:"YYYY-MM-DD",value:P,onFocus:i=>v(i.currentTarget),onChange:i=>z(i.target.value),onBlur:i=>z(i.currentTarget.value)})]})]}),t.jsxs(et,{children:[b.label,b.days?` · 총 ${b.days}일`:null]})]})]}),t.jsx(tt,{children:t.jsxs(st,{children:[t.jsx(re,{type:"button",onClick:C,disabled:R,children:R?"조회 중...":"조회하기"}),t.jsx(we,{as:"button",type:"button",onClick:j,children:"초기화"})]})})]})}const Ne=s(ie)`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: ${e=>e.theme.spacing.xl};
`,Le=s.div`
  display: grid;
  gap: ${e=>e.theme.spacing.xs};
`,Ae=s.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 800;
  letter-spacing: -0.01em;
  color: ${({theme:e})=>e.colors.text};
`,He=s.div`
  flex: 1;
  min-height: 0;
  overflow: auto;
  display: grid;
  gap: ${e=>e.theme.spacing.xl};
`,G=s.div`
  display: grid;
  gap: ${e=>e.theme.spacing.sm};
`,Ye=s.div`
  display: flex;
  align-items: center;
  height: 40px;
  padding: 0 ${e=>e.theme.spacing.md};
  border-radius: ${e=>e.theme.radii.md};
  border: 1px solid ${({theme:e})=>e.colors.border};
  background: #fff;
  box-shadow: inset 0 1px 2px rgba(15, 23, 42, 0.04);
`,Ie=s.input`
  flex: 1;
  border: 0;
  background: transparent;
  font-size: 14px;
  color: ${({theme:e})=>e.colors.text};
  &:focus {
    outline: none;
  }
`,J=s.span`
  font-size: ${e=>e.theme.font.size.sm};
  color: ${({theme:e})=>e.colors.textMuted};
`,_e=s.span`
  font-size: ${e=>e.theme.font.size.sm};
  color: #dc2626;
  font-weight: 600;
`,Ge=s.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${e=>e.theme.spacing.sm};
`,V=s.div`
  font-size: ${e=>e.theme.font.size.sm};
  font-weight: 800;
  color: ${({theme:e})=>e.colors.text};
`,Qe=s.div`
  display: inline-flex;
  align-items: center;
  gap: ${e=>e.theme.spacing.sm};
  font-size: ${e=>e.theme.font.size.sm};
  color: ${({theme:e})=>e.colors.textMuted};
`,Ke=s.button`
  border: 0;
  background: transparent;
  color: ${({theme:e})=>e.colors.primary};
  font-size: ${e=>e.theme.font.size.sm};
  cursor: pointer;
  text-decoration: underline;
`,Oe=s.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${e=>e.theme.spacing.xs};
`,Ve=s.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 999px;
  background: #eef2ff;
  font-size: 13px;
  color: #312e81;
  button {
    border: 0;
    background: transparent;
    color: currentColor;
    cursor: pointer;
    font-size: 14px;
    line-height: 1;
  }
`,We=s.div`
  border: 1px solid ${({theme:e})=>e.colors.border};
  border-radius: ${e=>e.theme.radii.md};
  max-height: 320px;
  overflow: hidden;
`,Ue=s.div`
  max-height: 320px;
  overflow-y: auto;
  display: grid;
`,Ze=s.button`
  text-align: left;
  padding: ${e=>e.theme.spacing.sm} ${e=>e.theme.spacing.md};
  border: 0;
  border-bottom: 1px solid ${({theme:e})=>e.colors.border};
  background: ${({theme:e})=>e.colors.surface};
  display: grid;
  gap: 4px;
  transition: background 0.18s ease;
  &:last-child {
    border-bottom: 0;
  }
  .title {
    font-weight: 600;
    color: ${({theme:e})=>e.colors.text};
  }
  .meta {
    font-size: 12px;
    color: ${({theme:e})=>e.colors.textMuted};
  }
  &[data-selected="true"] {
    background: ${({theme:e})=>e.colors.primarySurface};
  }
  &[data-disabled="true"] {
    opacity: 0.5;
    cursor: not-allowed;
  }
`,qe=s.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: ${e=>e.theme.spacing.sm};
`,Xe=s.button`
  height: 40px;
  border-radius: ${e=>e.theme.radii.md};
  border: 1px solid ${({theme:e})=>e.colors.border};
  background: ${({theme:e})=>e.colors.surface};
  font-size: ${e=>e.theme.font.size.sm};
  cursor: pointer;
  &[data-active="true"] {
    border-color: ${({theme:e})=>e.colors.primary};
    background: ${({theme:e})=>e.colors.primarySurface};
    color: ${({theme:e})=>e.colors.primary};
  }
`,Je=s.div`
  display: grid;
  gap: ${e=>e.theme.spacing.sm};
`,ee=s.label`
  display: grid;
  gap: 4px;
  font-size: ${e=>e.theme.font.size.sm};
  color: ${({theme:e})=>e.colors.textMuted};
  span {
    font-weight: 600;
  }
`,te=s.input`
  height: 40px;
  border-radius: ${e=>e.theme.radii.md};
  border: 1px solid ${({theme:e})=>e.colors.border};
  padding: 0 ${e=>e.theme.spacing.sm};
  font-size: ${e=>e.theme.font.size.sm};
  color: ${({theme:e})=>e.colors.text};
  &:focus {
    outline: none;
    border-color: ${({theme:e})=>e.colors.primary};
    box-shadow: ${({theme:e})=>e.shadow.focusPrimary};
  }
`,et=s.p`
  margin: 0;
  font-size: ${e=>e.theme.font.size.sm};
  color: ${({theme:e})=>e.colors.textMuted};
`,tt=s.div`
  display: grid;
  gap: ${e=>e.theme.spacing.sm};
`,st=s.div`
  display: flex;
  align-items: center;
  gap: ${e=>e.theme.spacing.sm};
`;function nt({loading:e,hasSearched:h,courseSections:x,totalRecords:u,from:p,to:d,recordsError:m,loadingByCourse:c,hasMoreByCourse:f,onLoadMore:g,results:k,todayYmd:D,onSummarize:M,canSummarize:P}){const z=e?t.jsx(_,{title:"조회 중입니다..."}):h?x.length?u===0?t.jsx(_,{title:"선택한 기간에 해당하는 수업 기록이 없습니다."}):null:t.jsx(_,{title:"선택한 수업이 없어요. 왼쪽에서 수업을 선택해주세요."}):t.jsx(_,{title:"수업을 선택하고 기간을 설정한 후 조회해주세요."});return t.jsxs(rt,{children:[t.jsxs(it,{children:[t.jsx(at,{children:"조회 결과"}),t.jsx(lt,{children:"선택한 수업과 기간에 해당하는 기록이 표시돼요."})]}),t.jsx(ct,{children:z||t.jsxs(dt,{children:[t.jsxs(ut,{children:[t.jsxs("span",{children:["총 ",u,"건"]}),p&&d?t.jsxs("span",{children:[p," ~ ",d]}):null]}),t.jsxs(pt,{children:[m?t.jsx(ht,{role:"alert",children:m}):null,x.map(({course:b,rows:C})=>t.jsxs(mt,{children:[t.jsxs(gt,{children:[t.jsx("span",{className:"title",children:b.title}),t.jsxs("span",{className:"count",children:[k[b.id]?.length??0,"건"]})]}),t.jsxs(xt,{children:[C.map(j=>{const R=j.recordDate,v=Re(j.startTime,j.endTime),y=!v.includes("--"),$=ae(j).split(/\n+/).map(w=>w.trim()).filter(Boolean),S=$[0]??"(기록된 내용이 없습니다)",A=$.slice(1).map(w=>w.replace(/^[-•]\s*/u,"")).filter(Boolean);return t.jsxs(ft,{"data-active":se(j,D)||void 0,children:[t.jsxs(jt,{children:[t.jsx(bt,{children:De(R)}),y?t.jsx(yt,{children:v}):null]}),t.jsxs($t,{children:[t.jsxs(Ct,{children:[j.topic?t.jsx(vt,{children:j.topic}):null,se(j,D)?t.jsx(St,{children:"진행 중"}):null]}),t.jsx(wt,{children:S}),A.length?t.jsx(Mt,{children:A.map((w,H)=>t.jsx(kt,{children:w},`${j.id}-${H}`))}):null]})]},`${b.id}:${j.id}`)}),t.jsx(ot,{onVisible:()=>g(b.id),loading:c[b.id],hasMore:f[b.id]??!1})]})]},b.id))]})]})}),t.jsx(zt,{children:t.jsx(Rt,{children:t.jsx(re,{type:"button",onClick:M,disabled:!P,children:"AI요약"})})})]})}function ot({onVisible:e,loading:h,hasMore:x}){const u=r.useRef(null);return r.useEffect(()=>{const p=u.current;if(!p)return;const d=new IntersectionObserver(m=>{for(const c of m)if(c.isIntersecting){e();break}},{root:null,rootMargin:"200px 0px",threshold:0});return d.observe(p),()=>d.disconnect()},[e]),t.jsx(Dt,{ref:u,children:h?t.jsx("span",{children:"불러오는 중…"}):x?t.jsx("span",{children:"아래로 스크롤하면 더 불러옵니다."}):t.jsx("span",{children:"마지막입니다."})})}function se(e,h){if(!e.recordDate||e.recordDate!==h||!e.startTime||!e.endTime)return!1;const x=ne(e.recordDate,e.startTime),u=ne(e.recordDate,e.endTime);if(!x||!u)return!1;const p=new Date;return p>=x&&p<=u}function ne(e,h){const[x,u,p]=e.split("-").map(Number),d=h.match(/(\\d{2}):(\\d{2})/);if(!d||!Number.isFinite(x)||!Number.isFinite(u)||!Number.isFinite(p))return null;const[,m,c]=d,f=new Date;return f.setFullYear(x,u-1,p),f.setHours(Number(m),Number(c),0,0),Number.isNaN(f.getTime())?null:f}const rt=s(ie)`
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: ${e=>e.theme.spacing.xl};
`,it=s.div`
  display: grid;
  gap: ${e=>e.theme.spacing.xs};
`,at=s.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 800;
`,lt=s.p`
  margin: 0;
  font-size: ${e=>e.theme.font.size.sm};
  color: ${({theme:e})=>e.colors.textMuted};
`,ct=s.div`
  flex: 1;
  min-height: 0;
  display: grid;
`,dt=s.div`
  display: grid;
  gap: ${e=>e.theme.spacing.lg};
`,ut=s.div`
  display: inline-flex;
  gap: ${e=>e.theme.spacing.sm};
  font-size: ${e=>e.theme.font.size.sm};
  color: ${({theme:e})=>e.colors.textMuted};
`,pt=s.div`
  display: grid;
  gap: ${e=>e.theme.spacing.lg};
`,ht=s.span`
  color: #dc2626;
  font-size: ${e=>e.theme.font.size.sm};
`,mt=s.section`
  display: grid;
  gap: ${e=>e.theme.spacing.sm};
`,gt=s.header`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  .title {
    font-weight: 700;
    color: ${({theme:e})=>e.colors.text};
  }
  .count {
    font-size: 12px;
    color: ${({theme:e})=>e.colors.textMuted};
  }
`,xt=s.div`
  display: grid;
  gap: ${e=>e.theme.spacing.md};
`,ft=s.article`
  display: grid;
  gap: ${e=>e.theme.spacing.sm};
  padding-bottom: ${e=>e.theme.spacing.sm};
  border-bottom: 1px solid ${({theme:e})=>e.colors.border};
  &[data-active="true"] {
    border-color: ${({theme:e})=>e.colors.primary};
  }
`,jt=s.div`
  display: inline-flex;
  gap: ${e=>e.theme.spacing.xs};
  align-items: baseline;
  font-size: ${e=>e.theme.font.size.sm};
  color: ${({theme:e})=>e.colors.textMuted};
`,bt=s.span`
  font-weight: 600;
  color: ${({theme:e})=>e.colors.text};
`,yt=s.span`
  font-size: 12px;
  color: ${({theme:e})=>e.colors.textMuted};
`,$t=s.div`
  display: grid;
  gap: ${e=>e.theme.spacing.xs};
`,Ct=s.div`
  display: inline-flex;
  align-items: center;
  gap: ${e=>e.theme.spacing.xs};
`,vt=s.span`
  font-weight: 700;
  color: ${({theme:e})=>e.colors.text};
`,St=s.span`
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  background: #dcfce7;
  color: #047857;
`,wt=s.p`
  margin: 0;
  font-size: ${e=>e.theme.font.size.sm};
  color: ${({theme:e})=>e.colors.text};
`,Mt=s.ul`
  margin: 0;
  padding-left: ${e=>e.theme.spacing.lg};
  font-size: ${e=>e.theme.font.size.sm};
  color: ${({theme:e})=>e.colors.textMuted};
`,kt=s.li`
  line-height: 1.5;
`,zt=s.div`
  display: flex;
  justify-content: flex-end;
`,Rt=s.div`
  display: inline-flex;
  align-items: center;
  gap: ${e=>e.theme.spacing.sm};
`,Dt=s.div`
  display: grid;
  place-items: center;
  padding: 8px 0;
  font-size: 12px;
  color: #9ca3af;
`;function Pt({filterProps:e,resultsProps:h}){return t.jsxs(Tt,{children:[t.jsxs(Et,{children:[t.jsxs(Me,{children:[t.jsxs("div",{children:[t.jsx("h2",{children:"마케팅"}),t.jsx("p",{children:"수업 기록을 모아 AI 요약과 콘텐츠로 이어가세요."})]}),t.jsxs(Bt,{children:[t.jsx(Z,{to:"/marketing/saved",children:"저장 내역"}),t.jsx(Z,{to:"/classes",children:"수업 관리"})]})]}),t.jsxs(Ft,{role:"status",children:[t.jsx("strong",{children:"안내"}),t.jsx("p",{children:"마케팅 기능 출력 결과가 아직 원활하지 않을 수 있습니다."}),t.jsx("p",{children:"빠른시일 내 데이터를 확인 & 분석해서 개선하겠습니다."})]})]}),t.jsxs(Nt,{children:[t.jsx(Lt,{children:t.jsx(Be,{...e})}),t.jsx(At,{children:t.jsx(nt,{...h})})]})]})}const Tt=s.div`
  height: calc(100vh - 48px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
`,Et=s.div`
  padding: 0 ${e=>e.theme.spacing.xs};
  display: grid;
  gap: ${e=>e.theme.spacing.sm};
`,Ft=s.div`
  padding: 10px ${e=>e.theme.spacing.sm};
  border-radius: ${e=>e.theme.radii.md};
  background: #eef2ff;
  border: 1px solid #c7d2fe;
  color: #312e81;
  font-size: ${e=>e.theme.font.size.sm};
  line-height: 1.5;
  display: grid;
  gap: 4px;
  strong {
    font-weight: 700;
  }
  p {
    margin: 0;
  }
`,Bt=s.div`
  display: inline-flex;
  gap: ${e=>e.theme.spacing.sm};
  flex-wrap: wrap;
  justify-content: flex-end;
`,Nt=s.div`
  display: grid;
  gap: ${e=>e.theme.spacing.xl};
  grid-template-columns: 1fr;
  flex: 1;
  min-height: 0;
  overflow: hidden;
  @media (min-width: 1120px) {
    grid-template-columns: 360px 1fr;
  }
`,Lt=s.div`
  display: flex;
  min-height: 0;
  overflow: hidden;
`,At=s.div`
  display: grid;
  gap: ${e=>e.theme.spacing.xl};
  min-height: 0;
`;function Ht(){const[e,h]=r.useState([]),[x,u]=r.useState(!0),[p,d]=r.useState(null);return r.useEffect(()=>{let m=!0;async function c(){try{u(!0),d(null);const f=await Pe({status:"IN_PROGRESS",size:Ee});if(!m)return;h(f.content??[])}catch(f){if(!m)return;h([]),d(W(f,"수업 목록을 불러오지 못했습니다."))}finally{m&&u(!1)}}return c(),()=>{m=!1}},[]),{courses:e,loading:x,error:p}}const oe=30;function Yt(){const{courses:e,loading:h,error:x}=Ht(),[u,p]=r.useState(""),[d,m]=r.useState([]),[c,f]=r.useState(""),[g,k]=r.useState(""),[D,M]=r.useState(null),[P,T]=r.useState(!1),[z,b]=r.useState(!1),[C,j]=r.useState({}),[R,v]=r.useState({}),[y,i]=r.useState({}),[$,S]=r.useState({}),[A,w]=r.useState(null),H=ve(),{error:F,warning:B}=Se(),le=r.useMemo(()=>{const n=u.trim().toLowerCase();return n?e.filter(o=>o.title.toLowerCase().includes(n)):e},[e,u]),N=r.useMemo(()=>e.filter(n=>d.includes(n.id)),[e,d]),ce=r.useMemo(()=>O(new Date),[]),U=r.useMemo(()=>{const n=[];for(const o of N){const a=C[o.id]||[];for(const l of a){const E=ae(l);n.push({date:l.recordDate,content:E,courseTitle:o.title})}}return n.sort((o,a)=>o.date.localeCompare(a.date)),n},[C,N]),Q=r.useMemo(()=>N.map(n=>{const o=(C[n.id]||[]).slice().sort((a,l)=>a.recordDate.localeCompare(l.recordDate));return{course:n,rows:o}}),[C,N]),Y=r.useMemo(()=>Q.reduce((n,o)=>n+o.rows.length,0),[Q]),de=r.useMemo(()=>ze(c,g),[c,g]),ue=r.useCallback(n=>{p(n)},[]),pe=r.useCallback(()=>{m([])},[]),he=r.useCallback(n=>{const o=q(n);f(o),M(null)},[]),me=r.useCallback(n=>{const o=q(n);k(o),M(null)},[]),ge=r.useCallback(n=>{m(o=>o.includes(n)?o.filter(l=>l!==n):o.length>=X?o:[...o,n])},[]),L=r.useCallback((n,o,a)=>{f(O(o)),k(O(a)),M(n)},[]),xe=r.useCallback(n=>{const o=new Date,a=new Date(o.getFullYear(),o.getMonth(),o.getDate());if(n==="7d"){const l=new Date(a);l.setDate(a.getDate()-6),L(n,l,a)}else if(n==="30d"){const l=new Date(a);l.setDate(a.getDate()-29),L(n,l,a)}else if(n==="thisMonth"){const l=new Date(a.getFullYear(),a.getMonth(),1);L(n,l,a)}else if(n==="lastMonth"){const l=new Date(a.getFullYear(),a.getMonth()-1,1),E=new Date(a.getFullYear(),a.getMonth(),0);L(n,l,E)}},[L]),I=r.useCallback(async(n,o)=>{if(!(!c||!g)){S(a=>({...a,[n]:!0}));try{const a=await Te(n,{from:c,to:g,page:o,size:oe});j(l=>{const E=l[n]||[],$e=new Set(E.map(K=>K.id)),Ce=E.concat(a.filter(K=>!$e.has(K.id)));return{...l,[n]:Ce}}),v(l=>({...l,[n]:o})),i(l=>({...l,[n]:a.length>=oe}))}finally{S(a=>({...a,[n]:!1}))}}},[c,g]),fe=r.useCallback(async()=>{if(!d.length){B("수업을 하나 이상 선택해주세요.");return}if(!c||!g){B("조회 기간(시작/종료일)을 선택해주세요.");return}if(c>g){F("조회 기간이 올바르지 않습니다. 시작일이 종료일보다 늦습니다.");return}try{b(!0),T(!0),w(null),j({});const n={},o={},a={};for(const l of d)n[l]=-1,o[l]=!0,a[l]=!1;v(n),i(o),S(a),await Promise.all(d.map(l=>I(l,0)))}catch(n){const o=W(n,"수업 내역을 불러오지 못했습니다.");w(o),F(o)}finally{T(!1)}},[I,c,d,F,g,B]),je=r.useCallback(()=>{m([]),p(""),f(""),k(""),M(null),b(!1),j({}),v({}),i({}),S({})},[]),be=r.useCallback(n=>{if(!c||!g||$[n]||y[n]===!1)return;const o=(R[n]??0)+1;I(n,o).catch(a=>{const l=W(a,"수업 내역을 불러오지 못했습니다.");w(l),F(l)})},[I,c,y,$,R,F,g]),ye=r.useCallback(()=>{if(!Y){B("먼저 조회를 실행해주세요.");return}H("/marketing/generating",{state:{items:U,tone:"WARM_VIVID",speechStyle:"SEUMNIDA",platformChoice:"INSTAGRAM"}})},[U,H,Y,B]);return{filterProps:{courseQuery:u,onCourseQueryChange:ue,filteredCourses:le,selectedCourses:N,selectedCourseIds:d,onToggleCourse:ge,onClearSelected:pe,maxSelectable:X,loadingCourses:h,coursesError:x,preset:D,onSelectPreset:xe,from:c,to:g,onChangeFrom:he,onChangeTo:me,rangeSummary:de,onSubmit:fe,onReset:je,loading:P},resultsProps:{loading:P,hasSearched:z,courseSections:Q,totalRecords:Y,from:c,to:g,recordsError:A,loadingByCourse:$,hasMoreByCourse:y,onLoadMore:be,results:C,todayYmd:ce,onSummarize:ye,canSummarize:!!Y}}}function Wt(){const{filterProps:e,resultsProps:h}=Yt();return t.jsx(Pt,{filterProps:e,resultsProps:h})}export{Wt as default};
