import { foundationChapterCatalog, type FoundationGroup } from './foundation-catalog';

export type ExerciseCase = {
  input: string;
  expected: string;
};

type FoundationExerciseBase = {
  title: string;
  brief: string;
  starterCode: string;
  sampleInput: string;
  hints: string[];
};

export type FoundationExercise = FoundationExerciseBase & (
  | { mode: 'stdout'; cases: ExerciseCase[]; testCode?: never }
  | { mode: 'function'; testCode: string; cases?: never }
);

export type FoundationChapter = {
  id: string;
  number: string;
  shortTitle: string;
  title: string;
  kicker: string;
  minutes: number;
  group: FoundationGroup;
  description: string;
  knowledge: string[];
  example: { title: string; code: string };
  exercise: FoundationExercise;
};

const foundationChapterDrafts: FoundationChapter[] = [
  {
    id: 'first-program',
    number: '01',
    shortTitle: '语法起跑线',
    title: '让 Python 开口',
    kicker: '语法 · 注释 · 变量 · 输入输出',
    minutes: 28,
    group: '基础语法',
    description: '把程序想成一张从上到下执行的任务单：注释写给人看，变量给数据贴标签，输入和输出让程序与人对话。这里把最细碎的入门知识合成一章。',
    knowledge: ['关键字有固定含义；标识符遵守命名规则，缩进划分代码块', '#、多行说明与 docstring 分别承担不同层次的注释职责', '赋值和多变量解包让名称引用 int、float、str、bool 与 None 等值', 'input() 得到字符串，print() 支持 sep、end 与格式化输出', 'type() 查看类型，int()、float()、str()、bool() 完成显式转换'],
    example: {
      title: '让变量替你记住信息',
      code: `name = "小派"\ndays = 7\nprint(f"{name} 已学习 {days} 天")\nprint(type(days).__name__)`,
    },
    exercise: {
      title: '制作学习卡',
      brief: '读取姓名和学习天数，完成类型转换、布尔判断和格式化输出；标点与空格也要一致。',
      starterCode: `name = input().strip()\nraw_days = input()\n\n# TODO：把 raw_days 转成整数，并判断是否少于 30 天\ndays = 0\nis_beginner = False\n\nprint(f"你好，{name}！")\nprint(f"学习天数：{days}；新手阶段：{is_beginner}")`,
      sampleInput: '小派\n7',
      mode: 'stdout',
      cases: [
        { input: '小派\n7', expected: '你好，小派！\n学习天数：7；新手阶段：True' },
        { input: 'Ada\n45', expected: '你好，Ada！\n学习天数：45；新手阶段：False' },
      ],
      hints: ['input() 的结果是 str，用 int(raw_days) 转换。', '少于 30 天可写成 days < 30。', 'f-string 会把变量值嵌进花括号位置。'],
    },
  },
  {
    id: 'numbers-strings',
    number: '02',
    shortTitle: '数字与文本',
    title: '数字与文本加工厂',
    kicker: '数字 · 运算 · 转换 · 字符串',
    minutes: 34,
    group: '基础语法',
    description: '收据、温度和用户名，本质上都是数字与文本的加工。掌握转换、计算和格式化，就能把原始输入变成整洁结果。',
    knowledge: ['int、float、complex、bool 与 bytes 表达不同种类的值', '+ - * / // % **、位运算与运算优先级', '比较、赋值、逻辑、成员和身份运算符回答不同问题，:= 可在表达式中绑定值', '字符串不可变，索引、切片、转义、原始/三引号字符串与 Unicode 负责文本表达', 'f-string、format() 与常用字符串方法控制加工、对齐、宽度和小数位'],
    example: {
      title: '把原始价格变成收据',
      code: `price = 12.5\nquantity = 2\ntotal = price * quantity\nprint(f"咖啡 x {quantity}")\nprint(f"合计：{total:.2f} 元")`,
    },
    exercise: {
      title: '打印简易收据',
      brief: '依次读取商品名、单价和数量，算出总价并按两位小数输出。',
      starterCode: `item = input().strip()\nprice = float(input())\nquantity = int(input())\n\n# TODO：计算总价\ntotal = 0.0\n\nprint(f"{item} x {quantity}")\nprint(f"合计：{total:.2f} 元")`,
      sampleInput: '咖啡\n12.5\n2',
      mode: 'stdout',
      cases: [
        { input: '咖啡\n12.5\n2', expected: '咖啡 x 2\n合计：25.00 元' },
        { input: '笔记本\n6\n3', expected: '笔记本 x 3\n合计：18.00 元' },
      ],
      hints: ['总价等于单价乘以数量。', 'price 是浮点数，quantity 是整数。', ':.2f 会把数字显示为两位小数。'],
    },
  },
  {
    id: 'conditions',
    number: '03',
    shortTitle: '条件分支',
    title: '程序的岔路口',
    kicker: '比较 · 布尔值 · 条件控制',
    minutes: 28,
    group: '基础语法',
    description: '订单够不够免邮、用户是不是会员，都会改变下一步。条件语句让代码像一个清醒的岔路管理员，根据事实选择道路。',
    knowledge: ['== != < <= > >= 用来比较，in 检查成员关系', 'and、or、not 会短路计算并组合多个条件', 'if / elif / else 从上到下匹配一次', 'match / case 适合按清晰的结构或离散值分派', '嵌套条件与边界值往往是最容易写错的地方'],
    example: {
      title: '先处理最宽的规则',
      code: `amount = 120\nis_member = False\nif amount >= 99:\n    fee = 0\nelif is_member:\n    fee = 6\nelse:\n    fee = 10\nprint(fee)`,
    },
    exercise: {
      title: '计算运费',
      brief: '订单不少于 99 元免邮；否则会员 6 元，非会员 10 元。第二行输入 y 或 n。',
      starterCode: `amount = float(input())\nis_member = input().strip().lower() == "y"\n\nfee = 0.0\n\n# TODO：根据规则设置 fee\n\nprint(f"{fee:.2f}")`,
      sampleInput: '50\ny',
      mode: 'stdout',
      cases: [
        { input: '120\nn', expected: '0.00' },
        { input: '99\nn', expected: '0.00' },
        { input: '50\ny', expected: '6.00' },
        { input: '50\nn', expected: '10.00' },
      ],
      hints: ['先判断覆盖所有用户的免邮规则。', '第二个分支只需判断 is_member。', '金额恰好为 99 元也应该免邮。'],
    },
  },
  {
    id: 'containers',
    number: '04',
    shortTitle: '数据容器',
    title: '数据收纳盒',
    kicker: '列表 · 元组 · 字典 · 集合',
    minutes: 38,
    group: '基础语法',
    description: '一个变量像单独的抽屉，容器则像整套收纳柜。列表、元组、字典和集合各有脾气，选对容器能让数据井然有序。',
    knowledge: ['列表有顺序、可修改，支持索引和切片', '元组不可变，适合表达一组固定值', '字典用 key 快速找到 value', '集合擅长去重和成员判断', 'len、sum、min、max、sorted 适用于许多容器'],
    example: {
      title: '同一批数据的不同视角',
      code: `tags = ["python", "web", "python"]\nunique = set(tags)\ncounts = {tag: tags.count(tag) for tag in unique}\nprint(sorted(unique))\nprint(counts["python"])`,
    },
    exercise: {
      title: '整理课程目录',
      brief: '输入由 (课程名, 分类) 元组组成的列表，综合使用列表、元组、字典和集合返回稳定摘要。',
      starterCode: `def summarize_courses(entries):\n    """返回 names、categories 和 counts 三项摘要。"""\n    # TODO\n    pass`,
      sampleInput: '',
      mode: 'function',
      testCode: `\nassert summarize_courses([("Python", "code"), ("算法", "code"), ("写作", "life"), ("Python", "code")]) == {\n    "names": ["Python", "算法", "写作"],\n    "categories": ["code", "life"],\n    "counts": {"code": 3, "life": 1},\n}\nassert summarize_courses([]) == {"names": [], "categories": [], "counts": {}}\nprint("__PYPATH_PASS__")`,
      hints: ['用列表保存遇到的课程名，用集合判断是否重复。', '元组可以直接拆包：for name, category in entries。', '字典计数可用 counts.get(category, 0) + 1。'],
    },
  },
  {
    id: 'loops',
    number: '05',
    shortTitle: '循环',
    title: '重复任务流水线',
    kicker: 'for · while · break · continue',
    minutes: 34,
    group: '基础语法',
    description: '重复敲十遍代码会变成苦差事，循环则像自动流水线：逐项加工、不断计数，直到每一件原料都处理完成。',
    knowledge: ['for 遍历字符串、列表和字典', 'range() 生成有规律的整数序列', 'while 在条件成立时持续运行', 'break 结束循环，continue 跳过本轮', '循环常与累加器和计数字典搭配'],
    example: {
      title: '边走边记录',
      code: `scores = [80, 65, 92]\ntotal = 0\nfor score in scores:\n    total += score\nprint(total / len(scores))`,
    },
    exercise: {
      title: '清洗传感器读数',
      brief: '用 while 逐项读取：负数跳过，None 立即停止，收集到 limit 个有效值也停止。',
      starterCode: `def collect_readings(readings, limit):\n    accepted = []\n    index = 0\n    # TODO：使用 while、continue 与 break\n    return accepted`,
      sampleInput: '',
      mode: 'function',
      testCode: `\nassert collect_readings([-1, 8, 9, None, 10], 5) == [8, 9]\nassert collect_readings([1, 2, 3, 4], 2) == [1, 2]\nassert collect_readings([None, 3], 2) == []\nassert collect_readings([], 3) == []\nprint("__PYPATH_PASS__")`,
      hints: ['条件可以写成 index < len(readings) 且 len(accepted) < limit。', '每轮先取当前值并让 index 加一，避免 continue 时原地打转。', '遇到 None 用 break，负数用 continue。'],
    },
  },
  {
    id: 'functions',
    number: '06',
    shortTitle: '函数',
    title: '把代码装进工具箱',
    kicker: '参数 · return · 作用域',
    minutes: 38,
    group: '基础语法',
    description: '函数像可以反复使用的小工具：给它材料，它交回结果。把逻辑封装好，程序会更短、更清晰，也更容易测试。',
    knowledge: ['def 定义函数，return 把结果交回调用处', '必需、默认、关键字、仅位置与仅关键字参数控制调用方式', '*args 收集额外位置参数，**kwargs 收集额外关键字参数', 'lambda 适合简短表达式，普通 def 更适合复杂逻辑', 'LEGB 描述名字查找，global 与 nonlocal 应谨慎使用'],
    example: {
      title: '输入、处理、返回',
      code: `def discounted(price, rate=0.9):\n    return round(price * rate, 2)\n\nresult = discounted(120)\nprint(result)`,
    },
    exercise: {
      title: '计算订单实付金额',
      brief: '先求价格之和，再应用折扣并加运费，最终四舍五入到两位小数。',
      starterCode: `def calculate_order(prices, discount=1.0, shipping=0.0):\n    """返回订单的最终实付金额。"""\n    # TODO\n    pass`,
      sampleInput: '',
      mode: 'function',
      testCode: `\nassert calculate_order([12.5, 7.5]) == 20.0\nassert calculate_order([100, 50], discount=0.8, shipping=10) == 130.0\nassert calculate_order([], shipping=8) == 8.0\nassert calculate_order([19.9, 5.1], discount=0.9, shipping=3) == 25.5\nprint("__PYPATH_PASS__")`,
      hints: ['sum(prices) 可以得到商品小计。', '先乘折扣，再加运费。', '使用 round(result, 2) 返回两位精度的结果。'],
    },
  },
  {
    id: 'python-tools',
    number: '07',
    shortTitle: '推导与结构',
    title: 'Python 的快捷通道',
    kicker: '推导式 · zip · 数据结构',
    minutes: 36,
    group: '进阶语法',
    description: '熟练的 Python 代码往往不是更花哨，而是善用现成工具。内置函数、推导式和明确的错误能把常见任务表达得又短又安全。',
    knowledge: ['列表、集合、字典推导式与生成器表达式表达映射或筛选', '列表的 append / pop 可模拟栈，collections.deque 适合双端队列', 'enumerate 同时取得序号和值，zip 并行组合多个序列', 'append、extend、del、sort 与切片组合常见数据结构操作', 'any、all、sorted、reversed 是常见聚合与遍历工具'],
    example: {
      title: '把两个列表配对筛选',
      code: `names = ["Ada", "Bob", "Cyd"]\nscores = [95, 79, 80]\npassed = [name for name, score in zip(names, scores) if score >= 80]\nprint(passed)`,
    },
    exercise: {
      title: '筛选合格学员',
      brief: '数量不一致时抛出 ValueError；否则返回达到分数线的姓名并排序。',
      starterCode: `def qualified_students(names, scores, pass_mark=60):\n    # TODO\n    pass`,
      sampleInput: '',
      mode: 'function',
      testCode: `\nassert qualified_students(["Lin", "Qing", "Zhou"], [58, 90, 60]) == ["Qing", "Zhou"]\nassert qualified_students(["Ada", "Bob", "Cyd"], [95, 79, 80], pass_mark=80) == ["Ada", "Cyd"]\nassert qualified_students([], []) == []\ntry:\n    qualified_students(["Ada"], [90, 80])\nexcept ValueError:\n    pass\nelse:\n    raise AssertionError("数量不一致时必须抛出 ValueError")\nprint("__PYPATH_PASS__")`,
      hints: ['先用 len() 检查两个列表是否等长。', 'zip(names, scores) 会产生姓名和成绩配对。', '可以先用列表推导式筛选，再用 sorted() 排序。'],
    },
  },
  {
    id: 'standard-library',
    number: '08',
    shortTitle: '数值工具箱',
    title: '可靠计算的积木',
    kicker: 'datetime · math · random · statistics',
    minutes: 36,
    group: '进阶语法',
    description: '你不必亲手制造每个齿轮。Python 标准库已经备好日期、数学、统计和随机工具，学会导入模块就能用可靠积木解决真实问题。',
    knowledge: ['import module 与 from module import name 引入标准库能力', 'math 提供取整、幂、三角函数和数学常量', 'time、calendar、datetime、timedelta 与时区负责时间戳、格式和日期运算', 'statistics 提供均值、中位数、众数与离散程度', 'random.Random(seed) 生成可复现的伪随机结果，不应用于密码'],
    example: {
      title: '让日期自己向前走',
      code: `from datetime import date, timedelta\nstart = date.fromisoformat("2026-09-01")\nfinish = start + timedelta(days=3)\nprint(finish.isoformat())`,
    },
    exercise: {
      title: '估算课程完成日期',
      brief: '开始日期算第 1 个学习日；无效课数或每日数量需要抛出 ValueError。',
      starterCode: `import math\nfrom datetime import date, timedelta\n\ndef estimate_finish(start_date, lesson_count, lessons_per_day):\n    # TODO\n    pass`,
      sampleInput: '',
      mode: 'function',
      testCode: `\nassert estimate_finish("2026-09-01", 10, 3) == "2026-09-04"\nassert estimate_finish("2024-02-28", 2, 1) == "2024-02-29"\nassert estimate_finish("2026-09-01", 0, 3) == "2026-09-01"\nfor args in [("2026-09-01", -1, 3), ("2026-09-01", 5, 0)]:\n    try:\n        estimate_finish(*args)\n    except ValueError:\n        pass\n    else:\n        raise AssertionError("无效参数必须抛出 ValueError")\nprint("__PYPATH_PASS__")`,
      hints: ['学习天数可用 math.ceil(lesson_count / lessons_per_day) 计算。', 'date.fromisoformat() 可以把字符串变成日期。', '开始日算第 1 天，所以结束日期增加 study_days - 1 天。'],
    },
  },
  {
    id: 'iterators-generators',
    number: '09',
    shortTitle: '惰性序列',
    title: '一件一件送上流水线',
    kicker: '迭代器 · 生成器 · yield',
    minutes: 38,
    group: '进阶语法',
    description: '列表像把所有货物一次搬进仓库，生成器则像传送带：需要下一件时才生产下一件。面对大数据流时，这种惰性让内存更从容。',
    knowledge: ['可迭代对象通过 iter() 交出迭代器', 'next() 逐项取值，耗尽时触发 StopIteration', '实现 __iter__ 与 __next__ 可以创建自定义迭代器', '含 yield 的函数会返回生成器并暂停现场', '生成器表达式适合一次性、惰性的转换流水线'],
    example: {
      title: '倒计时不会提前生成全部数字',
      code: `def countdown(start):\n    while start > 0:\n        yield start\n        start -= 1\n\nfor value in countdown(3):\n    print(value)`,
    },
    exercise: {
      title: '分批送出数据',
      brief: '实现生成器 chunked：按 size 逐批 yield 元组；size 非正数时抛出 ValueError。',
      starterCode: `def chunked(items, size):\n    # TODO：这是生成器，不要一次返回全部批次\n    pass`,
      sampleInput: '',
      mode: 'function',
      testCode: `\nresult = chunked([1, 2, 3, 4, 5], 2)\nassert iter(result) is result\nassert list(result) == [(1, 2), (3, 4), (5,)]\nassert list(chunked([], 3)) == []\ntry:\n    list(chunked([1], 0))\nexcept ValueError:\n    pass\nelse:\n    raise AssertionError("size 非正数时必须抛出 ValueError")\nprint("__PYPATH_PASS__")`,
      hints: ['先检查 size，再用 range(0, len(items), size) 产生起点。', 'items[start:start + size] 可以切出一批。', 'yield tuple(...) 会暂停函数并保留现场。'],
    },
  },
  {
    id: 'context-decorators',
    number: '10',
    shortTitle: '上下文与装饰器',
    title: '给代码加上自动开关',
    kicker: 'with · 上下文管理器 · 装饰器',
    minutes: 44,
    group: '进阶语法',
    description: '上下文管理器负责可靠地“打开再关闭”，装饰器负责不改函数主体就包上一层能力。它们像门禁和外套，把重复的前后处理集中到一个地方。',
    knowledge: ['with 会调用 __enter__ / __exit__，即使异常也执行退出逻辑', 'contextlib.contextmanager 用一次 yield 划分进入与退出阶段', '装饰器接收函数并返回新的可调用对象', '闭包保存外层状态，functools.wraps 保留原函数信息', '装饰器可以带参数、堆叠，也可以由类实现'],
    example: {
      title: '进入和离开都留下记录',
      code: `from contextlib import contextmanager\n\n@contextmanager\ndef session(log):\n    log.append("open")\n    try:\n        yield\n    finally:\n        log.append("close")`,
    },
    exercise: {
      title: '可计数函数与安全会话',
      brief: '完成 count_calls 装饰器和 tracked_session 上下文管理器，保证调用计数与关闭动作可靠发生。',
      starterCode: `from contextlib import contextmanager\nfrom functools import wraps\n\ndef count_calls(func):\n    # TODO\n    pass\n\n@contextmanager\ndef tracked_session(events):\n    # TODO：进入时记录 open，退出时始终记录 close\n    pass`,
      sampleInput: '',
      mode: 'function',
      testCode: `\n@count_calls\ndef add(a, b):\n    return a + b\nassert add(2, 3) == 5\nassert add(4, 1) == 5\nassert add.call_count == 2\nassert add.__name__ == "add"\nevents = []\nwith tracked_session(events):\n    events.append("work")\nassert events == ["open", "work", "close"]\ntry:\n    with tracked_session(events):\n        raise RuntimeError("boom")\nexcept RuntimeError:\n    pass\nassert events[-2:] == ["open", "close"]\nprint("__PYPATH_PASS__")`,
      hints: ['wrapper 内先让 wrapper.call_count += 1，再调用原函数。', '用 @wraps(func) 保留函数名称。', '上下文管理器在 try 中 yield，在 finally 中追加 close。'],
    },
  },
  {
    id: 'modules-typing',
    number: '11',
    shortTitle: '模块与类型',
    title: '把程序拆成可读零件',
    kicker: '模块 · __name__ · 类型注解',
    minutes: 38,
    group: '进阶语法',
    description: '模块像一本工具手册的章节，包像装着多本手册的书架。类型注解再给接口贴上说明牌，让调用者在运行前就看懂材料和产物。',
    knowledge: ['import、from ... import 与别名决定名字如何进入当前模块', '模块搜索路径、dir() 和包的层级帮助定位能力', '__name__ == "__main__" 区分直接运行与被导入', '函数、变量、容器与返回值都可以添加类型注解', 'T | None、联合类型与类型别名能表达更真实的接口'],
    example: {
      title: '入口只在直接运行时执行',
      code: `def greet(name: str | None = None) -> str:\n    return f"你好，{name or '学习者'}"\n\nif __name__ == "__main__":\n    print(greet())`,
    },
    exercise: {
      title: '带类型说明的排行榜',
      brief: '补全带注解函数，过滤无效记录，按分数降序、姓名升序返回前 limit 名。',
      starterCode: `def format_leaderboard(\n    records: list[dict[str, object]],\n    limit: int = 3,\n) -> list[str]:\n    # TODO\n    pass`,
      sampleInput: '',
      mode: 'function',
      testCode: `\nrecords = [\n    {"name": "Ada", "score": 92},\n    {"name": "Lin", "score": 92},\n    {"name": "Bo", "score": 70},\n    {"name": "", "score": 100},\n]\nassert format_leaderboard(records, 2) == ["Ada:92", "Lin:92"]\nassert format_leaderboard([], 3) == []\nassert set(format_leaderboard.__annotations__) >= {"records", "limit", "return"}\nprint("__PYPATH_PASS__")`,
      hints: ['先筛选 name 非空且 score 是数字的记录。', '排序键可以返回 (-score, name)。', '用切片 [:limit] 截取，再用 f-string 格式化。'],
    },
  },
  {
    id: 'errors-exceptions',
    number: '12',
    shortTitle: '异常处理',
    title: '为意外准备安全网',
    kicker: 'try · except · else · finally',
    minutes: 36,
    group: '进阶语法',
    description: '异常不是“程序坏了”的同义词，而是一条带类型的求救信号。捕获你能处理的情况，把其余问题继续交给调用者，代码才不会悄悄掩盖错误。',
    knowledge: ['语法错误发生在解析阶段，异常发生在运行阶段', 'try / except 捕获明确类型，避免无差别吞掉问题', 'else 只在没有异常时运行，finally 无论如何都会运行', 'raise 主动拒绝非法状态，异常链保留原始原因', '继承合适的异常类可以定义领域错误'],
    example: {
      title: '只接住能够处理的错误',
      code: `try:\n    age = int("未知")\nexcept ValueError as error:\n    print(f"年龄格式错误：{error}")\nelse:\n    print(age)\nfinally:\n    print("检查结束")`,
    },
    exercise: {
      title: '严格解析成绩',
      brief: '实现 InvalidScore 与 parse_score：格式错误、非有限值和 0～100 之外的值都给出清楚异常。',
      starterCode: `import math\n\nclass InvalidScore(ValueError):\n    pass\n\ndef parse_score(raw):\n    # TODO\n    pass`,
      sampleInput: '',
      mode: 'function',
      testCode: `\nassert parse_score("88.5") == 88.5\nassert parse_score(100) == 100.0\nfor invalid in ["abc", -1, 101, float("nan")]:\n    try:\n        parse_score(invalid)\n    except InvalidScore:\n        pass\n    else:\n        raise AssertionError(f"{invalid!r} 应触发 InvalidScore")\nprint("__PYPATH_PASS__")`,
      hints: ['先在 try 中用 float(raw) 转换，捕获 TypeError 和 ValueError。', '用 math.isfinite(score) 排除 nan 与无穷大。', '所有输入问题都 raise InvalidScore(...)。'],
    },
  },
  {
    id: 'object-oriented',
    number: '13',
    shortTitle: '面向对象',
    title: '让数据和行为住在一起',
    kicker: '类 · 对象 · 继承 · 特殊方法',
    minutes: 50,
    group: '进阶语法',
    description: '类是一张蓝图，对象是照着蓝图建出的实例。把状态和操作状态的方法放在一起，再用继承表达“是一种”，复杂系统会更容易分工。',
    knowledge: ['__init__ 初始化实例，self 指向当前对象', '实例属性、类属性、property、类方法和静态方法职责不同', '继承与 super() 复用父类行为，重写实现多态', '双下划线名称触发名称改写而非绝对私有', '__repr__、__str__、__len__ 等特殊方法接入 Python 语法'],
    example: {
      title: '对象自己维护完成状态',
      code: `class Lesson:\n    def __init__(self, title):\n        self.title = title\n        self.done = False\n\n    def complete(self):\n        self.done = True`,
    },
    exercise: {
      title: '课程对象模型',
      brief: '完成 LearningItem 和 Course：课程继承学习项，可添加课时，并支持 len() 与可读字符串。',
      starterCode: `class LearningItem:\n    def __init__(self, title):\n        self.title = title\n\n    def describe(self):\n        return self.title\n\nclass Course(LearningItem):\n    def __init__(self, title, lessons=None):\n        # TODO\n        pass\n\n    def add_lesson(self, lesson):\n        # TODO\n        pass\n\n    def __len__(self):\n        # TODO\n        pass\n\n    def describe(self):\n        # TODO\n        pass`,
      sampleInput: '',
      mode: 'function',
      testCode: `\ncourse = Course("Python", ["语法"])\nassert isinstance(course, LearningItem)\ncourse.add_lesson("函数")\nassert len(course) == 2\nassert course.describe() == "Python · 2 课时"\nempty = Course("算法")\nassert len(empty) == 0\nassert empty.lessons is not course.lessons\nprint("__PYPATH_PASS__")`,
      hints: ['子类初始化时先调用 super().__init__(title)。', '不要把 [] 直接写成默认参数，可用 lessons or [] 并复制。', 'describe() 可以覆盖父类方法并使用 len(self)。'],
    },
  },
  {
    id: 'files-os',
    number: '14',
    shortTitle: '文件与系统',
    title: '在文件系统中安全行走',
    kicker: 'File · pathlib · OS · StringIO',
    minutes: 46,
    group: '标准库与应用',
    description: '文件系统是一座有层级的仓库。路径负责定位，打开模式决定读写权限，with 确保用完就关；浏览器练习使用隔离的虚拟文件系统，不碰你的真实文件。',
    knowledge: ['open() 的文本/二进制模式、编码和游标决定读写方式', 'with 自动关闭文件，逐行读取适合大文件', 'pathlib 用对象表达拼接、遍历、后缀和相对路径', 'os 提供环境变量、目录、重命名与进程相关信息', '删除和覆盖前先确认精确目标，优先生成可检查的计划'],
    example: {
      title: '递归扫描并稳定排序',
      code: `from pathlib import Path\nroot = Path("notes")\nfiles = sorted(path.relative_to(root) for path in root.rglob("*.txt"))\nfor path in files:\n    print(path)`,
    },
    exercise: {
      title: '生成目录清单',
      brief: '递归扫描目录，忽略隐藏文件，返回按相对路径排序的 path、size 与文本行数。',
      starterCode: `from pathlib import Path\n\ndef folder_manifest(root):\n    # TODO\n    pass`,
      sampleInput: '',
      mode: 'function',
      testCode: `\nimport tempfile\nwith tempfile.TemporaryDirectory() as temporary:\n    root = Path(temporary)\n    (root / "docs").mkdir()\n    (root / "a.txt").write_text("one\\ntwo\\n", encoding="utf-8")\n    (root / "docs" / "b.txt").write_text("three", encoding="utf-8")\n    (root / ".secret").write_text("hidden", encoding="utf-8")\n    assert folder_manifest(root) == [\n        {"path": "a.txt", "size": 8, "lines": 2},\n        {"path": "docs/b.txt", "size": 5, "lines": 1},\n    ]\nprint("__PYPATH_PASS__")`,
      hints: ['用 Path(root).rglob("*") 遍历，并用 is_file() 筛选。', '相对路径任一部分以 . 开头时跳过。', 'size 用 stat().st_size；文本可用 splitlines() 计数。'],
    },
  },
  {
    id: 'builtins-stdlib',
    number: '15',
    shortTitle: '内置与标准库',
    title: '先查工具箱，再造轮子',
    kicker: '内置函数 · operator · sys',
    minutes: 36,
    group: '标准库与应用',
    description: 'Python 自带一面摆满工具的墙：内置函数伸手就能用，标准库按模块分类。先学会辨认工具族，再决定何时组合、何时自己封装。',
    knowledge: ['len、sum、min、max、round 与类型转换处理常见值', 'enumerate、zip、map、filter、sorted、any、all 组织迭代', 'getattr、hasattr、callable 等反射函数要搭配明确边界', 'operator 把运算变成函数，适合排序键和函数式组合', 'glob、shutil、压缩、timeit、doctest 与 unittest 覆盖常见任务'],
    example: {
      title: '用现成积木汇总成绩',
      code: `scores = [72, 91, 85]\nprint(min(scores), max(scores))\nprint(round(sum(scores) / len(scores), 1))\nprint(all(score >= 60 for score in scores))`,
    },
    exercise: {
      title: '通用数值体检',
      brief: '组合内置函数返回数量、范围、均值、是否全为非负数，以及带序号的降序结果。',
      starterCode: `def inspect_numbers(values):\n    # TODO\n    pass`,
      sampleInput: '',
      mode: 'function',
      testCode: `\nassert inspect_numbers([3, 1, 2]) == {\n    "count": 3, "minimum": 1, "maximum": 3, "mean": 2.0,\n    "all_non_negative": True, "ranked": [(1, 3), (2, 2), (3, 1)],\n}\nassert inspect_numbers([]) == {\n    "count": 0, "minimum": None, "maximum": None, "mean": None,\n    "all_non_negative": True, "ranked": [],\n}\nprint("__PYPATH_PASS__")`,
      hints: ['空列表要先单独处理，避免 min/max 报错。', 'sorted(values, reverse=True) 得到降序值。', 'enumerate(..., start=1) 生成从 1 开始的排名。'],
    },
  },
  {
    id: 'regular-expressions',
    number: '16',
    shortTitle: '正则表达式',
    title: '给文本装一台模式雷达',
    kicker: 're · 匹配 · 分组 · 替换',
    minutes: 44,
    group: '标准库与应用',
    description: '正则表达式不是神秘咒语，而是一张描述文本形状的模板。先写清边界和分组，再选择搜索、提取、切分或替换，复杂字符串也能有序处理。',
    knowledge: ['原始字符串 r"..." 避免反斜杠被 Python 先解释', '字符类、量词、锚点、分组与或运算组合模式', 'match、search、fullmatch 的起点和范围不同', 'findall / finditer 提取，split 切分，sub 替换', 'compile 复用模式，flags 控制大小写、多行等行为'],
    example: {
      title: '命名分组让结果自带标签',
      code: `import re\npattern = re.compile(r"(?P<name>[A-Za-z]+):(?P<score>\\d+)")\nmatch = pattern.fullmatch("Ada:95")\nprint(match.groupdict())`,
    },
    exercise: {
      title: '提取并遮盖联系方式',
      brief: '找出文本中的邮箱，返回规范化邮箱列表，并把用户名除首字符外替换为星号。',
      starterCode: `import re\n\ndef mask_emails(text):\n    # TODO\n    pass`,
      sampleInput: '',
      mode: 'function',
      testCode: `\ntext = "联系 Ada@Example.com 或 bo@test.cn；无效 a@x 不算。"\nemails, masked = mask_emails(text)\nassert emails == ["ada@example.com", "bo@test.cn"]\nassert masked == "联系 A**@Example.com 或 b*@test.cn；无效 a@x 不算。"\nassert mask_emails("没有邮箱") == ([], "没有邮箱")\nprint("__PYPATH_PASS__")`,
      hints: ['邮箱模式可限制域名至少包含一个点。', '用 re.compile(..., re.IGNORECASE) 复用同一模式。', 're.sub 的替换参数可以是接收 Match 的函数。'],
    },
  },
  {
    id: 'data-formats',
    number: '17',
    shortTitle: '数据格式',
    title: '让数据跨程序旅行',
    kicker: 'JSON · XML · CSV · Pickle · hashlib',
    minutes: 52,
    group: '标准库与应用',
    description: '同一份数据可以穿不同外衣：CSV 像表格，JSON 像嵌套容器，XML 像带标签的树。格式转换的关键是先定结构，再处理编码、类型和不可信输入。',
    knowledge: ['json 在 Python 容器与文本之间转换，注意 ensure_ascii 与数值类型', 'csv.DictReader / DictWriter 按列名读写表格', 'ElementTree 适合常见 XML 树，SAX 适合流式处理，DOM 保留完整树', 'StringIO 包装字符串文件接口，Markdown 表达轻量标记，hashlib 计算内容摘要', 'pickle 保留 Python 对象但绝不能加载不可信数据'],
    example: {
      title: 'CSV 读入后输出稳定 JSON',
      code: `import csv, json\nfrom io import StringIO\nrows = list(csv.DictReader(StringIO("name,score\\nAda,95")))\nprint(json.dumps(rows, ensure_ascii=False))`,
    },
    exercise: {
      title: '一次转换三种格式',
      brief: '读取 CSV 文本，转换数值类型，并返回稳定 JSON、XML 与 JSON 内容的 SHA-256。',
      starterCode: `import csv\nimport hashlib\nimport json\nfrom io import StringIO\nfrom xml.etree.ElementTree import Element, SubElement, tostring\n\ndef convert_scores(csv_text):\n    # TODO\n    pass`,
      sampleInput: '',
      mode: 'function',
      testCode: `\nsource = "name,score\\nAda,95\\nLin,88\\n"\njson_text, xml_text, digest = convert_scores(source)\nassert json.loads(json_text) == [{"name": "Ada", "score": 95}, {"name": "Lin", "score": 88}]\nassert json_text == '[{"name": "Ada", "score": 95}, {"name": "Lin", "score": 88}]'\nassert xml_text == '<scores><student name="Ada" score="95" /><student name="Lin" score="88" /></scores>'\nassert digest == hashlib.sha256(json_text.encode("utf-8")).hexdigest()\nassert convert_scores("name,score\\n")[0] == "[]"\nprint("__PYPATH_PASS__")`,
      hints: ['DictReader 可直接读取 StringIO(csv_text)。', '把 score 转为 int，再分别生成 JSON 与 XML。', '用 hashlib.sha256(json_text.encode("utf-8")).hexdigest() 生成摘要。'],
    },
  },
  {
    id: 'system-process-logging',
    number: '18',
    shortTitle: '进程与日志',
    title: '观察并调度外部程序',
    kicker: 'sys · subprocess · logging',
    minutes: 44,
    group: '标准库与应用',
    description: 'sys 让程序看见自己的运行现场，subprocess 安全地安排外部程序，logging 则留下可筛选的航行记录。浏览器练习只构造命令与日志，不启动真实进程。',
    knowledge: ['sys.argv、标准输入输出、版本与退出码描述运行时', 'subprocess.run 优先接收参数列表，并设置 check、timeout 与文本模式', '不要把不可信字符串拼进 shell=True 命令', '日志按 DEBUG 到 CRITICAL 分级，由 Logger、Handler、Formatter 协作', '生产日志应包含上下文并支持文件轮转，避免 print 到处散落'],
    example: {
      title: '命令参数保持为列表',
      code: `import subprocess\nimport sys\n\nresult = subprocess.run(\n    [sys.executable, "--version"],\n    capture_output=True, text=True, timeout=3, check=True,\n)`,
    },
    exercise: {
      title: '安全命令计划与结构化日志',
      brief: '不执行命令：构造 argv 列表，并把事件格式化成 level|message 的日志行，过滤 DEBUG。',
      starterCode: `import sys\n\ndef command_plan(script, files):\n    # TODO：返回参数列表，不能拼成 shell 字符串\n    pass\n\ndef format_logs(events):\n    # events 是 (level, message) 元组列表\n    # TODO：保留 INFO/WARNING/ERROR/CRITICAL\n    pass`,
      sampleInput: '',
      mode: 'function',
      testCode: `\nassert command_plan("report.py", ["a.csv", "name with space.csv"]) == [\n    sys.executable, "report.py", "--input", "a.csv", "--input", "name with space.csv"\n]\nassert format_logs([("DEBUG", "细节"), ("INFO", "启动"), ("ERROR", "失败")]) == ["INFO|启动", "ERROR|失败"]\nassert format_logs([]) == []\nprint("__PYPATH_PASS__")`,
      hints: ['argv 从 [sys.executable, script] 开始。', '为每个文件 extend(["--input", file])。', '建立日志级别数字映射，只保留不低于 INFO 的事件。'],
    },
  },
  {
    id: 'concurrency',
    number: '19',
    shortTitle: '并发编程',
    title: '让多个任务协调前进',
    kicker: 'threading · queue · asyncio',
    minutes: 54,
    group: '标准库与应用',
    description: '并发不是让一件事凭空变快，而是让等待中的任务把舞台让给别的任务。线程、队列和协程选择不同的协调方式，共同目标都是清晰的所有权与结束条件。',
    knowledge: ['线程适合许多阻塞 I/O；默认启用 GIL 的 CPython 中，CPU 密集任务通常更适合多进程', 'Lock、Event、Condition 保护共享状态并传递信号', 'Queue、LifoQueue、PriorityQueue 安全交接任务', 'async def 定义协程，await 主动让出执行权', 'Task、gather、timeout 与取消构成异步任务生命周期'],
    example: {
      title: '协程在等待处交还控制权',
      code: `import asyncio\n\nasync def double(value):\n    await asyncio.sleep(0)\n    return value * 2\n\nasync def main():\n    print(await asyncio.gather(double(2), double(3)))`,
    },
    exercise: {
      title: '异步批处理与优先队列',
      brief: '实现异步 process_all，并用 PriorityQueue 让更小优先级数字先出队。',
      starterCode: `import asyncio\nfrom queue import PriorityQueue\n\nasync def process_all(values):\n    # TODO：并发执行，而不是逐个 await\n    pass\n\ndef prioritize_jobs(jobs):\n    # jobs 是 (priority, name) 元组\n    # TODO\n    pass`,
      sampleInput: '',
      mode: 'function',
      testCode: `\nasync def _double(value):\n    await asyncio.sleep(0)\n    return value * 2\n\nglobals()["_double"] = _double\nassert await process_all([3, 1, 2]) == [6, 2, 4]\nassert prioritize_jobs([(3, "docs"), (1, "bug"), (2, "test")]) == ["bug", "test", "docs"]\nprint("__PYPATH_PASS__")`,
      hints: ['为每个 value 创建 _double(value) 协程，再交给 asyncio.gather。', 'gather 会按传入顺序返回结果。', 'PriorityQueue.put((priority, name)) 后循环 get() 直到 empty()。'],
    },
  },
  {
    id: 'network-http',
    number: '20',
    shortTitle: '网络与 HTTP',
    title: '把请求送到另一台机器',
    kicker: 'socket · urllib · requests',
    minutes: 50,
    group: '标准库与应用',
    description: 'socket 是网络对话的插座，HTTP 是双方约定的信封格式，urllib 与 requests 则替你折好信封。先学协议边界，再学便利客户端，错误处理才不会靠猜。',
    knowledge: ['TCP socket 经历连接、发送、接收与关闭，服务端还要绑定和监听', 'HTTP 请求包含方法、路径、头与可选正文，响应先看状态码', 'urllib.request 属于标准库，requests 提供更友好的第三方接口', '网络调用必须设置超时，并区分连接、HTTP 与解析错误', 'URL 编码、JSON 与字符编码是客户端常见边界'],
    example: {
      title: '先判断状态，再解析 JSON',
      code: `from urllib.request import urlopen\nimport json\nwith urlopen(url, timeout=3) as response:\n    if response.status == 200:\n        data = json.load(response)`,
    },
    exercise: {
      title: '构造请求并解析响应',
      brief: '在不联网的情况下构造标准 HTTP 请求文本，并严格解析成功的 JSON 响应。',
      starterCode: `import json\n\ndef build_http_request(method, path, host, body=""):\n    # TODO：返回使用 \\r\\n 分隔的请求字符串\n    pass\n\ndef parse_json_response(status, text):\n    # TODO：非 2xx 抛出 RuntimeError，成功时解析 JSON\n    pass`,
      sampleInput: '',
      mode: 'function',
      testCode: `\nrequest = build_http_request("GET", "/api/lessons", "example.test")\nassert request == "GET /api/lessons HTTP/1.1\\r\\nHost: example.test\\r\\nConnection: close\\r\\n\\r\\n"\nassert parse_json_response(200, '{"ok": true}') == {"ok": True}\nfor status in [404, 500]:\n    try:\n        parse_json_response(status, "{}")\n    except RuntimeError:\n        pass\n    else:\n        raise AssertionError("非 2xx 状态必须失败")\nprint("__PYPATH_PASS__")`,
      hints: ['请求行格式是 METHOD path HTTP/1.1。', '头部结束后必须有一个空行，即连续两个 \\r\\n。', '用 200 <= status < 300 判断成功，再 json.loads(text)。'],
    },
  },
  {
    id: 'email-cgi',
    number: '21',
    shortTitle: '邮件与 CGI',
    title: '理解早期 Web 的来回通信',
    kicker: 'SMTP · EmailMessage · CGI（历史）',
    minutes: 38,
    group: '标准库与应用',
    description: 'SMTP 负责把邮件沿服务器接力送出；CGI 曾让 Web 服务器为每次请求启动脚本。这里保留协议思维，但只把 CGI 当历史地图：cgi 模块已在 Python 3.13 移除。',
    knowledge: ['smtplib 建立 SMTP 会话，生产代码需 TLS、认证、超时与错误处理', 'EmailMessage 组织纯文本、HTML、附件和标准邮件头', 'URL 查询串、GET/POST 表单都需要解码、验证和转义', '传统 CGI 还涉及 HTTP 头、Cookie 与下载；现代服务采用长期运行的应用接口', 'Python 的 cgi 模块在 3.11 弃用、3.13 移除，不应写入新项目'],
    example: {
      title: '把表单内容装进标准邮件对象',
      code: `from email.message import EmailMessage\nmessage = EmailMessage()\nmessage["Subject"] = "学习反馈"\nmessage.set_content("今天完成了异常处理")`,
    },
    exercise: {
      title: '把查询串变成反馈邮件',
      brief: '用 parse_qs 解析表单查询串，验证必填字段，并生成 EmailMessage；不连接真实邮件服务器。',
      starterCode: `from email.message import EmailMessage\nfrom urllib.parse import parse_qs\n\ndef feedback_message(query):\n    # TODO\n    pass`,
      sampleInput: '',
      mode: 'function',
      testCode: `\nmessage = feedback_message("name=Ada&lesson=%E5%BC%82%E5%B8%B8&note=very+useful")\nassert isinstance(message, EmailMessage)\nassert message["Subject"] == "PyPath 反馈：异常"\nassert message.get_content().strip() == "Ada：very useful"\nfor bad in ["", "name=Ada", "lesson=loops"]:\n    try:\n        feedback_message(bad)\n    except ValueError:\n        pass\n    else:\n        raise AssertionError("缺少字段时必须拒绝")\nprint("__PYPATH_PASS__")`,
      hints: ['parse_qs(query) 的值是列表，可写一个辅助函数取第一项。', 'name、lesson、note 三个字段都必须有非空值。', '设置 Subject 后用 set_content() 写正文。'],
    },
  },
  {
    id: 'databases',
    number: '22',
    shortTitle: '数据库客户端',
    title: '和结构化数据仓库对话',
    kicker: 'MySQL Connector · PyMySQL · MongoDB',
    minutes: 52,
    group: '标准库与应用',
    description: '关系数据库按表和事务守规则，文档数据库把嵌套记录直接放进集合。无论驱动叫什么，安全参数、明确查询、结果边界和失败回滚都是共同底线。',
    knowledge: ['mysql-connector 与 PyMySQL 都遵循连接、游标、执行、提交/回滚流程', 'CRUD、WHERE、ORDER BY、LIMIT 与参数绑定构成常见 SQL 操作', '参数必须由驱动绑定，不能把用户文本拼进 SQL', 'MongoDB 以数据库、集合、文档组织数据，过滤器和更新操作符描述变化', '连接应按时关闭，事务异常时回滚，并限制查询结果规模'],
    example: {
      title: 'SQL 与参数分开交给驱动',
      code: `sql = "SELECT name FROM students WHERE score >= %s"\nparams = (80,)\ncursor.execute(sql, params)\nrows = cursor.fetchall()`,
    },
    exercise: {
      title: '规划安全的跨库写入',
      brief: '把记录转换为参数化 MySQL 操作和 MongoDB 文档；只生成计划，不连接真实数据库。',
      starterCode: `def database_plan(records):\n    # TODO\n    pass`,
      sampleInput: '',
      mode: 'function',
      testCode: `\nrecords = [{"name": "Ada", "score": 95}, {"name": "Lin'; DROP TABLE x;--", "score": 88}]\nplan = database_plan(records)\nassert plan["mysql_sql"] == "INSERT INTO students (name, score) VALUES (%s, %s)"\nassert plan["mysql_params"] == [("Ada", 95), ("Lin'; DROP TABLE x;--", 88)]\nassert plan["mongo_documents"] == records\nassert plan["transaction"] == ["begin", "execute_many", "commit_on_success", "rollback_on_error"]\nassert database_plan([])["mysql_params"] == []\nprint("__PYPATH_PASS__")`,
      hints: ['SQL 字符串固定不变，只让参数列表保存真实值。', '为每条记录创建 (name, score) 元组。', 'MongoDB 文档要复制，避免调用者之后修改原对象影响计划。'],
    },
  },
  {
    id: 'web-scraping',
    number: '23',
    shortTitle: '网页采集',
    title: '从网页中提取有用信息',
    kicker: '爬虫 · Scrapy · Selenium',
    minutes: 52,
    group: '标准库与应用',
    description: '网页采集像在图书馆做索引：先尊重开放规则，再请求、解析、去重和限速。Scrapy 管理大规模流水线，Selenium 只在必须执行浏览器交互时出场。',
    knowledge: ['采集前检查 robots.txt、服务条款、访问频率与数据许可', 'HTML 解析器或 BeautifulSoup 用结构选择器提取内容', 'Scrapy 的 Spider、Request、Response、Selector、Item 与 Pipeline 各司其职', 'Selenium 通过定位、交互和显式等待处理动态页面，结束时释放驱动', 'URL 规范化、去重、重试和持久化让采集任务可恢复'],
    example: {
      title: '把相对链接变成唯一绝对地址',
      code: `from urllib.parse import urljoin\nbase = "https://example.test/guide/"\nlinks = {urljoin(base, href) for href in ["one", "/two"]}\nprint(sorted(links))`,
    },
    exercise: {
      title: '解析一页链接并生成队列',
      brief: '使用 HTMLParser 提取 href，转成同站绝对 URL，移除片段、去重并保持首次出现顺序。',
      starterCode: `from html.parser import HTMLParser\nfrom urllib.parse import urljoin, urlparse, urldefrag\n\nclass LinkParser(HTMLParser):\n    def __init__(self):\n        super().__init__()\n        self.links = []\n\n    def handle_starttag(self, tag, attrs):\n        # TODO\n        pass\n\ndef crawl_queue(base_url, html):\n    # TODO\n    pass`,
      sampleInput: '',
      mode: 'function',
      testCode: `\nhtml = '<a href="/a#top">A</a><a href="b">B</a><a href="https://other.test/x">X</a><a href="/a">A2</a>'\nassert crawl_queue("https://example.test/docs/", html) == [\n    "https://example.test/a", "https://example.test/docs/b"\n]\nassert crawl_queue("https://example.test/", "<p>none</p>") == []\nprint("__PYPATH_PASS__")`,
      hints: ['只有 tag == "a" 时查找 attrs 中的 href。', 'urljoin 负责绝对化，urldefrag 去掉 # 片段。', '比较 urlparse(url).netloc，只保留与 base_url 同站的链接。'],
    },
  },
  {
    id: 'gui-charts',
    number: '24',
    shortTitle: '界面与图表',
    title: '把结果变成看得见的界面',
    kicker: 'PyQt · pyecharts',
    minutes: 46,
    group: '标准库与应用',
    description: 'GUI 把事件连接到状态变化，图表把数字映射成视觉通道。课程以 PyQt6 讲窗口、控件与信号槽；pyecharts 把数据和配置渲染成可交互图表。',
    knowledge: ['PyQt6 应用由事件循环驱动，控件通过布局而非绝对坐标组织；PyQt5 资料仅用于识别旧代码', 'signal 发送事件，slot 接收并更新状态或界面', '长任务不能阻塞 UI 线程，应转移工作并安全回传结果', 'pyecharts 用图表类型、数据系列和全局/系列配置描述视图', '选择图表要匹配问题：比较、趋势、分布和关系需要不同编码'],
    example: {
      title: '先把图表描述成普通数据',
      code: `option = {\n    "xAxis": ["一", "二", "三"],\n    "series": [{"name": "练习", "type": "bar", "data": [2, 4, 5]}],\n}`,
    },
    exercise: {
      title: '构建学习仪表盘配置',
      brief: '生成可序列化的柱状图配置，并实现模拟“按钮点击”的纯状态更新函数。',
      starterCode: `def chart_option(labels, values):\n    # TODO\n    pass\n\ndef increment_progress(state, step=1):\n    # TODO：返回新字典，不修改原 state\n    pass`,
      sampleInput: '',
      mode: 'function',
      testCode: `\nassert chart_option(["语法", "函数"], [3, 5]) == {\n    "xAxis": ["语法", "函数"],\n    "series": [{"name": "完成题数", "type": "bar", "data": [3, 5]}],\n}\nstate = {"done": 2, "total": 5}\nassert increment_progress(state) == {"done": 3, "total": 5}\nassert increment_progress(state, 10) == {"done": 5, "total": 5}\nassert state == {"done": 2, "total": 5}\nprint("__PYPATH_PASS__")`,
      hints: ['图表配置只用列表、字典、字符串和数字。', '新状态可以从 {**state, "done": ...} 创建。', '完成数不能超过 total，也不应小于 0。'],
    },
  },
  {
    id: 'ai-apis',
    number: '25',
    shortTitle: 'AI 接口',
    title: '把模型能力接进程序',
    kicker: 'OpenAI · AI 绘画 · JSON 请求',
    minutes: 46,
    group: '标准库与应用',
    description: '调用 AI 的本质仍是构造请求、验证响应和处理失败。文本、图像、流式片段或工具调用只是不同数据形状；密钥永远留在安全环境，不能写进网页代码。',
    knowledge: ['客户端请求由模型、输入、参数与认证组成，密钥应来自服务端环境变量', '同步、异步和流式调用对应不同交互时延与资源管理方式', '结构化输出要按 schema 验证，工具调用要校验参数与权限', '多模态输入、文生图与扩散模型需要明确内容、尺寸、格式与安全边界', '限流、超时、重试、幂等和费用记录是可靠集成的一部分'],
    example: {
      title: '把需求组织成可验证载荷',
      code: `payload = {\n    "model": "chosen-by-server",\n    "input": [{"role": "user", "content": "解释生成器"}],\n    "stream": False,\n}`,
    },
    exercise: {
      title: '构造文本与图像任务',
      brief: '生成不含密钥的 JSON 载荷，并把流式文本片段按顺序合并。',
      starterCode: `def ai_task(model, prompt, image=False):\n    # TODO\n    pass\n\ndef collect_stream(chunks):\n    # TODO\n    pass`,
      sampleInput: '',
      mode: 'function',
      testCode: `\nassert ai_task("learn-model", "解释递归") == {\n    "model": "learn-model", "input": [{"role": "user", "content": "解释递归"}], "stream": False\n}\nassert ai_task("image-model", "一只纸飞机", image=True) == {\n    "model": "image-model", "prompt": "一只纸飞机", "size": "1024x1024"\n}\nassert collect_stream([{"text": "生"}, {"text": "成"}, {"done": True}]) == "生成"\nassert all("api_key" not in key.lower() for key in ai_task("m", "p"))\nprint("__PYPATH_PASS__")`,
      hints: ['image 为 False 时构造 input 消息列表和 stream=False。', '图像任务使用 prompt 与 size 字段。', '流式片段只拼接存在且为字符串的 text。'],
    },
  },
  {
    id: 'quantitative-python',
    number: '26',
    shortTitle: '量化入门',
    title: '用数据衡量收益与风险',
    kicker: '收益率 · 均线 · 回撤',
    minutes: 48,
    group: '标准库与应用',
    description: '量化分析先把市场叙事变成可重复计算：收益率描述相邻变化，移动平均压平噪声，回撤衡量从高点跌落的幅度。回测结果不等于未来收益。',
    knowledge: ['简单收益率等于当前价/前价 - 1，复合收益要连乘', '移动平均用固定窗口观察趋势，窗口不足时不产生值', '最大回撤比较每个时点与此前峰值', '策略回测必须防止未来数据、幸存者偏差和交易成本遗漏', '结果要报告收益与风险，不把历史样本包装成投资承诺'],
    example: {
      title: '滚动窗口只看已经发生的数据',
      code: `prices = [10, 11, 12, 9]\nwindow = 3\naverages = [\n    sum(prices[i-window+1:i+1]) / window\n    for i in range(window - 1, len(prices))\n]`,
    },
    exercise: {
      title: '计算迷你行情报告',
      brief: '根据固定价格序列返回逐期收益率、移动平均和最大回撤，统一四舍五入到 4 位。',
      starterCode: `def market_report(prices, window):\n    # TODO\n    pass`,
      sampleInput: '',
      mode: 'function',
      testCode: `\nassert market_report([100, 110, 99, 120], 2) == {\n    "returns": [0.1, -0.1, 0.2121],\n    "moving_average": [105.0, 104.5, 109.5],\n    "max_drawdown": -0.1,\n}\nassert market_report([5], 1) == {"returns": [], "moving_average": [5.0], "max_drawdown": 0.0}\nfor bad in [([], 2), ([1, 2], 0), ([1, 0], 1)]:\n    try:\n        market_report(*bad)\n    except ValueError:\n        pass\n    else:\n        raise AssertionError("无效行情必须抛出 ValueError")\nprint("__PYPATH_PASS__")`,
      hints: ['先拒绝空序列、非正价格和非法窗口。', '收益率从索引 1 开始；均线从 window - 1 开始。', '遍历价格维护 peak，回撤是 price / peak - 1，取最小值。'],
    },
  },
];

