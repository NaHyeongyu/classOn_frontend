import{a as we,u as ze,h as Me,r,j as t,y as Ee,x as Se,d as s}from"./index-B92ulgNv.js";import{P as Te,b as ke,S as I}from"./UI-ktOMpaj3.js";import{l as Ae,a as Ie,M as De}from"./exams-BGHjN4cp.js";import{g as Be,b as Fe}from"./students-_bU7U7Hq.js";import{r as G}from"./errors-C6OcbAl5.js";import{a as p,b as ue}from"./format-Do6vjlY3.js";const Ce=200,Le=10;function Pe(e,c){return e?!(c.from&&e<c.from||c.to&&e>c.to):!0}function Re(e,c){return typeof e!="number"?null:typeof c=="number"&&c>0?e/c*100:e}function Bt(){const{studentId:e}=we(),c=ze(),m=Me().state??{},u=r.useMemo(()=>{if(!e)return null;const n=Number(e);return Number.isFinite(n)?n:null},[e]),[a,f]=r.useState(m.student??null),[P,y]=r.useState(!m.student),[v,A]=r.useState(null),o=r.useMemo(()=>{if(m.range)return m.range;const n=new Date,l=n.toISOString().slice(0,10),d=new Date(n);return d.setMonth(d.getMonth()-1),{from:d.toISOString().slice(0,10),to:l}},[m.range]),[i,J]=r.useState(o),[R,pe]=r.useState(m.summary??"학생의 최근 학습 과정을 요약해 공유합니다."),[H,N]=r.useState(""),[fe,Q]=r.useState(!1),[$,W]=r.useState([]),[$e,U]=r.useState(!1),[Y,Z]=r.useState(null),[ee,te]=r.useState([]),[je,se]=r.useState(!1),[ne,oe]=r.useState(null),[O,ie]=r.useState(null);r.useEffect(()=>{if(!u||a)return;let n=!0;return(async()=>{try{y(!0),A(null);const l=await Be(u);if(!n)return;f(l)}catch(l){if(!n)return;A(G(l,"학생 정보를 불러오지 못했습니다."))}finally{n&&y(!1)}})(),()=>{n=!1}},[u,a]),r.useEffect(()=>{if(!u){W([]);return}let n=!0;return(async()=>{try{U(!0),Z(null);const l=await Fe(u,{from:i.from||void 0,to:i.to||void 0,size:Ce});if(!n)return;W(l?.content??[])}catch(l){if(!n)return;W([]),Z(G(l,"출결 데이터를 불러오지 못했습니다."))}finally{n&&U(!1)}})(),()=>{n=!1}},[u,i.from,i.to]),r.useEffect(()=>{if(!a||!a.courses||a.courses.length===0){te([]),ie(null);return}let n=!1;return(async()=>{try{se(!0),oe(null);const l=[];for(const d of a.courses){const x=await Ae(d.id);if(n)return;const z=(x??[]).filter(j=>Pe(j.examDate??null,i)).slice(-Le);for(const j of z)try{const V=await Ie(d.id,j.id);if(n)return;const M=(V??[]).find(ve=>ve.studentId===a.id);if(!M)continue;const ae=Re(M.score,M.outOf);l.push({examId:j.id,courseId:d.id,courseTitle:d.title,examTitle:j.title,examDate:j.examDate,percent:typeof ae=="number"?Math.round(Math.max(0,Math.min(100,ae))*10)/10:null})}catch(V){n||oe(M=>M??G(V,"시험 데이터를 불러오지 못했습니다."))}}if(!n){const d=l.slice().sort((g,z)=>(g.examDate||"").localeCompare(z.examDate||""));te(d);const x=d.map(g=>g.percent).filter(g=>Number.isFinite(g));ie(x.length?x.reduce((g,z)=>g+z,0)/x.length:null)}}finally{n||se(!1)}})(),()=>{n=!0}},[a,i.from,i.to]);const be=a?`${a.name} 학생 리포트`:P?"불러오는 중…":"학생 정보를 찾을 수 없습니다.",ye=r.useMemo(()=>{if(!i.from&&!i.to)return"전체 기간";const n=i.from?p(i.from):"시작 미지정",l=i.to?p(i.to):"종료 미지정";return`${n} ~ ${l}`},[i]),w=r.useMemo(()=>{const n=$.filter(x=>x.present).length,l=$.length-n,d=n+l;return{presentTotal:n,absentTotal:l,total:d,rate:d?n/d*100:null}},[$]),re=r.useMemo(()=>$.slice(0,5),[$]),_=r.useMemo(()=>ee.slice().sort((n,l)=>(n.examDate||"").localeCompare(l.examDate||"")),[ee]);return t.jsxs(Te,{children:[t.jsxs(ke,{children:[t.jsxs("div",{children:[t.jsx("h2",{children:be}),t.jsx("p",{children:"학생 리포트를 검토하고 필요한 정보를 보완하세요."})]}),t.jsxs(Ne,{children:[t.jsx(q,{type:"button",onClick:()=>c(Ee.report.studentDetail(e??"")),children:"이전"}),t.jsx(X,{type:"button",onClick:()=>c(Se.report),children:"리포트 홈"})]})]}),v?t.jsx(K,{children:v}):null,t.jsxs(I,{"data-animated":"true",children:[t.jsx(D,{children:t.jsxs("div",{children:[t.jsx(B,{children:"학생 정보"}),t.jsx(F,{children:"리포트 상단에 표시됩니다."})]})}),a?t.jsxs(We,{children:[t.jsxs(E,{children:[t.jsx(S,{children:"이름"}),t.jsx(T,{children:a.name})]}),t.jsxs(E,{children:[t.jsx(S,{children:"연락처"}),t.jsx(T,{children:ue(a.phoneNumber)})]}),t.jsxs(E,{children:[t.jsx(S,{children:"등록일"}),t.jsx(T,{children:a.joinedDate?p(a.joinedDate):"-"})]}),t.jsxs(E,{children:[t.jsx(S,{children:"현재 상태"}),t.jsx(T,{children:xe(a.status)})]}),t.jsxs(E,{children:[t.jsx(S,{children:"수강 중인 수업"}),t.jsx(T,{children:a.courses&&a.courses.length?a.courses.map(n=>n.title).join(", "):"등록된 수업이 없습니다."})]})]}):t.jsx(b,{children:"학생 정보를 불러오는 중입니다."})]}),t.jsxs(I,{"data-animated":"true",children:[t.jsx(D,{children:t.jsxs("div",{children:[t.jsx(B,{children:"학습 요약"}),t.jsx(F,{children:"자동 작성된 요약을 원하는 내용으로 수정하세요."})]})}),t.jsx(Oe,{value:R,onChange:n=>pe(n.currentTarget.value),placeholder:"학생 학습 요약을 입력하세요.",rows:6})]}),t.jsxs(I,{"data-animated":"true",children:[t.jsx(D,{children:t.jsxs("div",{children:[t.jsx(B,{children:"기간 설정"}),t.jsx(F,{children:"상담, 수업, 시험 기록의 범위를 설정합니다."})]})}),t.jsxs(_e,{children:[t.jsxs(le,{children:[t.jsx(de,{htmlFor:"review-student-from",children:"시작일"}),t.jsx(ce,{id:"review-student-from",type:"date",value:i.from,max:i.to||void 0,onChange:n=>J({...i,from:n.currentTarget.value})})]}),t.jsxs(le,{children:[t.jsx(de,{htmlFor:"review-student-to",children:"종료일"}),t.jsx(ce,{id:"review-student-to",type:"date",value:i.to,min:i.from||void 0,onChange:n=>J({...i,to:n.currentTarget.value})})]})]}),t.jsx(b,{children:"기간을 비워두면 전체 기록이 포함됩니다."})]}),t.jsxs(I,{"data-animated":"true",children:[t.jsx(D,{children:t.jsxs("div",{children:[t.jsx(B,{children:"리포트 미리보기"}),t.jsx(F,{children:"AI가 수집한 데이터를 기준으로 학생 리포트를 확인하세요."})]})}),t.jsxs(Ve,{children:[t.jsxs(he,{children:[t.jsxs(C,{children:[t.jsx(L,{children:"출결 현황"}),$e?t.jsx(b,{children:"출결 데이터를 불러오는 중입니다…"}):null,Y?t.jsx(K,{children:Y}):null,w.total?t.jsxs(tt,{children:[t.jsx(st,{children:t.jsx(nt,{style:{width:`${w.rate??0}%`}})}),t.jsxs(ot,{children:[t.jsxs("span",{children:["출석 ",w.presentTotal,"회"]}),t.jsxs("span",{children:["결석 ",w.absentTotal,"회"]})]})]}):t.jsx(b,{children:"기간 내 출결 기록이 없습니다."}),re.length?t.jsx(it,{children:re.map((n,l)=>t.jsxs("li",{children:[t.jsx("span",{children:n.date?p(n.date,{includeWeekday:!1}):"날짜 미지정"}),t.jsxs(rt,{children:[t.jsx(ge,{"data-tone":"present",children:n.present?"출석":"결석"}),n.courseTitle?t.jsx("small",{children:n.courseTitle}):null]})]},`${n.recordId??l}-${n.date}`))}):null]}),t.jsxs(C,{children:[t.jsx(L,{children:"학습 요약"}),t.jsx(et,{children:R||"요약 내용이 없습니다."})]})]}),t.jsxs(he,{children:[t.jsxs(C,{children:[t.jsx(L,{children:"시험 기록"}),je?t.jsx(b,{children:"시험 데이터를 불러오는 중입니다…"}):null,ne?t.jsx(K,{children:ne}):null,_.length?t.jsx(at,{children:_.map(n=>t.jsx("li",{children:t.jsxs(lt,{children:[t.jsxs(dt,{children:[t.jsx("span",{children:n.examTitle}),t.jsxs("small",{children:[n.examDate?p(n.examDate,{includeWeekday:!1}):"일정 미정",` · ${n.courseTitle}`]})]}),t.jsx(ct,{children:t.jsx(ht,{style:{width:`${Math.min(100,Math.max(0,n.percent??0))}%`}})}),t.jsx(mt,{children:n.percent!=null?`${n.percent.toFixed(1)}점`:"미응시"})]})},n.examId))}):t.jsx(b,{children:"표시할 시험 데이터가 없습니다."}),O!=null?t.jsxs(ut,{children:["기간 평균 점수 ",O.toFixed(1),"점"]}):null]}),t.jsxs(C,{children:[t.jsx(L,{children:"피드백 메모"}),t.jsx(Ge,{placeholder:"학생에게 전달할 피드백을 정리하세요.",value:H,onChange:n=>N(n.currentTarget.value)})]})]})]}),t.jsxs(Ke,{children:[t.jsx(q,{type:"button",onClick:()=>N(""),disabled:!H,children:"피드백 초기화"}),t.jsx(X,{type:"button",onClick:()=>Q(!0),children:"보고서 보기"})]})]}),t.jsx(He,{open:fe,onClose:()=>Q(!1),student:a,period:ye,summary:R,feedback:H,attendance:$,attendanceRate:w.rate,examResults:_,examAverage:O,onChangeFeedback:N})]})}function He({open:e,onClose:c,student:h,period:m,summary:u,feedback:a,attendance:f,attendanceRate:P,examResults:y,examAverage:v,onChangeFeedback:A}){return t.jsx(De,{open:e,onClose:c,title:"학생 리포트 미리보기",maxWidth:720,footer:t.jsxs(t.Fragment,{children:[t.jsx(q,{type:"button",onClick:c,children:"닫기"}),t.jsx(X,{type:"button",disabled:!0,children:"내보내기 (준비중)"})]}),children:t.jsxs(Xe,{children:[t.jsxs(qe,{children:[t.jsx(Je,{children:h?`${h.name} 학생`:"학생 정보 없음"}),t.jsx(Qe,{children:m})]}),t.jsxs(Ue,{children:[t.jsxs(k,{children:[t.jsx("strong",{children:"학생 정보"}),t.jsxs(Ye,{children:[t.jsxs("li",{children:["이름: ",h?.name??"-"]}),t.jsxs("li",{children:["연락처: ",ue(h?.phoneNumber)]}),t.jsxs("li",{children:["등록일: ",h?.joinedDate?p(h.joinedDate):"-"]}),t.jsxs("li",{children:["상태: ",h?xe(h.status):"-"]}),t.jsxs("li",{children:["수강수업:"," ",h?.courses&&h.courses.length?h.courses.map(o=>o.title).join(", "):"-"]})]})]}),t.jsxs(k,{children:[t.jsx("strong",{children:"출결 기록"}),f.length?t.jsxs(t.Fragment,{children:[t.jsxs(xt,{children:[t.jsx(gt,{children:t.jsx(pt,{style:{width:`${P??0}%`}})}),t.jsxs(ft,{children:[t.jsxs("span",{children:["출석 ",f.filter(o=>o.present).length,"회"]}),t.jsxs("span",{children:["결석 ",f.filter(o=>!o.present).length,"회"]})]})]}),t.jsx($t,{children:f.slice(0,10).map((o,i)=>t.jsxs("li",{children:[t.jsx("span",{children:o.date?p(o.date,{includeWeekday:!1}):"날짜 미지정"}),t.jsxs(jt,{children:[t.jsx(ge,{"data-tone":o.present?"present":"absent",children:o.present?"출석":"결석"}),o.courseTitle?t.jsx("small",{children:o.courseTitle}):null]})]},`${o.recordId??i}-${o.date??i}`))})]}):t.jsx(me,{children:"기간 내 출결 기록이 없습니다."})]}),t.jsxs(k,{children:[t.jsx("strong",{children:"수업 요약"}),t.jsx("p",{children:u||"요약 내용이 없습니다."})]}),t.jsxs(k,{children:[t.jsx("strong",{children:"시험 기록"}),y.length?t.jsxs(t.Fragment,{children:[t.jsx(bt,{children:y.map(o=>t.jsx("li",{children:t.jsxs(yt,{children:[t.jsxs(vt,{children:[t.jsx("span",{children:o.examTitle}),t.jsxs("small",{children:[o.examDate?p(o.examDate,{includeWeekday:!1}):"일정 미정",o.courseTitle?` · ${o.courseTitle}`:""]})]}),t.jsx(wt,{children:t.jsx(zt,{style:{width:`${Math.min(100,Math.max(0,o.percent??0))}%`}})}),t.jsx(Mt,{children:o.percent!=null?`${o.percent.toFixed(1)}점`:"미응시"})]})},o.examId))}),v!=null?t.jsxs(Et,{children:["기간 평균 점수 ",v.toFixed(1),"점"]}):null]}):t.jsx(me,{children:"기간 내 시험 기록이 없습니다."})]}),t.jsxs(k,{children:[t.jsx("strong",{children:"피드백"}),t.jsx(Ze,{placeholder:"리포트에 포함할 피드백을 입력하세요.",value:a,onChange:o=>A(o.currentTarget.value),rows:4})]})]})]})})}function xe(e){return e==="ENROLLED"?"수강중":e==="ON_LEAVE"?"휴학":"대기"}const Ne=s.div`
  display: inline-flex;
  gap: ${e=>e.theme.spacing.sm};
  flex-wrap: wrap;
  justify-content: flex-end;
`,X=s.button`
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
`,q=s.button`
  height: 40px;
  padding: 0 ${e=>e.theme.spacing.md};
  border-radius: ${e=>e.theme.radii.md};
  border: 1px solid ${e=>e.theme.colors.border};
  background: ${e=>e.theme.colors.surface};
  font-size: ${e=>e.theme.font.size.sm};
  font-weight: ${e=>e.theme.font.weight.semiBold};
  cursor: pointer;
  &:hover:not(:disabled) {
    border-color: ${e=>e.theme.colors.borderStrong};
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`,D=s.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: ${e=>e.theme.spacing.md};
  margin-bottom: ${e=>e.theme.spacing.md};
