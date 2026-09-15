'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Braces, Code2, Compass, GitBranch, Map, TerminalSquare } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useCourseProgress } from '@/components/course-progress';
import { readFoundationMode, saveFoundationMode } from '@/lib/foundation-mode';

const navItems = [
  { href: '/', label: '学习星图', shortLabel: '星图', icon: Map },
  { href: '/foundations', label: '基础', shortLabel: '基础', icon: Braces },
  { href: '/projects', label: '实战', shortLabel: '实战', icon: TerminalSquare },
  { href: '/algorithms', label: '算法', shortLabel: '算法', icon: GitBranch },
];

function isActive(pathname: string, href: string) {
  return href === '/' ? pathname === '/' : pathname.startsWith(href);
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { totalPercent, hydrated } = useCourseProgress();
  const [practiceMode, setPracticeMode] = useState(true);
  const onFoundations = pathname.startsWith('/foundations');

  useEffect(() => {
    const syncMode = () => setPracticeMode(readFoundationMode());
    syncMode();
    window.addEventListener('popstate', syncMode);
    window.addEventListener('pypath:location-change', syncMode);
    return () => {
      window.removeEventListener('popstate', syncMode);
      window.removeEventListener('pypath:location-change', syncMode);
    };
  }, [pathname]);

  function switchFoundationMode(nextPracticeMode: boolean) {
    const url = new URL(window.location.href);
    url.searchParams.set('mode', nextPracticeMode ? 'practice' : 'learn');
    saveFoundationMode(nextPracticeMode);
    window.history.replaceState({}, '', url);
    setPracticeMode(nextPracticeMode);
    window.dispatchEvent(new Event('pypath:location-change'));
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-ink/8 bg-cream/88 backdrop-blur-xl">
        <div className={`mx-auto flex max-w-[1600px] items-center px-4 transition-[height] md:px-8 ${practiceMode && onFoundations ? 'h-12 justify-center' : 'h-18 justify-between'}`}>
          {!(practiceMode && onFoundations) && <Link className="group flex items-center gap-3" href="/" aria-label="PyPath 首页">
            <span className="grid size-10 place-items-center rounded-[14px] bg-ink text-cream shadow-[0_8px_24px_rgba(23,35,60,.18)] transition-transform group-hover:-rotate-3">
              <Code2 className="size-5" />
            </span>
            <span>
              <span className="block font-display text-[17px] font-bold leading-none tracking-[-0.03em]">PyPath</span>
              <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.18em] text-ink/45">learning atlas</span>
            </span>
          </Link>}

          <div className={`items-center gap-2 ${practiceMode && onFoundations ? 'flex max-w-full overflow-x-auto' : onFoundations ? 'flex' : 'hidden md:flex'}`}>
          <nav className={`shrink-0 items-center gap-1 rounded-full border border-ink/8 bg-white/70 p-1 ${onFoundations && !practiceMode ? 'hidden md:flex' : 'flex'}`} aria-label="主导航">
            {navItems.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={active
                    ? `rounded-full bg-ink font-semibold text-white shadow-sm ${practiceMode && onFoundations ? 'px-3 py-1.5 text-[11px]' : 'px-4 py-2 text-xs'}`
                    : `rounded-full font-semibold text-ink/55 transition hover:bg-ink/5 hover:text-ink ${practiceMode && onFoundations ? 'px-3 py-1.5 text-[11px]' : 'px-4 py-2 text-xs'}`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          {onFoundations && (
            <div className="flex shrink-0 items-center rounded-full border border-ink/8 bg-white/70 p-1" aria-label="基础页面模式">
              <button type="button" aria-pressed={!practiceMode} onClick={() => switchFoundationMode(false)} className={`rounded-full px-3 py-1.5 text-[11px] font-semibold transition ${!practiceMode ? 'bg-mint-pale text-mint-dark' : 'text-ink/48 hover:text-ink'}`}>学习</button>
              <button type="button" aria-pressed={practiceMode} onClick={() => switchFoundationMode(true)} className={`rounded-full px-3 py-1.5 text-[11px] font-semibold transition ${practiceMode ? 'bg-mint-pale text-mint-dark' : 'text-ink/48 hover:text-ink'}`}>做题</button>
            </div>
          )}
          </div>

          {!(practiceMode && onFoundations) && <div className="flex items-center gap-3">
            <span className="hidden text-right sm:block">
              <span className="block text-[11px] font-semibold text-ink/45">总进度</span>
              <span className="block text-sm font-bold tabular-nums">{hydrated ? totalPercent : 0}%</span>
            </span>
            <span className="relative grid size-10 place-items-center rounded-full border border-ink/10 bg-white text-ink">
              <Compass className="size-4" />
              <span className="absolute -right-0.5 -top-0.5 size-2.5 rounded-full border-2 border-cream bg-mint" />
            </span>
          </div>}
        </div>
      </header>

      {children}

      {!(practiceMode && onFoundations) && <nav className="fixed inset-x-3 bottom-3 z-50 grid grid-cols-4 rounded-[20px] border border-white/70 bg-ink/94 p-1.5 shadow-[0_18px_50px_rgba(23,35,60,.28)] backdrop-blur-xl md:hidden" aria-label="移动端主导航">
        {navItems.map((item) => {
          const active = isActive(pathname, item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? 'page' : undefined}
              className={`flex min-h-12 flex-col items-center justify-center gap-1 rounded-[14px] text-[10px] font-semibold transition ${active ? 'bg-white text-ink' : 'text-white/52 hover:text-white'}`}
            >
              <Icon className="size-4" />
              {item.shortLabel}
            </Link>
          );
        })}
      </nav>}
    </div>
  );
}
