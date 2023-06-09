import './globals.css';
import { Inter, s } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Create Next App',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-sans bg-secondary text-tertiary container mx-auto">{children}</body>
    </html>
  );
}
