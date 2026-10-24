import Link from 'fumadocs-core/link';
import { ChevronDown } from 'lucide-react';
import Image from 'next/image';
import type { Project } from '@/data/projects';

const ProjectAction = ({ href, label }: { href: string; label: string }) => (
  <Link
    href={href}
    className='group inline-flex items-center gap-1 whitespace-nowrap transition-colors hover:text-fd-primary focus-visible:text-fd-primary'
  >
    {label}
    <span
      aria-hidden='true'
      className='text-sm leading-none transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transform-none motion-reduce:transition-none'
    >
      ↗
    </span>
  </Link>
);

export const ProjectCard = ({ project }: { project: Project }) => (
  <article className='grid grid-cols-[38px_minmax(0,1fr)] gap-x-4 py-7 sm:grid-cols-[44px_minmax(0,1fr)] sm:gap-x-6 sm:py-8'>
    <Link
      href={project.url}
      aria-label={`查看 ${project.name}`}
      className='mt-0.5 block size-[38px] rounded-[10px] sm:size-11 sm:rounded-[11px]'
    >
      <Image
        src={project.icon}
        alt={project.iconAlt}
        width={44}
        height={44}
        sizes='(max-width: 639px) 38px, 44px'
        className='size-full rounded-[inherit] object-contain'
      />
    </Link>
    <div className='min-w-0'>
      <div className='sm:flex sm:flex-wrap sm:items-baseline sm:justify-between sm:gap-x-4 sm:gap-y-1'>
        <h3 className='text-xl font-medium leading-7 tracking-[-0.025em] sm:text-2xl sm:leading-8'>
          <Link
            href={project.url}
            className='decoration-1 underline-offset-[5px] transition-colors hover:text-fd-primary hover:underline focus-visible:text-fd-primary'
          >
            {project.name}
          </Link>
        </h3>
        {project.kind && (
          <span className='mt-1 block text-sm leading-7 text-fd-muted-foreground sm:mt-0'>
            {project.kind}
          </span>
        )}
      </div>
      {(project.tagline || project.description) && (
        <p className='mt-2.5 max-w-[560px] text-pretty text-[17px] leading-7 text-fd-muted-foreground sm:text-lg'>
          {project.tagline && (
            <>
              <span className='text-fd-foreground'>{project.tagline}</span>
              {project.description && <br />}
            </>
          )}
          {project.description}
        </p>
      )}
      {project.award && (
        <p className='mt-3 text-sm leading-7 text-fd-muted-foreground'>
          {project.award.event}
          <span aria-hidden='true' className='mx-1.5 opacity-55 sm:mx-[9px]'>
            /
          </span>
          <span className='sr-only'>，</span>
          <span className='font-medium text-fd-foreground'>
            {project.award.placement}
          </span>
        </p>
      )}
      {(project.linkLabel || project.github || !!project.articles?.length) && (
        <div
          className={`flex flex-wrap items-baseline gap-x-6 gap-y-3 text-sm leading-7 text-fd-muted-foreground ${project.award ? 'mt-3' : 'mt-4 sm:mt-[18px]'}`}
        >
          {project.linkLabel && (
            <ProjectAction href={project.url} label={project.linkLabel} />
          )}
          {project.github && (
            <ProjectAction href={project.github} label='GitHub' />
          )}
          {!!project.articles?.length && (
            <details className='group min-w-0 flex-1 max-[359px]:basis-full'>
              <summary className='project-articles-toggle flex w-fit cursor-pointer list-none items-center gap-1.5 transition-colors hover:text-fd-primary focus-visible:text-fd-primary'>
                相关文章
                <span className='text-xs tabular-nums opacity-75'>
                  {project.articles.length}
                </span>
                <ChevronDown
                  aria-hidden='true'
                  className='ml-0.5 size-3.5 transition-transform group-open:rotate-180 motion-reduce:transition-none'
                />
              </summary>
              <ul className='mt-3.5 space-y-2.5 border-l border-fd-foreground/10 pl-3 text-[17px] sm:text-lg'>
                {project.articles.map((article) => (
                  <li key={article.url}>
                    <Link
                      href={article.url}
                      className='block transition-colors hover:text-fd-primary focus-visible:text-fd-primary sm:flex sm:items-baseline sm:justify-between sm:gap-3'
                    >
                      <span>{article.title}</span>
                      <span className='mt-0.5 block whitespace-nowrap text-sm sm:mt-0'>
                        {article.source}
                        <span aria-hidden='true' className='ml-1'>
                          →
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </details>
          )}
        </div>
      )}
    </div>
  </article>
);
