export const metadata = {
  title: 'BIS — Brand Intelligence System',
  description: 'Dashboard monitoring & analisis brand',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
