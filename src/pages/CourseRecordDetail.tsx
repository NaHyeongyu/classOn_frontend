import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import {
  SectionCard as Section,
  TitleH3 as Title,
  GhostBtn as UIGhostBtn,
  GhostBtnSmall as UIGhostBtnSmall,
  SmallBtn as UISmallBtn,
  buttonVariants,
} from "../components/common/UI";
import ConfirmDialog from "../components/common/ConfirmDialog";
import { KPI, UsersIcon, CheckIcon, ClassIcon, DeltaPill } from "../components/dashboard/KPI";
import { getCourse, type Course, type CourseRecord, listCourseRecords, listCourseStudents, updateCourseRecord, createCourseRecord, listRecordAttendance, upsertAttendance, listRecordAttachments, uploadRecordAttachments, deleteRecordAttachment, deleteCourseRecord, type Attachment, type Attendance } from "../api/courses";
import { invalidateCacheByPrefix } from "../lib/fetcher";
import type { Student } from "../api/students";
// KPIs removed from this view for a simpler layout

export default function CourseRecordDetail() {
  const navigate = useNavigate();
  const { id, recordId, ymd } = useParams();
  const courseId = useMemo(() => (id ? Number(id) : null), [id]);
  const recId = useMemo(() => (recordId ? Number(recordId) : null), [recordId]);

  const [course, setCourse] = useState<Course | null>(null);
  const [record, setRecord] = useState<CourseRecord | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState<{ content?: boolean; when?: boolean }>({});
  const [contentFeedback, setContentFeedback] = useState<'idle' | 'success'>('idle');
  const [editingWhen, setEditingWhen] = useState(false);
  const [whenError, setWhenError] = useState<string | null>(null);
  const [attVersion, setAttVersion] = useState(0);
  const [attMap, setAttMap] = useState<Record<number, boolean>>({});
  const [attNoteMap, setAttNoteMap] = useState<Record<number, string>>({});
  const noteTimersRef = useRef<Record<number, number>>({});
  const [attLoading, setAttLoading] = useState(false);
  const [attError, setAttError] = useState<string | null>(null);
  const [attSavingMap, setAttSavingMap] = useState<Record<number, boolean>>({});
  // Preserve names of attendees no longer enrolled to display historical attendance properly
  const [attStudentNames, setAttStudentNames] = useState<Record<number, string>>({});
  // editable date/time
  const [editDate, setEditDate] = useState<string>("");
  const [editStart, setEditStart] = useState<string>("");
  const [editEnd, setEditEnd] = useState<string>("");
  // attachments
  const [files, setFiles] = useState<Attachment[]>([]);
  const [filesLoading, setFilesLoading] = useState(false);
  const [filesError, setFilesError] = useState<string | null>(null);
  const [contentValue, setContentValue] = useState<string>('');
  const [fileBusy, setFileBusy] = useState<Record<number, boolean>>({});
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [confirmBusy, setConfirmBusy] = useState(false);
  // file size limit (MB)
  const MAX_FILE_SIZE_MB = 10;
  const MAX_FILE_SIZE = MAX_FILE_SIZE_MB * 1024 * 1024;
  // Right column shows attendance; content/files move to left below info

  useEffect(() => {
    if (!courseId) return;
    let cancelled = false;
    async function load() {
      setLoading(true); setError(null);
      try {
        const [c, recs, studs] = await Promise.all([
          getCourse(courseId!),
          listCourseRecords(courseId!),
          listCourseStudents(courseId!)
        ]);
        if (!cancelled) {
          setCourse(c);
          const byId = recs.find(r => r.id === recId || r.id === Number(ymd)) || null;
          const byDate = ymd ? (recs.find(r => r.recordDate === ymd) || null) : null;
          setRecord(byId || byDate || null);
          setStudents(studs);
        }
      } catch (e) {
        if (!cancelled) setError(readableError(e, "수업 내역을 불러오지 못했습니다."));
      } finally { if (!cancelled) setLoading(false); }
    }
    void load();
    return () => { cancelled = true; };
  }, [courseId, recId]);

  // initialize editable date/time when record loads
  useEffect(() => {
    if (!record && !course) return;
    const d = record?.recordDate || ymd || "";
    const s = record?.startTime || course?.startTime || "";
    const e = record?.endTime || course?.endTime || "";
    setEditDate(d);
    setEditStart(toHHMM(s));
    setEditEnd(toHHMM(e));
  }, [record?.recordDate, record?.startTime, record?.endTime, course?.startTime, course?.endTime, ymd]);

  // If opened by date to create a new record, start in editing mode
  useEffect(() => {
    if (!loading && ymd && !record?.id) {
      setEditingWhen(true);
    }
  }, [loading, ymd, record?.id]);

  useEffect(() => {
    setContentValue(record?.content || '');
  }, [record?.content]);

  // Attendance local storage (unified with CourseDetail)
  function getLocalAttendanceKey() {
    if (!courseId) return `attendance::`;
    if (recId) return `attendance:${courseId}:${recId}`;
    if (ymd) return `attendanceDate:${courseId}:${ymd}`;
    return `attendance:${courseId}:`;
  }
  const localAttMap = useMemo(() => {
    if (!courseId) return {} as Record<string, boolean>;
    const key = getLocalAttendanceKey();
    try { return JSON.parse(localStorage.getItem(key) || '{}') as Record<string, boolean>; } catch { return {}; }
  }, [courseId, recId, ymd, attVersion]);
  const presentMap = useMemo(() => {
    // Prefer server map when record exists; fallback to local when not available
    if (record?.id) return attMap;
    return localAttMap;
  }, [attMap, localAttMap, record?.id]);
  function setAttendance(studentId: number, present: boolean) {
    if (!courseId) return;
    const key = getLocalAttendanceKey();
    const map: Record<string, boolean> = (() => { try { return JSON.parse(localStorage.getItem(key) || '{}') as Record<string, boolean>; } catch { return {}; } })();
    map[String(studentId)] = present;
    try { localStorage.setItem(key, JSON.stringify(map)); } catch {}
    setAttVersion(v => v + 1);
  }
  function clearAttendanceLocal(studentId: number) {
    if (!courseId) return;
    const key = getLocalAttendanceKey();
    const map: Record<string, boolean> = (() => { try { return JSON.parse(localStorage.getItem(key) || '{}') as Record<string, boolean>; } catch { return {}; } })();
    if (Object.prototype.hasOwnProperty.call(map, String(studentId))) delete map[String(studentId)];
    try { localStorage.setItem(key, JSON.stringify(map)); } catch {}
    setAttVersion(v => v + 1);
  }
  const presentCount = useMemo(() => Object.values(presentMap).filter(Boolean).length, [presentMap]);
  const isPastRecord = useMemo(() => {
    const recDateStr = record?.recordDate || ymd || '';
    return recDateStr ? (new Date(recDateStr) < new Date(new Date().toDateString())) : false;
  }, [record?.recordDate, ymd]);
  const denom = useMemo(() => {
    if (isPastRecord) return Object.keys(presentMap).length; // processed only for past
    return students.length;
  }, [isPastRecord, presentMap, students.length]);
  const attendanceRate = useMemo(() => denom ? Math.round((presentCount / denom) * 100) : null, [presentCount, denom]);
  const durationMin = useMemo(() => getDurationMinutes(record?.startTime || course?.startTime, record?.endTime || course?.endTime), [record?.startTime, record?.endTime, course?.startTime, course?.endTime]);
  // participation metrics removed

  const whenInfo = useMemo(() => {
    const rawDate = record?.recordDate || ymd || '';
    const range = formatRange(record?.startTime || course?.startTime, record?.endTime || course?.endTime);
    const dateLabel = rawDate ? formatDateBadge(rawDate) : '일자 미지정';
    const timeLabel = range || '시간 미지정';
    return {
      dateLabel,
      timeLabel,
      hasDate: Boolean(record?.recordDate || ymd),
      hasTime: Boolean(range),
    };
  }, [record?.recordDate, record?.startTime, record?.endTime, course?.startTime, course?.endTime, ymd]);

  // Load attendance from server when record id is available
  useEffect(() => {
    if (!courseId || !record?.id) return;
    let cancelled = false;
    async function loadAttendance() {
      setAttLoading(true); setAttError(null);
      try {
        const list = await listRecordAttendance(courseId!, record!.id);
        if (!cancelled) {
          const m: Record<number, boolean> = {};
          const notes: Record<number, string> = {};
          const names: Record<number, string> = {};
          (list as Attendance[]).forEach(a => {
            m[a.studentId] = !!a.present;
            if (a.reason) notes[a.studentId] = a.reason;
            if (a.studentName) names[a.studentId] = a.studentName;
          });
          setAttMap(m);
          setAttNoteMap(notes);
          setAttStudentNames(names);
        }
      } catch (e) {
        if (!cancelled) setAttError(readableError(e, '출석 정보를 불러오지 못했습니다.'));
      } finally { if (!cancelled) setAttLoading(false); }
    }
    void loadAttendance();
    return () => { cancelled = true; };
  }, [courseId, record?.id]);

  async function confirmAndSetAttendance(studentId: number, target: boolean) {
    const sName = students.find(s => s.id === studentId)?.name || '학생';
    const label = target ? '출석' : '결석';
    const ok = window.confirm(`${sName}을(를) ${label} 처리하시겠어요?`);
    if (!ok) return;
    if (courseId && record?.id) {
      // Server update
      setAttSavingMap(m => ({ ...m, [studentId]: true }));
      try {
        const reason = attNoteMap[studentId]?.trim() || undefined;
        await upsertAttendance(courseId!, record!.id, studentId, { present: target, reason, source: 'MANUAL' });
        setAttMap(m => ({ ...m, [studentId]: target }));
        // Invalidate dashboard classes/summary caches to reflect latest attendance
        invalidateCacheByPrefix(['/api/calendar/classes', '/api/dashboard/summary']);
      } catch (e) {
        alert(readableError(e, '출석 처리에 실패했습니다.'));
      } finally {
        setAttSavingMap(m => ({ ...m, [studentId]: false }));
      }
    } else {
      // Local fallback
      setAttendance(studentId, target);
    }
  }

  // Load/save local notes when no server record
  useEffect(() => {
    if (!courseId || record?.id) return;
    const key = getLocalAttendanceKey().replace('attendance', 'attendanceNote');
    try { const parsed = JSON.parse(localStorage.getItem(key) || '{}') as Record<string, string>; setAttNoteMap(parsed || {}); } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId, recId, ymd]);

  useEffect(() => {
    if (contentFeedback !== 'success') return;
    const t = window.setTimeout(() => setContentFeedback('idle'), 2500);
    return () => window.clearTimeout(t);
  }, [contentFeedback]);

  // Attachments helpers: server if record exists; otherwise local fallback keyed by date
  function localAttachKey() {
    if (!courseId) return `attachments::`;
    if (recId) return `attachments:${courseId}:${recId}`;
    if (ymd) return `attachmentsDate:${courseId}:${ymd}`;
    return `attachments:${courseId}:`;
  }
  function getLocalAttachments(): { name: string; size: number }[] {
    try { return JSON.parse(localStorage.getItem(localAttachKey()) || '[]'); } catch { return []; }
  }
  function setLocalAttachments(list: { name: string; size: number }[]) {
    try { localStorage.setItem(localAttachKey(), JSON.stringify(list)); } catch {}
  }
  useEffect(() => {
    if (!courseId) return;
    let cancelled = false;
    async function loadFiles() {
      setFilesError(null);
      if (record?.id) {
        setFilesLoading(true);
        try {
          const list = await listRecordAttachments(courseId!, record!.id);
          if (!cancelled) setFiles(list);
        } catch (e: any) {
          if (!cancelled) setFilesError(e?.message || '첨부를 불러오지 못했습니다.');
        } finally { if (!cancelled) setFilesLoading(false); }
      } else {
        // local fallback
        const local = getLocalAttachments();
        setFiles(local.map((x, i) => ({ id: i, filename: x.name, size: x.size, createdAt: new Date().toISOString() } as any)));
      }
    }
    void loadFiles();
    return () => { cancelled = true; };
  }, [courseId, record?.id, recId, ymd]);
  async function onUpload(filesList: FileList | null) {
    if (!filesList) return;
    // enforce size limit
    const all = Array.from(filesList);
    const accepted = all.filter(f => f.size <= MAX_FILE_SIZE);
    const rejected = all.filter(f => f.size > MAX_FILE_SIZE);
    if (rejected.length > 0) {
      setFilesError(`용량 제한(${MAX_FILE_SIZE_MB}MB)을 초과한 파일 제외: ${rejected.map(f => f.name).join(', ')}`);
    } else {
      setFilesError(null);
    }
    if (accepted.length === 0) return;
    if (courseId && record?.id) {
      try {
        const uploaded = await uploadRecordAttachments(courseId!, record!.id, accepted);
        setFiles(prev => [...uploaded, ...prev]);
      } catch (e) { alert(readableError(e, '업로드에 실패했습니다.')); }
    } else {
      // local
      const prev = getLocalAttachments();
      const next = [...prev, ...accepted.map(f => ({ name: f.name, size: f.size }))];
      setLocalAttachments(next);
      setFiles(toAttachmentRows(next));
    }
  }
  async function onDeleteFile(fileId: number, name?: string) {
    const ok = window.confirm('이 파일을 삭제할까요?');
    if (!ok) return;
    if (courseId && record?.id) {
      setFileBusy(m => ({ ...m, [fileId]: true }));
      try {
        await deleteRecordAttachment(courseId!, record!.id, fileId);
        setFiles(prev => prev.filter(f => f.id !== fileId));
      } catch (e) { alert(readableError(e, '삭제에 실패했습니다.')); }
      finally { setFileBusy(m => ({ ...m, [fileId]: false })); }
    } else {
      const prev = getLocalAttachments();
      const next = prev.filter(x => x.name !== name);
      setLocalAttachments(next);
      setFiles(toAttachmentRows(next));
    }
  }

  // Save helpers
  async function saveField(patch: Partial<Pick<CourseRecord, 'content'|'recordDate'|'startTime'|'endTime'>>, key: keyof typeof saving) {
    if (!courseId || !record?.id) return;
    if (key === 'content') setContentFeedback('idle');
    setSaving(s => ({ ...s, [key]: true }));
    try {
      const updated = await updateCourseRecord(courseId!, record!.id, patch);
      setRecord(updated);
      // Reflect updated record immediately in dashboard classes
      invalidateCacheByPrefix('/api/calendar/classes');
      invalidateCacheByPrefix('/api/calendar/classes-range');
      if (key === 'content') setContentFeedback('success');
    } catch (e) {
      alert(readableError(e, '저장에 실패했습니다.'));
    } finally {
      setSaving(s => ({ ...s, [key]: false }));
    }
  }
  function toHHMM(t?: string) { if (!t) return ''; const [h,m] = t.split(':'); return `${h}:${m}`; }
  function toHHMMSS(t?: string) {
    if (!t) return undefined;
    const parts = t.split(':');
    if (parts.length >= 3) return `${parts[0].padStart(2,'0')}:${parts[1].padStart(2,'0')}:${parts[2].padStart(2,'0')}`;
    if (parts.length === 2) return `${parts[0].padStart(2,'0')}:${parts[1].padStart(2,'0')}:00`;
    return undefined;
  }
  async function saveWhen() {
    if (!courseId) return;
    const payload: { recordDate: string; startTime?: string; endTime?: string } = { recordDate: editDate || (ymd || ''), startTime: toHHMMSS(editStart), endTime: toHHMMSS(editEnd) };
    // If server record exists, update; otherwise create and set state
    setWhenError(null);
    if (record?.id) {
      await saveField(payload, 'when');
      setEditingWhen(false);
      return;
    }
    // Create new record for this date
    setSaving(s => ({ ...s, when: true }));
    try {
      const created = await createCourseRecord(courseId, payload);
      setRecord(created);
      setEditingWhen(false);
      // New record may appear in dashboard classes
      invalidateCacheByPrefix('/api/calendar/classes');
      invalidateCacheByPrefix('/api/calendar/classes-range');
    } catch (e) {
      const msg = readableError(e, '');
      if (msg.includes('HTTP 409')) setWhenError('이미 등록된 수업이 있습니다.');
      else setWhenError('기록 생성에 실패했습니다.');
    } finally {
      setSaving(s => ({ ...s, when: false }));
    }
  }

  

  return (
    <Wrap>
      <Head>
        <BackBtn type="button" onClick={() => navigate(`/classes/${courseId}`)}>{leftIcon} 뒤로</BackBtn>
        <HeadTitle>
          <h2 style={{ margin: 0 }}>{course?.title || '수업 내역 상세'}</h2>
          <WhenMeta>
            <DateBadge data-empty={String(!whenInfo.hasDate)}>{whenInfo.dateLabel}</DateBadge>
            <TimePill data-empty={String(!whenInfo.hasTime)}>{whenInfo.timeLabel}</TimePill>
          </WhenMeta>
        </HeadTitle>
        <HeadRight>
          <UIGhostBtn to={`/classes/${courseId}`} title="수업으로">수업으로</UIGhostBtn>
          {record?.id && (
            <UIGhostBtn as="button" onClick={() => setConfirmDeleteOpen(true)}>삭제</UIGhostBtn>
          )}
        </HeadRight>
      </Head>
      <ConfirmDialog
        open={confirmDeleteOpen}
        title="수업 내역 삭제"
        message={"이 수업 내역을 삭제할까요?\n첨부/출결/파일도 함께 삭제됩니다. 되돌릴 수 없습니다."}
        confirmLabel="영구 삭제"
        cancelLabel="취소"
        tone="danger"
        busy={confirmBusy}
        onCancel={() => { if (!confirmBusy) setConfirmDeleteOpen(false); }}
        onConfirm={async () => {
          if (!courseId || !record?.id) return;
          setConfirmBusy(true);
          try {
            await deleteCourseRecord(courseId!, record!.id);
            invalidateCacheByPrefix('/api/calendar/classes');
            setConfirmDeleteOpen(false);
            navigate(`/classes/${courseId}/history`);
          } catch (e: any) {
            alert(e?.message || '삭제에 실패했습니다.');
          } finally {
            setConfirmBusy(false);
          }
        }}
      />
      {error && <AlertError>{error}</AlertError>}
      {loading && <Muted>불러오는 중...</Muted>}

      {/* Compact KPIs for quick glance */}
      <KPIGrid>
        <KPI title="참석" icon={<UsersIcon />} iconAccent="indigo" value={<>{presentCount}명</>} footerLeft={<span>총 {denom}명</span>} />
        <KPI title="출석률" icon={<CheckIcon />} iconAccent="green" value={<>{attendanceRate != null ? `${attendanceRate}%` : '—'}</>} footerLeft={<DeltaPill $tone={attendanceRate != null && attendanceRate >= 75 ? 'positive' : attendanceRate != null && attendanceRate < 50 ? 'negative' : 'neutral'}>{attendanceRate != null ? `${attendanceRate}%` : '—'}</DeltaPill>} />
        <KPI title="수업 시간" icon={<ClassIcon />} iconAccent="violet" value={<>{durationMin != null ? `${durationMin}분` : '—'}</>} footerLeft={<span>{formatRange(record?.startTime || course?.startTime, record?.endTime || course?.endTime) || '-'}</span>} />
        <KPI title="일자" icon={<ClassIcon />} iconAccent="emerald" value={<>{record?.recordDate || ymd || '—'}</>} />
      </KPIGrid>

      

      {/* Simplified layout: Info, When(editable), Content, Files, Attendance */}

      <Columns>
        <Left>
          <Section>
            <SectionHeader>
              <Title>수업 정보</Title>
              {!editingWhen ? (
                <SmallBtn onClick={() => setEditingWhen(true)}>수정</SmallBtn>
              ) : (
                <div style={{ display:'inline-flex', gap:8, alignItems:'center' }}>
                  <SmallBtn onClick={() => { void saveWhen(); }} disabled={!!saving.when}>저장</SmallBtn>
                  <SmallBtn onClick={() => { setEditingWhen(false); setEditDate(record?.recordDate || ymd || ''); setEditStart(toHHMM(record?.startTime || course?.startTime || '')); setEditEnd(toHHMM(record?.endTime || course?.endTime || '')); }}>취소</SmallBtn>
                </div>
              )}
            </SectionHeader>
            {!editingWhen ? (
              <InfoList>
                <li><Label>수업일</Label><StrongValue>{record?.recordDate || '-'}</StrongValue></li>
                <li><Label>수업시간</Label><StrongValue>{formatRange(record?.startTime || course?.startTime, record?.endTime || course?.endTime) || '-'}</StrongValue></li>
              </InfoList>
            ) : (
              <InfoList>
                <li>
                  <Label>날짜</Label>
                  <Value>
                    <Input type="date" value={editDate || ''} onChange={(e) => setEditDate(e.currentTarget.value)} />
                  </Value>
                </li>
                <li>
                  <Label>시간</Label>
                  <Value style={{ display:'flex', alignItems:'center', gap:6 }}>
                    <Input type="time" step={300} value={editStart || ''} onChange={(e) => setEditStart(e.currentTarget.value)} />
                    <span>~</span>
                    <Input type="time" step={300} value={editEnd || ''} onChange={(e) => setEditEnd(e.currentTarget.value)} />
                  </Value>
                </li>
                <PreviewRow>
                  <PreviewLabel>미리보기</PreviewLabel>
                  <PreviewMeta>
                    <DateBadge data-empty={String(!(editDate || record?.recordDate || ymd))}>
                      {formatDateBadge(editDate || record?.recordDate || ymd || '')}
                    </DateBadge>
                    <TimePill data-empty={String(!(editStart && editEnd))}>
                      {editStart && editEnd ? formatRange(editStart, editEnd) : '시간 미지정'}
                    </TimePill>
                  </PreviewMeta>
                </PreviewRow>
                <RowHelp>
                  {!record?.id && <Hint>저장 시 새 수업 내역을 생성합니다.</Hint>}
                  {saving.when && <SmallMuted>저장 중...</SmallMuted>}
                  {whenError && <AlertError style={{ marginLeft: 8 }}>{whenError}</AlertError>}
                </RowHelp>
              </InfoList>
            )}
          </Section>
          {/* Content */}
          <Section>
            <SectionHeader>
              <Title>수업 내용</Title>
              {record?.id ? (
                <ContentActions>
                  {contentFeedback === 'success' && !saving.content && (
                    <SuccessBadge role="status">저장 완료!</SuccessBadge>
                  )}
                  <SmallBtn
                    onClick={() => {
                      void saveField({ content: contentValue }, 'content');
                    }}
                    disabled={!!saving.content}
                  >저장</SmallBtn>
                  {saving.content && <SmallMuted>저장 중...</SmallMuted>}
                </ContentActions>
              ) : null}
            </SectionHeader>
            {record?.id ? (
              <TextArea
                rows={8}
                value={contentValue}
                onChange={(e) => { setContentValue(e.currentTarget.value); setContentFeedback('idle'); }}
                placeholder="수업 내용을 입력하세요"
                id="contentArea"
              />
            ) : (
              <Muted>서버 기록이 없는 일정입니다. 생성 후 편집 가능합니다.</Muted>
            )}
          </Section>

          {/* Files */}
          <Section>
            <SectionHeader>
              <Title>수업 파일</Title>
              <label style={{ display:'inline-flex', alignItems:'center', gap:8 }}>
                <SmallBtn as="span">파일 추가</SmallBtn>
                <input type="file" multiple style={{ display:'none' }} onChange={(e) => onUpload(e.currentTarget.files)} />
              </label>
            </SectionHeader>
            {filesError && <AlertError>{filesError}</AlertError>}
            {filesLoading && <Muted>불러오는 중...</Muted>}
            <AttachList>
            {files.length === 0 ? (
                <SmallMuted>첨부 없음</SmallMuted>
              ) : (
                files.map((f) => (
                  <AttachRow key={f.id}>
                    <div style={{ display:'flex', alignItems:'center', gap: 8 }}>
                      <span>{f.filename}</span>
                      <SmallMuted>({Math.round(f.size / 1024)} KB)</SmallMuted>
                    </div>
                    <SmallBtn data-variant='danger' disabled={!!fileBusy[f.id]} onClick={() => void onDeleteFile(f.id, f.filename)}>삭제</SmallBtn>
                  </AttachRow>
                ))
              )}
            </AttachList>
            {!record?.id && <Hint>서버 기록이 없어 로컬에만 저장됩니다.</Hint>}
            <Hint>파일 크기 제한: 최대 {MAX_FILE_SIZE_MB}MB</Hint>
          </Section>

        </Left>
        <Right>
          <Section>
            <Title>출결 현황</Title>
            <Muted>학생별 출석 상태를 수동으로 처리하세요. 변경 시 확인 창이 표시됩니다.</Muted>
            {!record?.id && <Hint>서버 기록이 없어 출석 정보가 로컬에만 저장됩니다.</Hint>}
            {attLoading && <Muted>출석 불러오는 중...</Muted>}
            {attError && <AlertError>{attError}</AlertError>}
            <List>
              {(() => {
                type RowStudent = { id: number; name: string; isExtra?: boolean };
                const baseRows: RowStudent[] = students.map(s => ({ id: s.id, name: s.name }));
                const baseIds = new Set(baseRows.map(r => r.id));
                const extraRows: RowStudent[] = Object.keys(presentMap)
                  .map(Number)
                  .filter(id => !baseIds.has(id))
                  .map(id => ({ id, name: attStudentNames[id] || `학생#${id}`, isExtra: true }));
                // Hide newly-added students on past records: only show attendees with rows
                const recDateStr = record?.recordDate || ymd || '';
                const isPast = recDateStr ? (new Date(recDateStr) < new Date(new Date().toDateString())) : false;
                const rows: RowStudent[] = isPast ? extraRows : [...baseRows, ...extraRows];
                return rows.map(s => {
                  const has = Object.prototype.hasOwnProperty.call(presentMap, s.id);
                  const present = has ? !!(presentMap as Record<number, boolean>)[s.id] : null as null | boolean;
                  const status: 'present' | 'absent' | 'none' = has ? (present ? 'present' : 'absent') : 'none';
                  return (
                    <Item key={s.id}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <strong>{s.name}</strong>
                        {s.isExtra && <SmallMuted style={{ marginLeft: 8 }}>(과거 수강생)</SmallMuted>}
                        <Processed data-type={status}>
                          {status === 'present' ? '출석' : status === 'absent' ? '결석' : '미처리'}
                        </Processed>
                      </div>
                      <RowRight>
                        <NoteInput
                          placeholder="메모"
                          value={attNoteMap[s.id] || ''}
                          onChange={(e) => {
                            const v = e.currentTarget.value;
                            setAttNoteMap(prev => ({ ...prev, [s.id]: v }));
                            // Persist locally for fallback
                            if (courseId) {
                              const key = getLocalAttendanceKey().replace('attendance', 'attendanceNote');
                              try {
                                const obj = JSON.parse(localStorage.getItem(key) || '{}');
                                obj[String(s.id)] = v;
                                localStorage.setItem(key, JSON.stringify(obj));
                              } catch {}
                            }
                            // Auto-save to server (debounced) when server record exists and this student already has an attendance row
                            if (!s.isExtra && courseId && record?.id && has) {
                              const timers = noteTimersRef.current;
                              if (timers[s.id]) window.clearTimeout(timers[s.id]);
                              timers[s.id] = window.setTimeout(async () => {
                                setAttSavingMap(m => ({ ...m, [s.id]: true }));
                                try {
                                  const reason = (v || '').trim() || undefined;
                                  await upsertAttendance(courseId!, record!.id, s.id, { present: present === true, reason, source: 'MANUAL' });
                                } catch (err) {
                                  console.error('메모 자동 저장 실패', err);
                                } finally {
                                  setAttSavingMap(m => ({ ...m, [s.id]: false }));
                                }
                              }, 600);
                            }
                          }}
                          disabled={!!s.isExtra}
                        />
                        <AttSeg>
                          <AttBtn
                            data-active={String(present === true)}
                            onClick={() => { if (!s.isExtra && present !== true && !attSavingMap[s.id]) void confirmAndSetAttendance(s.id, true); }}
                            disabled={!!attSavingMap[s.id] || !!s.isExtra}
                          >출석</AttBtn>
                          <AttBtn
                            data-variant="danger"
                            data-active={String(has && present === false)}
                            onClick={() => { if (!s.isExtra && present !== false && !attSavingMap[s.id]) void confirmAndSetAttendance(s.id, false); }}
                            disabled={!!attSavingMap[s.id] || !!s.isExtra}
                          >결석</AttBtn>
                        </AttSeg>
                        <SmallBtn
                          title={record?.id ? '서버 기록은 미처리로 되돌릴 수 없습니다.' : '미처리로 초기화'}
                          onClick={() => { if (!record?.id) clearAttendanceLocal(s.id); }}
                          disabled={!!record?.id}
                        >미처리</SmallBtn>
                        {attSavingMap[s.id] && <SmallMuted>저장 중...</SmallMuted>}
                      </RowRight>
                    </Item>
                  );
                });
              })()}
            </List>
          </Section>
        </Right>
      </Columns>
    </Wrap>
  );
}

