import { Page as PageWrap, SectionCard as SectionCard, PageHeader, PrimaryBtn } from "@/components/common/UI";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ClassesFilters from "@/components/classes/ClassesFilters";
import ClassesTable from "@/components/classes/ClassesTable";
import ClassesStats from "@/components/classes/ClassesStats";

export default function Classes() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initial = useMemo(() => ({
    status: (searchParams.get('status') as any) || "",
    q: searchParams.get('q') || "",
  }), []);
  const [filters, setFilters] = useState({ status: initial.status as "" | "IN_PROGRESS" | "STOPPED" | "PENDING", q: initial.q });
  const [refreshKey, setRefreshKey] = useState(0);
  useEffect(() => {
    function handleRefresh() { setRefreshKey(k => k + 1); }
    window.addEventListener('courses:refresh', handleRefresh);
    return () => window.removeEventListener('courses:refresh', handleRefresh);
  }, []);
  useEffect(() => {
    const sp = new URLSearchParams();
    if (filters.status) sp.set('status', filters.status);
    if (filters.q && filters.q.trim()) sp.set('q', filters.q.trim());
    setSearchParams(sp, { replace: true });
  }, [filters, setSearchParams]);
  return (
    <PageWrap>
      <PageHeader>
        <div>
          <h2>수업 관리</h2>
          <p>개설된 수업을 조회하고 빠르게 검색하세요.</p>
        </div>
        <div style={{ display:'inline-flex', alignItems:'center', gap:12 }}>
          <PrimaryBtn to="/classes/new">수업 추가</PrimaryBtn>
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
