'use client';

import Link from 'fumadocs-core/link';
import { SearchToggle } from 'fumadocs-ui/components/layout/search-toggle';
import { ThemeToggle } from 'fumadocs-ui/components/layout/theme-toggle';
import type { HomeLayoutProps } from 'fumadocs-ui/layouts/home';
import type { LinkItemType } from 'fumadocs-ui/layouts/links';
import { usePathname } from 'next/navigation';
import { Navbar } from './navbar';

export const Header = ({
  nav = {},
  finalLinks,
}: HomeLayoutProps & { finalLinks: LinkItemType[] }) => {
  const pathname = usePathname();

  return (
    <Navbar>
      <Link
        href={nav.url ?? '/'}
        className='shrink-0 text-[15px] font-medium tracking-tight text-fd-foreground transition-colors duration-150 hover:text-fd-primary focus-visible:text-fd-primary'
      >
        {nav.title}
      </Link>
      <ul className='ms-auto flex items-center gap-1 sm:gap-3'>
        {finalLinks.map((item, index) => {
          if (item.type === 'custom')
            return <li key={index.toString()}>{item.children}</li>;
          if (item.type === 'menu') return null;
          const active =
            item.url === '/'
              ? pathname === '/' || pathname.startsWith('/posts/')
              : pathname === item.url || pathname.startsWith(`${item.url}/`);
          const icon = item.type === 'icon';
          return (
            <li key={item.url} className={icon ? 'hidden sm:block' : undefined}>
              <Link
                href={item.url}
                external={item.external}
                aria-current={active ? 'page' : undefined}
                aria-label={icon ? item.label : undefined}
                className={`site-link inline-flex h-9 items-center justify-center rounded-md text-sm transition-colors duration-150 ${icon ? 'w-9 [&_svg]:size-4' : 'px-2 sm:px-3'}`}
              >
                {icon ? item.icon : item.text}
              </Link>
            </li>
          );
        })}
      </ul>
      <div className='ms-1 flex shrink-0 items-center gap-1 text-fd-muted-foreground sm:ms-3'>
        <SearchToggle
          hideIfDisabled
          className='size-9 rounded-md hover:bg-fd-muted'
        />
        <ThemeToggle
          aria-label='切换主题'
          className='site-theme-toggle size-9 rounded-md hover:bg-fd-muted'
        />
      </div>
    </Navbar>
  );
};
