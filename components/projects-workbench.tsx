'use client';

import { useMemo, useState } from 'react';
import { ArrowRight, Check, CheckCircle2, Clipboard, FileCode2, Files, FolderTree, KeyRound, Laptop, Play, ShieldCheck, TerminalSquare, TriangleAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCourseProgress } from '@/components/course-progress';
import { projects } from '@/lib/course-data';

export function ProjectsWorkbench() {
  const [selectedId, setSelectedId] = useState(projects[0].id);
  const [token, setToken] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const { projects: completedProjects, projectPercent, completeProject } = useCourseProgress();
  const project = useMemo(() => projects.find((item) => item.id === selectedId) ?? projects[0], [selectedId]);
  const completed = completedProjects.includes(project.id);

  function selectProject(id: string) {
    setSelectedId(id);
    setToken('');
    setMessage(null);
  }

  function verifyToken() {
    if (token.trim().toUpperCase() === project.token) {
      completeProject(project.id);
      setMessage({ type: 'success', text: '验收凭证有效，这个项目已经点亮。' });
    } else {
      setMessage({ type: 'error', text: '凭证不匹配。请先在项目根目录运行上面的验收命令。' });
    }
  }

  async function copyCommand() {
    await navigator.clipboard.writeText(project.command);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <main className="mx-auto max-w-[1440px] px-5 pb-28 pt-8 md:px-9 md:pb-16 md:pt-10">
      <section className="relative mb-7 overflow-hidden rounded-[30px] bg-ink p-6 text-white shadow-[0_24px_70px_rgba(23,35,60,.17)] sm:p-8 lg:p-10">
        <div className="absolute inset-0 opacity-25 [background-image:radial-gradient(circle_at_center,rgba(255,255,255,.2)_1px,transparent_1px)] [background-size:24px_24px]" aria-hidden="true" />
        <div className="relative grid gap-8 lg:grid-cols-[1fr_330px] lg:items-end">
          <div>
            <div className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.17em] text-amber"><TerminalSquare className="size-4" /> Stage 02 · Projects</div>
            <h1 className="max-w-3xl font-display text-[clamp(2.2rem,4.3vw,4.4rem)] font-bold leading-[.98] tracking-[-0.05em]">把 Python 变成真正的工具</h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-white/55">题目目录和起始框架已经放在本地。你在自己的编辑器里写代码，CLI 会运行它并检查产物、日志和行为是否符合预期。</p>
          </div>
          <div className="rounded-[22px] border border-white/10 bg-white/7 p-5 backdrop-blur">
            <div className="mb-3 flex items-center justify-between"><span className="text-xs font-bold text-white/65">实战进度</span><span className="font-mono text-sm font-bold text-amber">{completedProjects.length}/{projects.length}</span></div>
            <div className="h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-amber transition-all" style={{ width: `${projectPercent}%` }} /></div>
            <p className="mt-3 text-[11px] leading-5 text-white/42">Python 3.11+ · 仅使用标准库 · 验收过程无需公网</p>
          </div>
        </div>
      </section>

      <section className="mb-6 grid gap-3 md:grid-cols-3" aria-label="本地项目工作流">
        <WorkflowStep number="1" icon={FolderTree} title="打开题目目录" description="阅读 README 和只读 fixtures" />
        <WorkflowStep number="2" icon={FileCode2} title="在编辑器实现" description="只需修改每题的 solution.py" />
        <WorkflowStep number="3" icon={ShieldCheck} title="运行自动验收" description="通过后复制凭证回到网页" />
      </section>

      <div className="grid items-start gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
        <aside className="grid gap-3 sm:grid-cols-2 xl:sticky xl:top-24 xl:grid-cols-1" aria-label="实战项目列表">
          {projects.map((item) => {
            const active = item.id === project.id;
            const done = completedProjects.includes(item.id);
            return (
              <button key={item.id} onClick={() => selectProject(item.id)} className={`group w-full rounded-[20px] border p-4 text-left transition ${active ? 'border-amber-dark/25 bg-amber-pale shadow-[0_14px_40px_rgba(154,91,0,.09)]' : 'border-ink/8 bg-white/65 hover:-translate-y-0.5 hover:bg-white'}`}>
                <div className="mb-4 flex items-center justify-between">
                  <span className={`grid size-9 place-items-center rounded-xl font-mono text-[10px] font-bold ${active ? 'bg-amber text-ink' : done ? 'bg-mint-pale text-mint-dark' : 'bg-ink/5 text-ink/38'}`}>{done ? <Check className="size-4" /> : item.number}</span>
                  <span className={`rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-[.1em] ${active ? 'bg-white/65 text-amber-dark' : 'bg-ink/4 text-ink/38'}`}>{item.category}</span>
                </div>
                <h2 className="font-display text-base font-bold tracking-[-0.02em]">{item.title}</h2>
                <p className="mt-1.5 text-[11px] leading-5 text-ink/48">{item.description}</p>
                <span className="mt-4 flex items-center gap-1 text-[11px] font-bold text-ink/55">查看任务 <ArrowRight className="size-3.5 transition group-hover:translate-x-0.5" /></span>
              </button>
            );
          })}
        </aside>

        <article className="overflow-hidden rounded-[26px] border border-ink/9 bg-white shadow-[0_16px_50px_rgba(23,35,60,.06)]">
          <div className="border-b border-ink/8 p-6 sm:p-8">
            <div className="mb-2 flex flex-wrap items-center gap-2 text-[10px] font-bold uppercase tracking-[.14em] text-amber-dark"><span>Project {project.number}</span><span className="size-1 rounded-full bg-ink/20" /><span>{project.category}</span></div>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="font-display text-3xl font-bold tracking-[-0.04em] text-ink">{project.title}</h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-ink/55">{project.description}</p>
              </div>
              {completed && <span className="flex items-center gap-1.5 rounded-full bg-mint-pale px-3 py-1.5 text-[11px] font-bold text-mint-dark"><CheckCircle2 className="size-3.5" /> 已通过</span>}
            </div>
          </div>

          <div className="grid gap-7 p-6 sm:p-8 lg:grid-cols-2">
            <div>
              <SectionTitle icon={Laptop} title="学习目标" />
              <p className="mb-7 text-xs leading-6 text-ink/58">{project.goal}</p>

              <SectionTitle icon={Files} title="已初始化的文件" />
              <div className="mb-7 overflow-hidden rounded-[16px] border border-ink/9 bg-cream/65">
                <div className="border-b border-ink/8 bg-white/65 px-4 py-2.5 font-mono text-[10px] font-semibold text-ink/45">{project.folder}/</div>
                <ul className="space-y-2 p-4">{project.files.map((file) => <li key={file} className="flex items-center gap-2 font-mono text-[11px] text-ink/62"><FileCode2 className="size-3.5 text-amber-dark" /> {file}</li>)}</ul>
              </div>
            </div>

            <div>
              <SectionTitle icon={CheckCircle2} title="通过条件" />
              <ul className="mb-7 space-y-2.5">{project.acceptance.map((item) => <li key={item} className="flex gap-2.5 text-xs leading-5 text-ink"><span className="mt-0.5 grid size-4 shrink-0 place-items-center rounded-full bg-mint-pale"><Check className="size-2.5 text-mint-dark" /></span>{item}</li>)}</ul>

              <SectionTitle icon={Play} title="验收命令" />
              <div className="overflow-hidden rounded-[16px] bg-ink text-white">
                <div className="flex items-center justify-between border-b border-white/8 px-4 py-2.5"><span className="font-mono text-[10px] text-white/38">Terminal</span><Button variant="ghost" size="sm" onClick={copyCommand} className="text-white/48 hover:bg-white/8 hover:text-white"><Clipboard /> {copied ? '已复制' : '复制'}</Button></div>
                <code className="block overflow-x-auto p-4 font-mono text-xs text-mint">$ {project.command}</code>
              </div>
            </div>
          </div>

          <div className="border-t border-ink/8 bg-cream/55 p-6 sm:p-8">
            <div className="mb-4 flex items-center gap-2"><span className="grid size-9 place-items-center rounded-xl bg-amber-pale text-amber-dark"><KeyRound className="size-4" /></span><div><h3 className="text-sm font-bold">同步本地验收结果</h3><p className="text-[11px] text-ink/45">命令通过后会打印一段 PYPATH 开头的凭证</p></div></div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input value={token} onChange={(event) => setToken(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && verifyToken()} placeholder="粘贴验收凭证，例如 PYPATH-…" aria-label="本地验收凭证" className="h-10 bg-white font-mono uppercase" />
              <Button onClick={verifyToken} className="h-10 shrink-0 bg-ink px-5 text-white hover:bg-ink/85">验证并点亮</Button>
            </div>
            {message && <p className={`mt-3 flex items-center gap-2 text-[11px] font-semibold ${message.type === 'success' ? 'text-mint-dark' : 'text-destructive'}`}>{message.type === 'success' ? <CheckCircle2 className="size-3.5" /> : <TriangleAlert className="size-3.5" />}{message.text}</p>}
          </div>
        </article>
      </div>
    </main>
  );
}

function WorkflowStep({ number, icon: Icon, title, description }: { number: string; icon: typeof FolderTree; title: string; description: string }) {
  return <div className="flex items-center gap-3 rounded-[18px] border border-ink/8 bg-white/65 p-4"><span className="relative grid size-10 place-items-center rounded-xl bg-amber-pale text-amber-dark"><Icon className="size-4" /><span className="absolute -right-1 -top-1 grid size-4 place-items-center rounded-full bg-ink font-mono text-[8px] text-white">{number}</span></span><div><p className="text-xs font-bold">{title}</p><p className="mt-0.5 text-[10px] text-ink/42">{description}</p></div></div>;
}

function SectionTitle({ icon: Icon, title }: { icon: typeof Laptop; title: string }) {
  return <h3 className="mb-3 flex items-center gap-2 text-xs font-bold text-ink"><Icon className="size-4 text-amber-dark" /> {title}</h3>;
}
