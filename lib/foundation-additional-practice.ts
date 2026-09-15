import type { SupplementalFoundationExercise } from './foundation-practice';

export const additionalFoundationPractice: Record<string, SupplementalFoundationExercise[]> = {
  decorators: [{
    id: 'drill', title: '带参数的数值守门员', brief: '实现保留原函数元数据的参数化装饰器，在调用前检查第一个数值参数是否落在闭区间内。',
    starterCode: `from functools import wraps

def enforce_range(minimum, maximum):
    # TODO：先验证区间，再返回装饰器
    pass`, sampleInput: '', mode: 'function',
    testCode: `
calls = []

@enforce_range(0, 100)
def percent(value, scale=1):
    """缩放百分比。"""
    calls.append(value)
    return value * scale

assert percent(0) == 0
assert percent(100, scale=0.5) == 50
assert percent.__name__ == "percent"
assert percent.__doc__ == "缩放百分比。"
for invalid in (-0.1, 100.1):
    try:
        percent(invalid)
    except ValueError:
        pass
    else:
        raise AssertionError("区间外的值必须被拒绝")
assert calls == [0, 100]
try:
    enforce_range(5, 4)
except ValueError:
    pass
else:
    raise AssertionError("反向区间必须被拒绝")
print("__PYPATH_PASS__")`,
    hints: ['minimum > maximum 时立即抛出 ValueError。', '内部再定义 decorate 与 wrapper 两层函数。', 'wrapper 上使用 @wraps(func)，通过校验后再调用 func。'],
  }],
  typing: [{
    id: 'drill', title: '泛型稳定分组', brief: '使用 TypeVar、Iterable 与 Callable 标注一个通用函数，并保持元素在原迭代器中的相对顺序。',
    starterCode: `from collections.abc import Callable, Iterable
from typing import TypeVar

T = TypeVar("T")

def stable_partition(
    items: Iterable[T], predicate: Callable[[T], bool]
) -> tuple[list[T], list[T]]:
    # TODO：返回 (满足条件的元素, 不满足条件的元素)
    pass`, sampleInput: '', mode: 'function',
    testCode: `
source = (value for value in [3, 2, 4, 1, 6])
matched, rejected = stable_partition(source, lambda value: value % 2 == 0)
assert matched == [2, 4, 6]
assert rejected == [3, 1]
assert list(source) == []
assert stable_partition([], bool) == ([], [])
words = ["", "py", "", "type"]
assert stable_partition(words, bool) == (["py", "type"], ["", ""])
assert words == ["", "py", "", "type"]
assert stable_partition.__annotations__["return"] == tuple[list[T], list[T]]
print("__PYPATH_PASS__")`,
    hints: ['建立 matched 与 rejected 两个 list[T]。', '只遍历 items 一次，避免生成器被提前耗尽。', 'predicate(item) 为真时放入 matched，否则放入 rejected。'],
  }],
  'math-statistics': [{
    id: 'drill', title: '稳定的测量摘要', brief: '结合 math 与 statistics 汇总有限数值，避免简单累加带来的明显浮点误差。',
    starterCode: `import math
import statistics

def measurement_summary(values):
    # TODO：返回 count、mean、median、pstdev、minimum、maximum
    pass`, sampleInput: '', mode: 'function',
    testCode: `
summary = measurement_summary([0.1, 0.2, 0.3])
assert summary["count"] == 3
assert math.isclose(summary["mean"], 0.2)
assert summary["median"] == 0.2
assert math.isclose(summary["pstdev"], statistics.pstdev([0.1, 0.2, 0.3]))
assert summary["minimum"] == 0.1 and summary["maximum"] == 0.3
assert measurement_summary([7]) == {
    "count": 1, "mean": 7.0, "median": 7, "pstdev": 0.0,
    "minimum": 7, "maximum": 7,
}
for invalid in ([], [1, float("inf")], [float("nan")]):
    try:
        measurement_summary(invalid)
    except ValueError:
        pass
    else:
        raise AssertionError("空数据或非有限值必须被拒绝")
print("__PYPATH_PASS__")`,
    hints: ['先复制为列表，并用 math.isfinite 检查每个值。', '均值使用 math.fsum(data) / len(data)。', 'statistics.median 与 statistics.pstdev 可直接完成其余统计。'],
  }],
  'random-security': [{
    id: 'drill', title: '可测试的安全兑换码', brief: '默认用 secrets.choice 生成兑换码，同时通过依赖注入让安全随机逻辑可以离线、确定地测试。',
    starterCode: `import secrets
import string

DEFAULT_ALPHABET = string.ascii_uppercase + string.digits

def issue_codes(count, length, *, chooser=secrets.choice, alphabet=DEFAULT_ALPHABET):
    # TODO
    pass`, sampleInput: '', mode: 'function',
    testCode: `
characters = iter("AB12CD34")
def fake_choice(alphabet):
    value = next(characters)
    assert value in alphabet
    return value

assert issue_codes(2, 4, chooser=fake_choice, alphabet="ABCD1234") == ["AB12", "CD34"]
def must_not_run(_alphabet):
    raise AssertionError("count=0 不应取随机数")
assert issue_codes(0, 4, chooser=must_not_run, alphabet="AB") == []
for arguments in [(-1, 4, "AB"), (1, 3, "AB"), (1, 4, "A"), (1, 4, "AABC")]:
    count, length, alphabet = arguments
    try:
        issue_codes(count, length, chooser=must_not_run, alphabet=alphabet)
    except ValueError:
        pass
    else:
        raise AssertionError("无效数量、长度或字符表必须被拒绝")
print("__PYPATH_PASS__")`,
    hints: ['count 不得为负，length 至少为 4。', '字符表至少有两个字符且不能重复。', '每个兑换码可用 join(chooser(alphabet) for _ in range(length))。'],
  }],
  'code-quality-tools': [{
    id: 'drill', title: '静态检查命令计划', brief: '生成 Ruff 与 mypy 的 argv 配置，不执行外部程序；路径即使含空格也必须保持为单独参数。',
    starterCode: `def quality_commands(paths, *, line_length=88, strict=True):
    # TODO：返回包含 ruff 与 mypy argv 的列表
    pass`, sampleInput: '', mode: 'function',
    testCode: `
assert quality_commands(["src/app.py", "tests/name with space.py", "src/app.py"], line_length=100) == [
    ["ruff", "check", "--line-length", "100", "src/app.py", "tests/name with space.py"],
    ["mypy", "--strict", "src/app.py", "tests/name with space.py"],
]
assert quality_commands(["main.py"], strict=False) == [
    ["ruff", "check", "--line-length", "88", "main.py"],
    ["mypy", "main.py"],
]
for paths, width in [([], 88), (["main.txt"], 88), (["main.py"], 59), (["main.py"], 121)]:
    try:
        quality_commands(paths, line_length=width)
    except ValueError:
        pass
    else:
        raise AssertionError("空路径、非 Python 文件或异常行宽必须被拒绝")
print("__PYPATH_PASS__")`,
    hints: ['用 dict.fromkeys(paths) 稳定去重，不要拼成 shell 字符串。', '只接受以 .py 结尾的非空路径，行宽限制在 60～120。', 'strict 为真时才向 mypy 参数加入 --strict。'],
  }],
  'xml-parsing': [{
    id: 'drill', title: '内存 XML 目录解析器', brief: '用 ElementTree 解析 XML 字符串，校验根节点、唯一编号、标题与非负价格。',
    starterCode: `from xml.etree import ElementTree as ET

def parse_book_catalog(xml_text):
    # TODO：返回 [{"id": ..., "title": ..., "price": ...}, ...]
    pass`, sampleInput: '', mode: 'function',
    testCode: `
xml = """<catalog>
  <book id="b1"><title> Python &amp; XML </title><price>39.5</price></book>
  <book id="b2"><title>算法</title><price>0</price></book>
</catalog>"""
assert parse_book_catalog(xml) == [
    {"id": "b1", "title": "Python & XML", "price": 39.5},
    {"id": "b2", "title": "算法", "price": 0.0},
]
assert parse_book_catalog("<catalog />") == []
invalid_documents = [
    "<wrong />",
    "<catalog><book id='x'><title>A</title><price>-1</price></book></catalog>",
    "<catalog><book id='x'><title>A</title><price>1</price></book><book id='x'><title>B</title><price>2</price></book></catalog>",
    "<catalog><book></catalog>",
]
for document in invalid_documents:
    try:
        parse_book_catalog(document)
    except ValueError:
        pass
    else:
        raise AssertionError("结构、内容或语法错误的 XML 必须被拒绝")
print("__PYPATH_PASS__")`,
    hints: ['捕获 ET.ParseError，并转成 ValueError。', 'root.tag 必须是 catalog；遍历 root.findall("book")。', '清洗 id/title，转换 price，并用集合检查重复 id。'],
  }],
  'pickle-hashlib': [{
    id: 'drill', title: '带签名的内存快照', brief: '用 pickle 序列化可信内存对象，并在反序列化前用 HMAC-SHA256 验证完整性。',
    starterCode: `import hashlib
import hmac
import pickle

def seal_snapshot(value, secret):
    # TODO：返回包含 payload 与 digest 的字典
    pass

def open_snapshot(envelope, secret):
    # TODO：签名通过后才允许 pickle.loads
    pass`, sampleInput: '', mode: 'function',
    testCode: `
secret = b"classroom-secret"
value = {"lesson": "hashlib", "scores": [95, 88]}
envelope = seal_snapshot(value, secret)
assert set(envelope) == {"payload", "digest"}
assert isinstance(envelope["payload"], bytes)
assert len(envelope["digest"]) == 64
assert open_snapshot(envelope, secret) == value
tampered = dict(envelope)
tampered["payload"] = envelope["payload"] + b"x"
for candidate, key in [(tampered, secret), (envelope, b"wrong-secret")]:
    try:
        open_snapshot(candidate, key)
    except ValueError:
        pass
    else:
        raise AssertionError("被篡改或密钥错误的快照必须被拒绝")
for bad_secret in (b"", "not-bytes"):
    try:
        seal_snapshot(value, bad_secret)
    except ValueError:
        pass
    else:
        raise AssertionError("密钥必须是非空 bytes")
print("__PYPATH_PASS__")`,
    hints: ['只接受非空 bytes 密钥。', 'payload = pickle.dumps(value)，digest 用 hmac.new(secret, payload, hashlib.sha256).hexdigest()。', 'open_snapshot 先用 hmac.compare_digest 验证，再调用 pickle.loads；绝不能加载未验证数据。'],
  }],
  'markdown-processing': [{
    id: 'drill', title: '安全的任务清单表格', brief: '把任务记录渲染成 Markdown 表格，正确转义竖线、反斜杠与换行，并检查标题字段。',
    starterCode: `def markdown_task_table(tasks):
    # TODO：列固定为 done 与 task
    pass`, sampleInput: '', mode: 'function',
    testCode: `
tasks = [
    {"title": "Ship | review", "done": True},
    {"title": "line one\nline two", "done": False},
    {"title": r"docs\\api", "done": 1},
]
assert markdown_task_table(tasks) == (
    "| done | task |\n"
    "| --- | --- |\n"
    "| x | Ship \\| review |\n"
    "|   | line one<br>line two |\n"
    "| x | docs\\\\api |"
)
assert markdown_task_table([]) == "| done | task |\n| --- | --- |"
for invalid in ([{"done": True}], [{"title": "   ", "done": False}]):
    try:
        markdown_task_table(invalid)
    except ValueError:
        pass
    else:
        raise AssertionError("缺失或空白标题必须被拒绝")
print("__PYPATH_PASS__")`,
    hints: ['先把反斜杠替换为两个反斜杠，再转义竖线。', '把 CRLF、CR、LF 都规范成 <br>。', 'done 用 bool(...) 判断，真值显示 x，假值显示三个空格。'],
  }],
  'logging-system': [{
    id: 'drill', title: '隔离的内存日志捕获器', brief: '使用独立 Logger、StreamHandler 与 Formatter 按级别捕获日志，不修改根日志器配置。',
    starterCode: `import logging
from io import StringIO

def capture_events(events, minimum="INFO"):
    # TODO：返回形如 LEVEL|message 的行列表
    pass`, sampleInput: '', mode: 'function',
    testCode: `
root_handlers = list(logging.getLogger().handlers)
events = [("debug", "detail"), ("INFO", "ready"), ("WARNING", "slow"), ("ERROR", "failed")]
assert capture_events(events, "warning") == ["WARNING|slow", "ERROR|failed"]
assert capture_events(events, "DEBUG") == [
    "DEBUG|detail", "INFO|ready", "WARNING|slow", "ERROR|failed"
]
assert capture_events([], "INFO") == []
assert list(logging.getLogger().handlers) == root_handlers
for minimum in ("TRACE", ""):
    try:
        capture_events([], minimum)
    except ValueError:
        pass
    else:
        raise AssertionError("未知最低级别必须被拒绝")
try:
    capture_events([("NOPE", "bad")])
except ValueError:
    pass
else:
    raise AssertionError("未知事件级别必须被拒绝")
print("__PYPATH_PASS__")`,
    hints: ['用 getattr(logging, name.upper(), None) 解析级别，并拒绝非整数结果。', '直接创建 logging.Logger，而不是修改 logging.getLogger() 的根配置。', '把格式设为 %(levelname)s|%(message)s，最后读取 StringIO。'],
  }],
  'asyncio-programming': [{
    id: 'drill', title: '有并发上限的异步映射', brief: '用 asyncio.Semaphore 限制同时运行的协程数量，并让最终结果保持输入顺序。',
    starterCode: `import asyncio

async def map_limited(values, worker, limit=3):
    # TODO
    pass`, sampleInput: '', mode: 'function',
    testCode: `
active = 0
peak = 0

async def worker(value):
    global active, peak
    active += 1
    peak = max(peak, active)
    await asyncio.sleep(0)
    active -= 1
    return value * 10

assert await map_limited([3, 1, 2, 4], worker, limit=2) == [30, 10, 20, 40]
assert peak == 2
assert await map_limited([], worker, limit=2) == []
for invalid in (0, -1):
    try:
        await map_limited([1], worker, limit=invalid)
    except ValueError:
        pass
    else:
        raise AssertionError("并发上限必须为正数")

async def failing_worker(value):
    if value == 2:
        raise RuntimeError("boom")
    await asyncio.sleep(0)
    return value

try:
    await map_limited([1, 2], failing_worker, limit=1)
except RuntimeError as error:
    assert str(error) == "boom"
else:
    raise AssertionError("worker 异常必须向调用方传播")
print("__PYPATH_PASS__")`,
    hints: ['先验证 limit >= 1，再创建 asyncio.Semaphore(limit)。', '内部协程用 async with semaphore 包住 await worker(value)。', '把内部协程按输入顺序交给 asyncio.gather。'],
  }],
  'http-clients': [{
    id: 'drill', title: '可替换会话的 JSON 客户端', brief: '面向 requests 风格的 session 接口编程，用 fake session 离线验证超时、状态检查和 JSON 结构。',
    starterCode: `from urllib.parse import urlsplit

def fetch_json_object(session, url, *, timeout=3.0):
    # TODO
    pass`, sampleInput: '', mode: 'function',
    testCode: `
class FakeResponse:
    def __init__(self, payload, error=None):
        self.payload = payload
        self.error = error
        self.checked = False

    def raise_for_status(self):
        self.checked = True
        if self.error:
            raise self.error

    def json(self):
        assert self.checked
        return self.payload

class FakeSession:
    def __init__(self, response):
        self.response = response
        self.calls = []

    def get(self, url, *, timeout, headers):
        self.calls.append((url, timeout, headers))
        return self.response

response = FakeResponse({"ok": True})
session = FakeSession(response)
assert fetch_json_object(session, "https://api.example.test/items", timeout=1.5) == {"ok": True}
assert session.calls == [("https://api.example.test/items", 1.5, {"Accept": "application/json"})]
for url, timeout in [("http://api.example.test", 1), ("https://api.example.test", 0)]:
    untouched = FakeSession(FakeResponse({}))
    try:
        fetch_json_object(untouched, url, timeout=timeout)
    except ValueError:
        pass
    else:
        raise AssertionError("必须要求 HTTPS 与正超时")
    assert untouched.calls == []
try:
    fetch_json_object(FakeSession(FakeResponse([1, 2])), "https://api.example.test")
except ValueError:
    pass
else:
    raise AssertionError("顶层 JSON 不是对象时必须拒绝")
problem = RuntimeError("503")
try:
    fetch_json_object(FakeSession(FakeResponse({}, problem)), "https://api.example.test")
except RuntimeError as error:
    assert error is problem
else:
    raise AssertionError("HTTP 状态异常必须传播")
print("__PYPATH_PASS__")`,
    hints: ['先用 urlsplit 校验 scheme == "https" 且 netloc 非空，并检查 timeout > 0。', '调用 session.get(url, timeout=..., headers={"Accept": "application/json"})。', '先 response.raise_for_status()，再 response.json()，且结果必须是 dict。'],
  }],
  'cgi-history': [{
    id: 'drill', title: '复刻 CGI 表单入口', brief: '根据 CGI 风格 environ 解析 GET 查询串或表单编码的 POST 字节，保留重复键与空值。',
    starterCode: `from urllib.parse import parse_qs

def parse_cgi_form(environ, body=b""):
    # TODO：返回 dict[str, list[str]]
    pass`, sampleInput: '', mode: 'function',
    testCode: `
get_environment = {
    "REQUEST_METHOD": "GET",
    "QUERY_STRING": "tag=python&tag=web&empty=",
}
assert parse_cgi_form(get_environment) == {"tag": ["python", "web"], "empty": [""]}
post_body = "name=%E5%B0%8F%E6%B4%BE&note=hello+world".encode("ascii")
post_environment = {
    "REQUEST_METHOD": "POST",
    "CONTENT_TYPE": "application/x-www-form-urlencoded; charset=utf-8",
    "CONTENT_LENGTH": str(len(post_body)),
}
assert parse_cgi_form(post_environment, post_body) == {"name": ["小派"], "note": ["hello world"]}
assert parse_cgi_form({"REQUEST_METHOD": "GET", "QUERY_STRING": ""}) == {}
invalid_cases = [
    ({"REQUEST_METHOD": "PUT"}, b""),
    ({"REQUEST_METHOD": "POST", "CONTENT_TYPE": "application/json", "CONTENT_LENGTH": "2"}, b"{}"),
    ({"REQUEST_METHOD": "POST", "CONTENT_TYPE": "application/x-www-form-urlencoded", "CONTENT_LENGTH": "3"}, b"a=1"),
]
for environment, payload in invalid_cases:
    try:
        parse_cgi_form(environment, payload)
    except ValueError:
        pass
    else:
        raise AssertionError("不支持的方法、媒体类型或错误长度必须被拒绝")
print("__PYPATH_PASS__")`,
    hints: ['REQUEST_METHOD 只接受 GET 与 POST。', 'POST 必须检查 Content-Type、body 的 bytes 类型及 CONTENT_LENGTH。', '把 ASCII 表单字节解码后交给 parse_qs(..., keep_blank_values=True)。'],
  }],
};
