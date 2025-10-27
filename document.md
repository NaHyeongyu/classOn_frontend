# Classon 프런트엔드 협업 가이드

## 목차

- [기본 정보](#기본-정보)
- [설치 · 실행](#설치--실행)
- [환경 변수](#환경-변수)
- [런타임 구조](#런타임-구조)
- [디렉터리 맵](#디렉터리-맵)
- [폴더·파일 규칙](#폴더파일-규칙)
- [도메인별 개요](#도메인별-개요)
- [데이터 통신 패턴](#데이터-통신-패턴)
- [코딩 규칙](#코딩-규칙)
- [디자인 토큰 요약](#디자인-토큰-요약)
- [품질 관리 체크리스트](#품질-관리-체크리스트)
- [빠른 레퍼런스](#빠른-레퍼런스)

---

## 기본 정보

- **범위**: `/frontend` 디렉터리. 모노레포 내 다른 앱(backend/mobile/face 등)은 별도 가이드 예정.
- **스택**
  - React 19 + TypeScript + Vite.
  - styled-components 테마(`src/styles/theme.ts`) 기반.
  - React Router v6, lazy-loaded routes.
  - 상태는 Context + 커스텀 훅으로 관리하며, 서버 데이터는 `lib/fetcher` + 로컬 캐시로 처리합니다. (`@tanstack/react-query` 패키지는 의존성에 포함되어 있으나 현재 직접 사용하지 않음)
- **경로 별칭**: `@/` → `src/` (예: `import Sidebar from "@/components/common/Sidebar"`).
- **언어**: UI 문구는 존댓말 한국어, 주석/문서는 한·영 혼용 허용(일관성 유지).

## 설치 · 실행

1. **Node**: 20 LTS 권장. `nvm use 20` 등으로 버전 맞춰 주세요.
2. **의존성**
   ```bash
   cd frontend
   npm install
   ```
3. **개발 서버**
   ```bash
   npm run dev
   ```
   - 기본 포트 5173. 충돌 시 `npm run dev -- --port 3000`.
4. **추가 스크립트**
   | 명령어 | 설명 |
   | --- | --- |
   | `npm run build` | 타입 체크 + 프로덕션 번들 |
   | `npm run build:staging` | `--mode staging` 번들 |
   | `npm run preview` | 빌드 결과 로컬 확인 |
   | `npm run lint` | ESLint (기존 누적 경고 다수 → 새 코드 무경고 유지) |

## 환경 변수

`.env.local` → `.env.staging` → 기본값 순으로 머지됩니다.

| 키                          | 용도                     | 기본값/비고                                    |
| --------------------------- | ------------------------ | ---------------------------------------------- |
| `VITE_API_BASE`             | API 베이스 URL           | 미지정 시 prod `https://api.myclasson.com/api` |
| `VITE_API_BASE_URL`         | 레거시 베이스 URL        | 존재하면 `VITE_API_BASE`보다 낮은 우선순위     |
| `VITE_USE_MOCK`             | 인증/요약 목 데이터 사용 | `"1"` 일 때만                                  |
| `VITE_FETCH_TIMEOUT_MS`     | 기본 요청 타임아웃       | 10000                                          |
| `VITE_FETCH_TTL_MS`         | GET 캐시 TTL             | 30000                                          |
| `VITE_USE_CANARY`           | 카나리아 헤더 첨부       | `"1"` 시 `X-Canary: 1`                         |
| `VITE_ENABLE_DEV_ROUTES`    | DevTools 노출 여부       | `"true"`                                       |
| `VITE_ENABLE_FEEDBACK`      | 피드백·체인지로그 표시   | `"true"`                                       |
| `VITE_APP_LOGO_PATH`        | 커스텀 로고 경로         | 기본 `/logo/logo.svg`                          |
| `VITE_BRIEF_TIMEOUT_MS`     | 브리핑 API 타임아웃      | 미설정 시 내부 기본값                          |
| `VITE_RENDER_TIMEOUT_MS`    | 렌더 API 타임아웃        | 미설정 시 내부 기본값                          |
| `VITE_SUMMARIZE_TIMEOUT_MS` | 요약 API 타임아웃        | 기본 60000                                     |

## 런타임 구조

- **엔트리**: `src/main.tsx`
  - `BrowserRouter`, `AuthProvider`, `styled-components ThemeProvider`, 전역 `ErrorBoundary`, `ToastProvider`.
- **라우팅**: `src/App.tsx`
  - `AuthLayout`(비로그인), `ProtectedLayout`(회원용), `MainLayout`(사이드바+헤더).
  - Lazy-loaded 페이지: Dashboard, Calendar, Students, Classes, Reports, Marketing, Admin 등.
  - Admin 전용 라우트는 `PublicLayout` 하위에서 `AdminAuthProvider` 기반으로 보호.
- **사이드바**: `src/components/common/Sidebar.tsx`
  - 라우트는 `src/routes.ts` 참고. `VITE_ENABLE_FEEDBACK` 플래그로 메뉴 제어.

## 디렉터리 맵

| 경로              | 설명                                                                                                                                       |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `src/api/`        | REST 래퍼(`fetchJSON`). `courses.ts`, `students.ts`, `calendar.ts`, `todos.ts`, `exams.ts`, `marketing*.ts`, `admin*.ts` 등 도메인별 파일. |
| `src/lib/`        | 인증 토큰(`auth.ts`), 관리자 인증(`adminAuth.ts`), fetch 헬퍼(`fetcher.ts`), 날짜/포맷 유틸.                                               |
| `src/hooks/`      | `useAuth`, `useAdminAuth`, `useMonthCalendar` 등 컨텍스트/도메인 훅.                                                                       |
| `src/components/` | UI 구성 요소. `common/`(버튼·모달·토스트·레이아웃), `calendar/`, `dashboard/`, `courses/`, `classes/`, `students/`, `admin/` 등으로 세분.  |
| `src/views/`      | 페이지별 UI 조합(프레젠테이션 레이어). `components`의 파츠를 배치하는 곳이며, 상태·네비게이션 로직은 포함하지 않음.                        |
| `src/pages/`      | 라우트별 컨테이너. `features` 훅으로 데이터를 준비하고 `views`를 호출해 화면을 그립니다.                                                 |
| `src/features/`   | 비즈니스 로직 모듈. `calendar`, `attendance`, `counsels`, `exams`, `todos`, `marketing`, `risk` 등.                                        |
| `src/styles/`     | 테마(`theme.ts`), 전역 초기화(`reset.css`, `index.css`), styled-components 타입 선언.                                                      |
| `src/types/`      | API 응답 및 공통 타입 선언.                                                                                                                |
| `public/`         | 정적 자산. 로고, 파비콘 등.                                                                                                                |

## 폴더·파일 규칙

- **기본 네이밍**
  - 디렉터리/파일명은 소문자-kebab-case (`course-record-detail`) 또는 PascalCase(컴포넌트)로 통일합니다.
  - 페이지 컴포넌트는 `src/pages/FooBar.tsx`, 하위 UI는 `src/components/<domain>/FooBar.tsx`.
  - 비즈니스 로직/훅은 `src/features/<domain>/<name>.ts` 혹은 `src/hooks/useFoo.ts`.
- **폴더 배치**
  - 페이지 레이어는 `src/pages`(데이터 연결), `src/views`(UI 조합), `src/components/<domain>`(단위 UI)로 역할을 나눕니다.
  - 도메인별로 `features/<domain>`, `components/<domain>`, `views/<domain>`를 대응시키고, API 래퍼는 `api/<domain>.ts`에 둡니다.
  - 공용 유틸은 `lib/`, 타입은 `types/`, 스타일 상수는 `styles/`에 위치시킵니다.
- **스타일 정의**
  - styled-components는 컴포넌트 파일 하단에 배치하고, 테마 토큰(`theme.colors`, `theme.spacing`)을 사용합니다.
- **문서화**
  - 새 도메인을 추가할 때 `document.md`의 디렉터리/도메인 표를 업데이트하고, 필요 시 `docs/` 하위에 상세 문서를 추가합니다.
- **주석 규칙**
  - 파일 상단에 한 줄짜리 한국어 주석으로 역할을 설명하고, 로직이 복잡한 블록에만 간결한 주석을 남깁니다.

## 도메인별 개요

- **캘린더 & 출결**

  - 페이지: `Calendar.tsx`, `CalendarDetail.tsx`.
  - 컴포넌트: `components/calendar/*` (헤더, 요일, 셀, 상세 레이아웃).
  - 출결 및 할 일 상태는 `features/calendar`, `features/attendance`, `api/calendar`, `api/attendance`, `api/todos` 조합으로 관리.
  - 캘린더 상세에서는 Drag & Drop 할 일 관리, 출결 토글, 상담 메모 입력이 가능.

- **수업 및 성적 관리**

  - 페이지: `Classes.tsx`, `CourseDetail.tsx`, `CourseRecordDetail.tsx`, `CourseStudentsEdit.tsx`, `CourseForm.tsx`.
  - `CourseRecordDetail.tsx` 핵심 기능
    - 출결, 수업 내용, 첨부파일, 시험/평가 성적 관리.
    - 수업 내용 · 시험 성적 입력 시 1.5초 지연 자동 저장. 수동 저장 버튼 제거 → 배지(`저장 중...`, `저장 완료!`)로 상태 확인.
    - 시험 성적 저장 시 `api/exams.ts` + `api/courses.ts` / `invalidateCacheByPrefix`로 캐시 갱신.
  - 첨부파일은 presigned URL (`presignRecordAttachment`, `confirmRecordAttachment`)로 업로드.

- **학생 & 리포트**

  - 페이지: `Students.tsx`, `StudentDetail.tsx`, `StudentForm.tsx`.
  - 리포트: `ReportCourse*`, `ReportStudent*`, `Report.tsx`.
  - 관련 API: `api/students.ts`, `api/courses.ts`, `api/exams.ts`, `api/brief.ts`(요약), `api/firstSummary.ts`.

- **마케팅 & 생성형 기능**

  - 페이지: `Marketing.tsx`, `MarketingPreview.tsx`, `MarketingGenerating.tsx`, `MarketingRendering.tsx`, `MarketingSummary.tsx`, `MarketingSaved*`.
  - API: `api/brief.ts`, `api/render.ts`, `api/marketingSaved.ts`.
  - 장문 요약/렌더링 시 `VITE_BRIEF_TIMEOUT_MS`, `VITE_RENDER_TIMEOUT_MS` 조정 가능.

- **관리자/운영**

  - 페이지: `Admin*.tsx`, `DevTools.tsx`, `Feedback.tsx`, `FeedbackChangelog.tsx`, `MyAcademy.tsx`.
  - 관리자 인증 컨텍스트: `hooks/useAdminAuth`.
  - `VITE_ENABLE_DEV_ROUTES`, `VITE_ENABLE_FEEDBACK` 플래그로 노출 제어.

- **공통 UI**
  - `components/common/UI.tsx`와 테마 값 사용. 버튼/입력/모달/로딩/토스트/RouteTransition 등 제공.
  - 토스트: `components/common/Toast`.
  - 에러 처리: `components/common/ErrorBoundary`.

## 데이터 통신 패턴

- 기본 래퍼: `lib/fetcher.ts`
  - `fetchJSON` 사용 → 자동으로 `Authorization`, `X-Canary` 헤더, ETag/TTL 캐시 처리.
  - GET 응답은 로컬스토리지 기반 캐시. `invalidateCache`, `invalidateCacheByPrefix`, `peekCache` 제공.
  - `NO_CACHE_PREFIXES`에 등록된 경로는 실시간 갱신.
  - 로컬 스토리지 접근 실패 대비 try/catch 처리되어 있어 브라우저 제약 고려 필요.
- API 파일들은 `fetchJSON`을 thin wrapper로 사용. 새로운 엔드포인트 추가 시 동일 패턴 유지.
- GraphQL 등은 사용하지 않으며, React Query는 의존성만 존재하고 실제 구현은 커스텀 캐시 기반.

## 코딩 규칙

- **타입/언어**
  - `any` 지양, 불가피하면 명확한 타입 가드 추가.
  - 사용자 노출 문구는 존댓말 한국어, 콘솔 출력을 남기지 말 것.
- **훅 규칙**: `useEffect`, `useMemo`, `useCallback` 의존성 정확히 기재. `eslint-plugin-react-hooks` 경고 해결.
- **레이아웃/스타일**
  - styled-components + 테마 토큰 사용 (`theme.colors`, `theme.spacing` 등). 임의 HEX/px 남용 금지.
  - 새 UI는 `components/common` 패턴 참고.
- **라우팅**
  - 상수는 `src/routes.ts` 사용. 문자열 하드코딩 지양.
  - 라우트 접근 제어는 `App.tsx` 측 레이아웃에서 처리.
- **데이터 갱신**
  - 수정 이후 관련 리스트 캐시 무효화 (`invalidateCache*`).
  - 자동 저장 기능이 있는 화면에서는 추가 수동 저장 버튼을 만들지 말고 기존 타이머/상태를 존중.
- **파일 구조**
  - 도메인별 폴더(`features/<domain>`, `components/<domain>`, `views/<domain>`, `pages`)에 맞춰 배치.
  - 페이지 파일은 데이터 로딩/라우팅만 담당하고, 화면 조합은 `views`에서 관리합니다.
  - 공통 유틸은 `lib/` 또는 `features/공통`.

## 디자인 토큰 요약

- 테마(`src/styles/theme.ts`)
  - **색상**: primary `#6C5CE7`, navy `#1F2937`, mint `#10B981`, 회색 단계(50~500), 상태색(success/danger/warning/info).
  - **폰트**: Pretendard 계열. 본문 14px, 소제목 18px, 페이지 제목 24px, 굵기 400/500/600/700.
  - **라운드**: 기본 12px, 버튼 10px, 소형 6px.
  - **그림자**: `low`, `medium`, `high`, `focusPrimary`.
  - **간격**: `spacing` 토큰(4~32px) 및 페이지 레이아웃 24px.
- 전역 스타일: `styles/reset.css`, `index.css`.
- 디자인 산출물은 Figma/디자인팀 레퍼런스 확인 필수.

## 품질 관리 체크리스트

- `npm run lint` (기존 경고 존재 → 수정 범위 내 무경고 유지, 새 규칙 추가 시 PR에서 공유).
- `npm run build` (TSC 통과 확인).
- 주요 플로우 수동 점검
  - 로그인/로그아웃/세션 복원.
  - 일정 캘린더 → 일정 상세 → 수업 기록 자동 저장.
  - 학생 상세 탭 이동, 리포트 생성/저장, 파일 업로드.
  - 마케팅 생성/저장 및 Saved 목록 확인.
- 캐시 무효화 검증: API 변경 후 캘린더/대시보드/리스트 즉시 반영되는지 확인.
- 접근 권한: 보호 라우트 접근 시 로그인, 관리자 라우트 접근 시 `useAdminAuth` 동작 확인.

## 빠른 레퍼런스

- **레이아웃 진입점**: `src/App.tsx`, `src/components/common/Sidebar.tsx`.
- **수업 기록 핵심**: `src/pages/CourseRecordDetail.tsx` (자동 저장 타이머, 출결/성적 관리).
- **달력 유틸**: `src/features/calendar/dateUtils.ts`, `src/hooks/useMonthCalendar.ts`.
- **API 캐시**: `src/lib/fetcher.ts` (`invalidateCacheByPrefix` 등).
- **공통 UI**: `src/components/common/UI.tsx`, `components/common/Toast.tsx`, `components/common/Modal.tsx`.
- **관리자 인증**: `src/hooks/useAdminAuth.ts`, `src/lib/adminAuth.ts`.
