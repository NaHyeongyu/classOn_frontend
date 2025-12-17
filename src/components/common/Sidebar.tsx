// 사이드바: 주요 내비게이션과 사용자 정보 카드 UI를 담당합니다.
import { useMemo, useCallback } from "react";
import styled from "styled-components";
import { NavLink, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { routes } from "@/routes";
import { apiGetPlanUsage } from "@/api/account";

type SidebarProps = {
  onNavigate?: () => void;
};

type NavItem = {
  key: string;
  label: string;
  sub: string;
  to: string;
  menuKey?: string | null;
  locked?: boolean;
  lockTitle?: string;
};

export default function Sidebar({ onNavigate }: SidebarProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const enableFeedback = import.meta.env.VITE_ENABLE_FEEDBACK === 'true';
  const roleValue = (user?.role ?? "").toString().toUpperCase();
  const isTeacher = roleValue.includes("TEACHER");
  const isOwnerOrAdmin = roleValue === "OWNER" || roleValue === "ADMIN";

  const planUsageQuery = useQuery({
    queryKey: ["account", "plan-usage"],
    queryFn: apiGetPlanUsage,
    enabled: Boolean(user && !isTeacher),
    staleTime: 60_000,
  });
  const planId = (planUsageQuery.data?.planId ?? "").toLowerCase();
  const planResolved = Boolean(planId);
  const paymentFeatureEnabled = planId === "enterprise" || planId.endsWith("-pay");
  const teacherManageEnabled = planId !== "free" && planId.length > 0;
  const items = useMemo<NavItem[]>(() => {
    const normalize = (key: unknown) =>
      typeof key === "string" ? key.trim().toUpperCase() : String(key || "").trim().toUpperCase();
    const teacherMenuKeys = ["DASHBOARD", "CALENDAR", "STUDENTS", "COURSES", "ATTENDANCE", "MATERIALS", "FEEDBACK"];
    const teacherMenuSet = new Set(teacherMenuKeys);

    const rawMenus = Array.isArray(user?.menus) ? user?.menus ?? [] : [];
    const normalizedMenus = new Set(
      rawMenus
        .map((key) => normalize(key))
        .filter((key) => key.length > 0),
    );

    let allowedMenus: Set<string> | null = normalizedMenus.size > 0 ? normalizedMenus : null;
    // 자료실 노출 강제: 메뉴 설정이 존재하더라도 MATERIALS 권한은 기본 포함
    if (allowedMenus) allowedMenus.add("MATERIALS");
    if (isTeacher) {
      if (allowedMenus) {
        const filtered = Array.from(allowedMenus).filter((key) => teacherMenuSet.has(key));
        allowedMenus = new Set(filtered.length > 0 ? filtered : teacherMenuKeys);
      } else {
        allowedMenus = new Set(teacherMenuKeys);
      }
      const teacherItems: NavItem[] = [
        { key: "dashboard", label: "대시보드", sub: "Dashboard", to: routes.home, menuKey: "DASHBOARD" },
        { key: "calendar", label: "일정", sub: "Calendar", to: routes.calendar, menuKey: "CALENDAR" },
        { key: "students", label: "원생관리", sub: "Student Management", to: routes.students, menuKey: "STUDENTS" },
        { key: "classes", label: "수업관리", sub: "Class Management", to: routes.classes, menuKey: "COURSES" },
        { key: "attendance", label: "출결관리", sub: "Attendance", to: routes.attendance, menuKey: "ATTENDANCE" },
        { key: "materials", label: "자료실", sub: "Materials", to: routes.materials, menuKey: "MATERIALS" },
        { key: "feedback", label: "오류/피드백", sub: "Feedback", to: routes.feedback, menuKey: "FEEDBACK" },
      ];
      return teacherItems.filter((item) => {
        if (!allowedMenus || !item.menuKey) return true;
        return allowedMenus.has(item.menuKey);
      });
    }

    const base: NavItem[] = [
      { key: "dashboard", label: "대시보드", sub: "Dashboard", to: routes.home, menuKey: "DASHBOARD" },
      { key: "calendar", label: "일정", sub: "Calendar", to: routes.calendar, menuKey: "CALENDAR" },
      { key: "students", label: "원생관리", sub: "Student Management", to: routes.students, menuKey: "STUDENTS" },
      { key: "classes", label: "수업관리", sub: "Class Management", to: routes.classes, menuKey: "COURSES" },
      { key: "attendance", label: "출결관리", sub: "Attendance", to: routes.attendance, menuKey: "ATTENDANCE" },
      { key: "materials", label: "자료실", sub: "Materials", to: routes.materials, menuKey: "MATERIALS" },
      {
        key: "payments",
        label: "결제관리",
        sub: "Payments",
        to: routes.payments,
        menuKey: "PAYMENTS",
        locked: planResolved ? !paymentFeatureEnabled : false,
        lockTitle: "결제 기능 포함 요금제(Plus)에서 이용할 수 있습니다.",
      },
      { key: "marketing", label: "마케팅", sub: "Marketing", to: routes.marketing, menuKey: "MARKETING" },
      { key: "feedback", label: "오류/피드백", sub: "Feedback", to: routes.feedback, menuKey: "FEEDBACK" },
    ];
    if (isOwnerOrAdmin) {
      const reportsEntry: NavItem = {
        key: "reports",
        label: "보고서",
        sub: "Reports",
        to: routes.reports,
        locked: planResolved ? !paymentFeatureEnabled : false,
        lockTitle: "보고서 기능은 결제 기능 포함 요금제(Plus)에서 이용할 수 있습니다.",
      };
      const teachersEntry: NavItem = {
        key: "teachers-manage",
        label: "강사관리",
        sub: "Teacher Management",
        to: routes.teachersManage,
        locked: planResolved ? !teacherManageEnabled : false,
        lockTitle: "강사 관리 기능은 유료 요금제에서 이용할 수 있습니다.",
      };
      const attendanceIndex = base.findIndex((i) => i.key === "attendance");
      if (attendanceIndex >= 0) {
        base.splice(attendanceIndex + 1, 0, reportsEntry);
      } else {
        base.unshift(reportsEntry);
      }
      const feedbackIndex = base.findIndex((i) => i.key === "feedback");
      if (feedbackIndex >= 0) {
        base.splice(feedbackIndex, 0, teachersEntry);
      } else {
        base.push(teachersEntry);
      }
    }
    if (enableFeedback) {
      base.push({ key: "changelog", label: "업데이트 안내", sub: "Patch Notes", to: routes.feedbackChangelog });
    }
    return base.filter((item) => {
      if (!allowedMenus || !item.menuKey) return true;
      return allowedMenus.has(item.menuKey);
    });
  }, [enableFeedback, isTeacher, isOwnerOrAdmin, paymentFeatureEnabled, planResolved, teacherManageEnabled, user?.menus]);

  // Display only academy name in the bottom user box
  const academyName = user?.academy?.name && user.academy.name.trim() ? user.academy.name.trim() : undefined;
  const profileName = isTeacher ? (user?.name?.trim() || "강사") : academyName || "학원 미지정";
  const profileRoute = isTeacher ? routes.teacherHome : routes.myAcademy;
  const profileTitle = isTeacher ? "강사 홈" : "내 정보";
  const profileAria = `${profileTitle}: ${profileName}`;

  const handleProfileClick = useCallback(() => {
    navigate(profileRoute);
    onNavigate?.();
  }, [navigate, onNavigate, profileRoute]);

  const handleLogout = useCallback(() => {
    logout();
    navigate(routes.login, { replace: true, state: undefined });
    onNavigate?.();
  }, [logout, navigate, onNavigate]);

  return (
    <SidebarWrapper>
      <LogoRow
        role="banner"
        onClick={() => {
          navigate('/');
          onNavigate?.();
        }}
        title="홈으로"
      >
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
              <NavLinkStyled
                to={item.to}
                end={item.to === "/"}
                onClick={() => onNavigate?.()}
                data-locked={item.locked ? "true" : undefined}
              >
                <Icon aria-hidden>{renderIcon(item.key)}</Icon>
                <Labels>
                  <span>{item.label}</span>
                  <em>{item.sub}</em>
                </Labels>
                {item.locked ? (
                  <LockPill title={item.lockTitle ?? "현재 요금제로 이용할 수 없습니다."} aria-label="잠김">
                    <LockIcon aria-hidden viewBox="0 0 24 24">
                      <path
                        d="M7 11V8a5 5 0 0 1 10 0v3"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <rect
                        x="6"
                        y="11"
                        width="12"
                        height="10"
                        rx="2"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </LockIcon>
                    잠김
                  </LockPill>
                ) : null}
              </NavLinkStyled>
            </li>
          ))}
        </ul>
      </Nav>

      <BottomInfo>
        <AcademyCard
          type="button"
          onClick={handleProfileClick}
          title={profileTitle}
          aria-label={profileAria}
        >
          <LeadingIcon aria-hidden>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M12 2v2" />
              <path d="M12 20v2" />
              <path d="M2 12h2" />
              <path d="M20 12h2" />
              <path d="M4.93 4.93l1.41 1.41" />
              <path d="M17.66 17.66l1.41 1.41" />
              <path d="M4.93 19.07l1.41-1.41" />
              <path d="M17.66 6.34l1.41-1.41" />
            </svg>
          </LeadingIcon>
          <div style={{flex:1, minWidth:0}}>
            <AcademyLabel>내 정보</AcademyLabel>
            <AcademyName title={profileName}>
              {profileName}
            </AcademyName>
          </div>
          <Chevron aria-hidden viewBox="0 0 24 24"><path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></Chevron>
        </AcademyCard>
        {isTeacher ? (
          <>
            <LogoutButton type="button" onClick={handleLogout}>
              로그아웃
            </LogoutButton>
            <FooterText>academy.com</FooterText>
          </>
        ) : (
          <FooterText>academy.com</FooterText>
        )}
      </BottomInfo>
    </SidebarWrapper>
  );
}

