export type FoundationGroup = '基础语法' | '进阶语法' | '标准库与应用';

export type FoundationChapterCatalogItem = {
  id: string;
  number: string;
  shortTitle: string;
  title: string;
  kicker: string;
  minutes: number;
  group: FoundationGroup;
};

export const foundationChapterCatalog: FoundationChapterCatalogItem[] = [
  { id: 'first-program', number: '01', shortTitle: '语法起跑线', title: '让 Python 开口', kicker: '语法 · 注释 · 变量 · 输入输出', minutes: 28, group: '基础语法' },
  { id: 'numbers-strings', number: '02', shortTitle: '数字与文本', title: '数字与文本加工厂', kicker: '数字 · 运算 · 转换 · 字符串', minutes: 34, group: '基础语法' },
  { id: 'conditions', number: '03', shortTitle: '条件分支', title: '程序的岔路口', kicker: '比较 · 布尔值 · 条件控制', minutes: 28, group: '基础语法' },
  { id: 'containers', number: '04', shortTitle: '数据容器', title: '数据收纳盒', kicker: '列表 · 元组 · 字典 · 集合', minutes: 38, group: '基础语法' },
  { id: 'loops', number: '05', shortTitle: '循环', title: '重复任务流水线', kicker: 'for · while · break · continue', minutes: 34, group: '基础语法' },
  { id: 'functions', number: '06', shortTitle: '函数', title: '把代码装进工具箱', kicker: '参数 · return · 作用域', minutes: 38, group: '基础语法' },
  { id: 'python-tools', number: '07', shortTitle: '推导与结构', title: 'Python 的快捷通道', kicker: '推导式 · zip · 数据结构', minutes: 36, group: '进阶语法' },
  { id: 'standard-library', number: '08', shortTitle: '数值工具箱', title: '可靠计算的积木', kicker: 'datetime · math · random · statistics', minutes: 36, group: '进阶语法' },
  { id: 'iterators-generators', number: '09', shortTitle: '惰性序列', title: '一件一件送上流水线', kicker: '迭代器 · 生成器 · yield', minutes: 38, group: '进阶语法' },
  { id: 'context-decorators', number: '10', shortTitle: '上下文与装饰器', title: '给代码加上自动开关', kicker: 'with · 上下文管理器 · 装饰器', minutes: 44, group: '进阶语法' },
  { id: 'modules-typing', number: '11', shortTitle: '模块与类型', title: '把程序拆成可读零件', kicker: '模块 · __name__ · 类型注解', minutes: 38, group: '进阶语法' },
  { id: 'errors-exceptions', number: '12', shortTitle: '异常处理', title: '为意外准备安全网', kicker: 'try · except · else · finally', minutes: 36, group: '进阶语法' },
  { id: 'object-oriented', number: '13', shortTitle: '面向对象', title: '让数据和行为住在一起', kicker: '类 · 对象 · 继承 · 特殊方法', minutes: 50, group: '进阶语法' },
  { id: 'files-os', number: '14', shortTitle: '文件与系统', title: '在文件系统中安全行走', kicker: 'File · pathlib · OS · StringIO', minutes: 46, group: '标准库与应用' },
  { id: 'builtins-stdlib', number: '15', shortTitle: '内置与标准库', title: '先查工具箱，再造轮子', kicker: '内置函数 · operator · sys', minutes: 36, group: '标准库与应用' },
  { id: 'regular-expressions', number: '16', shortTitle: '正则表达式', title: '给文本装一台模式雷达', kicker: 're · 匹配 · 分组 · 替换', minutes: 44, group: '标准库与应用' },
  { id: 'data-formats', number: '17', shortTitle: '数据格式', title: '让数据跨程序旅行', kicker: 'JSON · XML · CSV · Pickle · hashlib', minutes: 52, group: '标准库与应用' },
  { id: 'system-process-logging', number: '18', shortTitle: '进程与日志', title: '观察并调度外部程序', kicker: 'sys · subprocess · logging', minutes: 44, group: '标准库与应用' },
  { id: 'concurrency', number: '19', shortTitle: '并发编程', title: '让多个任务协调前进', kicker: 'threading · queue · asyncio', minutes: 54, group: '标准库与应用' },
  { id: 'network-http', number: '20', shortTitle: '网络与 HTTP', title: '把请求送到另一台机器', kicker: 'socket · urllib · requests', minutes: 50, group: '标准库与应用' },
  { id: 'email-cgi', number: '21', shortTitle: '邮件与 CGI', title: '理解早期 Web 的来回通信', kicker: 'SMTP · EmailMessage · CGI（历史）', minutes: 38, group: '标准库与应用' },
  { id: 'databases', number: '22', shortTitle: '数据库客户端', title: '和结构化数据仓库对话', kicker: 'MySQL Connector · PyMySQL · MongoDB', minutes: 52, group: '标准库与应用' },
  { id: 'web-scraping', number: '23', shortTitle: '网页采集', title: '从网页中提取有用信息', kicker: '爬虫 · Scrapy · Selenium', minutes: 52, group: '标准库与应用' },
  { id: 'gui-charts', number: '24', shortTitle: '界面与图表', title: '把结果变成看得见的界面', kicker: 'PyQt · pyecharts', minutes: 46, group: '标准库与应用' },
  { id: 'ai-apis', number: '25', shortTitle: 'AI 接口', title: '把模型能力接进程序', kicker: 'OpenAI · AI 绘画 · JSON 请求', minutes: 46, group: '标准库与应用' },
  { id: 'quantitative-python', number: '26', shortTitle: '量化入门', title: '用数据衡量收益与风险', kicker: '收益率 · 均线 · 回撤', minutes: 48, group: '标准库与应用' },
];
