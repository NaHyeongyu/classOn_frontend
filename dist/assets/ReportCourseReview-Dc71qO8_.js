import{a as We,u as Ve,h as Ge,r as o,j as t,y as Ke,x as Ue,d as n}from"./index-B92ulgNv.js";import{P as Xe,b as qe,S as R}from"./UI-ktOMpaj3.js";import{l as Je,a as Qe,M as Ye}from"./exams-BGHjN4cp.js";import{g as Ze,h as et,b as tt,f as st}from"./courses-BqfN_zpR.js";import{f as nt}from"./firstSummary-CYKEpxKZ.js";import{r as M}from"./errors-C6OcbAl5.js";import{a as k,b as Fe}from"./format-Do6vjlY3.js";const ke=12,ot=8;function rt(e,c){return e?!(c.from&&e<c.from||c.to&&e>c.to):!0}function it(e,c){return typeof e!="number"?null:typeof c=="number"&&c>0?e/c*100:e}function at(e,c){const h=[e.topic,e.notes,e.content].map(a=>(a??"").trim()).filter(Boolean).join(`
`);return{date:e.recordDate,content:h,courseTitle:c}}function as(){const{courseId:e}=We(),c=Ve(),h=Ge().state??{},a=o.useMemo(()=>{if(!e)return null;const s=Number(e);return Number.isFinite(s)?s:null},[e]),[x,K]=o.useState(h.course??null),[j,F]=o.useState(!h.course),[C,A]=o.useState(null),[f,i]=o.useState(h.students??[]),[b,le]=o.useState(!h.students),[U,de]=o.useState(null),Ie=o.useMemo(()=>{if(h.range)return h.range;const s=new Date,r=s.toISOString().slice(0,10),d=new Date(s);return d.setMonth(d.getMonth()-1),{from:d.toISOString().slice(0,10),to:r}},[h.range]),[l,ce]=o.useState(Ie),p="최근 수업 흐름을 정리해 학부모와 공유합니다.",[X,y]=o.useState(h.summary??p),[q,me]=o.useState(!1),[he,J]=o.useState(null),[Q,ue]=o.useState(!!h.summary),[Y,Z]=o.useState(""),[Pe,ge]=o.useState(!1),[v,ee]=o.useState([]),[Re,xe]=o.useState(!1),[fe,pe]=o.useState(null),[w,te]=o.useState([]),[De,$e]=o.useState(!1),[je,be]=o.useState(null),[ye,ve]=o.useState([]),[Ne,we]=o.useState(!1),[ze,Se]=o.useState(null),[se,Me]=o.useState(null);o.useEffect(()=>{if(!a||x)return;let s=!0;return(async()=>{try{F(!0),A(null);const r=await Ze(a);if(!s)return;K(r)}catch(r){if(!s)return;A(M(r,"수업 정보를 불러오지 못했습니다."))}finally{s&&F(!1)}})(),()=>{s=!1}},[a,x]),o.useEffect(()=>{if(!a)return;let s=!0;return(async()=>{try{le(!0),de(null);const r=await et(a);if(!s)return;i(r??[])}catch(r){if(!s)return;i([]),de(M(r,"학생 목록을 불러오지 못했습니다."))}finally{s&&le(!1)}})(),()=>{s=!1}},[a]);const He=x?.title??(j?"불러오는 중…":"수업 정보를 찾을 수 없습니다."),Oe=o.useMemo(()=>{if(!l.from&&!l.to)return"전체 기간";const s=l.from?k(l.from):"시작 미지정",r=l.to?k(l.to):"종료 미지정";return`${s} ~ ${r}`},[l]),L=o.useMemo(()=>{const s=w.reduce((u,m)=>u+m.presentCount,0),r=w.reduce((u,m)=>u+m.absentCount,0),d=s+r;return{presentTotal:s,absentTotal:r,total:d,rate:d?s/d*100:null}},[w]),Ee=o.useMemo(()=>w.slice(-5),[w]),ne=o.useMemo(()=>ye.slice().sort((s,r)=>(s.date||"").localeCompare(r.date||"")),[ye]);return o.useEffect(()=>{if(!v.length){Q||y(p);return}if(Q)return;let s=!1;return(async()=>{try{me(!0),J(null);const r=v.map(m=>at(m,x?.title)).filter(m=>!!m.content.trim());if(!r.length){y(p);return}const d=await nt(r,{language:"ko",speechStyle:"SEUMNIDA"});if(s)return;const u=d.summary?.trim()||d.bullets?.join(`
`).trim();y(u||p)}catch(r){s||(J(M(r,"수업 요약을 생성하지 못했습니다.")),y(p))}finally{s||me(!1)}})(),()=>{s=!0}},[v,Q,x?.title,p]),o.useEffect(()=>{if(!a){ee([]);return}let s=!0;return(async()=>{try{xe(!0),pe(null);const r=l.from||l.to?{from:l.from||void 0,to:l.to||void 0}:void 0,d=await tt(a,r);if(!s)return;ee((d??[]).slice(0,ke))}catch(r){if(!s)return;ee([]),pe(M(r,"수업 기록을 불러오지 못했습니다."))}finally{s&&xe(!1)}})(),()=>{s=!1}},[a,l.from,l.to]),o.useEffect(()=>{if(!a){te([]);return}if(!v.length){te([]);return}let s=!1;return(async()=>{try{$e(!0),be(null);const r=[];for(const d of v.slice(0,ke))if(d?.id)try{const u=await st(a,d.id);if(s)return;const m=u.filter(P=>P.present).length,I=u.length-m;r.push({recordId:d.id,date:d.recordDate,presentCount:m,absentCount:I})}catch(u){s||be(m=>m??M(u,"출결 정보를 불러오지 못했습니다."))}s||te(r)}finally{s||$e(!1)}})(),()=>{s=!0}},[a,v]),o.useEffect(()=>{if(!a){ve([]),Me(null);return}let s=!1;return(async()=>{try{we(!0),Se(null);const r=await Je(a);if(s)return;const m=(r??[]).filter(g=>rt(g.examDate??null,l)).slice().sort((g,z)=>(g.examDate||"").localeCompare(z.examDate||"")).slice(-ot),I=[];let P=0,oe=0;for(const g of m){let z=typeof g.averageScore=="number"?g.averageScore:null;if(z==null)try{const ie=await Qe(a,g.id);if(s)return;const B=(ie??[]).map(S=>it(S.score,S.outOf)).filter(S=>Number.isFinite(S));B.length&&(z=B.reduce((S,_e)=>S+_e,0)/B.length)}catch(ie){s||Se(B=>B??M(ie,"시험 데이터를 불러오지 못했습니다."))}const re=typeof z=="number"?Math.round(Math.max(0,Math.min(100,z))*10)/10:null;I.push({examId:g.id,title:g.title,date:g.examDate,average:re}),re!=null&&(P+=re,oe+=1)}s||(ve(I),Me(oe?P/oe:null))}finally{s||we(!1)}})(),()=>{s=!0}},[a,l]),t.jsxs(Xe,{children:[t.jsxs(qe,{children:[t.jsxs("div",{children:[t.jsx("h2",{children:He}),t.jsx("p",{children:"자동 생성된 수업 리포트를 검토하고 내용을 수정하세요."})]}),t.jsxs(dt,{children:[t.jsx(W,{type:"button",onClick:()=>c(Ke.report.courseDetail(e??"")),children:"이전"}),t.jsx(ae,{type:"button",onClick:()=>c(Ue.report),children:"리포트 홈"})]})]}),C?t.jsx(E,{children:C}):null,t.jsxs(R,{"data-animated":"true",children:[t.jsxs(D,{children:[t.jsxs("div",{children:[t.jsx(N,{children:"수업 요약"}),t.jsx(H,{children:"AI가 제안한 요약을 검토하고 원하는 내용으로 수정하세요."})]}),t.jsx(ht,{children:t.jsx(W,{type:"button",onClick:()=>{ue(!1),y(p)},disabled:q,children:q?"생성 중…":"자동 생성"})})]}),he?t.jsx(E,{children:he}):null,t.jsx(mt,{value:X,onChange:s=>{y(s.currentTarget.value),ue(!0),J(null)},placeholder:"수업 요약을 입력하세요.",rows:6,"aria-label":"course-summary"}),q?t.jsx($,{children:"수업 요약을 생성 중입니다…"}):null]}),t.jsxs(R,{"data-animated":"true",children:[t.jsxs(D,{children:[t.jsxs("div",{children:[t.jsx(N,{children:"학생 리스트"}),t.jsx(H,{children:"리포트에 포함될 학생들입니다."})]}),t.jsx(ct,{children:b?"불러오는 중…":`${f.length}명`})]}),U?t.jsx(E,{children:U}):null,!U&&!b&&f.length===0?t.jsx($,{children:"등록된 학생이 없습니다."}):null,f.length>0?t.jsx(ut,{children:f.map(s=>t.jsxs(gt,{children:[t.jsx("strong",{children:s.name}),t.jsx("span",{children:Fe(s.phoneNumber)}),t.jsx(xt,{"data-tone":s.status.toLowerCase(),children:s.status==="ENROLLED"?"수강중":s.status==="ON_LEAVE"?"휴학":"대기"})]},s.id))}):null]}),t.jsxs(R,{"data-animated":"true",children:[t.jsx(D,{children:t.jsxs("div",{children:[t.jsx(N,{children:"기간 설정"}),t.jsx(H,{children:"필요 시 기간을 재조정할 수 있습니다."})]})}),t.jsxs(ft,{children:[t.jsxs(Ce,{children:[t.jsx(Ae,{htmlFor:"review-course-from",children:"시작일"}),t.jsx(Le,{id:"review-course-from",type:"date",value:l.from,max:l.to||void 0,onChange:s=>ce({...l,from:s.currentTarget.value})})]}),t.jsxs(Ce,{children:[t.jsx(Ae,{htmlFor:"review-course-to",children:"종료일"}),t.jsx(Le,{id:"review-course-to",type:"date",value:l.to,min:l.from||void 0,onChange:s=>ce({...l,to:s.currentTarget.value})})]})]}),t.jsx($,{children:"기간을 비워두면 전체 수업 기록이 포함됩니다."})]}),t.jsxs(R,{"data-animated":"true",children:[t.jsx(D,{children:t.jsxs("div",{children:[t.jsx(N,{children:"리포트 미리보기"}),t.jsx(H,{children:"AI가 정리한 데이터를 기반으로 리포트를 확인하세요."})]})}),t.jsxs(pt,{children:[t.jsxs(Be,{children:[t.jsxs(O,{children:[t.jsx(_,{children:"출결 현황"}),Re||De?t.jsx($,{children:"출결 데이터를 불러오는 중입니다…"}):null,je?t.jsx(E,{children:je}):null,fe?t.jsx(E,{children:fe}):null,L.total?t.jsxs(Et,{children:[t.jsx(kt,{children:t.jsx(Ct,{style:{width:`${L.rate??0}%`}})}),t.jsxs(At,{children:[t.jsxs("span",{children:["출석 ",L.presentTotal,"회"]}),t.jsxs("span",{children:["결석 ",L.absentTotal,"회"]})]})]}):t.jsx($,{children:"기간 내 출결 기록이 없습니다."}),Ee.length?t.jsx(Lt,{children:Ee.map(s=>t.jsxs("li",{children:[t.jsx("span",{children:k(s.date,{includeWeekday:!1})}),t.jsxs(Bt,{children:[t.jsxs(V,{"data-tone":"present",children:["출석 ",s.presentCount]}),t.jsxs(V,{"data-tone":"absent",children:["결석 ",s.absentCount]})]})]},s.recordId))}):null]}),t.jsxs(O,{children:[t.jsx(_,{children:"수업 요약"}),t.jsx(Mt,{children:X||"요약 내용이 없습니다."})]})]}),t.jsxs(Be,{children:[t.jsxs(O,{children:[t.jsx(_,{children:"시험 기록"}),Ne?t.jsx($,{children:"시험 데이터를 불러오는 중입니다…"}):null,ze?t.jsx(E,{children:ze}):null,ne.length?t.jsx(Tt,{children:ne.map(s=>t.jsx("li",{children:t.jsxs(Ft,{children:[t.jsxs(It,{children:[t.jsx("span",{children:s.title}),t.jsx("small",{children:s.date?k(s.date,{includeWeekday:!1}):"일정 미정"})]}),t.jsx(Pt,{children:t.jsx(Rt,{style:{width:`${Math.min(100,Math.max(0,s.average??0))}%`}})}),t.jsx(Dt,{children:s.average!=null?`${s.average.toFixed(1)}점`:"데이터 없음"})]})},s.examId))}):t.jsx($,{children:"표시할 시험 데이터가 없습니다."}),se!=null?t.jsxs(Nt,{children:["기간 평균 점수 ",se.toFixed(1),"점"]}):null]}),t.jsxs(O,{children:[t.jsx(_,{children:"피드백 메모"}),t.jsx($t,{placeholder:"작성할 피드백 메모를 여기에 정리하세요.",value:Y,onChange:s=>Z(s.currentTarget.value)})]})]})]}),t.jsxs(jt,{children:[t.jsx(W,{type:"button",onClick:()=>Z(""),disabled:!Y,children:"피드백 초기화"}),t.jsx(ae,{type:"button",onClick:()=>ge(!0),children:"보고서 보기"})]})]}),t.jsx(lt,{open:Pe,onClose:()=>ge(!1),title:x?.title??"수업 리포트",period:Oe,students:f,summary:X,feedback:Y,attendance:w,attendanceRate:L.rate,examSeries:ne,examAverage:se,onChangeFeedback:Z})]})}function lt({open:e,onClose:c,title:G,period:h,students:a,summary:x,feedback:K,attendance:j,attendanceRate:F,examSeries:C,examAverage:A,onChangeFeedback:f}){return t.jsx(Ye,{open:e,onClose:c,title:"수업 리포트 미리보기",maxWidth:720,footer:t.jsxs(t.Fragment,{children:[t.jsx(W,{type:"button",onClick:c,children:"닫기"}),t.jsx(ae,{type:"button",disabled:!0,children:"내보내기 (준비중)"})]}),children:t.jsxs(bt,{children:[t.jsxs(yt,{children:[t.jsx(vt,{children:G}),t.jsx(wt,{children:h})]}),t.jsxs(zt,{children:[t.jsxs(T,{children:[t.jsx("strong",{children:"수업 내용 요약"}),t.jsx("p",{children:x||"요약 내용이 없습니다."})]}),t.jsxs(T,{children:[t.jsx("strong",{children:"학생 리스트"}),a.length===0?t.jsx("p",{children:"등록된 학생이 없습니다."}):t.jsx(Ht,{children:a.map(i=>t.jsxs("li",{children:[t.jsx("span",{children:i.name}),t.jsxs("small",{children:[Fe(i.phoneNumber)," ·"," ",i.status==="ENROLLED"?"수강중":i.status==="ON_LEAVE"?"휴학":"대기"]})]},i.id))})]}),t.jsxs(T,{children:[t.jsx("strong",{children:"출결 기록"}),j.length?t.jsxs(t.Fragment,{children:[t.jsxs(Ot,{children:[t.jsx(_t,{children:t.jsx(Wt,{style:{width:`${F??0}%`}})}),t.jsxs(Vt,{children:[t.jsxs("span",{children:["출석 ",j.reduce((i,b)=>i+b.presentCount,0),"회"]}),t.jsxs("span",{children:["결석 ",j.reduce((i,b)=>i+b.absentCount,0),"회"]})]})]}),t.jsx(Gt,{children:j.map(i=>t.jsxs("li",{children:[t.jsx("span",{children:k(i.date,{includeWeekday:!1})}),t.jsxs(Kt,{children:[t.jsxs(V,{"data-tone":"present",children:["출석 ",i.presentCount]}),t.jsxs(V,{"data-tone":"absent",children:["결석 ",i.absentCount]})]})]},i.recordId))})]}):t.jsx(Te,{children:"기간 내 출결 기록이 없습니다."})]}),t.jsxs(T,{children:[t.jsx("strong",{children:"시험 기록"}),C.length?t.jsxs(t.Fragment,{children:[t.jsx(Ut,{children:C.map(i=>t.jsx("li",{children:t.jsxs(Xt,{children:[t.jsxs(qt,{children:[t.jsx("span",{children:i.title}),t.jsx("small",{children:i.date?k(i.date,{includeWeekday:!1}):"일정 미정"})]}),t.jsx(Jt,{children:t.jsx(Qt,{style:{width:`${Math.min(100,Math.max(0,i.average??0))}%`}})}),t.jsx(Yt,{children:i.average!=null?`${i.average.toFixed(1)}점`:"데이터 없음"})]})},i.examId))}),A!=null?t.jsxs(Zt,{children:["기간 평균 점수 ",A.toFixed(1),"점"]}):null]}):t.jsx(Te,{children:"기간 내 시험 기록이 없습니다."})]}),t.jsxs(T,{children:[t.jsx("strong",{children:"피드백"}),t.jsx(St,{placeholder:"리포트에 포함할 피드백을 입력하세요.",value:K,onChange:i=>f(i.currentTarget.value),rows:4})]})]})]})})}const dt=n.div`
  display: inline-flex;
  gap: ${e=>e.theme.spacing.sm};
  flex-wrap: wrap;
  justify-content: flex-end;
`,ae=n.button`
  height: 40px;
  padding: 0 ${e=>e.theme.spacing.lg};
  border-radius: ${e=>e.theme.radii.md};
  border: 1px solid transparent;
  background: ${e=>e.theme.colors.primary};
  color: ${e=>e.theme.colors.textInverted};
  font-size: ${e=>e.theme.font.size.sm};
  font-weight: ${e=>e.theme.font.weight.semiBold};
  cursor: pointer;
  &:hover:not(:disabled) {
    background: ${e=>e.theme.colors.primaryHover};
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`,W=n.button`
  height: 40px;
  padding: 0 ${e=>e.theme.spacing.md};
  border-radius: ${e=>e.theme.radii.md};
  border: 1px solid ${e=>e.theme.colors.border};
  background: ${e=>e.theme.colors.surface};
  font-size: ${e=>e.theme.font.size.sm};
  font-weight: ${e=>e.theme.font.weight.semiBold};
  cursor: pointer;
  &:hover {
    border-color: ${e=>e.theme.colors.borderStrong};
  }
`,D=n.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: ${e=>e.theme.spacing.md};
  margin-bottom: ${e=>e.theme.spacing.md};
