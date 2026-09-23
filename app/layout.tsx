import type {Metadata} from 'next';
import { Inter, Playfair_Display } from "next/font/google";
import './globals.css';
import { BookProvider } from "@/context/BookContext";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: 'Booklyst | UPN Veteran Jatim',
  description: 'Platform sirkular resmi civitas akademika UPN Veteran Jatim.',
  openGraph: {
    title: 'Booklyst | UPN Veteran Jatim',
    description: 'Platform sirkular resmi civitas akademika UPN Veteran Jatim.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Booklyst | UPN Veteran Jatim',
    description: 'Platform sirkular resmi civitas akademika UPN Veteran Jatim.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="id">
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased text-brand-text bg-brand-surface`} suppressHydrationWarning>
        <BookProvider>
          <Navbar />
          {children}
        </BookProvider>
      </body>
    </html>
  );
}
