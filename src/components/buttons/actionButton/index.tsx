import styles from './ActionButton.module.scss';
import { Button } from 'primereact/button';
import { IconType } from '@/interfaces';
import * as icons from '@lib/icon';

type Props = {
  iconName: IconType;
  loading?: boolean;
  onClick: () => void;
};

export default function ActionButton({ iconName, loading, onClick = () => {} }: Props) {
  const Icon = icons[iconName];

  return (
    <Button rounded text className={styles.btn} loading={loading} loadingIcon onClick={onClick}>
      {Icon ? <Icon className={styles.icon} /> : null}
    </Button>
  );
}
