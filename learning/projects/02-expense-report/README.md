# 02 · 个人支出日报

读取 `fixtures/expenses.csv`，按类别汇总支出并生成 `output/summary.json`。

要求：

- 使用 `csv.DictReader` 和 `decimal.Decimal`
- 输出总额、币种 `CNY`、按类别汇总的金额
- 金额写成两位小数字符串；类别按名称排序

```bash
pylearn check expense-report
```
