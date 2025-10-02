/**
 * EN: Application root with route guards (auth) and base layouts (sidebar + content).
 * KO: 인증 가드와 기본 레이아웃(사이드바 + 콘텐츠)을 포함한 앱 루트 컴포넌트.
 */
import Sidebar from "@/components/common/Sidebar";
import { ToastProvider } from "@/components/common/Toast";
import styled, { keyframes } from "styled-components";
import { Routes, Route, Outlet, Navigate, useLocation, useNavigate } from "react-router-dom";
import { Suspense, lazy, useEffect, useState } from "react";
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Calendar = lazy(() => import("@/pages/Calendar"));
const CalendarDetail = lazy(() => import("@/pages/CalendarDetail"));
const Students = lazy(() => import("@/pages/Students"));
const Classes = lazy(() => import("@/pages/Classes"));
const CourseForm = lazy(() => import("@/pages/CourseForm"));
const CourseDetail = lazy(() => import("@/pages/CourseDetail"));
const CourseStudentsEdit = lazy(() => import("@/pages/CourseStudentsEdit"));
const CourseRecordDetail = lazy(() => import("@/pages/CourseRecordDetail"));
// Payments/Banking routes removed for MVP
const Login = lazy(() => import("@/pages/Login"));
const Register = lazy(() => import("@/pages/Register"));
import { useAuth } from "@/hooks/useAuth";
const StudentDetail = lazy(() => import("@/pages/StudentDetail"));
const StudentForm = lazy(() => import("@/pages/StudentForm"));
const DevTools = lazy(() => import("@/pages/DevTools"));
const Marketing = lazy(() => import("@/pages/Marketing"));
const PaymentsWip = lazy(() => import("@/pages/PaymentsWip"));
const MarketingSummary = lazy(() => import("@/pages/MarketingSummary"));
const MarketingGuide = lazy(() => import("@/pages/MarketingGuide"));
const MarketingPreview = lazy(() => import("@/pages/MarketingPreview"));
const MarketingGenerating = lazy(() => import("@/pages/MarketingGenerating"));
const MarketingRendering = lazy(() => import("@/pages/MarketingRendering"));
const MarketingSavedList = lazy(() => import("@/pages/MarketingSavedList"));
const MarketingSavedDetail = lazy(() => import("@/pages/MarketingSavedDetail"));
const Admin = lazy(() => import("@/pages/Admin"));
const AdminLogin = lazy(() => import("@/pages/AdminLogin"));
const AdminLogins = lazy(() => import("@/pages/AdminLogins"));
import { PageLoading, LoadingSpinner } from "@/components/common/Loading";
import { RouteTransition, TopProgressBar } from "@/components/common/RouteTransition";
import { routes } from "@/routes";
// 상담 전역 페이지는 학생 상세 내 탭으로 통합됨

const AppContainer = styled.div`
  display: flex;
`;
const SidebarContainer = styled.aside`
  width: 220px; /* match Sidebar fixed width */
  flex: 0 0 220px;
  @media (max-width: 1024px) {
    position: fixed;
    inset: 0 auto 0 0;
    z-index: 60;
    transform: translateX(-100%);
    transition: transform .2s ease;
    flex: 0 0 auto;
    &[data-open="true"] { transform: translateX(0); }
  }
`;
const ContentContainer = styled.main`
  flex: 1;
  min-width: 0; /* prevent flex overflow */
  min-height: 100vh;
  background: #ffffff;
  padding: 24px;
  overflow-x: hidden; /* confine horizontal scroll within inner scrollers */
`;
const ContentInner = styled.div`
  /* Center content and cap max width for visual balance */
  width: 100%;
  max-width: 1360px;
  margin: 0 auto;
  padding: 0 8px; /* gentle side gutters */
  @media (min-width: 1536px) {
    max-width: 1480px;
  }
  @media (max-width: 768px) {
    padding: 0; /* rely on main container padding on small screens */
  }
`;
const MobileOverlay = styled.div`
  display: none;
  @media (max-width: 1024px) {
    position: fixed; inset: 0; background: rgba(0,0,0,0.35); z-index: 50; display: block;
  }
`;
const TopBar = styled.div`
  display: grid; grid-template-columns: auto 1fr; gap: 10px; align-items: center; margin-bottom: 10px;
`;
const MenuBtn = styled.button`
  height: 40px; padding: 0 16px; border-radius: 10px; border: 1px solid #e5e7eb; background: #fff; font-weight: 700; cursor: pointer;
  @media (min-width: 1025px) { display: none; }
`;

import { AdminAuthProvider, useAdminAuth } from "@/hooks/useAdminAuth";

