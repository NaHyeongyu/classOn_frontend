import styled from "styled-components";
import { Page as PageWrap, SectionCard as SectionCard } from "../components/common/UI";
import { useState } from "react";
import ClassesFilters from "../components/classes/ClassesFilters";
import ClassesTable from "../components/classes/ClassesTable";
import ClassesStats from "../components/classes/ClassesStats";

export default function Classes() {
  const [filters, setFilters] = useState({ status: "" as "" | "IN_PROGRESS" | "STOPPED" | "PENDING", q: "" });
  const [refreshKey, setRefreshKey] = useState(0);
  return (
    <PageWrap>
      <Head>
        <div>
          <h2>수업 관리</h2>
          <p>개설된 수업을 조회하고 빠르게 검색하세요.</p>
        </div>
      </Head>
      <ClassesStats />
      <SectionCard>
        <ClassesFilters value={filters} onChange={setFilters} onApply={() => setRefreshKey(k => k + 1)} />
      </SectionCard>
      <ClassesTable filters={filters} refreshKey={refreshKey} />
    </PageWrap>
  );
}

// Page wrapper provided by common UI
const Head = styled.div`
  display: grid; grid-template-columns: 1fr; gap: 6px; align-items: center;
  h2 { margin: 0; font-size: 22px; color: #0f172a; letter-spacing: -0.01em; }
  p { margin: 0; color: #6b7280; font-size: 13px; }
`;
// Filter card provided by common UI
// Actions now live in table header for consistency with Students
