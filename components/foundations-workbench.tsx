'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, BookOpenText, Check, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, Circle, Clock3, Code2, ExternalLink, Lightbulb, ListChecks, Route } from 'lucide-react';
import { PythonExercise } from '@/components/python-exercise';
import { foundationExerciseProgressId, foundationExerciseTotal, useCourseProgress } from '@/components/course-progress';
import { foundationChapters } from '@/lib/course-data';
import type { FoundationGroup } from '@/lib/foundation-catalog';
import { exercisesForChapter } from '@/lib/foundation-practice';

const chapterGroups: FoundationGroup[] = ['基础语法', '进阶语法', '标准库与应用'];

export function FoundationsWorkbench() {
  const [selectedId, setSelectedId] = useState(foundationChapters[0].id);
  const [selectedExerciseId, setSelectedExerciseId] = useState('core');
  const [practiceMode, setPracticeMode] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [draftCode, setDraftCode] = useState<Record<string, string>>({});
  const { foundations, foundationExercises, foundationPercent, hydrated } = useCourseProgress();

  useEffect(() => {
    const syncLocation = () => {
    const params = new URLSearchParams(window.location.search);
    const requested = foundationChapters.find((chapter) => chapter.id === params.get('chapter'));
    if (requested) {
      setSelectedId(requested.id);
      const requestedExercise = params.get('exercise');
      if (requestedExercise && exercisesForChapter(requested).some((exercise) => exercise.id === requestedExercise)) {
        setSelectedExerciseId(requestedExercise);
      }
    }
      setPracticeMode(params.get('mode') === 'practice');
    };
    syncLocation();
    window.addEventListener('popstate', syncLocation);
    window.addEventListener('pypath:location-change', syncLocation);
    return () => {
      window.removeEventListener('popstate', syncLocation);
      window.removeEventListener('pypath:location-change', syncLocation);
    };
  }, []);

  const chapter = useMemo(() => foundationChapters.find((item) => item.id === selectedId) ?? foundationChapters[0], [selectedId]);
  const chapterIndex = foundationChapters.findIndex((item) => item.id === chapter.id);
  const activeProgressId = foundationExerciseProgressId(chapter.id, selectedExerciseId);

  function updateLocation(chapterId: string, exerciseId: string, isPracticeMode: boolean) {
    const url = new URL(window.location.href);
    url.searchParams.set('chapter', chapterId);
    if (exerciseId === 'core') url.searchParams.delete('exercise');
    else url.searchParams.set('exercise', exerciseId);
    if (isPracticeMode) url.searchParams.set('mode', 'practice');
    else url.searchParams.delete('mode');
    window.history.replaceState({}, '', url);
    window.dispatchEvent(new Event('pypath:location-change'));
  }

  function selectChapter(id: string) {
    setSelectedId(id);
    setSelectedExerciseId('core');
    updateLocation(id, 'core', practiceMode);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function selectExercise(id: string) {
    setSelectedExerciseId(id);
    updateLocation(chapter.id, id, practiceMode);
  }

  function selectPracticeQuestion(chapterId: string, exerciseId: string) {
    setSelectedId(chapterId);
    setSelectedExerciseId(exerciseId);
    updateLocation(chapterId, exerciseId, true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const exercisePane = hydrated ? (
    <PythonExercise
      key={activeProgressId}
      chapter={chapter}
      selectedExerciseId={selectedExerciseId}
      onSelectExercise={selectExercise}
      practiceMode={practiceMode}
      draftCode={draftCode[activeProgressId]}
      onDraftChange={(code) => setDraftCode((current) => ({ ...current, [activeProgressId]: code }))}
    />
  ) : (
    <div className="rounded-2xl border border-ink/10 bg-white p-8 text-sm text-ink/50">正在恢复学习进度与上次提交的代码…</div>
  );

  if (practiceMode) {
    return (
      <main className="mx-auto h-[calc(100dvh-3rem)] max-w-[1600px] overflow-hidden p-3 sm:p-4">
        <div className={`grid h-full min-h-0 gap-3 transition-[grid-template-columns] md:grid-rows-1 ${sidebarCollapsed ? 'grid-rows-[48px_minmax(0,1fr)] md:grid-cols-[48px_minmax(0,1fr)]' : 'grid-rows-[minmax(180px,32vh)_minmax(0,1fr)] md:grid-cols-[250px_minmax(0,1fr)]'}`}>
          <aside className="min-h-0 overflow-hidden rounded-[18px] border border-ink/9 bg-white/80" aria-label="做题模式题目列表">
            <div className={`flex items-center border-b border-ink/8 ${sidebarCollapsed ? 'h-full justify-center md:h-12' : 'h-12 justify-between px-3'}`}>
              {!sidebarCollapsed && <span className="font-mono text-[11px] font-bold text-ink/62">{foundationExercises.length}/{foundationExerciseTotal}</span>}
              <button type="button" onClick={() => setSidebarCollapsed((current) => !current)} aria-label={sidebarCollapsed ? '展开题目目录' : '收起题目目录'} className="grid size-8 place-items-center rounded-lg text-ink/48 transition hover:bg-ink/5 hover:text-ink">
                {sidebarCollapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
              </button>
            </div>
            {!sidebarCollapsed && <div className="h-[calc(100%-3rem)] overflow-y-auto p-2">
              <div className="space-y-2">
              {chapterGroups.map((group) => (
                <details key={group} open className="group" aria-label={group}>
                  <summary className="flex cursor-pointer list-none items-center justify-between rounded-lg px-2.5 py-2 text-[10px] font-bold text-mint-dark hover:bg-mint-pale/60">
                    {group}<ChevronDown className="size-3.5 transition group-open:rotate-180" />
                  </summary>
                  <div className="mt-1 space-y-2">
                    {foundationChapters.filter((item) => item.group === group).map((item) => (
                      <div key={item.id}>
                        <p className="mb-1 px-3 font-mono text-[10px] font-semibold text-ink/40">{item.number} · {item.shortTitle}</p>
                        <div className="grid gap-1 sm:grid-cols-2 xl:grid-cols-1">
                          {exercisesForChapter(item).map((exercise, index) => {
                            const active = item.id === chapter.id && exercise.id === selectedExerciseId;
                            const complete = foundationExercises.includes(foundationExerciseProgressId(item.id, exercise.id));
                            return (
                              <button key={exercise.id} type="button" aria-current={active ? 'true' : undefined} onClick={() => selectPracticeQuestion(item.id, exercise.id)} className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-xs transition ${active ? 'bg-ink font-bold text-white shadow-sm' : 'text-ink/68 hover:bg-ink/5 hover:text-ink'}`}>
                                {complete ? <CheckCircle2 className={`size-4 shrink-0 ${active ? 'text-mint' : 'text-mint-dark'}`} /> : <span className={`grid size-4 shrink-0 place-items-center rounded-full font-mono text-[9px] ${active ? 'bg-white/10 text-white' : 'bg-cream text-ink/45'}`}>{index + 1}</span>}
                                <span className="min-w-0 flex-1 truncate">{exercise.title}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </details>
              ))}
              </div>
            </div>
            }
          </aside>
          <div className="min-h-0 min-w-0">{exercisePane}</div>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-[1440px] px-5 pb-28 pt-8 md:px-9 md:pb-16 md:pt-10">
      <section className="mb-7 overflow-hidden rounded-[28px] border border-ink/9 bg-white/72 p-6 shadow-[0_18px_60px_rgba(23,35,60,.07)] sm:p-8">
        <div className="grid gap-7 lg:grid-cols-[1fr_320px] lg:items-end">
          <div>
            <div className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.17em] text-mint-dark"><Route className="size-4" /> Stage 01 · Foundations</div>
            <h1 className="font-display text-[clamp(2.2rem,4vw,4.1rem)] font-bold leading-none tracking-[-0.05em] text-ink">建立 Python 语言直觉</h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-ink/55">第一阶段在内部划分为基础语法、进阶语法和标准库与应用，共 {foundationChapters.length} 章、{foundationExerciseTotal} 道可运行练习。每章先建立心智模型；本章练习全部通过，学习星图上的节点才会点亮。</p>
            <a href="https://www.runoob.com/python3/python3-tutorial.html" target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-semibold text-mint-dark transition hover:text-ink">知识范围参考菜鸟教程目录，已排除环境配置并重新编排 <ExternalLink className="size-3" /></a>
            <p className="mt-2 max-w-3xl text-[11px] leading-5 text-ink/42">Python 3 简介融入阶段导读，目录中的实例拆入各章示例，测验改写为可运行评测；参考资源入口保留在这里。讲解与题目均为本项目重新组织的原创内容。</p>
          </div>
          <div className="rounded-[20px] bg-mint-pale p-4">
            <div className="mb-3 flex items-center justify-between"><span className="text-xs font-bold text-mint-dark">阶段进度</span><span className="font-mono text-sm font-bold text-mint-dark">{foundations.length}/{foundationChapters.length}</span></div>
            <div className="h-2 overflow-hidden rounded-full bg-white/70"><div className="h-full rounded-full bg-mint-dark transition-all" style={{ width: `${foundationPercent}%` }} /></div>
            <p className="mt-2 text-[11px] text-mint-dark/65">{foundationPercent === 100 ? '基础阶段全部完成，可以进入本地实战。' : `还差 ${foundationExerciseTotal - foundationExercises.length} 道练习。`}</p>
          </div>
        </div>
      </section>

      <div className="grid items-start gap-6 xl:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="rounded-[24px] border border-ink/9 bg-white/70 p-3 xl:sticky xl:top-24 xl:max-h-[calc(100vh-7rem)] xl:overflow-y-auto" aria-label="基础课程目录">
          <div className="px-3 pb-3 pt-2">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-ink/38">Course chapters</p>
            <p className="mt-1 text-sm font-bold">{foundationChapters.length} 章 · {foundationExerciseTotal} 题</p>
          </div>
          <div className="space-y-4">
            {chapterGroups.map((group) => (
              <section key={group} aria-labelledby={`foundation-group-${group}`}>
                <h2 id={`foundation-group-${group}`} className="mb-1.5 px-3 text-[9px] font-bold uppercase tracking-[0.14em] text-ink/34">{group}</h2>
                <div className="grid gap-1.5 sm:grid-cols-2 xl:grid-cols-1">
                  {foundationChapters.filter((item) => item.group === group).map((item) => {
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
              </section>
            ))}
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

          {exercisePane}

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