`,N=n.h3`
  margin: 0;
  font-size: ${e=>e.theme.font.size.xl};
  font-weight: ${e=>e.theme.font.weight.bold};
  color: ${e=>e.theme.colors.text};
`,H=n.p`
  margin: ${e=>e.theme.spacing.xs} 0 0;
  font-size: ${e=>e.theme.font.size.sm};
  color: ${e=>e.theme.colors.textMuted};
`,ct=n.span`
  font-size: ${e=>e.theme.font.size.sm};
  color: ${e=>e.theme.colors.textMuted};
`,$=n.p`
  margin: ${e=>e.theme.spacing.xs} 0 ${e=>e.theme.spacing.sm};
  font-size: ${e=>e.theme.font.size.sm};
  color: ${e=>e.theme.colors.textMuted};
`,E=n.p`
  margin: ${e=>e.theme.spacing.xs} 0 ${e=>e.theme.spacing.sm};
  font-size: ${e=>e.theme.font.size.sm};
  color: ${e=>e.theme.colors.danger};
`,mt=n.textarea`
  width: 100%;
  border: 1px solid ${e=>e.theme.colors.borderStrong};
  border-radius: ${e=>e.theme.radii.md};
  padding: ${e=>e.theme.spacing.md};
  font-size: ${e=>e.theme.font.size.sm};
  line-height: ${e=>e.theme.font.lineHeight.relaxed};
  resize: vertical;
  min-height: 140px;
  transition:
    border-color ${e=>e.theme.motion.duration.base} ${e=>e.theme.motion.easing.standard},
    box-shadow ${e=>e.theme.motion.duration.base} ${e=>e.theme.motion.easing.standard};
  &:focus {
    outline: none;
    border-color: ${e=>e.theme.colors.primary};
    box-shadow: ${e=>e.theme.shadow.focusPrimary};
  }
