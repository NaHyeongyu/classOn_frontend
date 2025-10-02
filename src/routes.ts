// Centralized route paths and URL builders

export const routes = {
  home: '/',
  login: '/login',
  register: '/register',

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

  payments: '/payments',
  devTools: '/dev-tools',
  admin: '/admin',

  marketing: '/marketing',
  marketingGuide: '/marketing/guide',
  marketingPreview: '/marketing/preview',
  marketingGenerating: '/marketing/generating',
  marketingRendering: '/marketing/rendering',
  marketingSummary: '/marketing/summary',
  marketingSaved: '/marketing/saved',
  marketingSavedDetail: '/marketing/saved/:id',
} as const;

export const paths = {
  calendarDetail: (ymd: string) => `/calendar/${ymd}`,
  students: {
    detail: (id: string | number) => `/students/${id}`,
    detailTab: (id: string | number, tab: string) => `/students/${id}/${tab}`,
    edit: (id: string | number) => `/students/${id}/edit`,
  },
  classes: {
    detail: (id: string | number) => `/classes/${id}`,
    detailTab: (id: string | number, tab: string) => `/classes/${id}/${tab}`,
    edit: (id: string | number) => `/classes/${id}/edit`,
    editStudents: (id: string | number) => `/classes/${id}/edit-students`,
    historyRecord: (id: string | number, recordId: string | number) => `/classes/${id}/history/${recordId}`,
    historyDate: (id: string | number, ymd: string) => `/classes/${id}/history/date/${ymd}`,
  },
} as const;
