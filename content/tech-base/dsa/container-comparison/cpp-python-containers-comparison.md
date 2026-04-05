# C++ 容器与 Python 容器完整对照手册
## 摘要

C++ 容器与 Python 容器完整对照手册 用于建立不同语言和不同容器之间的映射关系，重点是理解能力边界和适用场景，而不是机械对照接口。

---

## 核心问题

- 从复杂度和操作模式理解容器差异
- 知道同一问题为什么会选不同容器
- 形成跨语言迁移时的结构直觉

---


> 目标：面向算法、笔试、面试、日常开发，系统整理 C++ STL 常见容器与 Python 对应容器、常用操作、复杂度、适用场景与易错点。  
> 重点不是死背语法，而是形成“该用哪个容器”的判断能力。

---

# 1. 总览

## 1.1 什么是容器
容器本质上就是“存放一组数据的数据结构”。

你需要根据需求选择不同容器：

- 要顺序存储、支持下标访问
- 要快速查找某个值是否存在
- 要维护键值对
- 要自动去重
- 要按先进先出 / 后进先出处理
- 要每次快速拿到最大值或最小值
- 要自动有序

---

## 1.2 C++ 与 Python 容器思维差异

### Python
Python 容器更偏“高级封装”：

- 写法短
- 动态类型
- 很多底层细节被隐藏
- 上手快
- 算法题开发效率高

但缺点是：

- 底层结构感不够强
- 有些操作虽然写法简单，但代价不低
- 性能控制不如 C++ 细

### C++
C++ 容器更偏“工程化和性能控制”：

- 类型明确
- 容器分类更细
- 性能和行为更可控
- 更强调底层数据结构差异

但代价是：

- 语法更复杂
- 容器选择更讲究
- 初学者容易混淆 `map / unordered_map / set / unordered_set` 等概念

---

## 1.3 核心对应表

| 功能 | Python | C++ | 说明 |
|---|---|---|---|
| 动态顺序表 | `list` | `vector` | 最常用 |
| 双端队列 | `collections.deque` | `deque` | 头尾操作高效 |
| 栈 | `list` / `deque` | `stack` | 后进先出 |
| 队列 | `deque` | `queue` | 先进先出 |
| 堆 / 优先队列 | `heapq` | `priority_queue` | 取最大/最小 |
| 哈希映射 | `dict` | `unordered_map` | 键值映射 |
| 有序映射 | 无直接标准等价 | `map` | 自动按 key 排序 |
| 哈希集合 | `set` | `unordered_set` | 去重、判存在 |
| 有序集合 | 无直接标准等价 | `set` | 自动排序 |
| 固定长度数组 | 一般不用单独容器 | `array` | 长度固定 |
| 链表 | 一般自己写节点类 | `list` | 中间插删方便但不常用 |
| 多重集合 | `collections.Counter`（近似） | `multiset` | 允许重复且有序 |
| 多重映射 | 无直接标准等价 | `multimap` | 一个键可对应多个值 |

---

# 2. C++ 头文件速查

```cpp
#include <vector>
#include <string>
#include <deque>
#include <stack>
#include <queue>
#include <map>
#include <unordered_map>
#include <set>
#include <unordered_set>
#include <array>
#include <list>
#include <algorithm>
#include <utility>
```

常见说明：

- `vector`：动态数组
- `string`：字符串
- `deque`：双端队列
- `stack`：栈
- `queue`：队列
- `priority_queue`：优先队列，定义在 `<queue>` 中
- `map / multimap`：有序映射
- `unordered_map`：哈希映射
- `set / multiset`：有序集合
- `unordered_set`：哈希集合
- `array`：固定长度数组
- `list`：双向链表
- `algorithm`：排序、查找、反转等算法
- `utility`：`pair`

---

# 3. vector vs Python list

## 3.1 定义

### Python
```python
nums = [1, 2, 3]
```

### C++
```cpp
vector<int> nums = {1, 2, 3};
```

---

## 3.2 常用操作对照