const foundationChapterById = new Map(foundationChapterDrafts.map((chapter) => [chapter.id, chapter]));

export const foundationChapters: FoundationChapter[] = foundationChapterCatalog.map((catalogItem) => {
  const chapter = foundationChapterById.get(catalogItem.id);
  if (!chapter) throw new Error(`Missing foundation chapter data: ${catalogItem.id}`);
  return { ...chapter, ...catalogItem };
});

export type ProjectInfo = {
  id: string;
  number: string;
  title: string;
  category: string;
  description: string;
  goal: string;
  folder: string;
  files: string[];
  acceptance: string[];
  command: string;
  token: string;
};

export const projects: ProjectInfo[] = [
  {
    id: 'file-organizer',
    number: '01',
    title: '文件归档助手',
    category: '文件与 pathlib',
    description: '读取一份混乱的文件清单，按扩展名生成稳定、可复查的归档计划。',
    goal: '练习 pathlib、JSON、大小写与无扩展名文件的边界处理。',
    folder: 'learning/projects/01-file-organizer',
    files: ['solution.py', 'fixtures/inbox.txt', 'README.md'],
    acceptance: ['TXT 与 txt 归为同一类', '无扩展名文件进入 other', 'output/plan.json 按文件名稳定排序'],
    command: 'uv run pylearn check file-organizer',
    token: 'PYPATH-FILE-7F2A',
  },
  {
    id: 'expense-report',
    number: '02',
    title: '个人支出日报',
    category: 'CSV 与数据处理',
    description: '清洗一份支出 CSV，按类别汇总金额，并输出机器可读的日报。',
    goal: '练习 csv、Decimal、分组聚合与确定性 JSON 输出。',
    folder: 'learning/projects/02-expense-report',
    files: ['solution.py', 'fixtures/expenses.csv', 'README.md'],
    acceptance: ['金额使用 Decimal 计算', '类别按名称排序', '总额与分类汇总写入 output/summary.json'],
    command: 'uv run pylearn check expense-report',
    token: 'PYPATH-DATA-91C4',
  },
  {
    id: 'offline-api',
    number: '03',
    title: '离线 API 客户端',
    category: '网络请求',
    description: '从验收器启动的本地 HTTP 服务读取用户数据，处理 JSON 并保存摘要。',
    goal: '练习 urllib.request、超时、状态码和网络异常；验证全程不依赖公网。',
    folder: 'learning/projects/03-offline-api',
    files: ['solution.py', 'README.md'],
    acceptance: ['URL 只从 PYPATH_API_URL 读取', '请求设置 2 秒超时', 'output/profile.json 字段完整且无额外输出'],
    command: 'uv run pylearn check offline-api',
    token: 'PYPATH-HTTP-3BD8',
  },
  {
    id: 'log-analyzer',
    number: '04',
    title: '服务日志体检器',
    category: '日志与统计',
    description: '流式读取 JSONL 日志，统计级别、错误率和最慢请求。',
    goal: '练习生成器、容错解析、Counter 与程序日志。',
    folder: 'learning/projects/04-log-analyzer',
    files: ['solution.py', 'fixtures/app.jsonl', 'README.md'],
    acceptance: ['损坏行计入 invalid_lines 而不崩溃', '级别计数正确', 'output/report.json 使用稳定字段顺序'],
    command: 'uv run pylearn check log-analyzer',
    token: 'PYPATH-LOGS-6E10',
  },
  {
    id: 'batch-renamer',
    number: '05',
    title: '批量重命名规划器',
    category: '常用操作',
    description: '把不统一的文件名转换为安全的 kebab-case，并先输出计划而非直接改名。',
    goal: '练习正则表达式、字符串规范化、冲突处理与 CSV 输出。',
    folder: 'learning/projects/05-batch-renamer',
    files: ['solution.py', 'fixtures/names.txt', 'README.md'],
    acceptance: ['空格与下划线统一为连字符', '扩展名保持小写', '冲突追加 -2 且不覆盖原文件'],
    command: 'uv run pylearn check batch-renamer',
    token: 'PYPATH-NAME-A54D',
  },
  {
    id: 'backup-manifest',
    number: '06',
    title: '可验证备份清单',
    category: '自动化与哈希',
    description: '扫描配置目录，为每个文件计算 SHA-256，生成可用于验证备份的 manifest。',
    goal: '练习目录遍历、hashlib、相对路径和可复现输出。',
    folder: 'learning/projects/06-backup-manifest',
    files: ['solution.py', 'fixtures/source/', 'README.md'],
    acceptance: ['忽略隐藏文件与 .tmp', '使用分块读取计算哈希', 'output/manifest.json 按相对路径排序'],
    command: 'uv run pylearn check backup-manifest',
    token: 'PYPATH-HASH-C208',
  },
];

