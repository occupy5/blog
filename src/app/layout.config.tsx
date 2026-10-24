import type { LinkItemType } from 'fumadocs-ui/layouts/links';
import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { Github, Rss } from 'lucide-react';

export const title = 'shenn.xyz';
export const description = "Silas Shen's blog";

export const baseOptions: BaseLayoutProps = { nav: { title: '不求谌解' } };

export const linkItems: LinkItemType[] = [
  { text: '文章', url: '/', active: 'url' },
  { text: '个人项目', url: '/projects', active: 'url' },
  {
    type: 'icon',
    label: 'GitHub',
    icon: <Github />,
    text: 'GitHub',
    url: 'https://github.com/occupy5',
    external: true,
  },
  {
    type: 'icon',
    label: 'RSS 订阅',
    icon: <Rss />,
    text: 'RSS',
    url: '/api/rss.xml',
  },
];