| 功能 | Python `list` | C++ `vector` |
|---|---|---|
| 创建 | `a = [1,2,3]` | `vector<int> a = {1,2,3};` |
| 尾部插入 | `a.append(x)` | `a.push_back(x);` |
| 尾部删除 | `a.pop()` | `a.pop_back();` |
| 访问第 i 个 | `a[i]` | `a[i]` |
| 修改第 i 个 | `a[i] = x` | `a[i] = x;` |
| 长度 | `len(a)` | `a.size()` |
| 判空 | `len(a)==0` | `a.empty()` |
| 遍历 | `for x in a:` | `for (int x : a)` |
| 排序 | `a.sort()` | `sort(a.begin(), a.end());` |
| 反转 | `a.reverse()` | `reverse(a.begin(), a.end());` |
| 清空 | `a.clear()` | `a.clear();` |
| 插入到中间 | `a.insert(i, x)` | `a.insert(a.begin()+i, x);` |
| 删除中间元素 | `a.pop(i)` / `del a[i]` | `a.erase(a.begin()+i);` |

---

## 3.3 复杂度

| 操作 | Python `list` | C++ `vector` |
|---|---|---|
| 尾插 | 平均 O(1) | 平均 O(1) |
| 尾删 | O(1) | O(1) |
| 随机访问 | O(1) | O(1) |
| 中间插入 | O(n) | O(n) |
| 中间删除 | O(n) | O(n) |
| 头部插入删除 | O(n) | O(n) |

---

## 3.4 适用场景

- 数组题
- 双指针
- 滑动窗口
- 动态规划
- 图的邻接表
- 存结果、存路径

---

## 3.5 易错点

1. Python 的 `list` 本质上更接近 C++ 的 `vector`，**不是链表**。
2. `vector.erase()` 删除中间元素后，后面的元素会前移，迭代器可能失效。
3. 在头部频繁插删时，不要用 `vector/list`，应该考虑 `deque`。

---

# 4. deque（双端队列）

## 4.1 定义

### Python
```python
from collections import deque
q = deque([1, 2, 3])
```

### C++
```cpp
deque<int> q = {1, 2, 3};
```

---

## 4.2 常用操作对照

| 功能 | Python `deque` | C++ `deque` |
|---|---|---|
| 右侧插入 | `q.append(x)` | `q.push_back(x);` |
| 左侧插入 | `q.appendleft(x)` | `q.push_front(x);` |
| 右侧删除 | `q.pop()` | `q.pop_back();` |
| 左侧删除 | `q.popleft()` | `q.pop_front();` |
| 访问左端 | `q[0]` | `q.front()` |
| 访问右端 | `q[-1]` | `q.back()` |
| 长度 | `len(q)` | `q.size()` |
| 判空 | `len(q)==0` | `q.empty()` |
| 清空 | `q.clear()` | `q.clear();` |

---

## 4.3 复杂度

| 操作 | Python `deque` | C++ `deque` |
|---|---|---|
| 头插 | O(1) | O(1) |
| 尾插 | O(1) | O(1) |
| 头删 | O(1) | O(1) |
| 尾删 | O(1) | O(1) |
| 随机访问 | O(1)（但通常不主打） | O(1) |

---

## 4.4 适用场景

- 单调队列
- BFS
- 滑动窗口最大值 / 最小值
- 双端处理问题

---

## 4.5 易错点

1. Python 做队列不要用 `list.pop(0)`，因为是 O(n)。
2. 需要两端高效操作时，优先考虑 `deque`。

---

# 5. stack（栈）

## 5.1 定义

### Python
Python 常直接用 `list` 模拟：

```python
st = []
```

也可用 `deque`：

```python
from collections import deque
st = deque()
```

### C++
```cpp
stack<int> st;
```

---

## 5.2 常用操作对照

| 功能 | Python `list` / `deque` | C++ `stack` |
|---|---|---|
| 入栈 | `st.append(x)` | `st.push(x);` |
| 出栈 | `st.pop()` | `st.pop();` |
| 取栈顶 | `st[-1]` | `st.top()` |
| 判空 | `len(st)==0` | `st.empty()` |
| 长度 | `len(st)` | `st.size()` |

注意：C++ 的 `stack.pop()` **没有返回值**。

正确写法：

```cpp
int x = st.top();
st.pop();
```

---

## 5.3 复杂度

