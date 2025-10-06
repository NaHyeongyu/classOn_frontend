import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type React from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import {
  SectionCard as Section,
  TitleH3 as Title,
  GhostBtn as UIGhostBtn,
  GhostButton as UIGhostButton,
  SmallBtn as UISmallBtn,
  PrimaryButton as UIPrimaryButton,
  buttonVariants,
} from "../components/common/UI";
import ConfirmDialog from "@/components/common/ConfirmDialog";
// KPI widgets removed from this view for a cleaner layout
import { useToast } from "@/components/common/Toast";
import { getCourse, type Course, type CourseRecord, listCourseRecords, listCourseStudents, updateCourseRecord, createCourseRecord, listRecordAttendance, upsertAttendance, listRecordAttachments, uploadRecordAttachments, deleteRecordAttachment, deleteCourseRecord, type Attachment, type Attendance, presignRecordAttachment, confirmRecordAttachment, getRecordAttachmentDownloadUrl } from "@/api/courses";
import { invalidateCacheByPrefix } from "@/lib/fetcher";
import type { Student } from "@/api/students";
import { formatYMD } from "@/features/calendar/dateUtils";
import { addStudentGrade } from "@/features/grades/gradesStorage";
// KPIs removed from this view for a simpler layout

export default function CourseRecordDetail() {
  const navigate = useNavigate();
  const { id, recordId, ymd } = useParams();
  const { error: showError } = useToast();
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
  const [bulkStatus, setBulkStatus] = useState<'present' | 'absent' | null>(null);
  const [bulkDialogOpen, setBulkDialogOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Record<number, boolean>>({});
  // UI: filters/search for attendance list
  const [attFilter, setAttFilter] = useState<'all' | 'present' | 'absent' | 'none'>('all');
  const [attQuery, setAttQuery] = useState('');
  // Single confirm dialog state for per-student action
  const [confirmOne, setConfirmOne] = useState<{ open: boolean; studentId: number | null; target: boolean | null }>({ open: false, studentId: null, target: null });
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
  type UploadQueueItem = { id: string; name: string; size: number; progress: number; status: 'pending'|'uploading'|'done'|'error'; error?: string };
  const [uploadQueue, setUploadQueue] = useState<UploadQueueItem[]>([]);
  const [thumbUrl, setThumbUrl] = useState<Record<number, string>>({});
  const [previewBusy, setPreviewBusy] = useState<Record<number, boolean>>({});
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [confirmBusy, setConfirmBusy] = useState(false);
  const [performanceScore, setPerformanceScore] = useState<string>('');
  const [performanceNote, setPerformanceNote] = useState('');
  const [performanceSaving, setPerformanceSaving] = useState(false);
  const [performanceFeedback, setPerformanceFeedback] = useState<'idle' | 'success'>('idle');
  // right panel tabs
  const [rightTab, setRightTab] = useState<'attendance'|'grades'>('attendance');
  // grades input state (per student)
  type GradeInput = { mode: 'percent'|'letter'; percent?: string; letter?: 'A'|'B'|'C'|'D'|'E'|'F'; note?: string };
  const [gradeMap, setGradeMap] = useState<Record<number, GradeInput>>({});
  const [gradeCreateOpen, setGradeCreateOpen] = useState(false);
  const [gradeSaving, setGradeSaving] = useState(false);
  const [gradeFeedback, setGradeFeedback] = useState<'idle'|'success'|'error'>('idle');
  // file size limit (MB)
  // Match server max (4MB per file in CourseRecordService)
  const MAX_FILE_SIZE_MB = 4;
  const MAX_FILE_SIZE = MAX_FILE_SIZE_MB * 1024 * 1024;
  const ALLOWED_MIME = new Set(['image/jpeg','image/png','image/webp','application/pdf']);
  // Right column shows attendance; content/files move to left below info

  useEffect(() => {
    if (!courseId) return;
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [courseData, recordsData, studentsData] = await Promise.all([
          getCourse(courseId),
          listCourseRecords(courseId),
          listCourseStudents(courseId),
        ]);
        if (!cancelled) {
          setCourse(courseData);
          const foundById = recordsData.find((r) => r.id === recId) || null;
          const foundByDate = ymd
            ? recordsData.find((r) => r.recordDate === ymd) || null
            : null;
          setRecord(foundById ?? foundByDate ?? null);
          setStudents(studentsData);
        }
      } catch (error) {
        if (!cancelled) {
          setError(readableError(error, "수업 내역을 불러오지 못했습니다."));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [courseId, recId, ymd]);

  // initialize editable date/time when record loads
  useEffect(() => {
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

  useEffect(() => {
    if (!record?.id) {
      setPerformanceScore('');
      setPerformanceNote('');
      setPerformanceFeedback('idle');
      return;
    }
    setPerformanceScore(
      record.performanceScore !== null && record.performanceScore !== undefined
        ? String(record.performanceScore)
        : ''
    );
    setPerformanceNote(record.performanceNote ?? '');
    setPerformanceFeedback('idle');
  }, [record?.id, record?.performanceScore, record?.performanceNote]);

  // Attendance local storage (unified with CourseDetail)
  const getLocalAttendanceKey = useCallback(() => {
    if (!courseId) return `attendance::`;
    if (recId) return `attendance:${courseId}:${recId}`;
    if (ymd) return `attendanceDate:${courseId}:${ymd}`;
    return `attendance:${courseId}:`;
  }, [courseId, recId, ymd]);

  const localAttMap = useMemo(() => {
    if (!courseId) return {} as Record<string, boolean>;
    const key = getLocalAttendanceKey();
    void attVersion;
    try {
      return JSON.parse(localStorage.getItem(key) || '{}') as Record<string, boolean>;
    } catch {
      return {};
    }
  }, [courseId, getLocalAttendanceKey, attVersion]);
  const presentMap = useMemo(() => {
    // Prefer server map when record exists; fallback to local when not available
    if (record?.id) return attMap;
    return localAttMap;
  }, [attMap, localAttMap, record?.id]);
  type AttendanceRow = { id: number; name: string; isExtra?: boolean; status: 'present' | 'absent' | 'none' };
  const attendanceRows = useMemo<AttendanceRow[]>(() => {
    const baseRows = students.map(s => ({ id: s.id, name: s.name }));
    const baseIds = new Set(baseRows.map(r => r.id));
    const extraRows = Object.keys(presentMap)
      .map(id => Number(id))
      .filter(id => Number.isFinite(id) && !baseIds.has(id))
      .map(id => ({ id, name: attStudentNames[id] || `학생#${id}`, isExtra: true }));
    return [...baseRows, ...extraRows].map(row => {
      const has = Object.prototype.hasOwnProperty.call(presentMap, row.id);
      const value = has ? Boolean((presentMap as Record<number, boolean>)[row.id]) : null;
      const status: 'present' | 'absent' | 'none' = value == null ? 'none' : value ? 'present' : 'absent';
      return { ...row, status };
    });
  }, [students, presentMap, attStudentNames]);
  const actionableRows = useMemo(
    () => attendanceRows.filter(row => !row.isExtra),
    [attendanceRows]
  );
  const presentRows = useMemo(
    () => attendanceRows.filter(row => !row.isExtra && row.status === 'present'),
    [attendanceRows]
  );
  const actionableCount = actionableRows.length;
  function setAttendance(studentId: number, present: boolean) {
    if (!courseId) return;
    const key = getLocalAttendanceKey();
    const map: Record<string, boolean> = (() => { try { return JSON.parse(localStorage.getItem(key) || '{}') as Record<string, boolean>; } catch { return {}; } })();
    map[String(studentId)] = present;
    try {
      localStorage.setItem(key, JSON.stringify(map));
    } catch {
      // ignore quota errors
    }
    setAttVersion(v => v + 1);
    emitCalendarClassesRefresh();
  }
  function clearAttendanceLocal(studentId: number) {
    if (!courseId) return;
    const key = getLocalAttendanceKey();
    const map: Record<string, boolean> = (() => { try { return JSON.parse(localStorage.getItem(key) || '{}') as Record<string, boolean>; } catch { return {}; } })();
    if (Object.prototype.hasOwnProperty.call(map, String(studentId))) delete map[String(studentId)];
    try {
      localStorage.setItem(key, JSON.stringify(map));
    } catch {
      // ignore quota errors
    }
    setAttVersion(v => v + 1);
  }
  const presentCount = useMemo(() => Object.values(presentMap).filter(Boolean).length, [presentMap]);
  const absentCount = useMemo(() => attendanceRows.filter(r => r.status === 'absent').length, [attendanceRows]);
  const noneCount = useMemo(() => attendanceRows.filter(r => r.status === 'none').length, [attendanceRows]);
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
  const isPersonalCourse = useMemo(() => course?.courseType === 'INDIVIDUAL', [course?.courseType]);
  // participation metrics removed

  function emitCalendarClassesRefresh(target?: string) {
    const payload = target || record?.recordDate || ymd || formatYMD(new Date());
    window.dispatchEvent(
      new CustomEvent("calendar:classes-refresh", { detail: { ymd: payload } })
    );
  }

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

  async function saveGradesForPresent() {
    if (!courseId) return;
    const date = record?.recordDate || ymd || new Date().toISOString().slice(0,10);
    if (!date) return;
    setGradeSaving(true); setGradeFeedback('idle');
    try {
      const items = presentRows
        .map(r => ({ id: r.id, input: gradeMap[r.id] }))
        .filter(x => x.input && ((x.input.mode === 'percent' && x.input.percent && Number(x.input.percent) >= 0) || (x.input.mode === 'letter' && x.input.letter)));
      for (const it of items) {
        const inp = it.input!;
        const percent = inp.mode === 'percent' ? Number(inp.percent) : undefined;
        const level = inp.mode === 'letter' ? inp.letter : undefined;
        const clamped = typeof percent === 'number' ? Math.max(0, Math.min(100, Math.round(percent))) : undefined;
        try {
          addStudentGrade(it.id, {
            date,
            subject: course?.title || '수업',
            courseId: courseId,
            score: clamped,
            outOf: clamped != null ? 100 : undefined,
            level: level,
            note: (inp.note || '').trim() || undefined,
          });
        } catch {
          // ignore per-student failure
        }
      }
      setGradeFeedback('success');
      // reset inputs after short delay
      setTimeout(() => { setGradeMap({}); setGradeFeedback('idle'); }, 1200);
    } catch {
      setGradeFeedback('error');
    } finally {
      setGradeSaving(false);
    }
  }

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
      } catch (error) {
        if (!cancelled) setAttError(readableError(error, '출석 정보를 불러오지 못했습니다.'));
      } finally { if (!cancelled) setAttLoading(false); }
    }
    void loadAttendance();
    return () => { cancelled = true; };
  }, [courseId, record]);

  async function confirmAndSetAttendance(studentId: number, target: boolean) {
    if (courseId && record?.id) {
      // Server update
      setAttSavingMap(m => ({ ...m, [studentId]: true }));
      try {
        const reason = attNoteMap[studentId]?.trim() || undefined;
        await upsertAttendance(courseId!, record!.id, studentId, { present: target, reason, source: 'MANUAL' });
        setAttMap(m => ({ ...m, [studentId]: target }));
        // Invalidate calendars and dashboards to reflect latest attendance
        invalidateCacheByPrefix([
          '/api/calendar/classes',
          '/api/calendar/classes-range',
          '/api/dashboard/summary',
          '/api/dashboard/attendance-today',
          `/api/courses/${courseId}/records/${record!.id}/attendance`,
        ]);
        emitCalendarClassesRefresh(record?.recordDate ?? ymd ?? undefined);
        try { window.dispatchEvent(new CustomEvent('dashboard:attendance-refresh', { detail: {} })); } catch {}
      } catch (error) {
        showError(readableError(error, '출석 처리에 실패했습니다.'));
      } finally {
        setAttSavingMap(m => ({ ...m, [studentId]: false }));
      }
    } else {
      // Local fallback
      setAttendance(studentId, target);
    }
  }

  function promptSetAttendance(studentId: number, target: boolean) {
    setConfirmOne({ open: true, studentId, target });
  }

  function openBulkSelect() {
    if (actionableCount === 0) {
      window.alert('출석 처리할 학생이 없습니다.');
      return;
    }
    const initial: Record<number, boolean> = {};
    actionableRows.forEach(row => {
      initial[row.id] = row.status !== 'present';
    });
    setSelectedIds(initial);
    setBulkDialogOpen(true);
  }

  const selectedCount = useMemo(
    () => Object.values(selectedIds).filter(Boolean).length,
    [selectedIds]
  );

  function cancelBulkDialog() {
    if (bulkStatus) return;
    setBulkDialogOpen(false);
    setSelectedIds({});
  }

  async function confirmBulkSelection() {
    const ids = Object.entries(selectedIds)
      .filter(([, v]) => v)
      .map(([key]) => Number(key));
    if (!ids.length) {
      window.alert('학생을 한 명 이상 선택해 주세요.');
      return;
    }
    const ok = await bulkSetAttendance(true, ids);
    if (ok) {
      setBulkDialogOpen(false);
      setSelectedIds({});
    }
  }

  async function bulkSetAttendance(target: boolean, targetIds?: number[]): Promise<boolean> {
    const desiredStatus: 'present' | 'absent' = target ? 'present' : 'absent';
    const label = target ? '출석' : '결석';
    const baseCandidates = attendanceRows.filter(row => !row.isExtra);
    const effectiveIds = targetIds ? new Set(targetIds) : null;
    const candidates = baseCandidates.filter(row => {
      if (effectiveIds && !effectiveIds.has(row.id)) return false;
      return row.status !== desiredStatus;
    });
    if (candidates.length === 0) {
      window.alert(targetIds ? '선택한 학생은 이미 출석 처리됐습니다.' : `이미 모든 학생이 ${label} 상태입니다.`);
      return false;
    }
    if (!targetIds) {
      const confirmMessage = `총 ${candidates.length}명의 학생을 ${label} 처리할까요?${record?.id ? '\n변경 내용은 즉시 저장됩니다.' : ''}`;
      if (!window.confirm(confirmMessage)) return false;
    }

    setBulkStatus(desiredStatus);

    let success = false;
    if (courseId && record?.id) {
      setAttSavingMap(m => {
        const next = { ...m };
        candidates.forEach(({ id }) => { next[id] = true; });
        return next;
      });
      const succeeded: number[] = [];
      let failure: unknown = null;
      for (const row of candidates) {
        try {
          const reason = attNoteMap[row.id]?.trim() || undefined;
          await upsertAttendance(courseId, record.id, row.id, { present: target, reason, source: 'MANUAL' });
          succeeded.push(row.id);
        } catch (error) {
          if (!failure) failure = error;
        }
      }
      setAttSavingMap(m => {
        const next = { ...m };
        candidates.forEach(({ id }) => { delete next[id]; });
        return next;
      });
      if (succeeded.length) {
        setAttMap(prev => {
          const next = { ...prev };
          succeeded.forEach(id => { next[id] = target; });
          return next;
        });
        invalidateCacheByPrefix([
          '/api/calendar/classes',
          '/api/calendar/classes-range',
          '/api/dashboard/summary',
          '/api/dashboard/attendance-today',
          `/api/courses/${courseId}/records/${record.id}/attendance`,
        ]);
        emitCalendarClassesRefresh(record?.recordDate ?? ymd ?? undefined);
        try { window.dispatchEvent(new CustomEvent('dashboard:attendance-refresh', { detail: {} })); } catch {}
        success = true;
      }
      if (failure) {
        showError(readableError(failure, `일괄 ${label} 처리 중 일부가 실패했습니다.`));
      }
    } else {
      candidates.forEach(({ id }) => setAttendance(id, target));
      success = candidates.length > 0;
    }

    setBulkStatus(null);
    return success;
  }

  // Load/save local notes when no server record
  useEffect(() => {
    if (!courseId || record?.id) return;
    const key = getLocalAttendanceKey().replace('attendance', 'attendanceNote');
    try {
      const parsed = JSON.parse(localStorage.getItem(key) || '{}') as Record<string, string>;
      setAttNoteMap(parsed || {});
    } catch {
      // ignore localStorage errors
    }
  }, [courseId, record?.id, getLocalAttendanceKey]);

  useEffect(() => {
    if (contentFeedback !== 'success') return;
    const t = window.setTimeout(() => setContentFeedback('idle'), 2500);
    return () => window.clearTimeout(t);
  }, [contentFeedback]);

  // Attachments helpers: server if record exists; otherwise local fallback keyed by date
  const localAttachKey = useCallback(() => {
    if (!courseId) return `attachments::`;
    if (recId) return `attachments:${courseId}:${recId}`;
    if (ymd) return `attachmentsDate:${courseId}:${ymd}`;
    return `attachments:${courseId}:`;
  }, [courseId, recId, ymd]);
  const getLocalAttachments = useCallback((): { name: string; size: number }[] => {
    try { return JSON.parse(localStorage.getItem(localAttachKey()) || '[]'); } catch { return []; }
  }, [localAttachKey]);
  const setLocalAttachments = useCallback((list: { name: string; size: number }[]) => {
    try {
      localStorage.setItem(localAttachKey(), JSON.stringify(list));
    } catch {
      // ignore quota errors
    }
  }, [localAttachKey]);
  function toAttachmentRows(list: { name: string; size: number }[]): Attachment[] {
    const now = new Date().toISOString();
    return list.map((item, idx) => ({
      id: -1 - idx,
      filename: item.name,
      size: item.size,
      createdAt: now,
    }));
  }
  useEffect(() => {
    if (!courseId) return;
    let cancelled = false;
    async function loadFiles() {
      setFilesError(null);
      if (record?.id) {
        setFilesLoading(true);
        try {
          const list = await listRecordAttachments(courseId!, record!.id, { presign: true });
          if (!cancelled) {
            setFiles(list);
            // Preload thumbnails for images (best-effort)
            void preloadThumbs(list);
          }
      } catch (error) {
        if (!cancelled) setFilesError(readableError(error, '첨부를 불러오지 못했습니다.'));
      } finally { if (!cancelled) setFilesLoading(false); }
    } else {
      // local fallback
      const local = getLocalAttachments();
      const now = new Date().toISOString();
      const mapped: Attachment[] = local.map((x, i) => ({
        id: -1 - i,
        filename: x.name,
        size: x.size,
        createdAt: now,
      }));
      setFiles(mapped);
    }
  }
  void loadFiles();
  return () => { cancelled = true; };
  }, [courseId, record, recId, ymd, getLocalAttachments]);
  function filterIncoming(filesList: FileList | File[]) {
    const all = Array.from(filesList);
    const sized = all.filter(f => f.size <= MAX_FILE_SIZE);
    const rejectedSize = all.filter(f => f.size > MAX_FILE_SIZE);
    const accepted = sized.filter(f => !f.type || ALLOWED_MIME.has(f.type));
    const rejectedType = sized.filter(f => f.type && !ALLOWED_MIME.has(f.type));
    if (rejectedSize.length > 0) setFilesError(`용량 제한(${MAX_FILE_SIZE_MB}MB)을 초과한 파일 제외: ${rejectedSize.map(f => f.name).join(', ')}`);
    else setFilesError(null);
    if (rejectedType.length > 0) setFilesError(prev => [prev, `허용되지 않는 형식 제외: ${rejectedType.map(f => f.name).join(', ')}`].filter(Boolean).join(' / '));
    return accepted;
  }
  async function startUpload(accepted: File[]) {
    if (accepted.length === 0) return;
    if (!(courseId && record?.id)) {
      // local fallback
      const prev = getLocalAttachments();
      const next = [...prev, ...accepted.map(f => ({ name: f.name, size: f.size }))];
      setLocalAttachments(next);
      setFiles(toAttachmentRows(next));
      return;
    }
    // limit concurrency for smoother UI
    const MAX_FILES = 8;
    const CONCURRENCY = 3;
    const send = accepted.slice(0, MAX_FILES);
    const omitted = accepted.length - send.length;
    if (omitted > 0) setFilesError(prev => [prev, `최대 ${MAX_FILES}개까지만 업로드됩니다 (추가 ${omitted}개 제외)`].filter(Boolean).join(' / '));
    // queue items
    const newItems: UploadQueueItem[] = send.map((f, i) => ({ id: `${Date.now()}-${i}-${Math.random().toString(36).slice(2,8)}`, name: f.name, size: f.size, progress: 0, status: 'pending' }));
    setUploadQueue(q => [...newItems, ...q]);
    const created: Attachment[] = [];
    let idx = 0;
    async function uploadOne(index: number) {
      const f = send[index];
      const qid = newItems[index].id;
      // 1) presign
      const pres = await presignRecordAttachment(courseId!, record!.id, f.name, f.type || 'application/octet-stream');
      // 2) PUT with progress via XHR
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('PUT', pres.url, true);
        for (const [k, v] of Object.entries(pres.headers || {})) {
          try { xhr.setRequestHeader(k, v as string); } catch {}
        }
        setUploadQueue(q => q.map(it => it.id === qid ? { ...it, status: 'uploading', progress: 0 } : it));
        xhr.upload.onprogress = (ev) => {
          if (ev.lengthComputable) {
            const pct = Math.max(1, Math.min(99, Math.round((ev.loaded / ev.total) * 100)));
            setUploadQueue(q => q.map(it => it.id === qid ? { ...it, progress: pct } : it));
          }
        };
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            setUploadQueue(q => q.map(it => it.id === qid ? { ...it, progress: 100 } : it));
            resolve();
          } else {
            const err = `S3 업로드 실패: HTTP ${xhr.status}`;
            setUploadQueue(q => q.map(it => it.id === qid ? { ...it, status: 'error', error: err } : it));
            reject(new Error(err));
          }
        };
        xhr.onerror = () => {
          const err = 'S3 업로드 중 네트워크 오류';
          setUploadQueue(q => q.map(it => it.id === qid ? { ...it, status: 'error', error: err } : it));
          reject(new Error(err));
        };
        xhr.send(f);
      });
      // 3) confirm
      const etag: string | undefined = undefined; // ETag는 S3 CORS ExposeHeaders 설정 시 접근 가능
      // XHR로는 헤더 접근이 제한될 수 있어 여기서는 생략; presigned GET 없이도 confirm 가능
      const meta = await confirmRecordAttachment(courseId!, record!.id, { key: pres.key, filename: f.name, contentType: f.type || 'application/octet-stream', size: f.size, etag, originalName: f.name });
      created.push(meta);
      setUploadQueue(q => q.map(it => it.id === qid ? { ...it, status: 'done', progress: 100 } : it));
    }
    const workers = Array.from({ length: Math.min(CONCURRENCY, send.length) }, async () => {
      while (idx < send.length) {
        const cur = idx++;
        try { await uploadOne(cur); } catch (e) { /* already marked in queue */ }
      }
    });
    await Promise.all(workers);
    if (created.length) {
      setFiles(prev => [...created, ...prev]);
      void preloadThumbs(created);
    }
    // cleanup finished items after short delay
    setTimeout(() => setUploadQueue(q => q.filter(it => it.status !== 'done' && it.status !== 'error')), 2500);
  }
  async function onUpload(filesList: FileList | null) {
    if (!filesList) return;
    const accepted = filterIncoming(filesList);
    await startUpload(accepted);
  }
  const onDropFiles = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const items = e.dataTransfer?.files;
    if (!items || items.length === 0) return;
    const accepted = filterIncoming(items);
    await startUpload(accepted);
  };
  async function preloadThumbs(list: Attachment[]) {
    // Only for images; best-effort with small concurrency
    const imgs = list.filter(f => (f.contentType || '').startsWith('image/'));
    const limit = 3;
    let idx = 0;
    const run = async () => {
      while (idx < imgs.length) {
        const cur = imgs[idx++];
        if (thumbUrl[cur.id]) continue; // already loaded
        try {
          setPreviewBusy(m => ({ ...m, [cur.id]: true }));
          // Prefer downloadUrl from list; fallback to a one-off presigned GET
          const url = cur.downloadUrl || (await getRecordAttachmentDownloadUrl(courseId!, record!.id, cur.id)).url;
          setThumbUrl(m => ({ ...m, [cur.id]: url }));
        } catch {
          // ignore preview failures
        } finally {
          setPreviewBusy(m => ({ ...m, [cur.id]: false }));
        }
      }
    };
    await Promise.all(Array.from({ length: Math.min(limit, imgs.length) }, () => run()));
  }
  useEffect(() => {
    return () => {
      // Revoke object URLs on unmount
      Object.values(thumbUrl).forEach(u => { try { URL.revokeObjectURL(u); } catch {} });
    };
  }, []);
  async function openAttachment(f: Attachment) {
    if (!courseId || !record?.id) return;
    try {
      setPreviewBusy(m => ({ ...m, [f.id]: true }));
      // Prefer presigned GET if available
      const maybeUrl = f.downloadUrl;
      if (maybeUrl) {
        window.open(maybeUrl, '_blank', 'noopener');
        return;
      }
      // fallback to API-proxied download URL
      const { url } = await getRecordAttachmentDownloadUrl(courseId!, record!.id, f.id);
      window.open(url, '_blank', 'noopener');
    } catch (err) {
      showError(readableError(err, '파일을 열 수 없습니다.'));
    } finally {
      setPreviewBusy(m => ({ ...m, [f.id]: false }));
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
      } catch (error) {
        showError(readableError(error, '삭제에 실패했습니다.'));
      } finally {
        setFileBusy(m => ({ ...m, [fileId]: false }));
      }
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
    } catch (error) {
      showError(readableError(error, '저장에 실패했습니다.'));
    } finally {
      setSaving(s => ({ ...s, [key]: false }));
    }
  }

  async function savePerformance() {
    if (!courseId || !record?.id) return;
    const numericScore = performanceScore === '' ? null : Number(performanceScore);
    if (numericScore != null && Number.isNaN(numericScore)) {
      showError('성과 점수는 숫자로 입력해 주세요.');
      return;
    }
    setPerformanceSaving(true);
    try {
      const updated = await updateCourseRecord(courseId, record.id, {
        performanceScore: numericScore,
        performanceNote: performanceNote.trim().length ? performanceNote : null,
      });
      setRecord(updated);
      setPerformanceFeedback('success');
      invalidateCacheByPrefix('/api/calendar/classes');
    } catch (error) {
      showError(readableError(error, '성과를 저장하지 못했습니다.'));
    } finally {
      setPerformanceSaving(false);
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
    } catch (error) {
      const msg = readableError(error, '');
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
            <UIGhostButton type="button" onClick={() => setConfirmDeleteOpen(true)}>삭제</UIGhostButton>
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
            await deleteCourseRecord(courseId, record.id);
            invalidateCacheByPrefix('/api/calendar/classes');
            setConfirmDeleteOpen(false);
            navigate(`/classes/${courseId}/history`);
          } catch (error) {
            showError(readableError(error, '삭제에 실패했습니다.'));
          } finally {
            setConfirmBusy(false);
          }
        }}
      />
      <ConfirmDialog
        open={confirmOne.open}
        title="출결 처리 확인"
        message={(() => {
          const sid = confirmOne.studentId;
          const tgt = confirmOne.target;
          const sName = sid != null ? (students.find(s => s.id === sid)?.name || `학생#${sid}`) : '학생';
          const label = tgt ? '출석' : '결석';
          return `${sName}을(를) ${label} 처리하시겠어요?`;
        })()}
        confirmLabel="확인"
        cancelLabel="취소"
        tone="default"
        busy={false}
        onCancel={() => setConfirmOne({ open: false, studentId: null, target: null })}
        onConfirm={async () => {
          const sid = confirmOne.studentId;
          const tgt = confirmOne.target;
          setConfirmOne({ open: false, studentId: null, target: null });
          if (sid == null || tgt == null) return;
          await confirmAndSetAttendance(sid, tgt);
        }}
      />
      <ConfirmDialog
        open={bulkDialogOpen}
        title="선택 출석 처리"
        message={(
          <BulkDialogBody>
            <p>출석 처리할 학생을 선택하세요.</p>
          <BulkList>
            {actionableRows.map((row) => {
              const disabled = row.status === 'present';
              return (
                <BulkItem key={row.id} data-disabled={String(disabled)}>
                  <input
                    type="checkbox"
                    checked={selectedIds[row.id] || false}
                    onChange={(e) => {
                      const targetInput = e.target as HTMLInputElement | null;
                      if (!targetInput) return;
                      const { checked } = targetInput;
                      setSelectedIds(prev => ({ ...prev, [row.id]: checked }));
                    }}
                    disabled={disabled || bulkStatus !== null}
                  />
                  <span className="name">{row.name}</span>
                  <span className="status">
                    {row.status === 'present' ? '이미 출석' : row.status === 'absent' ? '결석' : '미처리'}
                  </span>
                </BulkItem>
              );
            })}
          </BulkList>
            <BulkFooter>
              <span>선택된 학생: {selectedCount}명</span>
            </BulkFooter>
          </BulkDialogBody>
        )}
        confirmLabel="출석 처리"
        cancelLabel="취소"
        onCancel={cancelBulkDialog}
        onConfirm={() => { if (!bulkStatus) void confirmBulkSelection(); }}
        busy={bulkStatus === 'present'}
        hideCancel={false}
      />
      {error && <AlertError>{error}</AlertError>}
      {loading && <Muted>불러오는 중...</Muted>}

      {/* KPIs removed for a simpler layout */}

      

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
          {/* 성과 기록(개별 수업) 섹션 제거 */}

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
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  multiple
                  style={{ display:'none' }}
                  onChange={(e) => { void onUpload(e.currentTarget.files); e.currentTarget.value = ''; }}
                />
              </label>
            </SectionHeader>
            <DropArea onDragOver={(e) => { e.preventDefault(); }} onDrop={onDropFiles}>
              <span className="hint">여기로 파일을 끌어다 놓거나 ‘파일 추가’를 누르세요</span>
            </DropArea>
            {uploadQueue.length > 0 && (
              <UploadQueue>
                {uploadQueue.map(u => (
                  <QueueItem key={u.id}>
                    <div className="meta">
                      <span className="name" title={u.name}>{u.name}</span>
                      <span className="size">{Math.round(u.size/1024)} KB</span>
                      <span className="status">{u.status === 'uploading' ? '업로드 중' : u.status === 'done' ? '완료' : u.status === 'error' ? '오류' : '대기'}</span>
                    </div>
                    <div className="bar"><i style={{ width: `${u.progress}%` }} /></div>
                    {u.error && <SmallMuted>{u.error}</SmallMuted>}
                  </QueueItem>
                ))}
              </UploadQueue>
            )}
            {filesError && <AlertError>{filesError}</AlertError>}
            {filesLoading && <Muted>불러오는 중...</Muted>}
            {files.length === 0 ? (
              <AttachEmpty>첨부 없음</AttachEmpty>
            ) : (
              <AttachGrid>
                {files.map((f) => {
                  const isImg = (f.contentType || '').startsWith('image/');
                  const isPdf = (f.contentType || '') === 'application/pdf' || /\.pdf$/i.test(f.filename);
                  const url = thumbUrl[f.id];
                  return (
                    <AttachCard key={f.id}>
                      <ThumbArea>
                        {isImg ? (
                          url ? <ThumbImg src={url} alt={f.filename} /> : <ThumbPlaceholder>이미지</ThumbPlaceholder>
                        ) : isPdf ? (
                          <ThumbPlaceholder>PDF</ThumbPlaceholder>
                        ) : (
                          <ThumbPlaceholder>FILE</ThumbPlaceholder>
                        )}
                      </ThumbArea>
                      <AttachMeta title={f.filename}>
                        <span className="name">{f.filename}</span>
                        <span className="size">{Math.round(f.size / 1024)} KB</span>
                      </AttachMeta>
                      <AttachActions>
                        <SmallBtn onClick={() => void openAttachment(f)} disabled={!!previewBusy[f.id]}>보기</SmallBtn>
                        <SmallBtn data-variant='danger' disabled={!!fileBusy[f.id]} onClick={() => void onDeleteFile(f.id, f.filename)}>삭제</SmallBtn>
                      </AttachActions>
                    </AttachCard>
                  );
                })}
              </AttachGrid>
            )}
            {!record?.id && <Hint>서버 기록이 없어 로컬에만 저장됩니다.</Hint>}
            <Hint>파일 크기 제한: 최대 {MAX_FILE_SIZE_MB}MB (이미지/PDF만 허용)</Hint>
          </Section>

        </Left>
        <Right>
          <TopTabs>
            <TabBar>
              <TabBtn data-active={String(rightTab==='attendance')} onClick={() => setRightTab('attendance')}>출결 현황</TabBtn>
              <TabBtn data-active={String(rightTab==='grades')} onClick={() => setRightTab('grades')}>성적/성장</TabBtn>
            </TabBar>
          </TopTabs>
          <Section>
            <AttSticky>
            <SectionHeader>
              <HeaderText>
                <Title>{rightTab === 'attendance' ? '출결 현황' : '성적/성장 기록'}</Title>
                {rightTab === 'attendance' ? (
                  <Muted>학생별 출석 상태를 수동으로 처리하세요. 변경 시 확인 창이 표시됩니다.</Muted>
                ) : (
                  <Muted>출석 학생에게 백분율/등급과 성장내용을 입력하세요.</Muted>
                )}
              </HeaderText>
              {rightTab === 'attendance' && (
              <BulkActions>
                <SmallBtn
                  type="button"
                  onClick={() => { if (!bulkStatus && !attLoading) void bulkSetAttendance(true); }}
                  disabled={bulkStatus !== null || attLoading || actionableCount === 0}
                >전체 출석</SmallBtn>
                <SmallBtn
                  type="button"
                  onClick={openBulkSelect}
                  disabled={bulkStatus !== null || attLoading || actionableCount === 0}
                >선택 출석</SmallBtn>
                {bulkStatus && (
                  <SmallMuted>
                    일괄 출석 처리 중…
                  </SmallMuted>
                )}
              </BulkActions>
              )}
            </SectionHeader>
            {rightTab === 'attendance' && (
            <Toolbar>
              <Filters>
                <Pill
                  data-active={String(attFilter === 'all')}
                  onClick={() => setAttFilter('all')}
                  title={`전체 (${attendanceRows.length})`}
                >전체 {attendanceRows.length}</Pill>
                <Pill
                  data-variant='present'
                  data-active={String(attFilter === 'present')}
                  onClick={() => setAttFilter('present')}
                  title={`출석 (${presentCount})`}
                >출석 {presentCount}</Pill>
                <Pill
                  data-variant='absent'
                  data-active={String(attFilter === 'absent')}
                  onClick={() => setAttFilter('absent')}
                  title={`결석 (${absentCount})`}
                >결석 {absentCount}</Pill>
                <Pill
                  data-variant='none'
                  data-active={String(attFilter === 'none')}
                  onClick={() => setAttFilter('none')}
                  title={`미처리 (${noneCount})`}
                >미처리 {noneCount}</Pill>
              </Filters>
              <Searcher>
                <SearchInput
                  placeholder="학생 검색"
                  value={attQuery}
                  onChange={(e) => setAttQuery(e.currentTarget.value)}
                />
                {attQuery && (
                  <ClearBtn type="button" onClick={() => setAttQuery('')}>지우기</ClearBtn>
                )}
              </Searcher>
            </Toolbar>
            )}
            </AttSticky>
            {rightTab === 'attendance' ? (
            <>
              {!record?.id && <Hint>서버 기록이 없어 출석 정보가 로컬에만 저장됩니다.</Hint>}
              {attLoading && <Muted>출석 불러오는 중...</Muted>}
              {attError && <AlertError>{attError}</AlertError>}
              <List>
              {attendanceRows
                .filter(row => {
                  if (attFilter === 'present') return row.status === 'present';
                  if (attFilter === 'absent') return row.status === 'absent';
                  if (attFilter === 'none') return row.status === 'none';
                  return true;
                })
                .filter(row => {
                  const q = attQuery.trim();
                  if (!q) return true;
                  return row.name.toLowerCase().includes(q.toLowerCase());
                })
                .map(row => {
                const status = row.status;
                const has = status !== 'none';
                const present = status === 'present';
                const isSaving = !!attSavingMap[row.id] || bulkStatus !== null;
                return (
                  <Item key={row.id}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <strong>{row.name}</strong>
                      {row.isExtra && <SmallMuted style={{ marginLeft: 8 }}>(과거 수강생)</SmallMuted>}
                      <Processed data-type={status}>
                        {status === 'present' ? '출석' : status === 'absent' ? '결석' : '미처리'}
                      </Processed>
                    </div>
                    <RowRight>
                      <NoteInput
                        placeholder="메모"
                        value={attNoteMap[row.id] || ''}
                        onChange={(e) => {
                          const v = e.currentTarget.value;
                          setAttNoteMap(prev => ({ ...prev, [row.id]: v }));
                          if (courseId) {
                            const key = getLocalAttendanceKey().replace('attendance', 'attendanceNote');
                            try {
                              const obj = JSON.parse(localStorage.getItem(key) || '{}');
                              obj[String(row.id)] = v;
                              localStorage.setItem(key, JSON.stringify(obj));
                            } catch {
                              // ignore local persistence failure
                            }
                          }
                          if (courseId && record?.id && has) {
                            const timers = noteTimersRef.current;
                            if (timers[row.id]) window.clearTimeout(timers[row.id]);
                            timers[row.id] = window.setTimeout(async () => {
                              setAttSavingMap(m => ({ ...m, [row.id]: true }));
                              try {
                                const reason = (v || '').trim() || undefined;
                                await upsertAttendance(courseId!, record!.id, row.id, { present: present === true, reason, source: 'MANUAL' });
                              } catch (err) {
                                console.error('메모 자동 저장 실패', err);
                              } finally {
                                setAttSavingMap(m => ({ ...m, [row.id]: false }));
                              }
                            }, 600);
                          }
                        }}
                        disabled={isSaving}
                      />
                      <AttSeg>
                        <AttBtn
                          data-active={String(has && present === true)}
                          onClick={() => { if (!isSaving && !present) promptSetAttendance(row.id, true); }}
                          disabled={isSaving}
                        >출석</AttBtn>
                        <AttBtn
                          data-variant="danger"
                          data-active={String(has && present === false)}
                          onClick={() => { if (!isSaving && present !== false) promptSetAttendance(row.id, false); }}
                          disabled={isSaving}
                        >결석</AttBtn>
                      </AttSeg>
                      <SmallBtn
                        title={record?.id ? '서버 기록은 미처리로 되돌릴 수 없습니다.' : '미처리로 초기화'}
                        onClick={() => { if (!record?.id) clearAttendanceLocal(row.id); }}
                        disabled={!!record?.id || isSaving}
                      >미처리</SmallBtn>
                      {isSaving && <SmallMuted>저장 중...</SmallMuted>}
                      </RowRight>
                    </Item>
                );
              })}
              </List>
            </>
            ) : (
            <>
              <GradesHead>
                <div className="meta">
                  <span>{whenInfo.dateLabel}</span>
                  <DotSep />
                  <span>{course?.title || '수업'}</span>
                </div>
                <div className="actions" style={{ display:'inline-flex', gap:8, alignItems:'center' }}>
                  {!gradeCreateOpen ? (
                    <UIPrimaryButton onClick={() => setGradeCreateOpen(true)} disabled={presentRows.length === 0}>생성하기</UIPrimaryButton>
                  ) : (
                    <>
                      <UIPrimaryButton onClick={() => { void saveGradesForPresent(); }} disabled={gradeSaving || presentRows.length === 0}>{gradeSaving ? '저장 중…' : '저장'}</UIPrimaryButton>
                      <SmallBtn data-variant='danger' onClick={() => { setGradeCreateOpen(false); setGradeMap({}); }}>취소</SmallBtn>
                    </>
                  )}
                  {gradeFeedback === 'success' && <SuccessBadge role="status">저장 완료!</SuccessBadge>}
                </div>
              </GradesHead>
              {!gradeCreateOpen ? (
                <GradesPanel>
                  <EmptyHint>출석 학생에게 성적/성장 내용을 입력하려면 ‘생성하기’를 클릭하세요.</EmptyHint>
                </GradesPanel>
              ) : (
                <GradesPanel>
                  <GradeHeader>
                    <span>학생명</span>
                    <span>입력 방식</span>
                    <span>값</span>
                    <span>성장내용(선택)</span>
                  </GradeHeader>
                  {presentRows.length === 0 ? (
                    <GradeRow><SmallMuted>출석 학생이 없습니다.</SmallMuted></GradeRow>
                  ) : presentRows.map(row => {
                    const gi = gradeMap[row.id] || { mode:'percent' } as GradeInput;
                    const onMode = (mode: 'percent'|'letter') => setGradeMap(m => ({ ...m, [row.id]: { mode, percent: mode==='percent'? (gi.percent||'') : undefined, letter: mode==='letter'? (gi.letter||'A') : undefined, note: gi.note } }));
                    return (
                      <GradeRow key={`g-${row.id}`}>
                        <strong>{row.name}</strong>
                        <ModeSeg>
                          <ModeBtn data-active={String(gi.mode==='percent')} onClick={() => onMode('percent')}>백분율</ModeBtn>
                          <ModeBtn data-active={String(gi.mode==='letter')} onClick={() => onMode('letter')}>등급</ModeBtn>
                        </ModeSeg>
                        <div>
                          {gi.mode === 'percent' ? (
                            <ValueInput type="number" min={0} max={100} value={gi.percent || ''} placeholder="0~100" onChange={(e)=>{
                              const v = e.currentTarget.value; setGradeMap(m => ({ ...m, [row.id]: { ...gi, percent: v } }));
                            }} />
                          ) : (
                            <ValueSelect value={gi.letter || 'A'} onChange={(e)=>{ const v = e.currentTarget.value as GradeInput['letter']; setGradeMap(m => ({ ...m, [row.id]: { ...gi, letter: v } })); }}>
                              {['A','B','C','D','E','F'].map(x => (<option key={x} value={x}>{x}</option>))}
                            </ValueSelect>
                          )}
                        </div>
                        <NoteInput style={{ width: '100%' }} placeholder="성장내용을 간단히 적어 주세요" value={gi.note || ''} onChange={(e)=>{ const v = e.currentTarget.value; setGradeMap(m => ({ ...m, [row.id]: { ...gi, note: v } })); }} />
                      </GradeRow>
                    );
                  })}
                </GradesPanel>
              )}
            </>
            )}
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
// KPIGrid removed
const Columns = styled.div`
  display:flex; gap:12px; align-items:flex-start;
  @media (max-width: 1024px) { flex-direction: column; }
`;
const Left = styled.div`
  flex: 1 1 0; display:grid; gap:10px; align-content:flex-start;
  @media (max-width: 1024px) { order: 2; }
`;
const Right = styled.div`
  flex: 1 1 0; display:grid; gap:10px; align-content:flex-start;
  @media (max-width: 1024px) { order: 1; }
`;
// removed segmented tabs; simple two-column layout
const SectionHeader = styled.div` display:flex; align-items:center; justify-content:space-between; margin-bottom:6px; `;
const AttSticky = styled.div`
  position: sticky;
  top: 0;
  z-index: 20;
  background: ${(p) => p.theme.colors.surface};
  padding: 4px 0 6px 0;
  margin-top: -4px;
  border-bottom: 1px solid ${(p) => p.theme.colors.borderMuted};
`;
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
const BulkActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.spacing.sm};
  flex-wrap: wrap;
  justify-content: flex-end;
  margin-left: ${(p) => p.theme.spacing.sm};
