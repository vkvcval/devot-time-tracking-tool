import styles from './ActionButton.module.scss';
import { Button } from 'primereact/button';
import { IconType } from '@/interfaces';
import * as icons from '@lib/icon';

type Props = {
  iconName: IconType;
  loading?: boolean;
  tooltip?: string;
  onClick: () => void;
};

export default function ActionButton({ iconName, loading, tooltip, onClick = () => {} }: Props) {
  const Icon = icons[iconName];

  return (
    <Button tooltip={tooltip} rounded text className={styles.btn} loading={loading} loadingIcon onClick={onClick}>
      {Icon ? <Icon className={styles.icon} /> : null}
    </Button>
  );
}
