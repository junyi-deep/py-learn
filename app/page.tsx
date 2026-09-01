'use client';

import Link from 'next/link';
import { ArrowUpRight, BookOpenText, Braces, Check, Circle, Code2, FlaskConical, GitBranch, Sparkles, TerminalSquare } from 'lucide-react';
import { useCourseProgress } from '@/components/course-progress';
import { builtinAlgorithmCount, foundationChapters, projects } from '@/lib/course-data';

const stages = [
  {
    id: '01', eyebrow: '先建立语言直觉', title: 'Python 基础语法',
    description: '从变量到函数与常用标准库，边学边运行，提交通过才点亮节点。',
    href: '/foundations', icon: Braces, tone: 'mint',
    topics: ['表达式与变量', '容器与循环', '函数与模块', '异常与文件'],
  },
  {
    id: '02', eyebrow: '把知识装进作品里', title: 'Python 实战项目',
    description: '在本地编辑器完成真实小项目，用结果文件、日志和测试自动验收。',
    href: '/projects', icon: TerminalSquare, tone: 'amber',
    topics: ['文件与路径', '数据处理', '网络请求', '自动化与日志'],
  },
  {
    id: '03', eyebrow: '学会拆解复杂问题', title: '算法与数据结构',
    description: '用图解理解解题套路，再到 LeetCode 完成精选题目并记录进度。',
    href: '/algorithms', icon: GitBranch, tone: 'violet',
    topics: ['常用数据结构', '搜索与回溯', '贪心与动态规划', '位运算与特殊技巧'],
  },
];

