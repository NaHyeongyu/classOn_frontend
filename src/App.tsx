/**
 * EN: Application root with route guards (auth) and base layouts (sidebar + content).
 * KO: 인증 가드와 기본 레이아웃(사이드바 + 콘텐츠)을 포함한 앱 루트 컴포넌트.
 */
import Sidebar from "@/components/common/Sidebar";
import { ToastProvider } from "@/components/common/Toast";
import styled from "styled-components";
import { Routes, Route, Outlet, Navigate, useLocation, useNavigate } from "react-router-dom";
import { Suspense, lazy, useEffect, useState } from "react";
import { useOutletContext } from "react-router";
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Calendar = lazy(() => import("@/pages/Calendar"));
const CalendarDetail = lazy(() => import("@/pages/CalendarDetail"));
const Students = lazy(() => import("@/pages/Students"));
const Classes = lazy(() => import("@/pages/Classes"));
const CourseForm = lazy(() => import("@/pages/CourseForm"));
const CourseDetail = lazy(() => import("@/pages/CourseDetail"));
const Materials = lazy(() => import("@/pages/Materials"));
const CourseStudentsEdit = lazy(() => import("@/pages/CourseStudentsEdit"));
const CourseRecordDetail = lazy(() => import("@/pages/CourseRecordDetail"));
const Attendance = lazy(() => import("@/pages/Attendance"));
const Reports = lazy(() => import("@/pages/Reports"));
// Payments/Banking routes removed for MVP
const Login = lazy(() => import("@/pages/Login"));
const Register = lazy(() => import("@/pages/Register"));
const TeacherHome = lazy(() => import("@/pages/TeacherHome"));
const TeacherProfile = lazy(() => import("@/pages/TeacherProfile"));
const TeacherDetail = lazy(() => import("@/pages/TeacherDetail"));
import { useAuth } from "@/hooks/useAuth";
const StudentDetail = lazy(() => import("@/pages/StudentDetail"));
const StudentForm = lazy(() => import("@/pages/StudentForm"));
const DevTools = lazy(() => import("@/pages/DevTools"));
const Marketing = lazy(() => import("@/pages/Marketing"));
const Payments = lazy(() => import("@/pages/Payments"));
const PaymentsCreate = lazy(() => import("@/pages/PaymentsCreate"));
const PaymentsKakaoConfirm = lazy(() => import("@/pages/PaymentsKakaoConfirm"));
const PaymentsKakaoSchedule = lazy(() => import("@/pages/PaymentsKakaoSchedule"));
const MarketingSummary = lazy(() => import("@/pages/MarketingSummary"));
const MarketingPreview = lazy(() => import("@/pages/MarketingPreview"));
const MarketingGenerating = lazy(() => import("@/pages/MarketingGenerating"));
const MarketingRendering = lazy(() => import("@/pages/MarketingRendering"));
const MarketingSavedList = lazy(() => import("@/pages/MarketingSavedList"));
const MarketingSavedDetail = lazy(() => import("@/pages/MarketingSavedDetail"));
const Feedback = lazy(() => import("@/pages/Feedback"));
const FeedbackChangelog = lazy(() => import("@/pages/FeedbackChangelog"));
const MyAcademy = lazy(() => import("@/pages/MyAcademy"));
const MyAcademyPlan = lazy(() => import("@/pages/MyAcademyPlan"));
const TeachersManage = lazy(() => import("@/pages/Teachers"));
const Admin = lazy(() => import("@/pages/Admin"));
const AdminLogin = lazy(() => import("@/pages/AdminLogin"));
const AdminLogins = lazy(() => import("@/pages/AdminLogins"));
const AdminApiLogs = lazy(() => import("@/pages/AdminApiLogs"));
const AdminOpenAiLogs = lazy(() => import("@/pages/AdminOpenAiLogs"));
const AdminPayments = lazy(() => import("@/pages/AdminPayments"));
const AdminStats = lazy(() => import("@/pages/AdminStats"));
const AdminAcademyDetail = lazy(() => import("@/pages/AdminAcademyDetail"));
const AdminFeedbacks = lazy(() => import("@/pages/AdminFeedbacks"));
const PaymentRequest = lazy(() => import("@/pages/PaymentRequest"));
const PaymentReceipt = lazy(() => import("@/pages/PaymentReceipt"));
const PaymentTossSuccess = lazy(() => import("@/pages/PaymentTossSuccess"));
const PaymentTossFail = lazy(() => import("@/pages/PaymentTossFail"));
import { PageLoading, LoadingSpinner } from "@/components/common/Loading";
import { RouteTransition, TopProgressBar } from "@/components/common/RouteTransition";
import { routes } from "@/routes";
import { apiGetMyAcademy } from "@/api/account";
import { apiGetSubscription } from "@/api/billing";
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
  const enableDev = import.meta.env.VITE_ENABLE_DEV_ROUTES === 'true';
  const enableFeedback = import.meta.env.VITE_ENABLE_FEEDBACK === 'true';
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
          <Route path={routes.home} element={<HomeLanding />} />
          <Route path={routes.teacherHome} element={<TeacherHome />} />
          <Route path={routes.teacherProfile} element={<TeacherProfile />} />
          <Route path={routes.teacherDetail} element={<TeacherDetail />} />
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
          <Route path={routes.materials} element={<Materials />} />
          <Route path={routes.classHistoryRecord} element={<CourseRecordDetail />} />
          <Route path={routes.classHistoryDate} element={<CourseRecordDetail />} />
          <Route path={routes.attendance} element={<Attendance />} />
          <Route path={routes.reports} element={<Reports />} />
          { /* 상담 전역 라우트 제거됨: 학생 상세 > 상담기록 탭에서 관리 */ }
          <Route path={routes.payments} element={<Payments />} />
          <Route path={routes.paymentsCreate} element={<PaymentsCreate />} />
          <Route path={routes.paymentsKakaoConfirm} element={<PaymentsKakaoConfirm />} />
          <Route path={routes.paymentsKakaoSchedule} element={<PaymentsKakaoSchedule />} />
          {enableDev && <Route path={routes.devTools} element={<DevTools />} />}
          <Route path={routes.marketing} element={<Marketing />} />
          { /* Marketing guide removed */ }
          <Route path={routes.marketingPreview} element={<MarketingPreview />} />
          <Route path={routes.marketingGenerating} element={<MarketingGenerating />} />
          <Route path={routes.marketingRendering} element={<MarketingRendering />} />
          <Route path={routes.marketingSummary} element={<MarketingSummary />} />
          <Route path={routes.marketingSaved} element={<MarketingSavedList />} />
          <Route path={routes.marketingSavedDetail} element={<MarketingSavedDetail />} />
          <Route path={routes.feedback} element={<Feedback />} />
          <Route path={routes.myAcademy} element={<MyAcademy />} />
          <Route path={routes.myAcademyPlan} element={<MyAcademyPlan />} />
          <Route path={routes.teachersManage} element={<TeachersManage />} />
          {enableFeedback && <Route path={routes.feedbackChangelog} element={<FeedbackChangelog />} />}
          { /* Todos page removed; manage todos within Calendar Detail */ }
        </Route>
      </Route>
      {/* Public (no auth) routes */}
      {/* Bare layout for standalone public pages (no inner containers) */}
      <Route element={<BareLayout />}>
        <Route path={routes.payRequestBlank} element={<PaymentRequest />} />
        <Route path={routes.payRequest} element={<PaymentRequest />} />
        <Route path={routes.invoiceViewerBlank} element={<PaymentRequest />} />
        <Route path={routes.invoiceViewer} element={<PaymentRequest />} />
        <Route path={routes.paymentsTossSuccess} element={<PaymentTossSuccess />} />
        <Route path={routes.paymentsTossFail} element={<PaymentTossFail />} />
        <Route path={routes.paymentsReceipt} element={<PaymentReceipt />} />
      </Route>

      <Route element={<PublicLayout />}>
        <Route element={<AdminProtectedLayout />}>
          <Route path={routes.admin} element={<Admin />} />
          <Route path={routes.admin + '/logins'} element={<AdminLogins />} />
          <Route path={routes.admin + '/api-logs'} element={<AdminApiLogs />} />
          <Route path={routes.admin + '/openai-logs'} element={<AdminOpenAiLogs />} />
          <Route path={routes.admin + '/payments'} element={<AdminPayments />} />
          <Route path={routes.admin + '/feedbacks'} element={<AdminFeedbacks />} />
          <Route path={routes.adminStats} element={<AdminStats />} />
          <Route path={routes.admin + '/academies/:id'} element={<AdminAcademyDetail />} />
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
  const [billingChecked, setBillingChecked] = useState(false);
  const [billingBlocked, setBillingBlocked] = useState(false);

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

  useEffect(() => {
    if (loading || !user) return;
    let alive = true;
    (async () => {
      try {
        const academy = await apiGetMyAcademy();
        const status = (academy.billingStatus || "").toUpperCase();
        const end = academy.billingCurrentPeriodEnd ? new Date(academy.billingCurrentPeriodEnd) : null;
        const now = new Date();
        const expired = end ? now > end : true; // end가 없으면 즉시 만료로 간주
        const inactive = ["PAST_DUE", "CANCELED", "INACTIVE"].includes(status);
        const trialExpired = status === "TRIALING" && expired;
        const activeExpired = status === "ACTIVE" && expired;
        let shouldBlock = trialExpired || inactive || activeExpired;

        // 구독 정보 기준으로 한 번 더 확인:
        // 서버 기준으로 Subscription이 ACTIVE이면 차단을 해제합니다.
        if (shouldBlock) {
          try {
            const sub = await apiGetSubscription();
            const status = typeof sub?.status === "string" ? sub.status.toUpperCase() : null;
            if (status === "ACTIVE") {
              shouldBlock = false;
            }
          } catch {
            // 구독 조회 실패는 무시 (academy 상태 기준 차단 유지)
          }
        }
        const allowedPaths: string[] = [routes.myAcademyPlan, routes.myAcademy];
        const onAllowed = allowedPaths.includes(location.pathname);
        if (alive && shouldBlock) {
          setBillingBlocked(true);
          if (!onAllowed) {
            navigate(routes.myAcademyPlan, { replace: true, state: { reason: "billing-block" } });
          }
        } else if (alive) {
          setBillingBlocked(false);
        }
      } catch {
        // ignore billing check errors to avoid locking out on transient failure
      } finally {
        if (alive) setBillingChecked(true);
      }
    })();
    return () => { alive = false; };
  }, [loading, user, navigate, location.pathname, location.search]);

  useEffect(() => {
    if (!loading && !user) {
      setBillingChecked(true);
    }
  }, [loading, user]);

  if (loading || !billingChecked) {
    return (
      <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", color: "#6b7280" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <LoadingSpinner />
          <span>로딩 중…</span>
        </div>
      </div>
    );
  }
  if (!user) return <Navigate to={routes.login} replace state={{ from: location.pathname }} />;
  return <Outlet context={{ billingBlocked }} />;
}

