import './globals.css';
import PageTransition from '@/components/PageTransition';

export const metadata = {
  title: 'Nadi — Brand Intelligence System',
  description: 'Dashboard monitoring & analisis brand',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        <PageTransition>{children}</PageTransition>
      </body>
    </html>
  );
}