export default function Home() {
  const progress = useCourseProgress();
  const nextChapter = foundationChapters.find((chapter) => !progress.foundations.includes(chapter.id));
  const stageCounts = [
    `${progress.foundations.length} / ${foundationChapters.length}`,
    `${progress.projects.length} / ${projects.length}`,
    `${progress.algorithms.length} / ${builtinAlgorithmCount + progress.customProblems.length}`,
  ];
  const stagePercents = [progress.foundationPercent, progress.projectPercent, progress.algorithmPercent];

  return (
    <main>
      <section className="atlas-grid mx-auto max-w-[1440px] px-5 pb-28 pt-8 md:px-9 md:pb-14 md:pt-11">
        <div className="mb-8 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-mint-dark">
              <Sparkles className="size-4" />你的 Python 成长路线
            </div>
            <h1 className="max-w-3xl font-display text-[clamp(2.15rem,4.6vw,4.8rem)] font-bold leading-[.98] tracking-[-0.055em] text-ink">
              从第一行代码，走到<br className="hidden sm:block" />独立解决问题。
            </h1>
          </div>
          <Link href={nextChapter ? `/foundations?chapter=${nextChapter.id}` : '/projects'} className="group max-w-sm rounded-[22px] border border-ink/8 bg-white/72 p-4 shadow-[0_12px_36px_rgba(23,35,60,.06)] transition hover:-translate-y-0.5 hover:bg-white">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-bold text-ink/48">{nextChapter ? '下一站' : '基础阶段已点亮'}</span>
              <span className="rounded-full bg-mint-pale px-2.5 py-1 text-[10px] font-bold text-mint-dark">约 {nextChapter?.minutes ?? 30} 分钟</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-mint text-ink"><BookOpenText className="size-4" /></span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold">{nextChapter?.title ?? '开始第一个实战项目'}</p>
                <p className="mt-0.5 truncate text-xs text-ink/48">{nextChapter?.kicker ?? '把基础知识装进作品'}</p>
              </div>
              <ArrowUpRight className="size-4 text-ink/35 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
          </Link>
        </div>

        <section className="relative overflow-hidden rounded-[30px] border border-ink/9 bg-ink p-4 shadow-[0_24px_70px_rgba(23,35,60,.15)] sm:p-7 lg:p-9" aria-labelledby="roadmap-heading">
          <div className="absolute inset-0 opacity-25 [background-image:radial-gradient(circle_at_center,rgba(255,255,255,.22)_1px,transparent_1px)] [background-size:22px_22px]" aria-hidden="true" />
          <div className="relative mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-mint">Interactive roadmap</p>
              <h2 id="roadmap-heading" className="font-display text-2xl font-bold tracking-[-0.035em] text-white sm:text-3xl">学习星图</h2>
            </div>
            <div className="flex items-center gap-5 text-[11px] font-medium text-white/55">
              <span className="flex items-center gap-1.5"><Check className="size-3.5 text-mint" /> 已完成</span>
              <span className="flex items-center gap-1.5"><Circle className="size-3.5 fill-white/10" /> 进行中</span>
            </div>
          </div>

          <div className="relative grid gap-4 lg:grid-cols-[170px_1fr] lg:gap-7">
            <div className="relative z-10 flex min-h-32 items-center justify-center rounded-[22px] border border-white/12 bg-white/7 p-5 text-center lg:min-h-full">
              <div>
                <span className="mx-auto mb-3 grid size-13 place-items-center rounded-2xl bg-white text-ink shadow-lg"><Code2 className="size-6" /></span>
                <p className="font-display text-base font-bold text-white">Python<br />成长树</p>
                <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-white/38">{progress.hydrated ? progress.totalPercent : 0}% explored</p>
              </div>
            </div>

            <div className="roadmap-branches grid gap-4 lg:grid-cols-3">
              {stages.map((stage, index) => {
                const Icon = stage.icon;
                const complete = stagePercents[index] === 100;
                return (
                  <Link key={stage.id} href={stage.href} className={`stage-card stage-${stage.tone} group relative z-10 overflow-hidden rounded-[22px] border ${complete ? 'border-mint/45 bg-mint/[.09]' : 'border-white/10 bg-white/[.075]'} p-5 transition duration-300 hover:-translate-y-1 hover:bg-white/[.11]`}>
                    <div className="mb-7 flex items-start justify-between gap-3">
                      <span className="stage-icon grid size-11 place-items-center rounded-[14px] text-ink"><Icon className="size-5" /></span>
                      <span className="flex items-center gap-2 font-mono text-[11px] font-bold text-white/35">
                        {complete && <Check className="size-3.5 text-mint" />} STAGE {stage.id}
                      </span>
                    </div>
                    <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-white/42">{stage.eyebrow}</p>
                    <h3 className="font-display text-xl font-bold tracking-[-0.025em] text-white">{stage.title}</h3>
                    <p className="mt-2 min-h-12 text-xs leading-5 text-white/55">{stage.description}</p>
                    <ul className="my-5 grid grid-cols-2 gap-2">
                      {stage.topics.map((topic) => <li className="flex items-center gap-1.5 text-[11px] text-white/60" key={topic}><span className="stage-dot size-1.5 rounded-full" />{topic}</li>)}
                    </ul>
                    <div className="mb-3 h-1 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-white/70 transition-all" style={{ width: `${stagePercents[index]}%` }} /></div>
                    <div className="flex items-center justify-between border-t border-white/10 pt-4">
                      <span className="text-[11px] font-semibold text-white/46">完成 {stageCounts[index]}</span>
                      <span className="flex items-center gap-1 text-xs font-bold text-white transition group-hover:gap-2">进入阶段 <ArrowUpRight className="size-3.5" /></span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <Feature icon={FlaskConical} tone="mint" title="真代码练习" description="在浏览器里运行 Python" />
          <Feature icon={TerminalSquare} tone="amber" title="本地自动验收" description="CLI 检查文件、输出与行为" />
          <Feature icon={GitBranch} tone="violet" title="精选算法路径" description={`按模式组织 ${builtinAlgorithmCount} 道 LeetCode 题`} />
        </div>
      </section>
    </main>
  );
}

function Feature({ icon: Icon, tone, title, description }: { icon: typeof FlaskConical; tone: 'mint' | 'amber' | 'violet'; title: string; description: string }) {
  const toneClasses = { mint: 'bg-mint-pale text-mint-dark', amber: 'bg-amber-pale text-amber-dark', violet: 'bg-violet-pale text-violet-dark' };
  return (
    <div className="flex items-center gap-4 rounded-[20px] border border-ink/8 bg-white/72 p-4">
      <span className={`grid size-10 place-items-center rounded-xl ${toneClasses[tone]}`}><Icon className="size-4" /></span>
      <div><p className="text-xs font-bold">{title}</p><p className="mt-0.5 text-[11px] text-ink/45">{description}</p></div>
    </div>
  );
}
