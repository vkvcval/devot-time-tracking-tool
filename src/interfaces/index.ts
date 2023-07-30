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
  startDate: string;
  userUid: string;
};

export type ActiveTask = {
  activeTaskUid: string;
};