`;
const List = styled.div` display:grid; gap:6px; `;
const Item = styled.div` display:flex; align-items:center; justify-content:space-between; padding:8px 10px; border:1px solid #e5e7eb; border-radius:10px; background:#fff; `;
const RowRight = styled.div` display:flex; align-items:center; gap:6px; `;
const NoteInput = styled.input` height:26px; width: 140px; padding:0 8px; border:1px solid #e5e7eb; border-radius:8px; font-size:12px; background:#fff; `;
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
const Toolbar = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 8px;
  align-items: center;
  margin: 6px 0 6px 0;
`;
const Filters = styled.div`
  display: inline-flex;
  gap: 6px;
  flex-wrap: wrap;
`;
const Pill = styled.button`
  ${buttonVariants.outline};
  height: 30px;
  padding: 0 10px;
  font-size: 12px;
  &[data-active='true']{
    background:#eef2ff;
    color:#3730a3;
    border-color:#c7d2fe;
  }
  &[data-variant='present']{
    color:#065f46;
    border-color:#a7f3d0;
    background:#ecfdf5;
  }
  &[data-variant='present'][data-active='true']{
    background:#d1fae5; color:#065f46; border-color:#6ee7b7;
  }
  &[data-variant='absent']{
    color:#b91c1c;
    border-color:#fecaca;
    background:#fee2e2;
  }
  &[data-variant='absent'][data-active='true']{
    background:#fecaca; color:#7f1d1d; border-color:#fca5a5;
  }
  &[data-variant='none']{
    color:#374151;
    border-color:#e5e7eb;
    background:#f3f4f6;
  }
  &[data-variant='none'][data-active='true']{
    background:#e5e7eb; color:#111827; border-color:#d1d5db;
  }
