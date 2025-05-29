import '@/styles/globals.css';
import '@/styles/CalendarStyles.css';
import Layout from '@/components/General/Layout';
import withAuth from '@/auth/withAuth';

function App({ Component, pageProps, router }) {
  const publicRoutes = ['/Login', '/Register', '/'];

  const isPublic = publicRoutes.includes(router.pathname);

  const PageLayout = isPublic ? Layout : withAuth(Layout);

  return (
    <PageLayout>
      <Component {...pageProps} />
    </PageLayout>
  );
}

export default App;