function hhmm(t?: string) { if (!t) return ''; const [h,m] = t.split(':'); return `${h}:${m}`; }
function formatRange(s?: string, e?: string) { return s && e ? `${hhmm(s)} ~ ${hhmm(e)}` : ''; }
function readableError(err: unknown, fallback: string) {
  if (typeof err === 'string') return err;
  if (err && typeof err === 'object' && 'message' in err && typeof (err as { message?: unknown }).message === 'string') {
    return (err as { message?: string }).message || fallback;
  }
  return fallback;
}
function formatDateBadge(ymd?: string) {
  if (!ymd) return '일자 미지정';
  try {
    const d = new Date(ymd);
    if (Number.isNaN(d.getTime())) return ymd;
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const date = String(d.getDate()).padStart(2, '0');
    const day = '일월화수목금토'[d.getDay()];
    return `${month}월 ${date}일 (${day})`;
  } catch {
    return ymd;
  }
}
function getDurationMinutes(s?: string, e?: string) {
  if (!s || !e) return null; const [sh,sm] = s.split(':'), [eh,em] = e.split(':');
  const start = Number(sh) * 60 + Number(sm); const end = Number(eh) * 60 + Number(em);
  const diff = end - start; return diff >= 0 ? diff : (diff + 24*60);
}

