import type { MDXComponents } from 'mdx/types';
import { CodeBlock, Pre } from 'fumadocs-ui/components/codeblock';
import {
  ImageZoom,
  type ImageZoomProps,
} from 'fumadocs-ui/components/image-zoom';
import { Steps, Step } from 'fumadocs-ui/components/steps';
import { Accordions, Accordion } from 'fumadocs-ui/components/accordion';
import { Tabs, Tab } from 'fumadocs-ui/components/tabs';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import * as Twoslash from 'fumadocs-twoslash/ui';
import { Mermaid } from '@/components/mermaid';
import { LinkPreview } from '@/components/link-preview';

export const mdxComponents: MDXComponents = {
  ...defaultMdxComponents,
  ...Twoslash,
  Mermaid,
  Steps,
  Step,
  Accordions,
  Accordion,
  Tabs,
  Tab,
  img: (props: ImageZoomProps) => <ImageZoom {...props} />,
  pre: ({ children, ...props }) => (
    <CodeBlock
      {...props}
      viewportProps={{
        className: 'max-h-fit',
      }}
    >
      <Pre>{children}</Pre>
    </CodeBlock>
  ),
  LinkPreview,
} as MDXComponents;
