import{r as a,j as e,d as c,i as xe,c as Xe,e as Ze,g as Ie,u as et}from"./index-B0K7mn4q.js";import{B as tt,D as qe,T as Ye,S as oe,a as me,H as Ce,A as be,b as Oe,M as je,L as nt,E as Me,I as at,P as st,R as it,N as rt,c as lt,d as ze,e as ot,f as ct,g as dt,h as ut}from"./CourseRecordStyles-zX-y5yWu.js";import{h as he,l as pt,G as Te,S as De,i as Re,d as ke,e as ft,f as Pe}from"./UI-Cj3YhchZ.js";import{C as $e}from"./ConfirmDialog-ClQeXE4D.js";import{M as xt}from"./Modal-DH_Ki-Ju.js";import{g as mt,b as ht,h as gt,i as bt,c as jt,f as yt,j as Ae,k as St,m as He,n as wt,p as vt,o as Ct,q as kt}from"./courses-DlbPyXYO.js";import{r as ue}from"./errors-C6OcbAl5.js";import{b as Et}from"./format-DW-Kl_C3.js";import{f as Mt}from"./dateUtils-CoPTMMCx.js";import{l as Tt,a as Ue,d as Dt,c as Rt,u as At,b as Nt}from"./exams-DEQiqh-d.js";function Lt({courseId:t,courseTitle:n,headLoading:s,whenInfo:h,canDelete:x,onBack:f,onDelete:r}){const[u,g]=a.useState(!1),[M,D]=a.useState(!1),b=t!=null?`/classes/${t}`:"/classes";return e.jsxs(Ft,{children:[e.jsxs(tt,{type:"button",onClick:f,children:[zt," 뒤로"]}),e.jsxs($t,{children:[s?e.jsx(he,{w:220,h:26}):e.jsx("h2",{style:{margin:0},children:n||"수업 내역 상세"}),e.jsx(Ot,{children:s?e.jsxs(e.Fragment,{children:[e.jsx(he,{w:120,h:20}),e.jsx(he,{w:100,h:18})]}):e.jsxs(e.Fragment,{children:[e.jsx(qe,{"data-empty":String(!h.hasDate),children:h.dateLabel}),e.jsx(Ye,{"data-empty":String(!h.hasTime),children:h.timeLabel})]})})]}),e.jsxs(Bt,{children:[e.jsx(pt,{to:b,title:"수업으로",children:"수업으로"}),!s&&x&&e.jsx(Te,{type:"button","data-variant":"danger",onClick:()=>g(!0),children:"삭제"})]}),e.jsx($e,{open:u,title:"수업 내역 삭제",message:`이 수업 내역을 삭제할까요?
첨부/출결/파일도 함께 삭제됩니다. 되돌릴 수 없습니다.`,confirmLabel:"영구 삭제",cancelLabel:"취소",tone:"danger",busy:M,onCancel:()=>{M||g(!1)},onConfirm:async()=>{if(r){D(!0);try{await r()&&g(!1)}finally{D(!1)}}}})]})}const Ft=c.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 12px;
  align-items: center;
`,Bt=c.div`
  display: inline-flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: flex-end;
`,$t=c.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
`,Ot=c.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`,zt=e.jsx("svg",{width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("polyline",{points:"15 18 9 12 15 6"})});function Pt({loading:t,summaryRate:n,actionableTotal:s,actionablePresent:h,actionableAbsent:x,actionableNone:f,presentShare:r,absentShare:u,noneShare:g}){return e.jsx(Ht,{children:t?Array.from({length:4}).map((M,D)=>e.jsxs(we,{children:[e.jsx(he,{w:"40%",h:12}),e.jsx(he,{w:"60%",h:22,mt:6}),e.jsx(he,{w:"50%",h:10,mt:6})]},`stat-skeleton-${D}`)):e.jsxs(e.Fragment,{children:[e.jsxs(we,{"data-tone":"primary",children:[e.jsx("span",{className:"label",children:"출석률"}),e.jsx("strong",{children:n!=null?`${n}%`:"미집계"}),e.jsx(oe,{children:s?`대상 ${s}명`:"대상 없음"})]}),e.jsxs(we,{"data-tone":"success",children:[e.jsx("span",{className:"label",children:"출석"}),e.jsxs("strong",{children:[h,"명"]}),e.jsx(oe,{children:s?`전체의 ${r}%`:"기록 없음"})]}),e.jsxs(we,{"data-tone":"danger",children:[e.jsx("span",{className:"label",children:"결석"}),e.jsxs("strong",{children:[x,"명"]}),e.jsx(oe,{children:s?`전체의 ${u}%`:"기록 없음"})]}),e.jsxs(we,{"data-tone":f===0?"muted":"warning",children:[e.jsx("span",{className:"label",children:"미처리"}),e.jsxs("strong",{children:[f,"명"]}),e.jsx(oe,{children:f===0?"모두 처리 완료":`전체의 ${g}%`})]})]})})}const Ht=c.div`
  display: grid;
  gap: 8px;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  margin: 4px 0 8px;
  @media (max-width: 640px) {
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  }
`,we=c.div`
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 12px 14px;
  background: #fff;
  display: grid;
  gap: 6px;
  .label {
    font-size: 12px;
    font-weight: 700;
    color: #6b7280;
  }
  strong {
    font-size: 20px;
    font-weight: 800;
    color: #111827;
  }
  &[data-tone="primary"] strong {
    color: #1d4ed8;
  }
  &[data-tone="success"] strong {
    color: #047857;
  }
  &[data-tone="danger"] strong {
    color: #b91c1c;
  }
  &[data-tone="warning"] strong {
    color: #b45309;
  }
  &[data-tone="muted"] strong {
    color: #4b5563;
  }
`;function Ut({headLoading:t,editing:n,displayDateValue:s,displayTimeValue:h,durationLabel:x,onStartEdit:f,onSave:r,onCancel:u,saveDisabled:g,editDate:M,editStart:D,editEnd:b,onChangeDate:l,onChangeStart:S,onChangeEnd:q,previewDateLabel:V,previewTimeLabel:k,previewDateEmpty:P,previewTimeEmpty:W,showCreationHint:Q,whenError:B}){return e.jsxs(De,{children:[e.jsxs(Gt,{children:[e.jsx(Re,{children:"일정/시간"}),n?e.jsxs("div",{style:{display:"inline-flex",gap:8},children:[e.jsx(me,{type:"button",onClick:r,disabled:g,children:"저장"}),e.jsx(me,{type:"button",onClick:u,children:"취소"})]}):e.jsx(me,{type:"button",onClick:f,children:"편집"})]}),n?e.jsxs(Ge,{children:[e.jsxs("li",{children:[e.jsx(ve,{children:"날짜"}),e.jsx(Se,{children:e.jsx(Le,{type:"date",value:M,onChange:$=>l($.currentTarget.value)})})]}),e.jsxs("li",{children:[e.jsx(ve,{children:"시간"}),e.jsxs(Se,{style:{display:"flex",alignItems:"center",gap:6},children:[e.jsx(Le,{type:"time",step:300,value:D,onChange:$=>S($.currentTarget.value)}),e.jsx("span",{children:"~"}),e.jsx(Le,{type:"time",step:300,value:b,onChange:$=>q($.currentTarget.value)})]})]}),e.jsxs(Vt,{children:[e.jsx(Wt,{children:"미리보기"}),e.jsxs(Qt,{children:[e.jsx(qe,{"data-empty":String(P),children:V}),e.jsx(Ye,{"data-empty":String(W),children:k})]})]}),e.jsxs(_t,{children:[Q&&e.jsx(Ce,{children:"저장 시 새 수업 내역을 생성합니다."}),g&&e.jsx(oe,{children:"저장 중..."}),B&&e.jsx(be,{style:{marginLeft:8},children:B})]})]}):e.jsxs(Ge,{children:[e.jsxs("li",{children:[e.jsx(ve,{children:"수업일"}),t?e.jsx(Se,{children:e.jsx(he,{w:140,h:14})}):e.jsx(Ne,{children:s})]}),e.jsxs("li",{children:[e.jsx(ve,{children:"수업시간"}),t?e.jsx(Se,{children:e.jsx(he,{w:160,h:14})}):e.jsx(Ne,{children:h})]}),e.jsxs("li",{children:[e.jsx(ve,{children:"진행 시간"}),t?e.jsx(Se,{children:e.jsx(he,{w:90,h:14})}):e.jsx(Ne,{children:x})]})]})]})}const Gt=c.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
`,Ge=c.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 10px;
  li {
    display: grid;
    grid-template-columns: 110px 1fr;
    align-items: center;
  }
`,ve=c.span`
  color: #6b7280;
  font-size: 12px;
  font-weight: 700;
`,Se=c.div`
  color: #111827;
  font-size: 14px;
  display: flex;
  align-items: center;
  min-height: 20px;
  column-gap: 6px;
`,Ne=c(Se)`
  font-weight: 800;
  font-size: 15px;
`,Vt=c.div`
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 6px 10px;
  border: 1px dashed #e5e7eb;
  border-radius: 10px;
  background: #f9fafb;
`,Wt=c.span`
  color: #6b7280;
  font-size: 12px;
  font-weight: 700;
