export const pages = {
  HISTORY: 'tracking/history',
  TODAY: 'tracking/today',
  SIGN_IN: 'sign-in',
  SIGN_UP: 'sign-up',
} as const;

export type PageType = (typeof pages)[keyof typeof pages];

export const task_status = {
  RUNNING: 'RUNNING',
  COMPLETED: 'COMPLETED',
} as const;

export type TaskStatus = (typeof task_status)[keyof typeof task_status];

export const table_action = {
  START: 'START',
  PAUSE: 'PAUSE',
  STOP: 'STOP',
  EDIT: 'EDIT',
  DELETE: 'DELETE',
} as const;

export type TableAction = (typeof table_action)[keyof typeof table_action];

export const items_per_page = 10;
