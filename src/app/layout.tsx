import type { Metadata } from 'next';
import { Geist, Inter, JetBrains_Mono } from 'next/font/google';
import { Footer } from '@/components/footer';
import { description, title } from './layout.config';
import './global.css';
import 'katex/dist/katex.css';
import { RootProvider } from 'fumadocs-ui/provider/next';

const geist = Geist({
  subsets: ['latin'],
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
});

const archiveFont = Inter({
  subsets: ['latin'],
  variable: '--font-archive',
  display: 'swap',
});

const Layout = ({ children }: LayoutProps<'/'>) => {
  return (
    <html
      lang='zh-CN'
      suppressHydrationWarning
      className={`${geist.className} ${jetbrains.variable} ${archiveFont.variable} antialiased`}
    >
      <body className='flex min-h-dvh flex-col bg-fd-background text-fd-foreground'>
        <a
          href='#main-content'
          className='fixed left-4 top-4 z-50 -translate-y-24 rounded-md bg-fd-foreground px-4 py-2 text-sm text-fd-background focus:translate-y-0'
        >
          跳到内容
        </a>
        <RootProvider
          i18n={{
            locale: 'cn',
            translations: {
              toc: '目录',
              search: '搜索文章',
              searchNoResult: '没有找到相关文章',
              previousPage: '上一篇',
              nextPage: '下一篇',
              chooseTheme: '切换主题',
              editOnGithub: '在 GitHub 上编辑',
            },
          }}
        >
          {children}
          <Footer />
        </RootProvider>
      </body>
    </html>
  );
};

export default Layout;

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  ),
  title,
  description,
  openGraph: {
    title,
    description,
    images: '/api/og',
  },
  twitter: {
    title,
    description,
    images: '/api/og',
  },
};