`,ht=n.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: ${e=>e.theme.spacing.xs};
`,ut=n.div`
  display: grid;
  gap: ${e=>e.theme.spacing.sm};
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
`,gt=n.div`
  border: 1px solid ${e=>e.theme.colors.border};
  border-radius: ${e=>e.theme.radii.md};
  padding: ${e=>e.theme.spacing.md};
  display: grid;
  gap: ${e=>e.theme.spacing.xs};
  background: ${e=>e.theme.colors.surface};
  strong {
    font-size: ${e=>e.theme.font.size.md};
    color: ${e=>e.theme.colors.text};
  }
  span {
    font-size: ${e=>e.theme.font.size.sm};
    color: ${e=>e.theme.colors.textMuted};
  }
`,xt=n.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px 10px;
  border-radius: ${e=>e.theme.radii.sm};
  font-size: ${e=>e.theme.font.size.xs};
  font-weight: ${e=>e.theme.font.weight.semiBold};
  background: ${e=>e.theme.colors.surfaceAlt};
  color: ${e=>e.theme.colors.text};
  &[data-tone='enrolled'] {
    color: ${e=>e.theme.colors.success};
    background: ${e=>e.theme.colors.successSurface};
  }
  &[data-tone='on_leave'] {
    color: ${e=>e.theme.colors.warning};
    background: ${e=>e.theme.colors.warningSurface};
  }
  &[data-tone='pending'] {
    color: ${e=>e.theme.colors.info};
    background: ${e=>e.theme.colors.infoSurface};
  }
