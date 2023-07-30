export const pages = {
  HISTORY: 'tracking/history',
  TODAY: 'tracking/today',
  SIGN_IN: 'sign-in',
  SIGN_UP: 'sign-up',
} as const;

export type PageType = (typeof pages)[keyof typeof pages];
