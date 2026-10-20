import {
  rehypeCodeDefaultOptions,
  remarkMdxMermaid,
} from 'fumadocs-core/mdx-plugins';
import {
  type DefaultMDXOptions,
  defineCollections,
  defineConfig,
  frontmatterSchema,
  getDefaultMDXOptions,
} from 'fumadocs-mdx/config';
import { transformerTwoslash } from 'fumadocs-twoslash';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import { z } from 'zod';

const postSchema = frontmatterSchema.extend({
  description: z
    .string()
    .nullish()
    .transform((value) => value ?? undefined),
  date: z
    .string()
    .or(z.date())
    .transform((value, context) => {
      const date = new Date(value);

      if (Number.isNaN(date.getTime())) {
        context.issues.push({
          code: 'custom',
          message: 'The value could not be transformed to Date type.',
          input: value,
        });
        return z.NEVER;
      }

      return date;
    }),
  tags: z.array(z.string()).optional(),
});

const mdxOptions = {
  rehypeCodeOptions: {
    inline: 'tailing-curly-colon',
    themes: {
      light: 'min-light',
      dark: 'min-dark',
    },
    transformers: [
      ...(rehypeCodeDefaultOptions.transformers ?? []),
      transformerTwoslash(),
    ],
    langs: ['js', 'jsx', 'ts', 'tsx'],
  },
  remarkPlugins: [remarkMath, remarkMdxMermaid],
  rehypePlugins: (v) => [rehypeKatex, ...v],
} satisfies DefaultMDXOptions;

export const blog = defineCollections({
  type: 'doc',
  dir: 'content',
  schema: postSchema,
});

export const drafts = defineCollections({
  type: 'doc',
  dir: 'drafts',
  files: process.env.NODE_ENV === 'development' ? ['**/*.{md,mdx}'] : [],
  schema: postSchema,
  mdxOptions: getDefaultMDXOptions({
    ...mdxOptions,
    remarkImageOptions: { external: false },
  }),
});

export default defineConfig({
  lastModifiedTime: 'git',
  mdxOptions,
});
