import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { getLinks } from 'fumadocs-ui/layouts/shared';
import { Header } from '@/components/header';
import { InlineLink } from '@/components/inline-link';
import { baseOptions, linkItems } from './layout.config';

const NotFound = () => (
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
      className='mx-auto flex w-full max-w-[740px] flex-1 flex-col justify-center px-6 py-28 sm:py-40'
    >
      <p className='mb-5 font-mono text-sm text-fd-muted-foreground'>404</p>
      <h1 className='text-3xl font-medium tracking-tight'>这一页不在这里。</h1>
      <p className='mt-5 text-sm leading-7 text-fd-muted-foreground'>
        地址可能已经改变，或者页面已经移除。
      </p>
      <p className='mt-8 text-sm'>
        <InlineLink href='/'>返回文章列表</InlineLink>
      </p>
    </div>
  </HomeLayout>
);

export default NotFound;
