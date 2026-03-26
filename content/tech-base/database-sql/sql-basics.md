# 01 SQL基础语法

## 1. SQL 查询主干

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

各部分含义：

- `SELECT`：查什么
- `FROM`：从哪查
- `WHERE`：先筛原始数据
- `GROUP BY`：分组
- `HAVING`：筛分组后的结果
- `ORDER BY`：排序
- `LIMIT / OFFSET`：限制条数、分页

常见逻辑执行顺序：

```text
FROM -> WHERE -> GROUP BY -> HAVING -> SELECT -> ORDER BY -> LIMIT
```

---

## 2. SELECT、FROM、WHERE

### 2.1 基本查询

```sql
SELECT 姓名, 成绩
FROM students;
```

### 2.2 WHERE 过滤

```sql
SELECT *
FROM students
WHERE 成绩 >= 60;
```

### 2.3 常见比较运算符

- `=`：等于
- `!=` / `<>`：不等于
- `>`：大于
- `<`：小于
- `>=`：大于等于
- `<=`：小于等于

### 2.4 逻辑运算

- `AND`
- `OR`
- `NOT`

```sql
SELECT *
FROM students
WHERE 班级 = '一班'
  AND 成绩 >= 80;
```

---

## 3. ORDER BY 排序

### 3.1 升序、降序

- `ASC`：升序（默认）
- `DESC`：降序

```sql
SELECT 姓名, 成绩
FROM students
ORDER BY 成绩 DESC;
```

### 3.2 多列排序

```sql
SELECT *
FROM students
ORDER BY 班级 ASC, 成绩 DESC;
```

---

## 4. LIMIT 与 OFFSET

### 4.1 LIMIT

```sql
SELECT *
FROM students
LIMIT 5;
```

表示取前 5 条。

### 4.2 OFFSET

```sql
SELECT *
FROM students
LIMIT 5 OFFSET 10;
```

表示跳过前 10 条，再取 5 条。

### 4.3 分页公式

如果每页 `pageSize = 10`，第 `pageNum` 页：

```text
OFFSET = (pageNum - 1) * pageSize
```

例如第 3 页：

```sql
SELECT *
FROM students
LIMIT 10 OFFSET 20;
```

### 4.4 MySQL 常见简写

```sql
SELECT *
FROM students
LIMIT 10, 5;
```

等价于：

```sql
SELECT *
FROM students
LIMIT 5 OFFSET 10;
```

### 4.5 注意

分页最好配合 `ORDER BY` 一起用，否则结果顺序可能不稳定。

---

## 5. LIKE 模糊匹配

### 5.1 基本语法

```sql
SELECT *
FROM students
WHERE 姓名 LIKE '张%';
```

### 5.2 通配符

- `%`：任意多个字符
- `_`：任意一个字符

### 5.3 `%` 示例

#### 以某字符开头

```sql
SELECT *
FROM students
WHERE 姓名 LIKE '张%';
```

#### 以某字符结尾

```sql
SELECT *
FROM students
WHERE 姓名 LIKE '%明';
```

#### 包含某字符

```sql
SELECT *
FROM students
WHERE 姓名 LIKE '%小%';
```

### 5.4 `_` 示例

#### 两个字名字，第二个字是明

```sql
SELECT *
FROM students
WHERE 姓名 LIKE '_明';
```

#### 姓张且名字是两个字

```sql
SELECT *
FROM students
WHERE 姓名 LIKE '张_';
```

### 5.5 LIKE 和 = 的区别

- `=`：完全相等
- `LIKE`：按模式匹配

---

## 6. DISTINCT 去重

```sql
SELECT DISTINCT 班级
FROM students;
```

常见用途：

- 查不重复的班级、玩家、商品
- 排名题先对分数去重
- 清理重复结果

---

## 7. NULL、IS NULL、IS NOT NULL

### 7.1 NULL 是什么

`NULL` 表示没有值、未知值、缺失值。

它不是：

- 0
- 空字符串

### 7.2 正确判断空值

错误：

```sql
WHERE 成绩 = NULL
```

正确：

```sql
WHERE 成绩 IS NULL
WHERE 成绩 IS NOT NULL
```

---

## 8. COUNT(*)、COUNT(字段)

### 8.1 COUNT(*)

统计总行数。

```sql
SELECT COUNT(*)
FROM students;
```

### 8.2 COUNT(字段)

统计该字段非 `NULL` 的行数。

```sql
SELECT COUNT(成绩)
FROM students;
```

### 8.3 其他聚合函数与 NULL

通常会忽略 `NULL`：

- `AVG`
- `SUM`
- `MAX`
- `MIN`

---

## 9. DELETE、TRUNCATE、DROP

### 9.1 DELETE

删数据，不删表。

```sql
DELETE FROM students;
DELETE FROM students WHERE 成绩 < 60;
```

### 9.2 TRUNCATE

快速清空整张表数据，但表结构还在。

```sql
TRUNCATE TABLE students;
```

### 9.3 DROP

删除整张表，包括表结构。

```sql
DROP TABLE students;
```

### 9.4 一句话区分

- `DELETE`：删记录
- `TRUNCATE`：快速清空整表
- `DROP`：删表
