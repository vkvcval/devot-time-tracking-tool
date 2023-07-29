import '@styles/globals.scss';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

import type { AppProps } from 'next/app';
import { AuthContextProvider } from '@/context/AuthContext';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthContextProvider>
      <div>
        <Component {...pageProps} />
      </div>
    </AuthContextProvider>
  );
}
