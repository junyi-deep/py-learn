'use client';

import { useState, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import { foundationChapters } from '@/lib/course-data';
import { exercisesForChapter } from '@/lib/foundation-practice';

const questions = foundationChapters.flatMap((chapter) => exercisesForChapter(chapter).map((exercise) => ({
  chapterId: chapter.id, exerciseId: exercise.id, title: exercise.title,
})));

export function RainbowQuestionRail({ chapterId, exerciseId, completed, onSelect }: {
  chapterId: string; exerciseId: string; completed: string[];
  onSelect: (chapterId: string, exerciseId: string) => void;
}) {
  const [preview, setPreview] = useState<{ index: number; left: number; top: number } | null>(null);
  function show(index: number, element: HTMLButtonElement) {
    const rect = element.getBoundingClientRect();
    setPreview({ index, left: rect.right - 1, top: Math.max(8, Math.min(rect.top, window.innerHeight - 34)) });
  }
  return (
    <>
      <div className="rainbow-rail" aria-label="彩虹题号目录" onScroll={() => setPreview(null)}>
        {questions.map((question, index) => {
          const active = question.chapterId === chapterId && question.exerciseId === exerciseId;
          const passed = completed.includes(`${question.chapterId}:${question.exerciseId}`);
          return <button type="button" key={`${question.chapterId}:${question.exerciseId}`}
            className="rainbow-question"
            aria-label={`第 ${index + 1} 题：${question.title}${passed ? '，已通过' : ''}`}
            aria-current={active ? 'true' : undefined}
            onMouseEnter={(event) => show(index, event.currentTarget)} onMouseLeave={() => setPreview(null)}
            onFocus={(event) => show(index, event.currentTarget)} onBlur={() => setPreview(null)}
            onClick={() => onSelect(question.chapterId, question.exerciseId)}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            {passed && <span className="rainbow-passed" aria-hidden="true">✓</span>}
          </button>;
        })}
      </div>
      {preview && createPortal(<div key={preview.index} className="rainbow-preview" aria-hidden="true" style={{
        left: preview.left, top: preview.top, maxWidth: `calc(100vw - ${preview.left + 12}px)`,
        '--question-hue': preview.index * 300 / questions.length,
      } as CSSProperties}>
        <span className="rainbow-preview-title">{questions[preview.index].title}</span>
      </div>, document.body)}
    </>
  );
}
