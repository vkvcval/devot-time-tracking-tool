import { TaskStatus } from '@/lib/constants';

export type IconType =
  | 'TimeIcon'
  | 'LeftIcon'
  | 'CalendarIcon'
  | 'EditIcon'
  | 'HistoryIcon'
  | 'PauseIcon'
  | 'PlayIcon'
  | 'StopIcon'
  | 'WatchIcon'
  | 'TrashIcon'
  | 'TurnOffIcon'
  | 'UserIcon';

export type NewTask = {
  description: string;
  userUid: string;
  startDate: string;
  endDate: string | null;
  loggedSeconds: number;
  status: TaskStatus;
  timestamp: number;
};

export type Task = NewTask & {
  uid: string;
};

export type ActiveTask = {
  activeTaskUid: string;
};

export type UpdateTaskData = {
  description?: string;
  endDate?: string | null;
  loggedSeconds?: number;
  status?: TaskStatus;
};
