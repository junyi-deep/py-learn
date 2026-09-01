'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Braces, Code2, Compass, GitBranch, Map, TerminalSquare } from 'lucide-react';
import { useCourseProgress } from '@/components/course-progress';

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

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-ink/8 bg-cream/88 backdrop-blur-xl">
        <div className="mx-auto flex h-18 max-w-[1440px] items-center justify-between px-5 md:px-9">
          <Link className="group flex items-center gap-3" href="/" aria-label="PyPath 首页">
            <span className="grid size-10 place-items-center rounded-[14px] bg-ink text-cream shadow-[0_8px_24px_rgba(23,35,60,.18)] transition-transform group-hover:-rotate-3">
              <Code2 className="size-5" />
            </span>
            <span>
              <span className="block font-display text-[17px] font-bold leading-none tracking-[-0.03em]">PyPath</span>
              <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.18em] text-ink/45">learning atlas</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 rounded-full border border-ink/8 bg-white/70 p-1 md:flex" aria-label="主导航">
            {navItems.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={active
                    ? 'rounded-full bg-ink px-4 py-2 text-xs font-semibold text-white shadow-sm'
                    : 'rounded-full px-4 py-2 text-xs font-semibold text-ink/55 transition hover:bg-ink/5 hover:text-ink'}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <span className="hidden text-right sm:block">
              <span className="block text-[11px] font-semibold text-ink/45">总进度</span>
              <span className="block text-sm font-bold tabular-nums">{hydrated ? totalPercent : 0}%</span>
            </span>
            <span className="relative grid size-10 place-items-center rounded-full border border-ink/10 bg-white text-ink">
              <Compass className="size-4" />
              <span className="absolute -right-0.5 -top-0.5 size-2.5 rounded-full border-2 border-cream bg-mint" />
            </span>
          </div>
        </div>
      </header>

      {children}

      <nav className="fixed inset-x-3 bottom-3 z-50 grid grid-cols-4 rounded-[20px] border border-white/70 bg-ink/94 p-1.5 shadow-[0_18px_50px_rgba(23,35,60,.28)] backdrop-blur-xl md:hidden" aria-label="移动端主导航">
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
      </nav>
    </div>
  );
}
