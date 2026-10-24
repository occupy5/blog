import type { Metadata } from 'next';
import { title } from '@/app/layout.config';
import { PostList } from '@/components/post-list';
import { YearNavigation } from '@/components/year-navigation';
import { getPostYear } from '@/lib/post-date';
import { getPostsSortedByDate } from '@/lib/source';

const Page = () => {
  const posts = getPostsSortedByDate();
  const years = [...new Set(posts.map((post) => getPostYear(post.data.date)))];

  return (
    <div className='archive-font mx-auto w-full max-w-[740px]'>
      <h1 className='sr-only'>文章</h1>
      <YearNavigation years={years} />
      {posts.length > 0 ? (
        <PostList posts={posts} />
      ) : (
        <p className='py-12 text-fd-muted-foreground'>还没有发布文章。</p>
      )}
    </div>
  );
};

export default Page;

export const metadata: Metadata = {
  title: `文章 · ${title}`,
  description: '有关技术思考与生活的记录。',
  alternates: {
    canonical: '/',
    types: { 'application/rss+xml': '/api/rss.xml' },
  },
  openGraph: {
    title: `文章 · ${title}`,
    description: '有关技术思考与生活的记录。',
    url: '/',
    siteName: title,
    images: '/api/og',
  },
  twitter: { title: `文章 · ${title}`, images: '/api/og' },
};
