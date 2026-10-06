import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '학교 대화 사이트 | 교직원 & 학생 통합 소통 플랫폼',
  description: '글래스모피즘 + 클레이모피즘 + 네오 브루탈리즘 융합 디자인 학교 커뮤니티',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="antialiased selection:bg-neo-yellow selection:text-black">
        {children}
      </body>
    </html>
  );
}
