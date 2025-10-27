import{d as o,j as e,C as Qe,r as i,u as Xe,e as Ze,c as et}from"./index-B0K7mn4q.js";import{B as tt}from"./BackButton-BW37zkWn.js";import{e as De,l as nt,G as $e,f as ue,d as xe,T as Ne}from"./UI-Cj3YhchZ.js";import{a as be,d as st}from"./format-DW-Kl_C3.js";import{S as ye}from"./SelectBox-DLApmcHT.js";import{g as rt,b as it,c as ot}from"./students-BeT2wLPO.js";import{u as at}from"./useConfirmDialog-DCN8mg1d.js";import{r as $}from"./errors-C6OcbAl5.js";import{l as lt,a as ct}from"./exams-DEQiqh-d.js";import{l as dt,c as ut,u as xt,d as pt,a as ft}from"./counsels-CKa17QDL.js";import"./ConfirmDialog-ClQeXE4D.js";const O=o.section`
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 16px;
  min-width: 0;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
`,I=o.h3`
  margin: 0;
  font-size: 16px;
  color: #0f172a;
`,se=o.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`,pe=o.div`
  display: inline-flex;
  gap: 12px;
`,Ae=o.div`
  height: 1px;
  background: #e5e7eb;
  margin: 6px 0 10px;
`,Se=o.div`
  display: grid;
  gap: 14px;
`,ht=o.div`
  display: grid;
  grid-template-columns: 44px 1fr auto;
  gap: 12px;
  align-items: center;
  margin-bottom: 6px;
`,gt=o.div`
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: #eef2ff;
  color: #4f46e5;
  display: grid;
  place-items: center;
  font-weight: 800;
`,mt=o.div`
  font-size: 19px;
  font-weight: 900;
  color: #0f172a;
  letter-spacing: -0.01em;
`,ze=o.div`
  color: #6b7280;
  font-size: 12px;
`,jt=o.div`
  font-size: 28px;
  font-weight: 900;
  color: #111827;
  line-height: 1.2;
`,bt=o.span`
  padding: 4px 10px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 800;
  &[data-type="ENROLLED"] {
    background: #dcfce7;
    color: #16a34a;
  }
  &[data-type="ON_LEAVE"] {
    background: #fef3c7;
    color: #b45309;
  }
  &[data-type="PENDING"] {
    background: #f3e8ff;
    color: #7c3aed;
  }
`,te=o.div`
  display: grid;
  grid-template-columns: 100px 1fr;
  gap: 8px;
`,ne=o.div`
  color: #6b7280;
  font-size: 13px;
  align-self: center;
`,yt=o.div`
  color: #111827;
  font-size: 15px;
`,z=o.div`
  color: #6b7280;
  font-size: 13px;
`,Te=o.div`
  display: inline-flex;
  gap: 6px;
  flex-wrap: wrap;
`,T=o(De)`
  height: 40px;
  padding: 0 16px;
  font-size: 14px;
  &[data-active="true"] {
    background: #f3f4f6;
    color: #111827;
    border-color: #e5e7eb;
  }
`,Oe=o.span`
  min-width: 18px;
  height: 18px;
  padding: 0 6px;
  border-radius: 9999px;
  background: #e5e7eb;
  color: #374151;
  font-weight: 800;
  font-size: 11px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
`,Y=o.div`
  color: #6b7280;
  font-size: 13px;
  text-align: center;
  border: 1px dashed #e5e7eb;
  border-radius: 10px;
  padding: 16px;
  background: #fafafa;
`,N=o(De)`
  height: 40px;
  padding: 0 16px;
  font-size: 14px;
`,St=o.pre`
  margin: 0;
  white-space: pre-line;
  color: #111827;
  font-size: 15px;
  line-height: 1.7;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 12px 14px;
  text-wrap: pretty;
`,Ct=o.textarea`
  width: 100%;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 10px 12px;
  resize: vertical;
  font-size: 14px;
  color: #111827;
  min-height: 120px;
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.15);
  }
`,vt=o.div`
  display: grid;
  gap: 8px;
`,wt=o.div`
  display: grid;
  gap: 8px;
`,Et=o.div`
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 10px 12px;
  background: #fff;
  display: grid;
  gap: 6px;
`,Mt=o.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`,kt=o.div`
  color: #6b7280;
  font-size: 12px;
`,Dt=o.div`
  display: inline-flex;
  gap: 6px;
`,Ce=o.textarea`
  width: 100%;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 8px 10px;
  resize: vertical;
  font-size: 14px;
  color: #111827;
`,$t=o.pre`
  margin: 0;
  white-space: pre-wrap;
  color: #111827;
  font-size: 14px;
`,Nt=o.div`
  display: grid;
  gap: 8px;
`,At=o.div`
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 10px 12px;
  display: grid;
  gap: 6px;
  background: #fff;
`,zt=o.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`,Tt=o.div`
  font-weight: 800;
  color: #0f172a;
  font-size: 14px;