function getLogoSrc(): string {
  const envPath = import.meta.env.VITE_APP_LOGO_PATH;
  if (envPath && envPath.trim()) return envPath;
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
          <circle cx="12" cy="7" r="4" />
          <path d="M5.5 21a6.5 6.5 0 0 1 13 0" />
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
    case "attendance":
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
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
          <path d="M9 16l2 2 4-4" />
        </svg>
      );
    case "reports":
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
          <rect x="3" y="3" width="4" height="18" />
          <rect x="10" y="9" width="4" height="12" />
          <rect x="17" y="13" width="4" height="8" />
        </svg>
      );
    case "materials":
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
          <path d="M3 7h6l2 2h10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
          <path d="M3 7V5a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v2" />
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
    case "teachers-manage":
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
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M20 4H6.5A2.5 2.5 0 0 0 4 6.5v13" />
          <path d="M20 4v13H6.5" />
        </svg>
      );
    
    case "feedback":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a4 4 0 0 1-4 4H7l-4 4V5a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
          <path d="M8 9h8" />
          <path d="M8 13h5" />
        </svg>
      );
    case "changelog":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4h16v16H4z" />
          <path d="M8 8h8" />
          <path d="M8 12h6" />
          <path d="M8 16h5" />
        </svg>
      );
    default:
      return null;
  }
}

