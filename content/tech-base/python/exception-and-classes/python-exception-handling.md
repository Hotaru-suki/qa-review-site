# 异常处理在解决什么问题

## 摘要

异常处理的价值不在于“程序别崩”，而在于把错误从正常逻辑里剥离出来，并让调用方知道失败发生在什么位置、是否还能恢复、应该记录什么证据，以及后续怎样定位。真正有用的异常处理，一定同时考虑代码实现、日志、埋点和排障链路。

---

## 核心问题

- 为什么异常不是普通返回值的替代写法
- 捕获异常时真正应该处理什么
- 代码里的异常、日志里的错误和监控埋点之间是什么关系

---

## 1. 异常到底在解决什么

异常最核心的作用，是把“正常路径”和“错误路径”分开。

如果所有错误都靠返回值处理，代码很容易变成这样：

```python
def load_user_profile(user_id):
    result = query_user(user_id)
    if result is None:
        return None

    data = parse_profile(result)
    if data is None:
        return None

    return data
```

这段代码的问题是：

- `None` 到底代表没查到、解析失败，还是别的问题，不清楚
- 调用方拿到 `None` 时，很难知道该怎么处理
- 错误原因在调用链中逐层丢失

而异常能把“出错了，而且是哪类错”明确表达出来。

---

## 2. 为什么异常不是普通返回值的替代写法

异常适合表达“正常流程之外、需要额外处理”的情况，不适合滥用成普通分支控制。

例如：

- 用户不存在，如果业务允许返回空结果，可以不用异常
- 配置文件不存在，如果程序无法继续运行，就应该抛异常
- JSON 格式错误，通常不是正常情况，应该抛异常

判断标准不是“能不能报错”，而是：

- 这是业务允许的正常结果，还是异常状态
- 调用方是否必须知道错误类型
- 当前层有没有能力恢复

---

## 3. 一个更合理的代码实现

下面是一个更完整的配置读取例子：

```python
import json
from pathlib import Path


class ConfigError(Exception):
    """配置相关异常，表示程序无法按预期加载配置。"""


def load_config(path: str) -> dict:
    config_path = Path(path)
    if not config_path.exists():
        raise ConfigError(f"config file not found: {config_path}")

    try:
        with config_path.open("r", encoding="utf-8") as f:
            data = json.load(f)
    except json.JSONDecodeError as exc:
        raise ConfigError(f"invalid json format: {config_path}") from exc

    if "mysql" not in data:
        raise ConfigError("missing required field: mysql")

    return data
```

这段实现的意义是：

- 用自定义异常把“配置错误”单独抽出来
- 用 `raise ... from exc` 保留原始异常链
- 在真正无法继续的地方抛错，而不是返回模糊值

这比单纯 `except Exception: return None` 强很多。

---

## 4. 捕获异常时真正应该做什么

捕获异常不是为了“别报错”，而是为了做下面三件事之一：

- 恢复
- 转换
- 记录并继续抛出

### 4.1 恢复

如果当前位置真的知道怎么恢复，可以捕获后处理。

```python
def parse_retry_count(raw: str) -> int:
    try:
        return int(raw)
    except ValueError:
        return 3
```

这里的默认值策略是清楚的，所以捕获是合理的。

### 4.2 转换

如果底层异常太技术化，可以在更高层转换成业务更能理解的异常。

```python
class OrderSubmitError(Exception):
    pass


def submit_order(payload: dict) -> str:
    try:
        return call_order_service(payload)
    except TimeoutError as exc:
        raise OrderSubmitError("order service timeout") from exc
```

### 4.3 记录并继续抛出

如果当前位置没有能力恢复，但你能补充上下文信息，就可以记录后继续抛出。

```python
import logging

logger = logging.getLogger(__name__)


def sync_user(user_id: int) -> None:
    try:
        do_sync(user_id)
    except Exception:
        logger.exception("sync user failed, user_id=%s", user_id)
        raise
```

这里 `logger.exception(...)` 会自动记录堆栈，非常适合排障。

---

## 5. 最常见的错误写法

