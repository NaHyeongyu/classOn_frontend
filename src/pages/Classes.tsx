import { Page as PageWrap, SectionCard as SectionCard, PageHeader, PrimaryBtn, GhostButtonSmall, GhostButton } from "@/components/common/UI";
import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import { useSearchParams } from "react-router-dom";
import ClassesFilters from "@/components/classes/ClassesFilters";
import ClassesTable from "@/components/classes/ClassesTable";
import ClassesStats from "@/components/classes/ClassesStats";
import { downloadCoursesExcel, downloadCoursesTemplate, importCoursesExcel } from "@/api/courses";
import { useToast } from "@/components/common/Toast";

export default function Classes() {
  const { show, success, error: showError } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const initial = useMemo(() => ({
    status: (searchParams.get('status') as any) || "",
    q: searchParams.get('q') || "",
  }), []);
  const [filters, setFilters] = useState({ status: initial.status as "" | "IN_PROGRESS" | "STOPPED" | "PENDING", q: initial.q });
  const [refreshKey, setRefreshKey] = useState(0);
  const fileRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    const sp = new URLSearchParams();
    if (filters.status) sp.set('status', filters.status);
    if (filters.q && filters.q.trim()) sp.set('q', filters.q.trim());
    setSearchParams(sp, { replace: true });
  }, [filters, setSearchParams]);

  async function handleExport() {
    try {
      const blob = await downloadCoursesExcel({
        status: filters.status || undefined,
        q: filters.q || undefined,
      });
      await saveBlobAsFile(blob, 'courses.xlsx');
      success('엑셀 추출이 완료되었습니다.');
    } catch (e: any) {
      showError(e?.message || '엑셀 추출에 실패했습니다.');
    }
  }

  async function handleTemplate() {
    try {
      const blob = await downloadCoursesTemplate();
      await saveBlobAsFile(blob, 'courses_template.xlsx');
      success('템플릿을 다운로드했습니다.');
    } catch (e: any) {
      showError(e?.message || '템플릿 다운로드에 실패했습니다.');
    }
  }

  async function handleImport(ev: ChangeEvent<HTMLInputElement>) {
    const file = ev.target.files?.[0];
    if (!file) return;
    try {
      const res = await importCoursesExcel(file);
      show(`생성 ${res.created}, 수정 ${res.updated}, 건너뜀 ${res.skipped}`);
      setRefreshKey((k) => k + 1);
    } catch (e: any) {
      showError(e?.message || '엑셀 업로드에 실패했습니다.');
    } finally {
      ev.target.value = '';
    }
  }
  return (
    <PageWrap>
      <PageHeader>
        <div>
          <h2>수업 관리</h2>
          <p>개설된 수업을 조회하고 빠르게 검색하세요.</p>
        </div>
        <div style={{ display:'inline-flex', alignItems:'center', gap:12 }}>
          <PrimaryBtn to="/classes/new">수업 추가</PrimaryBtn>
          <GhostButtonSmall as="button" onClick={handleTemplate}>템플릿 다운</GhostButtonSmall>
          <GhostButtonSmall as="button" onClick={handleExport}>추출</GhostButtonSmall>
          <GhostButton as="button" onClick={() => fileRef.current?.click()}>엑셀 업로드</GhostButton>
          <input ref={fileRef} type="file" accept=".xlsx,.xls" style={{ display:'none' }} onChange={handleImport} />
        </div>
      </PageHeader>
      <ClassesStats />
      <SectionCard>
        <ClassesFilters value={filters} onChange={setFilters} onApply={() => setRefreshKey(k => k + 1)} />
      </SectionCard>
      <ClassesTable filters={filters} refreshKey={refreshKey} />
    </PageWrap>
  );
}

async function saveBlobAsFile(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
}

//

// Filter card provided by common UI
// Actions now live in table header for consistency with Students
