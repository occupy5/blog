# AGENTS.md - Repository Guide

This is a **Next.js blog built with Fumadocs**, a documentation/blog framework. The blog displays MDX content from the `content/` directory with support for Tailwind CSS, KaTeX math, code highlighting, and RSS feeds.

## Quick Start

```bash
# Install dependencies (uses Bun)
bun install

# Dev server (localhost:3000)
bun dev

# Build for production
bun run build
bun start
```

## Essential Commands

### Development
- `bun dev` - Start dev server with hot reload
- `bun run build` - Build production bundle
- `bun start` - Start production server

### Code Quality (Biome)
- `bun run format` - Format code (2-space indent, single quotes)
- `bun run lint` - Lint TypeScript/JSX/CSS
- `bun run lint:fix` - Auto-fix lint issues (unsafe fixes allowed)
- `bun run check` - Run format + lint checks
- `bun run check:fix` - Auto-fix all issues (recommended before commits)

### Post-build
- `bun run postbuild` - Generates `next-sitemap` and `robots.txt` in `public/`

## Project Structure

```
src/
├── app/                     # Next.js App Router
│   ├── (home)/             # Home route group - landing page, posts list, tags
│   │   ├── page.tsx        # Home: shows 3 latest posts
│   │   ├── list/           # Posts list page (paginated)
│   │   └── tags/           # Tag filtering pages
│   ├── posts/              # Post detail pages
│   │   └── [slug]/page.tsx # Dynamic post route
│   ├── api/                # API routes (RSS, OG, search)
│   ├── layout.tsx          # Root layout (fonts, RootProvider)
│   ├── layout.config.tsx   # Navigation & site config
│   └── global.css          # Global styles
├── components/             # Reusable React components
│   ├── header.tsx          # Navigation header
│   ├── footer.tsx          # Footer
│   ├── post-card.tsx       # Post preview card
│   ├── pagination.tsx      # Pagination for post lists
│   ├── tag-card.tsx        # Tag display
│   └── ...                 # Other UI components
├── lib/
│   └── source.ts           # Content loader & utilities
│       - getPost(slugs)
│       - getPosts()
│       - getPostsSortedByDate()
│       - getTags()
│       - getPostsByTag(tag)
└── actions/                # Server actions
    └── fetch-og-metadata.ts # Fetch Open Graph metadata

content/                    # MDX blog posts (source)
├── EventLoop.mdx
├── git.mdx
├── weekly_*.mdx
└── ...
```

## Configuration Files

### TypeScript
- **`tsconfig.json`**: Strict mode enabled, path alias `@/*` → `src/*`
- Includes Next.js plugin for type generation

### Code Formatting (Biome)
- **`biome.json`**: 2-space indent, single quotes, always semicolons
- Formatter enabled with `formatWithErrors`
- Linter: recommended rules for JavaScript, JSX, React, and Next.js
- VCS integration: respects `.gitignore`

### Next.js
- **`next.config.mjs`**: 
  - MDX support via `fumadocs-mdx/next`
  - Remote image patterns (gyazo.com, gstatic.com, 5bang.top, blog-assets.shenn.xyz)
  - React strict mode enabled
- **`source.config.ts`**: 
  - MDX collection in `content/` directory
  - Frontmatter schema: title, description, date (Date type), optional tags array
  - Plugins: syntax highlighting (tokyo-night dark, github-light), Twoslash, KaTeX math
  - Auto-generates sitemaps from git last-modified time

### Styling
- **`postcss.config.mjs`**: Tailwind PostCSS plugin
- Fumadocs UI uses Tailwind with semantic tokens like `fd-card`, `fd-muted-foreground`, `fd-accent`

## Code Patterns & Conventions

### Naming
- **Files**: kebab-case (`post-card.tsx`, `layout.config.tsx`)
- **Components**: PascalCase (exported as const)
- **Functions**: camelCase

### React & Components
- Functional components only
- Props destructured in function signature
- Types defined inline or imported
- Use `fumadocs-ui` components for layout and common UI
- Tailwind classes for styling (no CSS modules)
- Link from `fumadocs-core/link` (wraps Next.js Link)

