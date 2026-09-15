'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { algorithmCategories, builtinAlgorithmCount, projects, type Difficulty } from '@/lib/course-data';
import { foundationChapterCatalog } from '@/lib/foundation-catalog';
import { foundationPractice } from '@/lib/foundation-practice';

export type CustomProblem = {
  id: string;
  categoryId: string;
  title: string;
  url: string;
  difficulty: Difficulty;
};

type ProgressState = {
  foundationRevision: number;
  foundations: string[];
  foundationExercises: string[];
  submittedCode: Record<string, string>;
  projects: string[];
  algorithms: string[];
  customProblems: CustomProblem[];
};

type CourseProgressContextValue = ProgressState & {
  hydrated: boolean;
  foundationPercent: number;
  projectPercent: number;
  algorithmPercent: number;
  totalPercent: number;
  completeFoundationExercise: (chapterId: string, exerciseId: string) => void;
  recordFoundationSubmission: (chapterId: string, exerciseId: string, code: string) => void;
  completeProject: (id: string) => void;
  toggleAlgorithm: (id: string) => void;
  addCustomProblem: (problem: Omit<CustomProblem, 'id'>) => void;
  removeCustomProblem: (id: string) => void;
};

const STORAGE_KEY = 'pypath.progress.v1';
const FOUNDATION_REVISION = 3;
const foundationIds = new Set(foundationChapterCatalog.map((chapter) => chapter.id));
const foundationExerciseIds = new Map(
  foundationChapterCatalog.map((chapter) => [chapter.id, ['core', ...(foundationPractice[chapter.id] ?? []).map((exercise) => exercise.id)]])
);
const validFoundationExerciseIds = new Set(
  [...foundationExerciseIds].flatMap(([chapterId, exerciseIds]) => exerciseIds.map((exerciseId) => foundationExerciseProgressId(chapterId, exerciseId)))
);
export const foundationExerciseTotal = validFoundationExerciseIds.size;
const emptyState: ProgressState = {
  foundationRevision: FOUNDATION_REVISION,
  foundations: [],
  foundationExercises: [],
  submittedCode: {},
  projects: [],
  algorithms: [],
  customProblems: [],
};

const CourseProgressContext = createContext<CourseProgressContextValue | null>(null);

function percentage(done: number, total: number) {
  return total === 0 ? 0 : Math.min(100, Math.round((done / total) * 100));
}

function cleanState(candidate: Partial<ProgressState>): ProgressState {
  const savedExercises = candidate.foundationRevision === FOUNDATION_REVISION && Array.isArray(candidate.foundationExercises)
    ? candidate.foundationExercises.filter((item): item is string => typeof item === 'string' && validFoundationExerciseIds.has(item))
    : [];
  const foundationExercises = [...new Set(savedExercises)];
  const submittedCode = candidate.submittedCode && typeof candidate.submittedCode === 'object' && !Array.isArray(candidate.submittedCode)
    ? Object.fromEntries(Object.entries(candidate.submittedCode).filter(([id, code]) => validFoundationExerciseIds.has(id) && typeof code === 'string'))
    : {};
  const foundations = foundationChapterCatalog
    .filter((chapter) => (foundationExerciseIds.get(chapter.id) ?? []).every((exerciseId) => (
      foundationExercises.includes(foundationExerciseProgressId(chapter.id, exerciseId))
    )))
    .map((chapter) => chapter.id);
  return {
    foundationRevision: FOUNDATION_REVISION,
    foundations,
    foundationExercises,
    submittedCode,
    projects: Array.isArray(candidate.projects) ? candidate.projects.filter((item): item is string => typeof item === 'string') : [],
    algorithms: Array.isArray(candidate.algorithms) ? candidate.algorithms.filter((item): item is string => typeof item === 'string') : [],
    customProblems: Array.isArray(candidate.customProblems)
      ? candidate.customProblems.filter((item): item is CustomProblem => Boolean(item && typeof item.id === 'string' && typeof item.title === 'string'))
      : [],
  };
}

