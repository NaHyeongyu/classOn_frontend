import { Page, Card } from "@/components/students/StudentsLayout";
import StudentsStats from "@/components/students/StudentsStats";
import StudentsFilters from "@/components/students/StudentsFilters";
import StudentsTable from "@/components/students/StudentsTable";
import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import { useSearchParams } from "react-router-dom";
import { PageHeader, PrimaryBtn, GhostButtonSmall, GhostButton } from "@/components/common/UI";
import { downloadStudentsExcel, downloadStudentsTemplate, importStudentsExcel } from "@/api/students";
import { useToast } from "@/components/common/Toast";

export default function Students() {
  const { show, success, error: showError } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const initial = useMemo(() => ({
    status: "" as "" | "ENROLLED" | "ON_LEAVE" | "PENDING",
    from: "",
    to: "",
    ageMin: "",
    ageMax: "",
    q: "",
    ...paramToFilters(searchParams),
  }), []);
  const [filters, setFilters] = useState(initial);
  const [refreshKey, setRefreshKey] = useState(0);
  const fileRef = useRef<HTMLInputElement | null>(null);
  // Sync filters -> URL
  useEffect(() => {
    const sp = filtersToParams(filters);
    setSearchParams(sp, { replace: true });
  }, [filters, setSearchParams]);

  async function handleExport() {
    try {
      const blob = await downloadStudentsExcel({
        status: filters.status || undefined,
        q: filters.q || undefined,
        from: filters.from || undefined,
        to: filters.to || undefined,
        ageMin: filters.ageMin ? Number(filters.ageMin) : undefined,
        ageMax: filters.ageMax ? Number(filters.ageMax) : undefined,
      });
      await saveBlobAsFile(blob, 'students.xlsx');
      success('엑셀 추출이 완료되었습니다.');
    } catch (e: any) {
      showError(e?.message || '엑셀 추출에 실패했습니다.');
    }
  }

  async function handleTemplate() {
    try {
      const blob = await downloadStudentsTemplate();
      await saveBlobAsFile(blob, 'students_template.xlsx');
      success('템플릿을 다운로드했습니다.');
    } catch (e: any) {
      showError(e?.message || '템플릿 다운로드에 실패했습니다.');
    }
  }

  async function handleImport(ev: ChangeEvent<HTMLInputElement>) {
    const file = ev.target.files?.[0];
    if (!file) return;
    try {
      const res = await importStudentsExcel(file);
      show(`생성 ${res.created}, 수정 ${res.updated}, 건너뜀 ${res.skipped}`);
      setRefreshKey((k) => k + 1);
    } catch (e: any) {
      showError(e?.message || '엑셀 업로드에 실패했습니다.');
    } finally {
      ev.target.value = '';
    }
  }
  return (
    <Page>
      <PageHeader>
        <div>
          <h2>원생 관리</h2>
          <p>등록된 원생들을 한눈에 확인해보세요!</p>
        </div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12 }}>
          <PrimaryBtn to="/students/new">원생 추가</PrimaryBtn>
          <GhostButtonSmall as="button" onClick={handleTemplate}>템플릿 다운</GhostButtonSmall>
          <GhostButtonSmall as="button" onClick={handleExport}>추출</GhostButtonSmall>
          <GhostButton as="button" onClick={() => fileRef.current?.click()}>엑셀 업로드</GhostButton>
          <input ref={fileRef} type="file" accept=".xlsx,.xls" style={{ display:'none' }} onChange={handleImport} />
        </div>
      </PageHeader>
      <StudentsStats />
      <Card>
        <StudentsFilters value={filters} onChange={setFilters} onApply={() => setRefreshKey((k) => k + 1)} />
      </Card>
      <StudentsTable filters={filters} refreshKey={refreshKey} />
    </Page>
  );
}

// PageHeader imported from common UI
// actions moved to table header

function filtersToParams(f: { status: ""|"ENROLLED"|"ON_LEAVE"|"PENDING"; from: string; to: string; ageMin: string; ageMax: string; q: string; }) {
  const sp = new URLSearchParams();
  if (f.status) sp.set('status', f.status);
  if (f.from) sp.set('from', f.from);
  if (f.to) sp.set('to', f.to);
  if (f.ageMin) sp.set('ageMin', f.ageMin);
  if (f.ageMax) sp.set('ageMax', f.ageMax);
  if (f.q && f.q.trim()) sp.set('q', f.q.trim());
  return sp;
}

function paramToFilters(sp: URLSearchParams) {
  const status = sp.get('status') as any || '';
  const from = sp.get('from') || '';
  const to = sp.get('to') || '';
  const ageMin = sp.get('ageMin') || '';
  const ageMax = sp.get('ageMax') || '';
  const q = sp.get('q') || '';
  return { status, from, to, ageMin, ageMax, q };
}

async function saveBlobAsFile(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
}
