export const pages = {
  HISTORY: 'tracking/history',
  TODAY: 'tracking/today',
  SIGN_IN: 'sign-in',
  SIGN_UP: 'sign-up',
} as const;

export type PageType = (typeof pages)[keyof typeof pages];

export const timerStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
} as const;

export type TimerStatus = (typeof timerStatus)[keyof typeof timerStatus];

export const tableAction = {
  PLAY_PAUSE: 'PLAY_PAUSE',
  STOP: 'STOP',
  EDIT: 'EDIT',
  DELETE: 'DELETE',
} as const;

export type TableAction = (typeof tableAction)[keyof typeof tableAction];
