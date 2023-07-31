import { InputText } from 'primereact/inputtext';
import styles from './TaskDescriptionInput.module.scss';
import { useState, MouseEvent } from 'react';
import { Button } from 'primereact/button';

type Props = {
  value: string;
  loading?: boolean;
  className?: string;
  onConfirm: (description: string) => void;
  onCancel: () => void;
};

export default function TaskDescriptionInput({ value, loading, className, onConfirm, onCancel }: Props) {
  const [taskDescription, setTaskDescription] = useState<string>(value);

  const handleConfirm = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!taskDescription || taskDescription.trim().length === 0) {
      return;
    }

    onConfirm(taskDescription.trim());
  };

  return (
    <div className={`${styles.wrapper} ${className}`}>
      <form>
        <InputText
          className={styles.input}
          value={taskDescription}
          onChange={e => setTaskDescription(e.target.value)}
          placeholder='Enter short description'
          autoFocus
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
            onClick={onCancel}
            disabled={loading}
          />
        </div>
      </form>
    </div>
  );
}
