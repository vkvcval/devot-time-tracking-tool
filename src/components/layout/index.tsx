import styles from './Layout.module.scss';
import Header from '@components/header';
import { ReactNode } from 'react';
import { PageType } from '@/lib/constants';
import { ToastMessage } from 'primereact/toast';

type Props = {
  activePage: PageType;
  children: ReactNode;
  showToastMessage: (message: ToastMessage) => void;
};
export default function Layout({ activePage, children, showToastMessage }: Props) {
  return (
    <div className={styles.layout}>
      <Header className={styles.header} activePage={activePage} showToastMessage={showToastMessage} />
      <main className={styles.main}>{children}</main>
    </div>
  );
}