const Wrap = styled.div` display:grid; gap:12px; `;
const Head = styled.div` display:grid; grid-template-columns:auto 1fr auto; gap:12px; align-items:center; `;
const HeadRight = styled.div` display:inline-flex; gap:8px; flex-wrap:wrap; justify-content:flex-end; `;
const HeadTitle = styled.div` display:flex; align-items:center; gap:16px; flex-wrap:wrap; `;
const WhenMeta = styled.div` display:inline-flex; align-items:center; gap:8px; flex-wrap:wrap; `;
const DateBadge = styled.span`
  display:inline-flex;
  align-items:center;
  padding:6px 14px;
  border-radius:999px;
  background:linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%);
  color:#312e81;
  font-weight:800;
  font-size:13px;
  white-space:nowrap;
  &[data-empty='true']{
    background:#f3f4f6;
    color:#6b7280;
  }
`;
const TimePill = styled.span`
  display:inline-flex;
  align-items:center;
  padding:4px 12px;
  border-radius:999px;
  background:#f9fafb;
  color:#1f2937;
  font-weight:700;
  font-size:12px;
  border:1px solid #e5e7eb;
  white-space:nowrap;
  &[data-empty='true']{
    color:#6b7280;
    border-color:#e5e7eb;
  }
`;
// removed unused Sub
const KPIGrid = styled.div` display:grid; grid-template-columns: repeat(12, minmax(0, 1fr)); gap:12px; `;
const Columns = styled.div`
  display:flex; gap:12px; align-items:flex-start;
  @media (max-width: 1024px) { flex-direction: column; }
`;
const Left = styled.div` flex: 5 1 0; display:grid; gap:12px; align-content:flex-start; `;
const Right = styled.div` flex: 7 1 0; display:grid; gap:12px; align-content:flex-start; `;
// removed segmented tabs; simple two-column layout
const SectionHeader = styled.div` display:flex; align-items:center; justify-content:space-between; margin-bottom:8px; `;
// Section, Title from common UI
const InfoList = styled.ul`
  list-style:none; padding:0; margin:0; display:grid; gap:10px;
  li { display:grid; grid-template-columns: 110px 1fr; align-items:center; }
`;
const Label = styled.span` color:#6b7280; font-size:12px; font-weight:700; `;
const Value = styled.span` color:#111827; font-size:14px; `;
const StrongValue = styled(Value)`
  font-weight:800;
  font-size:15px;
`;
const PreviewRow = styled.div`
  grid-column: 1 / -1;
  display:flex;
  align-items:center;
  gap:12px;
  padding:6px 10px;
  border:1px dashed #e5e7eb;
  border-radius:10px;
  background:#f9fafb;
`;
const PreviewLabel = styled.span` color:#6b7280; font-size:12px; font-weight:700; `;
const PreviewMeta = styled.div` display:flex; gap:8px; flex-wrap:wrap; align-items:center; `;
const Input = styled.input` height:32px; padding:0 10px; border:1px solid #e5e7eb; border-radius:8px; font-size:13px; `;
const RowHelp = styled.div` grid-column: 1 / -1; display:flex; gap:8px; align-items:center; margin-top:2px; `;
const List = styled.div` display:grid; gap:8px; `;
const Item = styled.div` display:flex; align-items:center; justify-content:space-between; padding:10px; border:1px solid #f1f5f9; border-radius:10px; background:#f9fafb; `;
const RowRight = styled.div` display:flex; align-items:center; gap:8px; `;
const NoteInput = styled.input` height:28px; width: 180px; padding:0 8px; border:1px solid #e5e7eb; border-radius:8px; font-size:12px; background:#fff; `;
const AttSeg = styled.div` display:inline-flex; gap:6px; `;
const ContentActions = styled.div` display:inline-flex; gap:8px; align-items:center; flex-wrap:wrap; `;
const SuccessBadge = styled.span`
  display:inline-flex;
  align-items:center;
  gap:4px;
  padding:2px 8px;
  border-radius:999px;
  background:#d1fae5;
  color:#047857;
  font-size:11px;
  font-weight:700;
  &:before {
    content:'✔';
  }
`;
const AttBtn = styled.button`
  ${buttonVariants.outline};
  height: 32px;
  padding: 0 12px;
  font-size: 13px;
  &[data-active='true']{ background:#ecfdf5; color:#065f46; border-color:#a7f3d0; }
  &[data-variant='danger']{ background:#fff; color:#b91c1c; }
  &[data-variant='danger'][data-active='true']{ background:#fee2e2; color:#7f1d1d; border-color:#fecaca; }
  &:disabled{ opacity:0.6; cursor:not-allowed; }
`;
const Processed = styled.span`
  margin-left:8px; padding:2px 6px; border-radius:999px; font-size:11px; font-weight:700; border:1px solid #e5e7eb; color:#374151; background:#f3f4f6;
  &[data-type='present']{ background:#ecfdf5; color:#065f46; border-color:#a7f3d0; }
  &[data-type='absent']{ background:#fee2e2; color:#7f1d1d; border-color:#fecaca; }
  &[data-type='none']{ background:#f3f4f6; color:#6b7280; border-color:#e5e7eb; }
`;
// removed unused BlockTitle
const TextArea = styled.textarea` width:100%; border:1px solid #e5e7eb; border-radius:10px; padding:8px 10px; font-size:14px; `;
const AttachList = styled.div` display:grid; gap:6px; margin-top:6px; `;
const AttachRow = styled.div` display:flex; align-items:center; justify-content:space-between; padding:6px 8px; border:1px solid #f1f5f9; border-radius:8px; `;
const SmallBtn = styled(UISmallBtn)`
  height: 32px;
  padding: 0 12px;
  font-size: 12px;
  &[data-variant='danger']{
    border-color:#fecaca;
    color:#b91c1c;
  }
`;
const Hint = styled.div` color:#6b7280; font-size:12px; margin-top:4px; `;
// removed unused Badge
const SmallMuted = styled.span` color:#9ca3af; font-size:12px; `;
// Buttons from common UI
const AlertError = styled.div` background:#fee2e2; color:#b91c1c; border:1px solid #fecaca; padding:10px 12px; border-radius:10px; font-size:13px; `;
const Muted = styled.div` color:#6b7280; font-size:12px; `;
const BackBtn = styled(UIGhostBtnSmall).attrs({ as: "button" })`
  font-weight: 600;
  font-size: 13px;
`;
const leftIcon = (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>);
 