`,ft=n.div`
  display: grid;
  gap: ${e=>e.theme.spacing.sm};
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
`,Ce=n.div`
  display: grid;
  gap: ${e=>e.theme.spacing.xs};
`,Ae=n.label`
  font-size: ${e=>e.theme.font.size.sm};
  color: ${e=>e.theme.colors.textMuted};
`,Le=n.input`
  height: 40px;
  border: 1px solid ${e=>e.theme.colors.borderStrong};
  border-radius: ${e=>e.theme.radii.md};
  padding: 0 ${e=>e.theme.spacing.sm};
  font-size: ${e=>e.theme.font.size.md};
  color: ${e=>e.theme.colors.text};
  transition:
    border-color ${e=>e.theme.motion.duration.base} ${e=>e.theme.motion.easing.standard},
    box-shadow ${e=>e.theme.motion.duration.base} ${e=>e.theme.motion.easing.standard};
  &:focus {
    outline: none;
    border-color: ${e=>e.theme.colors.primary};
    box-shadow: ${e=>e.theme.shadow.focusPrimary};
  }
`,pt=n.div`
  display: grid;
  gap: ${e=>e.theme.spacing.lg};
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
`,Be=n.div`
  display: grid;
  gap: ${e=>e.theme.spacing.md};
`,O=n.div`
  display: grid;
  gap: ${e=>e.theme.spacing.xs};