### Data Flow
1. **Content loading**: `src/lib/source.ts` uses Fumadocs to load MDX from `content/`
2. **Sorting/filtering**: Done in `source.ts` (e.g., `getPostsSortedByDate()`, `getPostsByTag()`)
3. **Pages fetch data**: Directly call helpers from `lib/source.ts`
4. **Frontmatter**: Each post requires `title`, `description`, `date`; optional `tags` array

### TypeScript
- Strict mode enforced
- Type exports explicit: `export type Post = ...`
- Inline types for component props
- `Metadata` type from `next` for page metadata

### Styling Details
- Tailwind v4 with semantic colors (Fumadocs palette)
- Color utilities: `fd-card`, `fd-muted`, `fd-accent`, `fd-foreground`, etc.
- Responsive: `max-sm:`, `lg:hidden` patterns
- Custom fonts: Geist (body), JetBrains Mono (code) from Google Fonts

### Content (MDX Posts)

**Frontmatter schema:**
```yaml
---
title: "Post Title"
description: "Short description"
date: 2024-01-15        # or ISO string
tags: ["tag1", "tag2"]  # optional array
---
```

**Supported features:**
- Markdown + React
- KaTeX math (via `$...$` or `$$...$$`)
- Code blocks with syntax highlighting (Shiki)
- Twoslash type annotations in code blocks
- Images with Next.js Image optimization
- Custom components (Fumadocs UI)

**Image hosting:** Remote images from allowed domains (configured in next.config.mjs). Add new domains if needed.

## Important Gotchas

1. **Generated content**: `.source` directory is generated by `fumadocs-mdx` during build—never edit directly and it's in `.gitignore`
2. **Post dates matter**: Posts are sorted by frontmatter `date`. Ensure format is valid (ISO string or JS Date-parseable)
3. **Bun != npm**: Uses Bun package manager. `bun.lock` and `bun.lockb` are the lock files.
4. **Route slugs**: Post URLs derive from file paths in `content/`. Nested MDX → nested routes.
5. **Biome formatting**: Aggressive, so run `bun run check:fix` before committing to avoid lint/format surprises
6. **Tailwind v4**: Uses new `@tailwindcss/postcss` plugin, not the classic Tailwind config file
7. **RSS & sitemaps**: Auto-generated by `next-sitemap` in `postbuild` step—output in `public/`
8. **Tag filtering**: Tags must be manually assigned in frontmatter; they don't auto-generate from content

## Development Tips

- **Hot reload**: Dev server watches `src/` and `content/` for changes
- **Testing content locally**: Add MDX to `content/`, run `bun dev`, check at `http://localhost:3000/posts/[filename]`
- **Preview before build**: Always run `bun dev` to test—Fumadocs generates `.source` on startup
- **SEO**: OG images generated dynamically at `/api/og`; Open Graph metadata auto-included in pages
- **Component reuse**: Check `src/components/` for existing UI before creating new ones
- **Performance**: Fumadocs uses static generation; all posts pre-built at compile time

## Type Safety

- **`Post` type**: Exported from `src/lib/source.ts`; use for posts returned from Fumadocs loaders
- **`PageTree` type**: Exported from `src/lib/source.ts`; represents navigation structure
- **Metadata type**: Import from `next` for page-level metadata
- All component props have explicit types

## Testing & Quality

- `bun run test:drafts` - Run draft publishing regression tests
- Manual testing via `bun dev` and browser
- Use `bun run check:fix` to catch issues before deployment

## Deployment

- Next.js static export or server deployment ready
- Sitemaps auto-generated: `public/sitemap.xml`, `public/sitemap-*.xml`
- RSS feed: `/api/rss.xml`
- Environment variable: `NEXT_PUBLIC_SITE_URL` for metadata base URL (defaults to `http://localhost:3000`)

## Dependencies Overview

- **Next.js 16**: App Router, Image optimization
- **Fumadocs**: MDX content framework, UI components
- **Tailwind CSS v4**: Styling with PostCSS
- **React 19**: UI library
- **Biome**: Linting & formatting
- **KaTeX & Remark Math**: Math rendering
- **Shiki**: Syntax highlighting
- **next-themes**: Dark mode support
- **Zod**: Frontmatter validation
- **Mermaid**: Diagram rendering (flowchart, sequence, state, class, ER, Gantt, pie charts)
