import '@styles/globals.scss';
import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

import type { AppProps } from 'next/app';
import { useRef } from 'react';
import { AuthContextProvider } from '@/context/AuthContext';
import { Toast, ToastMessage } from 'primereact/toast';

export default function App({ Component, pageProps }: AppProps) {
  const toast = useRef<Toast>(null);

  const showToastMessage = (message: ToastMessage) => {
    toast.current?.show(message);
  };

  return (
    <AuthContextProvider>
      <div>
        <Toast ref={toast} position='bottom-right' />
        <Component {...pageProps} showToastMessage={showToastMessage} />
      </div>
    </AuthContextProvider>
  );
}
