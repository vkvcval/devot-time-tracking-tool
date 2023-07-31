import styles from './Table.module.scss';
import { InputText } from 'primereact/inputtext';
import Link from 'next/link';
import { IconType, Task } from '@/interfaces';
import * as icons from '@lib/icon';
import { InputMask } from 'primereact/inputmask';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import TableActions from '../tableActions';
import { TableAction } from '@/lib/constants';
import { useState } from 'react';
import { Nullable } from 'primereact/ts-helpers';
import TaskDescriptionInput from '../forms/taskDescriptionInput';

type TaskItem = Task & {
  duration: string;
  isActive: boolean;
  isEdited: boolean;
  isTaskDeleteInProgress?: boolean;
  isTaskDescriptionUpdateInProgress?: boolean;
};

type Props = {
  data?: TaskItem[];
  onClick: (action: TableAction, uid: string) => void;
  onTaskDescriptionUpdate: (uid: string, description: string) => void;
  onTaskDescriptionCancel: () => void;
};

export default function Table({ data, onClick, onTaskDescriptionUpdate, onTaskDescriptionCancel }: Props) {
  const actionsBodyTemplate = (data: TaskItem) => {
    return (
      <TableActions
        uid={data.uid}
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
    return data.description;
  };

  return (
    <div>
      <DataTable value={data}>
        <Column field='duration' header='Time logged'></Column>
        <Column field='description' header='Description' body={descriptionBodyTemplate}></Column>
        <Column field='actions' header='Actions' body={actionsBodyTemplate}></Column>
      </DataTable>
    </div>
  );
}
