import { Page, Card } from "../components/students/StudentsLayout";
import StudentsStats from "../components/students/StudentsStats";
import StudentsFilters from "../components/students/StudentsFilters";
import StudentsTable from "../components/students/StudentsTable";
import { useState } from "react";
import styled from "styled-components";

export default function Students() {
  const [filters, setFilters] = useState({
    status: "" as "" | "ENROLLED" | "ON_LEAVE" | "PENDING",
    from: "",
    to: "",
    ageMin: "",
    ageMax: "",
    q: "",
  });
  const [refreshKey, setRefreshKey] = useState(0);
  return (
    <Page>
      <Header>
        <div>
          <h2>원생 관리</h2>
          <p>등록된 원생들을 한눈에 확인해보세요!</p>
        </div>
      </Header>
      <StudentsStats />
      <Card>
        <StudentsFilters value={filters} onChange={setFilters} onApply={() => setRefreshKey((k) => k + 1)} />
      </Card>
      <StudentsTable filters={filters} refreshKey={refreshKey} />
    </Page>
  );
}

const Header = styled.div`
  display: grid; grid-template-columns: 1fr; gap: 6px; align-items: center; margin-bottom: 4px;
  h2 { margin: 0 0 2px; font-size: 22px; color: #0f172a; letter-spacing: -0.01em; }
  p { margin: 0; color: #6b7280; font-size: 13px; }
`;
// actions moved to table header