| 操作 | Python 栈模拟 | C++ `stack` |
|---|---|---|
| 入栈 | O(1) | O(1) |
| 出栈 | O(1) | O(1) |
| 查看栈顶 | O(1) | O(1) |

---

## 5.4 适用场景

- 括号匹配
- 单调栈
- 表达式求值
- DFS（手动栈）
- 撤销 / 回退操作

---

## 5.5 易错点

1. C++ `stack` 是容器适配器，不支持遍历。
2. `pop()` 不返回元素，这点很容易按 Python 习惯写错。

---

# 6. queue（队列）

## 6.1 定义

### Python
```python
from collections import deque
q = deque()
```

### C++
```cpp
queue<int> q;
```

---

## 6.2 常用操作对照

| 功能 | Python `deque` | C++ `queue` |
|---|---|---|
| 入队 | `q.append(x)` | `q.push(x);` |
| 出队 | `q.popleft()` | `q.pop();` |
| 队首 | `q[0]` | `q.front()` |
| 队尾 | `q[-1]` | `q.back()` |
| 判空 | `len(q)==0` | `q.empty()` |
| 长度 | `len(q)` | `q.size()` |

同样地，C++ `queue.pop()` 也没有返回值。

---

## 6.3 复杂度

| 操作 | Python `deque` | C++ `queue` |
|---|---|---|
| 入队 | O(1) | O(1) |
| 出队 | O(1) | O(1) |
| 查看队首 | O(1) | O(1) |

---

## 6.4 适用场景

- BFS
- 层序遍历
- 任务调度
- 模拟排队

---

## 6.5 易错点

1. Python 队列不要用 `list.pop(0)`。
2. C++ `queue` 也不支持随意遍历。

---

# 7. priority_queue / heapq（优先队列 / 堆）

## 7.1 概念

- 堆：底层数据结构
- 优先队列：对外的“按优先级取元素”接口

在做题时常近似看作一类工具，但严格讲不完全等价。

---

## 7.2 默认行为差异

| 语言 | 工具 | 默认类型 |
|---|---|---|
| Python | `heapq` | 小根堆 |
| C++ | `priority_queue` | 大根堆 |

这是高频易错点。

---

## 7.3 定义与常用操作

### Python
```python
import heapq
h = []
heapq.heappush(h, 3)
heapq.heappush(h, 1)
heapq.heappush(h, 2)
mn = heapq.heappop(h)
```

### C++
```cpp
priority_queue<int> pq;
pq.push(3);
pq.push(1);
pq.push(2);
int mx = pq.top();
pq.pop();
```

---

## 7.4 操作对照

| 功能 | Python `heapq` | C++ `priority_queue` |
|---|---|---|
| 插入 | `heapq.heappush(h, x)` | `pq.push(x);` |
| 取堆顶 | `h[0]` | `pq.top()` |
| 弹出堆顶 | `heapq.heappop(h)` | `pq.pop();` |
| 判空 | `len(h)==0` | `pq.empty()` |
| 长度 | `len(h)` | `pq.size()` |
| 建堆 | `heapq.heapify(h)` | 通常逐个 `push` |

---

## 7.5 C++ 小根堆写法

```cpp
priority_queue<int, vector<int>, greater<int>> pq;
```

需要：

```cpp
#include <queue>
#include <vector>
#include <functional>
```

---

## 7.6 复杂度

| 操作 | Python `heapq` | C++ `priority_queue` |
|---|---|---|
| 插入 | O(log n) | O(log n) |
| 弹出堆顶 | O(log n) | O(log n) |
| 查看堆顶 | O(1) | O(1) |

---

## 7.7 适用场景

- Top K
- Dijkstra
- 合并有序链表
- 调度问题
- 贪心选当前最优

---

## 7.8 易错点

1. Python 默认小根堆，C++ 默认大根堆。
2. C++ `priority_queue.pop()` 不返回值。
3. Python 的 `heapq` 更像对 `list` 做堆操作；C++ 的 `priority_queue` 更像封装好的优先队列。

---

# 8. dict / unordered_map / map

这是面试中最重要的一组映射容器。

## 8.1 定义

### Python
```python
mp = {}
mp["a"] = 1
```

### C++ 哈希映射
```cpp
unordered_map<string, int> mp;
mp["a"] = 1;
```

