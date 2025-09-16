import { jsxs as _jsxs, jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { SectionCard as Section, TitleH3 as Title, GhostBtn as UIGhostBtn, PrimaryBtn as UIPrimaryBtn } from "../components/common/UI";
import ConfirmDialog from "../components/common/ConfirmDialog";
import { KPI, UsersIcon, CheckIcon, ClassIcon, DeltaPill } from "../components/dashboard/KPI";
import { getCourse, listCourseRecords, listCourseStudents, updateCourseRecord, createCourseRecord, listRecordAttendance, upsertAttendance, listRecordAttachments, uploadRecordAttachments, deleteRecordAttachment, deleteCourseRecord } from "../api/courses";
import { invalidateCacheByPrefix } from "../lib/fetcher";
// KPIs removed from this view for a simpler layout
export default function CourseRecordDetail() {
    const navigate = useNavigate();
    const { id, recordId, ymd } = useParams();
    const courseId = useMemo(() => (id ? Number(id) : null), [id]);
    const recId = useMemo(() => (recordId ? Number(recordId) : null), [recordId]);
    const [course, setCourse] = useState(null);
    const [record, setRecord] = useState(null);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [saving, setSaving] = useState({});
    const [editingWhen, setEditingWhen] = useState(false);
    const [whenError, setWhenError] = useState(null);
    const [attVersion, setAttVersion] = useState(0);
    const [attMap, setAttMap] = useState({});
    const [attNoteMap, setAttNoteMap] = useState({});
    const noteTimersRef = useRef({});
    const [attLoading, setAttLoading] = useState(false);
    const [attError, setAttError] = useState(null);
    const [attSavingMap, setAttSavingMap] = useState({});
    // editable date/time
    const [editDate, setEditDate] = useState("");
    const [editStart, setEditStart] = useState("");
    const [editEnd, setEditEnd] = useState("");
    // attachments
    const [files, setFiles] = useState([]);
    const [filesLoading, setFilesLoading] = useState(false);
    const [filesError, setFilesError] = useState(null);
    const [fileBusy, setFileBusy] = useState({});
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const [confirmBusy, setConfirmBusy] = useState(false);
    // file size limit (MB)
    const MAX_FILE_SIZE_MB = 10;
    const MAX_FILE_SIZE = MAX_FILE_SIZE_MB * 1024 * 1024;
    // Right column shows attendance; content/files move to left below info
    useEffect(() => {
        if (!courseId)
            return;
        let cancelled = false;
        async function load() {
            setLoading(true);
            setError(null);
            try {
                const [c, recs, studs] = await Promise.all([
                    getCourse(courseId),
                    listCourseRecords(courseId),
                    listCourseStudents(courseId)
                ]);
                if (!cancelled) {
                    setCourse(c);
                    const byId = recs.find(r => r.id === recId || r.id === Number(ymd)) || null;
                    const byDate = ymd ? (recs.find(r => r.recordDate === ymd) || null) : null;
                    setRecord(byId || byDate || null);
                    setStudents(studs);
                }
            }
            catch (e) {
                if (!cancelled)
                    setError(e?.message || "수업 내역을 불러오지 못했습니다.");
            }
            finally {
                if (!cancelled)
                    setLoading(false);
            }
        }
        void load();
        return () => { cancelled = true; };
    }, [courseId, recId]);
    // initialize editable date/time when record loads
    useEffect(() => {
        if (!record && !course)
            return;
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
    // Attendance local storage (unified with CourseDetail)
    function getLocalAttendanceKey() {
        if (!courseId)
            return `attendance::`;
        if (recId)
            return `attendance:${courseId}:${recId}`;
        if (ymd)
            return `attendanceDate:${courseId}:${ymd}`;
        return `attendance:${courseId}:`;
    }
    const localAttMap = useMemo(() => {
        if (!courseId)
            return {};
        const key = getLocalAttendanceKey();
        try {
            return JSON.parse(localStorage.getItem(key) || '{}');
        }
        catch {
            return {};
        }
    }, [courseId, recId, ymd, attVersion]);
    const presentMap = useMemo(() => {
        // Prefer server map when record exists; fallback to local when not available
        if (record?.id)
            return attMap;
        return localAttMap;
    }, [attMap, localAttMap, record?.id]);
    function setAttendance(studentId, present) {
        if (!courseId)
            return;
        const key = getLocalAttendanceKey();
        const map = (() => { try {
            return JSON.parse(localStorage.getItem(key) || '{}');
        }
        catch {
            return {};
        } })();
        map[studentId] = present;
        try {
            localStorage.setItem(key, JSON.stringify(map));
        }
        catch { }
        setAttVersion(v => v + 1);
    }
    function clearAttendanceLocal(studentId) {
        if (!courseId)
            return;
        const key = getLocalAttendanceKey();
        const map = (() => { try {
            return JSON.parse(localStorage.getItem(key) || '{}');
        }
        catch {
            return {};
        } })();
        if (Object.prototype.hasOwnProperty.call(map, String(studentId)))
            delete map[String(studentId)];
        if (Object.prototype.hasOwnProperty.call(map, studentId))
            delete map[studentId];
        try {
            localStorage.setItem(key, JSON.stringify(map));
        }
        catch { }
        setAttVersion(v => v + 1);
    }
    const presentCount = useMemo(() => Object.values(presentMap).filter(Boolean).length, [presentMap]);
    const attendanceRate = useMemo(() => students.length ? Math.round((presentCount / students.length) * 100) : null, [presentCount, students.length]);
    const durationMin = useMemo(() => getDurationMinutes(record?.startTime || course?.startTime, record?.endTime || course?.endTime), [record?.startTime, record?.endTime, course?.startTime, course?.endTime]);
    // participation metrics removed
    const whenLabel = useMemo(() => {
        const date = record?.recordDate ? `${record.recordDate} (${"일월화수목금토"[new Date(record.recordDate).getDay()]})` : '-';
        const time = formatRange(record?.startTime || course?.startTime, record?.endTime || course?.endTime);
        return `${date} · ${time}`;
    }, [record?.recordDate, record?.startTime, record?.endTime, course?.startTime, course?.endTime]);
    // Load attendance from server when record id is available
    useEffect(() => {
        if (!courseId || !record?.id)
            return;
        let cancelled = false;
        async function loadAttendance() {
            setAttLoading(true);
            setAttError(null);
            try {
                const list = await listRecordAttendance(courseId, record.id);
                if (!cancelled) {
                    const m = {};
                    const notes = {};
                    list.forEach(a => { m[a.studentId] = !!a.present; if (a.reason)
                        notes[a.studentId] = a.reason; });
                    setAttMap(m);
                    setAttNoteMap(notes);
                }
            }
            catch (e) {
                if (!cancelled)
                    setAttError(e?.message || '출석 정보를 불러오지 못했습니다.');
            }
            finally {
                if (!cancelled)
                    setAttLoading(false);
            }
        }
        void loadAttendance();
        return () => { cancelled = true; };
    }, [courseId, record?.id]);
    async function confirmAndSetAttendance(studentId, target) {
        const sName = students.find(s => s.id === studentId)?.name || '학생';
        const label = target ? '출석' : '결석';
        const ok = window.confirm(`${sName}을(를) ${label} 처리하시겠어요?`);
        if (!ok)
            return;
        if (courseId && record?.id) {
            // Server update
            setAttSavingMap(m => ({ ...m, [studentId]: true }));
            try {
                const reason = attNoteMap[studentId]?.trim() || undefined;
                await upsertAttendance(courseId, record.id, studentId, { present: target, reason, source: 'MANUAL' });
                setAttMap(m => ({ ...m, [studentId]: target }));
                // Invalidate dashboard classes/summary caches to reflect latest attendance
                invalidateCacheByPrefix(['/api/calendar/classes', '/api/dashboard/summary']);
            }
            catch (e) {
                alert(e?.message || '출석 처리에 실패했습니다.');
            }
            finally {
                setAttSavingMap(m => ({ ...m, [studentId]: false }));
            }
        }
        else {
            // Local fallback
            setAttendance(studentId, target);
        }
    }
    // Load/save local notes when no server record
    useEffect(() => {
        if (!courseId || record?.id)
            return;
        const key = getLocalAttendanceKey().replace('attendance', 'attendanceNote');
        try {
            const parsed = JSON.parse(localStorage.getItem(key) || '{}');
            setAttNoteMap(parsed || {});
        }
        catch { }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [courseId, recId, ymd]);
    // Attachments helpers: server if record exists; otherwise local fallback keyed by date
    function localAttachKey() {
        if (!courseId)
            return `attachments::`;
        if (recId)
            return `attachments:${courseId}:${recId}`;
        if (ymd)
            return `attachmentsDate:${courseId}:${ymd}`;
        return `attachments:${courseId}:`;
    }
    function getLocalAttachments() {
        try {
            return JSON.parse(localStorage.getItem(localAttachKey()) || '[]');
        }
        catch {
            return [];
        }
    }
    function setLocalAttachments(list) {
        try {
            localStorage.setItem(localAttachKey(), JSON.stringify(list));
        }
        catch { }
    }
    useEffect(() => {
        if (!courseId)
            return;
        let cancelled = false;
        async function loadFiles() {
            setFilesError(null);
            if (record?.id) {
                setFilesLoading(true);
                try {
                    const list = await listRecordAttachments(courseId, record.id);
                    if (!cancelled)
                        setFiles(list);
                }
                catch (e) {
                    if (!cancelled)
                        setFilesError(e?.message || '첨부를 불러오지 못했습니다.');
                }
                finally {
                    if (!cancelled)
                        setFilesLoading(false);
                }
            }
            else {
                // local fallback
                const local = getLocalAttachments();
                setFiles(local.map((x, i) => ({ id: i, filename: x.name, size: x.size, createdAt: new Date().toISOString() })));
            }
        }
        void loadFiles();
        return () => { cancelled = true; };
    }, [courseId, record?.id, recId, ymd]);
    async function onUpload(filesList) {
        if (!filesList)
            return;
        // enforce size limit
        const all = Array.from(filesList);
        const accepted = all.filter(f => f.size <= MAX_FILE_SIZE);
        const rejected = all.filter(f => f.size > MAX_FILE_SIZE);
        if (rejected.length > 0) {
            setFilesError(`용량 제한(${MAX_FILE_SIZE_MB}MB)을 초과한 파일 제외: ${rejected.map(f => f.name).join(', ')}`);
        }
        else {
            setFilesError(null);
        }
        if (accepted.length === 0)
            return;
        if (courseId && record?.id) {
            try {
                const uploaded = await uploadRecordAttachments(courseId, record.id, accepted);
                setFiles(prev => [...uploaded, ...prev]);
            }
            catch (e) {
                alert(e?.message || '업로드에 실패했습니다.');
            }
        }
        else {
            // local
            const prev = getLocalAttachments();
            const next = [...prev, ...accepted.map(f => ({ name: f.name, size: f.size }))];
            setLocalAttachments(next);
            setFiles(next.map((x, i) => ({ id: i, filename: x.name, size: x.size, createdAt: new Date().toISOString() })));
        }
    }
    async function onDeleteFile(fileId, name) {
        const ok = window.confirm('이 파일을 삭제할까요?');
        if (!ok)
            return;
        if (courseId && record?.id) {
            setFileBusy(m => ({ ...m, [fileId]: true }));
            try {
                await deleteRecordAttachment(courseId, record.id, fileId);
                setFiles(prev => prev.filter(f => f.id !== fileId));
            }
            catch (e) {
                alert(e?.message || '삭제에 실패했습니다.');
            }
            finally {
                setFileBusy(m => ({ ...m, [fileId]: false }));
            }
        }
        else {
            const prev = getLocalAttachments();
            const next = prev.filter(x => x.name !== name);
            setLocalAttachments(next);
            setFiles(next.map((x, i) => ({ id: i, filename: x.name, size: x.size, createdAt: new Date().toISOString() })));
        }
    }
    // Create a text file from the content textarea and attach it
    async function createContentFile() {
        const el = document.getElementById('contentArea');
        if (!el) {
            alert('내용 입력 영역을 찾을 수 없습니다.');
            return;
        }
        const text = el.value || '';
        if (!text.trim()) {
            alert('수업 내용이 비어 있습니다.');
            return;
        }
        // Build filename: 수업내용_YYYY-MM-DD.txt
        const dateLabel = (record?.recordDate || ymd || new Date().toISOString().slice(0, 10));
        const filename = `수업내용_${dateLabel}.txt`;
        try {
            // Size check for generated content file
            const previewBlob = new Blob([text], { type: 'text/plain;charset=utf-8' });
            if (previewBlob.size > MAX_FILE_SIZE) {
                alert(`내용이 너무 큽니다. 최대 ${MAX_FILE_SIZE_MB}MB 까지만 첨부할 수 있습니다.`);
                return;
            }
            if (courseId && record?.id) {
                const file = new File([text], filename, { type: 'text/plain;charset=utf-8' });
                const uploaded = await uploadRecordAttachments(courseId, record.id, [file]);
                setFiles(prev => [...uploaded, ...prev]);
            }
            else {
                // local fallback (no server record)
                const blob = previewBlob;
                const prev = getLocalAttachments();
                const next = [{ name: filename, size: blob.size }, ...prev];
                setLocalAttachments(next);
                setFiles(next.map((x, i) => ({ id: i, filename: x.name, size: x.size, createdAt: new Date().toISOString() })));
            }
            alert('내용 파일을 생성하여 첨부했습니다.');
        }
        catch (e) {
            alert(e?.message || '파일 생성에 실패했습니다.');
        }
    }
    // Save helpers
    async function saveField(patch, key) {
        if (!courseId || !record?.id)
            return;
        setSaving(s => ({ ...s, [key]: true }));
        try {
            const updated = await updateCourseRecord(courseId, record.id, patch);
            setRecord(updated);
            // Reflect updated record immediately in dashboard classes
            invalidateCacheByPrefix('/api/calendar/classes');
        }
        catch (e) {
            alert(e?.message || '저장에 실패했습니다.');
        }
        finally {
            setSaving(s => ({ ...s, [key]: false }));
        }
    }
    function toHHMM(t) { if (!t)
        return ''; const [h, m] = t.split(':'); return `${h}:${m}`; }
    function toHHMMSS(t) {
        if (!t)
            return undefined;
        const parts = t.split(':');
        if (parts.length >= 3)
            return `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}:${parts[2].padStart(2, '0')}`;
        if (parts.length === 2)
            return `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}:00`;
        return undefined;
    }
    async function saveWhen() {
        if (!courseId)
            return;
        const payload = { recordDate: editDate || (ymd || ''), startTime: toHHMMSS(editStart), endTime: toHHMMSS(editEnd) };
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
        }
        catch (e) {
            const msg = String(e?.message || '');
            if (msg.includes('HTTP 409'))
                setWhenError('이미 등록된 수업이 있습니다.');
            else
                setWhenError('기록 생성에 실패했습니다.');
        }
        finally {
            setSaving(s => ({ ...s, when: false }));
        }
    }
    return (_jsxs(Wrap, { children: [_jsxs(Head, { children: [_jsxs(BackBtn, { type: "button", onClick: () => navigate(`/classes/${courseId}`), children: [leftIcon, " \uB4A4\uB85C"] }), _jsxs(HeadTitle, { children: [_jsx("h2", { style: { margin: 0 }, children: course?.title || '수업 내역 상세' }), _jsx(SmallMuted, { children: whenLabel })] }), _jsxs(HeadRight, { children: [_jsx(UIGhostBtn, { to: `/classes/${courseId}`, title: "\uC218\uC5C5\uC73C\uB85C", children: "\uC218\uC5C5\uC73C\uB85C" }), _jsx(UIPrimaryBtn, { to: `/classes/${courseId}/history`, title: "\uC218\uC5C5 \uB0B4\uC5ED", children: "\uC218\uC5C5 \uB0B4\uC5ED" }), record?.id && (_jsx(UIGhostBtn, { as: "button", onClick: () => setConfirmDeleteOpen(true), children: "\uC0AD\uC81C" }))] })] }), _jsx(ConfirmDialog, { open: confirmDeleteOpen, title: "\uC218\uC5C5 \uB0B4\uC5ED \uC0AD\uC81C", message: "이 수업 내역을 삭제할까요?\n첨부/출결/파일도 함께 삭제됩니다. 되돌릴 수 없습니다.", confirmLabel: "\uC601\uAD6C \uC0AD\uC81C", cancelLabel: "\uCDE8\uC18C", tone: "danger", busy: confirmBusy, onCancel: () => { if (!confirmBusy)
                    setConfirmDeleteOpen(false); }, onConfirm: async () => {
                    if (!courseId || !record?.id)
                        return;
                    setConfirmBusy(true);
                    try {
                        await deleteCourseRecord(courseId, record.id);
                        invalidateCacheByPrefix('/api/calendar/classes');
                        setConfirmDeleteOpen(false);
                        navigate(`/classes/${courseId}/history`);
                    }
                    catch (e) {
                        alert(e?.message || '삭제에 실패했습니다.');
                    }
                    finally {
                        setConfirmBusy(false);
                    }
                } }), error && _jsx(AlertError, { children: error }), loading && _jsx(Muted, { children: "\uBD88\uB7EC\uC624\uB294 \uC911..." }), _jsxs(KPIGrid, { children: [_jsx(KPI, { title: "\uCC38\uC11D", icon: _jsx(UsersIcon, {}), iconAccent: "indigo", value: _jsxs(_Fragment, { children: [presentCount, "\uBA85"] }), footerLeft: _jsxs("span", { children: ["\uCD1D ", students.length, "\uBA85"] }) }), _jsx(KPI, { title: "\uCD9C\uC11D\uB960", icon: _jsx(CheckIcon, {}), iconAccent: "green", value: _jsx(_Fragment, { children: attendanceRate != null ? `${attendanceRate}%` : '—' }), footerLeft: _jsx(DeltaPill, { "$tone": attendanceRate != null && attendanceRate >= 75 ? 'positive' : attendanceRate != null && attendanceRate < 50 ? 'negative' : 'neutral', children: attendanceRate != null ? `${attendanceRate}%` : '—' }) }), _jsx(KPI, { title: "\uC218\uC5C5 \uC2DC\uAC04", icon: _jsx(ClassIcon, {}), iconAccent: "violet", value: _jsx(_Fragment, { children: durationMin != null ? `${durationMin}분` : '—' }), footerLeft: _jsx("span", { children: formatRange(record?.startTime || course?.startTime, record?.endTime || course?.endTime) || '-' }) }), _jsx(KPI, { title: "\uC77C\uC790", icon: _jsx(ClassIcon, {}), iconAccent: "emerald", value: _jsx(_Fragment, { children: record?.recordDate || ymd || '—' }) })] }), _jsxs(Columns, { children: [_jsxs(Left, { children: [_jsxs(Section, { children: [_jsxs(SectionHeader, { children: [_jsx(Title, { children: "\uC218\uC5C5 \uC815\uBCF4" }), !editingWhen ? (_jsx(SmallBtn, { onClick: () => setEditingWhen(true), children: "\uC218\uC815" })) : (_jsxs("div", { style: { display: 'inline-flex', gap: 8, alignItems: 'center' }, children: [_jsx(SmallBtn, { onClick: () => { void saveWhen(); }, disabled: !!saving.when, children: "\uC800\uC7A5" }), _jsx(SmallBtn, { onClick: () => { setEditingWhen(false); setEditDate(record?.recordDate || ymd || ''); setEditStart(toHHMM(record?.startTime || course?.startTime || '')); setEditEnd(toHHMM(record?.endTime || course?.endTime || '')); }, children: "\uCDE8\uC18C" })] }))] }), !editingWhen ? (_jsxs(InfoList, { children: [_jsxs("li", { children: [_jsx(Label, { children: "\uC218\uC5C5\uC77C" }), _jsx(Value, { children: record?.recordDate || '-' })] }), _jsxs("li", { children: [_jsx(Label, { children: "\uC218\uC5C5\uC2DC\uAC04" }), _jsx(Value, { children: formatRange(record?.startTime || course?.startTime, record?.endTime || course?.endTime) || '-' })] })] })) : (_jsxs(InfoList, { children: [_jsxs("li", { children: [_jsx(Label, { children: "\uB0A0\uC9DC" }), _jsx(Value, { children: _jsx(Input, { type: "date", value: editDate || '', onChange: (e) => setEditDate(e.currentTarget.value) }) })] }), _jsxs("li", { children: [_jsx(Label, { children: "\uC2DC\uAC04" }), _jsxs(Value, { style: { display: 'flex', alignItems: 'center', gap: 6 }, children: [_jsx(Input, { type: "time", step: 300, value: editStart || '', onChange: (e) => setEditStart(e.currentTarget.value) }), _jsx("span", { children: "~" }), _jsx(Input, { type: "time", step: 300, value: editEnd || '', onChange: (e) => setEditEnd(e.currentTarget.value) })] })] }), _jsxs(RowHelp, { children: [!record?.id && _jsx(Hint, { children: "\uC800\uC7A5 \uC2DC \uC0C8 \uC218\uC5C5 \uB0B4\uC5ED\uC744 \uC0DD\uC131\uD569\uB2C8\uB2E4." }), saving.when && _jsx(SmallMuted, { children: "\uC800\uC7A5 \uC911..." }), whenError && _jsx(AlertError, { style: { marginLeft: 8 }, children: whenError })] })] }))] }), _jsxs(Section, { children: [_jsxs(SectionHeader, { children: [_jsx(Title, { children: "\uC218\uC5C5 \uB0B4\uC6A9" }), record?.id ? (_jsxs("div", { style: { display: 'inline-flex', gap: 8, alignItems: 'center' }, children: [_jsx(SmallBtn, { onClick: () => {
                                                            const el = document.getElementById('contentArea');
                                                            if (el)
                                                                void saveField({ content: el.value }, 'content');
                                                        }, disabled: !!saving.content, children: "\uC800\uC7A5" }), _jsx(SmallBtn, { onClick: () => void createContentFile(), children: "\uB0B4\uC6A9 \uD30C\uC77C \uC0DD\uC131" }), saving.content && _jsx(SmallMuted, { children: "\uC800\uC7A5 \uC911..." })] })) : null] }), record?.id ? (_jsx(TextArea, { rows: 8, defaultValue: record?.content || '', placeholder: "\uC218\uC5C5 \uB0B4\uC6A9\uC744 \uC785\uB825\uD558\uC138\uC694", id: "contentArea" })) : (_jsx(Muted, { children: "\uC11C\uBC84 \uAE30\uB85D\uC774 \uC5C6\uB294 \uC77C\uC815\uC785\uB2C8\uB2E4. \uC0DD\uC131 \uD6C4 \uD3B8\uC9D1 \uAC00\uB2A5\uD569\uB2C8\uB2E4." }))] }), _jsxs(Section, { children: [_jsxs(SectionHeader, { children: [_jsx(Title, { children: "\uC218\uC5C5 \uD30C\uC77C" }), _jsxs("label", { style: { display: 'inline-flex', alignItems: 'center', gap: 8 }, children: [_jsx(SmallBtn, { as: "span", children: "\uD30C\uC77C \uCD94\uAC00" }), _jsx("input", { type: "file", multiple: true, style: { display: 'none' }, onChange: (e) => onUpload(e.currentTarget.files) })] })] }), filesError && _jsx(AlertError, { children: filesError }), filesLoading && _jsx(Muted, { children: "\uBD88\uB7EC\uC624\uB294 \uC911..." }), _jsx(AttachList, { children: files.length === 0 ? (_jsx(SmallMuted, { children: "\uCCA8\uBD80 \uC5C6\uC74C" })) : (files.map(f => (_jsxs(AttachRow, { children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 8 }, children: [_jsx("span", { children: f.filename || f.name }), _jsxs(SmallMuted, { children: ["(", Math.round(f.size / 1024), " KB)"] })] }), _jsx(SmallBtn, { "data-variant": 'danger', disabled: !!fileBusy[f.id], onClick: () => void onDeleteFile(f.id, f.filename || f.name), children: "\uC0AD\uC81C" })] }, f.id)))) }), !record?.id && _jsx(Hint, { children: "\uC11C\uBC84 \uAE30\uB85D\uC774 \uC5C6\uC5B4 \uB85C\uCEEC\uC5D0\uB9CC \uC800\uC7A5\uB429\uB2C8\uB2E4." }), _jsxs(Hint, { children: ["\uD30C\uC77C \uD06C\uAE30 \uC81C\uD55C: \uCD5C\uB300 ", MAX_FILE_SIZE_MB, "MB"] })] })] }), _jsx(Right, { children: _jsxs(Section, { children: [_jsx(Title, { children: "\uCD9C\uACB0 \uD604\uD669" }), _jsx(Muted, { children: "\uD559\uC0DD\uBCC4 \uCD9C\uC11D \uC0C1\uD0DC\uB97C \uC218\uB3D9\uC73C\uB85C \uCC98\uB9AC\uD558\uC138\uC694. \uBCC0\uACBD \uC2DC \uD655\uC778 \uCC3D\uC774 \uD45C\uC2DC\uB429\uB2C8\uB2E4." }), !record?.id && _jsx(Hint, { children: "\uC11C\uBC84 \uAE30\uB85D\uC774 \uC5C6\uC5B4 \uCD9C\uC11D \uC815\uBCF4\uAC00 \uB85C\uCEEC\uC5D0\uB9CC \uC800\uC7A5\uB429\uB2C8\uB2E4." }), attLoading && _jsx(Muted, { children: "\uCD9C\uC11D \uBD88\uB7EC\uC624\uB294 \uC911..." }), attError && _jsx(AlertError, { children: attError }), _jsx(List, { children: students.map(s => {
                                        const has = Object.prototype.hasOwnProperty.call(presentMap, s.id);
                                        const present = has ? !!presentMap[s.id] : null;
                                        const status = has ? (present ? 'present' : 'absent') : 'none';
                                        return (_jsxs(Item, { children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center' }, children: [_jsx("strong", { children: s.name }), _jsx(Processed, { "data-type": status, children: status === 'present' ? '출석' : status === 'absent' ? '결석' : '미처리' })] }), _jsxs(RowRight, { children: [_jsx(NoteInput, { placeholder: "\uBA54\uBAA8", value: attNoteMap[s.id] || '', onChange: (e) => {
                                                                const v = e.currentTarget.value;
                                                                setAttNoteMap(prev => ({ ...prev, [s.id]: v }));
                                                                // Persist locally for fallback
                                                                if (courseId) {
                                                                    const key = getLocalAttendanceKey().replace('attendance', 'attendanceNote');
                                                                    try {
                                                                        const obj = JSON.parse(localStorage.getItem(key) || '{}');
                                                                        obj[String(s.id)] = v;
                                                                        localStorage.setItem(key, JSON.stringify(obj));
                                                                    }
                                                                    catch { }
                                                                }
                                                                // Auto-save to server (debounced) when server record exists and this student already has an attendance row
                                                                if (courseId && record?.id && has) {
                                                                    const timers = noteTimersRef.current;
                                                                    if (timers[s.id])
                                                                        window.clearTimeout(timers[s.id]);
                                                                    timers[s.id] = window.setTimeout(async () => {
                                                                        setAttSavingMap(m => ({ ...m, [s.id]: true }));
                                                                        try {
                                                                            const reason = (v || '').trim() || undefined;
                                                                            await upsertAttendance(courseId, record.id, s.id, { present: present === true, reason, source: 'MANUAL' });
                                                                        }
                                                                        catch (err) {
                                                                            console.error('메모 자동 저장 실패', err);
                                                                        }
                                                                        finally {
                                                                            setAttSavingMap(m => ({ ...m, [s.id]: false }));
                                                                        }
                                                                    }, 600);
                                                                }
                                                            } }), _jsxs(AttSeg, { children: [_jsx(AttBtn, { "data-active": String(present === true), onClick: () => { if (present !== true && !attSavingMap[s.id])
                                                                        void confirmAndSetAttendance(s.id, true); }, disabled: !!attSavingMap[s.id], children: "\uCD9C\uC11D" }), _jsx(AttBtn, { "data-variant": "danger", "data-active": String(has && present === false), onClick: () => { if (present !== false && !attSavingMap[s.id])
                                                                        void confirmAndSetAttendance(s.id, false); }, disabled: !!attSavingMap[s.id], children: "\uACB0\uC11D" })] }), _jsx(SmallBtn, { title: record?.id ? '서버 기록은 미처리로 되돌릴 수 없습니다.' : '미처리로 초기화', onClick: () => { if (!record?.id)
                                                                clearAttendanceLocal(s.id); }, disabled: !!record?.id, children: "\uBBF8\uCC98\uB9AC" }), attSavingMap[s.id] && _jsx(SmallMuted, { children: "\uC800\uC7A5 \uC911..." })] })] }, s.id));
                                    }) })] }) })] })] }));
}
function hhmm(t) { if (!t)
    return ''; const [h, m] = t.split(':'); return `${h}:${m}`; }
