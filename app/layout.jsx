import './globals.css';
import { Inter } from 'next/font/google';
import { LanguageProvider } from '../contexts/LanguageContext';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata = {
  title: 'siha Clinic',
  description: 'Management Portal',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `
            try {
              if (localStorage.getItem('isDarkMode') === 'true' || (!('isDarkMode' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                document.documentElement.classList.add('dark')
              } else {
                document.documentElement.classList.remove('dark')
              }
            } catch (_) {}
          `
        }} />
      </head>
      <body className="bg-surface text-on-surface transition-colors duration-500">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
