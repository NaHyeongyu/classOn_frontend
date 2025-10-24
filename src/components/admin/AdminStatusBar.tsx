import styled from "styled-components";

type Props = {
  isLoggedIn: boolean;
  username?: string;
  role?: string | null;
};

export function AdminStatusBar({ isLoggedIn, username, role }: Props) {
  return (
    <Bar>
      <span className={`pill ${isLoggedIn ? "" : "warn"}`}>
        {isLoggedIn ? "로그인" : "주의"}
      </span>
      <span className="who">
        {isLoggedIn
          ? `${username}${role ? ` (${role})` : ""}`
          : "관리자 로그인이 없으므로 일부 기능이 제한될 수 있습니다."}
      </span>
    </Bar>
  );
}

const Bar = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 14px;
  border: 1px dashed rgba(148, 163, 184, 0.6);
  background: rgba(241, 245, 249, 0.8);
  font-size: 12px;
  color: #475569;
  .pill {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    border-radius: 999px;
    padding: 4px 10px;
    background: #111827;
    color: #fff;
    font-weight: 800;
    letter-spacing: 0.03em;
  }
  .pill.warn {
    background: #dc2626;
  }
  .who {
    color: #1f2937;
    font-weight: 700;
  }
`;
