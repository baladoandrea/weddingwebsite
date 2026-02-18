import type { AppProps } from 'next/app';
import '../styles/globals.css';
import '../styles/theme.css';
import '../styles/sidebar.css';
import '../styles/gallery.css';
import '../styles/admin.css';
import '../styles/rsvp.css';
import '../styles/info.css';

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
