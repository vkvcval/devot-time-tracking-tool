import styles from './Table.module.scss';
import { RowOptions, Task } from '@/interfaces';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { TableAction } from '@/lib/constants';
import TableActions from '@components/tableActions';
import TaskDescriptionInput from '@components/forms/taskDescriptionInput';

type TaskItem = Task & {
  duration: string;
  isActive: boolean;
  isEdited: boolean;
  isTaskDeleteInProgress?: boolean;
  isTaskDescriptionUpdateInProgress?: boolean;
};

type Props = {
  data?: TaskItem[];
  rowOptions: RowOptions;
  className?: string;
  onClick: (action: TableAction, uid: string) => void;
  onTaskDescriptionUpdate: (uid: string, description: string) => void;
  onTaskDescriptionCancel: () => void;
};

export default function Table({
  data,
  rowOptions,
  className = '',
  onClick,
  onTaskDescriptionUpdate,
  onTaskDescriptionCancel,
}: Props) {
  const durationBodyTemplate = (data: TaskItem) => {
    return <span className={data.isActive ? styles.bold : ''}>{data.duration}</span>;
  };

  const actionsBodyTemplate = (data: TaskItem) => {
    return (
      <TableActions
        uid={data.uid}
        options={rowOptions}
        isActive={data.isActive}
        isTaskDeleteInProgress={data.isTaskDeleteInProgress}
        onClick={onClick}
      />
    );
  };

  const descriptionBodyTemplate = (data: TaskItem) => {
    if (data.isEdited) {
      return (
        <TaskDescriptionInput
          value={data.description}
          onCancel={onTaskDescriptionCancel}
          onConfirm={description => onTaskDescriptionUpdate(data.uid, description)}
          loading={data.isTaskDescriptionUpdateInProgress}
        />
      );
    }
    return <span className={data.isActive ? styles.bold : ''}>{data.description}</span>;
  };

  return (
    <div className={`${styles.wrapper} ${className}`}>
      <DataTable showGridlines className={styles.table} value={data}>
        <Column field='duration' header='Time logged' body={durationBodyTemplate} style={{ width: '20%' }}></Column>
        <Column
          field='description'
          header='Description'
          body={descriptionBodyTemplate}
          style={{ width: '60%' }}
        ></Column>
        <Column field='actions' header='Actions' body={actionsBodyTemplate} style={{ width: '20%' }}></Column>
      </DataTable>
    </div>
  );
}
