import styles from './Table.module.scss';
import Link from 'next/link';
import { IconType } from '@/interfaces';
import * as icons from '@lib/icon';
import { InputMask } from 'primereact/inputmask';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import TableActions from '../tableActions';
import { TableAction, TimerStatus } from '@/lib/constants';
import { useState } from 'react';
import { Nullable } from 'primereact/ts-helpers';

type TaskItem = {
  uid: string;
  duration: number;
  description: string;
  state: TimerStatus;
};

type Props = {
  data?: TaskItem[];
  onClick: (action: TableAction, uid: string) => void;
};

export default function Table({ data, onClick }: Props) {
  const actionsBodyTemplate = (data: TaskItem) => {
    return <TableActions uid={data.uid} state={data.state} onClick={onClick} />;
  };

  const [value, setValue] = useState<Nullable<string>>('');
  return (
    <div>
      <DataTable value={data}>
        <Column field='duration' header='Time logged'></Column>
        <Column field='description' header='Description'></Column>
        <Column field='actions' header='Actions' body={actionsBodyTemplate}></Column>
      </DataTable>
    </div>
  );
}
