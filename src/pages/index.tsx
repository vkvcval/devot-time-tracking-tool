import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/context/AuthContext';

function Page() {
  const router = useRouter();

  const { user } = useAuthContext();

  useEffect(() => {
    if (!user) {
      router.push('/sign-in');
    } else {
      router.push('/tracking/today');
    }
  }, [user]);

  return (
    <div className='wrapper'>
      <div className='form-wrapper'>main page to determine if user is logged in</div>
    </div>
  );
}

export default Page;
