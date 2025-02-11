import '@/styles/globals.css'
import '@/styles/CalendarStyles.css'
import Layout from '@/components/General/Layout'

function App({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default App;

