'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, BookOpenText, Check, ChevronRight, Circle, Clock3, Code2, Lightbulb, ListChecks, Route } from 'lucide-react';
import { PythonExercise } from '@/components/python-exercise';
import { useCourseProgress } from '@/components/course-progress';
import { foundationChapters } from '@/lib/course-data';

export function FoundationsWorkbench() {
  const [selectedId, setSelectedId] = useState(foundationChapters[0].id);
  const { foundations, foundationPercent } = useCourseProgress();

  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get('chapter');
    if (requested && foundationChapters.some((chapter) => chapter.id === requested)) setSelectedId(requested);
  }, []);

  const chapter = useMemo(() => foundationChapters.find((item) => item.id === selectedId) ?? foundationChapters[0], [selectedId]);
  const chapterIndex = foundationChapters.findIndex((item) => item.id === chapter.id);

  function selectChapter(id: string) {
    setSelectedId(id);
    const url = new URL(window.location.href);
    url.searchParams.set('chapter', id);
    window.history.replaceState({}, '', url);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <main className="mx-auto max-w-[1440px] px-5 pb-28 pt-8 md:px-9 md:pb-16 md:pt-10">
      <section className="mb-7 overflow-hidden rounded-[28px] border border-ink/9 bg-white/72 p-6 shadow-[0_18px_60px_rgba(23,35,60,.07)] sm:p-8">
        <div className="grid gap-7 lg:grid-cols-[1fr_320px] lg:items-end">
          <div>
            <div className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.17em] text-mint-dark"><Route className="size-4" /> Stage 01 · Foundations</div>
            <h1 className="font-display text-[clamp(2.2rem,4vw,4.1rem)] font-bold leading-none tracking-[-0.05em] text-ink">建立 Python 语言直觉</h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-ink/55">每章先理解一个清晰的心智模型，再在浏览器里运行真实 Python。只有全部用例通过，学习星图上的节点才会点亮。</p>
          </div>
          <div className="rounded-[20px] bg-mint-pale p-4">
            <div className="mb-3 flex items-center justify-between"><span className="text-xs font-bold text-mint-dark">阶段进度</span><span className="font-mono text-sm font-bold text-mint-dark">{foundations.length}/{foundationChapters.length}</span></div>
            <div className="h-2 overflow-hidden rounded-full bg-white/70"><div className="h-full rounded-full bg-mint-dark transition-all" style={{ width: `${foundationPercent}%` }} /></div>
            <p className="mt-2 text-[11px] text-mint-dark/65">{foundationPercent === 100 ? '基础阶段全部完成，可以进入本地实战。' : `还差 ${foundationChapters.length - foundations.length} 个练习节点。`}</p>
          </div>
        </div>
      </section>

      <div className="grid items-start gap-6 xl:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="rounded-[24px] border border-ink/9 bg-white/70 p-3 xl:sticky xl:top-24" aria-label="基础课程目录">
          <div className="px-3 pb-3 pt-2">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-ink/38">Course chapters</p>
            <p className="mt-1 text-sm font-bold">8 个连续章节</p>
          </div>
          <div className="grid gap-1.5 sm:grid-cols-2 xl:grid-cols-1">
            {foundationChapters.map((item) => {
              const active = item.id === chapter.id;
              const complete = foundations.includes(item.id);
              return (
                <button key={item.id} onClick={() => selectChapter(item.id)} className={`group flex min-h-15 w-full items-center gap-3 rounded-[16px] px-3 py-2.5 text-left transition ${active ? 'bg-ink text-white shadow-lg' : 'text-ink hover:bg-ink/5'}`}>
                  <span className={`grid size-8 shrink-0 place-items-center rounded-[10px] font-mono text-[10px] font-bold ${active ? 'bg-white/12 text-mint' : complete ? 'bg-mint-pale text-mint-dark' : 'bg-ink/5 text-ink/40'}`}>{complete ? <Check className="size-3.5" /> : item.number}</span>
                  <span className="min-w-0 flex-1"><span className="block truncate text-xs font-bold">{item.shortTitle}</span><span className={`mt-0.5 block truncate text-[10px] ${active ? 'text-white/42' : 'text-ink/38'}`}>{item.kicker}</span></span>
                  <ChevronRight className={`size-3.5 transition group-hover:translate-x-0.5 ${active ? 'text-white/40' : 'text-ink/25'}`} />
                </button>
              );
            })}
          </div>
        </aside>

        <article className="min-w-0">
          <section className="mb-6 rounded-[26px] border border-ink/9 bg-white p-6 shadow-[0_16px_46px_rgba(23,35,60,.055)] sm:p-8">
            <div className="mb-7 flex flex-wrap items-start justify-between gap-4 border-b border-ink/8 pb-6">
              <div>
                <div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.15em] text-mint-dark">Chapter {chapter.number} <span className="size-1 rounded-full bg-ink/20" /> {chapter.kicker}</div>
                <h2 className="font-display text-3xl font-bold tracking-[-0.04em] text-ink sm:text-4xl">{chapter.title}</h2>
              </div>
              <span className="flex items-center gap-1.5 rounded-full border border-ink/9 bg-cream px-3 py-1.5 text-[11px] font-semibold text-ink/55"><Clock3 className="size-3.5" /> {chapter.minutes} 分钟</span>
            </div>

            <div className="rounded-[22px] bg-mint-pale/70 p-5 sm:p-6">
              <div className="mb-2 flex items-center gap-2 text-xs font-bold text-mint-dark"><Lightbulb className="size-4" /> 先建立画面</div>
              <p className="max-w-3xl text-sm leading-7 text-ink/72">{chapter.description}</p>
            </div>

            <div className="mt-7 grid gap-6 lg:grid-cols-[1fr_1fr]">
              <div>
                <div className="mb-3 flex items-center gap-2 text-xs font-bold text-ink"><ListChecks className="size-4 text-mint-dark" /> 这一章会掌握</div>
                <ul className="space-y-2.5">
                  {chapter.knowledge.map((point) => <li key={point} className="flex gap-2.5 text-xs leading-5 text-ink/62"><Circle className="mt-1 size-2.5 shrink-0 fill-mint text-mint-dark" />{point}</li>)}
                </ul>
              </div>
              <div className="overflow-hidden rounded-[18px] border border-ink/10 bg-[#131e34]">
                <div className="flex items-center gap-2 border-b border-white/8 px-4 py-2.5"><Code2 className="size-3.5 text-mint" /><span className="text-[10px] font-semibold text-white/42">{chapter.example.title}</span></div>
                <pre className="overflow-x-auto p-4 font-mono text-[11px] leading-5 text-[#e8edf7]"><code>{chapter.example.code}</code></pre>
              </div>
            </div>
          </section>

          <PythonExercise key={chapter.id} chapter={chapter} />

          <div className="mt-5 flex items-center justify-between rounded-[20px] border border-ink/8 bg-white/60 p-3">
            <button disabled={chapterIndex === 0} onClick={() => chapterIndex > 0 && selectChapter(foundationChapters[chapterIndex - 1].id)} className="rounded-xl px-3 py-2 text-xs font-semibold text-ink/48 transition hover:bg-white hover:text-ink disabled:opacity-30">上一章</button>
            <div className="flex items-center gap-2 text-[11px] text-ink/38"><BookOpenText className="size-3.5" /> 提交通过后会自动保存进度</div>
            <button disabled={chapterIndex === foundationChapters.length - 1} onClick={() => chapterIndex < foundationChapters.length - 1 && selectChapter(foundationChapters[chapterIndex + 1].id)} className="flex items-center gap-1 rounded-xl px-3 py-2 text-xs font-bold text-ink transition hover:bg-white disabled:opacity-30">下一章 <ArrowRight className="size-3.5" /></button>
          </div>
        </article>
      </div>
    </main>
  );
}
