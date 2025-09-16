# 개발 작업 가이드 (Work Log & Guide)

이 문서는 이번 프론트엔드 작업 전반의 변경 사항, 폴더 구조, 사용법, 확장 포인트를 정리한 가이드입니다. (This document summarizes all frontend changes, structure, usage, and extension points.)

## 개요 (Overview)
- 앱 루트/라우팅 구조 정리 및 인증 가드 추가
- 사이드바·대시보드·캘린더(월/일) 화면 구현 및 리팩터링
- 할 일(Todos) 디자인/동작 개선: 일정 상세 + 대시보드 위젯
- 스타일 가다듬기: 로그인/회원가입/위젯/카드, 일관된 톤
- 코드 분리(레이아웃 vs 피처) 및 일부 파일 정리/삭제

## 실행/환경 (Run & Env)
- 개발 실행: `npm run dev`
- 환경 변수(Environment variables)
  - `VITE_API_BASE_URL`: 백엔드 API 베이스 URL (ex. `https://api.example.com`)
  - `VITE_USE_MOCK=1`: 인증/대시보드 요약 API 실패 시 목 데이터 사용 (dev 편의)
  - `VITE_FETCH_TIMEOUT_MS`: fetch 기본 타임아웃(ms, 기본 10000)

## 라우팅/레이아웃 (Routing & Layout)
- `src/App.tsx`
  - 인증 가드(ProtectedLayout), 비로그인 레이아웃(AuthLayout), 메인 레이아웃(MainLayout) 분리
  - 라우트
    - `/` 대시보드 (Dashboard)
    - `/calendar` 월간 캘린더 (Calendar)
    - `/calendar/:ymd` 일정 상세 (CalendarDetail)
    - `/students`, `/classes`, `/payments` 플레이스홀더 페이지
  - 사이드바는 항상 좌측 고정, 콘텐츠만 전환

## 인증 (Auth)
- `src/lib/auth.ts`: 토큰 보관/조회/삭제 (localStorage)
- `src/lib/fetcher.ts`: `Authorization: Bearer <token>` 헤더 자동 첨부
- `src/api/auth.ts`: 로그인/회원가입/내 정보(me) API + `VITE_USE_MOCK` 지원
- `src/hooks/useAuth.tsx`: 전역 AuthProvider (로그인/회원가입/로그아웃/부팅 복원)

## 공통 스타일 (Global Styles)
- `src/index.css`: 루트 높이/배경 등 기본값
- 로그인/회원가입 폼: 테두리 없는 채움형 입력, 포커스 하이라이트, 카드 애니메이션

## 사이드바 (Sidebar)
- `src/components/common/Sidebar.tsx`
  - NavLink 기반 액티브 하이라이트
  - 하단 사용자 정보·로그아웃 버튼 배치

## 대시보드 (Dashboard)
- `src/pages/Dashboard.tsx`
  - KPI 4종: `KpiTotalStudents`, `KpiRevenue`, `KpiAttendance`, `KpiClasses`
  - 레이아웃 컴포넌트: `src/components/dashboard/DashboardLayout.tsx` (12컬럼 그리드 + 패널)
  - 오늘 할 일 위젯(우측 패널): `src/components/dashboard/DashboardTodos.tsx`
    - API `listTodosByDate` 로 오늘 할 일 가져오기
    - 체크박스 + 보라 도트, 제목 1줄/내용 2줄 클램프
    - 고정 높이(60px)로 항목 길이에 따른 흔들림 방지

## 캘린더 – 월간 (Calendar – Month View)
- `src/pages/Calendar.tsx`: 페이지 컨테이너 (레이아웃/렌더만)
- 분리 컴포넌트
  - `src/components/calendar/CalendarHeader.tsx`: 상단 헤더(제목/월 네비게이션)
  - `src/components/calendar/Weekdays.tsx`: 요일 행
  - `src/components/calendar/CalendarGrid.tsx`: 7×6 셀 그리드 + 이벤트 Pill
- 유틸/훅
  - `src/features/calendar/dateUtils.ts`: `buildMonthMatrix`, `formatYMD`, `parseYMD` 등
  - `src/hooks/useMonthCalendar.ts`: 월 전환/행렬 생성 훅
- 디자인 포인트: 경계감 최소화, 스크롤 없는 뷰포트 맞춤, 오늘 강조

## 캘린더 – 일정 상세 (Calendar – Day Detail)
- `src/pages/CalendarDetail.tsx` (컨테이너)
- 레이아웃
  - `src/components/calendar/detail/DetailLayout.tsx`: `DetailPage/Columns/Left/Right`
  - 좌측 5:5(=1:1) 비율로 조정
- 헤더
  - `src/components/calendar/detail/CalendarDetailHeader.tsx`: 돌아가기/오늘/이전/다음
- 섹션
  - 수업: `ClassList.tsx`
  - 상담: `CounselList.tsx`
  - 할 일: `TodoList.tsx`
    - 드래그 정렬(동일 리스트 재정렬, 교차 이동 시 상태 토글 콜백 호출)
    - 버튼 텍스트 ‘수정/삭제’(내부 글꼴 12px)
    - 좌측 드래그 핸들 제거, 카드 좌측 보라 라인 제거(더 뉴트럴)
    - 내용은 최대 8줄 표시(white-space: pre-line), 긴 내용도 가독성 유지
    - 상단 ‘+ 할일 추가’ 버튼은 그라디언트/그림자 스타일
  - 모달(추가/수정): 페이지 내에 간단 구현
- Todo API 연동: `src/api/todos.ts`
  - `listTodosByDate`, `createTodo`, `updateTodo`, `completeTodo`, `deleteTodo`

## 파일 정리 (Cleanups)
- 삭제
  - `src/components/dashboard/TodayTodosPanel.tsx` (래퍼 제거, 직접 사용)
  - `src/hooks/useDashboardTodos.ts` (API 기반으로 대체)
- 주석(영/한) 추가
  - `src/App.tsx`, `src/components/dashboard/DashboardTodos.tsx`, `src/components/calendar/detail/TodoList.tsx` 등

## 확장 포인트 (Next Steps)
- 상태/데이터 일원화: React Query/SWR 도입 시 API 캐시/동기화 단순화
- 공통 디자인 토큰: 컬러/타이포/라운딩/그림자 컴포넌트화
- 캘린더/대시보드에서 동일 Todo 소스 사용 시 동기 업데이트 적용
- 드래그 정렬 결과 영속화: `onReorder` 콜백 + API 저장

## 디렉터리/파일 참조 (Key Files)
- 라우팅/루트: `src/App.tsx`
- 인증: `src/lib/auth.ts`, `src/hooks/useAuth.tsx`, `src/api/auth.ts`, `src/lib/fetcher.ts`
- 대시보드: `src/pages/Dashboard.tsx`, `src/components/dashboard/*`
- 캘린더(월): `src/pages/Calendar.tsx`, `src/components/calendar/*`, `src/hooks/useMonthCalendar.ts`, `src/features/calendar/dateUtils.ts`
- 캘린더(일): `src/pages/CalendarDetail.tsx`, `src/components/calendar/detail/*`
- Todo API: `src/api/todos.ts`

---
문의/개선사항은 섹션/파일 단위로 메모 남겨 주세요. (For any questions or follow-ups, leave notes per section/file.)