`,Qt=c.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  align-items: center;
`,Le=c.input`
  height: 32px;
  padding: 0 10px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 13px;
`,_t=c.div`
  grid-column: 1 / -1;
  display: flex;
  gap: 8px;
  align-items: center;
  margin-top: 2px;
`;function Jt({recordExists:t,contentValue:n,saving:s,feedback:h,onChange:x,textareaId:f="contentArea"}){return e.jsxs(De,{children:[e.jsxs(Kt,{children:[e.jsx(Re,{children:"수업 내용"}),t&&e.jsx(qt,{children:s?e.jsx(oe,{children:"저장 중..."}):h==="success"?e.jsx(Oe,{role:"status",children:"저장 완료!"}):null})]}),t?e.jsx(Yt,{id:f,rows:8,value:n,onChange:r=>x(r.currentTarget.value),placeholder:"수업 내용을 입력하세요"}):e.jsx(je,{children:"서버 기록이 없는 일정입니다. 생성 후 편집 가능합니다."})]})}const Kt=c.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
`,qt=c.div`
  display: inline-flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
`,Yt=c.textarea`
  width: 100%;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 8px 10px;
  font-size: 14px;
  resize: vertical;
  min-height: 160px;
`;function Xt(t){const{files:n,filesLoading:s,filesError:h,uploadQueue:x,previewBusy:f,fileBusy:r,thumbUrl:u,onDropFiles:g,openAttachment:M,onDeleteFile:D,recordExists:b,maxFileSizeMb:l}=t;return e.jsxs(e.Fragment,{children:[e.jsx(It,{onDragOver:S=>{S.preventDefault()},onDrop:g,children:e.jsx("span",{className:"hint",children:"여기로 파일을 끌어다 놓거나 ‘파일 추가’를 누르세요"})}),x.length>0&&e.jsx(en,{children:x.map(S=>e.jsxs(tn,{children:[e.jsxs("div",{className:"meta",children:[e.jsx("span",{className:"name",title:S.name,children:S.name}),e.jsxs("span",{className:"size",children:[Math.round(S.size/1024)," KB"]}),e.jsx("span",{className:"status",children:Zt(S.status)})]}),e.jsx("div",{className:"bar",children:e.jsx("i",{style:{width:`${S.progress}%`}})}),S.error&&e.jsx(oe,{children:S.error})]},S.id))}),h&&e.jsx(be,{children:h}),s&&e.jsx(je,{children:"불러오는 중..."}),n.length===0?e.jsx(nn,{children:"첨부 없음"}):e.jsx(an,{children:n.map(S=>{const q=(S.contentType||"").startsWith("image/"),V=(S.contentType||"")==="application/pdf"||/\.pdf$/i.test(S.filename),k=u[S.id];return e.jsxs(sn,{children:[e.jsx(rn,{children:q?k?e.jsx(ln,{src:k,alt:S.filename}):e.jsx(Fe,{children:"이미지"}):V?e.jsx(Fe,{children:"PDF"}):e.jsx(Fe,{children:"FILE"})}),e.jsxs(on,{title:S.filename,children:[e.jsx("span",{className:"name",children:S.filename}),e.jsxs("span",{className:"size",children:[Math.round((S.size??0)/1024)," KB"]})]}),e.jsxs(cn,{children:[e.jsx(me,{onClick:()=>void M(S),disabled:!!f[S.id],children:"보기"}),e.jsx(me,{"data-variant":"danger",disabled:!!r[S.id],onClick:()=>void D(S.id,S.filename),children:"삭제"})]})]},S.id)})}),!b&&e.jsx(Ce,{children:"서버 기록이 없어 로컬에만 저장됩니다."}),e.jsxs(Ce,{children:["파일 크기 제한: 최대 ",l,"MB (이미지/PDF만 허용)"]}),e.jsx(Ce,{children:"원본파일이 클 경우 파일 인코딩을 통해 용량을 줄여주세요."})]})}function Zt(t){switch(t){case"uploading":return"업로드 중";case"done":return"완료";case"error":return"오류";default:return"대기"}}const It=c.div`
  margin-top: 8px;
  border: 1px dashed #d1d5db;
  border-radius: 10px;
  padding: 10px;
  background: #f9fafb;
  color: #6b7280;
  font-size: 12px;
  text-align: center;
  .hint {
    pointer-events: none;
  }
`,en=c.div`
  display: grid;
  gap: 8px;
  margin-top: 10px;
`,tn=c.div`
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 8px;
  background: #fff;
  display: grid;
  gap: 6px;
  .meta {
    display: flex;
    gap: 8px;
    align-items: center;
    justify-content: space-between;
  }
  .name {
    font-size: 12px;
    color: #111827;
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: left;
  }
  .size {
    font-size: 11px;
    color: #9ca3af;
  }
  .status {
    font-size: 11px;
    color: #6b7280;
  }
  .bar {
    height: 6px;
    background: #f3f4f6;
    border-radius: 999px;
    overflow: hidden;
  }
  .bar i {
    display: block;
    height: 100%;
    background: #a7f3d0;
  }
`,nn=c.div`
  color: #9ca3af;
  font-size: 13px;
  padding: 12px 0;
`,an=c.div`
  display: grid;
  gap: 12px;
  margin-top: 10px;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
`,sn=c.div`
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: #fff;
  padding: 10px;
  display: grid;
  gap: 8px;
`,rn=c.div`
  height: 120px;
  border-radius: 8px;
  background: #f3f4f6;
  display: grid;
  place-items: center;
  overflow: hidden;
