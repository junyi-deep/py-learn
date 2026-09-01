# 06 · 可验证备份清单

递归扫描 `fixtures/source`，为每个应备份的文件计算 SHA-256，生成 `output/manifest.json`。

要求：

- 忽略文件名以 `.` 开头的隐藏文件和扩展名为 `.tmp` 的文件
- 使用 64 KiB 分块读取，不能一次性读入任意大小文件
- 路径相对于 `fixtures/source`，统一为 `/` 分隔符
- `files` 按路径排序，每项包含 `path`、`size`、`sha256`
- 顶层 `file_count` 与 files 数量一致

```bash
pylearn check backup-manifest
```
