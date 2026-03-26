# 02 SQL连接与子查询

## 1. JOIN 与 UNION 的本质区别

- `JOIN`：横向拼接，通常是列变多
- `UNION`：纵向拼接，通常是行变多

---

## 2. UNION 与 UNION ALL

### 2.1 UNION

合并多个查询结果并去重。

```sql
SELECT 姓名 FROM A
UNION
SELECT 姓名 FROM B;
```

### 2.2 UNION ALL

合并多个查询结果但不去重。

```sql
SELECT 姓名 FROM A
UNION ALL
SELECT 姓名 FROM B;
```

### 2.3 区别总结

- `UNION`：去重
- `UNION ALL`：不去重，通常更快

### 2.4 使用要求

- 两边列数一致
- 对应列类型兼容

---

## 3. INNER JOIN、LEFT JOIN、RIGHT JOIN、FULL JOIN

### 3.1 INNER JOIN

只保留两边都匹配上的记录。

```sql
SELECT s.姓名, c.班级名
FROM students s
INNER JOIN classes c
ON s.班级ID = c.班级ID;
```

### 3.2 LEFT JOIN

左表全部保留，右表匹配不上为 `NULL`。

```sql
SELECT s.姓名, c.班级名
FROM students s
LEFT JOIN classes c
ON s.班级ID = c.班级ID;
```

### 3.3 RIGHT JOIN

右表全部保留，左表匹配不上为 `NULL`。

```sql
SELECT s.姓名, c.班级名
FROM students s
RIGHT JOIN classes c
ON s.班级ID = c.班级ID;
```

### 3.4 FULL JOIN

两边都保留，匹配不上补 `NULL`。

```sql
SELECT s.姓名, c.班级名
FROM students s
FULL JOIN classes c
ON s.班级ID = c.班级ID;
```

### 3.5 一句话记忆

- `INNER JOIN`：交集
- `LEFT JOIN`：左全
- `RIGHT JOIN`：右全
- `FULL JOIN`：两边全

---

## 4. LEFT JOIN 中 ON 和 WHERE 的区别

核心结论：

- `ON`：决定怎么连
- `WHERE`：决定连完以后留谁

### 4.1 条件写在 WHERE

```sql
SELECT o.order_id, p.status
FROM orders o
LEFT JOIN payments p
ON o.order_id = p.order_id
WHERE p.status = 'success';
```

这会把右表为 `NULL` 的行过滤掉，效果接近 `INNER JOIN`。

### 4.2 条件写在 ON

```sql
SELECT o.order_id, p.status
FROM orders o
LEFT JOIN payments p
ON o.order_id = p.order_id
AND p.status = 'success';
```

这表示：

- 只让满足条件的右表记录接上来
- 左表仍然全部保留

### 4.3 LEFT JOIN 查缺失数据

```sql
SELECT o.*
FROM orders o
LEFT JOIN payments p
ON o.order_id = p.order_id
WHERE p.order_id IS NULL;
```

表示左表有、右表没有的数据。

---

## 5. 子查询基础

子查询就是查询中再嵌套查询。

### 5.1 标量子查询

返回一个值。

```sql
SELECT *
FROM students
WHERE 成绩 = (
    SELECT MAX(成绩)
    FROM students
);
```

### 5.2 IN 子查询

返回多个值时常用。

```sql
SELECT *
FROM students
WHERE 班级 IN (
    SELECT 班级
    FROM classes
    WHERE 年级 = '高一'
);
```

### 5.3 EXISTS 子查询

判断是否存在匹配记录。

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

## 6. WHERE 2 = (...) 的含义

例如：

```sql
SELECT *
FROM students s1
WHERE 2 = (
    SELECT COUNT(DISTINCT s2.成绩)
    FROM students s2
    WHERE s2.成绩 > s1.成绩
);
```

这里：

```sql
WHERE 2 = (...)
```

表示只有当括号里的子查询结果等于 2 时，这一行才保留。

本质上，`WHERE` 后面放的是布尔条件表达式。

---

## 7. FROM 中的子查询与别名

```sql
SELECT *
FROM (
    SELECT *,
           DENSE_RANK() OVER (ORDER BY 成绩 DESC) AS rk
    FROM students
) t
WHERE rk = 3;
```

这里：

- 括号内是子查询
- `t` 是子查询结果的别名
- `t` 相当于临时表名

不是在真实数据库里建表，只是查询时临时起名。

---

## 8. 常见面试注意点

### 8.1 JOIN 和 UNION 别混

- `JOIN`：横着拼
- `UNION`：竖着拼

### 8.2 LEFT JOIN 后对右表写 WHERE 条件要小心

尤其是：

```sql
WHERE 右表字段 = 某值
```

很容易把左连接效果写成类似内连接。

### 8.3 查“左表有、右表没有”

经典写法：

```sql
LEFT JOIN ...
WHERE 右表主键 IS NULL
```
