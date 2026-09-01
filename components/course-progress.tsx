'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { algorithmCategories, builtinAlgorithmCount, foundationChapters, projects, type Difficulty } from '@/lib/course-data';

export type CustomProblem = {
  id: string;
  categoryId: string;
  title: string;
  url: string;
  difficulty: Difficulty;
};

type ProgressState = {
  foundations: string[];
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
  completeFoundation: (id: string) => void;
  completeProject: (id: string) => void;
  toggleAlgorithm: (id: string) => void;
  addCustomProblem: (problem: Omit<CustomProblem, 'id'>) => void;
  removeCustomProblem: (id: string) => void;
};

const STORAGE_KEY = 'pypath.progress.v1';
const emptyState: ProgressState = { foundations: [], projects: [], algorithms: [], customProblems: [] };

const CourseProgressContext = createContext<CourseProgressContextValue | null>(null);

function percentage(done: number, total: number) {
  return total === 0 ? 0 : Math.round((done / total) * 100);
}

function cleanState(candidate: Partial<ProgressState>): ProgressState {
  return {
    foundations: Array.isArray(candidate.foundations) ? candidate.foundations.filter((item): item is string => typeof item === 'string') : [],
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

  const completeFoundation = useCallback((id: string) => addOnce('foundations', id), [addOnce]);
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
    const foundationPercent = percentage(state.foundations.length, foundationChapters.length);
    const projectPercent = percentage(state.projects.length, projects.length);
    const algorithmTotal = builtinAlgorithmCount + state.customProblems.length;
    const algorithmPercent = percentage(state.algorithms.length, algorithmTotal);
    const completed = state.foundations.length + state.projects.length + state.algorithms.length;
    const total = foundationChapters.length + projects.length + algorithmTotal;
    return {
      ...state,
      hydrated,
      foundationPercent,
      projectPercent,
      algorithmPercent,
      totalPercent: percentage(completed, total),
      completeFoundation,
      completeProject,
      toggleAlgorithm,
      addCustomProblem,
      removeCustomProblem,
    };
  }, [state, hydrated, completeFoundation, completeProject, toggleAlgorithm, addCustomProblem, removeCustomProblem]);

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

export const algorithmCategoryCount = algorithmCategories.length;
