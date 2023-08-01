import styles from './NavigationItem.module.scss';
import Link from 'next/link';
import { IconType } from '@/interfaces';
import * as icons from '@lib/icon';

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
