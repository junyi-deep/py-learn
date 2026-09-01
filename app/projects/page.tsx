import type { Metadata } from 'next';
import { ProjectsWorkbench } from '@/components/projects-workbench';

export const metadata: Metadata = {
  title: 'Python 实战项目 · PyPath',
  description: '6 个已经初始化好的本地 Python 项目，用输出文件、日志和行为自动验收。',
};

export default function ProjectsPage() {
  return <ProjectsWorkbench />;
}
