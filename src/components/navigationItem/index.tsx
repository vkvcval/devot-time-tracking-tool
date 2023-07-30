import styles from './NavigationItem.module.scss';
import Logo from '@assets/images/Logo.svg';
import Link from 'next/link';
/* import { HistoryIcon, TimeIcon } from '@/lib/icon'; */
import { IconType } from '@/interfaces';
import * as icons from '@lib/icon';
/* import Button from 'primereact/button'; */

type Props = {
  text: string;
  path: string;
  iconName: IconType;
  isActive?: boolean;
};
export default function NavigationItem({ text, path, iconName, isActive }: Props) {
  const Icon = icons[iconName];

  return (
    <Link className={`${styles.wrapper} ${isActive ? styles.active : ''}`} href={path}>
      <div className={styles.flexWrapper}>
        <div className={styles.iconAndText}>
          {Icon ? <Icon className={styles.icon} /> : null}
          <p>{text}</p>
        </div>
        <div className={`${styles.line} ${isActive ? styles.orange : styles.grey}`}></div>
      </div>
    </Link>
  );
}
