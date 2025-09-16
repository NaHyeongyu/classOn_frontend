import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * EN: Application root with route guards (auth) and base layouts (sidebar + content).
 * KO: 인증 가드와 기본 레이아웃(사이드바 + 콘텐츠)을 포함한 앱 루트 컴포넌트.
 */
import Sidebar from "./components/common/Sidebar";
import styled, { keyframes } from "styled-components";
import { Routes, Route, Outlet, Navigate, useLocation } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Calendar from "./pages/Calendar";
import CalendarDetail from "./pages/CalendarDetail";
import Students from "./pages/Students";
import Classes from "./pages/Classes";
import CourseForm from "./pages/CourseForm";
import CourseDetail from "./pages/CourseDetail";
import CourseStudentsEdit from "./pages/CourseStudentsEdit";
import CourseRecordDetail from "./pages/CourseRecordDetail";
import Payments from "./pages/Payments";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFail from "./pages/PaymentFail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { useAuth } from "./hooks/useAuth";
import StudentDetail from "./pages/StudentDetail";
import StudentForm from "./pages/StudentForm";
import DevTools from "./pages/DevTools";
// 상담 전역 페이지는 학생 상세 내 탭으로 통합됨
const AppContainer = styled.div `
  display: flex;
`;
const SidebarContainer = styled.aside `
  width: 264px; /* match Sidebar fixed width */
  flex: 0 0 264px;
`;
const ContentContainer = styled.main `
  flex: 1;
  min-height: 100vh;
  background: #ffffff;
  padding: 24px;
`;
export default function App() {
    return (_jsxs(Routes, { children: [_jsxs(Route, { element: _jsx(AuthLayout, {}), children: [_jsx(Route, { path: "/login", element: _jsx(Login, {}) }), _jsx(Route, { path: "/register", element: _jsx(Register, {}) })] }), _jsx(Route, { element: _jsx(ProtectedLayout, {}), children: _jsxs(Route, { element: _jsx(MainLayout, {}), children: [_jsx(Route, { path: "/", element: _jsx(Dashboard, {}) }), _jsx(Route, { path: "/calendar", element: _jsx(Calendar, {}) }), _jsx(Route, { path: "/calendar/:ymd", element: _jsx(CalendarDetail, {}) }), _jsx(Route, { path: "/students", element: _jsx(Students, {}) }), _jsx(Route, { path: "/students/new", element: _jsx(StudentForm, {}) }), _jsx(Route, { path: "/students/:id/edit", element: _jsx(StudentForm, {}) }), _jsx(Route, { path: "/students/:id/:tab", element: _jsx(StudentDetail, {}) }), _jsx(Route, { path: "/students/:id", element: _jsx(StudentDetail, {}) }), _jsx(Route, { path: "/classes", element: _jsx(Classes, {}) }), _jsx(Route, { path: "/classes/new", element: _jsx(CourseForm, {}) }), _jsx(Route, { path: "/classes/:id/edit", element: _jsx(CourseForm, {}) }), _jsx(Route, { path: "/classes/:id/edit-students", element: _jsx(CourseStudentsEdit, {}) }), _jsx(Route, { path: "/classes/:id", element: _jsx(CourseDetail, {}) }), _jsx(Route, { path: "/classes/:id/:tab", element: _jsx(CourseDetail, {}) }), _jsx(Route, { path: "/classes/:id/history/:recordId", element: _jsx(CourseRecordDetail, {}) }), _jsx(Route, { path: "/classes/:id/history/date/:ymd", element: _jsx(CourseRecordDetail, {}) }), _jsx(Route, { path: "/payments", element: _jsx(Payments, {}) }), _jsx(Route, { path: "/payments/success", element: _jsx(PaymentSuccess, {}) }), _jsx(Route, { path: "/payments/fail", element: _jsx(PaymentFail, {}) }), _jsx(Route, { path: "/dev-tools", element: _jsx(DevTools, {}) })] }) })] }));
}
function ProtectedLayout() {
    const { user, loading } = useAuth();
    const location = useLocation();
    if (loading)
        return _jsx(Centered, { children: "\uB85C\uB529 \uC911..." });
    if (!user)
        return _jsx(Navigate, { to: "/login", replace: true, state: { from: location.pathname } });
    return _jsx(Outlet, {});
}
function MainLayout() {
    return (_jsxs(AppContainer, { children: [_jsx(SidebarContainer, { children: _jsx(Sidebar, {}) }), _jsx(ContentContainer, { children: _jsx(Outlet, {}) })] }));
}
function AuthLayout() {
    const { user } = useAuth();
    if (user)
        return _jsx(Navigate, { to: "/", replace: true });
    return (_jsx(AuthContainer, { children: _jsx(AuthCard, { children: _jsx(Outlet, {}) }) }));
}
const Centered = styled.div `
  min-height: 100vh;
  display: grid;
  place-items: center;
  color: #6b7280;
`;
const AuthContainer = styled.div `
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: radial-gradient(1200px 600px at 10% 0%, #eef2ff 0%, #f9fafb 40%, #f9fafb 100%);
  padding: 32px;
`;
const fadeUp = keyframes `
  0% { opacity: 0; transform: translateY(8px) scale(0.995); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
`;
const AuthCard = styled.div `
  width: 100%;
  max-width: 560px;
  background: transparent; /* 경계 없는 스타일 */
  border-radius: 18px;
  padding: 20px;
  animation: ${fadeUp} 260ms ease-out;
`;
