import type { SupplementalFoundationExercise } from './foundation-practice';

/**
 * Extra drills for the deliberately merged beginner chapters. These exercises
 * make the smaller syntax topics observable instead of treating a single
 * composite exercise as proof that every item was learned.
 */
export const coverageFoundationPractice: Record<string, SupplementalFoundationExercise[]> = {
  'first-program': [
    {
      id: 'syntax-output',
      title: '注释、文档与精确输出',
      brief: '为函数补上文档字符串，并使用 print 的 sep 与 end 组合一行学习介绍。',
      starterCode: `def print_intro(name, topics):
    # TODO：把这一行改成准确描述函数用途的 docstring
    """TODO"""
    # TODO：输出格式为 姓名 -> 主题1 | 主题2，末尾换行
    pass`,
      sampleInput: '',
      mode: 'function',
      testCode: `
import contextlib
import io

assert print_intro.__doc__ == "输出学习者和学习主题。"
buffer = io.StringIO()
with contextlib.redirect_stdout(buffer):
    result = print_intro("Ada", ["Python", "算法"])
assert result is None
assert buffer.getvalue() == "Ada -> Python | 算法\\n"
buffer = io.StringIO()
with contextlib.redirect_stdout(buffer):
    print_intro("Lin", [])
assert buffer.getvalue() == "Lin -> \\n"
print("__PYPATH_PASS__")`,
      hints: ['docstring 必须紧跟 def 后，内容为“输出学习者和学习主题。”。', '先 print(name, "->", sep=" ", end=" ")。', '再 print(*topics, sep=" | ")；空列表也会补上换行。'],
    },
  ],
  'numbers-strings': [
    {
      id: 'numeric-operators',
      title: '数字与运算符控制台',
      brief: '一次练习整除、取模、幂、复数和常用位运算，并明确除数为零的边界。',
      starterCode: `def operator_report(left, right):
    # TODO
    pass`,
      sampleInput: '',
      mode: 'function',
      testCode: `
assert operator_report(13, 3) == {
    "floor": 4,
    "remainder": 1,
    "power": 2197,
    "complex": 13 + 3j,
    "and": 1,
    "or": 15,
    "xor": 14,
    "shift": 26,
}
try:
    operator_report(4, 0)
except ZeroDivisionError:
    pass
else:
    raise AssertionError("除数为零必须拒绝")
print("__PYPATH_PASS__")`,
      hints: ['//、%、** 分别得到整除、余数和幂。', 'complex(left, right) 创建复数。', '&、|、^、<< 分别练习按位与、或、异或和左移。'],
    },
    {
      id: 'encoding-conversions',
      title: '字符、字节与进制卡片',
      brief: '在字符、Unicode 码点、UTF-8 字节和二/八/十六进制文本之间转换。',
      starterCode: `def encoding_card(character, number):
    # TODO
    pass`,
      sampleInput: '',
      mode: 'function',
      testCode: `
assert encoding_card("派", 42) == {
    "codepoint": 27966,
    "restored": "派",
    "utf8": b"\\xe6\\xb4\\xbe",
    "binary": "0b101010",
    "octal": "0o52",
    "hexadecimal": "0x2a",
}
try:
    encoding_card("AB", 1)
except ValueError:
    pass
else:
    raise AssertionError("必须只接收一个字符")
print("__PYPATH_PASS__")`,
      hints: ['先用 len(character) 检查只有一个字符。', 'ord 与 chr 完成字符和码点互转，encode("utf-8") 得到 bytes。', 'bin、oct、hex 生成带前缀的进制字符串。'],
    },
  ],
  conditions: [
    {
      id: 'short-circuit',
      title: '短路会员通行证',
      brief: '先安全处理 None，再结合身份、成员关系和嵌套边界给出访问级别。',
      starterCode: `def access_level(user, allowed_roles):
    # user 为 None 时不能访问 allowed_roles
    # TODO
    pass`,
      sampleInput: '',
      mode: 'function',
      testCode: `
class ExplodingRoles:
    def __contains__(self, item):
        raise AssertionError("短路失败：匿名用户不应检查角色")

assert access_level(None, ExplodingRoles()) == "guest"
assert access_level({"active": False, "role": "admin", "score": 99}, {"admin"}) == "disabled"
assert access_level({"active": True, "role": "admin", "score": 80}, {"admin"}) == "trusted"
assert access_level({"active": True, "role": "member", "score": 59}, {"admin", "member"}) == "limited"
assert access_level({"active": True, "role": "visitor", "score": 100}, {"admin"}) == "denied"
print("__PYPATH_PASS__")`,
      hints: ['第一条判断直接处理 user is None，形成短路边界。', '非 active 用户先返回 disabled。', '角色用 in 判断；允许后再按 score >= 80 区分 trusted 与 limited。'],
    },
  ],
  containers: [
    {
      id: 'container-crud',
      title: '四类容器操作台',
      brief: '按操作序列更新列表和字典，用元组保存快照，并用集合记录发生过的动作。',
      starterCode: `def apply_inventory(initial, actions):
    # TODO：不要修改传入的 initial
    pass`,
      sampleInput: '',
      mode: 'function',
      testCode: `
initial = {"pen": 2}
result = apply_inventory(initial, [("set", "book", 3), ("add", "pen", 2), ("delete", "book", None)])
assert initial == {"pen": 2}
assert result == {
    "items": [("pen", 4)],
    "keys": ("pen",),
    "actions": ["add", "delete", "set"],
}
assert apply_inventory({}, []) == {"items": [], "keys": (), "actions": []}
print("__PYPATH_PASS__")`,
      hints: ['先用 dict(initial) 复制字典。', 'set 赋值，add 用 get 累加，delete 用 pop(key, None)。', '集合记录动作名；最后 sorted(items.items()) 并把键转成 tuple。'],
    },
  ],
  functions: [
    {
      id: 'signatures-scope',
      title: '参数边界与闭包计数器',
      brief: '实现含仅位置、可变参数、仅关键字和额外关键字参数的函数，再用 nonlocal 保存闭包状态。',
      starterCode: `def summarize_call(primary, /, *values, scale=1, **metadata):
    # TODO
    pass

def make_counter(start=0):
    # TODO：返回每次调用增加 step 的闭包
    pass`,
      sampleInput: '',
      mode: 'function',
      testCode: `
assert summarize_call(2, 3, 5, scale=2, source="quiz") == {"total": 20, "metadata": {"source": "quiz"}}
assert summarize_call(4) == {"total": 4, "metadata": {}}
try:
    summarize_call(primary=2)
except TypeError:
    pass
else:
    raise AssertionError("primary 必须是仅位置参数")
counter = make_counter(10)
assert counter() == 11
assert counter(4) == 15
assert make_counter()() == 1
print("__PYPATH_PASS__")`,
      hints: ['把 primary 与 values 相加后乘 scale。', 'make_counter 内定义 current = start。', '内层函数先 nonlocal current，再累加 step 并返回。'],
    },
  ],
  'python-tools': [
    {
      id: 'comprehension-toolbox',
      title: '推导式与遍历工具箱',
      brief: '综合 enumerate、zip、字典/集合推导式、any、all 和 reversed 生成学习报告。',
      starterCode: `def study_report(names, scores):
    # TODO
    pass`,
      sampleInput: '',
      mode: 'function',
      testCode: `
assert study_report(["Ada", "Lin", "Bo"], [95, 58, 80]) == {
    "indexed": [(1, "Ada"), (2, "Lin"), (3, "Bo")],
    "score_by_name": {"Ada": 95, "Lin": 58, "Bo": 80},
    "passed_scores": {80, 95},
    "any_excellent": True,
    "all_valid": True,
    "reverse_names": ["Bo", "Lin", "Ada"],
}
assert study_report([], []) == {"indexed": [], "score_by_name": {}, "passed_scores": set(), "any_excellent": False, "all_valid": True, "reverse_names": []}
try:
    study_report(["Ada"], [])
except ValueError:
    pass
else:
    raise AssertionError("两个序列必须等长")
print("__PYPATH_PASS__")`,
      hints: ['先检查两个列表长度一致。', 'enumerate(names, 1) 产生编号；zip 配对姓名和成绩。', '推导式生成字典与集合，any/all 接收生成器表达式。'],
    },
  ],
  'modules-typing': [
    {
      id: 'module-inspector',
      title: '动态模块检查器',
      brief: '通过 importlib 导入标准库模块，结合 __name__、__all__ 与 dir 返回公开接口。',
      starterCode: `import importlib

def inspect_module(module_name):
    # TODO
    pass`,
      sampleInput: '',
      mode: 'function',
      testCode: `
math_info = inspect_module("math")
assert math_info["name"] == "math"
assert "sqrt" in math_info["public"]
json_info = inspect_module("json")
assert json_info["name"] == "json"
assert "loads" in json_info["public"]
assert all(not name.startswith("_") for name in json_info["public"])
print("__PYPATH_PASS__")`,
      hints: ['importlib.import_module(module_name) 返回模块对象。', '若模块有 __all__ 就使用它，否则过滤 dir(module)。', '公开名字过滤下划线开头并用 sorted 保持稳定。'],
    },
  ],
};
