import type { Metadata } from 'next';
import { AlgorithmsWorkbench } from '@/components/algorithms-workbench';

export const metadata: Metadata = {
  title: '算法与数据结构 · PyPath',
  description: '12 类常用算法和数据结构，配套形象讲解、通用模板与精选 LeetCode 题单。',
};

export default function AlgorithmsPage() {
  return <AlgorithmsWorkbench />;
}
