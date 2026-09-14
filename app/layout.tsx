import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { AppShell } from '@/components/app-shell';
import { CourseProgressProvider } from '@/components/course-progress';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('http://localhost:3000'),
  title: {
    default: 'PyPath · 从 Python 到算法',
    template: '%s',
  },
  description: '一条可运行、可验收、有清晰进度的 Python 与算法学习路径。',
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    title: 'PyPath · 从 Python 到算法',
    description: '一条可运行、可验收、有清晰进度的 Python 与算法学习路径。',
    images: [{ url: '/og.png', width: 1731, height: 909, alt: 'PyPath 从 Python 到算法学习星图' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PyPath · 从 Python 到算法',
    description: '一条可运行、可验收、有清晰进度的 Python 与算法学习路径。',
    images: ['/og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <CourseProgressProvider>
          <AppShell>{children}</AppShell>
        </CourseProgressProvider>
      </body>
    </html>
  );
}
