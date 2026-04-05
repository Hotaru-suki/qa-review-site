# 文件、JSON 与脚本输入输出

## 摘要

脚本处理里最常见的对象不是复杂算法，而是文本文件、配置文件、日志和 JSON 数据。理解文件读写和 JSON 序列化，意味着你已经开始把 Python 用到真实工具链里。这一类知识点不能只停在 `open`、`read` 和 `json.loads` 的文字说明上，而要同时理解实现、异常、日志和数据流。

---

## 核心问题

- 文件读写为什么不仅仅是 `open` 和 `read`
- JSON 为什么在脚本、接口和配置之间承担桥梁角色
- 路径、编码、异常和日志为什么总是一起出现

---

## 1. 文件处理真正要解决什么

文件处理最关键的不是把内容读出来，而是明确：

- 输入是什么格式
- 编码和换行是否稳定
- 处理后要怎样写回
- 出错时如何保留证据

如果这些边界不清楚，脚本就很容易出现：

- 读错路径
- 编码报错
- JSON 解析失败
- 写回时覆盖原文件
- 排查时完全不知道哪一步出错

---

## 2. 一个基础但合格的实现

```python
import json
import logging
from pathlib import Path

logger = logging.getLogger(__name__)


def load_json(path: str) -> dict:
    file_path = Path(path)
    try:
        with file_path.open("r", encoding="utf-8") as f:
            return json.load(f)
    except FileNotFoundError:
        logger.exception("json file not found: %s", file_path)
        raise
    except json.JSONDecodeError:
        logger.exception("invalid json content: %s", file_path)
        raise
```

这段代码的意义是：

- 用 `Path` 明确路径语义
- 用 `with` 自动关闭文件
- 用明确异常区分“文件不存在”和“格式错误”
- 用日志保留排障证据

---

## 3. 为什么 JSON 这么常见

JSON 的价值在于它天然适合表达结构化数据，因此同时出现在：

- 接口请求和响应
- 配置文件
- 测试数据
- 自动化结果输出

也正因为它跨场景使用，所以很多脚本问题最后都会落到：

- JSON 字段缺失
- 类型不匹配
- 编码异常
- 上下游字段语义不一致

---

## 4. 一个更贴近测试场景的例子

假设你写一个测试脚本，需要：

- 从 `testdata.json` 读取测试账号
- 调接口
- 把结果写入 `result.json`

一个更完整的思路是：

```python
def run_case():
    test_data = load_json("testdata.json")
    response = call_api(test_data["request"])
    save_json("result.json", response)
```

这里你真正要关注的不只是“能不能跑”，还包括：

- `testdata.json` 缺字段怎么办
- `response` 里有不可序列化对象怎么办
- `result.json` 写失败时如何保留失败证据

---

## 5. 写文件时最容易忽略什么

### 5.1 覆盖风险

```python
with open("config.json", "w", encoding="utf-8") as f:
    f.write(content)
```

这种写法虽然简单，但会直接覆盖原文件。对配置类文件，很多时候更稳的做法是：

- 先写临时文件
- 校验成功后再替换

### 5.2 编码和换行

如果输入和输出编码不一致，就容易出现：

- 中文乱码
- JSON 解析失败
- 跨平台换行差异

### 5.3 日志缺失

如果脚本出错时只抛异常、不记录路径和当前步骤，排查效率会很差。

---

## 6. 文件处理和异常、日志是什么关系

文件类问题通常最适合“异常 + 日志”一起处理：

- 异常负责告诉调用方失败了
- 日志负责保留文件路径、步骤和错误现场

例如：

```python
def save_json(path: str, data: dict) -> None:
    file_path = Path(path)
    try:
        with file_path.open("w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
    except OSError:
        logger.exception("write json failed: %s", file_path)
        raise
```

这样你在排查时就能知道：

- 是哪个文件写失败
- 失败发生在读取阶段还是写入阶段
- 堆栈具体落在哪个系统调用

---

## 7. 文件处理和埋点有什么关系

如果是单次脚本，日志通常已经够用；但如果这是长期运行的任务，比如：

- 定时同步任务
- 自动化平台任务
- 数据清洗批处理

那就应该额外补指标，例如：

- `file.read.error`
- `json.decode.error`
- `file.write.error`

这样你才能看趋势，而不是只查单次失败。

---

## 8. 一条实用原则

写文件和 JSON 处理时，始终问自己四个问题：

1. 输入数据从哪里来
2. 中间结构是否稳定
3. 输出写到哪里去
4. 出错时我能留下哪些证据

这四个问题答不清，脚本通常就还停留在“能跑”的阶段，还没到“可维护”的阶段。

---

## 小结

Python 文件和 JSON 处理的关键，是把数据流看清：从哪里来、以什么结构存在、最后要变成什么输出。一个合格的实现，不只要会读写，还要处理异常、记录日志，并在需要时补上指标，让脚本真正进入可维护、可排障的层次。
