'use client';

import { useState } from 'react';
import { CheckCircle2, LoaderCircle, Play, RotateCcw, Send, TerminalSquare, TriangleAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCourseProgress } from '@/components/course-progress';
import type { FoundationChapter } from '@/lib/course-data';

type PyResult = { stdout: string; stderr: string; error: string };
type PyProxy = { toJs: () => unknown; destroy?: () => void };
type PyodideLike = {
  globals: { set: (name: string, value: unknown) => void; delete: (name: string) => void };
  runPythonAsync: (code: string) => Promise<PyProxy | unknown>;
};

declare global {
  interface Window {
    loadPyodide?: (config: { indexURL: string }) => Promise<PyodideLike>;
  }
}

const PYODIDE_VERSION = '314.0.6';
const PYODIDE_BASE = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;
let pyodidePromise: Promise<PyodideLike> | null = null;

function getPyodide() {
  if (pyodidePromise) return pyodidePromise;
  pyodidePromise = new Promise<PyodideLike>((resolve, reject) => {
    const begin = async () => {
      try {
        if (!window.loadPyodide) throw new Error('Python 引擎脚本没有正确加载');
        resolve(await window.loadPyodide({ indexURL: PYODIDE_BASE }));
      } catch (error) {
        pyodidePromise = null;
        reject(error);
      }
    };

    if (window.loadPyodide) {
      void begin();
      return;
    }

    const existing = document.querySelector<HTMLScriptElement>('script[data-pypath-pyodide]');
    if (existing) {
      existing.addEventListener('load', () => void begin(), { once: true });
      existing.addEventListener('error', () => reject(new Error('无法下载 Python 引擎，请检查网络后重试')), { once: true });
      return;
    }

    const script = document.createElement('script');
    script.src = `${PYODIDE_BASE}pyodide.js`;
    script.async = true;
    script.dataset.pypathPyodide = 'true';
    script.addEventListener('load', () => void begin(), { once: true });
    script.addEventListener('error', () => {
      pyodidePromise = null;
      reject(new Error('无法下载 Python 引擎，请检查网络后重试'));
    }, { once: true });
    document.head.appendChild(script);
  });
  return pyodidePromise;
}

async function executePython(code: string, input: string): Promise<PyResult> {
  const pyodide = await getPyodide();
  pyodide.globals.set('_pypath_code', code);
  pyodide.globals.set('_pypath_input', input);
  const proxy = await pyodide.runPythonAsync(`
import contextlib, io, sys, traceback
_pypath_stdout = io.StringIO()
_pypath_stderr = io.StringIO()
_pypath_error = ""
try:
    with contextlib.redirect_stdout(_pypath_stdout), contextlib.redirect_stderr(_pypath_stderr):
        sys.stdin = io.StringIO(_pypath_input)
        exec(compile(_pypath_code, "<PyPath exercise>", "exec"), {})
except BaseException:
    _pypath_error = traceback.format_exc()
(_pypath_stdout.getvalue(), _pypath_stderr.getvalue(), _pypath_error)
`);
  const converted = typeof proxy === 'object' && proxy && 'toJs' in proxy ? (proxy as PyProxy).toJs() : proxy;
  if (typeof proxy === 'object' && proxy && 'destroy' in proxy) (proxy as PyProxy).destroy?.();
  pyodide.globals.delete('_pypath_code');
  pyodide.globals.delete('_pypath_input');
  const [stdout = '', stderr = '', error = ''] = Array.isArray(converted) ? converted : [];
  return { stdout: String(stdout), stderr: String(stderr), error: String(error) };
}

function normalizeOutput(value: string) {
  return value.replace(/\r\n/g, '\n').trimEnd();
}

