'use client';

import { FormEvent, useMemo, useState } from 'react';
import { ArrowUpRight, Binary, BookOpenText, Check, CheckCircle2, Circle, Code2, GitBranch, Lightbulb, ListFilter, Plus, Search, Sparkles, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { algorithmProgressId, useCourseProgress } from '@/components/course-progress';
import { algorithmCategories, builtinAlgorithmCount, type Difficulty } from '@/lib/course-data';

const difficultyTone: Record<Difficulty, string> = {
  简单: 'bg-mint-pale text-mint-dark',
  中等: 'bg-amber-pale text-amber-dark',
  困难: 'bg-[#ffe2e7] text-[#a62f47]',
};

const categoryTone = {
  mint: 'bg-mint text-ink', amber: 'bg-amber text-ink', violet: 'bg-violet text-ink',
  blue: 'bg-[#a7d8ff] text-ink', rose: 'bg-[#ffb7c4] text-ink',
};

export function AlgorithmsWorkbench() {
  const [selectedId, setSelectedId] = useState(algorithmCategories[0].id);
  const [query, setQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ title: '', url: '', categoryId: algorithmCategories[0].id, difficulty: '中等' as Difficulty });
  const [formError, setFormError] = useState('');
  const progress = useCourseProgress();
  const category = algorithmCategories.find((item) => item.id === selectedId) ?? algorithmCategories[0];
  const customForCategory = progress.customProblems.filter((problem) => problem.categoryId === category.id);

  const visibleProblems = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return category.problems.filter((problem) => !normalized || `${problem.id} ${problem.title}`.toLowerCase().includes(normalized));
  }, [category, query]);
  const visibleCustom = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return customForCategory.filter((problem) => !normalized || problem.title.toLowerCase().includes(normalized));
  }, [customForCategory, query]);

  function addProblem(event: FormEvent) {
    event.preventDefault();
    setFormError('');
    if (!form.title.trim()) {
      setFormError('请填写题目名称。');
      return;
    }
    try {
      const parsed = new URL(form.url);
      const hostname = parsed.hostname.toLowerCase();
      if (!(hostname === 'leetcode.com' || hostname.endsWith('.leetcode.com') || hostname === 'leetcode.cn' || hostname.endsWith('.leetcode.cn'))) throw new Error('host');
    } catch {
      setFormError('请输入有效的 LeetCode 题目链接。');
      return;
    }
    progress.addCustomProblem({ title: form.title.trim(), url: form.url.trim(), categoryId: form.categoryId, difficulty: form.difficulty });
    setSelectedId(form.categoryId);
    setForm({ title: '', url: '', categoryId: form.categoryId, difficulty: '中等' });
    setDialogOpen(false);
  }

  return (
    <main className="mx-auto max-w-[1440px] px-5 pb-28 pt-8 md:px-9 md:pb-16 md:pt-10">
      <section className="mb-7 overflow-hidden rounded-[30px] border border-ink/9 bg-white/72 p-6 shadow-[0_18px_60px_rgba(23,35,60,.07)] sm:p-8 lg:p-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_350px] lg:items-end">
          <div>
            <div className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.17em] text-violet-dark"><GitBranch className="size-4" /> Stage 03 · Algorithms</div>
            <h1 className="max-w-3xl font-display text-[clamp(2.2rem,4.3vw,4.4rem)] font-bold leading-[.98] tracking-[-0.05em] text-ink">看见题目背后的模式</h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-ink/55">每一类算法先用一个能记住的画面建立直觉，再提炼通用骨架。选好题目后跳转 LeetCode 作答，回来勾选进度。</p>
          </div>
          <div className="grid grid-cols-3 gap-2 rounded-[22px] bg-violet-pale/72 p-3">
            <Stat value={algorithmCategories.length} label="算法类型" />
            <Stat value={builtinAlgorithmCount + progress.customProblems.length} label="精选题目" />
            <Stat value={progress.algorithms.length} label="已经完成" />
          </div>
        </div>
      </section>

      <div className="grid items-start gap-6 xl:grid-cols-[290px_minmax(0,1fr)]">
        <aside className="rounded-[24px] border border-ink/9 bg-white/68 p-3 xl:sticky xl:top-24" aria-label="算法分类">
          <div className="flex items-center justify-between px-3 pb-3 pt-2">
            <div><p className="text-[10px] font-bold uppercase tracking-[.15em] text-ink/38">Pattern library</p><p className="mt-1 text-sm font-bold">12 类解题模式</p></div>
            <Binary className="size-5 text-violet-dark" />
          </div>
          <div className="grid gap-1.5 sm:grid-cols-2 xl:grid-cols-1">
            {algorithmCategories.map((item) => {
              const itemCustom = progress.customProblems.filter((problem) => problem.categoryId === item.id);
              const problemIds = [...item.problems.map((problem) => algorithmProgressId(item.id, problem.id)), ...itemCustom.map((problem) => problem.id)];
              const done = problemIds.filter((id) => progress.algorithms.includes(id)).length;
              const active = item.id === category.id;
              return (
                <button key={item.id} onClick={() => { setSelectedId(item.id); setQuery(''); }} className={`group flex w-full items-center gap-3 rounded-[16px] px-3 py-2.5 text-left transition ${active ? 'bg-ink text-white shadow-lg' : 'hover:bg-ink/5'}`}>
                  <span className={`grid size-9 shrink-0 place-items-center rounded-[11px] font-mono text-[10px] font-bold ${active ? categoryTone[item.tone] : 'bg-ink/5 text-ink/38'}`}>{item.number}</span>
                  <span className="min-w-0 flex-1"><span className="block truncate text-xs font-bold">{item.title}</span><span className={`mt-0.5 block text-[10px] ${active ? 'text-white/42' : 'text-ink/38'}`}>{done}/{problemIds.length} 完成</span></span>
                  {done === problemIds.length && done > 0 ? <CheckCircle2 className="size-3.5 text-mint" /> : <Circle className={`size-3 ${active ? 'text-white/22' : 'text-ink/16'}`} />}
                </button>
              );
            })}
          </div>
        </aside>

        <article className="min-w-0">
          <section className="mb-5 overflow-hidden rounded-[26px] bg-ink text-white shadow-[0_20px_56px_rgba(23,35,60,.14)]">
            <div className="grid lg:grid-cols-[1.1fr_.9fr]">
              <div className="p-6 sm:p-8">
                <div className="mb-5 flex items-start justify-between gap-4">
                  <span className={`grid size-12 place-items-center rounded-[15px] font-mono text-xs font-bold ${categoryTone[category.tone]}`}>{category.number}</span>
                  <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] font-semibold text-white/42">{category.problems.length + customForCategory.length} 道题</span>
                </div>
                <p className="mb-1 text-[10px] font-bold uppercase tracking-[.16em] text-violet">{category.shortTitle}</p>
                <h2 className="font-display text-3xl font-bold tracking-[-0.04em]">{category.title}</h2>
                <div className="mt-6 rounded-[18px] border border-white/10 bg-white/6 p-4">
                  <div className="mb-2 flex items-center gap-2 text-[11px] font-bold text-violet"><Sparkles className="size-3.5" /> 先记住这个画面</div>
                  <p className="text-xs leading-6 text-white/65">{category.metaphor}</p>
                </div>
                <div className="mt-4 flex gap-3"><Lightbulb className="mt-0.5 size-4 shrink-0 text-amber" /><p className="text-xs leading-6 text-white/5">{category.principle}</p></div>
              </div>
              <div className="border-t border-white/10 bg-[#111a2d] p-6 lg:border-l lg:border-t-0 sm:p-8">
                <div className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.15em] text-mint"><Code2 className="size-3.5" /> Reusable skeleton</div>
                <pre className="overflow-x-auto rounded-[18px] border border-white/8 bg-black/15 p-4 font-mono text-[11px] leading-6 text-[#dbe6f7]"><code>{category.template}</code></pre>
                <p className="mt-3 text-[10px] leading-5 text-white/32">模板不是答案，而是让思路起步的脚手架。先说清不变量，再写具体代码。</p>
              </div>
            </div>
          </section>

          <section className="overflow-hidden rounded-[26px] border border-ink/9 bg-white shadow-[0_16px_50px_rgba(23,35,60,.055)]" aria-labelledby="problem-list-title">
            <div className="flex flex-col gap-4 border-b border-ink/8 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
              <div><div className="mb-1 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.15em] text-violet-dark"><BookOpenText className="size-3.5" /> Problem set</div><h3 id="problem-list-title" className="font-display text-xl font-bold">精选题目</h3></div>
              <div className="flex gap-2">
                <label className="relative flex-1 sm:w-56"><Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-ink/32" /><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索题号或名称" className="h-9 bg-cream/55 pl-9" /></label>
                <AddProblemDialog open={dialogOpen} setOpen={setDialogOpen} form={form} setForm={setForm} error={formError} onSubmit={addProblem} />
              </div>
            </div>

            <div className="divide-y divide-ink/7">
              {visibleProblems.map((problem) => {
                const progressId = algorithmProgressId(category.id, problem.id);
                const done = progress.algorithms.includes(progressId);
                return <ProblemRow key={problem.id} number={String(problem.id)} title={problem.title} difficulty={problem.difficulty} url={`https://leetcode.com/problems/${problem.slug}/`} done={done} onToggle={() => progress.toggleAlgorithm(progressId)} />;
              })}
              {visibleCustom.map((problem) => {
                const done = progress.algorithms.includes(problem.id);
                return <ProblemRow key={problem.id} number="自选" title={problem.title} difficulty={problem.difficulty} url={problem.url} done={done} onToggle={() => progress.toggleAlgorithm(problem.id)} onRemove={() => progress.removeCustomProblem(problem.id)} />;
              })}
              {visibleProblems.length === 0 && visibleCustom.length === 0 && <div className="p-10 text-center"><ListFilter className="mx-auto mb-3 size-6 text-ink/25" /><p className="text-sm font-bold text-ink/55">没有匹配的题目</p><p className="mt-1 text-xs text-ink/35">换一个关键词，或添加自己的 LeetCode 题目。</p></div>}
            </div>
          </section>
        </article>
      </div>
    </main>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return <div className="rounded-[15px] bg-white/58 p-3 text-center"><p className="font-display text-xl font-bold tracking-[-.04em] text-violet-dark">{value}</p><p className="mt-1 text-[9px] font-semibold text-ink/42">{label}</p></div>;
}

