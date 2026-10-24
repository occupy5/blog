import { FolderOpen } from 'lucide-react';
import type { Metadata } from 'next';
import { title } from '@/app/layout.config';
import { ProjectCard } from '@/components/project-card';
import { type Project, projects } from '@/data/projects';

const projectGroups: {
  category: Project['category'];
  title: string;
  label: string;
}[] = [
  { category: 'projects', title: 'Projects', label: '项目' },
  { category: 'hackathons', title: 'Hackathons', label: '黑客松' },
];

const Page = () => {
  const groups = projectGroups
    .map((group) => ({
      ...group,
      entries: projects.filter(
        (project) => project.category === group.category,
      ),
    }))
    .filter((group) => group.entries.length > 0);

  return (
    <div className='project-page archive-font mx-auto w-full max-w-[740px]'>
      <h1 className='sr-only'>个人项目</h1>
      {projects.length === 0 ? (
        <div className='my-16 flex min-h-64 flex-col items-center justify-center rounded-2xl bg-fd-muted/40 px-6 text-center sm:my-20'>
          <FolderOpen
            aria-hidden
            className='mb-5 size-8 stroke-[1.25] text-fd-muted-foreground'
          />
          <p className='text-base text-fd-foreground/80'>项目正在整理中。</p>
          <p className='mt-2 text-sm text-fd-muted-foreground'>
            做点有趣的东西，慢慢放在这里。
          </p>
        </div>
      ) : (
        <div className='space-y-14 sm:space-y-16'>
          {groups.map(({ category, title, label, entries }) => (
            <section key={category} aria-labelledby={`projects-${category}`}>
              <h2 id={`projects-${category}`} className='mb-2.5'>
                <span
                  aria-hidden='true'
                  className='project-section-title archive-font block'
                >
                  {title}
                </span>
                <span className='mt-1.5 block text-sm font-normal leading-7 tracking-[0.08em] text-fd-muted-foreground'>
                  {label}
                </span>
              </h2>
              <ul className='divide-y divide-fd-foreground/10'>
                {entries.map((project) => (
                  <li key={project.url}>
                    <ProjectCard project={project} />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
};

export default Page;

export const metadata: Metadata = {
  title: `个人项目 · ${title}`,
  description: '个人项目与实验。',
  alternates: {
    canonical: '/projects',
    types: { 'application/rss+xml': '/api/rss.xml' },
  },
  openGraph: {
    title: `个人项目 · ${title}`,
    description: '个人项目与实验。',
    url: '/projects',
    siteName: title,
    images: '/api/og?title=个人项目',
  },
  twitter: { title: `个人项目 · ${title}`, images: '/api/og?title=个人项目' },
};
