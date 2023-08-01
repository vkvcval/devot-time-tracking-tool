import styles from './DatePicker.module.scss';
import { CalendarIcon } from '@lib/icon';
import { Calendar } from 'primereact/calendar';

type Props = {
  className?: string;
  label?: string;
  value: any;
  onChange?: (value: any) => void;
};

export default function DatePicker({ className = '', label, value, onChange = () => {} }: Props) {
  return (
    <div className={`${styles.wrapper} ${className}`}>
      <label className={styles.label} htmlFor='date'>
        {label}
      </label>
      <Calendar
        className={styles.calendar}
        inputId='date'
        dateFormat='dd.mm.yy'
        showIcon
        icon={<CalendarIcon />}
        value={value}
        onChange={e => onChange(e.value)}
      />
    </div>
  );
}