`;
const Searcher = styled.div`
  display: inline-flex;
  gap: 6px;
  align-items: center;
`;
const SearchInput = styled.input`
  height: 30px;
  padding: 0 10px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 12px;
`;
const ClearBtn = styled.button`
  ${buttonVariants.subtle};
  height: 30px;
  padding: 0 10px;
  font-size: 12px;
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
const AttachEmpty = styled.div`
  color: #9ca3af; font-size: 13px; padding: 12px 0;
`;
const AttachGrid = styled.div`
  display: grid; gap: 12px; margin-top: 10px;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
`;
const PerformanceGrid = styled.div`
  display: grid;
  gap: ${(p) => p.theme.spacing.md};
`;
const ScoreRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.spacing.sm};
`;
const AttachCard = styled.div`
  border: 1px solid #e5e7eb; border-radius: 12px; background: #fff; padding: 10px; display: grid; gap: 8px;
`;
const ThumbArea = styled.div`
  height: 120px; border-radius: 8px; background: #f3f4f6; display: grid; place-items: center; overflow: hidden;
`;
const ThumbImg = styled.img`
  width: 100%; height: 100%; object-fit: cover; display: block;
`;
const ThumbPlaceholder = styled.div`
  color: #6b7280; font-size: 12px;
`;
const AttachMeta = styled.div`
  display: flex; justify-content: space-between; align-items: center; gap: 8px;
  .name { font-size: 12px; color: #111827; flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .size { font-size: 11px; color: #9ca3af; }
`;
const AttachActions = styled.div`
  display: flex; gap: 8px; justify-content: flex-end;
`;
const SmallBtn = styled(UISmallBtn)`
  height: 32px;
  padding: 0 12px;
  font-size: 13px;
  &[data-variant='danger']{
    border-color:#fecaca;
    color:#b91c1c;
  }
`;
const Hint = styled.div` color:#6b7280; font-size:12px; margin-top:4px; `;
// removed unused Badge
const SmallMuted = styled.span` color:#9ca3af; font-size:12px; `;
const HeaderText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;
const BulkDialogBody = styled.div`
  display: grid;
  gap: ${(p) => p.theme.spacing.sm};
  font-size: 14px;
  color: #334155;
`;
const BulkList = styled.div`
  display: grid;
  gap: ${(p) => p.theme.spacing.xs};
  max-height: 240px;
  overflow-y: auto;
  padding-right: 4px;
`;
const BulkItem = styled.label`
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: #f9fafb;
  font-size: 13px;
  color: #1f2937;
  &[data-disabled='true'] {
    opacity: 0.6;
  }
  input {
    width: 16px;
    height: 16px;
  }
  .name {
    font-weight: 600;
  }
  .status {
    font-size: 12px;
    color: #6b7280;
    text-align: right;
  }
`;
const BulkFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  font-size: 12px;
  color: #475569;
`;
// Buttons from common UI
const AlertError = styled.div` background:#fee2e2; color:#b91c1c; border:1px solid #fecaca; padding:10px 12px; border-radius:10px; font-size:13px; `;
const Muted = styled.div` color:#6b7280; font-size:12px; `;
const BackBtn = styled.button`
  ${buttonVariants.outline};
  height: 40px;
  padding: 0 16px;
  font-weight: 600;
  font-size: 14px;
`;
const leftIcon = (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>);

// Upload UX additions
const DropArea = styled.div`
  margin-top: 8px;
  border: 1px dashed #d1d5db;
  border-radius: 10px;
  padding: 10px;
  text-align: center;
  background: #f9fafb;
  color: #6b7280;
  font-size: 12px;
  .hint{ pointer-events: none; }
`;
const UploadQueue = styled.div`
  display: grid; gap: 8px; margin-top: 10px;
`;
const QueueItem = styled.div`
  border: 1px solid #e5e7eb; border-radius: 10px; padding: 8px; background: #fff; display: grid; gap: 6px;
  .meta{ display:flex; gap:8px; align-items:center; justify-content:space-between; }
  .name{ font-size:12px; color:#111827; flex:1; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; text-align:left; }
  .size{ font-size:11px; color:#9ca3af; }
  .status{ font-size:11px; color:#6b7280; }
  .bar{ height:6px; background:#f3f4f6; border-radius:999px; overflow:hidden; }
  .bar i{ display:block; height:100%; background:#a7f3d0; }
`;

// Grades head
const GradesHead = styled.div`
  display:flex; align-items:center; justify-content:space-between; margin: 8px 0;
  .meta{ display:inline-flex; gap:10px; color:#6b7280; font-size:12px; }
`;
const DotSep = styled.i` display:inline-block; width:4px; height:4px; border-radius:50%; background:#cbd5e1; `;

// Tabs like StudentDetail
const TabBar = styled.div` display:inline-flex; gap:6px; align-items:center; `;
const TabBtn = styled(UISmallBtn)`
  height: 40px; padding: 0 16px; font-size: 14px;
  &[data-active='true']{ background:#111827; color:#fff; border-color:#111827; }
`;
const DividerLine = styled.div` height:1px; background:#e5e7eb; margin:6px 0 8px; `;
const TopTabs = styled.div`
  position: sticky;
  top: 0;
  z-index: 22;
  background: ${(p) => p.theme.colors.surface};
  padding: 4px 0;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 6px;
`;

// Grades panel rows
const GradesPanel = styled.div`
  border: 1px solid #e5e7eb; border-radius: 10px; background: #fff; overflow: hidden;
`;
const GradeHeader = styled.div`
  display: grid; grid-template-columns: 1.6fr 1fr 1fr 2fr; gap: 8px;
  background: #f9fafb; border-bottom: 1px solid #e5e7eb;
  padding: 8px 10px; color: #6b7280; font-size: 12px; font-weight: 800;
`;
const GradeRow = styled.div`
  display: grid; grid-template-columns: 1.6fr 1fr 1fr 2fr; gap: 8px; align-items: center;
  padding: 8px 10px; border-top: 1px solid #f1f5f9;
`;
const ModeSeg = styled.div`
  display: inline-flex; border:1px solid #e5e7eb; border-radius: 8px; overflow: hidden;
`;
const ModeBtn = styled.button`
  height: 32px; padding: 0 10px; font-size: 12px; color: #374151; background: #fff; border: none; cursor: pointer;
  &[data-active='true']{ background:#111827; color:#fff; }
`;
const ValueInput = styled.input`
  height: 32px; padding: 0 10px; border: 1px solid #e5e7eb; border-radius: 8px; font-size: 12px; width: 90px;
`;
const ValueSelect = styled.select`
  height: 32px; padding: 0 10px; border: 1px solid #e5e7eb; border-radius: 8px; font-size: 12px; width: 90px; background:#fff;
`;
const EmptyHint = styled.div` padding: 12px; color:#6b7280; font-size: 13px; `;