`,B=s.h3`
  margin: 0;
  font-size: ${e=>e.theme.font.size.xl};
  font-weight: ${e=>e.theme.font.weight.bold};
  color: ${e=>e.theme.colors.text};
`,F=s.p`
  margin: ${e=>e.theme.spacing.xs} 0 0;
  font-size: ${e=>e.theme.font.size.sm};
  color: ${e=>e.theme.colors.textMuted};
`,b=s.p`
  margin: ${e=>e.theme.spacing.xs} 0 ${e=>e.theme.spacing.sm};
  font-size: ${e=>e.theme.font.size.sm};
  color: ${e=>e.theme.colors.textMuted};
`,K=s.p`
  margin: ${e=>e.theme.spacing.xs} 0 ${e=>e.theme.spacing.sm};
  font-size: ${e=>e.theme.font.size.sm};
  color: ${e=>e.theme.colors.danger};
`,We=s.div`
  display: grid;
  gap: ${e=>e.theme.spacing.sm};
`,E=s.div`
  display: grid;
  gap: ${e=>e.theme.spacing.xs};
  padding: ${e=>e.theme.spacing.sm};
  border-radius: ${e=>e.theme.radii.md};
  background: ${e=>e.theme.colors.surfaceAlt};
`,S=s.span`
  font-size: ${e=>e.theme.font.size.xs};
  color: ${e=>e.theme.colors.textMuted};
  letter-spacing: 0.02em;
