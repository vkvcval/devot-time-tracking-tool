import styles from './RegisterUser.module.scss';
import Link from 'next/link';
import { UserIcon } from '@/lib/icon';

type Props = {
  className?: string;
};

export default function RegisterUser({ className = '' }: Props) {
  return (
    <div className={`${styles.wrapper} ${className}`}>
      <UserIcon className={styles.userIcon} />
      <div className={styles.flexWrapper}>
        <p>Need an account?</p>
        <Link className={styles.link} href={'/sign-up'}>
          Register here
        </Link>
      </div>
    </div>
  );
}
