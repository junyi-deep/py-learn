# 01 · 文件归档助手

读取 `fixtures/inbox.txt`，为每个文件选择归档类别，并生成 `output/plan.json`。

规则：

- `.txt` → `text`，`.jpg/.jpeg/.png` → `image`，`.pdf` → `document`
- 扩展名大小写不敏感；没有扩展名时进入 `other`
- 每个列表和字典键都要稳定排序
- 只生成计划，不移动真实文件

只修改 `solution.py`。完成后在项目根目录运行：

```bash
pylearn check file-organizer
```