function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const outletContext = useOutletContext<{ billingBlocked?: boolean } | null>();
  const billingBlocked = Boolean(outletContext?.billingBlocked);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  return (
    <AppContainer>
      <TopProgressBar />
      {!billingBlocked && (
        <SidebarContainer data-open={sidebarOpen || undefined}>
          <Sidebar onNavigate={() => setSidebarOpen(false)} />
        </SidebarContainer>
      )}
      {!billingBlocked && sidebarOpen && <MobileOverlay onClick={() => setSidebarOpen(false)} />}
      <ContentContainer>
        <ContentInner>
          {!billingBlocked && (
            <TopBar>
              <MenuBtn onClick={() => setSidebarOpen(s => !s)}>☰ 메뉴</MenuBtn>
              <div />
            </TopBar>
          )}
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

function HomeLanding() {
  const { user } = useAuth();
  const menus = Array.isArray(user?.menus)
    ? user?.menus.map((key) => (typeof key === "string" ? key.trim().toUpperCase() : String(key))).filter(Boolean)
    : [];
  const hasTeacherDashboard = menus.includes("DASHBOARD");
  if (user?.role === "TEACHER" && !hasTeacherDashboard) {
    return <Navigate to={routes.teacherHome} replace />;
  }
  return <Dashboard />;
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

function BareLayout() {
  // No wrappers, full-bleed content (used by public pay page)
  return <Outlet />;
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
  const { user, loading } = useAuth();
  if (loading) return <PageLoading />;
  if (user) return <Navigate to={routes.home} replace />;
  return <Outlet />;
}

// AuthLayout intentionally has no additional full-page background or card wrapper
// so that each auth page (login/register) can define its own layout.