export function PythonExercise({ chapter }: { chapter: FoundationChapter }) {
  const [code, setCode] = useState(chapter.exercise.starterCode);
  const [input, setInput] = useState(chapter.exercise.sampleInput);
  const [output, setOutput] = useState('点击“运行”查看程序输出。');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [action, setAction] = useState<'run' | 'submit'>('run');
  const { foundations, completeFoundation } = useCourseProgress();
  const completed = foundations.includes(chapter.id);

  async function runCode() {
    setAction('run');
    setStatus('loading');
    setOutput('正在装载 Python 运行环境…首次运行需要下载核心文件。');
    try {
      const result = await executePython(code, input);
      if (result.error) {
        setStatus('error');
        setOutput(result.error);
      } else {
        setStatus('idle');
        setOutput(result.stdout || result.stderr || (chapter.exercise.mode === 'function' ? '函数已定义。点击“提交评测”运行测试。' : '程序运行完成，但没有输出。'));
      }
    } catch (error) {
      setStatus('error');
      setOutput(error instanceof Error ? error.message : '运行环境加载失败');
    }
  }

  async function submitCode() {
    setAction('submit');
    setStatus('loading');
    setOutput('正在运行公开用例和边界用例…');
    try {
      if (chapter.exercise.mode === 'stdout') {
        const cases = chapter.exercise.cases ?? [];
        for (let index = 0; index < cases.length; index += 1) {
          const test = cases[index];
          const result = await executePython(code, test.input);
          if (result.error) throw new Error(`第 ${index + 1} 个用例运行出错：\n${result.error}`);
          if (normalizeOutput(result.stdout) !== normalizeOutput(test.expected)) {
            throw new Error(`第 ${index + 1} 个用例未通过\n\n期望输出：\n${test.expected}\n\n你的输出：\n${result.stdout || '（没有输出）'}`);
          }
        }
      } else {
        const result = await executePython(`${code}\n${chapter.exercise.testCode ?? ''}`, '');
        if (result.error) throw new Error(result.error);
        if (!result.stdout.includes('__PYPATH_PASS__')) throw new Error('测试没有完成，请检查函数是否返回了正确结果。');
      }
      completeFoundation(chapter.id);
      setStatus('success');
      setOutput(`全部测试通过！“${chapter.title}”节点已经点亮。`);
    } catch (error) {
      setStatus('error');
      setOutput(error instanceof Error ? error.message : '评测失败');
    }
  }

  return (
    <section className="overflow-hidden rounded-[26px] border border-ink/10 bg-ink shadow-[0_24px_70px_rgba(23,35,60,.16)]" aria-labelledby="exercise-title">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/10 px-5 py-5 sm:px-6">
        <div>
          <div className="mb-1.5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-mint"><TerminalSquare className="size-3.5" /> Practice lab</div>
          <h2 id="exercise-title" className="font-display text-xl font-bold text-white">{chapter.exercise.title}</h2>
          <p className="mt-1 max-w-2xl text-xs leading-5 text-white/48">{chapter.exercise.brief}</p>
        </div>
        {completed && <span className="flex items-center gap-1.5 rounded-full bg-mint/15 px-3 py-1.5 text-[11px] font-bold text-mint"><CheckCircle2 className="size-3.5" /> 已通过</span>}
      </div>

      <div className="grid lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,.65fr)]">
        <div className="border-white/10 lg:border-r">
          <div className="flex items-center justify-between border-b border-white/8 px-4 py-2.5">
            <span className="font-mono text-[10px] font-semibold text-white/35">solution.py</span>
            <Button variant="ghost" size="sm" className="text-white/45 hover:bg-white/8 hover:text-white" onClick={() => setCode(chapter.exercise.starterCode)}><RotateCcw /> 重置</Button>
          </div>
          <textarea
            value={code}
            onChange={(event) => setCode(event.target.value)}
            spellCheck={false}
            aria-label="Python 代码编辑器"
            className="min-h-[360px] w-full resize-y bg-[#111b30] p-5 font-mono text-[13px] leading-6 text-[#e8edf7] outline-none selection:bg-mint/30"
          />
        </div>

        <div className="flex min-h-[360px] flex-col bg-[#101827]">
          {chapter.exercise.mode === 'stdout' && (
            <label className="border-b border-white/8 p-4">
              <span className="mb-2 block font-mono text-[10px] font-semibold text-white/35">标准输入</span>
              <textarea value={input} onChange={(event) => setInput(event.target.value)} spellCheck={false} className="min-h-20 w-full resize-y rounded-xl border border-white/10 bg-white/5 p-3 font-mono text-xs leading-5 text-white/80 outline-none focus:border-mint/50" />
            </label>
          )}
          <div className="flex min-h-48 flex-1 flex-col p-4">
            <span className="mb-2 flex items-center justify-between font-mono text-[10px] font-semibold text-white/35">
              运行结果
              {status === 'loading' && <LoaderCircle className="size-3.5 animate-spin text-mint" />}
              {status === 'success' && <CheckCircle2 className="size-3.5 text-mint" />}
              {status === 'error' && <TriangleAlert className="size-3.5 text-amber" />}
            </span>
            <pre className={`min-h-32 flex-1 whitespace-pre-wrap break-words rounded-xl border p-3 font-mono text-[11px] leading-5 ${status === 'success' ? 'border-mint/25 bg-mint/8 text-mint' : status === 'error' ? 'border-amber/25 bg-amber/8 text-amber' : 'border-white/8 bg-black/12 text-white/62'}`}>{output}</pre>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 bg-white/[.025] px-4 py-4 sm:px-6">
        <details className="text-[11px] text-white/42">
          <summary className="cursor-pointer font-semibold hover:text-white">卡住了？展开提示</summary>
          <ol className="mt-2 list-decimal space-y-1 pl-4 text-white/55">{chapter.exercise.hints.map((hint) => <li key={hint}>{hint}</li>)}</ol>
        </details>
        <div className="flex gap-2">
          <Button variant="outline" className="h-10 border-white/14 bg-white/5 px-4 text-white hover:bg-white/10 hover:text-white" onClick={runCode} disabled={status === 'loading'}>
            {status === 'loading' && action === 'run' ? <LoaderCircle className="animate-spin" /> : <Play />} 运行
          </Button>
          <Button className="h-10 bg-mint px-4 text-ink hover:bg-mint/85" onClick={submitCode} disabled={status === 'loading'}>
            {status === 'loading' && action === 'submit' ? <LoaderCircle className="animate-spin" /> : completed ? <CheckCircle2 /> : <Send />} {completed ? '再次评测' : '提交评测'}
          </Button>
        </div>
      </div>
    </section>
  );
}