const SidebarWrapper = styled.aside`
  position: fixed;
  inset: 0 auto 0 0; /* top:0; left:0; bottom:0 */
  width: 220px;
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

  &[data-locked="true"] {
    opacity: 0.82;
  }

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

const LockPill = styled.span`
  margin-left: auto;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 24px;
  padding: 0 8px;
  border-radius: 999px;
  border: 1px solid #e5e7eb;
  background: #f9fafb;
  color: #6b7280;
  font-size: 11px;
  letter-spacing: -0.01em;
  white-space: nowrap;
`;

const LockIcon = styled.svg`
  width: 14px;
  height: 14px;
  flex: none;
`;

const BottomInfo = styled.div`
  padding: 12px 12px 16px;
  border-top: 1px solid #e5e7eb;
  background: #ffffff;
`;

const AcademyCard = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 12px;
  border-radius: 12px;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  border: 1px solid #e5e7eb;
  cursor: pointer;
  transition: box-shadow .15s ease, transform .05s ease, background .15s ease;
  &:hover { box-shadow: 0 6px 18px rgba(2,6,23,0.08); background: #ffffff; }
  &:active { transform: translateY(1px); }
`;

const AcademyLabel = styled.div`
  font-size: 11px;
  color: #6b7280;
  text-align: left;
`;
const AcademyName = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: #111827;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  text-align: left;
`;
const Chevron = styled.svg`
  width: 18px; height: 18px; color: #9ca3af;
`;

const LeadingIcon = styled.div`
  width: 32px; height: 32px; border-radius: 10px; display: grid; place-items: center; margin-right: 6px;
  background: linear-gradient(180deg, #eef2ff 0%, #e0e7ff 100%);
  color: #4f46e5;
  border: 1px solid #e5e7eb;
`;

const FooterText = styled.div`
  margin-top: 8px;
  text-align: center;
  font-size: 11px;
  color: #9ca3af;
`;

const LogoutButton = styled.button`
  margin-top: 12px;
  width: 100%;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
  color: #1f2937;
  font-size: 13px;
  font-weight: 600;
  padding: 8px 12px;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease;
  &:hover {
    background: #e2e8f0;
    border-color: #cbd5f5;
  }
  &:active {
    background: #e0e7ff;
  }
`;
    
