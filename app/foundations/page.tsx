import type { Metadata } from 'next';
import { FoundationsWorkbench } from '@/components/foundations-workbench';

export const metadata: Metadata = {
  title: 'Python 基础语法 · PyPath',
  description: '8 个由浅入深的 Python 基础章节，配套可运行、可提交的真实 Python 练习。',
};

export default function FoundationsPage() {
  return <FoundationsWorkbench />;
}
