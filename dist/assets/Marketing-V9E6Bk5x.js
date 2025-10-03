import{r as a,u as ze,g as ke,j as t,a as De,v as ne,I as oe,h as ie,d as i,R as re,S as me}from"./index-BONIAwcU.js";import{E as T}from"./EmptyPlaceholder-Q9LpzrIK.js";import{I as Re}from"./InfoBanner-BRFm5Fxt.js";import{l as Be,b as Te}from"./courses-CBS7EEZu.js";function Ct(){const[e,l]=a.useState([]),[c,d]=a.useState(!0),[$,w]=a.useState(null),[y,V]=a.useState(""),[m,I]=a.useState([]),[g,v]=a.useState(""),[f,S]=a.useState(""),[C,M]=a.useState(null),[E,W]=a.useState(!1),ge=!1,fe=null,[xe,_]=a.useState(!1),[j,Y]=a.useState({}),[$e,A]=a.useState({}),[O,H]=a.useState({}),[q,z]=a.useState({}),[U,Z]=a.useState(!0),[be,ye]=a.useState(!1),je=ze(),{error:J,warning:L}=ke();a.useEffect(()=>{let s=!1;async function n(){try{d(!0),w(null);const o=await Be({status:"IN_PROGRESS",size:500});s||l(o.content??[])}catch(o){console.error(o),s||w("수업 목록을 불러오는 데 실패했습니다.")}finally{s||d(!1)}}return n(),()=>{s=!0}},[]);const we=a.useMemo(()=>{const s=y.trim().toLowerCase();return s?e.filter(n=>n.title.toLowerCase().includes(s)):e},[e,y]),b=a.useMemo(()=>e.filter(s=>m.includes(s.id)),[e,m]),ve=a.useMemo(()=>{const s=[];for(const n of b){const o=j[n.id]||[];for(const r of o){const u=ae(r);s.push({date:r.recordDate,content:u,courseTitle:n.title})}}return s.sort((n,o)=>n.date.localeCompare(o.date)),s},[j,b]),k=a.useMemo(()=>b.map(s=>{const n=(j[s.id]||[]).slice().sort((o,r)=>o.recordDate.localeCompare(r.recordDate));return{course:s,rows:n}}),[j,b]),G=a.useMemo(()=>k.reduce((s,n)=>s+n.rows.length,0),[k]),Q=a.useMemo(()=>Ee(g,f),[g,f]);function X(s){I(n=>n.includes(s)?n.filter(r=>r!==s):n.length>=3?n:[...n,s])}function ee(s){const n=s.getFullYear(),o=String(s.getMonth()+1).padStart(2,"0"),r=String(s.getDate()).padStart(2,"0");return`${n}-${o}-${r}`}function D(s,n,o){v(ee(n)),S(ee(o)),M(s)}function R(s){const n=new Date,o=new Date(n.getFullYear(),n.getMonth(),n.getDate());if(s==="7d"){const r=new Date(o);r.setDate(o.getDate()-6),D(s,r,o)}else if(s==="30d"){const r=new Date(o);r.setDate(o.getDate()-29),D(s,r,o)}else if(s==="thisMonth"){const r=new Date(o.getFullYear(),o.getMonth(),1);D(s,r,o)}else if(s==="lastMonth"){const r=new Date(o.getFullYear(),o.getMonth()-1,1),u=new Date(o.getFullYear(),o.getMonth(),0);D(s,r,u)}}function B(s){const n=(s||"").trim();if(!n)return"";if(/^\d{4}-\d{2}-\d{2}$/.test(n))return n;const o=n.match(/^(\d{4})[./-]?(\d{2})[./-]?(\d{2})$/);if(o){const[,p,h,x]=o;return`${p}-${h}-${x}`}const r=n.match(/^(\d{1,2})[./-](\d{1,2})[./-](\d{4})$/);if(r){let[,p,h,x]=r;return p=String(p).padStart(2,"0"),h=String(h).padStart(2,"0"),`${x}-${p}-${h}`}const u=n.replace(/\D/g,"");if(u.length===8)if(/^\d{4}/.test(u)){const p=u.slice(0,4),h=u.slice(4,6),x=u.slice(6,8);return`${p}-${h}-${x}`}else{const p=u.slice(0,2),h=u.slice(2,4);return`${u.slice(4,8)}-${p}-${h}`}return n}const te=30;async function se(s,n){if(!(!g||!f)){z(o=>({...o,[s]:!0}));try{const o=await Te(s,{from:g,to:f,page:n,size:te});Y(r=>{const u=r[s]||[],p=new Set(u.map(x=>x.id)),h=u.concat(o.filter(x=>!p.has(x.id)));return{...r,[s]:h}}),A(r=>({...r,[s]:n})),H(r=>({...r,[s]:o.length>=te}))}finally{z(o=>({...o,[s]:!1}))}}}async function Se(){if(!m.length){L("수업을 하나 이상 선택해주세요.");return}if(!g||!f){L("조회 기간(시작/종료일)을 선택해주세요.");return}if(g>f){J("조회 기간이 올바르지 않습니다. 시작일이 종료일보다 늦습니다.");return}try{_(!0),W(!0),Y({});const s={},n={},o={};for(const r of m)s[r]=-1,n[r]=!0,o[r]=!1;A(s),H(n),z(o),await Promise.all(m.map(r=>se(r,0)))}catch(s){console.error(s),J("수업 내역을 불러오지 못했습니다.")}finally{W(!1)}}function Ce(){I([]),V(""),v(""),S(""),M(null),_(!1),Y({}),A({}),H({}),z({})}async function Me(){if(!G){L("먼저 조회를 실행해주세요.");return}je("/marketing/generating",{state:{items:ve,tone:"WARM_VIVID",speechStyle:"SEUMNIDA",platformChoice:"INSTAGRAM"}})}return t.jsxs(Ye,{children:[t.jsxs(Ae,{children:[t.jsxs(De,{children:[t.jsxs("div",{children:[t.jsx("h2",{children:"마케팅"}),t.jsx("p",{children:"수업 기록을 모아 AI 요약과 콘텐츠로 이어가세요."})]}),t.jsxs(He,{children:[t.jsx(ne,{to:"/marketing/saved",children:"저장 내역"}),t.jsx(ne,{to:"/classes",children:"수업 관리"}),!U&&be?t.jsx(oe,{as:"button",type:"button",onClick:()=>Z(!0),children:"도움말 보기"}):null]})]}),U?t.jsx(Re,{title:"AI 마케팅 요약 시작 가이드",description:"수업 기록을 선택하고 조회한 뒤 요약 만들기로 넘어가세요. 1분 안에 결과를 확인할 수 있어요.",tips:["좌측에서 최대 3개의 수업을 선택하고 조회 기간을 정해주세요.","조회 결과가 아래에 나타나면 내용을 확인한 뒤 필요하면 기간을 다시 조정해보세요.","요약 만들기 버튼을 누르면 AI 분석 화면으로 이동해 콘텐츠 초안을 받을 수 있어요."],onClose:()=>{Z(!1),ye(!0)}}):null]}),t.jsxs(Le,{children:[t.jsx(Ge,{children:t.jsxs(Ve,{children:[t.jsxs(le,{children:[t.jsx(ce,{children:"수업 내역 조회"}),t.jsx(de,{children:"수업을 선택하고 기간을 지정해 기록을 불러올 수 있어요."})]}),t.jsxs(Ke,{children:[t.jsxs(N,{children:[t.jsx(_e,{children:t.jsx(Oe,{id:"course-search",placeholder:"수업을 검색해 선택하세요",value:y,onChange:s=>V(s.target.value)})}),c?t.jsx(ue,{children:"수업을 불러오는 중입니다…"}):null,$?t.jsx(qe,{children:$}):null]}),t.jsxs(N,{children:[t.jsxs(Ue,{children:[t.jsx(K,{children:"수업 선택"}),t.jsxs(Ze,{children:[t.jsxs("span",{children:["선택 ",m.length,"/3"]}),m.length>0?t.jsx(nt,{type:"button",onClick:()=>I([]),children:"전체 해제"}):null]})]}),b.length>0?t.jsx(tt,{children:b.map(s=>t.jsxs(st,{children:[t.jsx("span",{className:"t",children:s.title}),t.jsx("button",{type:"button","aria-label":"제거",onClick:()=>X(s.id),children:"×"})]},s.id))}):null,t.jsx(et,{children:t.jsx(Je,{role:"list","aria-label":"수업 목록",children:we.map(s=>{const n=m.includes(s.id),o=!n&&m.length>=3;return t.jsxs(Xe,{type:"button",role:"listitem","data-selected":n||void 0,"data-disabled":o||void 0,onClick:()=>{(!o||n)&&X(s.id)},children:[t.jsx("div",{className:"title",children:s.title}),t.jsx("div",{className:"meta",children:Fe(s)})]},s.id)})})}),m.length?null:t.jsx(ue,{children:"최대 3개까지 선택할 수 있어요."})]}),t.jsxs(N,{children:[t.jsx(K,{children:"빠른 기간 선택"}),t.jsxs(ot,{children:[t.jsx(F,{type:"button","data-active":C==="7d",onClick:()=>R("7d"),children:"최근 7일"}),t.jsx(F,{type:"button","data-active":C==="30d",onClick:()=>R("30d"),children:"최근 30일"}),t.jsx(F,{type:"button","data-active":C==="thisMonth",onClick:()=>R("thisMonth"),children:"이번 달"}),t.jsx(F,{type:"button","data-active":C==="lastMonth",onClick:()=>R("lastMonth"),children:"지난 달"})]})]}),t.jsxs(N,{children:[t.jsx(K,{children:"직접 선택"}),t.jsxs(it,{children:[t.jsxs(pe,{children:[t.jsx("span",{children:"시작일"}),t.jsx(he,{type:"date",lang:"ko-KR",inputMode:"numeric",pattern:"^\\\\d{4}-\\\\d{2}-\\\\d{2}$",placeholder:"YYYY-MM-DD",onFocus:s=>{try{s.currentTarget.showPicker?.()}catch{}},value:g,onChange:s=>{const n=B(s.target.value);v(n),M(null)},onBlur:s=>{const n=B(s.currentTarget.value);n!==g&&v(n)}})]}),t.jsxs(pe,{children:[t.jsx("span",{children:"종료일"}),t.jsx(he,{type:"date",lang:"ko-KR",inputMode:"numeric",pattern:"^\\\\d{4}-\\\\d{2}-\\\\d{2}$",placeholder:"YYYY-MM-DD",onFocus:s=>{try{s.currentTarget.showPicker?.()}catch{}},value:f,onChange:s=>{const n=B(s.target.value);S(n),M(null)},onBlur:s=>{const n=B(s.currentTarget.value);n!==f&&S(n)}})]})]}),t.jsxs(rt,{children:[Q.label,Q.days?` · 총 ${Q.days}일`:null]})]})]}),t.jsx(at,{children:t.jsxs(lt,{children:[t.jsx(ie,{type:"button",onClick:Se,disabled:E,children:E?"조회 중...":"조회하기"}),t.jsx(oe,{as:"button",type:"button",onClick:Ce,children:"초기화"})]})})]})}),t.jsx(Qe,{children:t.jsxs(We,{children:[t.jsxs(le,{children:[t.jsx(ce,{children:"조회 결과"}),t.jsx(de,{children:"선택한 수업과 기간에 해당하는 기록이 표시돼요."})]}),t.jsx(ct,{children:E?t.jsx(T,{title:"조회 중입니다..."}):xe?k.length?G===0?t.jsx(T,{title:"선택한 기간에 해당하는 수업 기록이 없습니다."}):t.jsxs(dt,{children:[t.jsxs(ut,{children:[t.jsxs("span",{children:["총 ",G,"건"]}),g&&f?t.jsxs("span",{children:[g," ~ ",f]}):null]}),t.jsx(pt,{children:k.map(({course:s,rows:n})=>t.jsxs(ht,{children:[t.jsxs(mt,{children:[t.jsx("span",{className:"title",children:s.title}),t.jsxs("span",{className:"count",children:[j[s.id]?.length||0,"건"]})]}),t.jsxs(gt,{children:[n.map(o=>t.jsxs(ft,{children:[t.jsx(xt,{children:P(o.recordDate)}),t.jsx($t,{children:ae(o)})]},`${s.id}:${o.id}`)),t.jsx(Ne,{onVisible:()=>{const o=s.id;if(q[o]||O[o]===!1)return;const r=($e[o]??0)+1;se(o,r)},children:q[s.id]?t.jsx("span",{style:{color:"#64748b",fontSize:12},children:"불러오는 중…"}):O[s.id]?t.jsx("span",{style:{color:"#9ca3af",fontSize:12},children:"아래로 스크롤하면 더 불러옵니다"}):t.jsx("span",{style:{color:"#9ca3af",fontSize:12},children:"마지막입니다"})})]})]},s.id))})]}):t.jsx(T,{title:"선택한 수업이 없어요. 왼쪽에서 수업을 선택해주세요."}):t.jsx(T,{title:"수업을 선택하고 기간을 설정한 후 조회해주세요."})}),t.jsx(bt,{children:t.jsxs(yt,{children:[fe,t.jsx(ie,{type:"button",onClick:Me,disabled:ge,children:"요약 만들기"})]})})]})})]})]})}function Ne({onVisible:e,children:l}){const c=re.useRef(null);return re.useEffect(()=>{const d=c.current;if(!d)return;const $=new IntersectionObserver(w=>{for(const y of w)if(y.isIntersecting){e();break}},{root:null,rootMargin:"200px 0px",threshold:0});return $.observe(d),()=>$.disconnect()},[e]),t.jsx("div",{ref:c,style:{display:"grid",placeItems:"center",padding:"8px 0"},children:l})}function Fe(e){const l=e.courseTime||Pe(e.startTime,e.endTime),c=e.nextClassDate?`다음 수업 ${P(e.nextClassDate)}`:"";return[l,c].filter(Boolean).join(" · ")||"일정 정보 없음"}function Pe(e,l){if(!e&&!l)return"";const c=e?e.slice(0,5):"?",d=l?l.slice(0,5):"?";return`${c} ~ ${d}`}function P(e){if(!e)return"-";const[l,c,d]=e.split("-");return!l||!c||!d?e:`${Number(l)}년 ${Number(c)}월 ${Number(d)}일`}function Ie(e,l){if(!e||!l)return null;try{const c=new Date(e),d=new Date(l);if(Number.isNaN(c.getTime())||Number.isNaN(d.getTime()))return null;const $=Math.abs(d.getTime()-c.getTime());return Math.floor($/(1e3*60*60*24))+1}catch{return null}}function Ee(e,l){if(!e||!l)return{label:"기간을 선택하면 조회 안내가 표시돼요.",days:null};const c=`${P(e)} ~ ${P(l)}`,d=Ie(e,l);return{label:c,days:d}}function ae(e){return e.content?.trim()||e.notes?.trim()||e.topic?.trim()||"(기록된 내용이 없습니다)"}const Ye=i.div`
  height: calc(100vh - 48px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
`,Ae=i.div`
  padding: 0 ${e=>e.theme.spacing.xs};
  display: grid;
  gap: ${e=>e.theme.spacing.sm};
`,He=i.div`
  display: inline-flex;
  gap: ${e=>e.theme.spacing.sm};
  flex-wrap: wrap;
  justify-content: flex-end;
`,Le=i.div`
  display: grid;
  gap: ${e=>e.theme.spacing.xl};
  grid-template-columns: 1fr;
  flex: 1;
  min-height: 0;
  overflow: hidden;
  @media (min-width: 1120px) {
    grid-template-columns: 360px 1fr;
  }
`,Ge=i.div`
  display: flex;
  min-height: 0;
  overflow: hidden;
`,Qe=i.div`
  display: grid;
  gap: ${e=>e.theme.spacing.xl};
  min-height: 0;
`,Ke=i.div`
  flex: 1;
  min-height: 0;
  overflow: auto;
  display: grid;
  gap: ${e=>e.theme.spacing.xl};
`,Ve=i(me)`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: ${e=>e.theme.spacing.xl};
`,We=i(me)`
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: ${e=>e.theme.spacing.xl};
`,le=i.div`
  display: grid;
  gap: ${e=>e.theme.spacing.xs};
`,ce=i.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 800;
  letter-spacing: -0.01em;
  color: ${({theme:e})=>e.colors.text};
