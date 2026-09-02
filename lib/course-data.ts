export type ExerciseCase = {
  input: string;
  expected: string;
};

export type FoundationChapter = {
  id: string;
  number: string;
  shortTitle: string;
  title: string;
  kicker: string;
  minutes: number;
  description: string;
  knowledge: string[];
  example: { title: string; code: string };
  exercise: {
    title: string;
    brief: string;
    starterCode: string;
    sampleInput: string;
    mode: 'stdout' | 'function';
    cases?: ExerciseCase[];
    testCode?: string;
    hints: string[];
  };
};

export const foundationChapters: FoundationChapter[] = [
  {
    id: 'first-program',
    number: '01',
    shortTitle: '第一行代码',
    title: '点亮控制台',
    kicker: '变量 · 类型 · 输出',
    minutes: 18,
    description: '第一行代码像按下房间的开关：变量帮你给信息贴标签，print() 让程序开口说话。先做一张属于自己的学习卡。',
    knowledge: ['程序从上到下执行，# 后面是注释', '变量是指向值的名字，命名要能表达含义', 'int、float、str、bool 是四种常见基础类型', 'print() 可以同时输出文本和变量'],
    example: {
      title: '让变量替你记住信息',
      code: `name = "小派"\ndays = 7\nprint(f"{name} 已学习 {days} 天")\nprint(type(days).__name__)`,
    },
    exercise: {
      title: '制作学习卡',
      brief: '补全两次输出。标点、空格和数字都要与目标一致。',
      starterCode: `name = "小派"\nlanguage = "Python"\ndays = 7\n\n# TODO：补全下面两行\nprint()\nprint()`,
      sampleInput: '',
      mode: 'stdout',
      cases: [{ input: '', expected: '你好，小派！\n我会用 Python 连续学习 7 天。' }],
      hints: ['print() 的括号里可以放多个值。', '多个值之间默认会插入一个空格。', '也可以用 f"你好，{name}！" 把变量嵌进文本。'],
    },
  },
  {
    id: 'numbers-strings',
    number: '02',
    shortTitle: '数字与文本',
    title: '数字与文本加工厂',
    kicker: '运算 · 输入 · 字符串',
    minutes: 24,
    description: '收据、温度和用户名，本质上都是数字与文本的加工。掌握转换、计算和格式化，就能把原始输入变成整洁结果。',
    knowledge: ['+ - * / // % ** 与运算优先级', 'input() 读到的内容永远是字符串', 'int()、float() 和 str() 负责类型转换', '切片与 strip()、lower()、replace() 加工文本', 'f-string 的 :.2f 可以保留两位小数'],
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
    kicker: '比较 · 布尔值 · if',
    minutes: 22,
    description: '订单够不够免邮、用户是不是会员，都会改变下一步。条件语句让代码像一个清醒的岔路管理员，根据事实选择道路。',
    knowledge: ['== != < <= > >= 用来比较', 'and、or、not 可以组合多个条件', 'if / elif / else 从上到下匹配一次', '边界值往往是最容易写错的地方'],
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
    kicker: '列表 · 字典 · 集合',
    minutes: 28,
    description: '一个变量像单独的抽屉，容器则像整套收纳柜。列表、元组、字典和集合各有脾气，选对容器能让数据井然有序。',
    knowledge: ['列表有顺序、可修改，支持索引和切片', '元组不可变，适合表达一组固定值', '字典用 key 快速找到 value', '集合擅长去重和成员判断', 'len、sum、min、max、sorted 适用于许多容器'],
    example: {
      title: '同一批数据的不同视角',
      code: `tags = ["python", "web", "python"]\nunique = set(tags)\ncounts = {tag: tags.count(tag) for tag in unique}\nprint(sorted(unique))\nprint(counts["python"])`,
    },
    exercise: {
      title: '整理标签',
      brief: '输入以英文逗号分隔的标签，输出原数量和按字母排序的去重结果。',
      starterCode: `tags = input().split(",")\n\n# TODO：创建去重后的集合\nunique_tags = set()\n\nprint(f"输入 {len(tags)} 个标签")\nprint("去重后：" + ",".join(sorted(unique_tags)))`,
      sampleInput: 'python,web,python,data',
      mode: 'stdout',
      cases: [
        { input: 'python,web,python,data', expected: '输入 4 个标签\n去重后：data,python,web' },
        { input: 'api,api,api', expected: '输入 3 个标签\n去重后：api' },
      ],
      hints: ['set(tags) 可以去掉重复项。', '集合没有固定顺序，输出前需要 sorted()。', '",".join(...) 可以连接字符串序列。'],
    },
  },
  {
    id: 'loops',
    number: '05',
    shortTitle: '循环',
    title: '重复任务流水线',
    kicker: 'for · while · 计数',
    minutes: 26,
    description: '重复敲十遍代码会变成苦差事，循环则像自动流水线：逐项加工、不断计数，直到每一件原料都处理完成。',
    knowledge: ['for 遍历字符串、列表和字典', 'range() 生成有规律的整数序列', 'while 在条件成立时持续运行', 'break 结束循环，continue 跳过本轮', '循环常与累加器和计数字典搭配'],
    example: {
      title: '边走边记录',
      code: `scores = [80, 65, 92]\ntotal = 0\nfor score in scores:\n    total += score\nprint(total / len(scores))`,
    },
    exercise: {
      title: '统计单词频次',
      brief: '读取一行英文单词，按单词字母顺序输出出现次数。',
      starterCode: `words = input().split()\ncounts = {}\n\n# TODO：遍历 words，更新 counts\n\nfor word in sorted(counts):\n    print(f"{word}:{counts[word]}")`,
      sampleInput: 'apple banana apple pear banana apple',
      mode: 'stdout',
      cases: [
        { input: 'apple banana apple pear banana apple', expected: 'apple:3\nbanana:2\npear:1' },
        { input: 'python', expected: 'python:1' },
      ],
      hints: ['每读到一个单词，就把对应计数加一。', 'counts.get(word, 0) 能在键不存在时返回 0。', '更新语句可以写成 counts[word] = counts.get(word, 0) + 1。'],
    },
  },
  {
    id: 'functions',
    number: '06',
    shortTitle: '函数',
    title: '把代码装进工具箱',
    kicker: '参数 · return · 作用域',
    minutes: 30,
    description: '函数像可以反复使用的小工具：给它材料，它交回结果。把逻辑封装好，程序会更短、更清晰，也更容易测试。',
    knowledge: ['def 定义函数，参数是函数接收的材料', '默认参数让常见调用更简洁', 'return 把结果交回调用处，print 只负责显示', '函数内部的局部变量不会泄漏到外部', '一个函数最好只负责一件明确的事'],
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
    shortTitle: 'Python 惯用法',
    title: 'Python 的快捷通道',
    kicker: '推导式 · zip · 异常',
    minutes: 32,
    description: '熟练的 Python 代码往往不是更花哨，而是善用现成工具。内置函数、推导式和明确的错误能把常见任务表达得又短又安全。',
    knowledge: ['enumerate 同时取得序号和值', 'zip 并行组合多个序列', '推导式用一行表达映射或筛选', 'any、all、sorted 是常见聚合工具', 'try / except 处理可恢复错误，raise 主动报告无效输入'],
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
    shortTitle: '标准库',
    title: '借用标准库的超能力',
    kicker: '模块 · 日期 · 数学',
    minutes: 34,
    description: '你不必亲手制造每个齿轮。Python 标准库已经备好日期、数学、统计和随机工具，学会导入模块就能用可靠积木解决真实问题。',
    knowledge: ['import module 与 from module import name', 'math 提供取整、幂和数学常量', 'datetime 负责日期解析与运算', 'statistics 提供均值和中位数', 'random.Random(seed) 生成可复现的随机结果'],
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
];

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
