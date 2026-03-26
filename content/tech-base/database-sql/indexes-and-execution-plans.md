# 07 索引与执行计划

## 1. 为什么要学习索引与执行计划

很多 SQL “能跑”，但不代表“跑得快”。

面试里常问的其实是：

- 为什么一条 SQL 很慢
- 为什么建了索引还没提速
- 如何判断 SQL 有没有走索引
- `EXPLAIN` 看什么

所以这一部分的核心是：

> 理解数据库为什么快，为什么慢。

---

## 2. 为什么查询会慢

查询慢的常见原因包括：

- 没有索引
- 索引用不上
- 扫描的数据太多
- `JOIN` 条件设计不合理
- 排序、分组代价很大
- 返回数据太多
- SQL 写法让数据库无法高效执行

---

## 3. 什么是全表扫描

全表扫描（Full Table Scan）表示：

> 数据库把表里每一行都看一遍，再判断符不符合条件。

### 3.1 全表扫描一定错吗

不一定。  
如果表很小，全表扫描不一定有明显问题。  
但数据量很大时，全表扫描通常意味着明显性能风险。

---

## 4. 索引什么时候更容易发挥作用

索引通常更容易在这些场景中发挥价值：

- `WHERE` 精确筛选
- `JOIN` 关联字段
- `ORDER BY` 排序字段
- 范围查询
- 唯一值查询
- 多条件组合查询

---

## 5. 为什么建了索引也可能没用

### 5.1 字段上做了函数或表达式处理

```sql
SELECT *
FROM users
WHERE YEAR(create_time) = 2026;
```

### 5.2 联合索引没有按最左前缀使用

### 5.3 数据量太小

### 5.4 查询返回数据太多

### 5.5 SQL 本身写法不利于索引利用

---

## 6. 联合索引与最左前缀原则再理解

假设联合索引：

```text
(user_id, status, create_time)
```

通常更适合支持：

- `WHERE user_id = ?`
- `WHERE user_id = ? AND status = ?`
- `WHERE user_id = ? AND status = ? AND create_time = ?`

但未必很适合：

- `WHERE status = ?`
- `WHERE create_time = ?`

### 6.1 一句话理解

> 联合索引要尽量从最左边字段开始使用。

---

## 7. 覆盖索引是什么

覆盖索引可以简单理解为：

> 查询需要的字段，索引本身就有，不需要再回表去取。

### 7.1 为什么覆盖索引常常更快

因为它减少了额外回表操作。

---

## 8. EXPLAIN 是什么

`EXPLAIN` 用于查看 SQL 的执行计划。

```sql
EXPLAIN
SELECT *
FROM users
WHERE user_id = 1001;
```

它会告诉你：

- 有没有走索引
- 扫描多少行
- 用什么方式访问数据
- 是否存在额外排序、临时表等开销

---

## 9. EXPLAIN 入门重点看什么

重点先看以下字段：

- `type`
- `key`
- `rows`
- `Extra`

---

## 10. type 怎么理解

`type` 可以粗略理解为：

> 数据访问方式怎么样。

常见值：

- `const`
- `ref`
- `range`
- `index`
- `ALL`

### 10.1 一句话记忆

> `ALL` 一般最差，`const / ref / range` 通常更理想。

---

## 11. key 怎么理解

`key` 表示：

> 实际使用了哪个索引。

如果：

```text
key = NULL
```

通常表示没有用上索引。

---

## 12. rows 怎么理解

`rows` 表示数据库预估要扫描多少行。

通常：

- 越小越好
- 越大说明代价越高

---

## 13. Extra 怎么理解

`Extra` 是附加信息，常见需要关注的值包括：

- `Using where`
- `Using index`
- `Using filesort`
- `Using temporary`

其中：

- `Using filesort`：数据库需要额外排序
- `Using temporary`：可能使用了临时表

---

## 14. 看 EXPLAIN 的基本思路

### 第一步：先看有没有用索引

重点看：

- `key` 是否为 `NULL`
- `type` 是否是 `ALL`

### 第二步：再看扫描行数

看：

- `rows` 是否过大

### 第三步：看额外代价

看：

- 是否有 `Using filesort`
- 是否有 `Using temporary`

---

## 15. 一个简单例子

```sql
EXPLAIN
SELECT *
FROM orders
WHERE user_id = 1001;
```

如果结果里：

- `key = idx_user_id`
- `type = ref`
- `rows = 3`

通常说明走得还不错。

如果：

- `key = NULL`
- `type = ALL`
- `rows = 500000`

通常说明在扫全表。

---

## 16. 测试 / 测开视角如何理解 EXPLAIN

面试里至少要会说：

- `EXPLAIN` 用于看 SQL 执行计划
- 重点看是否走索引、扫描行数、访问方式
- `type = ALL` 往往说明全表扫描
- `key = NULL` 往往说明没用上索引
- `Using filesort` / `Using temporary` 通常值得关注

---

## 17. 面试标准答法

### 17.1 explain 是什么

> `EXPLAIN` 用于查看 SQL 的执行计划，帮助分析查询是否走索引、扫描了多少行、访问方式如何，以及是否有额外排序或临时表等开销。

### 17.2 explain 重点看什么

> 入门阶段重点看 `type`、`key`、`rows`、`Extra`。其中 `type` 看访问方式，`key` 看用了哪个索引，`rows` 看预计扫描行数，`Extra` 看是否出现 `Using filesort`、`Using temporary` 等额外代价。

---

## 18. 当前阶段必须记住的核心点

- 索引是加速查询的目录结构
- 没有索引或索引用不上，SQL 容易变慢
- 联合索引要注意最左前缀原则
- `EXPLAIN` 是查看执行计划的工具
- 看 `EXPLAIN` 先看：`type`、`key`、`rows`、`Extra`
- `type = ALL` 通常意味着全表扫描
- `key = NULL` 通常表示没走索引
- `Using filesort`、`Using temporary` 通常值得关注
