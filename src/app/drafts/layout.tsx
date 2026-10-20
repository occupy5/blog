import type { ReactNode } from 'react';
import { baseOptions, linkItems } from '@/app/layout.config';
import { PostsLayout } from '@/components/posts';
import { draftPageTree } from '@/lib/draft-source';

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <PostsLayout {...baseOptions} tree={draftPageTree} links={linkItems}>
      {children}
    </PostsLayout>
  );
};

export default Layout;
