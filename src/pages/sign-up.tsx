import styles from '@styles/pages/Auth.module.scss';
import signUp from '@/firebase/auth/signup';
import { useState, useEffect, MouseEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/context/AuthContext';
import { pages } from '@/lib/constants';
import { ToastMessage } from 'primereact/toast';
import { Password } from 'primereact/password';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import Layout from '@/components/layout';
import Link from 'next/link';

type Props = {
  showToastMessage: (message: ToastMessage) => void;
};

export default function SignIn({ showToastMessage }: Props) {
  const router = useRouter();

  const { user } = useAuthContext();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (user) {
      router.push('/tracking/today');
    }
  }, [user]);

  const handleSignup = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const newErrors: { [key: string]: boolean } = {};
    if (!password || !password.trim().length) {
      newErrors.password = true;
    }
    if (!email || !email.trim().length) {
      newErrors.email = true;
    }
    setErrors(newErrors);

    if (Object.keys(newErrors).some(field => newErrors[field])) {
      return;
    }

    const { result, error } = await signUp(email, password);

    if (error) {
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        showToastMessage({ severity: 'error', summary: 'Invalid credentials.' });
      } else if (error.code === 'auth/weak-password') {
        showToastMessage({
          severity: 'error',
          summary: 'Weak password. Choose password with 6 or more characters.',
        });
      } else {
        showToastMessage({ severity: 'error', summary: 'Unable to create account.' });
      }
    }
  };

  return (
    <Layout activePage={pages.SIGN_IN} showToastMessage={showToastMessage} hideNavigationAndLogout={true}>
      <div className={styles.wrapper}>
        <div>
          <div className={styles.loginFormWrapper}>
            <h1>Sign up</h1>
            <form className={styles.form}>
              <InputText
                className={`${styles.input} ${errors.email ? 'p-invalid' : ''}`}
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder='Username'
              />
              <Password
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder='Password'
                className={`${errors.password ? 'p-invalid' : ''}`}
              />
              <Button className={styles.loginBtn} label='Sign up' onClick={handleSignup} />
            </form>
          </div>
          <div className={styles.signInOption}>
            <p> Alreade have an account?</p>
            <Link className={styles.link} href={'/sign-in'}>
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
