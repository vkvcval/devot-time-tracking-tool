import styles from './Header.module.scss';
import signOut from '@/firebase/auth/signout';
import { useRouter } from 'next/router';
import { PageType, pages } from '@/lib/constants';
import { ToastMessage } from 'primereact/toast';
import { TurnOffIcon } from '@/lib/icon';
import { Button } from 'primereact/button';
import Logo from '@assets/images/Logo.svg';
import NavigationItem from '@components/navigationItem';

type Props = {
  showToastMessage: (message: ToastMessage) => void;
  activePage: PageType;
  className?: string;
};

export default function Header({ showToastMessage = () => {}, activePage, className = '' }: Props) {
  const router = useRouter();

  const handleLogout = async () => {
    const { result, error } = await signOut();

    if (error) {
      showToastMessage({ severity: 'error', summary: 'An error has occurred when logging out.' });
      return console.log(error);
    } else {
      showToastMessage({ severity: 'success', summary: 'Successfully logged out.' });
      router.push('/sign-in');
    }
  };

  return (
    <header className={`${styles.header} ${className}`}>
      <div className={styles.left}>
        <Logo className={styles.logo} />
        <p>Tracking tool</p>
      </div>
      <div className={styles.right}>
        <nav className={styles.navigation}>
          <NavigationItem
            text='Trackers'
            path='/tracking/today'
            iconName='TimeIcon'
            isActive={activePage === pages.TODAY}
          />
          <NavigationItem
            text='History'
            path='/tracking/history'
            iconName='HistoryIcon'
            isActive={activePage === pages.HISTORY}
          />
        </nav>
        <Button className={styles.logoutBtn} onClick={handleLogout}>
          <TurnOffIcon className={styles.icon} />
          <span>Logout</span>
        </Button>
      </div>
    </header>
  );
}