### C++ 有序映射
```cpp
map<string, int> mp;
mp["a"] = 1;
```

---

## 8.2 `unordered_map` 与 `map` 区别

| 对比项 | `unordered_map` | `map` |
|---|---|---|
| 底层 | 哈希表 | 红黑树等平衡树 |
| 是否有序 | 无序 | 按 key 自动排序 |
| 平均查找 | O(1) | O(log n) |
| 适用重点 | 快速查找 | 需要自动有序 |

Python `dict` 更接近 `unordered_map`。

---

## 8.3 常用操作对照

| 功能 | Python `dict` | C++ `unordered_map/map` |
|---|---|---|
| 创建 | `mp = {}` | `unordered_map<int,int> mp;` |
| 插入/修改 | `mp[k] = v` | `mp[k] = v;` |
| 访问 | `mp[k]` | `mp[k]` |
| 判断 key 是否存在 | `k in mp` | `mp.find(k) != mp.end()` |
| 删除 | `del mp[k]` / `mp.pop(k)` | `mp.erase(k);` |
| 长度 | `len(mp)` | `mp.size()` |
| 判空 | `len(mp)==0` | `mp.empty()` |
| 遍历键值对 | `for k,v in mp.items():` | `for (auto &[k,v] : mp)` |
| 清空 | `mp.clear()` | `mp.clear();` |

---

## 8.4 复杂度

### Python `dict`
| 操作 | 复杂度 |
|---|---|
| 插入 | 平均 O(1) |
| 查找 | 平均 O(1) |
| 删除 | 平均 O(1) |

### C++ `unordered_map`
| 操作 | 复杂度 |
|---|---|
| 插入 | 平均 O(1) |
| 查找 | 平均 O(1) |
| 删除 | 平均 O(1) |

### C++ `map`
| 操作 | 复杂度 |
|---|---|
| 插入 | O(log n) |
| 查找 | O(log n) |
| 删除 | O(log n) |

---

## 8.5 适用场景

- 两数之和
- 字符频率统计
- 前缀和计数
- 记录下标
- 建图
- 状态压缩映射

---

## 8.6 易错点

1. `map` 不是哈希表。
2. `unordered_map` 才更接近 Python `dict`。
3. 在 C++ 中，`mp[k]` 若 key 不存在，可能会自动插入默认值。
4. 只判断存在性时，优先 `find` / `count`，不要乱用 `mp[k]`。

---

# 9. set / unordered_set / multiset

## 9.1 定义

### Python
```python
s = set()
s.add(1)
```

### C++ 哈希集合
```cpp
unordered_set<int> s;
s.insert(1);
```

### C++ 有序集合
```cpp
set<int> s;
s.insert(1);
```

### C++ 多重集合
```cpp
multiset<int> ms;
ms.insert(1);
ms.insert(1);
```

---

## 9.2 区别

| 容器 | 是否有序 | 是否允许重复 |
|---|---|---|
| Python `set` | 无序 | 否 |
| C++ `unordered_set` | 无序 | 否 |
| C++ `set` | 有序 | 否 |
| C++ `multiset` | 有序 | 是 |

---

## 9.3 常用操作对照

| 功能 | Python `set` | C++ `unordered_set/set` |
|---|---|---|
| 创建 | `s = set()` | `unordered_set<int> s;` |
| 插入 | `s.add(x)` | `s.insert(x);` |
| 删除 | `s.remove(x)` / `s.discard(x)` | `s.erase(x);` |
| 判断存在 | `x in s` | `s.find(x) != s.end()` 或 `s.count(x)` |
| 长度 | `len(s)` | `s.size()` |
| 判空 | `len(s)==0` | `s.empty()` |
| 清空 | `s.clear()` | `s.clear();` |

---

## 9.4 复杂度

### Python `set`
| 操作 | 复杂度 |
|---|---|
| 插入 | 平均 O(1) |
| 查找 | 平均 O(1) |
| 删除 | 平均 O(1) |

### C++ `unordered_set`
| 操作 | 复杂度 |
|---|---|
| 插入 | 平均 O(1) |
| 查找 | 平均 O(1) |
| 删除 | 平均 O(1) |

