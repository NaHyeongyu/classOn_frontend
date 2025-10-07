import { Page } from "@/components/students/StudentsLayout";
import StudentsStats from "@/components/students/StudentsStats";
import StudentsFilters from "@/components/students/StudentsFilters";
import StudentsTable from "@/components/students/StudentsTable";
import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import styled from "styled-components";
import { SectionCard as Section } from "@/components/common/UI";
import { useSearchParams } from "react-router-dom";
import { PageHeader, PrimaryBtn, GhostButton } from "@/components/common/UI";
import { downloadStudentsExcel, downloadStudentsTemplate, importStudentsExcel } from "@/api/students";
import { readableError } from "@/lib/errors";
import { useToast } from "@/components/common/Toast";
import ConfirmDialog from "@/components/common/ConfirmDialog";

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
  const [showImportGuide, setShowImportGuide] = useState(false);
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
    } catch (e) {
      showError(readableError(e, '엑셀 추출에 실패했습니다.'));
    }
  }

  async function handleTemplate() {
    try {
      const blob = await downloadStudentsTemplate();
      await saveBlobAsFile(blob, 'students_template.xlsx');
      success('템플릿을 다운로드했습니다.');
    } catch (e) {
      showError(readableError(e, '템플릿 다운로드에 실패했습니다.'));
    }
  }

  async function handleImport(ev: ChangeEvent<HTMLInputElement>) {
    const file = ev.target.files?.[0];
    if (!file) return;
    try {
      const res = await importStudentsExcel(file);
      show(`생성 ${res.created}, 수정 ${res.updated}, 건너뜀 ${res.skipped}`);
      setRefreshKey((k) => k + 1);
    } catch (e) {
      showError(readableError(e, '엑셀 업로드에 실패했습니다.'));
    } finally {
      ev.target.value = '';
    }
  }
  return (
    <Page>
      <StickyWrap>
        <StickyInner>
          <StickyHeader>
            <div>
              <h2>원생 관리</h2>
              <p>등록된 원생들을 한눈에 확인해보세요!</p>
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12 }}>
              <PrimaryBtn to="/students/new">원생 추가</PrimaryBtn>
              <GhostButton as="button" onClick={handleTemplate}>템플릿 다운</GhostButton>
              <GhostButton as="button" onClick={handleExport}>추출</GhostButton>
              <GhostButton as="button" onClick={() => setShowImportGuide(true)}>엑셀 업로드</GhostButton>
              <input ref={fileRef} type="file" accept=".xlsx,.xls" style={{ display:'none' }} onChange={handleImport} />
            </div>
          </StickyHeader>
          <StudentsStats />
          <FiltersCard>
            <StudentsFilters value={filters} onChange={setFilters} onApply={() => setRefreshKey((k) => k + 1)} />
          </FiltersCard>
        </StickyInner>
      </StickyWrap>
      <StudentsTable filters={filters} refreshKey={refreshKey} />
      <ConfirmDialog
        open={showImportGuide}
        title="엑셀 업로드 안내"
        message={(
          <GuideList>
            <li>템플릿 헤더 이름과 순서를 변경하지 말아주세요.</li>
            <li>필수 입력값: 이름 (빈 행은 자동으로 건너뜁니다).</li>
            <li>상태는 수강중/휴학/대기 중 하나만 입력하거나 비워두면 수강중으로 처리돼요.</li>
            <li>등록일·생년월일은 YYYY-MM-DD 형식을 사용하거나 엑셀 날짜 서식을 적용해주세요.</li>
            <li>연락처와 보호자 연락처는 0으로 시작할 수 있으니 텍스트 서식을 권장합니다.</li>
            <li>보호자 성함·보호자 연락처·주소는 선택 항목이며 필요 시에만 입력하세요.</li>
            <li>기존 원생은 이름과 연락처로 찾아 업데이트합니다. 연락처가 없으면 신규로 추가될 수 있습니다.</li>
          </GuideList>
        )}
        confirmLabel="업로드 진행"
        cancelLabel="취소"
        onCancel={() => setShowImportGuide(false)}
        onConfirm={() => {
          setShowImportGuide(false);
          setTimeout(() => fileRef.current?.click(), 0);
        }}
      />
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
  const statusParam = sp.get('status');
  const status: ""|"ENROLLED"|"ON_LEAVE"|"PENDING" =
    statusParam === 'ENROLLED' || statusParam === 'ON_LEAVE' || statusParam === 'PENDING'
      ? statusParam
      : '';
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

// Sticky header + stats + filters for Students page
const StickyWrap = styled.div`
  position: sticky;
  top: 0;
  z-index: 35; /* above table headers */
  background: ${({ theme }) => theme.colors.surface};
  /* remove bottom divider under sticky filter area */
  border-bottom: 0;
`;
const StickyInner = styled.div`
  display: grid;
  gap: 12px;
  padding: 8px 0 0;
`;
const StickyHeader = styled(PageHeader)`
  position: static;
  margin-bottom: 0;
  box-shadow: none;
`;

// Allow dropdown/datepickers to overflow above rounded card edges
const FiltersCard = styled(Section)`
  overflow: visible;
  position: relative;
  z-index: 36;
`;

const GuideList = styled.ul`
  margin: 0;
  padding-left: 18px;
  display: grid;
  gap: 6px;
  font-size: 14px;
  color: #374151;
  li { list-style: disc; }
`;
