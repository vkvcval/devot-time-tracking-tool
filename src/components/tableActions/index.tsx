import styles from './TableActions.module.scss';
import ActionButton from '@components/buttons/actionButton';
import { TableAction, table_action } from '@/lib/constants';

type Props = {
  uid: string;
  isActive: boolean;
  isTaskDeleteInProgress?: boolean;
  className?: string;
  onClick: (action: TableAction, uid: string) => void;
};

export default function TableActions({ uid, isActive, isTaskDeleteInProgress, className = '', onClick }: Props) {
  const handleOnActionClick = (action: TableAction) => {
    onClick(action, uid);
  };

  return (
    <div className={`${styles.wrapper} ${className}`}>
      <ActionButton
        tooltip={isActive ? 'Pause' : 'Start'}
        iconName={isActive ? 'PauseIcon' : 'PlayIcon'}
        onClick={() => handleOnActionClick(isActive ? table_action.PAUSE : table_action.START)}
      />
      <ActionButton
        tooltip={'Stop and complete'}
        iconName='StopIcon'
        onClick={() => handleOnActionClick(table_action.STOP)}
      />
      <ActionButton
        tooltip={'Edit description'}
        iconName='EditIcon'
        onClick={() => handleOnActionClick(table_action.EDIT)}
      />
      <ActionButton
        tooltip={'Delete'}
        iconName='TrashIcon'
        loading={isTaskDeleteInProgress}
        onClick={() => handleOnActionClick(table_action.DELETE)}
      />
    </div>
  );
}