`,_=n.span`
  font-size: ${e=>e.theme.font.size.sm};
  font-weight: ${e=>e.theme.font.weight.semiBold};
  color: ${e=>e.theme.colors.text};
`,$t=n.textarea`
  width: 100%;
  min-height: 160px;
  border: 1px solid ${e=>e.theme.colors.border};
  border-radius: ${e=>e.theme.radii.md};
  padding: ${e=>e.theme.spacing.sm};
  font-size: ${e=>e.theme.font.size.sm};
  color: ${e=>e.theme.colors.text};
  resize: vertical;
  background: ${e=>e.theme.colors.surfaceAlt};
`,jt=n.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: ${e=>e.theme.spacing.sm};
  margin-top: ${e=>e.theme.spacing.lg};
`,bt=n.div`
  display: grid;
  gap: ${e=>e.theme.spacing.md};
`,yt=n.div`
  display: grid;
  gap: ${e=>e.theme.spacing.xs};
`,vt=n.h4`
  margin: 0;
  font-size: ${e=>e.theme.font.size.lg};
  font-weight: ${e=>e.theme.font.weight.bold};
  color: ${e=>e.theme.colors.text};
`,wt=n.span`
  font-size: ${e=>e.theme.font.size.sm};
  color: ${e=>e.theme.colors.textMuted};
`,zt=n.div`
  display: grid;
  gap: ${e=>e.theme.spacing.md};
  max-height: 60vh;
  overflow-y: auto;
`,T=n.div`
  display: grid;
  gap: ${e=>e.theme.spacing.xs};
  strong {
    font-size: ${e=>e.theme.font.size.sm};
    color: ${e=>e.theme.colors.text};
  }
  p, ul {
    margin: 0;
    font-size: ${e=>e.theme.font.size.sm};
    color: ${e=>e.theme.colors.textMuted};
  }
  ul {
    padding-left: ${e=>e.theme.spacing.md};
    list-style: disc;
  }
`,Te=n.div`
  border: 1px dashed ${e=>e.theme.colors.border};
  border-radius: ${e=>e.theme.radii.md};
  padding: ${e=>e.theme.spacing.md};
  font-size: ${e=>e.theme.font.size.sm};
  color: ${e=>e.theme.colors.textMuted};
  background: ${e=>e.theme.colors.surfaceAlt};
`,St=n.textarea`
  width: 100%;
  border: 1px solid ${e=>e.theme.colors.borderStrong};
  border-radius: ${e=>e.theme.radii.md};
  padding: ${e=>e.theme.spacing.sm};
  font-size: ${e=>e.theme.font.size.sm};
  color: ${e=>e.theme.colors.text};
  resize: vertical;
  transition:
    border-color ${e=>e.theme.motion.duration.base} ${e=>e.theme.motion.easing.standard},
    box-shadow ${e=>e.theme.motion.duration.base} ${e=>e.theme.motion.easing.standard};
  &:focus {
    outline: none;
    border-color: ${e=>e.theme.colors.primary};
    box-shadow: ${e=>e.theme.shadow.focusPrimary};
  }
`,Mt=n.p`
  margin: 0;
  padding: ${e=>e.theme.spacing.sm};
  border-radius: ${e=>e.theme.radii.md};
  background: ${e=>e.theme.colors.surfaceAlt};
  color: ${e=>e.theme.colors.text};
  font-size: ${e=>e.theme.font.size.sm};
  line-height: ${e=>e.theme.font.lineHeight.relaxed};
  white-space: pre-line;
`,Et=n.div`
  display: grid;
  gap: ${e=>e.theme.spacing.xs};
`,kt=n.div`
  height: 10px;
  border-radius: 999px;
  background: ${e=>e.theme.colors.surfaceAlt};
  overflow: hidden;
`,Ct=n.div`
  height: 100%;
  background: ${e=>e.theme.colors.success};
  transition: width 160ms ease-out;
`,At=n.div`
  display: flex;
  justify-content: space-between;
  font-size: ${e=>e.theme.font.size.sm};
  color: ${e=>e.theme.colors.textMuted};
`,Lt=n.ul`
  margin: ${e=>e.theme.spacing.sm} 0 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: ${e=>e.theme.spacing.xs};
`,Bt=n.div`
  display: inline-flex;
  gap: ${e=>e.theme.spacing.xs};
`,V=n.span`
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: ${e=>e.theme.radii.sm};
  font-size: ${e=>e.theme.font.size.xs};
  font-weight: ${e=>e.theme.font.weight.semiBold};
  background: ${e=>e.theme.colors.surfaceAlt};
  color: ${e=>e.theme.colors.textMuted};
  &[data-tone='present'] {
    background: ${e=>e.theme.colors.successSurface};
    color: ${e=>e.theme.colors.success};
  }
  &[data-tone='absent'] {
    background: ${e=>e.theme.colors.warningSurface};
    color: ${e=>e.theme.colors.warning};
  }
`,Tt=n.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: ${e=>e.theme.spacing.sm};
`,Ft=n.div`
  display: grid;
  gap: ${e=>e.theme.spacing.xs};