`,T=s.span`
  font-size: ${e=>e.theme.font.size.sm};
  color: ${e=>e.theme.colors.text};
  line-height: ${e=>e.theme.font.lineHeight.relaxed};
`,Oe=s.textarea`
  width: 100%;
  border: 1px solid ${e=>e.theme.colors.borderStrong};
  border-radius: ${e=>e.theme.radii.md};
  padding: ${e=>e.theme.spacing.md};
  font-size: ${e=>e.theme.font.size.sm};
  line-height: ${e=>e.theme.font.lineHeight.relaxed};
  min-height: 140px;
  resize: vertical;
  transition:
    border-color ${e=>e.theme.motion.duration.base} ${e=>e.theme.motion.easing.standard},
    box-shadow ${e=>e.theme.motion.duration.base} ${e=>e.theme.motion.easing.standard};
  &:focus {
    outline: none;
    border-color: ${e=>e.theme.colors.primary};
    box-shadow: ${e=>e.theme.shadow.focusPrimary};
  }
`,_e=s.div`
  display: grid;
  gap: ${e=>e.theme.spacing.sm};
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
`,le=s.div`
  display: grid;
  gap: ${e=>e.theme.spacing.xs};
`,de=s.label`
  font-size: ${e=>e.theme.font.size.sm};
  color: ${e=>e.theme.colors.textMuted};
