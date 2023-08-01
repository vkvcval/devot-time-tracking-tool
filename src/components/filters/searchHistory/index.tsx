import styles from './SearchHistory.module.scss';
import Link from 'next/link';
import { IconType } from '@/interfaces';
import { CalendarIcon } from '@lib/icon';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import DatePicker from '@/components/forms/datePicker';
import TextInput from '@/components/forms/textInput';

type Props = {
  className?: string;
  searchDescriptionValue: string;
  startDate: any;
  endDate: any;
  onStartDateChange: (value: any) => void;
  onEndDateChange: (value: any) => void;
  onSearchDescriptionChange: (value: string) => void;
  onResetDescriptionFilterClick: () => void;
};

export default function SearchHistory({
  className = '',
  startDate,
  endDate,
  searchDescriptionValue,
  onStartDateChange,
  onEndDateChange,
  onSearchDescriptionChange,
  onResetDescriptionFilterClick,
}: Props) {
  return (
    <div className={`${styles.wrapper} ${className}`}>
      <DatePicker className={styles.flexItem} label={'Start date'} value={startDate} onChange={onStartDateChange} />
      <DatePicker className={styles.flexItem} label={'End date'} value={endDate} onChange={onEndDateChange} />
      <TextInput
        className={styles.flexItem}
        label={'Description contains'}
        value={searchDescriptionValue}
        showReset={true}
        onChange={onSearchDescriptionChange}
        onResetClick={onResetDescriptionFilterClick}
      />
    </div>
  );
}
