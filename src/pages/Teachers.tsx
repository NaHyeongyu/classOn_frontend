import { useEffect, useState } from "react";
import styled from "styled-components";
import { apiGetPlanUsage, type PlanUsage } from "@/api/account";
import { useMyAcademyPage } from "@/features/myAcademy/hooks/useMyAcademyPage";
import { useNavigate } from "react-router-dom";
import { routes } from "@/routes";
import { TeacherCreateModal } from "@/components/myAcademy/TeacherCreateModal";
import { Page, PageHeader, SectionCard, Scroller, TableBase as Table, PrimaryButton, GhostBtnSmall, EmptyState } from "@/components/common/UI";
import { formatKoreanDate } from "@/lib/format";

export default function Teachers() {
  const state = useMyAcademyPage();
  const { teachers, academy } = state;
  const navigate = useNavigate();

  const isFree = academy.isFreePlan;
  const [planUsage, setPlanUsage] = useState<PlanUsage | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const usage = await apiGetPlanUsage();
        if (!cancelled) setPlanUsage(usage);
      } catch {
        if (!cancelled) setPlanUsage(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [academy.data?.id]);

  const teacherLimitValue = planUsage?.teacherLimit;
  const teacherLimitLabel = planUsage ? (teacherLimitValue == null ? "무제한" : String(teacherLimitValue)) : "—";
  const teacherReached = teacherLimitValue != null && teachers.teachers.length >= teacherLimitValue;

  if (isFree) {
    return (
      <Page>
        <PageHeader>
          <div>
            <h2>강사관리</h2>
            <p>현재 요금제로 이용할 수 없습니다.</p>
          </div>
        </PageHeader>
        <SectionCard>
          <EmptyState>
            <div>현재 요금제로 이용할 수 없습니다. 업그레이드 후 이용해보세요!</div>
            <UpgradeButton type="button" onClick={() => navigate(routes.myAcademyPlan)}>
              요금제 변경하기
            </UpgradeButton>
          </EmptyState>
        </SectionCard>
      </Page>
    );
  }

  return (
    <Page>
      <PageHeader>
        <div>
          <h2>강사관리</h2>
          <p>강사 계정을 추가하고 권한/담당 수업을 관리합니다.</p>
        </div>
        <HeaderActions>
          <CountBadge aria-label="등록된 강사 수">
            등록 {teachers.teachers.length}/{teacherLimitLabel}
          </CountBadge>
          <PrimaryButton type="button" onClick={teachers.onOpenCreate} disabled={teacherReached}>
            강사 추가
          </PrimaryButton>
          {teacherReached ? <GhostBtnSmall to={routes.myAcademyPlan}>요금제 변경</GhostBtnSmall> : null}
        </HeaderActions>
      </PageHeader>

      {teachers.loading ? (
        <SectionCard>
          <CardHead>
            <div>
              <strong>강사 목록</strong>
              <Muted>{`총 0명 / 최대 ${teacherLimitLabel}`}</Muted>
            </div>
          </CardHead>
          강사 정보를 불러오는 중입니다…
        </SectionCard>
      ) : teachers.error ? (
        <SectionCard role="alert">
          <CardHead>
            <div>
              <strong>강사 목록</strong>
              <Muted>{`총 0명 / 최대 ${teacherLimitLabel}`}</Muted>
            </div>
          </CardHead>
          {teachers.error}
        </SectionCard>
      ) : teachers.teachers.length === 0 ? (
        <SectionCard>
          <CardHead>
            <div>
              <strong>강사 목록</strong>
              <Muted>{`총 0명 / 최대 ${teacherLimitLabel}`}</Muted>
            </div>
          </CardHead>
          <EmptyState>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M20 4H6.5A2.5 2.5 0 0 0 4 6.5v13" />
              <path d="M20 4v13H6.5" />
            </svg>
            <div>등록된 강사가 없습니다. 상단의 강사 추가 버튼으로 강사를 초대해 보세요.</div>
          </EmptyState>
        </SectionCard>
      ) : (
        <SectionCard>
          <CardHead>
            <div>
              <strong>강사 목록</strong>
              <Muted>{`총 ${teachers.teachers.length}명 / 최대 ${teacherLimitLabel}`}</Muted>
            </div>
          </CardHead>
          <Scroller>
            <StyledTable>
              <colgroup>
                <col style={{ width: '6%' }} />     {/** 번호 */}
                <col style={{ width: '22%' }} />    {/** 이름 */}
                <col style={{ width: '20%' }} />    {/** 아이디 */}
                <col style={{ width: '22%' }} />    {/** 연락처 */}
                <col style={{ width: '22%' }} />    {/** 추가일 */}
                <col style={{ width: '8%' }} />     {/** 담당 수업 */}
              </colgroup>
              <thead>
                <tr>
                  <th scope="col" className="num">번호</th>
                  <th scope="col">이름</th>
                  <th scope="col">아이디</th>
                  <th scope="col">연락처</th>
                  <th scope="col">추가일</th>
                  <th scope="col" className="num">담당 수업</th>
                </tr>
              </thead>
              <tbody>
                {teachers.teachers.map((teacher, index) => {
                  const seq = teachers.teachers.length - index;
                  const dateLabelRaw = teacher.createdAt ? formatKoreanDate(teacher.createdAt, { includeYear: true, includeWeekday: false }) : "-";
                  const createdAt = dateLabelRaw === '—' ? '-' : dateLabelRaw;
                  return (
                  <tr
                    key={teacher.id}
                    role="button"
                    data-clickable="true"
                    tabIndex={0}
                    onClick={() => teachers.onSelect(teacher.id)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        teachers.onSelect(teacher.id);
                      }
                    }}
                  >
                    <td className="num">{seq}</td>
                    <td>{teacher.name || "-"}</td>
                    <td>{teacher.username}</td>
                    <td>{teacher.phone || "-"}</td>
                    <td>{createdAt}</td>
                    <td className="num">{teacher.courseCount}</td>
                  </tr>
                );})}
              </tbody>
            </StyledTable>
          </Scroller>
        </SectionCard>
      )}

      <TeacherCreateModal modal={state.teacherCreateModal} />
    </Page>
  );
}
 
