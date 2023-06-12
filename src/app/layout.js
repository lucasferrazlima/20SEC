import './globals.css';

export const metadata = {
  title: '20SEC',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-sans bg-secondary text-tertiary container mx-auto">{children}</body>
    </html>
  );
}
