import { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { LoadingSpinner } from "@/components/common/Loading";
import { resolveApiUrl } from "@/lib/fetcher";

const Page = styled.div`
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
  background: #f9fafb;
`;

const Card = styled.div`
  width: 100%;
  max-width: 420px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 18px 18px 16px;
  display: grid;
  gap: 10px;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 18px;
  font-weight: 800;
  color: #111827;
`;

const Desc = styled.p`
  margin: 0;
  font-size: 13px;
  color: #6b7280;
  line-height: 1.4;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 6px;
`;

const LinkButton = styled.a`
  margin-top: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  color: #111827;
  font-size: 13px;
  font-weight: 700;
  text-decoration: none;
`;

export default function PublicReportDownload() {
  const { token } = useParams<{ token?: string }>();

  const apiUrl = useMemo(() => {
    if (!token || !token.trim()) return null;
    return resolveApiUrl(`/api/public/reports/${encodeURIComponent(token.trim())}`);
  }, [token]);

  useEffect(() => {
    if (!apiUrl) return;
    const id = window.setTimeout(() => {
      window.location.href = apiUrl;
    }, 300);
    return () => window.clearTimeout(id);
  }, [apiUrl]);

  return (
    <Page>
      <Card>
        <Title>보고서 다운로드</Title>
        {!apiUrl ? (
          <Desc>유효하지 않은 링크입니다.</Desc>
        ) : (
          <>
            <Desc>보고서를 여는 중입니다. 잠시만 기다려 주세요.</Desc>
            <Row>
              <LoadingSpinner />
              <Desc style={{ margin: 0 }}>다운로드로 이동 중…</Desc>
            </Row>
            <LinkButton href={apiUrl}>다운로드가 시작되지 않으면 눌러주세요</LinkButton>
          </>
        )}
      </Card>
    </Page>
  );
}

