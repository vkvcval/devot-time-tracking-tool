import { InputText } from 'primereact/inputtext';
import styles from './NewTaskForm.module.scss';
import { useState } from 'react';
import { Button } from 'primereact/button';

type Props = {
  onCreateTaskClick: (description: string) => void;
  onCancelCreateTaskClick: () => void;
  className?: string;
  loading?: boolean;
};

export default function NewTaskForm({ onCreateTaskClick, onCancelCreateTaskClick, className, loading }: Props) {
  const [taskDescription, setTaskDescription] = useState<string>('');

  const handleConfirm = () => {
    if (!taskDescription || taskDescription.trim().length === 0) {
      return;
    }

    onCreateTaskClick(taskDescription.trim());
  };

  return (
    <div className={`${styles.wrapper} ${className}`}>
      <form>
        <InputText
          className={styles.input}
          value={taskDescription}
          onChange={e => setTaskDescription(e.target.value)}
          placeholder='Enter short description'
        />
        <div className={styles.buttons}>
          <Button
            icon='pi pi-check'
            text
            aria-label='Filter'
            tooltip='Confirm'
            disabled={!taskDescription || taskDescription.trim().length === 0}
            onClick={handleConfirm}
            loading={loading}
          />
          <Button
            icon='pi pi-times'
            text
            severity='danger'
            aria-label='Cancel'
            tooltip='Cancel'
            tooltipOptions={{ position: 'bottom' }}
            onClick={onCancelCreateTaskClick}
            disabled={loading}
          />
        </div>
      </form>
    </div>
  );
}
