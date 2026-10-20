import { drafts } from '.source';
import { loader } from 'fumadocs-core/source';
import { createMDXSource } from 'fumadocs-mdx/runtime/next';

export const {
  getPage: getDraft,
  getPages: getDrafts,
  pageTree: draftPageTree,
} = loader({
  baseUrl: '/drafts',
  source: createMDXSource(drafts),
});
