import type { BlogPosting, BreadcrumbList, Graph } from 'schema-dts';
import { title as homeTitle } from '@/app/layout.config';
import type { Post } from '@/lib/source';

export const PostJsonLd = ({ post }: { post: Post }) => {
  if (!post) {
    return null;
  }

  const baseUrl = new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  ).href;

  const url = new URL(post.url, baseUrl).href;

  const imageParams = new URLSearchParams();
  imageParams.set('title', post.data.title);
  imageParams.set('description', post.data.description ?? '');

  const blogPosting: BlogPosting = {
    '@type': 'BlogPosting',
    headline: post.data.title,
    description: post.data.description,
    image: new URL(`/api/og?${imageParams}`, baseUrl).href,
    datePublished: new Date(post.data.date).toISOString(),
    dateModified: post.data.lastModified
      ? new Date(post.data.lastModified).toISOString()
      : undefined,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    author: {
      '@type': 'Person',
      name: 'shenn.xyz',
      url: 'https://shenn.xyz',
    },
    publisher: {
      '@type': 'Person',
      name: 'shenn.xyz',
    },
  };

  const breadcrumbList: BreadcrumbList = {
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: homeTitle,
        item: baseUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: post.data.title,
        item: url,
      },
    ],
  };

  const graph: Graph = {
    '@context': 'https://schema.org',
    '@graph': [blogPosting, breadcrumbList],
  };

  return (
    <script
      type='application/ld+json'
      // biome-ignore lint/security/noDangerouslySetInnerHtml: The content is safely serialized using JSON.stringify
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
};