function formatRange(s, e) { return s && e ? `${hhmm(s)} ~ ${hhmm(e)}` : ''; }
function getDurationMinutes(s, e) {
    if (!s || !e)
        return null;
    const [sh, sm] = s.split(':'), [eh, em] = e.split(':');
    const start = Number(sh) * 60 + Number(sm);
    const end = Number(eh) * 60 + Number(em);
    const diff = end - start;
    return diff >= 0 ? diff : (diff + 24 * 60);
}
const Wrap = styled.div ` display:grid; gap:12px; `;
const Head = styled.div ` display:grid; grid-template-columns:auto 1fr auto; gap:12px; align-items:center; `;
const HeadRight = styled.div ` display:inline-flex; gap:8px; `;
const HeadTitle = styled.div ` display:flex; align-items:baseline; gap:12px; `;
const Sub = styled.div ` color:#6b7280; font-size:12px; margin-top:-8px; `;
const KPIGrid = styled.div ` display:grid; grid-template-columns: repeat(12, minmax(0, 1fr)); gap:12px; `;
const Columns = styled.div `
  display:flex; gap:12px; align-items:flex-start;
  @media (max-width: 1024px) { flex-direction: column; }
`;
const Left = styled.div ` flex: 5 1 0; display:grid; gap:12px; align-content:flex-start; `;
const Right = styled.div ` flex: 7 1 0; display:grid; gap:12px; align-content:flex-start; `;
// removed segmented tabs; simple two-column layout
const SectionHeader = styled.div ` display:flex; align-items:center; justify-content:space-between; margin-bottom:8px; `;
// Section, Title from common UI
const InfoList = styled.ul `
  list-style:none; padding:0; margin:0; display:grid; gap:10px;
  li { display:grid; grid-template-columns: 110px 1fr; align-items:center; }
`;
const Label = styled.span ` color:#6b7280; font-size:12px; font-weight:700; `;
const Value = styled.span ` color:#111827; font-size:14px; `;
const Input = styled.input ` height:32px; padding:0 10px; border:1px solid #e5e7eb; border-radius:8px; font-size:13px; `;
const RowHelp = styled.div ` grid-column: 1 / -1; display:flex; gap:8px; align-items:center; margin-top:2px; `;
const List = styled.div ` display:grid; gap:8px; `;
const Item = styled.div ` display:flex; align-items:center; justify-content:space-between; padding:10px; border:1px solid #f1f5f9; border-radius:10px; background:#f9fafb; `;
const RowRight = styled.div ` display:flex; align-items:center; gap:8px; `;
const NoteInput = styled.input ` height:28px; width: 180px; padding:0 8px; border:1px solid #e5e7eb; border-radius:8px; font-size:12px; background:#fff; `;
const AttSeg = styled.div ` display:inline-flex; gap:6px; `;
const AttBtn = styled.button `
  height:28px; padding:0 12px; border-radius:8px; border:1px solid #e5e7eb; background:#fff; color:#111827; font-size:12px; font-weight:800;
  &[data-active='true']{ background:#ecfdf5; color:#065f46; border-color:#a7f3d0; }
  &[data-variant='danger']{ background:#fff; color:#b91c1c; }
  &[data-variant='danger'][data-active='true']{ background:#fee2e2; color:#7f1d1d; border-color:#fecaca; }
  &:disabled{ opacity:0.6; cursor:not-allowed; }
`;
const Processed = styled.span `
  margin-left:8px; padding:2px 6px; border-radius:999px; font-size:11px; font-weight:700; border:1px solid #e5e7eb; color:#374151; background:#f3f4f6;
  &[data-type='present']{ background:#ecfdf5; color:#065f46; border-color:#a7f3d0; }
  &[data-type='absent']{ background:#fee2e2; color:#7f1d1d; border-color:#fecaca; }
  &[data-type='none']{ background:#f3f4f6; color:#6b7280; border-color:#e5e7eb; }
`;
// removed unused BlockTitle
const TextArea = styled.textarea ` width:100%; border:1px solid #e5e7eb; border-radius:10px; padding:8px 10px; font-size:14px; `;
const AttachList = styled.div ` display:grid; gap:6px; margin-top:6px; `;
const AttachRow = styled.div ` display:flex; align-items:center; justify-content:space-between; padding:6px 8px; border:1px solid #f1f5f9; border-radius:8px; `;
const SmallBtn = styled.button `
  height:28px; padding:0 10px; border-radius:8px; border:1px solid #e5e7eb; background:#fff; color:#111827; font-size:12px;
  &[data-variant='danger']{ border-color:#fecaca; color:#b91c1c; background:#fff; }
`;
const Hint = styled.div ` color:#6b7280; font-size:12px; margin-top:4px; `;
// removed unused Badge
const SmallMuted = styled.span ` color:#9ca3af; font-size:12px; `;
// Buttons from common UI
const AlertError = styled.div ` background:#fee2e2; color:#b91c1c; border:1px solid #fecaca; padding:10px 12px; border-radius:10px; font-size:13px; `;
const Muted = styled.div ` color:#6b7280; font-size:12px; `;
const BackBtn = styled.button ` height:32px; padding:0 10px; border-radius:8px; border:1px solid #e5e7eb; background:#fff; color:#111827; font-weight:800; font-size:12px; display:inline-flex; align-items:center; gap:6px; `;
const leftIcon = (_jsx("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: _jsx("polyline", { points: "15 18 9 12 15 6" }) }));
