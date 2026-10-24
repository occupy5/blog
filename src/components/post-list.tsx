import Link from 'fumadocs-core/link';
import { formatPostDate, getPostYear } from '@/lib/post-date';
import type { getPosts } from '@/lib/source';

export const PostList = ({ posts }: { posts: ReturnType<typeof getPosts> }) => {
  const groups = new Map<string, typeof posts>();
  for (const post of posts) {
    const year = getPostYear(post.data.date);
    const group = groups.get(year) ?? [];
    group.push(post);
    groups.set(year, group);
  }

  return (
    <div className='archive-font space-y-14 sm:space-y-16'>
      {[...groups].map(([year, entries]) => (
        <section key={year} id={year} aria-labelledby={`year-${year}`}>
          <h2 id={`year-${year}`} className='relative h-16 sm:h-20'>
            <span className='sr-only'>{year} 年文章</span>
            <span aria-hidden='true' className='archive-year'>
              {year}
            </span>
          </h2>
          <ul className='relative space-y-5'>
            {entries.map((post) => (
              <li key={post.url}>
                <Link
                  href={post.url}
                  className='post-row group block text-[17px] leading-7 sm:text-lg'
                >
                  <span className='text-fd-foreground/85 transition-colors duration-150 group-hover:text-fd-primary group-focus-visible:text-fd-primary'>
                    {post.data.title}
                  </span>
                  <time
                    dateTime={post.data.date.toISOString()}
                    title={post.data.date.toLocaleDateString('zh-CN', {
                      timeZone: 'Asia/Shanghai',
                    })}
                    className='ml-2 inline-block whitespace-nowrap align-baseline text-sm tabular-nums text-fd-muted-foreground/75'
                  >
                    {formatPostDate(post.data.date)}
                  </time>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
};
