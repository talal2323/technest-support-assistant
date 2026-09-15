import { DM_Sans, Space_Grotesk } from 'next/font/google';
import './globals.css';

const space = Space_Grotesk({ subsets: ['latin'], variable: '--font-space' });
const dm = DM_Sans({ subsets: ['latin'], variable: '--font-dm' });

export const metadata = {
  title: 'TechNest Support | A little more human',
  description: 'Fast, grounded support for your TechNest setup.',
  icons: {
    icon: '/technest-logo.ico',
  },
};

export default function RootLayout({ children }) {
  return <html lang="en"><body className={`${space.variable} ${dm.variable}`}>{children}</body></html>;
}