`,Ot=o.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: #6b7280;
  font-size: 12px;
  code {
    background: #f3f4f6;
    padding: 2px 6px;
    border-radius: 6px;
  }
`,Ft=o.span`
  padding: 2px 8px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 800;
  &[data-type="IN_PROGRESS"] {
    background: #dcfce7;
    color: #16a34a;
  }
  &[data-type="PENDING"] {
    background: #f3e8ff;
    color: #7c3aed;
  }
  &[data-type="STOPPED"] {
    background: #e5e7eb;
    color: #374151;
  }
`,Lt=o.input`
  height: 32px;
  padding: 0 10px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 13px;
`,Rt=o.textarea`
  width: 100%;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 8px 10px;
  resize: vertical;
  font-size: 14px;
  color: #111827;
`,Bt=o.div`
  display: grid;
  gap: 8px;
`,Pt=o.div`
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 12px 14px;
  background: #fff;
  display: grid;
  gap: 10px;
`,Ht=o.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`,Gt=o.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`,ve=o.div`
  display: inline-flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: flex-end;
`,It=o.span`
  font-size: 13px;
  font-weight: 700;
  color: #1f2937;
`,_t=o.pre`
  margin: 0;
  white-space: pre-wrap;
  color: #111827;
  font-size: 14px;
  background: #f9fafb;
  padding: 12px 14px;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
`,qt=o.div`
  display: grid;
  gap: 10px;
`,Yt=o.div`
  display: flex;
  align-items: center;
  gap: 8px;
`,we=o.div`
  flex: 1;
`,Wt=o.div`
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  margin-bottom: 16px;
`,Ee=o.div`
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 14px 16px;
  background: #ffffff;
  display: grid;
  gap: 6px;
`,de=o.span`
  color: #6b7280;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.02em;
  text-transform: uppercase;
`;function Ut({student:t,intlAge:n,deleting:r,editHref:s,onDelete:l}){return e.jsxs(e.Fragment,{children:[e.jsxs(O,{children:[e.jsxs(se,{children:[e.jsx(I,{children:"기본 정보"}),e.jsxs(pe,{children:[e.jsx(nt,{to:s,"data-variant":"edit",children:"수정"}),e.jsx($e,{"data-variant":"danger",disabled:r,onClick:()=>void l(),children:r?"삭제 중...":"삭제"})]})]}),t?e.jsxs(Se,{children:[e.jsxs(ht,{children:[e.jsx(gt,{children:t.name.slice(0,1)}),e.jsxs("div",{children:[e.jsx(mt,{children:t.name}),e.jsxs(ze,{children:["코드 ",t.code," · ID ",t.id]})]}),e.jsx(bt,{"data-type":t.status,children:t.status==="ENROLLED"?"수강중":t.status==="ON_LEAVE"?"휴학":"대기중"})]}),e.jsx(H,{label:"연락처",value:be(t.phoneNumber)}),e.jsx(H,{label:"생년월일",value:t.birthDate?`${t.birthDate}${n!=null?` (만 ${n}세)`:""}`:"-"}),e.jsx(H,{label:"주소",value:t.address||"-"}),e.jsx(H,{label:"등록일",value:t.joinedDate||t.createdAt?.slice(0,10)||"-"})]}):e.jsx(z,{children:"원생 정보를 찾을 수 없습니다."})]}),e.jsxs(O,{children:[e.jsx(se,{children:e.jsx(I,{children:"부모님 정보"})}),t?e.jsxs(Se,{children:[e.jsx(H,{label:"보호자 이름",value:t.parentName||"-"}),e.jsx(H,{label:"보호자 연락처",value:be(t.guardianPhone)})]}):e.jsx(z,{children:"부모님 정보를 찾을 수 없습니다."})]})]})}function H({label:t,value:n}){return e.jsxs(te,{children:[e.jsx(ne,{children:t}),e.jsx(yt,{children:n||"-"})]})}function Vt({notes:t,editing:n,notesInput:r,onChange:s,onEdit:l,onCancel:x,onSave:p}){return e.jsxs(O,{children:[e.jsxs(se,{children:[e.jsx(I,{children:"특이사항"}),e.jsx(pe,{children:n?e.jsxs(e.Fragment,{children:[e.jsx(N,{type:"button",onClick:x,children:"취소"}),e.jsx(ue,{type:"button",onClick:p,children:"저장"})]}):t?e.jsx($e,{type:"button",onClick:l,children:"편집"}):e.jsx(xe,{type:"button",onClick:l,children:"메모 추가"})})]}),n?e.jsx(Ct,{rows:8,value:r,onChange:u=>s(u.target.value),placeholder:"예: 과학고 진학 관심, 수학 약점 보완 필요, 알러지 등"}):t?e.jsx(St,{title:t,children:t}):e.jsx(Kt,{})]})}function Kt(){return e.jsx(Y,{children:"특이사항이 없습니다. 메모를 추가해 주세요."})}function Jt({memos:t,newMemo:n,onChangeNewMemo:r,onAddMemo:s,editingMemoId:l,editingMemoText:x,onChangeEditingMemoText:p,onBeginEditMemo:u,onCancelEditMemo:c,onSaveEditMemo:d,onDeleteMemo:g,formatDate:S}){return e.jsxs(O,{children:[e.jsxs(se,{children:[e.jsx(I,{children:"메모 사항"}),e.jsx(pe,{children:e.jsx(xe,{type:"button",onClick:s,children:"추가"})})]}),e.jsx(vt,{children:e.jsx(Ce,{rows:3,value:n,onChange:f=>r(f.target.value),placeholder:"메모를 입력하세요"})}),e.jsxs(wt,{children:[t.length===0&&e.jsx(Y,{children:"메모가 없습니다. 메모를 추가해 주세요."}),t.map(f=>{const y=l===f.id,a=S(f.updatedAt||f.createdAt);return e.jsxs(Et,{children:[e.jsxs(Mt,{children:[e.jsxs(kt,{children:[a,f.updatedAt?e.jsx("span",{style:{marginLeft:6,color:"#6b7280"},children:"(수정됨)"}):null]}),e.jsx(Dt,{children:y?e.jsxs(e.Fragment,{children:[e.jsx(N,{type:"button",onClick:c,children:"취소"}),e.jsx(ue,{type:"button",onClick:d,children:"저장"})]}):e.jsxs(e.Fragment,{children:[e.jsx(N,{type:"button",onClick:()=>u(f.id),children:"편집"}),e.jsx(N,{type:"button","data-variant":"danger",onClick:()=>void g(f.id),children:"삭제"})]})})]}),y?e.jsx(Ce,{rows:4,value:x,onChange:j=>p(j.target.value)}):e.jsx($t,{children:f.text})]},f.id)})]})]})}function Qt({courses:t,onOpenCourse:n,statusLabel:r}){return!t||t.length===0?e.jsx(Y,{children:"수강 중인 수업이 없습니다."}):e.jsx(Nt,{children:t.map(s=>e.jsxs(At,{children:[e.jsxs(zt,{children:[e.jsx(Tt,{children:s.title}),e.jsx(N,{type:"button",onClick:()=>n(s.id),children:"상세"})]}),e.jsxs(Ot,{children:[e.jsx("code",{children:s.code}),e.jsx(Ft,{"data-type":s.status,children:r(s.status)})]})]},s.id))})}function Xt({rows:t,loading:n,error:r}){return e.jsxs(e.Fragment,{children:[r&&e.jsx(Zt,{children:r}),e.jsxs(Wt,{children:[e.jsxs(Ee,{children:[e.jsx(de,{children:"이번 달 출석률"}),e.jsx(jt,{children:tn(t)}),e.jsx(z,{children:nn(t)})]}),e.jsxs(Ee,{children:[e.jsx(de,{children:"최근 결석"}),e.jsx(z,{children:sn(t)})]})]}),n?e.jsx(z,{children:"불러오는 중..."}):e.jsxs(Ne,{style:{minWidth:640},children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"날짜"}),e.jsx("th",{children:"과목"}),e.jsx("th",{children:"상태"}),e.jsx("th",{children:"메모"})]})}),e.jsx("tbody",{children:t.length===0?e.jsx("tr",{children:e.jsx("td",{colSpan:4,children:e.jsx(z,{children:"출석 기록이 없습니다."})})}):t.map((s,l)=>e.jsxs("tr",{children:[e.jsx("td",{children:s.date}),e.jsx("td",{children:s.courseTitle}),e.jsx("td",{children:s.present?"출석":"결석"}),e.jsx("td",{children:s.reason||"-"})]},`${s.date}-${s.courseId}-${l}`))})]})]})}const Zt=({children:t})=>e.jsx(en,{children:t}),en=o.div`
  color: #b91c1c;
  font-size: 12px;
  font-weight: 700;
  margin-bottom: 8px;
`;function tn(t){const n=new Date,r=n.getFullYear(),s=n.getMonth()+1,l=t.filter(p=>{const[u,c]=p.date.split("-").map(Number);return u===r&&c===s});if(l.length===0)return"—";const x=l.filter(p=>p.present).length;return`${Math.round(x/l.length*100)}%`}function nn(t){const n=new Date,r=n.getFullYear(),s=n.getMonth()+1,l=t.filter(u=>{const[c,d]=u.date.split("-").map(Number);return c===r&&d===s});if(l.length===0)return"이번 달 기록 없음";const x=l.filter(u=>u.present).length,p=l.length-x;return`출석 ${x} · 결석 ${p}`}function sn(t){const n=t.filter(r=>!r.present).slice(0,3).map(r=>`${r.date} ${r.courseTitle}`);return n.length===0?"최근 결석 없음":n.join(", ")}function rn({grades:t,courses:n,loading:r,error:s}){const l=on(n);return s?e.jsx(ln,{children:s}):r?e.jsx(z,{children:"시험 성적을 불러오는 중..."}):t.length?e.jsxs(Ne,{style:{minWidth:720},children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"시험/과목"}),e.jsx("th",{children:"수업"}),e.jsx("th",{children:"일자"}),e.jsx("th",{children:"성적"})]})}),e.jsx("tbody",{children:t.map(x=>e.jsxs("tr",{children:[e.jsx("td",{children:e.jsxs("div",{style:{display:"grid"},children:[e.jsx("strong",{children:x.subject||"성적"}),x.note&&e.jsx(ze,{style:{maxWidth:420,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"},children:x.note})]})}),e.jsx("td",{children:l.get(x.courseId??-1)??"-"}),e.jsx("td",{children:x.date||"-"}),e.jsx("td",{children:an(x)})]},x.id))})]}):e.jsx(Y,{children:"등록된 성적이 없습니다."})}function on(t){const n=new Map;if(!t)return n;for(const r of t)n.set(r.id,r.title);return n}function an(t){if(t.level)return t.level;if(t.score!=null){const n=t.outOf!=null&&Number.isFinite(t.outOf)?`/${t.outOf}`:"";return`${t.score}${n}`}return"-"}const ln=({children:t})=>e.jsx(cn,{children:t}),cn=o.div`
  color: #b91c1c;
  font-size: 12px;
  font-weight: 700;
  margin-bottom: 8px;
`;function dn({counsels:t,loading:n,error:r,exporting:s,onExport:l,onAddCounsel:x,addDisabled:p,editingCounselId:u,editDate:c,editHour:d,editMin:g,editContent:S,onChangeDate:f,onChangeHour:y,onChangeMin:a,onChangeContent:j,onStartEdit:h,onCancelEdit:m,onSaveEdit:C,onRequestDelete:E,savingEdit:D,hourOptions:R,minuteOptions:F,isAddingModalOpen:B}){return e.jsxs(e.Fragment,{children:[e.jsxs(Ht,{children:[e.jsx("div",{children:e.jsx(de,{children:"상담기록"})}),e.jsxs("div",{style:{display:"inline-flex",gap:8,alignItems:"center"},children:[e.jsx(N,{type:"button",onClick:l,disabled:s,children:s?"엑셀 준비 중...":"엑셀 추출"}),e.jsx(xe,{type:"button",onClick:x,disabled:p,children:"상담 추가"})]})]}),r&&!B&&e.jsx(xn,{children:r}),n?e.jsx(z,{children:"불러오는 중..."}):t.length===0?e.jsx(Y,{children:"상담 기록이 없습니다."}):e.jsx(Bt,{children:t.map(k=>{const w=u===k.id;return e.jsx(Pt,{children:w?e.jsxs(e.Fragment,{children:[e.jsxs(qt,{children:[e.jsxs(te,{children:[e.jsx(ne,{children:"상담 일자"}),e.jsx(Lt,{type:"date",lang:"ko-KR",value:c,onChange:M=>f(M.target.value)})]}),e.jsxs(te,{children:[e.jsx(ne,{children:"시간"}),e.jsxs(Yt,{children:[e.jsx(we,{children:e.jsx(ye,{ariaLabel:"시",value:d,onChange:y,placeholder:"시",options:R.map(M=>({label:M,value:M}))})}),e.jsx("span",{children:":"}),e.jsx(we,{children:e.jsx(ye,{ariaLabel:"분",value:g,onChange:a,placeholder:"분",options:F.map(M=>({label:M,value:M}))})})]})]}),e.jsxs(te,{style:{gridColumn:"1 / -1"},children:[e.jsx(ne,{children:"내용"}),e.jsx(Rt,{rows:4,value:S,onChange:M=>j(M.target.value)})]})]}),e.jsxs(ve,{children:[e.jsx(N,{type:"button",onClick:m,children:"취소"}),e.jsx(ue,{type:"button",disabled:D||!c||!d||!g,onClick:()=>C(k.id),children:"저장"})]})]}):e.jsxs(e.Fragment,{children:[e.jsxs(Gt,{children:[e.jsx(It,{children:un(k.counselTime)}),e.jsxs(ve,{children:[e.jsx(N,{type:"button",onClick:()=>h(k),children:"편집"}),e.jsx(N,{type:"button","data-variant":"danger",onClick:()=>E(k.id),children:"삭제"})]})]}),e.jsx(_t,{children:(k.content||"").trim()||"내용 없음"})]})},k.id)})})]})}function un(t){try{const n=new Date(t),r=["일","월","화","수","목","금","토"][n.getDay()],s=n.getFullYear(),l=n.getMonth()+1,x=n.getDate(),p=String(n.getHours()).padStart(2,"0"),u=String(n.getMinutes()).padStart(2,"0");return`${s}년 ${l}월 ${x}일 (${r}) ${p}:${u}`}catch{return t}}const xn=({children:t})=>e.jsx(pn,{children:t}),pn=o.div`
  color: #b91c1c;
  font-size: 12px;
  font-weight: 700;
  margin-bottom: 8px;
`;function fn(t,n){const r=URL.createObjectURL(t),s=document.createElement("a");s.href=r,s.download=n,document.body.appendChild(s),s.click(),s.remove(),URL.revokeObjectURL(r)}function hn(t){const r=(t?t.trim():"export").replace(/[\\/:*?"<>|]+/g,"_");return r.length?r:"export"}function L(t){return String(t).padStart(2,"0")}function gn(t){return st(t,{includeWeekday:!0})}function Me(){const t=new Date;return`${t.getFullYear()}-${L(t.getMonth()+1)}-${L(t.getDate())}`}function ke(t,n,r){return`${t}T${n}:${r}:00`}function mn(t,n){const r=t?.trim()||`student_${n}`;return hn(`${r}_counsels`)}function jn(t){switch(t){case"IN_PROGRESS":return"진행중";case"PENDING":return"대기";case"STOPPED":return"중단";default:return t}}function bn({loading:t,studentError:n,student:r,intlAge:s,deleting:l,editHref:x,onDeleteStudent:p,notes:u,memos:c,activeTab:d,onSelectTab:g,coursesCount:S,attendance:f,grades:y,counsels:a,deleteConfirmDialog:j,onOpenCourse:h}){return e.jsxs(Sn,{children:[e.jsxs(Cn,{children:[e.jsx(tt,{to:"/students",label:"뒤로"}),e.jsx("h2",{children:"원생 상세"})]}),t?e.jsx(yn,{}):null,n?e.jsx(vn,{children:n}):null,t?null:e.jsxs(Fe,{children:[e.jsxs(Le,{children:[e.jsx(Ut,{student:r,intlAge:s,deleting:l,editHref:x,onDelete:p}),e.jsx(Vt,{notes:u.notes,editing:u.editing,notesInput:u.notesInput,onChange:u.setNotesInput,onEdit:u.startEditing,onCancel:u.cancelEditing,onSave:u.save}),e.jsx(Jt,{memos:c.memos,newMemo:c.newMemo,onChangeNewMemo:c.setNewMemo,onAddMemo:c.addMemo,editingMemoId:c.editingMemoId,editingMemoText:c.editingMemoText,onChangeEditingMemoText:c.setEditingMemoText,onBeginEditMemo:c.beginEditMemo,onCancelEditMemo:c.cancelEditMemo,onSaveEditMemo:c.saveEditMemo,onDeleteMemo:c.requestDeleteMemo,formatDate:gn})]}),e.jsx(Re,{children:e.jsxs(O,{children:[e.jsx(Be,{children:e.jsxs(Te,{children:[e.jsxs(T,{"data-active":d==="courses",onClick:()=>g("courses"),children:["수강수업 ",e.jsx(Oe,{children:S})]}),e.jsx(T,{"data-active":d==="attendance",onClick:()=>g("attendance"),children:"출석현황"}),e.jsx(T,{"data-active":d==="grades",onClick:()=>g("grades"),children:"성적"}),e.jsx(T,{"data-active":d==="counsels",onClick:()=>g("counsels"),children:"상담기록"})]})}),e.jsx(Ae,{}),d==="courses"?e.jsx(q,{children:e.jsx(Qt,{courses:r?.courses,onOpenCourse:h,statusLabel:jn})}):null,d==="attendance"?e.jsx(q,{children:e.jsx(Xt,{rows:f.rows,loading:f.loading,error:f.error})}):null,d==="grades"?e.jsx(q,{children:e.jsx(rn,{grades:y.grades,courses:r?.courses,loading:y.loading,error:y.error})}):null,d==="counsels"?e.jsx(q,{children:e.jsx(dn,{counsels:a.counsels,loading:a.loading,error:a.tabError,exporting:a.exporting,onExport:a.handleExport,onAddCounsel:a.openAddModal,addDisabled:a.addModalOpen,editingCounselId:a.editState.editingId,editDate:a.editState.editDate,editHour:a.editState.editHour,editMin:a.editState.editMinute,editContent:a.editState.editContent,onChangeDate:a.editState.setEditDate,onChangeHour:a.editState.setEditHour,onChangeMin:a.editState.setEditMinute,onChangeContent:a.editState.setEditContent,onStartEdit:a.editState.beginEdit,onCancelEdit:a.editState.cancelEdit,onSaveEdit:a.editState.saveEdit,onRequestDelete:a.requestDelete,savingEdit:a.editState.saving,hourOptions:a.hourOptions,minuteOptions:a.minuteOptions,isAddingModalOpen:a.addModalOpen})}):null]})})]}),j]})}function yn(){return e.jsxs(Fe,{children:[e.jsxs(Le,{children:[e.jsxs(O,{children:[e.jsx(I,{children:"기본 정보"}),e.jsxs(Mn,{children:[e.jsx(En,{}),e.jsxs("div",{children:[e.jsx(ee,{w:140,h:18}),e.jsx(ee,{w:120,h:12,mt:6})]}),e.jsx(kn,{})]}),e.jsx(G,{}),e.jsx(G,{}),e.jsx(G,{}),e.jsx(G,{})]}),e.jsxs(O,{children:[e.jsx(I,{children:"부모님 정보"}),e.jsx(G,{}),e.jsx(G,{})]})]}),e.jsx(Re,{children:e.jsxs(O,{children:[e.jsx(Be,{children:e.jsxs(Te,{children:[e.jsxs(T,{"data-active":!0,children:["수강수업 ",e.jsx(Oe,{children:"0"})]}),e.jsx(T,{children:"출석현황"}),e.jsx(T,{children:"성적"}),e.jsx(T,{children:"상담기록"})]})}),e.jsx(Ae,{}),e.jsxs(q,{children:[e.jsx(ee,{w:240,h:14}),e.jsx(ee,{w:560,h:120,mt:10})]})]})})]})}const Sn=o.div`
  display: grid;
  gap: 14px;
`,Cn=o.div`
  display: flex;
  align-items: center;
  gap: 10px;

  h2 {
    margin: 0;
    font-size: 20px;
    color: #0f172a;
  }
`,Fe=o.div`
  display: grid;
  grid-template-columns: 360px 1fr;
  gap: 14px;
  align-items: start;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`,Le=o.aside`
  display: grid;
  gap: 18px;
`,Re=o.section``,vn=o.div`
  color: #b91c1c;
  font-size: 12px;
  font-weight: 700;
`,Be=o.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  background: #fff;
  z-index: 5;
  padding-top: 2px;
`,q=o.div`
  display: grid;
  gap: 10px;
`,wn=Qe`
  0% { background-position: -200px 0; }
  100% { background-position: 200px 0; }
`,re=o.div`
  background: linear-gradient(90deg, #eef2f7 25%, #f6f8fb 37%, #eef2f7 63%);
  background-size: 400px 100%;
  animation: ${wn} 1.2s ease-in-out infinite;
  border-radius: 8px;
  width: ${({w:t})=>t?`${t}px`:"100%"};
  height: ${({h:t})=>t?`${t}px`:"12px"};
  margin-top: ${({mt:t})=>t?`${t}px`:0};
`,ee=re,En=o(re).attrs({w:44,h:44})`
  border-radius: 12px;
`,Mn=o.div`
  display: grid;
  grid-template-columns: 44px 1fr 80px;
  gap: 10px;
  align-items: center;
  margin-bottom: 8px;
`,kn=o(re).attrs({w:80,h:24})``,G=o(re).attrs({h:16,mt:10})``;function Dn({studentId:t}){const[n,r]=i.useState(null),[s,l]=i.useState(!1),[x,p]=i.useState(null),u=i.useCallback(async()=>{if(!t||Number.isNaN(t)){r(null),p(null);return}l(!0),p(null);try{const d=await rt(t);r(d)}catch(d){p($(d,"원생 정보를 불러오지 못했습니다."))}finally{l(!1)}},[t]);i.useEffect(()=>{u()},[u]);const c=i.useMemo(()=>{const d=n?.birthDate;if(!d)return;const[g,S,f]=d.split("-").map(Number);if(!g||!S||!f)return;const y=new Date;let a=y.getFullYear()-g;const j=y.getMonth()+1,h=y.getDate();return(j<S||j===S&&h<f)&&(a-=1),a},[n?.birthDate]);return{student:n,loading:s,error:x,intlAge:c,refresh:u}}function $n({studentId:t}){const[n,r]=i.useState(""),[s,l]=i.useState(""),[x,p]=i.useState(!1);i.useEffect(()=>{if(!t){r(""),l(""),p(!1);return}try{const g=localStorage.getItem(`student:notes:${t}`)||"";r(g),l(g)}catch{r(""),l("")}},[t]);const u=i.useCallback(()=>{l(n),p(!0)},[n]),c=i.useCallback(()=>{l(n),p(!1)},[n]),d=i.useCallback(()=>{if(!t)return;const g=(s||"").trim();r(g),p(!1);try{localStorage.setItem(`student:notes:${t}`,g)}catch{}},[s,t]);return{notes:n,notesInput:s,editing:x,setNotesInput:l,startEditing:u,cancelEditing:c,save:d}}function Nn({studentId:t,confirmDelete:n}){const[r,s]=i.useState([]),[l,x]=i.useState(""),[p,u]=i.useState(null),[c,d]=i.useState("");i.useEffect(()=>{if(!t){s([]),x(""),u(null),d("");return}try{const h=localStorage.getItem(`student:memos:${t}`),m=h?JSON.parse(h):[];s(Array.isArray(m)?m:[])}catch{s([])}},[t]);const g=i.useCallback(h=>{if(s(h),!!t)try{localStorage.setItem(`student:memos:${t}`,JSON.stringify(h))}catch{}},[t]),S=i.useCallback(()=>{if(!t)return;const h=(l||"").trim();if(!h)return;const m=new Date().toISOString(),C={id:Date.now(),text:h,createdAt:m};g([C,...r]),x("")},[r,l,g,t]),f=i.useCallback(h=>{const m=r.find(C=>C.id===h);m&&(u(h),d(m.text))},[r]),y=i.useCallback(()=>{u(null),d("")},[]),a=i.useCallback(()=>{if(p==null)return;const h=(c||"").trim(),m=new Date().toISOString(),C=r.map(E=>E.id===p?{...E,text:h,updatedAt:m}:E);g(C),u(null),d("")},[p,c,r,g]),j=i.useCallback(async h=>{if(!await n({title:"메모를 삭제할까요?",message:"삭제한 메모는 복구할 수 없습니다."}))return;const C=r.filter(E=>E.id!==h);g(C)},[n,r,g]);return{memos:r,newMemo:l,setNewMemo:x,editingMemoId:p,editingMemoText:c,setEditingMemoText:d,addMemo:S,beginEditMemo:f,cancelEditMemo:y,saveEditMemo:a,requestDeleteMemo:j}}function An({studentId:t,enabled:n}){const[r,s]=i.useState([]),[l,x]=i.useState(!1),[p,u]=i.useState(null);return i.useEffect(()=>{if(!t||!n){s([]),u(null),x(!1);return}let c=!1;return x(!0),u(null),(async()=>{try{const d=await it(t,{size:200});c||s(d?.content||[])}catch(d){c||u($(d,"출석 정보를 불러오지 못했습니다."))}finally{c||x(!1)}})(),()=>{c=!0}},[t,n]),{rows:r,loading:l,error:p}}function zn({studentId:t,courses:n,enabled:r}){const[s,l]=i.useState([]),[x,p]=i.useState(!1),[u,c]=i.useState(null),d=i.useCallback(async()=>{if(!t||!n?.length){l([]),c(null);return}p(!0),c(null);try{const S=Array.isArray(n)?n:[],f=(await Promise.all(S.map(async({id:a})=>(await lt(a)).map(h=>({courseId:a,exam:h}))))).flat(),y=await Promise.all(f.map(async({courseId:a,exam:j})=>{try{const m=(await ct(a,j.id)).find(D=>D.studentId===t);if(!m)return null;const C=j.examDate||(j.createdAt?j.createdAt.slice(0,10):"");return{id:`exam:${a}:${j.id}:${t}`,date:C,subject:j.title,courseId:a,score:m.score,outOf:m.outOf,level:m.level,note:m.note}}catch{return null}}));l(y.filter(a=>!!a))}catch(S){c($(S,"시험 성적을 불러오지 못했습니다."))}finally{p(!1)}},[n,t]);return i.useEffect(()=>{r&&d()},[r,d]),{grades:i.useMemo(()=>s.slice().sort((f,y)=>{const a=Date.parse(f.date||""),j=Date.parse(y.date||"");return(isNaN(j)?0:j)-(isNaN(a)?0:a)}),[s]),loading:x,error:u,reload:d}}function Tn({studentId:t,studentName:n,enabled:r,onToastError:s}){const[l,x]=i.useState([]),[p,u]=i.useState(!1),[c,d]=i.useState(null),[g,S]=i.useState(!1),[f,y]=i.useState(!1),[a,j]=i.useState(Me),[h,m]=i.useState(""),[C,E]=i.useState(""),[D,R]=i.useState(""),[F,B]=i.useState(!1),[k,w]=i.useState(null),M=i.useRef(null),[ie,fe]=i.useState(null),[W,U]=i.useState(""),[V,K]=i.useState(""),[J,Q]=i.useState(""),[oe,ae]=i.useState(""),[Pe,he]=i.useState(!1),[He,X]=i.useState(null),[Z,le]=i.useState(null),[ge,me]=i.useState(!1),Ge=i.useMemo(()=>Array.from({length:24},(b,v)=>L(v)),[]),Ie=i.useMemo(()=>["00","05","10","15","20","25","30","35","40","45","50","55"],[]),_=i.useCallback(()=>{fe(null),U(""),K(""),Q(""),ae(""),X(null)},[]),P=i.useCallback(()=>{j(Me()),m(""),E(""),R(""),w(null)},[]),A=i.useCallback(async()=>{if(!t||!r){x([]),d(null);return}u(!0),d(null);try{const b=await dt({studentId:t,size:100});x(b.content||[])}catch(b){d($(b,"상담 기록을 불러오지 못했습니다."))}finally{u(!1)}},[r,t]);i.useEffect(()=>{A()},[A]),i.useEffect(()=>{if(!f)return;const b=requestAnimationFrame(()=>{const v=M.current;if(v){v.focus();const je=v.value.length;try{v.setSelectionRange(je,je)}catch{}}});return()=>cancelAnimationFrame(b)},[f]),i.useEffect(()=>{_(),P(),x([]),d(null)},[t,_,P]);const _e=i.useCallback(()=>{y(!0),P()},[P]),ce=i.useCallback(()=>{F||(y(!1),P())},[F,P]),qe=i.useCallback(async()=>{if(!(!t||!a||!h||!C)){B(!0),w(null);try{const b=ke(a,h,C);await ut({studentId:t,counselTime:b,content:D||void 0}),await A(),ce()}catch(b){w($(b,"저장에 실패했습니다."))}finally{B(!1)}}},[t,a,h,C,D,A,ce]),Ye=i.useCallback(b=>{fe(b.id),X(null);try{const v=new Date(b.counselTime);U(`${v.getFullYear()}-${L(v.getMonth()+1)}-${L(v.getDate())}`),K(L(v.getHours())),Q(L(v.getMinutes()))}catch{U(""),K(""),Q("")}ae(b.content||"")},[]),We=i.useCallback(async b=>{if(!(!t||!W||!V||!J)){he(!0),X(null);try{const v=ke(W,V,J);await xt(b,{counselTime:v,content:oe||void 0}),await A(),_()}catch(v){X($(v,"수정에 실패했습니다."))}finally{he(!1)}}},[t,W,V,J,oe,A,_]),Ue=i.useCallback(b=>{le(b)},[]),Ve=i.useCallback(async()=>{if(!(!t||Z==null)){me(!0);try{await pt(Z),await A(),le(null)}catch(b){s($(b,"삭제에 실패했습니다."))}finally{me(!1)}}},[Z,A,s,t]),Ke=i.useCallback(async()=>{if(t){S(!0);try{const b=await ft({studentId:t}),v=mn(n,t);fn(b,`${v}.xlsx`)}catch(b){s($(b,"상담 기록 엑셀 추출에 실패했습니다."))}finally{S(!1)}}},[t,n,s]),Je={open:Z!=null,busy:ge,onCancel:()=>{ge||le(null)},onConfirm:Ve};return{counsels:l,loading:p,listError:c,exporting:g,handleExport:Ke,addModalOpen:f,openAddModal:_e,closeAddModal:ce,addForm:{date:a,hour:h,minute:C,content:D,setDate:j,setHour:m,setMinute:E,setContent:R,submitting:F,submit:qe,formError:k,textareaRef:M},editState:{editingId:ie,editDate:W,editHour:V,editMinute:J,editContent:oe,beginEdit:Ye,cancelEdit:_,setEditDate:U,setEditHour:K,setEditMinute:Q,setEditContent:ae,saveEdit:We,saving:Pe,formError:He},requestDelete:Ue,confirmDialog:Je,hourOptions:Ge,minuteOptions:Ie}}function On(){const{confirm:t,dialog:n}=at({confirmLabel:"삭제",cancelLabel:"취소",tone:"danger"});return{confirm:t,dialog:n}}function Fn(){const t=Xe(),{id:n,tab:r}=Ze(),s=i.useMemo(()=>{const w=Number(n);return Number.isFinite(w)?w:null},[n]),{error:l,success:x}=et(),{confirm:p,dialog:u}=On(),{student:c,loading:d,error:g,intlAge:S}=Dn({studentId:s}),f=$n({studentId:s}),y=Nn({studentId:s,confirmDelete:p}),a=i.useMemo(()=>{switch(r){case"courses":case"attendance":case"counsels":case"grades":return r;default:return"courses"}},[r]),j=An({studentId:s,enabled:a==="attendance"}),h=zn({studentId:s,courses:c?.courses,enabled:a==="grades"}),m=Tn({studentId:s,studentName:c?.name,enabled:a==="counsels",onToastError:l}),[C,E]=i.useState(!1);async function D(){if(!s)return;const w=c?.name?.trim();if(await p({title:"원생을 삭제할까요?",message:w?`'${w}' 원생의 데이터를 삭제합니다. 되돌릴 수 없습니다.`:"선택한 원생의 데이터를 삭제합니다. 되돌릴 수 없습니다."})){E(!0);try{await ot(s),x("원생을 삭제했습니다."),t("/students")}catch(ie){l($(ie,"원생 삭제에 실패했습니다.")),E(!1)}}}const R=w=>{s&&t(`/students/${s}/${w}`)},F=w=>{t(`/classes/${w}`)},B=()=>{m.addForm.submitting||m.closeAddModal()},k=m.listError||m.editState.formError||null;return{numericId:s,loading:d,studentError:g,student:c,intlAge:S,deleting:C,editHref:s?`/students/${s}/edit`:"/students",activeTab:a,coursesCount:c?.courses?.length??0,onSelectTab:R,onOpenCourse:F,onDeleteStudent:D,notes:f,memos:y,attendance:j,grades:h,counsels:{...m,tabError:k,handleProtectedCloseAddModal:B},deleteConfirmDialog:u}}function Un(){const t=Fn();return e.jsx(bn,{loading:t.loading,studentError:t.studentError,student:t.student,intlAge:t.intlAge,deleting:t.deleting,editHref:t.editHref,onDeleteStudent:()=>void t.onDeleteStudent(),notes:t.notes,memos:t.memos,activeTab:t.activeTab,onSelectTab:t.onSelectTab,coursesCount:t.coursesCount,attendance:t.attendance,grades:t.grades,counsels:t.counsels,deleteConfirmDialog:t.deleteConfirmDialog,onOpenCourse:t.onOpenCourse})}export{Un as default};
