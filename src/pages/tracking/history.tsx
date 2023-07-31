import { useState, useEffect } from 'react';
import { useAuthContext } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Layout from '@/components/layout';
import { pages } from '@/lib/constants';
import { ToastMessage } from 'primereact/toast';

type Props = {
  showToastMessage: (message: ToastMessage) => void;
};

export default function TasksHistory({ showToastMessage }: Props) {
  const { user } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (user == null) router.push('/sign-in');
  }, [user]);

  return (
    <Layout activePage={pages.HISTORY} showToastMessage={showToastMessage}>
      HISTORY
    </Layout>
  );
}
