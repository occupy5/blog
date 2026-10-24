import {
  DocsBody as PostsBody,
  DocsDescription as PostsDescription,
  DocsPage as PostsPage,
  DocsTitle as PostsTitle,
} from 'fumadocs-ui/page';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { draftMdxComponents } from '@/components/mdx';
import { getDraft, getDrafts } from '@/lib/draft-source';

export const dynamicParams = false;

const Page = async (props: { params: Promise<{ slug: string }> }) => {
  if (process.env.NODE_ENV !== 'development') notFound();

  const params = await props.params;
  const draft = getDraft([params.slug]);

  if (draft === undefined) notFound();

  const date = draft.data.date.toLocaleDateString('zh-CN', {
    timeZone: 'Asia/Shanghai',
  });
  const MDX = draft.data.body;

  return (
    <PostsPage
      article={{
        className: `px-6 pt-10 md:px-8 md:pt-16 ${draft.data.full ? '' : 'max-w-[820px]'}`,
      }}
      toc={draft.data.toc}
      full={draft.data.full}
      tableOfContent={{
        style: 'clerk',
        single: false,
      }}
    >
      <div className='mb-6 flex items-center justify-between gap-4 rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-700 dark:text-amber-300'>
        <strong>本地草稿</strong>
        <span>{date}</span>
      </div>
      <PostsTitle>{draft.data.title}</PostsTitle>
      <PostsDescription>{draft.data.description}</PostsDescription>
      <PostsBody className='post-content'>
        <MDX components={draftMdxComponents} />
      </PostsBody>
    </PostsPage>
  );
};

export default Page;

export const generateStaticParams = () => {
  if (process.env.NODE_ENV !== 'development') return [];

  return getDrafts().map((draft) => ({
    slug: draft.slugs[0],
  }));
};

export const generateMetadata = async (props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> => {
  const params = await props.params;
  const draft = getDraft([params.slug]);

  return {
    title: draft ? `[草稿] ${draft.data.title}` : '草稿',
    robots: {
      index: false,
      follow: false,
      noarchive: true,
    },
  };
};
