# PyPath · 从 Python 到算法

一个面向个人学习的 Python 与算法训练项目。启动后是网页版学习应用，同时提供本地 CLI 和 6 个可自动验收的实战目录。

## 安装与启动

先安装 [Git](https://git-scm.com/downloads)、[uv](https://docs.astral.sh/uv/getting-started/installation/) 和 [Node.js](https://nodejs.org/) 22.13 或更新版本（需包含 npm）。项目要求 Python 3.11 或更新版本；如果本机没有合适的 Python，uv 可在同步环境时下载并管理它。

在终端依次运行：

```bash
git clone https://github.com/junyi-deep/py-learn.git
cd py-learn
uv sync --locked
uv run pylearn doctor
uv run pylearn serve
```

然后在浏览器打开 **http://localhost:3000/**。保持终端运行；结束时按 `Ctrl+C`。`serve` 会在首次启动或网页锁文件更新后自动执行 `npm ci` 安装前端依赖，因此不必手动运行 `npm install`。

如果已经下载了项目，则在项目根目录从 `uv sync --locked` 开始即可。`doctor` 会检查 Python、uv、Node.js、npm 和实战题目录；若启动失败，先根据它的输出补齐缺失工具。网页练习与算法进度保存在当前浏览器，本地实战进度保存在 `meta/progress.json`，换浏览器或清除浏览器数据不会自动同步。

## 三个阶段

1. **Python 基础语法**：26 章原创讲解与 52 道浏览器内真实 Python 练习，从核心语法覆盖到并发、网络、数据库、AI 与量化；一章内所有练习通过才记录完成。
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

## 独立二进制发行包

在 GitHub Releases 下载对应平台的完整压缩包：

- Apple Silicon Mac：`PyPath-macos-arm64.tar.gz`，解压后运行 `./PyPath/PyPath`。
- Windows x64：`PyPath-win-x64.zip`，全部解压后双击 `PyPath.exe`。

启动程序会打开浏览器，地址为 `http://127.0.0.1:3000/foundations`；按 `Ctrl+C` 关闭服务。可传入 `--port 3001` 指定端口，或 `--no-browser` 禁止自动打开浏览器。端口占用时会明确报错。

发行包包含原生启动程序、Python 启动运行时、Node 运行时和生产网页，无需预装 Python、Node、npm 或 uv 即可启动网页。请保留解压后的整个目录，不能仅复制可执行文件。浏览器内 Python 引擎首次加载需要网络；这不是完全离线包。`course/` 附带已提交的实战模板和 CLI，进行本地 Python 实战仍需安装 uv，进入 `course/` 后使用 `uv run pylearn check …`。

模式、提交代码和网页进度保存在浏览器里；需使用同一个浏览器、地址及端口才能恢复。发行包默认使用 `127.0.0.1`，与源码开发时的 `localhost` 数据独立。当前发行包未做 Apple 公证或 Windows 发布者签名。

### 本机构建

构建机需要 Git、uv、Node.js 22.17+ 和对应系统架构。分别在 Mac ARM64、Windows x64 上运行：

```bash
uv sync --locked --group build
uv run --locked --group build pylearn package --target macos-arm64
# Windows x64：
uv run --locked --group build pylearn package --target win-x64
```

产物位于 `outputs/release/`，附带 `.sha256` 校验文件。构建使用独立 Node 服务模式，不依赖 Cloudflare 或开发服务器。打包使用当前网页源码；附带的 `course/` 模板来自 Git HEAD，所以发行前应先提交全部改动。PyInstaller 需要在目标操作系统上原生构建，不能直接跨系统编译。

### 自动 Release

`.github/workflows/release.yml` 在推送 `v*` Tag 时自动执行两平台构建、解压启动测试、网页与静态资源检查；两者都成功后创建并发布 GitHub Release，上传两种压缩包及 SHA-256 文件。只使用仓库内置 `GITHUB_TOKEN`，无需额外密钥。

例如发布一个未使用的版本号（请按实际版本修改）：

```bash
git tag v0.2.0
git push origin v0.2.0
```

也可在 Actions 中手动运行 **Release binaries** 验证构建；从分支手动运行只上传 Actions 产物，不创建 Release。