export function CourseProgressProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ProgressState>(emptyState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) setState(cleanState(JSON.parse(saved) as Partial<ProgressState>));
    } catch {
      // A malformed or blocked local store should never prevent learning.
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Progress remains available for this session when storage is unavailable.
    }
  }, [hydrated, state]);

  const addOnce = useCallback((key: 'foundations' | 'projects', id: string) => {
    setState((current) => current[key].includes(id) ? current : { ...current, [key]: [...current[key], id] });
  }, []);

  const completeFoundationExercise = useCallback((chapterId: string, exerciseId: string) => {
    const progressId = foundationExerciseProgressId(chapterId, exerciseId);
    if (!foundationIds.has(chapterId) || !validFoundationExerciseIds.has(progressId)) return;
    setState((current) => {
      const foundationExercises = current.foundationExercises.includes(progressId)
        ? current.foundationExercises
        : [...current.foundationExercises, progressId];
      const chapterCompleted = (foundationExerciseIds.get(chapterId) ?? []).every((id) => (
        foundationExercises.includes(foundationExerciseProgressId(chapterId, id))
      ));
      const foundations = chapterCompleted && !current.foundations.includes(chapterId)
        ? [...current.foundations, chapterId]
        : current.foundations;
      return { ...current, foundationExercises, foundations };
    });
  }, []);
  const recordFoundationSubmission = useCallback((chapterId: string, exerciseId: string, code: string) => {
    const progressId = foundationExerciseProgressId(chapterId, exerciseId);
    if (!validFoundationExerciseIds.has(progressId)) return;
    setState((current) => ({
      ...current,
      submittedCode: { ...current.submittedCode, [progressId]: code },
    }));
  }, []);
  const completeProject = useCallback((id: string) => addOnce('projects', id), [addOnce]);

  const toggleAlgorithm = useCallback((id: string) => {
    setState((current) => ({
      ...current,
      algorithms: current.algorithms.includes(id)
        ? current.algorithms.filter((item) => item !== id)
        : [...current.algorithms, id],
    }));
  }, []);

  const addCustomProblem = useCallback((problem: Omit<CustomProblem, 'id'>) => {
    setState((current) => ({
      ...current,
      customProblems: [...current.customProblems, { ...problem, id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 7)}` }],
    }));
  }, []);

  const removeCustomProblem = useCallback((id: string) => {
    setState((current) => ({
      ...current,
      customProblems: current.customProblems.filter((problem) => problem.id !== id),
      algorithms: current.algorithms.filter((algorithmId) => algorithmId !== id),
    }));
  }, []);

  const value = useMemo<CourseProgressContextValue>(() => {
    const foundationPercent = percentage(state.foundationExercises.length, foundationExerciseTotal);
    const projectPercent = percentage(state.projects.length, projects.length);
    const algorithmTotal = builtinAlgorithmCount + state.customProblems.length;
    const algorithmPercent = percentage(state.algorithms.length, algorithmTotal);
    const completed = state.foundationExercises.length + state.projects.length + state.algorithms.length;
    const total = foundationExerciseTotal + projects.length + algorithmTotal;
    return {
      ...state,
      hydrated,
      foundationPercent,
      projectPercent,
      algorithmPercent,
      totalPercent: percentage(completed, total),
      completeFoundationExercise,
      recordFoundationSubmission,
      completeProject,
      toggleAlgorithm,
      addCustomProblem,
      removeCustomProblem,
    };
  }, [state, hydrated, completeFoundationExercise, recordFoundationSubmission, completeProject, toggleAlgorithm, addCustomProblem, removeCustomProblem]);

  return <CourseProgressContext.Provider value={value}>{children}</CourseProgressContext.Provider>;
}

export function useCourseProgress() {
  const context = useContext(CourseProgressContext);
  if (!context) throw new Error('useCourseProgress must be used inside CourseProgressProvider');
  return context;
}

export function algorithmProgressId(categoryId: string, problemId: number | string) {
  return `${categoryId}:${problemId}`;
}

export function foundationExerciseProgressId(chapterId: string, exerciseId: string) {
  return `${chapterId}:${exerciseId}`;
}

export const algorithmCategoryCount = algorithmCategories.length;
