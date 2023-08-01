import styles from './Paging.module.scss';
import { useState } from 'react';
import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator';
import { LeftIcon, RightIcon, StepBackwardIcon, StepforwardIcon } from '@/lib/icon';

type Props = {
  totalRecords: number;
  className?: string;
  onChange: (pageNumber: number) => void;
};

export default function Paging({ totalRecords, className = '', onChange }: Props) {
  const [first, setFirst] = useState<number>(0);

  const onPageChange = (event: PaginatorPageChangeEvent) => {
    setFirst(event.first);
    onChange(event.first);
  };

  return (
    <div className={`${styles.wrapper} ${className}`}>
      <Paginator
        className={styles.paginator}
        prevPageLinkIcon={<LeftIcon />}
        nextPageLinkIcon={<RightIcon />}
        firstPageLinkIcon={<StepBackwardIcon />}
        lastPageLinkIcon={<StepforwardIcon />}
        first={first}
        rows={1}
        totalRecords={totalRecords}
        onPageChange={onPageChange}
        currentPageReportTemplate='&#123;currentPage&#125;'
        template='FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink'
      />
    </div>
  );
}
