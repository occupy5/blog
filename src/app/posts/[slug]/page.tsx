import {
  DocsBody as PostsBody,
  DocsDescription as PostsDescription,
  DocsPage as PostsPage,
  DocsTitle as PostsTitle,
} from 'fumadocs-ui/page';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { title as homeTitle } from '@/app/layout.config';
import { PostJsonLd } from '@/components/json-ld';
import { mdxComponents } from '@/components/mdx';
import { getPost, getPosts } from '@/lib/source';

export const dynamicParams = false;

const Page = async (props: PageProps<'/posts/[slug]'>) => {
  const params = await props.params;
  const post = getPost([params.slug]);

  if (post === undefined) {
    notFound();
  }

  const date = new Date(post.data.date).toLocaleDateString('zh-CN', {
    timeZone: 'Asia/Shanghai',
  });

  const path = `content/${post.path}`;

  const MDX = post.data.body;

  return (
    <PostsPage
      article={{
        className: `px-6 pt-10 md:px-8 md:pt-16 ${post.data.full ? '' : 'max-w-[820px]'}`,
      }}
      breadcrumb={{ enabled: false }}
      toc={post.data.toc}
      full={post.data.full}
      editOnGithub={{
        repo: 'blog',
        owner: 'occupy5',
        sha: 'main',
        path,
      }}
      tableOfContent={{
        style: 'clerk',
        single: false,
      }}
    >
      <PostsTitle className='text-3xl font-medium leading-snug tracking-tight sm:text-4xl'>
        {post.data.title}
      </PostsTitle>
      <time
        dateTime={post.data.date.toISOString()}
        className='mb-4 text-xs text-fd-muted-foreground'
      >
        {date}
      </time>
      <PostsDescription className='mb-6 text-base leading-8'>
        {post.data.description}
      </PostsDescription>
      <PostsBody className='post-content'>
        <MDX components={mdxComponents} />
      </PostsBody>
      <PostJsonLd post={post} />
    </PostsPage>
  );
};

export default Page;

export const generateStaticParams = () => {
  return getPosts().map((post) => ({
    slug: post.slugs[0],
  }));
};

export const generateMetadata = async (props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> => {
  const params = await props.params;
  const post = getPost([params.slug]);
  if (post === undefined) return {};

  const title = post.data.title;
  const description = post.data.description;
  const imageParams = new URLSearchParams();
  imageParams.set('title', title);
  imageParams.set('description', description ?? '');

  return {
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
    ),
    title,
    description,
    openGraph: {
      title,
      description,
      images: `/api/og?${imageParams}`,
      url: post.url,
      siteName: homeTitle,
    },
    twitter: {
      title,
      description,
      images: `/api/og?${imageParams}`,
    },
    alternates: {
      canonical: post.url,
      types: {
        'application/rss+xml': '/api/rss.xml',
      },
    },
  };
};