const StyledTable = styled(Table)`
  table-layout: fixed;
  width: 100%;
  thead th {
    background: #f8fafc; /* match Students table */
    color: #334155;
    font-weight: 800;
    text-align: center;
  }
  thead th, tbody td {
    vertical-align: middle;
    padding: 12px;
    text-align: center;
    border-right: 1px solid #f1f5f9; /* vertical separators */
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  /* Force center alignment for .num cells in this table */
  thead th.num,
  tbody td.num { text-align: center; }
  thead th:last-child, tbody td:last-child { border-right: none; }
  tbody td { font-size: 13.5px; color: #0f172a; height: 44px; }
  tbody tr[role='button'], tbody tr[data-clickable='true'] { cursor: pointer; }
  tbody tr[data-clickable='true']:active td { background: ${({ theme }) => theme.colors.surfaceAlt}; }
  /* Remove hover background for rows (requested) */
  tbody tr:hover td { background: transparent !important; }
  tbody tr:nth-child(even):hover td { background: transparent !important; }
  tbody tr:hover { background: transparent !important; }
  /* Numeric spacing (keep tabular width) */
  .num { font-variant-numeric: tabular-nums; }
  td:nth-child(4), /* phone */
  td:nth-child(6) { font-variant-numeric: tabular-nums; }
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const CountBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  color: #3730a3;
  background: #eef2ff;
`;

const CardHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  strong { font-size: 14px; color: #111827; }
`;

const Muted = styled.span`
  display: block;
  margin-top: 4px;
  color: #6b7280;
  font-size: 12px;
`;

const UpgradeButton = styled(PrimaryButton)`
  margin-top: 12px;
`;
