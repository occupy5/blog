import * as Twoslash from 'fumadocs-twoslash/ui';
import { Accordion, Accordions } from 'fumadocs-ui/components/accordion';
import { CodeBlock, Pre } from 'fumadocs-ui/components/codeblock';
import {
  ImageZoom,
  type ImageZoomProps,
} from 'fumadocs-ui/components/image-zoom';
import { Step, Steps } from 'fumadocs-ui/components/steps';
import { Tab, Tabs } from 'fumadocs-ui/components/tabs';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import { cn } from 'fumadocs-ui/utils/cn';
import type { MDXComponents } from 'mdx/types';
import { LinkPreview } from '@/components/link-preview';
import { Mermaid } from '@/components/mermaid';

const DraftImage = (props: ImageZoomProps) => {
  if (typeof props.src !== 'string' || (props.width && props.height)) {
    return <ImageZoom {...props} />;
  }

  return (
    <ImageZoom {...props}>
      {/* biome-ignore lint/performance/noImgElement: Draft previews skip fetching remote image dimensions. */}
      <img
        src={props.src}
        alt={props.alt}
        title={props.title}
        loading='lazy'
        decoding='async'
        className={cn('h-auto max-w-full', props.className)}
      />
    </ImageZoom>
  );
};

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

export const draftMdxComponents: MDXComponents = {
  ...mdxComponents,
  img: DraftImage,
};