### C++ `set / multiset`
| 操作 | 复杂度 |
|---|---|
| 插入 | O(log n) |
| 查找 | O(log n) |
| 删除 | O(log n) |

---

## 9.5 适用场景

- 去重
- 快速判断元素是否存在
- 自动有序维护
- 维护有序窗口
- 求前驱后继（`set` 更方便）

---

## 9.6 易错点

1. Python `set` 更接近 C++ `unordered_set`，不是 `set`。
2. `multiset` 允许重复，`set` 不允许重复。
3. `multiset.erase(x)` 会删掉所有值为 `x` 的元素；若只删一个，要先 `find` 再按迭代器删。

示例：

```cpp
auto it = ms.find(x);
if (it != ms.end()) ms.erase(it);
```

---

# 10. string

虽然 `string` 不总被单独归为典型容器，但刷题中频率极高，必须单独列。

## 10.1 定义

### Python
```python
s = "hello"
```

### C++
```cpp
string s = "hello";
```

---

## 10.2 常用操作对照

| 功能 | Python `str` | C++ `string` |
|---|---|---|
| 长度 | `len(s)` | `s.size()` / `s.length()` |
| 访问字符 | `s[i]` | `s[i]` |
| 拼接 | `s1 + s2` | `s1 + s2` |
| 子串 | `s[l:r]` | `s.substr(pos, len)` |
| 查找 | `s.find("ab")` | `s.find("ab")` |
| 排序字符 | `''.join(sorted(s))` | `sort(s.begin(), s.end());` |
| 反转 | `s[::-1]` | `reverse(s.begin(), s.end());` |

---

## 10.3 易错点

1. Python 字符串不可变；C++ `string` 可修改。
2. C++ `substr(pos, len)` 第二个参数是长度，不是结束位置。

---

# 11. array（固定长度数组）

## 11.1 定义

### Python
通常直接用 `list`，很少强调固定数组容器。

### C++
```cpp
array<int, 3> a = {1, 2, 3};
```

---

## 11.2 常用操作

| 功能 | C++ `array` |
|---|---|
| 访问 | `a[i]` |
| 长度 | `a.size()` |
| 判空 | `a.empty()` |
| 首元素 | `a.front()` |
| 尾元素 | `a.back()` |
| 遍历 | `for (int x : a)` |

---

## 11.3 特点

- 长度固定
- 比原生数组更安全
- 支持 STL 接口

---

## 11.4 适用场景

- 明确固定长度的小数组
- 替代 C 风格数组

---

# 12. list（双向链表）

## 12.1 定义

### C++
```cpp
list<int> lst = {1, 2, 3};
```

Python 标准开发里通常没有直接等价的链表容器，一般自己写节点类。

---

## 12.2 常用操作

| 功能 | C++ `list` |
|---|---|
| 头插 | `lst.push_front(x);` |
| 尾插 | `lst.push_back(x);` |
| 头删 | `lst.pop_front();` |
| 尾删 | `lst.pop_back();` |
| 首元素 | `lst.front()` |
| 尾元素 | `lst.back()` |
| 判空 | `lst.empty()` |
| 长度 | `lst.size()` |
| 清空 | `lst.clear()` |

---

## 12.3 特点

- 中间插删方便
- 不能随机访问
- 缓存局部性差
- 算法题中实际使用频率不高

---

## 12.4 易错点

1. 不要把 C++ `list` 和 Python `list` 视为同类。
2. Python `list` 不是链表，C++ `list` 才是双向链表。
3. 很多场景下 `vector` 实际性能反而更好。

---

# 13. pair / tuple

严格说它们不是容器，但经常与容器一起使用，必须会。

## 13.1 定义

### Python
```python
p = (1, "abc")
```

### C++
```cpp
pair<int, string> p = {1, "abc"};
```

---

## 13.2 访问

### Python
```python
x = p[0]
y = p[1]
```

### C++
```cpp
int x = p.first;
string y = p.second;
```

---

## 13.3 常见用途

- `vector<pair<int,int>>`
- `map<int,int>` 的遍历元素本质也是 pair
- 图论中的 `(邻点, 权值)`
- 区间 `(l, r)`

---

# 14. 常见遍历写法对照

## 14.1 vector / list

