import styles from './ButtonWithTextAndIcon.module.scss';
import { Button } from 'primereact/button';
import { IconType } from '@/interfaces';
import * as icons from '@lib/icon';

type Props = {
  text: string;
  bgColor?: 'orange' | 'portGore';
  iconName: IconType;
  onClick: () => void;
};

export default function ButtonWithTextAndIcon({ text, bgColor = 'orange', iconName, onClick = () => {} }: Props) {
  const Icon = icons[iconName];

  return (
    <Button className={`${styles.btn} ${styles[bgColor]}`} onClick={onClick}>
      {Icon ? <Icon className={styles.icon} /> : null}
      <span>{text}</span>
    </Button>
  );
}
