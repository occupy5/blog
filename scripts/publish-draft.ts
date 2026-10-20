import { access, readFile, rename } from 'node:fs/promises';
import path from 'node:path';
import { createProcessor } from '@mdx-js/mdx';

const asRecord = (value: unknown): Record<string, unknown> | undefined =>
  value !== null && typeof value === 'object'
    ? (value as Record<string, unknown>)
    : undefined;

const getStaticString = (value: unknown): string | undefined => {
  if (typeof value === 'string') return value;
  const node = asRecord(value);
  if (!node) return undefined;

  switch (node.type) {
    case 'Literal':
      return typeof node.value === 'string' ? node.value : undefined;
    case 'mdxJsxAttributeValueExpression':
      return getStaticString(asRecord(node.data)?.estree);
    case 'Program':
      return Array.isArray(node.body) && node.body.length === 1
        ? getStaticString(node.body[0])
        : undefined;
    case 'ExpressionStatement':
      return getStaticString(node.expression);
    default:
      return undefined;
  }
};

const getRelativeReferences = (source: string): string[] => {
  const references = new Set<string>();
  const imageReferences = new Set<string>();
  const definitions = new Map<string, string>();
  const check = (value: string | undefined) => {
    const reference = value?.trim();
    if (reference && !/^(?:[a-z][a-z\d+.-]*:|\/|#|\?)/i.test(reference)) {
      references.add(reference);
    }
  };
  const visit = (value: unknown): void => {
    if (Array.isArray(value)) {
      for (const child of value) visit(child);
      return;
    }
    const node = asRecord(value);
    if (!node) return;

    if (node.type === 'image') {
      check(typeof node.url === 'string' ? node.url : undefined);
    } else if (
      node.type === 'imageReference' &&
      typeof node.identifier === 'string'
    ) {
      imageReferences.add(node.identifier);
    } else if (
      node.type === 'definition' &&
      typeof node.identifier === 'string' &&
      typeof node.url === 'string'
    ) {
      definitions.set(node.identifier, node.url);
    } else if (
      node.type === 'mdxJsxAttribute' &&
      ['src', 'href', 'poster'].includes(String(node.name))
    ) {
      check(getStaticString(node.value));
    } else if (
      [
        'ImportDeclaration',
        'ExportNamedDeclaration',
        'ExportAllDeclaration',
        'ImportExpression',
      ].includes(String(node.type))
    ) {
      const specifier = getStaticString(node.source);
      if (specifier && /^\.\.?($|\/)/.test(specifier)) check(specifier);
    }

    for (const child of Object.values(node)) visit(child);
  };

  // Parse only the body: frontmatter is YAML, not MDX.
  const body = source.replace(
    /^\uFEFF?---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/,
    '',
  );
  visit(createProcessor().parse(body));
  for (const identifier of imageReferences) check(definitions.get(identifier));
  return [...references];
};

const slug = process.argv[2];

if (!slug || !/^[a-zA-Z0-9][a-zA-Z0-9_-]*$/.test(slug)) {
  console.error('用法：bun run publish:draft <slug>');
  console.error('slug 只能包含字母、数字、连字符和下划线。');
  process.exit(1);
}

const projectRoot = process.cwd();
const source = path.join(projectRoot, 'drafts', `${slug}.mdx`);
const destination = path.join(projectRoot, 'content', `${slug}.mdx`);

try {
  await access(source);
} catch {
  console.error(`找不到草稿：drafts/${slug}.mdx`);
  process.exit(1);
}

try {
  const references = getRelativeReferences(await readFile(source, 'utf8'));
  if (references.length > 0) {
    console.error('无法发布：文章包含移动后可能失效的相对资源或模块引用：');
    for (const reference of references) console.error(`  ${reference}`);
    console.error(
      '请改用远程 URL 或 public/ 下的站点绝对资源路径（如 /images/example.png）。',
    );
    process.exit(1);
  }
} catch (error) {
  console.error(
    '无法解析草稿，请检查 MDX 语法：',
    error instanceof Error ? error.message : error,
  );
  process.exit(1);
}

try {
  await access(destination);
  console.error(`正式文章已存在：content/${slug}.mdx`);
  process.exit(1);
} catch {
  // The destination should not exist before publishing.
}

await rename(source, destination);
console.log(`已发布草稿：drafts/${slug}.mdx → content/${slug}.mdx`);
console.log('请运行 bun run check 和 bun run build，然后提交正式文章。');
