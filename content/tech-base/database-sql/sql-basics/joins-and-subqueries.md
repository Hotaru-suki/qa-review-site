# 02 SQL 连接与子查询

## 摘要

连接与子查询解决的是“单表不够时，如何把多张表的数据组合起来，或者先查一个结果再拿这个结果继续查”。它是 SQL 从基础筛选走向业务查询的关键一步。

---

## 核心问题

- 区分 `JOIN` 和 `UNION` 的本质差异
- 理解 `INNER JOIN`、`LEFT JOIN` 的典型使用方式
- 掌握子查询在筛选、存在性判断和排名问题中的常见写法

---

## JOIN 和 UNION 的区别

- `JOIN`：横向组合，多数情况下列会变多
- `UNION`：纵向合并，多数情况下行会变多

理解时可以这样记：

- `JOIN` 解决“把两张表按关联关系拼起来”
- `UNION` 解决“把两个结果集合并到一起”

---

## 常见连接方式

### INNER JOIN

只保留两边都能匹配上的记录。

```sql
SELECT s.name, c.class_name
FROM students s
INNER JOIN classes c
ON s.class_id = c.class_id;
```

### LEFT JOIN

左表全部保留，右表匹配不上时补 `NULL`。

```sql
SELECT s.name, c.class_name
FROM students s
LEFT JOIN classes c
ON s.class_id = c.class_id;
```

在测试和排查里，`LEFT JOIN` 特别适合查“左边有、右边没有”的缺失数据。

```sql
SELECT o.*
FROM orders o
LEFT JOIN payments p
ON o.order_id = p.order_id
WHERE p.order_id IS NULL;
```

这类写法常用于排查：

- 订单已创建但支付记录缺失
- 主表有数据但明细表没有同步生成
- 上游已写入、下游未落库

---

## LEFT JOIN 中 ON 和 WHERE 的区别

这是高频易错点。

### 条件写在 ON

表示“连接时按什么条件接”。

```sql
SELECT o.order_id, p.status
FROM orders o
LEFT JOIN payments p
ON o.order_id = p.order_id
AND p.status = 'success';
```

左表仍然会全部保留。

### 条件写在 WHERE

表示“连接完成后，最终保留哪些结果”。

```sql
SELECT o.order_id, p.status
FROM orders o
LEFT JOIN payments p
ON o.order_id = p.order_id
WHERE p.status = 'success';
```

这会把右表为 `NULL` 的行也过滤掉，很多时候效果接近 `INNER JOIN`。

---

## 子查询是什么

子查询就是在一条查询里嵌套另一条查询，用于先得到一个中间结果，再基于它继续筛选。

### 标量子查询

返回一个值。

```sql
SELECT *
FROM students
WHERE score = (
  SELECT MAX(score)
  FROM students
);
```

### IN 子查询

返回多个值，用于集合过滤。

```sql
SELECT *
FROM students
WHERE class_id IN (
  SELECT class_id
  FROM classes
  WHERE grade = '高一'
);
```

### EXISTS 子查询

用于判断是否存在满足条件的关联记录。

```sql
SELECT *
FROM students s
WHERE EXISTS (
  SELECT 1
  FROM scores sc
  WHERE sc.student_id = s.id
);
```

---

## 什么场景适合连接，什么场景适合子查询

### 更适合 JOIN 的场景

- 需要把多张表字段一起展示出来
- 需要做主表与明细表关联查询
- 需要查缺失数据或跨表对账

### 更适合子查询的场景

- 先得到一个中间集合，再作为筛选条件
- 做“存在性判断”
- 做排名、最大值、最小值这类分步推导

真实项目里两者并不是对立关系，关键是选更容易表达、也更方便数据库执行的写法。

---

## 测试和排查中的典型应用

- 查订单和支付是否一一对应
- 查主表有、明细表缺的脏数据
- 查某个业务状态下对应的用户集合
- 查“第二高”“前 N 名”这类常见 SQL 题

---

## 常见误区

- 把 `JOIN` 和 `UNION` 混成一种“拼表方式”
- 不理解 `LEFT JOIN` 中 `ON` 和 `WHERE` 的差异
- 子查询一律机械替换成连接，或者相反
- 查缺失数据时没有利用 `LEFT JOIN ... IS NULL`

---

## 一句话说明

连接用于按关系把多张表的字段组合起来，子查询用于先得到一个中间结果再继续筛选。实际使用时，我会优先根据查询目标选择写法，比如跨表展示和查缺失数据更偏向 `JOIN`，存在性判断和中间集合筛选更适合子查询。

---

## 小结

连接与子查询的核心不是背更多语法，而是明确查询目标，再选择最容易表达、也最利于排查问题的写法。
