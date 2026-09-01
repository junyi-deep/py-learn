# 03 · 离线 API 客户端

验收器会临时启动一个本地 HTTP 服务，并通过环境变量 `PYPATH_API_URL` 提供完整 URL。请求 JSON 后生成 `output/profile.json`。

要求：

- 使用标准库 `urllib.request`，超时为 2 秒
- 不得硬编码 URL 或访问公网
- 输出 `display`（格式 `Ada (#7)`）、`skill_count` 和 `active`

```bash
pylearn check offline-api
```