`,ce=s.input`
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
`,Ve=s.div`
  display: grid;
  gap: ${e=>e.theme.spacing.md};
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
`,he=s.div`
  display: grid;
  gap: ${e=>e.theme.spacing.md};
`,C=s.div`
  display: grid;
  gap: ${e=>e.theme.spacing.xs};
`,L=s.span`
  font-size: ${e=>e.theme.font.size.sm};
  font-weight: ${e=>e.theme.font.weight.semiBold};
  color: ${e=>e.theme.colors.text};
`,Ge=s.textarea`
  width: 100%;
  min-height: 160px;
  border: 1px solid ${e=>e.theme.colors.border};
  border-radius: ${e=>e.theme.radii.md};
  padding: ${e=>e.theme.spacing.sm};
  font-size: ${e=>e.theme.font.size.sm};
  color: ${e=>e.theme.colors.text};
  resize: vertical;
  background: ${e=>e.theme.colors.surfaceAlt};
`,Ke=s.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: ${e=>e.theme.spacing.sm};
  margin-top: ${e=>e.theme.spacing.lg};
`,Xe=s.div`
  display: grid;
  gap: ${e=>e.theme.spacing.md};
`,qe=s.div`
  display: grid;
  gap: ${e=>e.theme.spacing.xs};
`,Je=s.h4`
  margin: 0;
  font-size: ${e=>e.theme.font.size.lg};
  font-weight: ${e=>e.theme.font.weight.bold};
  color: ${e=>e.theme.colors.text};
`,Qe=s.span`
  font-size: ${e=>e.theme.font.size.sm};
  color: ${e=>e.theme.colors.textMuted};
`,Ue=s.div`
  display: grid;
  gap: ${e=>e.theme.spacing.md};
  max-height: 60vh;
  overflow-y: auto;
`,k=s.div`
  display: grid;
  gap: ${e=>e.theme.spacing.xs};
  strong {
    font-size: ${e=>e.theme.font.size.sm};
    color: ${e=>e.theme.colors.text};
  }
  p {
    margin: 0;
    font-size: ${e=>e.theme.font.size.sm};
    color: ${e=>e.theme.colors.textMuted};
  }
`,Ye=s.ul`
  margin: 0;
  padding-left: ${e=>e.theme.spacing.md};
  font-size: ${e=>e.theme.font.size.sm};
  color: ${e=>e.theme.colors.textMuted};
  list-style: disc;
`,me=s.div`
  border: 1px dashed ${e=>e.theme.colors.border};
  border-radius: ${e=>e.theme.radii.md};
  padding: ${e=>e.theme.spacing.md};
  font-size: ${e=>e.theme.font.size.sm};
  color: ${e=>e.theme.colors.textMuted};
  background: ${e=>e.theme.colors.surfaceAlt};
`,Ze=s.textarea`
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
`,et=s.p`
  margin: 0;
  padding: ${e=>e.theme.spacing.sm};
  border-radius: ${e=>e.theme.radii.md};
  background: ${e=>e.theme.colors.surfaceAlt};
  color: ${e=>e.theme.colors.text};
  font-size: ${e=>e.theme.font.size.sm};
  line-height: ${e=>e.theme.font.lineHeight.relaxed};
  white-space: pre-line;
`,tt=s.div`
  display: grid;
  gap: ${e=>e.theme.spacing.xs};
`,st=s.div`
  height: 10px;
  border-radius: 999px;
  background: ${e=>e.theme.colors.surfaceAlt};
  overflow: hidden;
`,nt=s.div`
  height: 100%;
  background: ${e=>e.theme.colors.success};
  transition: width 160ms ease-out;
`,ot=s.div`
  display: flex;
  justify-content: space-between;
  font-size: ${e=>e.theme.font.size.sm};
  color: ${e=>e.theme.colors.textMuted};
`,it=s.ul`
  margin: ${e=>e.theme.spacing.sm} 0 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: ${e=>e.theme.spacing.xs};
  font-size: ${e=>e.theme.font.size.sm};
  color: ${e=>e.theme.colors.text};
  li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: ${e=>e.theme.spacing.sm};
  }
  small {
    font-size: ${e=>e.theme.font.size.xs};
    color: ${e=>e.theme.colors.textMuted};
  }
`,rt=s.div`
  display: inline-flex;
  align-items: center;
  gap: ${e=>e.theme.spacing.xs};
`,ge=s.span`
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
`,at=s.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: ${e=>e.theme.spacing.sm};
`,lt=s.div`
  display: grid;
  gap: ${e=>e.theme.spacing.xs};
