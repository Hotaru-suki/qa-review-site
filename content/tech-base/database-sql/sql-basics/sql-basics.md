# 01 SQL 基础语法

## 摘要

SQL 基础语法解决的是“最常见的数据查询和筛选到底怎么写”。学习这一部分时，重点不是背关键字顺序，而是理解每个子句在结果集加工过程里分别做了什么。

---

## 核心问题

- 理解 `SELECT`、`WHERE`、`GROUP BY`、`HAVING`、`ORDER BY` 的职责差异
- 建立查询书写顺序和逻辑执行顺序的区分意识
- 把 SQL 基础语法和分页、排序、筛选等常见业务场景对应起来

---

## 一条查询语句由什么组成

典型查询结构：

```sql
SELECT 列名
FROM 表名
WHERE 条件
GROUP BY 分组列
HAVING 分组后条件
ORDER BY 排序列
LIMIT 条数 OFFSET 偏移量;
```

书写顺序是这样写，但数据库的典型逻辑执行顺序通常更接近：

```text
FROM -> WHERE -> GROUP BY -> HAVING -> SELECT -> ORDER BY -> LIMIT
```

这个顺序非常重要，因为它决定了：

- `WHERE` 为什么不能直接过滤聚合结果
- `HAVING` 为什么能筛分组后的结果
- 分页为什么最好搭配排序一起使用

---

## 最常用的基础子句

### SELECT

决定“查哪些列”。

```sql
SELECT id, name, score
FROM students;
```

### FROM

决定“从哪张表查”。

### WHERE

决定“先过滤哪些原始记录”。

```sql
SELECT *
FROM students
WHERE score >= 60;
```

常见比较运算符：

- `=`
- `!=` / `<>`
- `>`
- `<`
- `>=`
- `<=`

常见逻辑运算：

- `AND`
- `OR`
- `NOT`

---

## 排序和分页

### ORDER BY

用于排序。

```sql
SELECT name, score
FROM students
ORDER BY score DESC;
```

多列排序示例：

```sql
SELECT *
FROM students
ORDER BY class_name ASC, score DESC;
```

### LIMIT / OFFSET

用于分页。

```sql
SELECT *
FROM students
LIMIT 10 OFFSET 20;
```

表示跳过前 20 条，再取 10 条。

分页时最好总是配合 `ORDER BY` 一起用，否则结果顺序可能不稳定，翻页结果也可能前后不一致。

---

## 模糊匹配

### LIKE

用于按模式匹配字符串。

```sql
SELECT *
FROM students
WHERE name LIKE '张%';
```

通配符：

- `%`：任意多个字符
- `_`：任意一个字符

常见场景：

- 前缀匹配
- 后缀匹配
- 包含某关键词

---

## 分组与聚合

### 常见聚合函数

- `COUNT`
- `SUM`
- `AVG`
- `MAX`
- `MIN`

### GROUP BY

用于按某个维度分组后再统计。

```sql
SELECT class_name, COUNT(*) AS total
FROM students
GROUP BY class_name;
```

### HAVING

用于过滤聚合后的结果。

```sql
SELECT class_name, COUNT(*) AS total
FROM students
GROUP BY class_name
HAVING COUNT(*) >= 30;
```

一句话区分：

- `WHERE` 过滤原始行
- `HAVING` 过滤分组后的结果

---

## 测试和排查中的高频场景

- 用 `WHERE` 筛选某个用户、订单或状态的数据
- 用 `ORDER BY + LIMIT` 查看最新日志、最新订单、最新消息
- 用 `GROUP BY` 统计不同状态、不同渠道、不同日期的数据分布
- 用聚合函数做结果核对和数据验证

这也是为什么测试岗位不能只背语法，还要知道 SQL 在实际工作里拿来干什么。

---

## 常见误区

- 只会按书写顺序背 SQL，不理解逻辑执行顺序
- 用分页时不加排序，导致结果不稳定
- 把 `WHERE` 和 `HAVING` 混用
- 查询时一上来就 `SELECT *`，没有筛选必要字段

---

## 一句话说明

SQL 基础语法里最关键的是理解每个子句的职责。`WHERE` 过滤原始数据，`GROUP BY` 做聚合分组，`HAVING` 过滤分组结果，`ORDER BY` 负责排序，`LIMIT` 负责分页。真正掌握之后，才能把语法稳定地用到数据验证和问题排查里。

---

## 小结

SQL 基础不在于记住多少关键字，而在于理解一条查询语句是如何一步步把原始数据加工成目标结果的。
