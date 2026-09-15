import type { FoundationChapter, FoundationExercise } from './course-data';

export type SupplementalFoundationExercise = FoundationExercise & { id: string };

export function exercisesForChapter(chapter: FoundationChapter): SupplementalFoundationExercise[] {
  return [{ id: 'core', ...chapter.exercise }, ...(foundationPractice[chapter.id] ?? [])];
}

export const foundationPractice: Record<string, SupplementalFoundationExercise[]> = {
  'first-program': [{
    id: 'drill', title: '变量交换与类型卡片', brief: '不丢失原值地交换两个变量，并返回值、类型名和 None 判断结果。',
    starterCode: `def swap_card(left, right):\n    # TODO：交换后返回字典\n    pass`, sampleInput: '', mode: 'function',
    testCode: `\nassert swap_card(7, "Python") == {"left": "Python", "right": 7, "types": ("str", "int"), "has_none": False}\nassert swap_card(None, True) == {"left": True, "right": None, "types": ("bool", "NoneType"), "has_none": True}\nprint("__PYPATH_PASS__")`,
    hints: ['可写成 left, right = right, left。', 'type(value).__name__ 得到类型名。', '用 is None 判断 None，不要用 ==。'],
  }],
  'numbers-strings': [{
    id: 'drill', title: '字符串切片体检', brief: '清洗文本并综合使用索引、切片、方法、成员判断与格式化。',
    starterCode: `def text_card(raw):\n    # TODO\n    pass`, sampleInput: '', mode: 'function',
    testCode: `\nassert text_card("  PyThOn  ") == {"clean": "python", "first": "p", "last": "n", "reverse": "nohtyp", "contains_py": True, "label": "PYTHON(6)"}\nassert text_card(" A ") == {"clean": "a", "first": "a", "last": "a", "reverse": "a", "contains_py": False, "label": "A(1)"}\ntry:\n    text_card("   ")\nexcept ValueError:\n    pass\nelse:\n    raise AssertionError("空文本必须拒绝")\nprint("__PYPATH_PASS__")`,
    hints: ['先 strip().lower() 得到 clean。', '[0]、[-1]、[::-1] 分别取首尾和反转。', '用 f"{clean.upper()}({len(clean)})" 生成标签。'],
  }],
  conditions: [{
    id: 'drill', title: '命令分派器', brief: '使用 match / case 处理离散命令，并用守卫判断数值边界。',
    starterCode: `def route_command(command, value=0):\n    # TODO：使用 match / case\n    pass`, sampleInput: '', mode: 'function',
    testCode: `\nassert route_command("start") == "running"\nassert route_command("stop") == "stopped"\nassert route_command("score", 90) == "excellent"\nassert route_command("score", 60) == "passed"\nassert route_command("score", 59) == "retry"\nassert route_command("unknown") == "unsupported"\nprint("__PYPATH_PASS__")`,
    hints: ['start 与 stop 各写一个 case。', 'score 分支可搭配 if value >= ... 的守卫。', '最后用 case _ 兜底。'],
  }],
  containers: [{
    id: 'drill', title: '集合关系实验室', brief: '返回两个序列的交、并、差集，以及由元组解包生成的字典。',
    starterCode: `def compare_groups(left, right, pair):\n    # TODO\n    pass`, sampleInput: '', mode: 'function',
    testCode: `\nassert compare_groups(["a", "b", "b"], ["b", "c"], ("topic", "Python")) == {\n    "both": ["b"], "either": ["a", "b", "c"], "left_only": ["a"], "pair": {"topic": "Python"}\n}\nassert compare_groups([], [], ("x", 1))["either"] == []\nprint("__PYPATH_PASS__")`,
    hints: ['先用 set(left) 和 set(right)。', '&、|、- 分别是交、并、差。', 'key, value = pair 后可建立 {key: value}。'],
  }],
  loops: [{
    id: 'drill', title: '循环版 FizzBuzz 报告', brief: '用 range 和 for 生成 1～limit；3、5 的倍数替换，循环正常结束时追加 done。',
    starterCode: `def fizzbuzz_report(limit):\n    # TODO\n    pass`, sampleInput: '', mode: 'function',
    testCode: `\nassert fizzbuzz_report(5) == ["1", "2", "Fizz", "4", "Buzz", "done"]\nassert fizzbuzz_report(15)[-2:] == ["FizzBuzz", "done"]\nassert fizzbuzz_report(0) == ["done"]\nprint("__PYPATH_PASS__")`,
    hints: ['range(1, limit + 1) 包含 limit。', '先判断同时被 3 和 5 整除。', '可使用 for ... else 在正常结束时追加 done。'],
  }],
  functions: [{
    id: 'drill', title: '可组合函数流水线', brief: '练习 *args、仅关键字参数、**kwargs 和把函数作为值传递。',
    starterCode: `def apply_pipeline(value, *steps, fallback=None, **metadata):\n    # TODO\n    pass`, sampleInput: '', mode: 'function',
    testCode: `\nassert apply_pipeline(3, lambda x: x + 1, lambda x: x * 2, source="quiz") == {"value": 8, "metadata": {"source": "quiz"}}\nassert apply_pipeline(None, lambda x: x + 1, fallback=0) == {"value": 1, "metadata": {}}\nassert apply_pipeline("py", str.upper) == {"value": "PY", "metadata": {}}\nprint("__PYPATH_PASS__")`,
    hints: ['value is None 时先替换为 fallback。', '按顺序循环 steps，让 result = step(result)。', '返回 metadata 本身即可，它已经是字典。'],
  }],
  'python-tools': [{
    id: 'drill', title: '栈与双端队列', brief: '用列表模拟撤销栈，用 deque 处理先来先服务的任务。',
    starterCode: `from collections import deque\n\ndef process_actions(actions):\n    # TODO\n    pass`, sampleInput: '', mode: 'function',
    testCode: `\nassert process_actions([("add", "A"), ("add", "B"), ("undo", None), ("add", "C")]) == {"stack": ["A", "C"], "queue_order": ["A", "B", "C"]}\nassert process_actions([]) == {"stack": [], "queue_order": []}\nprint("__PYPATH_PASS__")`,
    hints: ['add 时同时 append 到 stack 和 deque。', 'undo 时仅在 stack 非空时 pop。', '用 popleft() 依次取出队列内容。'],
  }],
  'standard-library': [{
    id: 'drill', title: '可复现抽样统计', brief: '用 statistics 计算均值/中位数，用独立 Random(seed) 做可复现抽样。',
    starterCode: `import random\nimport statistics\n\ndef sample_summary(values, seed):\n    # TODO\n    pass`, sampleInput: '', mode: 'function',
    testCode: `\nfirst = sample_summary([1, 2, 9], 7)\nsecond = sample_summary([1, 2, 9], 7)\nassert first == second\nassert first["mean"] == 4\nassert first["median"] == 2\nassert first["pick"] in [1, 2, 9]\ntry:\n    sample_summary([], 1)\nexcept ValueError:\n    pass\nelse:\n    raise AssertionError("空样本必须拒绝")\nprint("__PYPATH_PASS__")`,
    hints: ['空列表先抛出 ValueError。', 'statistics.mean / median 完成统计。', '用 rng = random.Random(seed)，再 rng.choice(values)。'],
  }],
  'iterators-generators': [{
    id: 'drill', title: '自定义步进迭代器', brief: '实现 StepRange 的 __iter__ 和 __next__，越过 stop 时抛出 StopIteration。',
    starterCode: `class StepRange:\n    def __init__(self, start, stop, step=1):\n        self.current = start\n        self.stop = stop\n        self.step = step\n\n    def __iter__(self):\n        # TODO\n        pass\n\n    def __next__(self):\n        # TODO\n        pass`, sampleInput: '', mode: 'function',
    testCode: `\nvalues = StepRange(1, 6, 2)\nassert iter(values) is values\nassert list(values) == [1, 3, 5]\nassert list(StepRange(3, 3)) == []\ntry:\n    StepRange(1, 3, 0)\nexcept ValueError:\n    pass\nelse:\n    raise AssertionError("step=0 必须拒绝")\nprint("__PYPATH_PASS__")`,
    hints: ['在 __init__ 中拒绝 step == 0。', '__iter__ 返回 self。', '正负 step 的停止条件不同，取值后让 current += step。'],
  }],
  'context-decorators': [{
    id: 'drill', title: '类式上下文管理器', brief: '实现 AuditSession，在进入、退出和异常时记录明确事件，且不吞掉异常。',
    starterCode: `class AuditSession:\n    def __init__(self, events):\n        self.events = events\n\n    def __enter__(self):\n        # TODO\n        pass\n\n    def __exit__(self, exc_type, exc, traceback):\n        # TODO\n        pass`, sampleInput: '', mode: 'function',
    testCode: `\nevents = []\nwith AuditSession(events) as session:\n    assert session.events is events\n    events.append("work")\nassert events == ["enter", "work", "exit:ok"]\ntry:\n    with AuditSession(events):\n        raise KeyError("x")\nexcept KeyError:\n    pass\nassert events[-2:] == ["enter", "exit:KeyError"]\nprint("__PYPATH_PASS__")`,
    hints: ['__enter__ 追加 enter 并返回 self。', 'exc_type 为 None 表示正常退出。', '__exit__ 返回 False，异常才会继续向外传播。'],
  }],
  'modules-typing': [{
    id: 'drill', title: '模块公开接口清单', brief: '像 dir() 一样检查命名空间，只返回非下划线开头且可调用的公开名字。',
    starterCode: `def public_callables(namespace: dict[str, object]) -> list[str]:\n    # TODO\n    pass`, sampleInput: '', mode: 'function',
    testCode: `\nnamespace = {"run": lambda: None, "value": 3, "_secret": lambda: None, "Build": dict}\nassert public_callables(namespace) == ["Build", "run"]\nassert public_callables({}) == []\nassert public_callables.__annotations__["return"] == list[str]\nprint("__PYPATH_PASS__")`,
    hints: ['遍历 namespace.items()。', 'not name.startswith("_") 过滤私有名字。', 'callable(value) 判断是否可调用，最后 sorted。'],
  }],
  'errors-exceptions': [{
    id: 'drill', title: '完整异常生命周期', brief: '调用 action：成功走 else，失败分类处理，finally 始终记录 cleanup。',
    starterCode: `def guarded_action(action, events):\n    # TODO：返回 (status, value)\n    pass`, sampleInput: '', mode: 'function',
    testCode: `\nevents = []\nassert guarded_action(lambda: 8, events) == ("ok", 8)\nassert events == ["success", "cleanup"]\nevents = []\nassert guarded_action(lambda: 1 / 0, events) == ("error", "ZeroDivisionError")\nassert events == ["handled", "cleanup"]\nprint("__PYPATH_PASS__")`,
    hints: ['try 中只调用 action()。', 'except Exception as error 返回 type(error).__name__。', 'else 记录 success，finally 记录 cleanup。'],
  }],
  'object-oriented': [{
    id: 'drill', title: '温度值对象', brief: '综合 property、classmethod、staticmethod 与特殊方法，实现安全温度对象。',
    starterCode: `class Temperature:\n    def __init__(self, celsius):\n        self.celsius = celsius\n\n    @property\n    def fahrenheit(self):\n        # TODO\n        pass\n\n    @classmethod\n    def from_fahrenheit(cls, value):\n        # TODO\n        pass\n\n    @staticmethod\n    def is_valid(celsius):\n        # TODO\n        pass\n\n    def __str__(self):\n        # TODO\n        pass`, sampleInput: '', mode: 'function',
    testCode: `\nzero = Temperature(0)\nassert zero.fahrenheit == 32\nassert str(zero) == "0.0°C"\nassert round(Temperature.from_fahrenheit(212).celsius, 6) == 100\nassert Temperature.is_valid(-273.15)\nassert not Temperature.is_valid(-274)\ntry:\n    Temperature(-300)\nexcept ValueError:\n    pass\nelse:\n    raise AssertionError("低于绝对零度必须拒绝")\nprint("__PYPATH_PASS__")`,
    hints: ['__init__ 先用 is_valid 校验，再保存 float。', '华氏度 = 摄氏度 * 9 / 5 + 32。', 'from_fahrenheit 用 cls((value - 32) * 5 / 9)。'],
  }],
  'files-os': [{
    id: 'drill', title: '文件接口转换器', brief: '接收类似文件的输入输出对象，逐行清洗非空文本并写入带序号结果。',
    starterCode: `from io import StringIO\n\ndef transform_stream(source, target):\n    # TODO：返回写入的有效行数\n    pass`, sampleInput: '', mode: 'function',
    testCode: `\nsource = StringIO("  Python  \\n\\n算法\\n")\ntarget = StringIO()\nassert transform_stream(source, target) == 2\nassert target.getvalue() == "1: Python\\n2: 算法\\n"\nassert transform_stream(StringIO(""), StringIO()) == 0\nprint("__PYPATH_PASS__")`,
    hints: ['可直接 for line in source 逐行读取。', 'strip 后为空就 continue。', '计数加一后用 target.write(...) 写入。'],
  }],
  'builtins-stdlib': [{
    id: 'drill', title: 'Counter 与排序键', brief: '使用 Counter 计数，并用 operator.itemgetter 按次数降序、名称升序排列。',
    starterCode: `from collections import Counter\nfrom operator import itemgetter\n\ndef frequency_table(words):\n    # TODO\n    pass`, sampleInput: '', mode: 'function',
    testCode: `\nassert frequency_table(["py", "web", "py", "api", "web", "py"]) == [("py", 3), ("web", 2), ("api", 1)]\nassert frequency_table([]) == []\nprint("__PYPATH_PASS__")`,
    hints: ['Counter(words).items() 得到 (单词, 次数)。', '可以先按 itemgetter(0) 排名称。', '再用 key=itemgetter(1), reverse=True 稳定排序次数。'],
  }],
  'regular-expressions': [{
    id: 'drill', title: '解析结构化日志行', brief: '用命名分组完整匹配日期、级别与消息，返回字典；格式不符时返回 None。',
    starterCode: `import re\n\nLOG_PATTERN = re.compile(r"TODO")\n\ndef parse_log(line):\n    # TODO\n    pass`, sampleInput: '', mode: 'function',
    testCode: `\nassert parse_log("2026-09-02 [ERROR] connection lost") == {"date": "2026-09-02", "level": "ERROR", "message": "connection lost"}\nassert parse_log("2026-01-01 [info] ready") == {"date": "2026-01-01", "level": "INFO", "message": "ready"}\nassert parse_log("not a log") is None\nprint("__PYPATH_PASS__")`,
    hints: ['用 ^ 和 $ 限定整行。', '日期可写 \\d{4}-\\d{2}-\\d{2}，级别放入方括号。', '匹配后 groupdict()，再把 level.upper()。'],
  }],
  'data-formats': [{
    id: 'drill', title: '生成 Markdown 表格', brief: '把记录转换成稳定 Markdown；同时说明为什么不能对陌生字节调用 pickle.loads。',
    starterCode: `def markdown_table(records):\n    # TODO：列固定为 name 和 score\n    pass`, sampleInput: '', mode: 'function',
    testCode: `\nassert markdown_table([{"name": "Ada", "score": 95}, {"name": "Lin", "score": 88}]) == "| name | score |\\n| --- | --- |\\n| Ada | 95 |\\n| Lin | 88 |"\nassert markdown_table([]) == "| name | score |\\n| --- | --- |"\nprint("__PYPATH_PASS__")`,
    hints: ['先建立表头和分隔行列表。', '逐条 append(f"| {name} | {score} |")。', '最后用 "\\n".join(lines)；不要反序列化任何不可信 pickle。'],
  }],
  'system-process-logging': [{
    id: 'drill', title: '解释子进程结果', brief: '把 argv、退出码、stdout/stderr 转成结构化摘要，失败时保留诊断。',
    starterCode: `def process_result(argv, returncode, stdout="", stderr=""):\n    # TODO\n    pass`, sampleInput: '', mode: 'function',
    testCode: `\nassert process_result(["python", "job.py"], 0, " done \\n") == {"command": ["python", "job.py"], "ok": True, "output": "done", "error": ""}\nassert process_result(["tool"], 2, "", " bad ") == {"command": ["tool"], "ok": False, "output": "", "error": "bad"}\nprint("__PYPATH_PASS__")`,
    hints: ['复制 argv，避免暴露后续修改。', 'returncode == 0 表示成功。', 'stdout 和 stderr 都 strip()。'],
  }],
  concurrency: [{
    id: 'drill', title: '带锁计数器', brief: '用 threading.Lock 保护读改写临界区；练习在单线程中也可稳定评测。',
    starterCode: `from threading import Lock\n\nclass SafeCounter:\n    def __init__(self):\n        self.value = 0\n        self._lock = Lock()\n\n    def increment(self, amount=1):\n        # TODO\n        pass`, sampleInput: '', mode: 'function',
    testCode: `\ncounter = SafeCounter()\nassert counter.increment() == 1\nassert counter.increment(4) == 5\nassert counter.value == 5\nprint("__PYPATH_PASS__")`,
    hints: ['使用 with self._lock: 进入临界区。', '在锁内更新 self.value。', '返回更新后的值。'],
  }],
  'network-http': [{
    id: 'drill', title: 'URL 参数编码器', brief: '用 urllib.parse 安全合并查询参数，保留已有参数并正确编码中文与空格。',
    starterCode: `from urllib.parse import parse_qsl, urlencode, urlsplit, urlunsplit\n\ndef with_query(url, **params):\n    # TODO\n    pass`, sampleInput: '', mode: 'function',
    testCode: `\nassert with_query("https://example.test/search?page=1", q="Python 基础", page=2) == "https://example.test/search?page=2&q=Python+%E5%9F%BA%E7%A1%80"\nassert with_query("https://example.test/path") == "https://example.test/path"\nprint("__PYPATH_PASS__")`,
    hints: ['urlsplit 拆分 URL，parse_qsl 读取已有查询。', '更新字典后用 sorted(items) 保持稳定顺序。', 'urlunsplit 重新组合各部分。'],
  }],
  'email-cgi': [{
    id: 'drill', title: '带附件的报告邮件', brief: '构造 EmailMessage，加入文本正文和 UTF-8 CSV 附件；不发送网络请求。',
    starterCode: `from email.message import EmailMessage\n\ndef report_email(recipient, csv_text):\n    # TODO\n    pass`, sampleInput: '', mode: 'function',
    testCode: `\nmessage = report_email("learner@example.com", "name,score\\nAda,95\\n")\nassert message["To"] == "learner@example.com"\nassert message["Subject"] == "PyPath 学习报告"\nassert message.is_multipart()\nattachment = list(message.iter_attachments())[0]\nassert attachment.get_filename() == "report.csv"\nassert attachment.get_content().strip() == "name,score\\nAda,95"\nprint("__PYPATH_PASS__")`,
    hints: ['设置 To、Subject，再 set_content 写正文。', 'add_attachment 接收 csv_text.encode("utf-8")。', 'maintype="text"、subtype="csv"、filename="report.csv"。'],
  }],
  databases: [{
    id: 'drill', title: '分页查询计划', brief: '为 MySQL 和 MongoDB 生成等价的过滤、排序与分页参数，不执行真实查询。',
    starterCode: `def page_plan(min_score, page=1, page_size=20):\n    # TODO\n    pass`, sampleInput: '', mode: 'function',
    testCode: `\nassert page_plan(80, 2, 10) == {\n    "mysql": {"sql": "SELECT name, score FROM students WHERE score >= %s ORDER BY score DESC LIMIT %s OFFSET %s", "params": (80, 10, 10)},\n    "mongo": {"filter": {"score": {"$gte": 80}}, "sort": [("score", -1)], "skip": 10, "limit": 10},\n}\nfor args in [(80, 0, 10), (80, 1, 0)]:\n    try:\n        page_plan(*args)\n    except ValueError:\n        pass\n    else:\n        raise AssertionError("页码与页大小必须为正")\nprint("__PYPATH_PASS__")`,
    hints: ['offset = (page - 1) * page_size。', 'SQL 的值都放 params，不拼接。', 'MongoDB 用 $gte、skip 与 limit 表达相同边界。'],
  }],
  'web-scraping': [{
    id: 'drill', title: '采集管道清洗器', brief: '模拟 Scrapy Item Pipeline：清洗字段、丢弃无标题项、按 URL 去重。',
    starterCode: `def clean_scraped_items(items):\n    # TODO\n    pass`, sampleInput: '', mode: 'function',
    testCode: `\nitems = [\n    {"title": "  Python 入门 ", "url": "/python", "status": 200},\n    {"title": "重复", "url": "/python", "status": 200},\n    {"title": "", "url": "/empty", "status": 200},\n    {"title": "失败", "url": "/bad", "status": 500},\n]\nassert clean_scraped_items(items) == [{"title": "Python 入门", "url": "/python"}]\nassert clean_scraped_items([]) == []\nprint("__PYPATH_PASS__")`,
    hints: ['只保留 status == 200 且 title.strip() 非空。', '用 seen 集合按 url 去重。', '输出只包含清洗后的 title 与 url。'],
  }],
  'gui-charts': [{
    id: 'drill', title: '迷你信号槽', brief: '实现一个纯 Python Signal，模拟 PyQt 的 connect/emit，并避免重复连接。',
    starterCode: `class Signal:\n    def __init__(self):\n        self._slots = []\n\n    def connect(self, slot):\n        # TODO\n        pass\n\n    def emit(self, *args, **kwargs):\n        # TODO\n        pass`, sampleInput: '', mode: 'function',
    testCode: `\nevents = []\nsignal = Signal()\ndef record(value):\n    events.append(value)\nsignal.connect(record)\nsignal.connect(record)\nassert signal.emit("clicked") == [None]\nassert events == ["clicked"]\nprint("__PYPATH_PASS__")`,
    hints: ['slot 不在 _slots 时才 append。', 'emit 依次调用每个 slot。', '把每次调用的返回值收集到列表并返回。'],
  }],
  'ai-apis': [{
    id: 'drill', title: '校验工具调用', brief: '验证 AI 返回的工具名与参数结构，只允许白名单操作进入执行队列。',
    starterCode: `def validate_tool_call(call, allowed_tools):\n    # TODO\n    pass`, sampleInput: '', mode: 'function',
    testCode: `\nassert validate_tool_call({"name": "lookup", "arguments": {"topic": "generator"}}, {"lookup"}) == ("lookup", {"topic": "generator"})\nfor call in [{"name": "delete", "arguments": {}}, {"name": "lookup", "arguments": "bad"}, {}]:\n    try:\n        validate_tool_call(call, {"lookup"})\n    except ValueError:\n        pass\n    else:\n        raise AssertionError("非法工具调用必须拒绝")\nprint("__PYPATH_PASS__")`,
    hints: ['先确认 call 是字典。', 'name 必须是字符串且在 allowed_tools 中。', 'arguments 必须是字典，返回前复制一份。'],
  }],
  'quantitative-python': [{
    id: 'drill', title: '均线交叉信号', brief: '只使用当日及以前数据计算短长均线，产生 buy、sell 或 hold 信号。',
    starterCode: `def moving_average_signals(prices, short_window, long_window):\n    # TODO\n    pass`, sampleInput: '', mode: 'function',
    testCode: `\nassert moving_average_signals([5, 4, 3, 4, 6], 2, 3) == ["hold", "hold", "buy"]\nassert moving_average_signals([3, 4, 5, 4, 2], 2, 3) == ["hold", "hold", "sell"]\ntry:\n    moving_average_signals([1, 2], 3, 2)\nexcept ValueError:\n    pass\nelse:\n    raise AssertionError("短窗口必须小于长窗口且数据足够")\nprint("__PYPATH_PASS__")`,
    hints: ['从 long_window - 1 开始才有两条均线。', '比较当前短均线和长均线，并与前一日关系对照。', '从下方穿到上方是 buy，从上方穿到下方是 sell。'],
  }],
};
