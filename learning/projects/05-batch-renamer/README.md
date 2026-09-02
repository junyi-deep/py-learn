# 05 · 批量重命名规划器

把 `fixtures/names.txt` 中的名称转换为安全的 kebab-case，生成 `output/plan.csv`，但不要真正重命名文件。

要求：

- 去掉首尾空白；空格和连续下划线变为单个 `-`
- 主文件名和扩展名都转小写
- 新名称冲突时，在主文件名后追加 `-2`、`-3`……
- CSV 列固定为 `original,new_name`，保持输入顺序

```bash
uv run pylearn check batch-renamer
```
