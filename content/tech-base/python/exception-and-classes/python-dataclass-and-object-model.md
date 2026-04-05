# dataclass 与对象建模

## 这个知识点在解决什么问题
很多 Python 代码一开始直接用 `dict` 拼数据，短期方便，但数据结构一复杂就开始混乱。`dataclass` 和对象建模解决的是：当数据有明确字段、生命周期和行为时，怎样用更清晰的方式表达它。

## `dataclass` 在解决什么
当一个对象主要是在表达一组字段时，`dataclass` 可以减少很多样板代码。

例如：
```python
from dataclasses import dataclass

@dataclass
class CaseResult:
    case_id: str
    passed: bool
    duration_ms: int
```

它特别适合：
- 测试结果对象
- 配置对象
- 任务描述对象

## 和直接用 `dict` 的区别
`dict` 适合灵活，但：
- 字段名容易写错
- 结构约束弱
- IDE 和阅读体验差

`dataclass` 更适合字段稳定、结构明确的场景。

## 一个测试开发例子
例如把接口测试结果组织成对象：

```python
from dataclasses import dataclass

@dataclass
class ApiCaseResult:
    case_id: str
    passed: bool
    status_code: int
    duration_ms: int
```

相比直接用嵌套字典：
- 字段意图更清楚
- IDE 更容易提示
- 后续转换成 JSON 或报告结构也更清晰

## 为什么这和对象建模有关
对象建模的关键不是“要不要写类”，而是：
- 你的数据有没有稳定结构
- 字段之间有没有明确语义
- 后续是不是会被多处复用

如果答案是“有”，那 `dataclass` 往往比裸 `dict` 更合适。

## 为什么测试开发常会用到
- 测试用例参数对象
- 接口请求/响应模型
- 脚本任务描述
- 报告汇总结果

## 常见误区
- 所有地方都硬上类，导致小脚本过度设计
- 明明对象结构已经稳定，还一直靠嵌套字典拼数据
- 把 `dataclass` 当 ORM 或复杂业务模型的完全替代
- 只把 `dataclass` 当语法糖，不把它当建模约束来用