export type Difficulty = '简单' | '中等' | '困难';

export type AlgorithmProblem = {
  id: number;
  title: string;
  difficulty: Difficulty;
  slug: string;
};

export type AlgorithmCategory = {
  id: string;
  number: string;
  title: string;
  shortTitle: string;
  metaphor: string;
  principle: string;
  template: string;
  tone: 'mint' | 'amber' | 'violet' | 'blue' | 'rose';
  problems: AlgorithmProblem[];
};

export const algorithmCategories: AlgorithmCategory[] = [
  {
    id: 'array-hash', number: '01', title: '数组与哈希', shortTitle: '瞬移门牌', tone: 'mint',
    metaphor: '数组是一排抽屉，哈希表是门牌索引：不必逐个翻找，按 key 就能瞬移到目标。',
    principle: '一次扫描时，把“已经见过的值、频次、索引或分组键”存入 dict / set，用空间换时间。',
    template: `seen = {}\nfor i, value in enumerate(nums):\n    need = target - value\n    if need in seen:\n        return [seen[need], i]\n    seen[value] = i`,
    problems: [
      { id: 1, title: '两数之和', difficulty: '简单', slug: 'two-sum' },
      { id: 217, title: '存在重复元素', difficulty: '简单', slug: 'contains-duplicate' },
      { id: 49, title: '字母异位词分组', difficulty: '中等', slug: 'group-anagrams' },
      { id: 238, title: '除自身以外数组的乘积', difficulty: '中等', slug: 'product-of-array-except-self' },
      { id: 128, title: '最长连续序列', difficulty: '中等', slug: 'longest-consecutive-sequence' },
    ],
  },
  {
    id: 'stack-queue', number: '02', title: '栈与队列', shortTitle: '弹匣与取号机', tone: 'amber',
    metaphor: '栈像弹匣，最后压入的先弹出；队列像取号机，先来先服务。单调栈还会请挡住视线的人离场。',
    principle: '未闭合的状态入栈，匹配后出栈；需要两端操作时优先用 deque；单调结构用 while 维护不变量。',
    template: `stack = []\nfor value in nums:\n    while stack and value > stack[-1]:\n        top = stack.pop()\n        # value 是 top 等待的答案\n    stack.append(value)`,
    problems: [
      { id: 20, title: '有效的括号', difficulty: '简单', slug: 'valid-parentheses' },
      { id: 232, title: '用栈实现队列', difficulty: '简单', slug: 'implement-queue-using-stacks' },
      { id: 155, title: '最小栈', difficulty: '中等', slug: 'min-stack' },
      { id: 394, title: '字符串解码', difficulty: '中等', slug: 'decode-string' },
      { id: 739, title: '每日温度', difficulty: '中等', slug: 'daily-temperatures' },
      { id: 239, title: '滑动窗口最大值', difficulty: '困难', slug: 'sliding-window-maximum' },
    ],
  },
  {
    id: 'linked-list', number: '03', title: '链表', shortTitle: '重挂车厢', tone: 'violet',
    metaphor: '每个节点是一节只知道下一节是谁的车厢；修改链表，就是先记住下一节，再谨慎更换挂钩。',
    principle: '优先引入 dummy；改指针前保存 next；反转用 prev / cur / nxt，判环与找中点用快慢指针。',
    template: `prev, cur = None, head\nwhile cur:\n    nxt = cur.next\n    cur.next = prev\n    prev, cur = cur, nxt\nreturn prev`,
    problems: [
      { id: 206, title: '反转链表', difficulty: '简单', slug: 'reverse-linked-list' },
      { id: 21, title: '合并两个有序链表', difficulty: '简单', slug: 'merge-two-sorted-lists' },
      { id: 141, title: '环形链表', difficulty: '简单', slug: 'linked-list-cycle' },
      { id: 19, title: '删除链表的倒数第 N 个结点', difficulty: '中等', slug: 'remove-nth-node-from-end-of-list' },
      { id: 2, title: '两数相加', difficulty: '中等', slug: 'add-two-numbers' },
    ],
  },
  {
    id: 'tree', number: '04', title: '树', shortTitle: '家谱分支', tone: 'blue',
    metaphor: '站在任意家庭成员处，只处理自己的子树，再把孩子带回的信息汇总给父节点。',
    principle: '先用一句话定义 dfs(node) 的返回值；空节点是出口。层序遍历用队列，并按当前队列长度切层。',
    template: `def dfs(node):\n    if not node:\n        return 0\n    left = dfs(node.left)\n    right = dfs(node.right)\n    return 1 + max(left, right)`,
    problems: [
      { id: 104, title: '二叉树的最大深度', difficulty: '简单', slug: 'maximum-depth-of-binary-tree' },
      { id: 226, title: '翻转二叉树', difficulty: '简单', slug: 'invert-binary-tree' },
      { id: 102, title: '二叉树的层序遍历', difficulty: '中等', slug: 'binary-tree-level-order-traversal' },
      { id: 98, title: '验证二叉搜索树', difficulty: '中等', slug: 'validate-binary-search-tree' },
      { id: 236, title: '二叉树的最近公共祖先', difficulty: '中等', slug: 'lowest-common-ancestor-of-a-binary-tree' },
      { id: 124, title: '二叉树中的最大路径和', difficulty: '困难', slug: 'binary-tree-maximum-path-sum' },
    ],
  },
  {
    id: 'graph', number: '05', title: '图', shortTitle: '城市地图', tone: 'rose',
    metaphor: '节点是车站，边是线路；visited 是盖过章的车票，让你不会在环形线路里无限兜圈。',
    principle: '先建邻接表，再按“标记 → 访问邻居”做 DFS/BFS；依赖关系用拓扑排序，连通性可用并查集。',
    template: `queue = deque([start])\nvisited = {start}\nwhile queue:\n    node = queue.popleft()\n    for nxt in graph[node]:\n        if nxt not in visited:\n            visited.add(nxt)\n            queue.append(nxt)`,
    problems: [
      { id: 200, title: '岛屿数量', difficulty: '中等', slug: 'number-of-islands' },
      { id: 133, title: '克隆图', difficulty: '中等', slug: 'clone-graph' },
      { id: 207, title: '课程表', difficulty: '中等', slug: 'course-schedule' },
      { id: 684, title: '冗余连接', difficulty: '中等', slug: 'redundant-connection' },
      { id: 743, title: '网络延迟时间', difficulty: '中等', slug: 'network-delay-time' },
    ],
  },
  {
    id: 'divide-conquer', number: '06', title: '递归与分治', shortTitle: '同款小团队', tone: 'mint',
    metaphor: '总负责人不包办全部工作，而是把任务切成更小的同类任务，等待各小组返回结果后再合并。',
    principle: '固定骨架是：递归出口 → 拆分 → 递归求解 → 合并；写代码前先说清函数负责返回什么。',
    template: `def solve(items):\n    if len(items) <= 1:\n        return items\n    mid = len(items) // 2\n    left = solve(items[:mid])\n    right = solve(items[mid:])\n    return merge(left, right)`,
    problems: [
      { id: 50, title: 'Pow(x, n)', difficulty: '中等', slug: 'powx-n' },
      { id: 108, title: '将有序数组转换为二叉搜索树', difficulty: '简单', slug: 'convert-sorted-array-to-binary-search-tree' },
      { id: 148, title: '排序链表', difficulty: '中等', slug: 'sort-list' },
      { id: 215, title: '数组中的第 K 个最大元素', difficulty: '中等', slug: 'kth-largest-element-in-an-array' },
      { id: 23, title: '合并 K 个升序链表', difficulty: '困难', slug: 'merge-k-sorted-lists' },
    ],
  },
  {
    id: 'binary-search', number: '07', title: '二分查找', shortTitle: '关闭半间房', tone: 'amber',
    metaphor: '目标藏在一排房间里；每问一次中间房间，就能确定另一半不可能有答案。',
    principle: '统一使用半开区间 [lo, hi)；二分答案时先构造单调的 check(x)，再找第一个可行值。',
    template: `lo, hi = 0, len(nums)\nwhile lo < hi:\n    mid = (lo + hi) // 2\n    if nums[mid] < target:\n        lo = mid + 1\n    else:\n        hi = mid\nreturn lo`,
    problems: [
      { id: 704, title: '二分查找', difficulty: '简单', slug: 'binary-search' },
      { id: 35, title: '搜索插入位置', difficulty: '简单', slug: 'search-insert-position' },
      { id: 33, title: '搜索旋转排序数组', difficulty: '中等', slug: 'search-in-rotated-sorted-array' },
      { id: 153, title: '寻找旋转排序数组中的最小值', difficulty: '中等', slug: 'find-minimum-in-rotated-sorted-array' },
      { id: 875, title: '爱吃香蕉的珂珂', difficulty: '中等', slug: 'koko-eating-bananas' },
    ],
  },
  {
    id: 'two-pointers', number: '08', title: '双指针与滑动窗口', shortTitle: '伸缩的尺', tone: 'violet',
    metaphor: '两名巡逻员从两端夹击，或共同框住连续区域：右端探索，左端在条件失效时收缩。',
    principle: '有序数组和回文常用对撞指针；窗口固定为“右扩张 → 更新计数 → 条件失效时左收缩 → 记录答案”。',
    template: `left = 0\nfor right, value in enumerate(items):\n    add(value)\n    while not valid():\n        remove(items[left])\n        left += 1\n    answer = max(answer, right - left + 1)`,
    problems: [
      { id: 125, title: '验证回文串', difficulty: '简单', slug: 'valid-palindrome' },
      { id: 167, title: '两数之和 II', difficulty: '中等', slug: 'two-sum-ii-input-array-is-sorted' },
      { id: 15, title: '三数之和', difficulty: '中等', slug: '3sum' },
      { id: 11, title: '盛最多水的容器', difficulty: '中等', slug: 'container-with-most-water' },
      { id: 3, title: '无重复字符的最长子串', difficulty: '中等', slug: 'longest-substring-without-repeating-characters' },
      { id: 76, title: '最小覆盖子串', difficulty: '困难', slug: 'minimum-window-substring' },
    ],
  },
  {
    id: 'greedy', number: '09', title: '贪心', shortTitle: '给未来留余地', tone: 'rose',
    metaphor: '贪心不是抢眼前最大的糖，而是选择做完后最不妨碍未来的动作，例如优先参加最早结束的会议。',
    principle: '常先排序或维护当前最远边界；每次局部选择都要能解释：被放弃的方案为什么不可能更优。',
    template: `items.sort(key=lambda item: item.end)\nend = -float("inf")\nchosen = 0\nfor item in items:\n    if item.start >= end:\n        chosen += 1\n        end = item.end`,
    problems: [
      { id: 121, title: '买卖股票的最佳时机', difficulty: '简单', slug: 'best-time-to-buy-and-sell-stock' },
      { id: 55, title: '跳跃游戏', difficulty: '中等', slug: 'jump-game' },
      { id: 45, title: '跳跃游戏 II', difficulty: '中等', slug: 'jump-game-ii' },
      { id: 134, title: '加油站', difficulty: '中等', slug: 'gas-station' },
      { id: 435, title: '无重叠区间', difficulty: '中等', slug: 'non-overlapping-intervals' },
    ],
  },
  {
    id: 'backtracking', number: '10', title: '回溯', shortTitle: '可擦的粉笔', tone: 'blue',
    metaphor: '在迷宫岔路口留下粉笔记号：走一条路，走不通就退回、擦掉记号，再试下一条。',
    principle: '维护 path 与候选集合，固定节奏是“做选择 → dfs → 撤销选择”，并在递归前剪掉不可能的分支。',
    template: `def dfs(start):\n    if is_answer(path):\n        answers.append(path[:])\n        return\n    for choice in choices(start):\n        path.append(choice)\n        dfs(next_start(choice))\n        path.pop()`,
    problems: [
      { id: 46, title: '全排列', difficulty: '中等', slug: 'permutations' },
      { id: 78, title: '子集', difficulty: '中等', slug: 'subsets' },
      { id: 39, title: '组合总和', difficulty: '中等', slug: 'combination-sum' },
      { id: 22, title: '括号生成', difficulty: '中等', slug: 'generate-parentheses' },
      { id: 79, title: '单词搜索', difficulty: '中等', slug: 'word-search' },
      { id: 51, title: 'N 皇后', difficulty: '困难', slug: 'n-queens' },
    ],
  },
  {
    id: 'dynamic-programming', number: '11', title: '动态规划', shortTitle: '最佳成绩账本', tone: 'violet',
    metaphor: '抵达新营地时，不再重走以前所有路线，只查看相邻营地已经记好的最佳成绩。',
    principle: '依次回答：状态是什么 → 从哪里转移 → 初值是什么 → 计算顺序是什么 → 能否压缩空间。',
    template: `dp = [0] * (n + 1)\ndp[0] = base\nfor state in range(1, n + 1):\n    for prev in previous_states(state):\n        dp[state] = best(dp[state], transition(dp[prev]))\nreturn dp[n]`,
    problems: [
      { id: 70, title: '爬楼梯', difficulty: '简单', slug: 'climbing-stairs' },
      { id: 198, title: '打家劫舍', difficulty: '中等', slug: 'house-robber' },
      { id: 322, title: '零钱兑换', difficulty: '中等', slug: 'coin-change' },
      { id: 300, title: '最长递增子序列', difficulty: '中等', slug: 'longest-increasing-subsequence' },
      { id: 1143, title: '最长公共子序列', difficulty: '中等', slug: 'longest-common-subsequence' },
      { id: 72, title: '编辑距离', difficulty: '中等', slug: 'edit-distance' },
    ],
  },
  {
    id: 'bit-special', number: '12', title: '位运算与特殊技巧', shortTitle: '二进制开关', tone: 'mint',
    metaphor: '每一位都是独立开关：异或能让成对的灯互相熄灭，掩码只查看控制室里的指定区域。',
    principle: '掌握异或抵消、取最低位 x & -x、清最低位 x &= x - 1；再留意快慢指针和数学不变量。',
    template: `count = 0\nwhile value:\n    value &= value - 1  # 清除最低的 1\n    count += 1\nreturn count`,
    problems: [
      { id: 136, title: '只出现一次的数字', difficulty: '简单', slug: 'single-number' },
      { id: 191, title: '位 1 的个数', difficulty: '简单', slug: 'number-of-1-bits' },
      { id: 338, title: '比特位计数', difficulty: '简单', slug: 'counting-bits' },
      { id: 268, title: '丢失的数字', difficulty: '简单', slug: 'missing-number' },
      { id: 371, title: '两整数之和', difficulty: '中等', slug: 'sum-of-two-integers' },
    ],
  },
];

export const builtinAlgorithmCount = algorithmCategories.reduce((total, category) => total + category.problems.length, 0);
