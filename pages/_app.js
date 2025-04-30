import '@/styles/globals.css';
import '@/styles/CalendarStyles.css';
import Layout from '@/components/General/Layout';
import { SessionProvider } from 'next-auth/react';
import withAuth from '@/auth/withAuth';

function App({ Component, pageProps: { session, ...pageProps }, user }) {
  const AuthenticatedLayout = withAuth(Layout); // Wrap Layout with withAuth

  return (
    <SessionProvider session={session}>
      <AuthenticatedLayout user={user}>
        <Component {...pageProps} />
      </AuthenticatedLayout>
    </SessionProvider>
  );
}

export default App;