function ProblemRow({ number, title, difficulty, url, done, onToggle, onRemove }: { number: string; title: string; difficulty: Difficulty; url: string; done: boolean; onToggle: () => void; onRemove?: () => void }) {
  return (
    <div className={`group flex items-center gap-3 p-4 transition hover:bg-cream/55 sm:px-6 ${done ? 'bg-mint-pale/25' : ''}`}>
      <button onClick={onToggle} aria-label={done ? `将 ${title} 标记为未完成` : `将 ${title} 标记为已完成`} className={`grid size-6 shrink-0 place-items-center rounded-full border transition ${done ? 'border-mint-dark bg-mint text-ink' : 'border-ink/18 bg-white hover:border-mint-dark'}`}>{done && <Check className="size-3.5" />}</button>
      <span className="w-9 shrink-0 font-mono text-[10px] font-bold text-ink/32">{number}</span>
      <div className="min-w-0 flex-1"><p className={`truncate text-xs font-bold transition ${done ? 'text-ink/48 line-through decoration-ink/20' : 'text-ink'}`}>{title}</p></div>
      <span className={`hidden rounded-full px-2.5 py-1 text-[9px] font-bold sm:inline-flex ${difficultyTone[difficulty]}`}>{difficulty}</span>
      {onRemove && <button onClick={onRemove} className="grid size-8 place-items-center rounded-lg text-ink/25 transition hover:bg-[#ffe2e7] hover:text-[#a62f47]" aria-label={`删除自选题 ${title}`}><Trash2 className="size-3.5" /></button>}
      <a href={url} target="_blank" rel="noreferrer" className="flex h-8 shrink-0 items-center gap-1 rounded-lg border border-ink/10 px-2.5 text-[10px] font-bold text-ink/55 transition hover:border-violet-dark/25 hover:bg-violet-pale hover:text-violet-dark">去做题 <ArrowUpRight className="size-3.5" /></a>
    </div>
  );
}

