import styles from './SearchHistory.module.scss';
import { Nullable } from 'primereact/ts-helpers';
import DatePicker from '@/components/forms/datePicker';
import TextInput from '@/components/forms/textInput';

type Props = {
  className?: string;
  searchDescriptionValue: string;
  startDate: any;
  endDate: any;
  onStartDateChange: (value: Nullable<string | Date | Date[]>) => void;
  onEndDateChange: (value: Nullable<string | Date | Date[]>) => void;
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
