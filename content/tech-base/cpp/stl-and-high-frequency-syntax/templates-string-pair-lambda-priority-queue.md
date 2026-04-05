# C++ 模板补充手册：string、pair、lambda、比较器、自定义排序、priority_queue
## 摘要

C++ 模板补充手册：string、pair、lambda、比较器、自定义排序、priority_queue 属于 C++ 笔试和工程开发中的高频内容，重点在于提升容器、算法和常见语法组合的熟练度。

---

## 核心问题

- 先建立场景和容器选择意识
- 再记高频接口和写法
- 把刷题语法和工程语义区分开

---


## 1. string

### 定义
```cpp
string s = "hello";
string t(5, 'a');   // "aaaaa"
```

### 常用操作
```cpp
s.size();           // 长度
s.empty();          // 是否为空
s.push_back('x');   // 尾插字符
s.pop_back();       // 删除最后一个字符
s.substr(1, 3);     // 从下标1开始取3个字符
s.find("ll");       // 查找子串，找不到返回 string::npos
s += " world";      // 拼接
```

### 遍历
```cpp
for (char c : s) cout << c << ' ';
for (int i = 0; i < s.size(); i++) cout << s[i] << ' ';
```

### Python 对照
```python
s = "hello"
len(s)
s.find("ll")
s[1:4]
s += " world"
```

### 注意
- C++ 的 `string` 可以像数组一样用下标访问。
- `find` 返回的是位置，不是布尔值。
- `string::npos` 表示没找到。

---

## 2. pair

### 定义
```cpp
pair<int, int> p = {1, 2};
pair<string, int> q = {"alice", 18};
```

### 访问
```cpp
cout << p.first << ' ' << p.second << endl;
```

### 创建
```cpp
auto p = make_pair(1, 2);
```

### 排序规则
`pair` 默认先比 `first`，若相等再比 `second`。

```cpp
vector<pair<int,int>> v = {{2,3}, {1,5}, {2,1}};
sort(v.begin(), v.end());
```

排序后：
```cpp
(1,5), (2,1), (2,3)
```

### Python 对照
```python
p = (1, 2)
p[0], p[1]
```

---

## 3. lambda 表达式

### 基本形式
```cpp
[capture](参数列表) -> 返回类型 {
    函数体
};
```

### 最常见写法
```cpp
auto add = [](int a, int b) {
    return a + b;
};
cout << add(2, 3) << endl;
```

### 按值捕获
```cpp
int x = 10;
auto f = [x]() {
    cout << x << endl;
};
```

### 按引用捕获
```cpp
int x = 10;
auto f = [&x]() {
    x++;
};
f();
cout << x << endl;   // 11
```

### 常见用途
- 排序比较器
- 局部小函数
- DFS / 回调

---

## 4. 比较器

比较器本质上是一个规则函数，用于说明：
**谁应该排在前面。**

### sort 默认升序
```cpp
vector<int> v = {4, 2, 5, 1};
sort(v.begin(), v.end());
```

### 降序
```cpp
sort(v.begin(), v.end(), greater<int>());
```

### lambda 比较器
```cpp
sort(v.begin(), v.end(), [](int a, int b) {
    return a > b;   // 降序
});
```

### 排序 pair
```cpp
vector<pair<int,int>> v = {{1,3}, {1,2}, {2,1}};
sort(v.begin(), v.end(), [](const pair<int,int>& a, const pair<int,int>& b) {
    if (a.first != b.first) return a.first < b.first;
    return a.second > b.second;
});
```

含义：
- 第一关键字升序
- 第一关键字相同，第二关键字降序

---

## 5. 自定义排序模板

### 一维数组
```cpp
sort(a.begin(), a.end(), [](int a, int b) {
    return a < b;   // 升序
});
```

### 二维数组
```cpp
vector<vector<int>> a = {{1,3}, {1,2}, {2,5}};
sort(a.begin(), a.end(), [](const vector<int>& x, const vector<int>& y) {
    if (x[0] != y[0]) return x[0] < y[0];
    return x[1] < y[1];
});
```

### 结构体排序
```cpp
struct Node {
    int x, y;
};

vector<Node> v;
sort(v.begin(), v.end(), [](const Node& a, const Node& b) {
    if (a.x != b.x) return a.x < b.x;
    return a.y < b.y;
});
```

---

## 6. priority_queue

### 默认：大根堆
```cpp
priority_queue<int> pq;
pq.push(3);
pq.push(1);
pq.push(5);

cout << pq.top() << endl;   // 5
```

### 常用操作
```cpp
pq.push(x);     // 插入
pq.pop();       // 删除堆顶
pq.top();       // 查看堆顶
pq.empty();     // 判空
pq.size();      // 大小
```

### 小根堆
```cpp
priority_queue<int, vector<int>, greater<int>> pq;
```

### 存 pair，默认先按 first 比，再按 second 比
```cpp
priority_queue<pair<int,int>> pq;
pq.push({2, 3});
pq.push({1, 5});
pq.push({2, 1});

cout << pq.top().first << ' ' << pq.top().second << endl;
```

### 小根堆 pair
```cpp
priority_queue<pair<int,int>, vector<pair<int,int>>, greater<pair<int,int>>> pq;
```

---

## 7. 自定义 priority_queue 比较器

### 写法1：struct 比较器
```cpp
struct cmp {
    bool operator()(const pair<int,int>& a, const pair<int,int>& b) {
        return a.second > b.second;
    }
};

priority_queue<pair<int,int>, vector<pair<int,int>>, cmp> pq;
```

说明：
- `second` 小的优先级更高
- 这个写法常用于最短路、调度问题

---

## 8. 常见模板

### 按第二关键字升序排序
```cpp
sort(v.begin(), v.end(), [](const pair<int,int>& a, const pair<int,int>& b) {
    return a.second < b.second;
});
```

### 按长度排序字符串
```cpp
sort(words.begin(), words.end(), [](const string& a, const string& b) {
    return a.size() < b.size();
});
```

### priority_queue 小根堆
```cpp
priority_queue<int, vector<int>, greater<int>> pq;
```

### Top K 大元素：维护小根堆
```cpp
priority_queue<int, vector<int>, greater<int>> pq;
for (int x : nums) {
    pq.push(x);
    if (pq.size() > k) pq.pop();
}
cout << pq.top() << endl;
```

---

## 9. Python 对照

### 排序
```python
nums.sort()
nums.sort(reverse=True)
nums.sort(key=lambda x: x[1])
```

### 堆
```python
import heapq

h = []
heapq.heappush(h, 3)
heapq.heappush(h, 1)
heapq.heappush(h, 5)
heapq.heappop(h)
```

注意：
- Python 默认是小根堆
- C++ 默认是大根堆

---

## 10. 高频误区

### 误区1
`sort` 比较器里写 `<=`
错误。比较器必须写严格规则，通常写 `<` 或 `>`。

### 误区2
把 `priority_queue` 当成完全排序容器
错误。它只能保证堆顶最大/最小，不保证整体有序。

### 误区3
不会区分大根堆和小根堆
- C++ 默认大根堆
- Python `heapq` 默认小根堆

### 误区4
lambda 捕获乱写
- `[x]`：按值捕获
- `[&x]`：按引用捕获
- `[&]`：全部按引用
- `[=]`：全部按值

---

## 11. 刷题建议

优先掌握这几组：

1. `sort + lambda`
2. `vector<pair<int,int>>` 排序
3. `priority_queue` 大根堆 / 小根堆
4. `string` 常用操作
5. `pair` 的默认比较规则

这几组已经覆盖大部分笔试与算法题场景。
