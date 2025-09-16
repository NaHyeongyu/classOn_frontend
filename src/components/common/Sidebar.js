import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo } from "react";
import styled from "styled-components";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
export default function Sidebar() {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const items = useMemo(() => [
        { key: "dashboard", label: "대시보드", sub: "Dashboard", to: "/" },
        { key: "calendar", label: "일정", sub: "Calendar", to: "/calendar" },
        { key: "students", label: "원생관리", sub: "Student Management", to: "/students" },
        { key: "classes", label: "수업관리", sub: "Class Management", to: "/classes" },
        { key: "billing", label: "결제관리", sub: "Payments", to: "/payments" },
    ], []);
    return (_jsxs(SidebarWrapper, { children: [_jsxs(LogoRow, { role: "banner", onClick: () => navigate('/'), title: "\uD648\uC73C\uB85C", children: [_jsx(LogoImage, { src: getLogoSrc(), alt: "Academy Manager \uB85C\uACE0" }), _jsxs(LogoText, { children: [_jsx("strong", { children: "ClassOn" }), _jsx("small", { children: "\uAD50\uC721\uAD00\uB9AC \uC2DC\uC2A4\uD15C" })] })] }), _jsx(Nav, { role: "navigation", "aria-label": "\uC0AC\uC774\uB4DC \uB0B4\uBE44\uAC8C\uC774\uC158", children: _jsx("ul", { children: items.map((item) => (_jsx("li", { children: _jsxs(NavLinkStyled, { to: item.to, end: item.to === "/", children: [_jsx(Icon, { "aria-hidden": true, children: renderIcon(item.key) }), _jsxs(Labels, { children: [_jsx("span", { children: item.label }), _jsx("em", { children: item.sub })] })] }) }, item.key))) }) }), _jsxs(BottomInfo, { children: [_jsxs(UserBox, { children: [_jsx(UserAvatar, { children: "\uAD00\uB9AC" }), _jsxs("div", { children: [_jsx(UserName, { children: "\uC0AC\uC6A9\uC790: \uAD00\uB9AC\uC790" }), _jsx(UserEmail, { children: "admin@academy.com" })] })] }), _jsx(LogoutButton, { type: "button", onClick: () => { logout(); navigate("/login", { replace: true }); }, children: "\uB85C\uADF8\uC544\uC6C3" }), _jsx(FooterText, { children: "academy.com" })] })] }));
}
function getLogoSrc() {
    const envPath = import.meta.env?.VITE_APP_LOGO_PATH;
    if (envPath && typeof envPath === 'string')
        return envPath;
    // By convention, place your logo at public/logo/logo.svg (or configure VITE_APP_LOGO_PATH)
    return "/logo/logo.svg";
}
function renderIcon(key) {
    switch (key) {
        case "dashboard":
            return (_jsxs("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [_jsx("path", { d: "M3 9l9-7 9 7" }), _jsx("path", { d: "M9 22V12h6v10" })] }));
        case "calendar":
            return (_jsxs("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [_jsx("rect", { x: "3", y: "4", width: "18", height: "18", rx: "2", ry: "2" }), _jsx("line", { x1: "16", y1: "2", x2: "16", y2: "6" }), _jsx("line", { x1: "8", y1: "2", x2: "8", y2: "6" }), _jsx("line", { x1: "3", y1: "10", x2: "21", y2: "10" })] }));
        case "students":
            return (_jsxs("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [_jsx("path", { d: "M20 21v-2a4 4 0 0 0-3-3.87" }), _jsx("path", { d: "M4 21v-2a 4 4 0 0 1 3-3.87" }), _jsx("circle", { cx: "7", cy: "7", r: "4" }), _jsx("circle", { cx: "17", cy: "7", r: "4" })] }));
        case "teachers":
            return (_jsxs("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [_jsx("rect", { x: "3", y: "4", width: "18", height: "16", rx: "2" }), _jsx("path", { d: "M7 8h10" }), _jsx("path", { d: "M7 12h10" }), _jsx("path", { d: "M7 16h6" })] }));
        case "billing":
            return (_jsxs("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [_jsx("path", { d: "M20 7h-9" }), _jsx("path", { d: "M14 17H5" }), _jsx("circle", { cx: "17", cy: "17", r: "3" }), _jsx("circle", { cx: "7", cy: "7", r: "3" })] }));
        case "classes":
            return (_jsxs("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [_jsx("rect", { x: "3", y: "3", width: "7", height: "7" }), _jsx("rect", { x: "14", y: "3", width: "7", height: "7" }), _jsx("rect", { x: "14", y: "14", width: "7", height: "7" }), _jsx("rect", { x: "3", y: "14", width: "7", height: "7" })] }));
        case "counsels":
            return (_jsx("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: _jsx("path", { d: "M21 15a4 4 0 0 1-4 4H7l-4 4V5a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" }) }));
        default:
            return null;
    }
}
const SidebarWrapper = styled.aside `
  position: fixed;
  inset: 0 auto 0 0; /* top:0; left:0; bottom:0 */
  width: 264px;
  background: #f9fafb;
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
`;
const LogoRow = styled.div `
  height: 64px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 16px;
  border-bottom: 1px solid #e5e7eb;
  background: #ffffff;
`;
const LogoImage = styled.img `
  display: block;
  height: 32px;
  width: auto;
`;
const LogoText = styled.div `
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
const Nav = styled.nav `
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
const NavLinkStyled = styled(NavLink) `
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

  &:hover {
    background: #f3f4f6;
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
`;
const Icon = styled.span `
  width: 24px;
  height: 24px;
  color: inherit;
  display: grid;
  place-items: center;
`;
const Labels = styled.span `
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
const BottomInfo = styled.div `
  padding: 12px 12px 16px;
  border-top: 1px solid #e5e7eb;
  background: #f9fafb;
`;
const UserBox = styled.div `
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border-radius: 12px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
`;
const UserAvatar = styled.div `
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #eef2ff;
  color: #4f46e5;
  display: grid;
  place-items: center;
  font-size: 12px;
  font-weight: 700;
`;
const UserName = styled.div `
  font-size: 13px;
  color: #111827;
  font-weight: 600;
`;
const UserEmail = styled.div `
  font-size: 11px;
  color: #6b7280;
`;
const FooterText = styled.div `
  margin-top: 8px;
  text-align: center;
  font-size: 11px;
  color: #9ca3af;
`;
const LogoutButton = styled.button `
  width: 100%;
  margin-top: 10px;
  height: 40px;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  background: #f9fafb;
  color: #6b7280;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease;
  &:hover {
    background: #f3f4f6;
    color: #111827;
  }
`;