`,dt=s.div`
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
`,ct=s.div`
  height: 10px;
  border-radius: ${e=>e.theme.radii.md};
  background: ${e=>e.theme.colors.surfaceAlt};
  overflow: hidden;
`,ht=s.div`
  height: 100%;
  background: ${e=>e.theme.colors.primary};
  transition: width 160ms ease-out;
`,mt=s.span`
  font-size: ${e=>e.theme.font.size.xs};
  color: ${e=>e.theme.colors.textMuted};
`,ut=s.p`
  margin: ${e=>e.theme.spacing.sm} 0 0;
  font-size: ${e=>e.theme.font.size.sm};
  color: ${e=>e.theme.colors.primary};
  font-weight: ${e=>e.theme.font.weight.semiBold};
`,xt=s.div`
  display: grid;
  gap: ${e=>e.theme.spacing.xs};
  margin-bottom: ${e=>e.theme.spacing.sm};
`,gt=s.div`
  height: 10px;
  border-radius: 999px;
  background: ${e=>e.theme.colors.surfaceAlt};
  overflow: hidden;
`,pt=s.div`
  height: 100%;
  background: ${e=>e.theme.colors.success};
  transition: width 160ms ease-out;
`,ft=s.div`
  display: flex;
  justify-content: space-between;
  font-size: ${e=>e.theme.font.size.sm};
  color: ${e=>e.theme.colors.textMuted};
