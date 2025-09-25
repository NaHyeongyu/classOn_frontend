/**
 * EN: Application root with route guards (auth) and base layouts (sidebar + content).
 * KO: 인증 가드와 기본 레이아웃(사이드바 + 콘텐츠)을 포함한 앱 루트 컴포넌트.
 */
import Sidebar from "./components/common/Sidebar";
import { ToastProvider } from "./components/common/Toast";
import styled, { keyframes } from "styled-components";
import { Routes, Route, Outlet, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Dashboard from "./pages/Dashboard";
import Calendar from "./pages/Calendar";
import CalendarDetail from "./pages/CalendarDetail";
import Students from "./pages/Students";
import Classes from "./pages/Classes";
import CourseForm from "./pages/CourseForm";
import CourseDetail from "./pages/CourseDetail";
import CourseStudentsEdit from "./pages/CourseStudentsEdit";
import CourseRecordDetail from "./pages/CourseRecordDetail";
// Payments/Banking routes removed for MVP
import Login from "./pages/Login";
import Register from "./pages/Register";
import { useAuth } from "./hooks/useAuth";
import StudentDetail from "./pages/StudentDetail";
import StudentForm from "./pages/StudentForm";
import DevTools from "./pages/DevTools";
import Marketing from "./pages/Marketing";
import PaymentsWip from "./pages/PaymentsWip";
import MarketingSummary from "./pages/MarketingSummary";
import MarketingGuide from "./pages/MarketingGuide";
import MarketingPreview from "./pages/MarketingPreview";
// 상담 전역 페이지는 학생 상세 내 탭으로 통합됨

const AppContainer = styled.div`
  display: flex;
`;
const SidebarContainer = styled.aside`
  width: 264px; /* match Sidebar fixed width */
  flex: 0 0 264px;
`;
const ContentContainer = styled.main`
  flex: 1;
  min-width: 0; /* prevent flex overflow */
  min-height: 100vh;
  background: #ffffff;
  padding: 24px;
  overflow-x: hidden; /* confine horizontal scroll within inner scrollers */
`;

export default function App() {
  return (
    <ToastProvider>
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      <Route element={<ProtectedLayout />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/calendar/:ymd" element={<CalendarDetail />} />
          <Route path="/students" element={<Students />} />
          <Route path="/students/new" element={<StudentForm />} />
          <Route path="/students/:id/edit" element={<StudentForm />} />
          <Route path="/students/:id/:tab" element={<StudentDetail />} />
          <Route path="/students/:id" element={<StudentDetail />} />
          <Route path="/classes" element={<Classes />} />
          <Route path="/classes/new" element={<CourseForm />} />
          <Route path="/classes/:id/edit" element={<CourseForm />} />
          <Route path="/classes/:id/edit-students" element={<CourseStudentsEdit />} />
          <Route path="/classes/:id" element={<CourseDetail />} />
          <Route path="/classes/:id/:tab" element={<CourseDetail />} />
          <Route path="/classes/:id/history/:recordId" element={<CourseRecordDetail />} />
          <Route path="/classes/:id/history/date/:ymd" element={<CourseRecordDetail />} />
          { /* 상담 전역 라우트 제거됨: 학생 상세 > 상담기록 탭에서 관리 */ }
          <Route path="/payments" element={<PaymentsWip />} />
          <Route path="/dev-tools" element={<DevTools />} />
          <Route path="/marketing" element={<Marketing />} />
          <Route path="/marketing/guide" element={<MarketingGuide />} />
          <Route path="/marketing/preview" element={<MarketingPreview />} />
          <Route path="/marketing/summary" element={<MarketingSummary />} />
          { /* Todos page removed; manage todos within Calendar Detail */ }
        </Route>
      </Route>
    </Routes>
    </ToastProvider>
  );
}

function ProtectedLayout() {
  const { user, loading, validate } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    if (loading) return;
    let cancelled = false;
    (async () => {
      const ok = await validate();
      if (!ok && !cancelled) {
        navigate('/login', { replace: true, state: { from: location.pathname } });
      }
    })();
    return () => { cancelled = true; };
  }, [location.pathname, loading, validate, navigate]);
  if (loading) return <Centered>로딩 중...</Centered>;
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return <Outlet />;
}

function MainLayout() {
  return (
    <AppContainer>
      <SidebarContainer>
        <Sidebar />
      </SidebarContainer>
      <ContentContainer>
        <Outlet />
      </ContentContainer>
    </AppContainer>
  );
}

function AuthLayout() {
  const { user } = useAuth();
  if (user) return <Navigate to="/" replace />;
  return (
    <AuthContainer>
      <AuthCard>
        <Outlet />
      </AuthCard>
    </AuthContainer>
  );
}

const Centered = styled.div`
  min-height: 100vh;
  display: grid;
  place-items: center;
  color: #6b7280;
`;

const AuthContainer = styled.div`
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: radial-gradient(1200px 600px at 10% 0%, #eef2ff 0%, #f9fafb 40%, #f9fafb 100%);
  padding: 32px;
`;

const fadeUp = keyframes`
  0% { opacity: 0; transform: translateY(8px) scale(0.995); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
`;

const AuthCard = styled.div`
  width: 100%;
  max-width: 560px;
  background: transparent; /* 경계 없는 스타일 */
  border-radius: 18px;
  padding: 20px;
  animation: ${fadeUp} 260ms ease-out;
`;