`,ln=c.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`,Fe=c.div`
  color: #6b7280;
  font-size: 12px;
`,on=c.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  .name {
    font-size: 12px;
    color: #111827;
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .size {
    font-size: 11px;
    color: #9ca3af;
  }
`,cn=c.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
`;function dn(t){return e.jsxs(De,{children:[e.jsxs(un,{children:[e.jsx(Re,{children:"수업 파일"}),e.jsxs("label",{children:[e.jsx(ke,{as:"span",children:"파일 추가"}),e.jsx("input",{type:"file",accept:"image/*,application/pdf",multiple:!0,style:{display:"none"},onChange:n=>{t.onUpload(n.currentTarget.files),n.currentTarget.value=""}})]})]}),e.jsx(Xt,{...t})]})}const un=c.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
`,pn=c.div`
  display: grid;
  gap: 12px;
`,fn=c.div`
  display: flex;
  gap: 12px;
  align-items: flex-start;
  @media (max-width: 1024px) {
    flex-direction: column;
  }
`,xn=c.div`
  flex: 1 1 0;
  display: grid;
  gap: 10px;
  align-content: flex-start;
  @media (max-width: 1024px) {
    order: 2;
  }
`,mn=c.div`
  flex: 1 1 0;
  display: grid;
  gap: 10px;
  align-content: flex-start;
  @media (max-width: 1024px) {
    order: 1;
  }
`,hn=c.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
`,gn=c.div`
  position: sticky;
  top: 0;
  z-index: 20;
  background: ${({theme:t})=>t.colors.surface};
  padding: 4px 0 0 0;
  margin-top: -4px;
  border-bottom: 0;
`,Ve=c.div`
  display: flex;
  align-items: center;
  gap: ${({theme:t})=>t.spacing.sm};
  flex-wrap: wrap;
  justify-content: flex-end;
  margin-left: ${({theme:t})=>t.spacing.sm};
`,bn=c.div`
  display: inline-flex;
  gap: 6px;
  align-items: center;
`,jn=c.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`,We=c(me)`
  height: 40px;
  padding: 0 16px;
  font-size: 14px;
  &[data-active="true"] {
    background: #f3f4f6;
    color: #111827;
    border-color: #e5e7eb;
  }
`,yn=c.div`
  position: sticky;
  top: 0;
  z-index: 22;
  background: ${({theme:t})=>t.colors.surface};
  padding: 4px 0;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 6px;
`;function Sn({recordId:t,rows:n,attLoading:s,attError:h,attSavingMap:x,bulkStatus:f,actionableRows:r,selectedIds:u,setSelectedIds:g,selectedCount:M,bulkDialogOpen:D,cancelBulkDialog:b,confirmBulkSelection:l,attNoteMap:S,updateNote:q,clearAttendanceLocal:V,confirmOne:k,setConfirmOne:P,promptSetAttendance:W,confirmAndSetAttendance:Q,students:B,showLocalHint:$}){return e.jsxs(a.Fragment,{children:[$&&e.jsx(Ce,{children:"서버 기록이 없어 출석 정보가 로컬에만 저장됩니다."}),s&&e.jsx(je,{children:"출석 불러오는 중..."}),h&&e.jsx(be,{children:h}),e.jsx(nt,{children:n.length===0?e.jsx(Me,{children:"등록된 학생이 없습니다."}):n.map(j=>{const R=j.status,Y=R!=="none",A=R==="present",N=!!x[j.id]||f!==null;return e.jsxs(at,{children:[e.jsxs("div",{style:{display:"flex",alignItems:"center"},children:[e.jsx("strong",{children:j.name}),j.isExtra&&e.jsx(oe,{style:{marginLeft:8},children:"(과거 수강생)"}),e.jsx(st,{"data-type":R,children:R==="present"?"출석":R==="absent"?"결석":"미처리"})]}),e.jsxs(it,{children:[e.jsx(rt,{placeholder:"메모",value:S[j.id]||"",onChange:te=>q(j.id,te.currentTarget.value,R),disabled:N}),e.jsxs(lt,{children:[e.jsx(ze,{"data-active":String(Y&&A===!0),onClick:()=>{!N&&R!=="present"&&W(j.id,!0)},disabled:N,children:"출석"}),e.jsx(ze,{"data-variant":"danger","data-active":String(Y&&A===!1),onClick:()=>{!N&&R!=="absent"&&W(j.id,!1)},disabled:N,children:"결석"})]}),e.jsx(me,{title:t?"서버 기록은 미처리로 되돌릴 수 없습니다.":"미처리로 초기화",onClick:()=>{t||V(j.id)},disabled:!!t||N,children:"미처리"}),N&&e.jsx(oe,{children:"저장 중..."})]})]},j.id)})}),e.jsx($e,{open:k.open,title:"출결 처리 확인",message:(()=>{const j=k.studentId,R=k.target;return`${j!=null?B.find(N=>N.id===j)?.name||`학생#${j}`:"학생"}을(를) ${R?"출석":"결석"} 처리하시겠어요?`})(),confirmLabel:"확인",cancelLabel:"취소",onCancel:()=>P({open:!1,studentId:null,target:null}),onConfirm:async()=>{const j=k.studentId,R=k.target;P({open:!1,studentId:null,target:null}),!(j==null||R==null)&&await Q(j,R)}}),e.jsx($e,{open:D,title:"선택 출석 처리",message:e.jsxs(ot,{children:[e.jsx("p",{children:"출석 처리할 학생을 선택하세요."}),e.jsx(ct,{children:r.map(j=>{const R=j.status==="present";return e.jsxs(dt,{"data-disabled":String(R),children:[e.jsx("input",{type:"checkbox",checked:u[j.id]||!1,onChange:Y=>{const A=Y.target;if(!A)return;const{checked:N}=A;g(te=>({...te,[j.id]:N}))},disabled:R||f!==null}),e.jsx("span",{className:"name",children:j.name}),e.jsx("span",{className:"status",children:j.status==="present"?"이미 출석":j.status==="absent"?"결석":"미처리"})]},j.id)})}),e.jsx(ut,{children:e.jsxs("span",{children:["선택된 학생: ",M,"명"]})})]}),confirmLabel:"출석 처리",cancelLabel:"취소",onCancel:b,onConfirm:()=>{f||l()},busy:f==="present",hideCancel:!1})]})}function wn({gradeView:t,setGradeView:n,avgSummary:s,scoreStudents:h,grades:x,openExamModal:f,closeExamModal:r}){const{exams:u,examLoading:g,examError:M,selectedExamId:D,setSelectedExamId:b,examFormTitle:l,setExamFormTitle:S,examFormMode:q,setExamFormMode:V,examFormSaving:k,examFormError:P,setExamFormError:W,examModalOpen:Q,examModalView:B,setExamModalView:$,examQuery:j,setExamQuery:R,selectedExam:Y,filteredExams:A,examTemplates:N,examFormTemplateId:te,setExamFormTemplateId:Z,selectedExamTemplate:ce,examResultsMap:le,gradeMap:ne,setGradeMap:X,gradeSaving:C,gradeFeedback:E,setGradeFeedback:U,lastGradeEditAtRef:_,handleConfirmExamSelection:L,handleCreateExamInline:F}=x,O=u.length>0;return e.jsxs(a.Fragment,{children:[e.jsxs(kn,{"data-view":t,children:[t==="intro"&&e.jsxs(En,{children:[e.jsx(Mn,{children:"출석 학생의 성적을 기록하려면 우측 상단에서 시험을 생성하거나 선택하세요."}),g&&e.jsx(oe,{children:"시험 정보를 불러오는 중입니다..."}),M&&e.jsx(be,{children:M})]}),t==="list"&&e.jsxs(Tn,{children:[e.jsxs(Dn,{children:[e.jsxs("div",{children:[e.jsx(Cn,{children:"등록된 시험/테스트"}),e.jsx(oe,{children:"이 수업과 연결된 시험입니다."})]}),e.jsx("div",{className:"actions",children:e.jsx(ke,{type:"button",onClick:()=>f(O?"list":"create"),disabled:g,children:"시험 추가"})})]}),g?e.jsx(je,{children:"시험을 불러오는 중입니다..."}):M?e.jsx(be,{children:M}):e.jsx(Me,{children:"시험을 추가하거나 선택해 점수를 입력하세요."})]}),t==="scores"&&(Y?e.jsxs(Rn,{children:[e.jsxs(An,{children:[e.jsx("strong",{children:"성적 입력"}),e.jsxs("div",{className:"right",children:[e.jsx(Bn,{"data-variant":Y.inputMode==="percent"?"percent":"letter",children:Y.inputMode==="percent"?"백분율":"등급"}),s&&e.jsxs(oe,{style:{marginLeft:8},children:["평균 ",s]}),E==="success"&&e.jsx(Oe,{role:"status",children:"저장 완료!"}),C&&e.jsx(oe,{style:{marginLeft:8},children:"저장 중..."}),e.jsx(ft,{type:"button",onClick:()=>{X({}),U("idle")},disabled:C||Object.keys(ne).length===0,children:"초기화"})]})]}),e.jsxs(Nn,{children:[e.jsxs("div",{className:"row head",children:[e.jsx("span",{children:"학생명"}),e.jsx("span",{children:Y.inputMode==="percent"?"점수(0~100)":"등급"})]}),h.length===0?e.jsx("div",{className:"row",children:e.jsx(oe,{children:"학생이 없습니다."})}):h.map(d=>{const J=ne[d.id]||{},I=le[d.id];return e.jsxs("div",{className:"row",children:[e.jsxs("span",{className:"name",children:[d.name,ne[d.id]?e.jsx($n,{title:"변경됨"}):null]}),e.jsx("span",{className:"control",children:Y.inputMode==="percent"?e.jsx(Ln,{type:"number",min:0,step:1,max:100,value:J.percent!==void 0?J.percent:I?.score!=null?String(I.score):"",placeholder:"0~100",onChange:v=>{const w=v.currentTarget.value;if(w===""){_.current=Date.now(),U("idle"),X(ee=>({...ee,[d.id]:{percent:""}}));return}const z=Number(w);if(!Number.isFinite(z))return;const se=Math.max(0,Math.min(100,Math.round(z)));_.current=Date.now(),U("idle"),X(ee=>({...ee,[d.id]:{percent:String(se)}}))},onWheel:v=>v.currentTarget.blur(),onKeyDown:v=>{["e","E","+","-"].includes(v.key)&&v.preventDefault()},inputMode:"numeric",pattern:"[0-9]*",disabled:C}):e.jsxs(Fn,{value:J.letter!==void 0?J.letter??"":I?.level??"",onChange:v=>{const w=v.currentTarget.value,z=w===""?void 0:w;_.current=Date.now(),U("idle"),X(se=>({...se,[d.id]:{letter:z}}))},disabled:C,children:[e.jsx("option",{value:"",children:"-"}),e.jsx("option",{value:"A",children:"A"}),e.jsx("option",{value:"B",children:"B"}),e.jsx("option",{value:"C",children:"C"}),e.jsx("option",{value:"D",children:"D"}),e.jsx("option",{value:"E",children:"E"}),e.jsx("option",{value:"F",children:"F"})]})})]},`score-${d.id}`)})]})]}):e.jsx(Me,{children:"시험을 먼저 선택하세요."}))]}),e.jsx(xt,{open:Q,title:B==="create"?"시험/테스트 생성":"시험/테스트 선택",onClose:r,blockOutsideClose:!0,footer:B==="create"?e.jsxs(e.Fragment,{children:[e.jsx(Te,{type:"button",onClick:()=>{k||($("list"),W(null))},disabled:k,children:"목록으로"}),e.jsx(Pe,{type:"button",onClick:()=>{(async()=>await F()!=null&&(n("scores"),r()))()},disabled:k,children:k?"생성 중…":"생성"})]}):e.jsxs(e.Fragment,{children:[e.jsx(Te,{type:"button",onClick:r,children:"닫기"}),e.jsx(Pe,{type:"button",onClick:()=>{L()&&n("scores")},disabled:!D||g,children:"선택"})]}),children:B==="create"?e.jsxs(Pn,{children:[O?e.jsxs(e.Fragment,{children:[e.jsx("label",{htmlFor:"exam-template",children:"시험 템플릿"}),N.length>0?e.jsx(Gn,{id:"exam-template",value:te,onChange:d=>Z(d.currentTarget.value),disabled:k,children:N.map(d=>e.jsx("option",{value:d.id,children:d.name},d.id))}):e.jsx(oe,{children:"사용 가능한 템플릿이 없습니다."}),ce?.defaultNote&&e.jsx(Vn,{children:ce.defaultNote}),e.jsx(oe,{children:"템플릿을 선택하고 생성하면 학생별 점수 입력 화면으로 이동합니다."})]}):e.jsxs(e.Fragment,{children:[e.jsx("label",{htmlFor:"exam-title",children:"시험 제목"}),e.jsx(Hn,{id:"exam-title",value:l,onChange:d=>S(d.currentTarget.value),placeholder:"예: 중간고사 수학",disabled:k}),e.jsx("label",{children:"입력 방식"}),e.jsxs(Un,{children:[e.jsxs(Qe,{children:[e.jsx("input",{type:"radio",checked:q==="percent",onChange:()=>V("percent"),disabled:k}),e.jsx("span",{children:"백분율"})]}),e.jsxs(Qe,{children:[e.jsx("input",{type:"radio",checked:q==="letter",onChange:()=>V("letter"),disabled:k}),e.jsx("span",{children:"등급"})]})]}),e.jsx(oe,{children:"시험 제목과 입력 방식은 이후에도 수정할 수 있습니다."})]}),P&&e.jsx(be,{children:P})]}):e.jsx(On,{children:g?e.jsx(je,{children:"시험을 불러오는 중입니다..."}):M?e.jsx(be,{children:M}):u.length===0?e.jsxs("div",{style:{display:"grid",gap:12},children:[e.jsx(Me,{children:"등록된 시험이 없습니다."}),e.jsx(ke,{type:"button",onClick:()=>$("create"),disabled:g,style:{justifySelf:"flex-end"},children:"새 시험 생성"})]}):e.jsxs(zn,{children:[e.jsxs(Wn,{children:[e.jsx(Jn,{placeholder:"시험 검색",value:j,onChange:d=>R(d.currentTarget.value)}),e.jsx(ke,{type:"button",onClick:()=>$("create"),disabled:g,children:"새 시험 생성"})]}),e.jsx(Qn,{children:A.map(d=>{const J=String(d.id),I=D===J;return e.jsxs(_n,{type:"button","data-selected":String(I),onClick:()=>b(J),onDoubleClick:()=>{L()&&(n("scores"),r())},disabled:g,children:[e.jsxs("div",{className:"meta",children:[e.jsx("strong",{children:d.title||"시험"}),e.jsx("span",{children:vn(d)})]}),I&&e.jsx("span",{className:"indicator",children:"선택됨"})]},`modal-exam-${d.id}`)})}),A.length===0&&e.jsx(oe,{children:"조건에 맞는 시험이 없습니다."})]})})})]})}function vn(t){const n=[];return t.examDate&&n.push(t.examDate),t.inputMode==="percent"?n.push("백분율 입력"):t.inputMode==="letter"&&n.push("등급 입력"),typeof t.averageScore=="number"&&n.push(`평균 ${t.averageScore.toFixed(1)}`),n.length>0?n.join(" · "):"등록된 정보 없음"}const Cn=c.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: #111827;
`,kn=c.div`
  display: grid;
  gap: 16px;
`,En=c.div`
  border: 1px dashed #d1d5db;
  border-radius: 12px;
  padding: 18px 20px;
  background: #f9fafb;
  display: grid;
  gap: 12px;
  max-width: 520px;
`,Mn=c.p`
  margin: 0;
  font-size: 13px;
  color: #475569;
  line-height: 1.6;
`,Tn=c.div`
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: #fff;
  padding: 16px;
  display: grid;
  gap: 16px;
`,Dn=c.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  .actions {
    display: inline-flex;
    gap: 8px;
    flex-wrap: wrap;
  }
  h2,
  h3,
  h4 {
    margin: 0;
  }
`,Rn=c.div`
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: #fff;
  padding: 12px;
  display: grid;
  gap: 10px;
`,An=c.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  .right {
    display: inline-flex;
    gap: 8px;
    align-items: center;
  }
`,Nn=c.div`
  display: grid;
  gap: 8px;
  .row {
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
    gap: 8px;
  }
  .row.head {
    color: #6b7280;
    font-size: 12px;
    font-weight: 800;
  }
  .row.head span:last-child {
    justify-self: end;
    text-align: right;
  }
  .name {
    font-weight: 700;
    color: #111827;
  }
  .control {
    display: inline-flex;
    justify-self: end;
  }
`,Ln=c.input`
  height: 32px;
  padding: 0 10px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 12px;
  width: 100px;
`,Fn=c.select`
  height: 32px;
  padding: 0 10px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 12px;
  width: 100px;
  background: #fff;
`,Bn=c.span`
  display: inline-flex;
  align-items: center;
  height: 22px;
  padding: 0 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 800;
  border: 1px solid #e5e7eb;
  color: #374151;
  background: #f8fafc;
  &[data-variant="percent"] {
    background: #ecfdf5;
    color: #065f46;
    border-color: #a7f3d0;
  }
  &[data-variant="letter"] {
    background: #eef2ff;
    color: #3730a3;
    border-color: #c7d2fe;
  }
`,$n=c.span`
  display: inline-block;
  width: 6px;
  height: 6px;
  margin-left: 6px;
  border-radius: 50%;
  background: #f59e0b;
  vertical-align: middle;
`,On=c.div`
  display: grid;
  gap: 12px;
`,zn=c.div`
  max-height: 360px;
  overflow-y: auto;
  padding-right: 4px;
`,Pn=c.div`
  display: grid;
  gap: 12px;
  label {
    font-size: 12px;
    font-weight: 700;
    color: #475569;
  }
`,Hn=c.input`
  width: 100%;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 10px 12px;
  font-size: 14px;
`,Un=c.div`
  display: inline-flex;
  gap: 16px;
  align-items: center;
`,Qe=c.label`
  display: inline-flex;
  gap: 6px;
  align-items: center;
  font-size: 13px;
  color: #374151;
  cursor: pointer;
  input {
    width: 16px;
    height: 16px;
  }
`,Gn=c.select`
  width: 100%;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 10px 12px;
  font-size: 14px;
  background: #fff;
`,Vn=c.div`
  color: #6b7280;
  font-size: 12px;
  line-height: 1.4;
  margin-top: -6px;
`,Wn=c.div`
  display: flex;
  gap: 8px;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  flex-wrap: wrap;
  input {
    flex: 1;
    min-width: 160px;
  }
`,Qn=c.div`
  display: grid;
  gap: 10px;
`,_n=c.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  text-align: left;
  padding: 12px 14px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: #f9fafb;
  cursor: pointer;
  transition: border-color 0.18s ease, background-color 0.18s ease;
  .meta {
    display: grid;
    gap: 4px;
  }
  .meta strong {
    font-size: 14px;
    color: #111827;
  }
  .meta span {
    font-size: 12px;
    color: #475569;
  }
  .indicator {
    font-size: 12px;
    color: #4f46e5;
    font-weight: 700;
  }
  &[data-selected="true"] {
    border-color: #6366f1;
    background: #eef2ff;
  }
`,Jn=c.input`
  height: 30px;
  padding: 0 10px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 12px;
`;function Kn({tab:t,onChangeTab:n,attendanceProps:s,attendanceMeta:h,gradesProps:x,gradesMeta:f}){const{actionableCount:r,onBulkAllPresent:u,onOpenBulkSelect:g}=h,{examCreateOk:M,selectedExamId:D,examLoading:b,onOpenExamModal:l,onDeleteExam:S}=f;return e.jsxs(e.Fragment,{children:[e.jsx(yn,{children:e.jsxs(bn,{children:[e.jsx(We,{"data-active":String(t==="attendance"),onClick:()=>n("attendance"),children:"출결 현황"}),e.jsx(We,{"data-active":String(t==="grades"),onClick:()=>n("grades"),children:"시험/테스트"})]})}),e.jsxs(De,{children:[e.jsx(gn,{children:e.jsxs(hn,{children:[e.jsxs(jn,{children:[e.jsx(Re,{children:t==="attendance"?"출결 현황":"시험/테스트"}),t==="attendance"?e.jsx(je,{children:"학생별 출석 상태를 수동으로 처리하세요. 변경 시 확인 창이 표시됩니다."}):e.jsx(je,{children:"시험 추가 버튼을 눌러 시험을 선택하거나 생성하세요."})]}),t==="attendance"?e.jsxs(Ve,{children:[e.jsx(me,{type:"button",onClick:u,disabled:s.bulkStatus!==null||s.attLoading||r===0,children:"전체 출석"}),e.jsx(me,{type:"button",onClick:g,disabled:s.bulkStatus!==null||s.attLoading||r===0,children:"선택 출석"}),s.bulkStatus&&e.jsx(oe,{children:"일괄 출석 처리 중…"})]}):e.jsxs(Ve,{children:[M?e.jsx(Oe,{role:"status",children:"시험 생성됨"}):null,e.jsx(ke,{type:"button",onClick:l,disabled:b,children:"시험 추가"}),D?e.jsx(Te,{type:"button","data-variant":"danger",onClick:()=>{S()},disabled:b,children:"삭제"}):null]})]})}),t==="attendance"?e.jsx(Sn,{...s}):e.jsx(wn,{...x})]})]})}function qn({header:t,onBack:n,onDeleteRecord:s,error:h,loading:x,stats:f,editor:r,attachments:u,recordExists:g,attendancePanelProps:M,attendanceMeta:D,gradesPanelProps:b,gradesMeta:l,rightTab:S,onChangeRightTab:q,headLoading:V}){return e.jsxs(pn,{children:[e.jsx(Lt,{courseId:t.courseId,courseTitle:t.courseTitle,headLoading:t.headLoading,whenInfo:t.whenInfo,canDelete:t.canDelete,onBack:n,onDelete:s}),h?e.jsx(be,{children:h}):null,x&&!V?e.jsx(je,{children:"불러오는 중..."}):null,e.jsx(Pt,{loading:f.loading,summaryRate:f.summaryRate,actionableTotal:f.actionableTotal,actionablePresent:f.actionablePresent,actionableAbsent:f.actionableAbsent,actionableNone:f.actionableNone,presentShare:f.presentShare,absentShare:f.absentShare,noneShare:f.noneShare}),e.jsxs(fn,{children:[e.jsxs(xn,{children:[e.jsx(Ut,{headLoading:V,editing:r.schedule.editing,displayDateValue:r.meta.displayDateValue,displayTimeValue:r.meta.displayTimeValue,durationLabel:r.meta.durationLabel,onStartEdit:r.schedule.onStartEdit,onSave:r.schedule.onSave,onCancel:r.schedule.onCancelEdit,saveDisabled:r.schedule.saveDisabled,editDate:r.schedule.editDate||"",editStart:r.schedule.editStart||"",editEnd:r.schedule.editEnd||"",onChangeDate:r.schedule.setEditDate,onChangeStart:r.schedule.setEditStart,onChangeEnd:r.schedule.setEditEnd,previewDateLabel:r.meta.previewDateLabel,previewTimeLabel:r.meta.previewTimeLabel,previewDateEmpty:r.meta.previewDateEmpty,previewTimeEmpty:r.meta.previewTimeEmpty,showCreationHint:r.schedule.showCreationHint,whenError:r.schedule.whenError}),e.jsx(Jt,{recordExists:g,contentValue:r.content.value,saving:r.content.saving,feedback:r.content.feedback,onChange:r.content.onChange}),e.jsx(dn,{files:u.files,filesLoading:u.filesLoading,filesError:u.filesError,uploadQueue:u.uploadQueue,previewBusy:u.previewBusy,fileBusy:u.fileBusy,thumbUrl:u.thumbUrl,onUpload:u.onUpload,onDropFiles:u.onDropFiles,openAttachment:u.openAttachment,onDeleteFile:u.onDeleteFile,recordExists:g,maxFileSizeMb:u.maxFileSizeMb})]}),e.jsx(mn,{children:e.jsx(Kn,{tab:S,onChangeTab:q,attendanceProps:M,attendanceMeta:D,gradesProps:b,gradesMeta:l})})]})]})}function Yn({courseId:t,recId:n,ymd:s}){const[h,x]=a.useState(null),[f,r]=a.useState(null),[u,g]=a.useState([]),[M,D]=a.useState(!1),[b,l]=a.useState(null),[S,q]=a.useState(0),V=a.useCallback(()=>{q(k=>k+1)},[]);return a.useEffect(()=>{if(!t){x(null),r(null),g([]),l(null),D(!1);return}let k=!1;return(async()=>{D(!0),l(null);try{const[P,W,Q]=await Promise.all([mt(t),ht(t),gt(t)]);if(k)return;x(P);const B=W.find(j=>j.id===n)||null,$=s&&!B&&W.find(j=>j.recordDate===s)||null;r(B??$??null),g(Q)}catch(P){k||l(ue(P,"수업 내역을 불러오지 못했습니다."))}finally{k||D(!1)}})(),()=>{k=!0}},[t,n,s,S]),{course:h,record:f,setRecord:r,students:u,loading:M,error:b,refresh:V}}function _e(t){if(!t)return"";const[n,s]=t.split(":");return`${n}:${s}`}function Be(t,n){return t&&n?`${_e(t)} ~ ${_e(n)}`:""}function Je(t){if(!t)return"일자 미지정";const n=Et(t,{includeYear:!0,includeWeekday:!0});return n==="—"?t:n}function Xn(t,n){if(!t||!n)return null;const[s,h]=t.split(":"),[x,f]=n.split(":"),r=Number(s)*60+Number(h),g=Number(x)*60+Number(f)-r;return g>=0?g:g+1440}function Zn(t){if(t==null||!Number.isFinite(t)||t<=0)return"미지정";const n=Math.floor(t/60),s=t%60;return n&&s?`${n}시간 ${s}분`:n?`${n}시간`:`${s}분`}function Ee(t){if(!t)return"";const[n,s]=t.split(":");return`${n}:${s}`}function Ke(t){if(!t)return;const n=t.split(":").map(s=>s.padStart(2,"0"));if(n.length>=3)return`${n[0]}:${n[1]}:${n[2]}`;if(n.length===2)return`${n[0]}:${n[1]}:00`}function In(t){if(t==null||!Number.isFinite(t))return null;const n=Math.round(Number(t));return n>=90?"A":n>=80?"B":n>=70?"C":n>=60?"D":n>=50?"E":"F"}function ea(t){if(!t)return null;const n=t.trim()[0]?.toUpperCase();return n==="A"?100:n==="B"?90:n==="C"?80:n==="D"?70:n==="E"?60:n==="F"?50:null}const ta=1500;function na({courseId:t,course:n,record:s,setRecord:h,ymd:x,showError:f}){const[r,u]=a.useState({}),[g,M]=a.useState("idle"),[D,b]=a.useState(""),l=a.useRef(null),S=a.useRef(""),q=a.useRef(0),V=a.useRef(null),[k,P]=a.useState(!1),[W,Q]=a.useState(""),[B,$]=a.useState(""),[j,R]=a.useState(""),[Y,A]=a.useState(null),N=a.useCallback(async(v,w)=>{if(!(!t||!s?.id)){w==="content"&&M("idle"),u(z=>({...z,[w]:!0})),w==="content"&&Object.prototype.hasOwnProperty.call(v,"content")&&(V.current={time:Date.now(),value:v.content??""});try{const z=await bt(t,s.id,v);h(z),xe("/api/calendar/classes"),xe("/api/calendar/classes-range"),w==="content"&&M("success")}catch(z){f(ue(z,"저장에 실패했습니다."))}finally{u(z=>({...z,[w]:!1}))}}},[t,s?.id,h,f]),te=a.useCallback(v=>{b(v),M("idle"),q.current=Date.now()},[]);a.useEffect(()=>{const v=s?.content||"",w=S.current,z=V.current;S.current=v;let se=!1;b(ee=>ee===v?ee:z&&q.current<=z.time?(se=!0,v):ee===w?v:ee),se&&(V.current=null)},[s?.content]),a.useEffect(()=>{if(s?.id&&!r.content&&D!==S.current)return l.current&&window.clearTimeout(l.current),l.current=window.setTimeout(()=>{l.current=null,N({content:D},"content")},ta),()=>{l.current&&(window.clearTimeout(l.current),l.current=null)}},[D,s?.id,N,r.content]),a.useEffect(()=>{if(g!=="success")return;const v=window.setTimeout(()=>M("idle"),2500);return()=>window.clearTimeout(v)},[g]);const Z=!s?.id,ce=!!r.when,le=a.useMemo(()=>{const v=s?.recordDate||x||"",w=Be(s?.startTime||n?.startTime,s?.endTime||n?.endTime);return{dateLabel:v?Je(v):"일자 미지정",timeLabel:w||"시간 미지정",hasDate:!!(s?.recordDate||x),hasTime:!!w}},[s?.recordDate,s?.startTime,s?.endTime,n?.startTime,n?.endTime,x]),ne=s?.recordDate||"-",X=Be(s?.startTime||n?.startTime,s?.endTime||n?.endTime)||"-",C=a.useMemo(()=>Je(W||s?.recordDate||x||""),[W,s?.recordDate,x]),E=a.useMemo(()=>!(W||s?.recordDate||x),[W,s?.recordDate,x]),U=a.useMemo(()=>B&&j?Be(B,j):"시간 미지정",[B,j]),_=a.useMemo(()=>!(B&&j),[B,j]),L=a.useMemo(()=>Xn(s?.startTime||n?.startTime,s?.endTime||n?.endTime),[s?.startTime,s?.endTime,n?.startTime,n?.endTime]),F=a.useMemo(()=>Zn(L),[L]),O=a.useCallback(()=>{P(!0),A(null),Q(s?.recordDate||x||""),$(Ee(s?.startTime||n?.startTime||"")),R(Ee(s?.endTime||n?.endTime||""))},[n?.endTime,n?.startTime,s?.endTime,s?.recordDate,s?.startTime,x]),d=a.useCallback(()=>{P(!1),A(null),Q(s?.recordDate||x||""),$(Ee(s?.startTime||n?.startTime||"")),R(Ee(s?.endTime||n?.endTime||""))},[n?.endTime,n?.startTime,s?.endTime,s?.recordDate,s?.startTime,x]),J=a.useCallback(async()=>{if(!t)return;const v={recordDate:W||x||"",startTime:Ke(B),endTime:Ke(j)};if(A(null),s?.id){await N(v,"when"),P(!1);return}u(w=>({...w,when:!0}));try{const w=await jt(t,v);h(w),P(!1),xe("/api/calendar/classes"),xe("/api/calendar/classes-range")}catch(w){ue(w,"").includes("HTTP 409")?A("이미 등록된 수업이 있습니다."):A("기록 생성에 실패했습니다.")}finally{u(w=>({...w,when:!1}))}},[t,W,j,B,s?.id,N,h,x]),I=a.useCallback(()=>{J()},[J]);return{saving:r,content:{value:D,onChange:te,saving:!!r.content,feedback:g},schedule:{editing:k,editDate:W,setEditDate:Q,editStart:B,setEditStart:$,editEnd:j,setEditEnd:R,whenError:Y,showCreationHint:Z,saveDisabled:ce,onStartEdit:O,onCancelEdit:d,onSave:I},meta:{whenInfo:le,displayDateValue:ne,displayTimeValue:X,previewDateLabel:C,previewDateEmpty:E,previewTimeLabel:U,previewTimeEmpty:_,durationMin:L,durationLabel:F}}}function aa({courseId:t,record:n,students:s,ymd:h,showError:x}){const[f,r]=a.useState(0),[u,g]=a.useState({}),[M,D]=a.useState({}),[b,l]=a.useState({}),S=a.useRef({}),[q,V]=a.useState(!1),[k,P]=a.useState(null),[W,Q]=a.useState({}),[B,$]=a.useState({open:!1,studentId:null,target:null}),[j,R]=a.useState(null),[Y,A]=a.useState(!1),[N,te]=a.useState({}),Z=a.useCallback(()=>t?n?.id?`attendance:${t}:${n.id}`:h?`attendanceDate:${t}:${h}`:`attendance:${t}:`:"attendance::",[t,n?.id,h]),ce=a.useMemo(()=>{if(!t)return{};const o=Z();try{return JSON.parse(localStorage.getItem(o)||"{}")}catch{return{}}},[t,Z,f]),le=a.useMemo(()=>n?.id?u:ce,[u,ce,n?.id]),ne=a.useMemo(()=>{const o=s.map(i=>({id:i.id,name:i.name})),m=new Set(o.map(i=>i.id)),p=Object.keys(le).map(i=>Number(i)).filter(i=>Number.isFinite(i)&&!m.has(i)).map(i=>({id:i,name:b[i]||`학생#${i}`,isExtra:!0}));return[...o,...p].map(i=>{const T=Object.prototype.hasOwnProperty.call(le,i.id)?!!le[i.id]:null,K=T==null?"none":T?"present":"absent";return{...i,status:K}})},[s,le,b]),X=a.useMemo(()=>ne.filter(o=>!o.isExtra),[ne]),C=a.useMemo(()=>{let o=0,m=0,p=0;for(const i of X)i.status==="present"?o+=1:i.status==="absent"?m+=1:p+=1;return{present:o,absent:m,none:p,total:X.length}},[X]),E=a.useMemo(()=>Object.values(le).filter(Boolean).length,[le]),U=a.useMemo(()=>{const o=n?.recordDate||h||"";return o?new Date(o)<new Date(new Date().toDateString()):!1},[n?.recordDate,h]),_=a.useMemo(()=>U?Object.keys(le).length:s.length,[U,le,s.length]),L=a.useMemo(()=>_?Math.round(E/_*100):null,[E,_]),F=a.useCallback(o=>{const m=o||n?.recordDate||h||Mt(new Date);window.dispatchEvent(new CustomEvent("calendar:classes-refresh",{detail:{ymd:m}}))},[n?.recordDate,h]),O=a.useCallback((o,m)=>{if(!t)return;const p=Z(),i=(()=>{try{return JSON.parse(localStorage.getItem(p)||"{}")}catch{return{}}})();i[String(o)]=m;try{localStorage.setItem(p,JSON.stringify(i))}catch{}r(y=>y+1),F()},[t,Z,F]),d=a.useCallback(o=>{if(!t)return;const m=Z(),p=(()=>{try{return JSON.parse(localStorage.getItem(m)||"{}")}catch{return{}}})();Object.prototype.hasOwnProperty.call(p,String(o))&&delete p[String(o)];try{localStorage.setItem(m,JSON.stringify(p))}catch{}r(i=>i+1)},[t,Z]);a.useEffect(()=>{if(!t||!n?.id)return;let o=!1;return(async()=>{V(!0),P(null);try{const m=await yt(t,n.id);if(o)return;const p={},i={},y={};m.forEach(T=>{p[T.studentId]=!!T.present,T.reason&&(i[T.studentId]=T.reason),T.studentName&&(y[T.studentId]=T.studentName)}),g(p),D(i),l(y)}catch(m){o||P(ue(m,"출석 정보를 불러오지 못했습니다."))}finally{o||V(!1)}})(),()=>{o=!0}},[t,n?.id]),a.useEffect(()=>{if(!t||n?.id)return;const o=Z().replace("attendance","attendanceNote");try{const m=JSON.parse(localStorage.getItem(o)||"{}");D(m||{})}catch{}},[t,n?.id,Z]);const J=a.useCallback((o,m,p)=>{if(D(i=>({...i,[o]:m})),t){const i=Z().replace("attendance","attendanceNote");try{const y=JSON.parse(localStorage.getItem(i)||"{}");y[String(o)]=m,localStorage.setItem(i,JSON.stringify(y))}catch{}}if(t&&n?.id&&p!=="none"){const i=S.current;i[o]&&window.clearTimeout(i[o]),i[o]=window.setTimeout(async()=>{Q(y=>({...y,[o]:!0}));try{const y=m.trim()||void 0;await Ae(t,n.id,o,{present:p==="present",reason:y,source:"MANUAL"})}catch{}finally{Q(y=>{const T={...y};return delete T[o],T})}},600)}},[t,n?.id,Z]),I=a.useCallback(async(o,m)=>{if(t&&n?.id){Q(p=>({...p,[o]:!0}));try{const p=M[o]?.trim()||void 0;await Ae(t,n.id,o,{present:m,reason:p,source:"MANUAL"}),g(i=>({...i,[o]:m})),xe(["/api/calendar/classes","/api/calendar/classes-range","/api/dashboard/summary","/api/dashboard/attendance-today","/api/attendance/daily",`/api/courses/${t}/records/${n.id}/attendance`]),F(n.recordDate??h??void 0);try{window.dispatchEvent(new CustomEvent("dashboard:attendance-refresh",{detail:{}}))}catch{}}catch(p){x(ue(p,"출석 처리에 실패했습니다."))}finally{Q(p=>({...p,[o]:!1}))}}else O(o,m)},[t,n?.id,n?.recordDate,M,O,F,x,h]),v=a.useCallback((o,m)=>{$({open:!0,studentId:o,target:m})},[]),w=a.useCallback(()=>{const o={};X.forEach(m=>{o[m.id]=m.status!=="present"}),te(o),A(!0)},[X]),z=a.useCallback(()=>{j||(A(!1),te({}))},[j]),se=a.useCallback(async(o,m)=>{const p=o?"present":"absent",i=o?"출석":"결석",y=ne.filter(G=>!G.isExtra),T=m?new Set(m):null,K=y.filter(G=>T&&!T.has(G.id)?!1:G.status!==p);if(K.length===0)return window.alert(m?"선택한 학생은 이미 출석 처리됐습니다.":`이미 모든 학생이 ${i} 상태입니다.`),!1;if(!m){const G=`총 ${K.length}명의 학생을 ${i} 처리할까요?${n?.id?`
변경 내용은 즉시 저장됩니다.`:""}`;if(!window.confirm(G))return!1}R(p);let ie=!1;if(t&&n?.id){Q(H=>{const re={...H};return K.forEach(({id:de})=>{re[de]=!0}),re});const G=[];let ae=null;for(const H of K)try{const re=M[H.id]?.trim()||void 0;await Ae(t,n.id,H.id,{present:o,reason:re,source:"MANUAL"}),G.push(H.id)}catch(re){ae||(ae=re)}if(Q(H=>{const re={...H};return K.forEach(({id:de})=>{delete re[de]}),re}),G.length){g(H=>{const re={...H};return G.forEach(de=>{re[de]=o}),re}),xe(["/api/calendar/classes","/api/calendar/classes-range","/api/dashboard/summary","/api/dashboard/attendance-today","/api/attendance/daily",`/api/courses/${t}/records/${n.id}/attendance`]),F(n?.recordDate??h??void 0);try{window.dispatchEvent(new CustomEvent("dashboard:attendance-refresh",{detail:{}}))}catch{}ie=!0}ae&&x(ue(ae,`일괄 ${i} 처리 중 일부가 실패했습니다.`))}else K.forEach(({id:G})=>O(G,o)),ie=K.length>0;return R(null),ie},[ne,t,n?.id,M,F,O,x,n?.recordDate,h]),ee=a.useCallback(async()=>{const o=Object.entries(N).filter(([,p])=>p).map(([p])=>Number(p));if(!o.length){window.alert("학생을 한 명 이상 선택해 주세요.");return}await se(!0,o)&&(A(!1),te({}))},[se,N]),pe=a.useMemo(()=>Object.values(N).filter(Boolean).length,[N]);return{attLoading:q,attError:k,attSavingMap:W,attendanceRows:ne,actionableRows:X,attendanceBuckets:C,attendanceRate:L,presentCount:E,bulkStatus:j,bulkDialogOpen:Y,selectedIds:N,setSelectedIds:te,selectedCount:pe,openBulkSelect:w,cancelBulkDialog:z,confirmBulkSelection:ee,bulkSetAttendance:se,attNoteMap:M,updateNote:J,clearAttendanceLocal:d,confirmOne:B,setConfirmOne:$,promptSetAttendance:v,confirmAndSetAttendance:I}}function sa({courseId:t,recordId:n,recId:s,ymd:h,maxFileSizeMB:x,allowedMime:f,showError:r}){const[u,g]=a.useState([]),[M,D]=a.useState(!1),[b,l]=a.useState(null),[S,q]=a.useState({}),[V,k]=a.useState([]),[P,W]=a.useState({}),Q=a.useRef({}),[B,$]=a.useState({}),j=a.useCallback(()=>t?s?`attachments:${t}:${s}`:h?`attachmentsDate:${t}:${h}`:`attachments:${t}:`:"attachments::",[t,s,h]),R=a.useCallback(()=>{try{return JSON.parse(localStorage.getItem(j())||"[]")}catch{return[]}},[j]),Y=a.useCallback(C=>{try{localStorage.setItem(j(),JSON.stringify(C))}catch{}},[j]),A=a.useCallback(C=>{const E=new Date().toISOString();return C.map((U,_)=>({id:-1-_,filename:U.name,size:U.size,createdAt:E}))},[]);a.useEffect(()=>{Q.current=P},[P]);const N=a.useCallback(async C=>{if(!t||!n)return;const E=C.filter(F=>(F.contentType||"").startsWith("image/")),U=3;let _=0;const L=async()=>{for(;_<E.length;){const F=E[_++];if(!Q.current[F.id])try{$(d=>({...d,[F.id]:!0}));const O=F.downloadUrl||(await He(t,n,F.id)).url;W(d=>({...d,[F.id]:O}))}catch{}finally{$(O=>({...O,[F.id]:!1}))}}};await Promise.all(Array.from({length:Math.min(U,E.length)},()=>L()))},[t,n]);a.useEffect(()=>{if(!t)return;let C=!1;return(async()=>{if(l(null),n){D(!0);try{const E=await St(t,n,{presign:!0});C||(g(E),N(E))}catch(E){C||l(ue(E,"첨부를 불러오지 못했습니다."))}finally{C||D(!1)}}else{const E=R();g(A(E))}})(),()=>{C=!0}},[t,n,s,h,R,A,N]);const te=a.useCallback(C=>{const E=x*1024*1024,U=Array.from(C),_=U.filter(d=>d.size<=E),L=U.filter(d=>d.size>E),F=_.filter(d=>!d.type||f.has(d.type)),O=_.filter(d=>d.type&&!f.has(d.type));return L.length>0?l(`용량 제한(${x}MB)을 초과한 파일 제외: ${L.map(d=>d.name).join(", ")}`):l(null),O.length>0&&l(d=>[d,`허용되지 않는 형식 제외: ${O.map(J=>J.name).join(", ")}`].filter(Boolean).join(" / ")),F},[f,x]),Z=a.useCallback(async C=>{if(C.length===0)return;if(!(t&&n)){const w=[...R(),...C.map(z=>({name:z.name,size:z.size}))];Y(w),g(A(w));return}const E=8,U=3,_=C.slice(0,E),L=C.length-_.length;L>0&&l(v=>[v,`최대 ${E}개까지만 업로드됩니다 (추가 ${L}개 제외)`].filter(Boolean).join(" / "));const F=_.map((v,w)=>({id:`${Date.now()}-${w}-${Math.random().toString(36).slice(2,8)}`,name:v.name,size:v.size,progress:0,status:"pending"}));k(v=>[...F,...v]);const O=[];let d=0;const J=async v=>{const w=_[v],z=F[v].id;let se;try{se=await vt(t,n,w.name,w.type||"application/octet-stream")}catch(pe){const o=ue(pe,"첨부 파일 업로드를 사용할 수 없습니다.");throw l(o),k(m=>m.map(p=>p.id===z?{...p,status:"error",error:o}:p)),pe}await new Promise((pe,o)=>{const m=new XMLHttpRequest;m.open("PUT",se.url,!0);for(const[p,i]of Object.entries(se.headers||{}))try{m.setRequestHeader(p,i)}catch{}k(p=>p.map(i=>i.id===z?{...i,status:"uploading",progress:0}:i)),m.upload.onprogress=p=>{if(p.lengthComputable){const i=Math.max(1,Math.min(99,Math.round(p.loaded/p.total*100)));k(y=>y.map(T=>T.id===z?{...T,progress:i}:T))}},m.onload=()=>{if(m.status>=200&&m.status<300)k(p=>p.map(i=>i.id===z?{...i,progress:100}:i)),pe();else{const p=`S3 업로드 실패: HTTP ${m.status}`;k(i=>i.map(y=>y.id===z?{...y,status:"error",error:p}:y)),o(new Error(p))}},m.onerror=()=>{const p="S3 업로드 중 네트워크 오류";k(i=>i.map(y=>y.id===z?{...y,status:"error",error:p}:y)),o(new Error(p))},m.send(w)});const ee=await Ct(t,n,{key:se.key,filename:w.name,contentType:w.type||"application/octet-stream",size:w.size,etag:void 0,originalName:w.name});O.push(ee),k(pe=>pe.map(o=>o.id===z?{...o,status:"done",progress:100}:o))},I=Array.from({length:Math.min(U,_.length)},async()=>{for(;d<_.length;){const v=d++;try{await J(v)}catch{}}});await Promise.all(I),O.length&&(g(v=>[...O,...v]),N(O)),window.setTimeout(()=>{k(v=>v.filter(w=>w.status!=="done"&&w.status!=="error"))},2500)},[t,n,R,Y,A,N]),ce=a.useCallback(async C=>{if(!C)return;const E=te(C);await Z(E)},[te,Z]),le=a.useCallback(async C=>{C.preventDefault();const E=C.dataTransfer?.files;if(!E||E.length===0)return;const U=te(E);await Z(U)},[te,Z]);a.useEffect(()=>()=>{Object.values(P).forEach(C=>{try{URL.revokeObjectURL(C)}catch{}})},[P]);const ne=a.useCallback(async C=>{if(!(!t||!n))try{$(U=>({...U,[C.id]:!0}));const E=C.downloadUrl||(await He(t,n,C.id)).url;window.open(E,"_blank","noopener")}catch(E){r(ue(E,"파일을 열 수 없습니다."))}finally{$(E=>({...E,[C.id]:!1}))}},[t,n,r]),X=a.useCallback(async(C,E)=>{const U=E?`"${E}" 파일을 삭제합니다. 되돌릴 수 없습니다.`:"선택한 파일을 삭제합니다. 되돌릴 수 없습니다.";if(window.confirm(U))if(t&&n){q(L=>({...L,[C]:!0}));try{await wt(t,n,C),g(L=>L.filter(F=>F.id!==C))}catch(L){r(ue(L,"삭제에 실패했습니다."))}finally{q(L=>({...L,[C]:!1}))}}else{const F=R().filter(O=>O.name!==E);Y(F),g(A(F))}},[t,n,R,Y,r,A]);return{files:u,filesLoading:M,filesError:b,fileBusy:S,uploadQueue:V,thumbUrl:P,previewBusy:B,onUpload:ce,onDropFiles:le,openAttachment:ne,onDeleteFile:X}}const ia=[{id:"midterm-essay",name:"중간고사(서술형)",inputMode:"percent",defaultNote:"핵심 개념 서술 정확도와 논리 전개 평가"},{id:"final-mixed",name:"기말고사(복합)",inputMode:"percent",defaultNote:"선다/서술 혼합: 정답률과 서술의 완성도"},{id:"weekly-quiz",name:"주간 퀴즈",inputMode:"percent",defaultNote:"최근 학습 범위에 대한 체크 퀴즈"},{id:"mock-test",name:"모의고사",inputMode:"percent",defaultNote:"시간 관리와 전 범위 개념 점검"}];function ra(){return ia.slice()}function la({courseId:t,record:n,ymd:s,searchParams:h,showError:x}){const[f,r]=a.useState([]),[u,g]=a.useState(!1),[M,D]=a.useState(null),[b,l]=a.useState(""),S=a.useRef(""),[q,V]=a.useState(""),[k,P]=a.useState("percent"),[W,Q]=a.useState(!1),[B,$]=a.useState(null),[j,R]=a.useState(!1),[Y,A]=a.useState("list"),[N,te]=a.useState(""),[Z,ce]=a.useState(!1),[le,ne]=a.useState({}),[X,C]=a.useState({}),[E,U]=a.useState(!1),[_,L]=a.useState("idle"),F=a.useRef(null),O=a.useRef(0),d=a.useMemo(()=>ra(),[]),[J,I]=a.useState(()=>d[0]?.id??""),v=a.useMemo(()=>d.find(i=>i.id===J)??null,[d,J]);a.useEffect(()=>{if(!d.length){J!==""&&I("");return}d.some(i=>i.id===J)||I(d[0]?.id??"")},[d,J]),a.useEffect(()=>{S.current=b},[b]),a.useEffect(()=>{const i=y=>{Object.keys(X).length>0&&(y.preventDefault(),y.returnValue="")};return window.addEventListener("beforeunload",i),()=>{window.removeEventListener("beforeunload",i)}},[X]);const w=a.useMemo(()=>f.find(i=>String(i.id)===b)||null,[f,b]),z=a.useMemo(()=>{const i=N.trim().toLowerCase();return i?f.filter(y=>(y.title||"").toLowerCase().includes(i)):f},[f,N]),se=a.useMemo(()=>Object.keys(X).length>0,[X]),ee=a.useCallback(async i=>{if(t){g(!0),D(null);try{const y=await Tt(t);r(y);let T="";if(i?.selectId&&y.some(K=>String(K.id)===String(i.selectId)))T=String(i.selectId);else{const K=S.current;if(K&&y.some(ie=>String(ie.id)===K))T=K;else{const ie=h.get("examId");if(ie&&y.some(G=>String(G.id)===ie))T=ie;else{const G=n?.recordDate||s||"";if(G){const ae=y.find(H=>H.examDate===G);ae&&(T=String(ae.id))}}}}l(T)}catch(y){D(ue(y,"시험 목록을 불러오지 못했습니다.")),r([]),i?.selectId&&l(String(i.selectId))}finally{g(!1)}}},[t,n?.recordDate,s,h]);a.useEffect(()=>{ee()},[ee]),a.useEffect(()=>{if(!t||!b){ne({});return}let i=!1;return(async()=>{try{try{xe(`/api/courses/${t}/exams/${b}/results`)}catch{}const y=await Ue(t,Number(b));if(i)return;const T={};for(const K of y)T[K.studentId]={score:K.score,outOf:K.outOf,level:K.level,note:K.note};ne(T)}catch{i||ne({})}})(),()=>{i=!0}},[t,b]);const pe=a.useCallback(()=>b?(R(!1),!0):!1,[b]),o=a.useCallback(async()=>{if(!t||!b)return!1;try{return await Dt(t,Number(b)),await ee(),l(""),!0}catch(i){return D(ue(i,"시험 삭제에 실패했습니다.")),!1}},[t,b,ee]),m=a.useCallback(async()=>{if(!t||W)return!1;const i=d.find(G=>G.id===J)??null,y=n?.recordDate||s||"",T=q.trim(),K=f.length>0;if(!K&&!T)return $("시험 제목을 입력해 주세요."),!1;const ie=!K&&T?T:i&&y?`${i.name} (${y})`:i?i.name:T||(y?`${y} 시험`:"시험");$(null),Q(!0);try{const G={title:ie,inputMode:i?.inputMode??k,kind:"TEST",examDate:n?.recordDate||s||void 0,templateId:i?.id},ae=await Rt(t,G);return await ee({selectId:ae.id}),l(String(ae.id)),V(""),P("percent"),I(d[0]?.id??""),$(null),A("list"),ce(!0),window.setTimeout(()=>ce(!1),2e3),ae.id}catch(G){return $(ue(G,"시험 생성에 실패했습니다.")),null}finally{Q(!1)}},[t,f.length,W,n?.recordDate,s,ee,J,d,q,k]),p=a.useCallback(async()=>{if(!t)return;if(!w){alert("먼저 시험을 선택하거나 생성하세요.");return}const i=n?.recordDate||s||new Date().toISOString().slice(0,10),y=O.current;U(!0),L("idle");try{const T=Object.entries(X).map(([ie,G])=>{const ae=Number(ie);let H,re;if(w.inputMode==="percent"){const fe=G?.percent;if(fe!==void 0&&fe!==""){const ge=Number(fe);H=Number.isFinite(ge)?Math.max(0,Math.min(100,Math.round(ge))):void 0}else H=void 0}else re=G?.letter;const de={studentId:ae};return H!==void 0&&(de.score=H,de.outOf=100),re!==void 0&&(de.level=re),de});if(T.length===0){U(!1);return}if(!w.examDate&&i)try{await At(t,Number(b),{examDate:i})}catch{}await Nt(t,Number(b),T);try{xe(`/api/courses/${t}/exams/${b}/results`)}catch{}try{const ie=await Ue(t,Number(b)),G={};for(const ae of ie)G[ae.studentId]={score:ae.score,outOf:ae.outOf,level:ae.level,note:ae.note};ne(G)}catch{}O.current===y&&L("success"),window.setTimeout(()=>{O.current===y&&(C({}),L("idle"))},1500)}catch(T){x(ue(T,"성적 저장에 실패했습니다. 다시 시도해 주세요.")),L("error")}finally{U(!1)}},[t,X,n?.recordDate,w,b,x,s]);return{exams:f,examLoading:u,examError:M,selectedExamId:b,setSelectedExamId:l,examFormTitle:q,setExamFormTitle:V,examFormMode:k,setExamFormMode:P,examFormSaving:W,setExamFormSaving:Q,examFormError:B,setExamFormError:$,examModalOpen:j,setExamModalOpen:R,examModalView:Y,setExamModalView:A,examQuery:N,setExamQuery:te,examCreateOk:Z,setExamCreateOk:ce,selectedExam:w,filteredExams:z,examTemplates:d,examFormTemplateId:J,setExamFormTemplateId:I,selectedExamTemplate:v,examResultsMap:le,setExamResultsMap:ne,gradeMap:X,setGradeMap:C,gradeSaving:E,setGradeSaving:U,gradeFeedback:_,setGradeFeedback:L,gradeAutoSaveTimerRef:F,lastGradeEditAtRef:O,selectedExamIdRef:S,hasGradeChanges:se,refreshExams:ee,handleConfirmExamSelection:pe,handleDeleteSelectedExam:o,handleCreateExamInline:m,saveScoresForPresent:p}}const oa=1500;function ca({courseId:t,recordId:n,ymd:s,searchParams:h}){const{error:x}=Xe(),{course:f,record:r,setRecord:u,students:g,loading:M,error:D}=Yn({courseId:t,recId:n,ymd:s}),b=na({courseId:t,course:f,record:r,setRecord:u,ymd:s,showError:x}),l=aa({courseId:t,record:r,students:g,ymd:s,showError:x}),S=5,q=sa({courseId:t,recordId:n,recId:n,ymd:s,maxFileSizeMB:S,allowedMime:new Set(["image/jpeg","image/png","image/webp","application/pdf"]),showError:x}),V=la({courseId:t,record:r,ymd:s,searchParams:h,showError:x}),{setExamModalView:k,setExamModalOpen:P,setExamFormError:W,handleDeleteSelectedExam:Q,selectedExam:B,gradeMap:$,examResultsMap:j,gradeSaving:R,hasGradeChanges:Y,gradeAutoSaveTimerRef:A,saveScoresForPresent:N,examCreateOk:te,examLoading:Z,selectedExamId:ce,exams:le,setExamFormTitle:ne,setExamFormMode:X,setExamFormTemplateId:C,examTemplates:E}=V,[U,_]=a.useState("attendance"),[L,F]=a.useState("intro");a.useEffect(()=>{if(le.length===0){L!=="intro"&&F("intro");return}B?L!=="scores"&&F("scores"):L==="intro"&&F("list")},[le,B,L]);const O=a.useMemo(()=>l.attendanceRows.filter(H=>!H.isExtra).map(H=>({id:H.id,name:H.name})),[l.attendanceRows]),d=a.useMemo(()=>{if(!B)return null;let H=0,re=0;for(const de of O){let fe=null;if(B.inputMode==="percent"){const ge=$[de.id]?.percent;if(ge!==void 0&&ge!==""){const ye=Number(ge);Number.isFinite(ye)&&(fe=Math.max(0,Math.min(100,Math.round(ye))))}else{const ye=j[de.id]?.score;ye!=null&&Number.isFinite(ye)&&(fe=Math.max(0,Math.min(100,Math.round(ye))))}}else{const ge=$[de.id]?.letter??j[de.id]?.level??"";fe=ea(ge)}fe!=null&&(H+=fe,re+=1)}return re===0?null:Math.round(H/re*10)/10},[j,$,B,O]);a.useEffect(()=>{if(B&&Y&&!R&&O.length!==0)return A.current&&window.clearTimeout(A.current),A.current=window.setTimeout(()=>{A.current=null,N()},oa),()=>{A.current&&(window.clearTimeout(A.current),A.current=null)}},[A,R,Y,N,O.length,B]);const J=a.useMemo(()=>d==null?null:B?.inputMode==="letter"?In(d):d.toFixed(1),[d,B]),I=l.actionableRows.filter(H=>H.status!=="present").length,v=l.attendanceRows,w=a.useCallback(()=>{!l.bulkStatus&&!l.attLoading&&I>0&&l.bulkSetAttendance(!0)},[l,I]),z=a.useCallback(()=>{!l.bulkStatus&&!l.attLoading&&I>0&&l.openBulkSelect()},[l,I]),se=a.useCallback(()=>{k("list"),W(null),P(!0)},[W,P,k]),ee=a.useCallback(async()=>{await Q()&&F("list")},[Q]),pe={recordId:r?.id??null,rows:v,attLoading:l.attLoading,attError:l.attError,attSavingMap:l.attSavingMap,bulkStatus:l.bulkStatus,actionableRows:l.actionableRows,selectedIds:l.selectedIds,setSelectedIds:l.setSelectedIds,selectedCount:l.selectedCount,bulkDialogOpen:l.bulkDialogOpen,cancelBulkDialog:l.cancelBulkDialog,confirmBulkSelection:l.confirmBulkSelection,attNoteMap:l.attNoteMap,updateNote:l.updateNote,clearAttendanceLocal:l.clearAttendanceLocal,confirmOne:l.confirmOne,setConfirmOne:l.setConfirmOne,promptSetAttendance:l.promptSetAttendance,confirmAndSetAttendance:l.confirmAndSetAttendance,students:g,showLocalHint:!r?.id},o={gradeView:L,setGradeView:F,avgSummary:J,scoreStudents:O,grades:V,openExamModal:H=>{k(H),W(null),ne(""),X("percent"),H==="create"&&C(E[0]?.id??""),P(!0)},closeExamModal:()=>P(!1)},m=l.attendanceBuckets,p=m.total,i=l.attendanceRate??(p?Math.round(m.present/p*100):null),y=p?Math.round(m.present/p*100):0,T=p?Math.round(m.absent/p*100):0,K=p?Math.round(m.none/p*100):0,ie=M&&!f,G=M&&l.actionableRows.length===0,ae=a.useCallback(async()=>{if(!t||!r?.id)return!1;try{return await kt(t,r.id),xe(["/api/calendar/classes","/api/calendar/classes-range",`/api/courses/${t}`,`/api/courses/${t}/records`]),!0}catch(H){return x(ue(H,"삭제에 실패했습니다.")),!1}},[t,r?.id,x]);return{course:f,record:r,loading:M,error:D,editor:b,attendance:l,attachments:q,maxFileSizeMb:S,grades:V,rightTab:U,setRightTab:_,attendancePanelProps:pe,gradesPanelProps:o,attendanceMeta:{actionableCount:I,onBulkAllPresent:w,onOpenBulkSelect:z},gradesMeta:{examCreateOk:te,selectedExamId:ce?Number(ce):null,examLoading:Z,onOpenExamModal:se,onDeleteExam:ee},avgSummary:J,stats:{loading:G,summaryRate:i,actionableTotal:p,actionablePresent:m.present,actionableAbsent:m.absent,actionableNone:m.none,presentShare:y,absentShare:T,noneShare:K},headLoading:ie,deleteRecord:ae}}function ya(){const{id:t,recordId:n,ymd:s}=Ze(),[h]=Ie(),x=et(),f=a.useMemo(()=>{if(!t)return null;const b=Number(t);return Number.isFinite(b)?b:null},[t]),r=a.useMemo(()=>{if(!n)return null;const b=Number(n);return Number.isFinite(b)?b:null},[n]),u=ca({courseId:f,recordId:r,ymd:s,searchParams:h}),g=()=>{f!=null?x(`/classes/${f}`):x("/classes")},M=async()=>{const b=await u.deleteRecord();return b&&g(),b},D=!!u.record?.id;return e.jsx(qn,{header:{courseId:f,courseTitle:u.course?.title??u.course?.name??null,headLoading:u.headLoading,whenInfo:u.editor.meta.whenInfo,canDelete:D},onBack:g,onDeleteRecord:M,error:u.error,loading:u.loading,stats:u.stats,editor:u.editor,attachments:{...u.attachments,maxFileSizeMb:u.maxFileSizeMb},recordExists:D,attendancePanelProps:u.attendancePanelProps,attendanceMeta:u.attendanceMeta,gradesPanelProps:u.gradesPanelProps,gradesMeta:u.gradesMeta,rightTab:u.rightTab,onChangeRightTab:u.setRightTab,headLoading:u.headLoading})}export{ya as default};
