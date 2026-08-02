'use client';

import { renderMermaid, THEMES } from 'beautiful-mermaid';
import { Maximize2, Minus, Plus, RotateCcw, X } from 'lucide-react';
import { useTheme } from 'next-themes';
import { use, useEffect, useId, useRef, useState } from 'react';

export function Mermaid({ chart }: { chart: string }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return <MermaidContent chart={chart} />;
}

const cache = new Map<string, Promise<string>>();

const cjkCharacterPattern =
  /([\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}\u3000-\u303f\uff01-\uff60])/gu;

function compensateCjkTextWidth(chart: string) {
  return chart.replace(cjkCharacterPattern, '$1\u200B');
}

function getSvgDimensions(svg: string) {
  const viewBox = svg.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/);

  return {
    width: viewBox ? Number(viewBox[1]) : 800,
    height: viewBox ? Number(viewBox[2]) : 600,
  };
}

function cachePromise(
  key: string,
  setPromise: () => Promise<string>,
): Promise<string> {
  const cached = cache.get(key);
  if (cached) return cached;

  const promise = setPromise();
  cache.set(key, promise);
  return promise;
}

function MermaidContent({ chart }: { chart: string }) {
  const { resolvedTheme } = useTheme();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const dialogId = useId();
  const dialogTitleId = `${dialogId}-title`;
  const [zoom, setZoom] = useState(1);

  const baseTheme =
    resolvedTheme === 'dark'
      ? THEMES['catppuccin-mocha']
      : THEMES['catppuccin-latte'];

  const svg = use(
    cachePromise(`${chart}-${resolvedTheme}`, async () => {
      const code = compensateCjkTextWidth(chart.replaceAll('\\n', '\n'));

      return renderMermaid(code, {
        ...baseTheme,
        transparent: true,
      });
    }),
  );

  const { width: diagramWidth, height: diagramHeight } = getSvgDimensions(svg);
  const zoomBaseWidth = Math.max(
    diagramWidth,
    Math.min(576, diagramWidth * 1.6),
  );
  const zoomedWidth = zoomBaseWidth * zoom;

  const openDialog = () => {
    setZoom(1);
    dialogRef.current?.showModal();
  };

  const closeDialog = () => {
    dialogRef.current?.close();
  };

  return (
    <figure
      style={{
        width: diagramWidth,
        maxWidth: '100%',
        aspectRatio: `${diagramWidth} / ${diagramHeight}`,
      }}
      className='not-prose group relative mx-auto mb-8 mt-12'
    >
      <button
        type='button'
        aria-controls={dialogId}
        aria-haspopup='dialog'
        onClick={openDialog}
        className='absolute -top-8 right-0 z-10 inline-flex items-center gap-1.5 rounded-full border border-fd-border/60 bg-fd-background/70 px-2.5 py-1 text-xs font-medium text-fd-muted-foreground opacity-80 shadow-sm backdrop-blur-md transition hover:bg-fd-accent hover:text-fd-accent-foreground hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fd-ring sm:opacity-0 sm:group-hover:opacity-100'
      >
        <Maximize2 aria-hidden='true' className='size-3.5' />
        放大查看
      </button>
      <div
        className='[&>svg]:block [&>svg]:h-auto [&>svg]:w-full'
        // biome-ignore lint/security/noDangerouslySetInnerHtml: The trusted local Mermaid source is escaped and rendered to SVG by beautiful-mermaid.
        dangerouslySetInnerHTML={{ __html: svg }}
      />

      <dialog
        id={dialogId}
        ref={dialogRef}
        aria-labelledby={dialogTitleId}
        onClick={(event) => {
          if (event.target === event.currentTarget) closeDialog();
        }}
        onKeyDown={(event) => {
          if (event.key === 'Escape') closeDialog();
        }}
        onClose={() => setZoom(1)}
        className='m-auto h-dvh max-h-none w-dvw max-w-none overflow-hidden border-0 bg-fd-background/95 p-0 text-fd-foreground shadow-2xl backdrop:bg-black/50 backdrop:backdrop-blur-sm sm:h-[calc(100dvh-4rem)] sm:w-[calc(100vw-4rem)] sm:rounded-2xl sm:border sm:border-fd-border/70'
      >
        <div className='flex h-full flex-col'>
          <div className='flex shrink-0 items-center justify-between gap-3 border-b border-fd-border/60 bg-fd-background/80 px-3 py-2 backdrop-blur-md sm:px-4'>
            <h2 id={dialogTitleId} className='text-sm font-medium'>
              图表预览
            </h2>
            <div className='flex items-center gap-1'>
              <button
                type='button'
                aria-label='缩小图表'
                disabled={zoom <= 0.75}
                onClick={() => setZoom((value) => Math.max(0.75, value - 0.25))}
                className='rounded-md p-2 text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground disabled:pointer-events-none disabled:opacity-40'
              >
                <Minus aria-hidden='true' className='size-4' />
              </button>
              <span className='w-12 text-center text-xs tabular-nums text-fd-muted-foreground'>
                {Math.round(zoom * 100)}%
              </span>
              <button
                type='button'
                aria-label='放大图表'
                disabled={zoom >= 2}
                onClick={() => setZoom((value) => Math.min(2, value + 0.25))}
                className='rounded-md p-2 text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground disabled:pointer-events-none disabled:opacity-40'
              >
                <Plus aria-hidden='true' className='size-4' />
              </button>
              <button
                type='button'
                aria-label='重置缩放'
                onClick={() => setZoom(1)}
                className='rounded-md p-2 text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground'
              >
                <RotateCcw aria-hidden='true' className='size-4' />
              </button>
              <button
                type='button'
                aria-label='关闭图表预览'
                onClick={closeDialog}
                className='ml-1 rounded-md p-2 text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground'
              >
                <X aria-hidden='true' className='size-4' />
              </button>
            </div>
          </div>

          <div className='min-h-0 flex-1 overflow-auto p-4 sm:p-8'>
            <div
              style={{ width: zoomedWidth }}
              className='mx-auto [&>svg]:h-auto [&>svg]:w-full [&>svg]:max-w-none'
              // biome-ignore lint/security/noDangerouslySetInnerHtml: The trusted local Mermaid source is escaped and rendered to SVG by beautiful-mermaid.
              dangerouslySetInnerHTML={{ __html: svg }}
            />
          </div>
        </div>
      </dialog>
    </figure>
  );
}