### Python
```python
for x in nums:
    print(x)

for i, x in enumerate(nums):
    print(i, x)
```

### C++
```cpp
for (int x : nums) {
    cout << x << endl;
}

for (int i = 0; i < nums.size(); i++) {
    cout << i << ' ' << nums[i] << endl;
}
```

---

## 14.2 map / unordered_map

### Python
```python
for k, v in mp.items():
    print(k, v)
```

### C++
```cpp
for (auto &[k, v] : mp) {
    cout << k << ' ' << v << endl;
}
```

---

## 14.3 set

### Python
```python
for x in s:
    print(x)
```

### C++
```cpp
for (int x : s) {
    cout << x << endl;
}
```

---

# 15. 常见排序写法对照

## 15.1 普通排序

### Python
```python
nums.sort()
nums.sort(reverse=True)
```

### C++
```cpp
sort(nums.begin(), nums.end());
sort(nums.begin(), nums.end(), greater<int>());
```

---

## 15.2 pair 排序

### Python
```python
pairs.sort(key=lambda x: x[0])
pairs.sort(key=lambda x: (x[0], x[1]))
```

### C++
默认按 `first` 再按 `second` 升序：

```cpp
sort(pairs.begin(), pairs.end());
```

自定义：

```cpp
sort(pairs.begin(), pairs.end(), [](auto &a, auto &b) {
    return a.second < b.second;
});
```

---

# 16. 算法题选型速查

| 需求 | Python | C++ |
|---|---|---|
| 普通数组 | `list` | `vector` |
| 快速哈希查找 | `dict` | `unordered_map` |
| 快速去重判存在 | `set` | `unordered_set` |
| 自动有序映射 | 一般手动排序 | `map` |
| 自动有序集合 | 一般手动排序 | `set` |
| BFS | `deque` | `queue` |
| 单调队列 | `deque` | `deque` |
| 栈题 | `list` | `stack` |
| Top K | `heapq` | `priority_queue` |
| 固定长度数组 | `list` | `array` |
| 链表容器 | 自写节点 | `list`（但少用） |

---

# 17. 高频误区总表

## 17.1 Python `list` 不是 C++ `list`

- Python `list` ≈ C++ `vector`
- C++ `list` 是双向链表

---

## 17.2 `map` 不是哈希表

- `map`：有序树结构
- `unordered_map`：哈希表

---

## 17.3 Python `set` 更像 `unordered_set`

不是 C++ 的有序 `set`。

---

## 17.4 `priority_queue.pop()` / `stack.pop()` / `queue.pop()` 都不返回值

这在 C++ 里很容易错。

错误写法：

```cpp
int x = pq.pop();
```

正确写法：

```cpp
int x = pq.top();
pq.pop();
```

---

## 17.5 `mp[k]` 可能会自动插入

若只是判断 key 存不存在，优先：

```cpp
if (mp.find(k) != mp.end())
```

---

## 17.6 删除容器元素可能导致迭代器失效

典型如 `vector.erase()`。

---

# 18. 复杂度总表

| 容器 | 插入 | 删除 | 查找/访问 | 是否有序 | 是否允许重复 |
|---|---|---|---|---|---|
| Python `list` | 尾 O(1)，中间 O(n) | 尾 O(1)，中间 O(n) | 下标 O(1) | 否 | 是 |
| C++ `vector` | 尾 O(1)，中间 O(n) | 尾 O(1)，中间 O(n) | 下标 O(1) | 否 | 是 |
| Python `deque` | 两端 O(1) | 两端 O(1) | 两端 O(1) | 否 | 是 |
| C++ `deque` | 两端 O(1) | 两端 O(1) | 下标 O(1) | 否 | 是 |
| C++ `stack` | O(1) | O(1) | 栈顶 O(1) | 否 | 是 |
| C++ `queue` | O(1) | O(1) | 队首 O(1) | 否 | 是 |
| Python `heapq` | O(log n) | O(log n) | 堆顶 O(1) | 堆序 | 是 |
| C++ `priority_queue` | O(log n) | O(log n) | 堆顶 O(1) | 堆序 | 是 |
| Python `dict` | 平均 O(1) | 平均 O(1) | 平均 O(1) | 保留插入顺序但非 key 排序 | key 唯一 |
| C++ `unordered_map` | 平均 O(1) | 平均 O(1) | 平均 O(1) | 否 | key 唯一 |
| C++ `map` | O(log n) | O(log n) | O(log n) | 按 key 排序 | key 唯一 |
| Python `set` | 平均 O(1) | 平均 O(1) | 平均 O(1) | 否 | 否 |
| C++ `unordered_set` | 平均 O(1) | 平均 O(1) | 平均 O(1) | 否 | 否 |
| C++ `set` | O(log n) | O(log n) | O(log n) | 有序 | 否 |
| C++ `multiset` | O(log n) | O(log n) | O(log n) | 有序 | 是 |
| C++ `array` | 固定长度 | 固定长度 | O(1) | 否 | 是 |
| C++ `list` | 已知位置插删 O(1) | 已知位置插删 O(1) | 查找 O(n) | 否 | 是 |