### 5.1 直接吞掉异常

```python
try:
    do_work()
except Exception:
    pass
```

这会带来两个问题：

- 错误被吃掉，排查时没有证据
- 调用方误以为逻辑成功执行

### 5.2 捕获过宽却不给上下文

```python
try:
    save_result(data)
except Exception as e:
    print(e)
```

问题是：

- 只有一行打印，缺少堆栈
- 没有业务上下文，不知道是哪条数据、哪个请求出错

### 5.3 重复记录同一个异常

如果底层记录一遍、服务层再记录一遍、接口层再记录一遍，就会造成日志噪音。一个更稳的原则是：

- 能恢复的地方处理
- 最接近边界、最有业务上下文的地方重点记录

---

## 6. 异常和日志是什么关系

异常是代码里的错误表达机制，日志是把错误暴露给人和系统的证据渠道。

它们的关系可以这样理解：

- 异常回答“程序哪里出了什么错”
- 日志回答“这个错误发生时的上下文是什么”

一个真正可排障的错误记录，通常至少需要这些信息：

- 请求 ID / trace ID
- 用户 ID / 订单 ID / 任务 ID
- 当前步骤
- 错误类型
- 堆栈

例如：

```python
import logging

logger = logging.getLogger(__name__)


def process_order(order_id: str, request_id: str) -> None:
    try:
        do_process(order_id)
    except Exception:
        logger.exception(
            "process order failed, request_id=%s order_id=%s",
            request_id,
            order_id,
        )
        raise
```

这段日志的意义在于：

- 能从日志里直接定位到是哪一单
- 能沿着 `request_id` 继续串联上下游日志
- 堆栈还保留着代码现场

---

## 7. 异常和埋点、监控是什么关系

日志解决的是“排查某一次失败”，埋点和监控解决的是“观察一类失败有没有变多”。

它们最好配合使用：

- 异常：表达错误
- 日志：保留单次错误证据
- 埋点 / 指标：统计错误规模和趋势

例如：

```python
def handle_payment(payload: dict, metrics) -> None:
    try:
        submit_payment(payload)
    except TimeoutError:
        metrics.increment("payment.timeout")
        raise
    except ValueError:
        metrics.increment("payment.invalid_payload")
        raise
```

这里的指标意义是：

- `payment.timeout` 增多时，说明依赖服务或网络可能有问题
- `payment.invalid_payload` 增多时，说明调用方或参数校验可能有问题

也就是说，日志让你查单次问题，埋点让你看整体趋势。

---

## 8. 一个完整的工程场景

假设你在写一个“读取配置并初始化数据库连接”的脚本，合理处理链路通常是：

1. 底层函数抛出明确异常，例如 `ConfigError`
2. 中间层补充上下文，例如配置路径、环境名
3. 入口层统一记录日志和退出码
4. 同时上报一个初始化失败指标

代码结构可能像这样：

```python
import logging
import sys

logger = logging.getLogger(__name__)


def main():
    try:
        config = load_config("config.json")
        init_mysql(config["mysql"])
    except ConfigError:
        logger.exception("application start failed: invalid config")
        sys.exit(1)
    except Exception:
        logger.exception("application start failed: unexpected error")
        sys.exit(1)
```

这个结构的价值是：

- 错误类型清楚
- 日志上下文清楚
- 入口行为一致
- 排查时知道先看异常类型，再看日志细节，再看指标趋势

---

## 9. 一条实用原则

写异常处理时，始终问自己四个问题：

1. 这个错误是正常结果，还是异常状态
2. 我当前层能不能恢复
3. 如果不能恢复，我要不要补充上下文再抛出
4. 这个错误需要日志、指标还是两者都要

只要这四个问题答不清，异常处理大概率还停留在“语法层”。

---

## 小结

学异常处理时真正要掌握的，不是只会写 `try/except`，而是错误边界、恢复边界、日志边界和监控边界。一个合格的异常处理实现，既要让代码层知道如何失败，也要让排障链路知道如何看见这次失败、如何统计这类失败。
