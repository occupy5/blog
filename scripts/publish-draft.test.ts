import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

const script = fileURLToPath(new URL('./publish-draft.ts', import.meta.url));
const frontmatter = '---\ntitle: "A < B"\ndate: 2026-10-20\n---\n';

const withDraft = async (
  body: string,
  verify: (root: string, source: string) => Promise<void>,
) => {
  const root = await mkdtemp(path.join(tmpdir(), 'blog-publish-test-'));
  const source = frontmatter + body;
  try {
    await mkdir(path.join(root, 'drafts'));
    await mkdir(path.join(root, 'content'));
    await writeFile(path.join(root, 'drafts/example.mdx'), source);
    await verify(root, source);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
};

const publish = (root: string) =>
  spawnSync(process.execPath, [script, 'example'], {
    cwd: root,
    encoding: 'utf8',
  });

test('publishes remote and public images without changing the article', async () => {
  await withDraft(
    '![remote](https://example.com/image.png)\n![public](/images/image.png)\n',
    async (root, source) => {
      const result = publish(root);
      assert.equal(result.status, 0, result.stderr);
      assert.equal(
        await readFile(path.join(root, 'content/example.mdx'), 'utf8'),
        source,
      );
      await assert.rejects(readFile(path.join(root, 'drafts/example.mdx')), {
        code: 'ENOENT',
      });
    },
  );
});

for (const [name, body] of [
  ['Markdown image', '![image](./diagram.png)'],
  ['reference image', '![image][diagram]\n\n[diagram]: ../diagram.png'],
  ['JSX image', '<img src="./diagram.png" alt="diagram" />'],
  ['JSX expression', '<img src={"./diagram.png"} alt="diagram" />'],
  ['module import', 'import Image from "./diagram.png"\n\n# Article'],
  ['module export', 'export { default as Image } from "./diagram.png"'],
  ['dynamic import', 'export const image = import("./diagram.png")'],
]) {
  test(`rejects a relative ${name} and preserves the draft`, async () => {
    await withDraft(body, async (root, source) => {
      const result = publish(root);
      assert.equal(result.status, 1);
      assert.match(result.stderr, /diagram\.png/);
      assert.equal(
        await readFile(path.join(root, 'drafts/example.mdx'), 'utf8'),
        source,
      );
      await assert.rejects(readFile(path.join(root, 'content/example.mdx')), {
        code: 'ENOENT',
      });
    });
  });
}

test('ignores relative paths in fenced and inline code examples', async () => {
  await withDraft(
    '```mdx\n![image](./diagram.png)\n```\n\n`<img src="./diagram.png" />`',
    async (root) => {
      const result = publish(root);
      assert.equal(result.status, 0, result.stderr);
    },
  );
});

test('allows package imports and project aliases', async () => {
  await withDraft(
    'import { Tabs } from "fumadocs-ui/components/tabs"\nimport { LinkPreview } from "@/components/link-preview"\n\n# Article',
    async (root) => {
      const result = publish(root);
      assert.equal(result.status, 0, result.stderr);
    },
  );
});

test('does not treat a link definition as an image resource', async () => {
  await withDraft('[other][article]\n\n[article]: other-post', async (root) => {
    const result = publish(root);
    assert.equal(result.status, 0, result.stderr);
  });
});

test('preserves a draft with invalid MDX', async () => {
  await withDraft('<Component', async (root, source) => {
    const result = publish(root);
    assert.equal(result.status, 1);
    assert.match(result.stderr, /MDX/);
    assert.equal(
      await readFile(path.join(root, 'drafts/example.mdx'), 'utf8'),
      source,
    );
    await assert.rejects(readFile(path.join(root, 'content/example.mdx')), {
      code: 'ENOENT',
    });
  });
});

test('does not overwrite an existing published article', async () => {
  await withDraft('# Article', async (root, source) => {
    await writeFile(path.join(root, 'content/example.mdx'), 'existing article');
    const result = publish(root);
    assert.equal(result.status, 1);
    assert.equal(
      await readFile(path.join(root, 'content/example.mdx'), 'utf8'),
      'existing article',
    );
    assert.equal(
      await readFile(path.join(root, 'drafts/example.mdx'), 'utf8'),
      source,
    );
  });
});