function AddProblemDialog({ open, setOpen, form, setForm, error, onSubmit }: {
  open: boolean;
  setOpen: (open: boolean) => void;
  form: { title: string; url: string; categoryId: string; difficulty: Difficulty };
  setForm: (form: { title: string; url: string; categoryId: string; difficulty: Difficulty }) => void;
  error: string;
  onSubmit: (event: FormEvent) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button className="h-9 bg-violet-dark px-3 text-white hover:bg-violet-dark/85" />}><Plus /> 添加题目</DialogTrigger>
      <DialogContent className="max-w-lg rounded-[22px] p-6">
        <form onSubmit={onSubmit}>
          <DialogHeader><DialogTitle className="font-display text-xl font-bold">添加一道 LeetCode 题</DialogTitle><DialogDescription>把你想补充的题放进相应算法分类，进度会保存在当前浏览器。</DialogDescription></DialogHeader>
          <div className="mt-5 grid gap-4">
            <label><span className="mb-1.5 block text-xs font-bold">题目名称</span><Input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="例如：接雨水" className="h-10" /></label>
            <label><span className="mb-1.5 block text-xs font-bold">LeetCode 链接</span><Input value={form.url} onChange={(event) => setForm({ ...form, url: event.target.value })} placeholder="https://leetcode.com/problems/..." className="h-10" /></label>
            <div className="grid grid-cols-2 gap-3">
              <label><span className="mb-1.5 block text-xs font-bold">算法分类</span><Select value={form.categoryId} onValueChange={(value) => setForm({ ...form, categoryId: value as string })}><SelectTrigger className="h-10 w-full"><SelectValue /></SelectTrigger><SelectContent>{algorithmCategories.map((category) => <SelectItem key={category.id} value={category.id}>{category.title}</SelectItem>)}</SelectContent></Select></label>
              <label><span className="mb-1.5 block text-xs font-bold">难度</span><Select value={form.difficulty} onValueChange={(value) => setForm({ ...form, difficulty: value as Difficulty })}><SelectTrigger className="h-10 w-full"><SelectValue /></SelectTrigger><SelectContent>{(['简单', '中等', '困难'] as Difficulty[]).map((difficulty) => <SelectItem key={difficulty} value={difficulty}>{difficulty}</SelectItem>)}</SelectContent></Select></label>
            </div>
            {error && <p className="text-xs font-semibold text-destructive">{error}</p>}
          </div>
          <DialogFooter className="mt-6 -mx-6 -mb-6 px-6 py-4"><Button type="submit" className="h-9 bg-ink px-5 text-white">加入题库</Button></DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