export default function App() {
  const enableDev = (import.meta as any).env?.VITE_ENABLE_DEV_ROUTES === 'true';
  return (
    <ToastProvider>
    <AdminAuthProvider>
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path={routes.login} element={<Login />} />
        <Route path={routes.register} element={<Register />} />
      </Route>

      <Route element={<ProtectedLayout />}>
        <Route element={<MainLayout />}>
          <Route path={routes.home} element={<Dashboard />} />
          <Route path={routes.calendar} element={<Calendar />} />
          <Route path={routes.calendarDetail} element={<CalendarDetail />} />
          <Route path={routes.students} element={<Students />} />
          <Route path={routes.studentsNew} element={<StudentForm />} />
          <Route path={routes.studentsEdit} element={<StudentForm />} />
          <Route path={routes.studentsDetailTab} element={<StudentDetail />} />
          <Route path={routes.studentsDetail} element={<StudentDetail />} />
          <Route path={routes.classes} element={<Classes />} />
          <Route path={routes.classesNew} element={<CourseForm />} />
          <Route path={routes.classesEdit} element={<CourseForm />} />
          <Route path={routes.classesEditStudents} element={<CourseStudentsEdit />} />
          <Route path={routes.classesDetail} element={<CourseDetail />} />
          <Route path={routes.classesDetailTab} element={<CourseDetail />} />
          <Route path={routes.classHistoryRecord} element={<CourseRecordDetail />} />
          <Route path={routes.classHistoryDate} element={<CourseRecordDetail />} />
          { /* 상담 전역 라우트 제거됨: 학생 상세 > 상담기록 탭에서 관리 */ }
          <Route path={routes.payments} element={<PaymentsWip />} />
          {enableDev && <Route path={routes.devTools} element={<DevTools />} />}
          <Route path={routes.marketing} element={<Marketing />} />
          <Route path={routes.marketingGuide} element={<MarketingGuide />} />
          <Route path={routes.marketingPreview} element={<MarketingPreview />} />
          <Route path={routes.marketingGenerating} element={<MarketingGenerating />} />
          <Route path={routes.marketingRendering} element={<MarketingRendering />} />
          <Route path={routes.marketingSummary} element={<MarketingSummary />} />
          <Route path={routes.marketingSaved} element={<MarketingSavedList />} />
          <Route path={routes.marketingSavedDetail} element={<MarketingSavedDetail />} />
          { /* Todos page removed; manage todos within Calendar Detail */ }
        </Route>
      </Route>
      {/* Public (no auth) routes */}
      <Route element={<PublicLayout />}>
        <Route element={<AdminProtectedLayout />}>
          <Route path={routes.admin} element={<Admin />} />
          <Route path={routes.admin + '/logins'} element={<AdminLogins />} />
        </Route>
        <Route path={routes.admin + '/login'} element={<AdminLogin />} />
      </Route>
    </Routes>
    </AdminAuthProvider>
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
        navigate(routes.login, { replace: true, state: { from: location.pathname } });
      }
    })();
    return () => { cancelled = true; };
  }, [location.pathname, loading, validate, navigate]);
  if (loading) return <Centered><LoadingSpinner /><span style={{marginTop: 8, color:'#6b7280'}}>로딩 중…</span></Centered>;
  if (!user) return <Navigate to={routes.login} replace state={{ from: location.pathname }} />;
  return <Outlet />;
}

function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <AppContainer>
      <TopProgressBar />
      <SidebarContainer data-open={sidebarOpen || undefined}>
        <Sidebar />
      </SidebarContainer>
      {sidebarOpen && <MobileOverlay onClick={() => setSidebarOpen(false)} />}
      <ContentContainer>
        <ContentInner>
          <TopBar>
            <MenuBtn onClick={() => setSidebarOpen(s => !s)}>☰ 메뉴</MenuBtn>
            <div />
          </TopBar>
          <RouteTransition>
            <Suspense fallback={<PageLoading />}> 
              <Outlet />
            </Suspense>
          </RouteTransition>
        </ContentInner>
      </ContentContainer>
    </AppContainer>
  );
}

function PublicLayout() {
  return (
    <ContentContainer>
      <ContentInner>
        <RouteTransition>
          <Suspense fallback={<PageLoading />}> 
            <Outlet />
          </Suspense>
        </RouteTransition>
      </ContentInner>
    </ContentContainer>
  );
}

function AdminProtectedLayout() {
  const { admin, loading, validate } = useAdminAuth();
  const location = useLocation();
  useEffect(() => { if (!loading && !admin) { void validate(); } }, [loading, admin, validate]);
  if (loading) return <PageLoading />;
  if (!admin) return <Navigate to={routes.admin + '/login'} replace state={{ from: location.pathname }} />;
  return <Outlet />;
}

function AuthLayout() {
  const { user } = useAuth();
  if (user) return <Navigate to={routes.home} replace />;
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
