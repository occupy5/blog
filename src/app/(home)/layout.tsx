import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { getLinks } from 'fumadocs-ui/layouts/shared';
import type { Metadata } from 'next';
import { Header } from '@/components/header';
import { baseOptions, linkItems, title } from '../layout.config';

const Layout = ({ children }: LayoutProps<'/'>) => {
  return (
    <HomeLayout
      {...baseOptions}
      className='pt-16'
      links={linkItems}
      nav={{
        component: (
          <Header
            finalLinks={getLinks(linkItems, baseOptions.githubUrl)}
            {...baseOptions}
          />
        ),
      }}
    >
      <div
        id='main-content'
        tabIndex={-1}
        className='mx-auto w-full max-w-[1088px] px-6 pb-24 pt-12 sm:px-10 sm:pb-32 sm:pt-20'
      >
        {children}
      </div>
    </HomeLayout>
  );
};

export default Layout;

export const metadata: Metadata = {
  openGraph: {
    images: '/api/og',
    url: '/',
    siteName: title,
  },
  alternates: {
    canonical: '/',
    types: {
      'application/rss+xml': '/api/rss.xml',
    },
  },
};