`,It=n.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  span {
    font-size: ${e=>e.theme.font.size.sm};
    font-weight: ${e=>e.theme.font.weight.semiBold};
    color: ${e=>e.theme.colors.text};
  }
  small {
    font-size: ${e=>e.theme.font.size.xs};
    color: ${e=>e.theme.colors.textMuted};
  }
`,Pt=n.div`
  height: 10px;
  border-radius: ${e=>e.theme.radii.md};
  background: ${e=>e.theme.colors.surfaceAlt};
  overflow: hidden;
`,Rt=n.div`
  height: 100%;
  background: ${e=>e.theme.colors.primary};
  transition: width 160ms ease-out;
`,Dt=n.span`
  font-size: ${e=>e.theme.font.size.xs};
  color: ${e=>e.theme.colors.textMuted};
`,Nt=n.p`
  margin: ${e=>e.theme.spacing.sm} 0 0;
  font-size: ${e=>e.theme.font.size.sm};
  color: ${e=>e.theme.colors.primary};
  font-weight: ${e=>e.theme.font.weight.semiBold};
`,Ht=n.ul`
  margin: 0;
  padding-left: ${e=>e.theme.spacing.md};
  display: grid;
  gap: ${e=>e.theme.spacing.xs};
  font-size: ${e=>e.theme.font.size.sm};
  color: ${e=>e.theme.colors.text};
  list-style: disc;
  li {
    display: grid;
    gap: 2px;
  }
  small {
    color: ${e=>e.theme.colors.textMuted};
    font-size: ${e=>e.theme.font.size.xs};
  }
`,Ot=n.div`
  display: grid;
  gap: ${e=>e.theme.spacing.xs};
  margin-bottom: ${e=>e.theme.spacing.sm};
`,_t=n.div`
  height: 10px;
  border-radius: 999px;
  background: ${e=>e.theme.colors.surfaceAlt};
  overflow: hidden;
`,Wt=n.div`
  height: 100%;
  background: ${e=>e.theme.colors.success};
  transition: width 160ms ease-out;
`,Vt=n.div`
  display: flex;
  justify-content: space-between;
  font-size: ${e=>e.theme.font.size.sm};
  color: ${e=>e.theme.colors.textMuted};
`,Gt=n.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: ${e=>e.theme.spacing.xs};
`,Kt=n.div`
  display: inline-flex;
  gap: ${e=>e.theme.spacing.xs};
`,Ut=n.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: ${e=>e.theme.spacing.sm};
`,Xt=n.div`
  display: grid;
  gap: ${e=>e.theme.spacing.xs};
`,qt=n.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  span {
    font-size: ${e=>e.theme.font.size.sm};
    font-weight: ${e=>e.theme.font.weight.semiBold};
    color: ${e=>e.theme.colors.text};
  }
  small {
    font-size: ${e=>e.theme.font.size.xs};
    color: ${e=>e.theme.colors.textMuted};
  }
`,Jt=n.div`
  height: 10px;
  border-radius: ${e=>e.theme.radii.md};
  background: ${e=>e.theme.colors.surfaceAlt};
  overflow: hidden;
`,Qt=n.div`
  height: 100%;
  background: ${e=>e.theme.colors.primary};
  transition: width 160ms ease-out;
`,Yt=n.span`
  font-size: ${e=>e.theme.font.size.xs};
  color: ${e=>e.theme.colors.textMuted};
`,Zt=n.p`
  margin: 0;
  font-size: ${e=>e.theme.font.size.sm};
  color: ${e=>e.theme.colors.primary};
  font-weight: ${e=>e.theme.font.weight.semiBold};
`;export{as as default};