`,de=i.p`
  margin: 0;
  font-size: ${e=>e.theme.font.size.sm};
  color: ${({theme:e})=>e.colors.textMuted};
`,N=i.div`
  display: grid;
  gap: ${e=>e.theme.spacing.sm};
`,_e=i.div`
  display: flex;
  align-items: center;
  height: 40px;
  padding: 0 ${e=>e.theme.spacing.md};
  border-radius: ${e=>e.theme.radii.md};
  border: 1px solid ${({theme:e})=>e.colors.border};
  background: #fff;
  box-shadow: inset 0 1px 2px rgba(15, 23, 42, 0.04);
`,Oe=i.input`
  flex: 1;
  border: 0;
  background: transparent;
  font-size: 14px;
  color: ${({theme:e})=>e.colors.text};
  &:focus {
    outline: none;
  }
`,ue=i.span`
  font-size: ${e=>e.theme.font.size.sm};
  color: ${({theme:e})=>e.colors.textMuted};
`,qe=i.span`
  font-size: ${e=>e.theme.font.size.sm};
  color: #dc2626;
  font-weight: 600;
`,Ue=i.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${e=>e.theme.spacing.sm};
`,K=i.div`
  font-size: ${e=>e.theme.font.size.sm};
  font-weight: 800;
  color: ${({theme:e})=>e.colors.text};
`,Ze=i.div`
  display: inline-flex;
  align-items: center;
  gap: ${e=>e.theme.spacing.sm};
  font-size: ${e=>e.theme.font.size.sm};
  color: ${({theme:e})=>e.colors.textMuted};
`,Je=i.div`
  display: grid;
  gap: ${e=>e.theme.spacing.sm};
  grid-template-columns: 1fr;
  @media (min-width: 720px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`,Xe=i.button`
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
`,et=i.div`
  flex: 0 0 auto;
  max-height: 220px;
  overflow: auto;
  border-radius: ${e=>e.theme.radii.md};
  padding: ${e=>e.theme.spacing.sm};
  background: ${({theme:e})=>e.colors.surfaceMuted};
  border: 1px solid ${({theme:e})=>e.colors.borderMuted};
`,tt=i.div`
  display: flex;
  gap: ${e=>e.theme.spacing.xs};
  flex-wrap: wrap;
  margin-bottom: ${e=>e.theme.spacing.xs};
`,st=i.span`
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
`,nt=i.button`
  border: 0;
  background: transparent;
  color: ${({theme:e})=>e.colors.textMuted};
  font-size: ${e=>e.theme.font.size.sm};
  text-decoration: underline;
  cursor: pointer;
`,ot=i.div`
  display: grid;
  gap: ${e=>e.theme.spacing.sm};
  grid-template-columns: repeat(2, minmax(0, 1fr));
`,F=i.button`
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
`,it=i.div`
  display: grid;
  gap: ${e=>e.theme.spacing.sm};
  grid-template-columns: repeat(2, minmax(0, 1fr));
`,pe=i.label`
  display: grid;
  gap: ${e=>e.theme.spacing.xs};
  font-size: ${e=>e.theme.font.size.sm};
  color: ${({theme:e})=>e.colors.textMuted};
`,he=i.input`
  height: 38px;
  border-radius: ${e=>e.theme.radii.md};
  border: 1px solid ${({theme:e})=>e.colors.border};
  padding: 0 ${e=>e.theme.spacing.md};
  background: #fff;
  font-size: ${e=>e.theme.font.size.sm};
`,rt=i.div`
  font-size: ${e=>e.theme.font.size.sm};
  color: ${({theme:e})=>e.colors.textMuted};
  padding-top: ${e=>e.theme.spacing.xs};
`,at=i.div`
  position: sticky;
  bottom: 0;
  background: ${({theme:e})=>e.colors.surface};
  border-top: 1px solid ${({theme:e})=>e.colors.borderMuted};
  padding-top: ${e=>e.theme.spacing.md};
  margin-top: ${e=>e.theme.spacing.sm};
`,lt=i.div`
  display: flex;
  justify-content: flex-end;
  gap: ${e=>e.theme.spacing.sm};
`,ct=i.div`
  flex: 1;
  min-height: 0;
  overflow: auto;
`,dt=i.div`
  display: grid;
  gap: ${e=>e.theme.spacing.xl};
`,ut=i.div`
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
`,pt=i.div`
  display: grid;
  gap: ${e=>e.theme.spacing.lg};
`,ht=i.section`
  border: 1px solid ${({theme:e})=>e.colors.border};
  border-radius: ${({theme:e})=>e.radii.xl};
  background: ${({theme:e})=>e.colors.surface};
  padding: ${e=>e.theme.spacing.xl};
  display: grid;
  gap: ${e=>e.theme.spacing.md};
`,mt=i.div`
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
`,gt=i.div`
  display: grid;
  gap: ${e=>e.theme.spacing.md};
`,ft=i.div`
  display: grid;
  gap: ${e=>e.theme.spacing.xs};
  border-radius: ${e=>e.theme.radii.md};
  border: 1px solid ${({theme:e})=>e.colors.borderMuted};
  padding: ${e=>e.theme.spacing.md};
  background: ${({theme:e})=>e.colors.surfaceMuted};
`,xt=i.div`
  font-size: ${e=>e.theme.font.size.sm};
  color: ${({theme:e})=>e.colors.textMuted};
  font-weight: 600;
`,$t=i.p`
  margin: 0;
  font-size: 13px;
  color: ${({theme:e})=>e.colors.text};
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-word;
`,bt=i.div`
  position: sticky;
  bottom: 0;
  background: ${({theme:e})=>e.colors.surface};
  border-top: 1px solid ${({theme:e})=>e.colors.borderMuted};
  padding-top: ${e=>e.theme.spacing.md};
  margin-top: ${e=>e.theme.spacing.md};
  display: flex;
  justify-content: flex-end;
`,yt=i.div`
  display: flex;
  align-items: center;
  gap: ${e=>e.theme.spacing.sm};
`;i.span`
  color: #b91c1c;
  font-size: ${e=>e.theme.font.size.sm};
  font-weight: 600;
`;export{Ct as default};
