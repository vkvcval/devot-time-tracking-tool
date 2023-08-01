import styles from './TextInput.module.scss';
import Link from 'next/link';
import { IconType } from '@/interfaces';
import { CalendarIcon } from '@lib/icon';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import DatePicker from '@/components/forms/datePicker';
import { Button } from 'primereact/button';

type Props = {
  className?: string;
  value: string;
  label?: string;
  showBorder?: boolean;
  showReset?: boolean;
  placeholder?: string;
  onChange: (value: string) => void;
  onResetClick?: () => void;
};

export default function TextInput({
  className = '',
  value,
  label,
  showBorder,
  showReset,
  placeholder,
  onChange,
  onResetClick = () => {},
}: Props) {
  return (
    <div className={`${styles.wrapper} ${className}`}>
      <label className={styles.label} htmlFor='endDate'>
        {label}
      </label>
      <span className='p-input-icon-right'>
        {showReset && <i className='pi pi-times' onClick={onResetClick} />}
        <InputText
          className={`${styles.input} ${showBorder ? '' : styles.noBorder}`}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
        />
      </span>
    </div>
  );
}
