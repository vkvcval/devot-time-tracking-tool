import styles from './TableActions.module.scss';
import ActionButton from '@components/buttons/actionButton';
import { TableAction, TimerStatus, tableAction, timerStatus } from '@/lib/constants';

type Props = {
  uid: string;
  state: TimerStatus;
  className?: string;
  onClick: (action: TableAction, uid: string) => void;
};

export default function TableActions({ uid, state, className = '', onClick }: Props) {
  const handleOnActionClick = (action: TableAction) => {
    onClick(action, uid);
  };

  return (
    <div className={`${styles.wrapper} ${className}`}>
      <ActionButton
        iconName={state === timerStatus.ACTIVE ? 'PauseIcon' : 'PlayIcon'}
        onClick={() => handleOnActionClick(tableAction.PLAY_PAUSE)}
      />
      <ActionButton iconName='StopIcon' onClick={() => handleOnActionClick(tableAction.STOP)} />
      <ActionButton iconName='EditIcon' onClick={() => handleOnActionClick(tableAction.EDIT)} />
      <ActionButton iconName='TrashIcon' onClick={() => handleOnActionClick(tableAction.DELETE)} />
    </div>
  );
}
