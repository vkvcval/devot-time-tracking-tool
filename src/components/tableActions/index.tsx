import styles from './TableActions.module.scss';
import { TableAction, table_action } from '@/lib/constants';
import { RowOptions } from '@/interfaces';
import ActionButton from '@components/buttons/actionButton';

type Props = {
  uid: string;
  isActive: boolean;
  isTaskDeleteInProgress?: boolean;
  options: RowOptions;
  className?: string;
  onClick: (action: TableAction, uid: string) => void;
};

export default function TableActions({
  uid,
  isActive,
  isTaskDeleteInProgress,
  options,
  className = '',
  onClick,
}: Props) {
  const handleOnActionClick = (action: TableAction) => {
    onClick(action, uid);
  };

  return (
    <div className={`${styles.wrapper} ${className}`}>
      {options.canStart && (
        <ActionButton
          tooltip={isActive ? 'Pause' : 'Start'}
          iconName={isActive ? 'PauseIcon' : 'PlayIcon'}
          onClick={() => handleOnActionClick(isActive ? table_action.PAUSE : table_action.START)}
        />
      )}
      {options.canStop && (
        <ActionButton
          tooltip={'Stop and complete'}
          iconName='StopIcon'
          onClick={() => handleOnActionClick(table_action.STOP)}
        />
      )}
      {options.canEdit && (
        <ActionButton
          tooltip={'Edit description'}
          iconName='EditIcon'
          onClick={() => handleOnActionClick(table_action.EDIT)}
        />
      )}
      {options.canDelete && (
        <ActionButton
          tooltip={'Delete'}
          iconName='TrashIcon'
          loading={isTaskDeleteInProgress}
          onClick={() => handleOnActionClick(table_action.DELETE)}
        />
      )}
    </div>
  );
}