`,$t=s.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: ${e=>e.theme.spacing.xs};
  font-size: ${e=>e.theme.font.size.sm};
  color: ${e=>e.theme.colors.text};
  li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: ${e=>e.theme.spacing.sm};
  }
  small {
    font-size: ${e=>e.theme.font.size.xs};
    color: ${e=>e.theme.colors.textMuted};
  }
`,jt=s.div`
  display: inline-flex;
  align-items: center;
  gap: ${e=>e.theme.spacing.xs};
`,bt=s.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: ${e=>e.theme.spacing.sm};
`,yt=s.div`
  display: grid;
  gap: ${e=>e.theme.spacing.xs};
`,vt=s.div`
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
`,wt=s.div`
  height: 10px;
  border-radius: ${e=>e.theme.radii.md};
  background: ${e=>e.theme.colors.surfaceAlt};
  overflow: hidden;
`,zt=s.div`
  height: 100%;
  background: ${e=>e.theme.colors.primary};
  transition: width 160ms ease-out;
`,Mt=s.span`
  font-size: ${e=>e.theme.font.size.xs};
  color: ${e=>e.theme.colors.textMuted};
`,Et=s.p`
  margin: 0;
  font-size: ${e=>e.theme.font.size.sm};
  color: ${e=>e.theme.colors.primary};
  font-weight: ${e=>e.theme.font.weight.semiBold};
`;export{Bt as default};
