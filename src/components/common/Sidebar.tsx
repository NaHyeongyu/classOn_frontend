import { useMemo } from "react";
import styled from "styled-components";
import { NavLink, useNavigate } from "react-router-dom";
import { buttonVariants } from "./UI";
import { useAuth } from "../../hooks/useAuth";

export default function Sidebar() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const items = useMemo(
    () => [
      { key: "dashboard", label: "대시보드", sub: "Dashboard", to: "/" },
      { key: "calendar", label: "일정", sub: "Calendar", to: "/calendar" },
      { key: "students", label: "원생관리", sub: "Student Management", to: "/students" },
      { key: "classes", label: "수업관리", sub: "Class Management", to: "/classes" },
      { key: "payments", label: "결제관리", sub: "Payments", to: "/payments" },
      { key: "marketing", label: "마케팅", sub: "Marketing", to: "/marketing" },
    ],
    []
  );

  const initials = useMemo(() => {
    const n = (user?.name || user?.username || "").trim();
    if (!n) return "?";
    const parts = n.split(/\s+/);
    if (n.length <= 2) return n;
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return n.slice(0, 2).toUpperCase();
  }, [user?.name, user?.username]);

  const displayName = user?.name || user?.username || "사용자";
  const displaySub = user?.email || user?.username || "";

  return (
    <SidebarWrapper>
      <LogoRow role="banner" onClick={() => navigate('/') } title="홈으로">
        <LogoImage src={getLogoSrc()} alt="Academy Manager 로고" />
        <LogoText>
          <strong>ClassOn</strong>
          <small>교육관리 시스템</small>
        </LogoText>
      </LogoRow>

      <Nav role="navigation" aria-label="사이드 내비게이션">
        <ul>
          {items.map((item) => (
            <li key={item.key}>
              <NavLinkStyled to={item.to} end={item.to === "/"}>
                <Icon aria-hidden>{renderIcon(item.key)}</Icon>
                <Labels>
                  <span>{item.label}</span>
                  <em>{item.sub}</em>
                </Labels>
              </NavLinkStyled>
            </li>
          ))}
        </ul>
      </Nav>

      <BottomInfo>
        <UserBox>
          <UserAvatar aria-hidden>{initials}</UserAvatar>
          <div>
            <UserName title={displayName}>{displayName}</UserName>
            {displaySub ? <UserEmail title={displaySub}>{displaySub}</UserEmail> : null}
          </div>
        </UserBox>
        <LogoutButton type="button" onClick={() => { logout(); navigate("/login", { replace: true }); }}>
          로그아웃
        </LogoutButton>
        <FooterText>academy.com</FooterText>
      </BottomInfo>
    </SidebarWrapper>
  );
}

function getLogoSrc(): string {
  const envPath = (import.meta as any).env?.VITE_APP_LOGO_PATH as string | undefined;
  if (envPath && typeof envPath === 'string') return envPath;
  // By convention, place your logo at public/logo/logo.svg (or configure VITE_APP_LOGO_PATH)
  return "/logo/logo.svg";
}

function renderIcon(key: string) {
  switch (key) {
    case "dashboard":
      return (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 9l9-7 9 7" />
          <path d="M9 22V12h6v10" />
        </svg>
      );
    case "calendar":
      return (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      );
    case "students":
      return (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M4 21v-2a 4 4 0 0 1 3-3.87" />
          <circle cx="7" cy="7" r="4" />
          <circle cx="17" cy="7" r="4" />
        </svg>
      );
    case "teachers":
      return (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <path d="M7 8h10" />
          <path d="M7 12h10" />
          <path d="M7 16h6" />
        </svg>
      );
    case "payments":
      return (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <line x1="3" y1="9" x2="21" y2="9" />
          <circle cx="8" cy="15" r="1" />
          <circle cx="12" cy="15" r="1" />
          <circle cx="16" cy="15" r="1" />
        </svg>
      );
    case "classes":
      return (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </svg>
      );
    case "marketing":
      return (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 11l19-8-4 18-7-7-8-3z" />
          <path d="M14 7l-7 7" />
        </svg>
      );
    case "counsels":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a4 4 0 0 1-4 4H7l-4 4V5a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
        </svg>
      );
    default:
      return null;
  }
}

const SidebarWrapper = styled.aside`
  position: fixed;
  inset: 0 auto 0 0; /* top:0; left:0; bottom:0 */
  width: 264px;
  background: #f9fafb;
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
`;

const LogoRow = styled.div`
  height: 64px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 16px;
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;
`;

const LogoImage = styled.img`
  display: block;
  height: 32px;
  width: auto;
`;

const LogoText = styled.div`
  display: flex;
  flex-direction: column;
  line-height: 1.1;
  strong {
    color: #111827;
    font-size: 14px;
  }
  small {
    color: #6b7280;
    font-size: 12px;
    margin-top: 2px;
  }
`;

const Nav = styled.nav`
  flex: 1;
  padding: 12px;
  overflow-y: auto;
  ul {
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
`;

const NavLinkStyled = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 10px;
  height: 44px;
  border-radius: 10px;
  padding: 0 10px;
  text-decoration: none;
  transition: background 0.15s ease, color 0.15s ease, box-shadow 0.15s ease,
    border-color 0.15s ease;
  border: 1px solid transparent;
  color: #6b7280;
  background: transparent;
  outline: none;
  user-select: none;
  position: relative;

  &:hover {
    background: #f5f5f5;
    color: #111827;
  }

  &:focus-visible {
    box-shadow: 0 0 0 2px #e5e7eb inset;
  }

  &[aria-current="page"] {
    background: #ffffff;
    color: #111827;
    border-color: #e5e7eb;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
  }

  /* Active/hover left accent bar */
  &::before {
    content: "";
    position: absolute;
    left: -12px;
    top: 8px;
    bottom: 8px;
    width: 3px;
    border-radius: 2px;
    background: transparent;
    transition: background 0.15s ease;
  }
  &:hover::before { background: rgba(79,70,229,0.35); }
  &[aria-current="page"]::before { background: #4f46e5; }
`;

const Icon = styled.span`
  width: 24px;
  height: 24px;
  color: inherit;
  display: grid;
  place-items: center;
`;

const Labels = styled.span`
  display: flex;
  flex-direction: column;
  line-height: 1.1;
  min-width: 0; /* allow ellipsis */
  span {
    font-size: 14px;
    letter-spacing: -0.01em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  em {
    font-style: normal;
    font-size: 11px;
    color: #9ca3af;
    margin-top: 2px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const BottomInfo = styled.div`
  padding: 12px 12px 16px;
  border-top: 1px solid #e5e7eb;
  background: #ffffff;
`;

const UserBox = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border-radius: 12px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
`;

const UserAvatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%);
  color: #4338ca;
  display: grid;
  place-items: center;
  font-size: 12px;
  font-weight: 700;
`;

const UserName = styled.div`
  font-size: 13px;
  color: #111827;
  font-weight: 600;
`;

const UserEmail = styled.div`
  font-size: 11px;
  color: #6b7280;
`;

const FooterText = styled.div`
  margin-top: 8px;
  text-align: center;
  font-size: 11px;
  color: #9ca3af;
`;

const LogoutButton = styled.button`
  ${buttonVariants.outline};
  width: 100%;
  margin-top: 10px;
  height: 42px;
  justify-content: center;
  font-weight: 600;
  color: #374151;
  background: #f1f5f9;
  border-color: #e5e7eb;
  &:hover {
    background: #e5e7eb;
  }
`;
