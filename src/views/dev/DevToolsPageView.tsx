import styled from "styled-components";
import {
  GhostBtn as UIGhostBtn,
  PrimaryBtn as UIPrimaryBtn,
} from "@/components/common/UI";
import type { useDevToolsPage } from "@/features/dev/useDevToolsPage";

type DevToolsPageViewProps = ReturnType<typeof useDevToolsPage>;

export function DevToolsPageView({
  stats,
  busy,
  busyCourses,
  busySeed,
  msg,
  msgCourses,
  msgSeed,
  err,
  errCourses,
  errSeed,
  seedStudents,
  setSeedStudents,
  seedCourses,
  setSeedCourses,
  seedCounsels,
  setSeedCounsels,
  loadStats,
  onReset,
  onResetCourses,
  onSeed,
}: DevToolsPageViewProps) {
  return (
    <Wrap>
      <Head>
        <h2>개발 도구</h2>
      </Head>
      <Card>
        <Row>
          <div>
            <h3>데이터 생성</h3>
            <p>테스트용 더미 데이터를 생성합니다. 수업 내역(1주)도 함께 준비됩니다.</p>
          </div>
          <SeedGrid>
            <div>
              <SmallLabel>학생 수</SmallLabel>
              <input
                type="number"
                min={0}
                value={seedStudents}
                onChange={(event) =>
                  setSeedStudents(Number(event.target.value || 0))
                }
              />
            </div>
            <div>
              <SmallLabel>수업 수</SmallLabel>
              <input
                type="number"
                min={0}
                value={seedCourses}
                onChange={(event) =>
                  setSeedCourses(Number(event.target.value || 0))
                }
              />
            </div>
            <div>
              <SmallLabel>상담 수</SmallLabel>
              <input
                type="number"
                min={0}
                value={seedCounsels}
                onChange={(event) =>
                  setSeedCounsels(Number(event.target.value || 0))
                }
              />
            </div>
            <div style={{ gridColumn: "1 / -1", textAlign: "right" }}>
              <UIPrimaryBtn
                as={"button" as const}
                disabled={busySeed}
                onClick={() => {
                  void onSeed();
                }}
              >
                {busySeed ? "진행중…" : "데이터 생성"}
              </UIPrimaryBtn>
            </div>
          </SeedGrid>
        </Row>
        {msgSeed && <Ok>{msgSeed}</Ok>}
        {errSeed && <Err>{errSeed}</Err>}
      </Card>

      <Card>
        <Row>
          <div>
            <h3>데이터 초기화</h3>
            <p>
              수업기록/출석/첨부/상담 데이터를 모두 삭제합니다. 학생/수업/등록은
              유지됩니다.
            </p>
          </div>
          <div>
            <UIPrimaryBtn
              as={"button" as const}
              disabled={busy}
              onClick={() => {
                void onReset();
              }}
            >
              {busy ? "진행중…" : "초기화 실행"}
            </UIPrimaryBtn>
          </div>
        </Row>
        {msg && <Ok>{msg}</Ok>}
        {err && <Err>{err}</Err>}
      </Card>

      <Card>
        <Row>
          <div>
            <h3>수업 초기화</h3>
            <p>
              수업과 수업 내역(출결/첨부)을 모두 삭제합니다. 학생/상담은
              유지됩니다.
            </p>
          </div>
          <div>
            <UIPrimaryBtn
              as={"button" as const}
              disabled={busyCourses}
              onClick={() => {
                void onResetCourses();
              }}
            >
              {busyCourses ? "진행중…" : "수업 초기화 실행"}
            </UIPrimaryBtn>
          </div>
        </Row>
        {msgCourses && <Ok>{msgCourses}</Ok>}
        {errCourses && <Err>{errCourses}</Err>}
      </Card>

      <Card>
        <h3>현재 통계</h3>
        {!stats ? (
          <Muted>불러오는 중…</Muted>
        ) : (
          <Grid>
            <Item>
              <Label>학생 수</Label>
              <Val>{stats.students}</Val>
            </Item>
            <Item>
              <Label>수업 수</Label>
              <Val>{stats.courses}</Val>
            </Item>
            <Item>
              <Label>상담 수</Label>
              <Val>{stats.counsels}</Val>
            </Item>
          </Grid>
        )}
        <UIGhostBtn
          as={"button" as const}
          onClick={() => {
            void loadStats();
          }}
          style={{ marginTop: 8 }}
        >
          새로고침
        </UIGhostBtn>
      </Card>
      <Hint>백엔드 설정(app.dev-endpoints=true)에서만 동작합니다.</Hint>
    </Wrap>
  );
}

const Wrap = styled.div`
  display: grid;
  gap: 12px;
`;

const Head = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  h2 {
    margin: 0;
    font-size: 20px;
  }
`;

const Card = styled.section`
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 14px;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
`;

const SeedGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 120px);
  gap: 8px;
  align-items: center;
  input {
    width: 100%;
    height: 36px;
    border: 1px solid #e5e7eb;
    border-radius: 10px;
    padding: 0 10px;
  }
  @media (max-width: 720px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const Ok = styled.div`
  margin-top: 8px;
  background: #dcfce7;
  color: #166534;
  border: 1px solid #bbf7d0;
  padding: 8px 10px;
  border-radius: 8px;
  font-size: 13px;
`;

const Err = styled.div`
  margin-top: 8px;
  background: #fee2e2;
  color: #b91c1c;
  border: 1px solid #fecaca;
  padding: 8px 10px;
  border-radius: 8px;
  font-size: 13px;
`;

const Muted = styled.div`
  color: #6b7280;
  font-size: 13px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
  @media (max-width: 600px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  @media (max-width: 420px) {
    grid-template-columns: 1fr;
  }
`;

const Item = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 10px;
  background: #fafafa;
  display: grid;
  gap: 6px;
`;

const Label = styled.div`
  color: #6b7280;
  font-size: 12px;
`;

const Val = styled.div`
  font-size: 18px;
  font-weight: 900;
  color: #0f172a;
`;

const Hint = styled.div`
  color: #6b7280;
  font-size: 12px;
`;

const SmallLabel = styled.div`
  color: #6b7280;
  font-size: 12px;
  margin-bottom: 4px;
`;
