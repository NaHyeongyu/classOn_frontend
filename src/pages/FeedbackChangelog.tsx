import { Page, SectionCard, PageHeader, TitleH3 } from "@/components/common/UI";
import styled from "styled-components";

export default function FeedbackChangelog() {
  return (
    <Page>
      <PageHeader>
        <div>
          <h2>업데이트 안내</h2>
          <p>최근 변경 사항과 개선 내역을 한눈에 확인하세요.</p>
        </div>
        <div />
      </PageHeader>

      <SectionCard>
        <TitleH3>2025-10-08</TitleH3>
        <List>
          <li>오류/요청 페이지에 email 제보 버튼 추가 (✉️ 이메일로 제보)</li>
          <li>오류/요청 폼에서 현재 페이지/브라우저 정보는 화면 비표시 처리 (서버 전송은 유지)</li>
          <li>관리자(Admin)에서 피드백 목록/상태 변경 화면 추가 (/admin/feedbacks)</li>
          <li>좌측 사이드바에 “오류/요청”, “업데이트 안내(패치노트)” 항목 추가</li>
        </List>
      </SectionCard>

      <SectionCard>
        <TitleH3>2025-10-07</TitleH3>
        <List>
          <li>기능: 사용자 피드백 제출 API 추가 (/api/feedback)</li>
          <li>개선: 피드백 데이터 구조 및 저장 테이블(feedbacks) 도입</li>
        </List>
      </SectionCard>

      <SectionCard>
        <TitleH3>2025-10-06</TitleH3>
        <List>
          <li>안정성: 일부 페이지 로딩 및 라우팅 전환 애니메이션 최적화</li>
          <li>UI: 사이드바/헤더 여백과 버튼 정렬 개선</li>
        </List>
      </SectionCard>
    </Page>
  );
}

const List = styled.ul`
  margin: 0;
  padding-left: 18px;
  display: grid;
  gap: 6px;
  li { color: #0f172a; }
`;

