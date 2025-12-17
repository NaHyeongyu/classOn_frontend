// Centralized route paths and URL builders

export const routes = {
  home: '/',
  login: '/login',
  register: '/register',
  myAcademy: '/my-academy',
  myAcademyPlan: '/my-academy/plan',

  calendar: '/calendar',
  calendarDetail: '/calendar/:ymd',

  students: '/students',
  studentsNew: '/students/new',
  studentsEdit: '/students/:id/edit',
  studentsDetail: '/students/:id',
  studentsDetailTab: '/students/:id/:tab',

  classes: '/classes',
  classesNew: '/classes/new',
  classesEdit: '/classes/:id/edit',
  classesEditStudents: '/classes/:id/edit-students',
  classesDetail: '/classes/:id',
  classesDetailTab: '/classes/:id/:tab',
  classHistoryRecord: '/classes/:id/history/:recordId',
  classHistoryDate: '/classes/:id/history/date/:ymd',

  attendance: '/attendance',
  materials: '/materials',
  reports: '/reports',
  reportsKakaoConfirm: '/reports/kakao-confirm',

  payments: '/payments',
  paymentsCreate: '/payments/create',
  paymentsKakaoConfirm: '/payments/kakao-confirm',
  paymentsKakaoSchedule: '/payments/kakao-schedule',
  paymentsReceipt: '/payments/receipt',
  paymentsTossSuccess: '/payments/toss-success',
  paymentsTossFail: '/payments/toss-fail',
  teachersManage: '/teachers',
  // Public payment request (no auth)
  payRequest: '/pay/:token',
  payRequestBlank: '/pay',
  invoiceViewer: '/invoice/:token',
  invoiceViewerBlank: '/invoice',
  devTools: '/dev-tools',
  admin: '/admin',
  adminStats: '/admin/stats',

  marketing: '/marketing',
  marketingPreview: '/marketing/preview',
  marketingGenerating: '/marketing/generating',
  marketingRendering: '/marketing/rendering',
  marketingSummary: '/marketing/summary',
  marketingSaved: '/marketing/saved',
  marketingSavedDetail: '/marketing/saved/:id',
  feedback: '/feedback',
  feedbackChangelog: '/feedback/changelog',

  teacherHome: '/teacher',
  teacherClasses: '/teacher/classes',
  teacherProfile: '/teacher/profile',
  teacherDetail: '/my-academy/teachers/:id',
} as const;

export const paths = {
  calendarDetail: (ymd: string) => `/calendar/${ymd}`,
  students: {
    detail: (id: string | number) => `/students/${id}`,
    detailTab: (id: string | number, tab: string) => `/students/${id}/${tab}`,
    edit: (id: string | number) => `/students/${id}/edit`,
  },
  payments: {
    create: () => '/payments/create',
    kakaoConfirm: (params?: { ids?: string; template?: string }) => {
      const sp = new URLSearchParams();
      if (params?.ids && params.ids.trim()) sp.set("ids", params.ids.trim());
      if (params?.template && params.template.trim()) sp.set("template", params.template.trim());
      const qs = sp.toString();
      return qs ? `/payments/kakao-confirm?${qs}` : `/payments/kakao-confirm`;
    },
    kakaoSchedule: (params?: { ids?: string; template?: string }) => {
      const sp = new URLSearchParams();
      if (params?.ids && params.ids.trim()) sp.set("ids", params.ids.trim());
      if (params?.template && params.template.trim()) sp.set("template", params.template.trim());
      const qs = sp.toString();
      return qs ? `/payments/kakao-schedule?${qs}` : `/payments/kakao-schedule`;
    },
  },
  reports: {
    kakaoConfirm: (params: { selection: Array<{ studentId: number; reportId: number }>; courseName?: string }) => {
      const sp = new URLSearchParams();
      if (params.selection.length) {
        const selectionParam = params.selection.map(({ studentId, reportId }) => `${studentId}:${reportId}`).join(",");
        sp.set("selection", selectionParam);
      }
      if (params.courseName && params.courseName.trim()) {
        sp.set("courseName", params.courseName.trim());
      }
      const qs = sp.toString();
      return qs ? `/reports/kakao-confirm?${qs}` : `/reports/kakao-confirm`;
    },
  },
  classes: {
    detail: (id: string | number) => `/classes/${id}`,
    detailTab: (id: string | number, tab: string) => `/classes/${id}/${tab}`,
    edit: (id: string | number) => `/classes/${id}/edit`,
    editStudents: (id: string | number) => `/classes/${id}/edit-students`,
    historyRecord: (id: string | number, recordId: string | number) => `/classes/${id}/history/${recordId}`,
    historyDate: (id: string | number, ymd: string) => `/classes/${id}/history/date/${ymd}`,
  },
  teachers: {
    detail: (id: string | number) => `/my-academy/teachers/${id}`,
  },
} as const;
