# ClassOn 프런트엔드

React 19 + TypeScript + Vite 기반의 ClassOn 웹 프런트엔드입니다. 학원 관리자/강사/운영자용 기능을 제공하며, styled-components 테마와 커스텀 `fetchJSON` 래퍼로 데이터를 주고받습니다.

## 주요 기능

- 학원 운영 대시보드, 일정·출결·수업 관리, 학생/리포트, 마케팅 자동화
- 관리자·소유자 전용 운영 도구(Admin, DevTools, Feedback)
- 강사 전용 경로: `TeacherHome`(담당 수업/연락처 개요), `TeacherProfile`(개인 정보·비밀번호 관리)
- 강사 역할 전용 사이드바 메뉴 화이트리스트 및 `instructorId` 필수 수업 편집 플로우

## 개발 환경

- Node.js 20 LTS 권장 (`nvm use 20`)
- 패키지 설치: `npm install`
- 개발 서버: `npm run dev` (기본 포트 5173)
- 환경 변수: `.env.local` → `.env.staging` → 기본값 순으로 병합
  - `VITE_API_BASE`, `VITE_USE_MOCK`, `VITE_ENABLE_FEEDBACK`, `VITE_ENABLE_DEV_ROUTES` 등

## 자주 사용하는 스크립트

| 명령어 | 설명 |
| --- | --- |
| `npm run dev` | 개발 서버 실행(HMR) |
| `npm run build` | 타입 체크 + 프로덕션 번들 생성 |
| `npm run preview` | 빌드 결과 로컬 미리보기 |
| `npm run lint` | ESLint 실행 (기존 경고는 남아 있으므로 새 코드 무경고 유지) |

## 디렉터리 하이라이트

- `src/api/teachers.ts`: 강사 목록/프로필/비밀번호 변경 API 래퍼, 강사 관련 변경 시 `/api/academy/teachers` 캐시 무효화 및 `teachers:refresh` 커스텀 이벤트 발행
- `src/features/teacher/useTeacherProfile.ts`: 강사 홈·프로필 페이지에서 공통으로 사용하는 데이터 훅
- `src/views/teacher/*`: 강사 전용 페이지 UI(View 레이어)
- `src/components/common/UI.tsx`: 프로젝트 전역 UI 토큰 및 버튼/테이블 등 공용 컴포넌트
- `packages/shared-types/src/index.ts`: 백엔드 DTO와 맞춘 공유 타입(`Course.instructorId`, `CourseRecord.instructorName` 등)

## 강사 역할 연동 체크리스트

1. 인증 응답(`AuthUser`)의 `role`, `menus`가 프런트 컨텍스트에 저장되는지 확인 (`useAuth` 부트스트랩)
2. 강사 계정 로그인 시 `/` → `/teacher`로 리디렉션되는지 점검 (`HomeLanding`)
3. 사이드바에서 강사 허용 메뉴(일정/원생/수업/출결/결제)만 노출되는지 확인 (`Sidebar`)
4. 수업 생성/수정 화면에서 `instructorId`가 필수로 전달되고, 강사 목록이 `/api/academy/teachers`에서 로드되는지 검증
5. `TeacherHome` 페이지에서 담당 수업 리스트가 올바르게 렌더링되고 상세 보기로 이동 가능한지 확인
6. `TeacherProfile` 페이지에서 연락처 변경 및 비밀번호 변경 플로우를 QA (성공 토스트·에러 메시지 포함)

## 품질 가이드

- 새 기능을 추가할 때 `document.md`에 디렉터리·플로우 업데이트를 남깁니다.
- ESLint 경고(`any`, 훅 의존성 등)를 가능하면 즉시 해소하고, 추가 규칙이 필요하면 PR에 명시합니다.
- 주요 플로우 QA: 로그인/세션 복구 → 강사 홈/수업 편집 → 관리자 탭(Navigation)
- 캐시 무효화(`invalidateCacheByPrefix`)가 필요한 API 수정 시 캘린더/대시보드 반영 여부를 꼭 확인하세요.
