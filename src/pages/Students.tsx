import { Page, Card } from "../components/students/StudentsLayout";
import StudentsStats from "../components/students/StudentsStats";
import StudentsFilters from "../components/students/StudentsFilters";
import StudentsTable from "../components/students/StudentsTable";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import styled from "styled-components";
import { PageHeader } from "../components/common/UI";

export default function Students() {
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
  // Sync filters -> URL
  useEffect(() => {
    const sp = filtersToParams(filters);
    setSearchParams(sp, { replace: true });
  }, [filters, setSearchParams]);
  return (
    <Page>
      <PageHeader>
        <div>
          <h2>원생 관리</h2>
          <p>등록된 원생들을 한눈에 확인해보세요!</p>
        </div>
        <div />
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
