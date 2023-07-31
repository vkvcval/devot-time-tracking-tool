import styles from './ButtonWithTextAndIcon.module.scss';
import { Button } from 'primereact/button';
import { IconType } from '@/interfaces';
import * as icons from '@lib/icon';

type Props = {
  text: string;
  bgColor?: 'orange' | 'portGore';
  iconName: IconType;
  loading?: boolean;
  onClick: () => void;
};

export default function ButtonWithTextAndIcon({
  text,
  bgColor = 'orange',
  iconName,
  loading,
  onClick = () => {},
}: Props) {
  const Icon = icons[iconName];

  return (
    <Button className={`${styles.btn} ${styles[bgColor]}`} onClick={onClick} loading={loading}>
      {Icon ? <Icon className={styles.icon} /> : null}
      <span>{text}</span>
    </Button>
  );
}
