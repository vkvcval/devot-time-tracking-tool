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

export type Task = {
  uid: string;
  description: string;
  userUid: string;
  startDate: string;
  endDate: string | null;
  loggedSeconds: number;
  status: TaskStatus;
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
