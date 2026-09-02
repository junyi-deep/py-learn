# PyPath · 从 Python 到算法

一个面向个人学习的 Python 与算法训练项目。启动后是网页版学习应用，同时提供本地 CLI 和 6 个可自动验收的实战目录。

## 快速开始

需要 [uv](https://docs.astral.sh/uv/getting-started/installation/)、Node.js 22.13+ 与 Python 3.11+。

```bash
uv sync
uv run pylearn doctor
uv run pylearn serve
```

打开终端显示的本地地址即可开始学习。首次启动会根据 `package-lock.json` 自动安装网页依赖。

## 三个阶段

1. **Python 基础语法**：8 章讲解与浏览器内真实 Python 练习；所有用例通过才记录完成。
2. **Python 实战**：在 `learning/projects/` 用本地编辑器完成 6 个项目，`uv run pylearn check <项目 ID>` 检查结果文件、日志和行为。
3. **算法与数据结构**：12 类常用模式、65 道精选 LeetCode 题；支持在网页中补充自己的题目。

## 项目分区

```text
meta/                 # 课程配置、CLI、CLI 本地进度
learning/
  foundations/        # 基础阶段索引
  projects/           # 实战题目、fixtures、你的 solution.py
  algorithms/         # 算法阶段索引
app/ components/ lib/ # 网页应用
```

常用命令：

```bash
uv run pylearn outline                  # 学习大纲
uv run pylearn projects                 # 实战项目列表
uv run pylearn check file-organizer     # 验收某个项目
uv run pylearn status                   # 本地实战进度
uv run pylearn doctor                   # 环境诊断
uv run pylearn build                    # 构建生产版网页
uv build --out-dir outputs/python --clear  # 构建 Python wheel 与源码包
```

`uv` 负责 Python 环境、锁文件、CLI 与 Python 包构建；网页编译仍由项目内的 Vinext/Node 工具链完成，但统一通过 `uv run pylearn …` 进入。
