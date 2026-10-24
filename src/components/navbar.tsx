import { cn } from 'fumadocs-ui/utils/cn';
import type { HTMLAttributes } from 'react';

export const Navbar = ({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLElement>) => (
  <header
    {...props}
    className={cn(
      'fixed inset-x-0 top-0 z-30 bg-fd-background/95 backdrop-blur-sm',
      className,
    )}
  >
    <nav
      aria-label='主导航'
      className='mx-auto flex h-16 w-full max-w-[1200px] items-center px-5 sm:px-10'
    >
      {children}
    </nav>
  </header>
);
