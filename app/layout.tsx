import './globals.css';
import { Inter } from 'next/font/google';
import type { Metadata } from 'next';
import { ThemeProvider } from "@/components/theme-provider"
import { ModeToggle } from "@/components/ModeToggle";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CEI Todo App - 67011178',
  description: 'University Web Programming Assignment',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <ThemeProvider>
      <body className={`${inter.className} bg-slate-900 antialiased`}>
        {children}
        <ModeToggle />
      </body>
      </ThemeProvider>
    </html>
  );
}