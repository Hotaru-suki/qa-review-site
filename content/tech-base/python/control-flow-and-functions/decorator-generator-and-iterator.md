# 装饰器、生成器与迭代器

## 这个知识点在解决什么问题
这三个概念经常一起出现，因为它们都和“函数行为扩展”或“按需产生数据”有关。理解它们，能让你看懂很多测试脚本、工具代码和框架封装。

## 迭代器在解决什么
迭代器表示“一个一个地取元素”，而不是一次性把所有数据都放进内存。

典型场景：
- 遍历大文件
- 遍历数据库查询结果
- 按行处理日志

## 生成器在解决什么
生成器是更方便地构造迭代器的方法。它通过 `yield` 按需产出结果。

```python
def read_ids():
    for i in range(3):
        yield i
```

这适合流式处理，尤其适合大批量测试数据和日志处理。

## 生成器为什么在测试开发里很常见
例如你要处理超大日志文件：

```python
def read_error_lines(path):
    with open(path, "r", encoding="utf-8") as f:
        for line in f:
            if "ERROR" in line:
                yield line
```

这样不会一次性把所有日志读进内存。

## 装饰器在解决什么
装饰器用于在不改原函数核心逻辑的情况下，给它包一层额外行为，例如：
- 打日志
- 计时
- 重试
- 权限检查

例如：

```python
import time

def timing(func):
    def wrapper(*args, **kwargs):
        start = time.time()
        try:
            return func(*args, **kwargs)
        finally:
            print(f"{func.__name__} cost={time.time() - start:.3f}s")
    return wrapper
```

它的本质是“函数接函数，再返回一个新函数”。

## 迭代器、生成器、装饰器之间不要混
- 迭代器：一个一个取数据
- 生成器：构造迭代器的一种方便方式
- 装饰器：包装函数行为

它们经常一起出现在框架代码里，但解决的问题并不相同。

## 测试开发中的常见用法
- 用装饰器给接口调用函数加重试和耗时统计
- 用生成器逐批产生测试数据
- 用迭代器按行处理大日志或大 CSV

## 一个更完整的装饰器例子
### 给接口调用统一加重试和日志

```python
import time

def retry(times=3):
    def deco(func):
        def wrapper(*args, **kwargs):
            last_exc = None
            for attempt in range(1, times + 1):
                try:
                    return func(*args, **kwargs)
                except Exception as exc:
                    last_exc = exc
                    print(f"attempt={attempt} failed: {exc}")
                    time.sleep(0.2)
            raise last_exc
        return wrapper
    return deco
```

这个例子说明：
- 装饰器可以带参数
- 它很适合把“通用控制逻辑”从业务函数里抽出来
- 但如果层数太多，调试栈会更难看

## 生成器和列表推导式的区别
很多人第一次接触时会混：

```python
nums = [x * 2 for x in range(1000000)]
nums_gen = (x * 2 for x in range(1000000))
```

前者会一次性生成完整列表，后者是生成器，按需产出。  
所以在大日志、大批量数据、长任务流水处理中，生成器通常更省内存。

## 什么时候用它们最值当
### 装饰器
- 当多个函数都要加同一层行为
- 比如统一计时、鉴权、重试、埋点

### 生成器
- 当数据量大
- 当你是顺序消费数据
- 当不需要一次性随机访问全部结果

### 迭代器
- 当对象本身天然适合“一个一个读”
- 比如文件句柄、数据库游标、分页结果

## 常见排障点
- 装饰器包装后报错栈太深，看不清原函数
- 生成器被消费过一次，第二次结果为空
- 本来需要随机访问，却误用了生成器，后面代码难写

## 常见误区
- 生成器只消费一次，结果第二次遍历发现没数据
- 装饰器包太多层后，不知道原函数在哪里报错
- 为了小数据也过度抽象，反而让代码更难读
- 觉得“高级写法一定更好”，结果牺牲了可读性
