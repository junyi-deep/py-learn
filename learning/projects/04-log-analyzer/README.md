# 04 · 服务日志体检器

逐行读取 `fixtures/app.jsonl`，忽略并统计损坏行，生成 `output/report.json`。

报告字段：

- `levels`：各日志级别数量
- `error_rate`：ERROR 占合法日志的百分比，两位小数
- `slowest`：耗时最高请求的 `path` 和 `duration_ms`
- `invalid_lines`：无法解析的行数

```bash
pylearn check log-analyzer
```
