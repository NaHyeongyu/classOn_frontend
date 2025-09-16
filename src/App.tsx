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

const AppContainer = styled.div`
  display: flex;
`;
const SidebarContainer = styled.aside`
  width: 264px; /* match Sidebar fixed width */
  flex: 0 0 264px;
`;
const ContentContainer = styled.main`
  flex: 1;
  min-height: 100vh;
  background: #ffffff;
  padding: 24px;
`;

export default function App() {
  return (
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
          <Route path="/payments" element={<Payments />} />
          <Route path="/payments/success" element={<PaymentSuccess />} />
          <Route path="/payments/fail" element={<PaymentFail />} />
          <Route path="/dev-tools" element={<DevTools />} />
          { /* Todos page removed; manage todos within Calendar Detail */ }
        </Route>
      </Route>
    </Routes>
  );
}

function ProtectedLayout() {
  const { user, loading } = useAuth();
  const location = useLocation();
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
