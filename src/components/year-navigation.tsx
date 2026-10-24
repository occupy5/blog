'use client';

import Link from 'fumadocs-core/link';
import {
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';

const desktopQuery = '(min-width: 1280px)';

const subscribeToViewport = (onChange: () => void) => {
  const media = window.matchMedia(desktopQuery);
  media.addEventListener('change', onChange);
  return () => media.removeEventListener('change', onChange);
};

const isDesktop = () => window.matchMedia(desktopQuery).matches;
const serverSnapshot = () => false;

const useActiveYear = (years: string[]) => {
  const [activeYear, setActiveYear] = useState(years[0]);

  useEffect(() => {
    const sections = years.map((year) => document.getElementById(year));
    let frame: number | null = null;

    const update = () => {
      frame = null;
      const page = document.documentElement;
      const readingLine = Math.max(
        Number.parseFloat(getComputedStyle(page).scrollPaddingTop) || 96,
        window.innerHeight / 4,
      );
      let current = years[0];
      for (let index = 0; index < sections.length; index++) {
        const section = sections[index];
        if (section && section.getBoundingClientRect().top <= readingLine) {
          current = years[index];
        }
      }
      if (window.scrollY + window.innerHeight >= page.scrollHeight - 2) {
        current = years[years.length - 1];
      }
      setActiveYear(current);
    };
    const scheduleUpdate = () => {
      if (frame === null) frame = requestAnimationFrame(update);
    };

    const observer = new ResizeObserver(scheduleUpdate);
    observer.observe(document.getElementById('main-content') ?? document.body);
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);
    window.addEventListener('hashchange', scheduleUpdate);
    update();
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
      window.removeEventListener('hashchange', scheduleUpdate);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, [years]);

  return activeYear;
};

export const YearNavigation = ({ years }: { years: string[] }) => {
  const desktop = useSyncExternalStore(
    subscribeToViewport,
    isDesktop,
    serverSnapshot,
  );
  if (!desktop || years.length < 2) return null;

  return <YearNavigationContent years={years} />;
};

const YearNavigationContent = ({ years }: { years: string[] }) => {
  const activeYear = useActiveYear(years);
  const [expanded, setExpanded] = useState(false);
  const [hoveredYear, setHoveredYear] = useState<string | null>(null);
  const [focusedYear, setFocusedYear] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const restoringFocus = useRef(false);
  const listId = useId();
  const interactionYear = expanded ? (hoveredYear ?? focusedYear) : null;
  const focalIndex = Math.max(years.indexOf(interactionYear ?? activeYear), 0);

  const cancelClose = () => {
    if (closeTimer.current !== null) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const open = () => {
    cancelClose();
    setExpanded(true);
  };

  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => {
      const focused = document.activeElement;
      const focusInside =
        focused instanceof HTMLElement && navRef.current?.contains(focused);
      if (!focusInside || !focused.matches(':focus-visible')) {
        if (focusInside) focused.blur();
        setHoveredYear(null);
        setFocusedYear(null);
        setExpanded(false);
      }
    }, 200);
  };

  useEffect(
    () => () => {
      if (closeTimer.current !== null) clearTimeout(closeTimer.current);
    },
    [],
  );

  useEffect(() => {
    if (!expanded) return;

    const onPointerDown = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !navRef.current?.contains(event.target)
      ) {
        setHoveredYear(null);
        setFocusedYear(null);
        setExpanded(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;

      if (navRef.current?.contains(document.activeElement)) {
        event.preventDefault();
        restoringFocus.current = true;
        triggerRef.current?.focus({ preventScroll: true });
        restoringFocus.current = false;
      }
      setHoveredYear(null);
      setFocusedYear(null);
      setExpanded(false);
    };

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [expanded]);

  return (
    <nav
      ref={navRef}
      aria-label='按年份浏览'
      data-expanded={expanded}
      className='year-navigation archive-font fixed top-[calc(50%+2rem)] right-[max(1.5rem,calc((100vw-1200px)/2))] z-20 hidden w-28 -translate-y-1/2 xl:block'
      onPointerEnter={(event) => {
        if (event.pointerType === 'mouse') open();
      }}
      onPointerLeave={() => {
        setHoveredYear(null);
        scheduleClose();
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) scheduleClose();
      }}
    >
      <button
        ref={triggerRef}
        type='button'
        aria-label={`按年份浏览，当前 ${activeYear} 年`}
        aria-expanded={expanded}
        aria-controls={listId}
        className='sr-only'
        onFocus={() => {
          if (!restoringFocus.current) open();
        }}
        onClick={open}
      />
      <ul
        id={listId}
        aria-hidden={!expanded}
        inert={!expanded}
        className='max-h-[calc(100svh-10rem)] overflow-y-auto py-2'
      >
        {years.map((year, index) => (
          <li key={year}>
            <Link
              href={`#${year}`}
              aria-label={`${year} 年文章`}
              aria-current={year === activeYear ? 'location' : undefined}
              data-distance={Math.min(Math.abs(index - focalIndex), 3)}
              className='year-navigation-link'
              onPointerEnter={(event) => {
                if (event.pointerType === 'mouse') setHoveredYear(year);
              }}
              onFocus={(event) => {
                open();
                if (event.currentTarget.matches(':focus-visible')) {
                  setFocusedYear(year);
                }
              }}
              onBlur={() => setFocusedYear(null)}
            >
              <span aria-hidden='true' className='year-navigation-tick' />
              <span className='year-navigation-label'>{year}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};