---

# 19. 学习优先级建议

如果你的目标是：

- 算法题
- 测开笔试
- C++ 面试

优先级应当是：

## 第一层：必须吃透
- `vector`
- `string`
- `unordered_map`
- `unordered_set`

## 第二层：高频必会
- `stack`
- `queue`
- `deque`
- `priority_queue`

## 第三层：要会但不用最先深入
- `map`
- `set`

## 第四层：了解即可
- `multiset`
- `multimap`
- `array`
- `list`

---

# 20. 最终选型口诀

## 20.1 如果要……该选什么

### 1）存一串数据，频繁下标访问
- Python：`list`
- C++：`vector`

### 2）键值映射，要求查找快
- Python：`dict`
- C++：`unordered_map`

### 3）判断某元素是否存在，顺便去重
- Python：`set`
- C++：`unordered_set`

### 4）需要先进先出
- Python：`deque`
- C++：`queue`

### 5）需要后进先出
- Python：`list`
- C++：`stack`

### 6）每次取最大/最小
- Python：`heapq`
- C++：`priority_queue`

### 7）需要自动排序
- C++：`map` / `set`
- Python：通常手动排序处理

---

## 20.2 一句话总结

- Python 更像：先写出来，底层细节语言替你管。
- C++ 更像：先想需求，再选容器。

真正的核心不是“会不会写语法”，而是：

> 这题到底该用 `vector`、`unordered_map`、`set`、`queue` 还是 `priority_queue`？

这才是容器学习的重点。

---

# 21. 附：最常用最小模板

## 21.1 vector
```cpp
vector<int> a;
a.push_back(1);
cout << a[0] << endl;
```

## 21.2 unordered_map
```cpp
unordered_map<int, int> mp;
mp[1] = 100;
if (mp.find(1) != mp.end()) {
    cout << mp[1] << endl;
}
```

## 21.3 unordered_set
```cpp
unordered_set<int> s;
s.insert(1);
if (s.count(1)) {
    cout << "yes" << endl;
}
```

## 21.4 stack
```cpp
stack<int> st;
st.push(1);
int x = st.top();
st.pop();
```

## 21.5 queue
```cpp
queue<int> q;
q.push(1);
int x = q.front();
q.pop();
```

## 21.6 priority_queue
```cpp
priority_queue<int> pq;
pq.push(3);
pq.push(1);
pq.push(2);
cout << pq.top() << endl;
```

## 21.7 小根堆
```cpp
priority_queue<int, vector<int>, greater<int>> pq;
```

## 21.8 map
```cpp
map<int, int> mp;
mp[3] = 10;
mp[1] = 20;
for (auto &[k, v] : mp) {
    cout << k << ' ' << v << endl;
}
```

## 21.9 set
```cpp
set<int> s;
s.insert(3);
s.insert(1);
s.insert(2);
for (int x : s) {
    cout << x << ' ';
}
```

---

# 22. 结束语

这份文档适合做三种用途：

1. 容器入门总览
2. 算法刷题速查
3. 面试前快速回顾

但要注意：

- 不要平均用力
- 不要一开始钻 `list`、`multimap` 这类低频项
- 先把 `vector / unordered_map / unordered_set / stack / queue / priority_queue` 吃透

这才是当前阶段投入产出比最高的路线。
