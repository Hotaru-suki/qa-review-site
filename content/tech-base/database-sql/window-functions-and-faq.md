# 03 SQL窗口函数与高频题

## 1. 第三条记录与第三名的区别

这是 SQL 高频易错点。

- 第三条记录：按排序后第 3 行
- 第三名：按名次理解，通常并列算同一名

---

## 2. 查第三名的经典写法

### 2.1 DISTINCT + 排序

```sql
SELECT *
FROM students
WHERE 成绩 = (
    SELECT DISTINCT 成绩
    FROM students
    ORDER BY 成绩 DESC
    LIMIT 1 OFFSET 2
);
```

这表示：

- 先取不同成绩
- 从高到低排序
- 跳过前 2 个
- 拿第 3 个成绩
- 再查所有该成绩的学生

### 2.2 为什么要 DISTINCT

不加 `DISTINCT`，可能拿到的是“第三条记录”，而不是“第三名”。

---

## 3. 用 COUNT 思路查第三名

```sql
SELECT *
FROM students s1
WHERE 2 = (
    SELECT COUNT(DISTINCT s2.成绩)
    FROM students s2
    WHERE s2.成绩 > s1.成绩
);
```

含义：

- 对每个学生
- 统计有多少种不同成绩比他高
- 如果正好有 2 种更高分
- 那他就是第三名

---

## 4. 窗口函数基础

窗口函数不会像 `GROUP BY` 那样减少行数，而是在每一行上计算结果。

---

## 5. ROW_NUMBER()、RANK()、DENSE_RANK()

假设成绩降序如下：

| 姓名 | 成绩 |
|---|---:|
| A | 100 |
| B | 95 |
| C | 95 |
| D | 90 |

### 5.1 ROW_NUMBER()

逐行唯一编号，不考虑并列。

```sql
SELECT 姓名, 成绩,
       ROW_NUMBER() OVER (ORDER BY 成绩 DESC) AS rn
FROM students;
```

结果逻辑：

- A -> 1
- B -> 2
- C -> 3
- D -> 4

### 5.2 RANK()

并列同名次，但后面跳号。

```sql
SELECT 姓名, 成绩,
       RANK() OVER (ORDER BY 成绩 DESC) AS rk
FROM students;
```

结果逻辑：

- A -> 1
- B -> 2
- C -> 2
- D -> 4

### 5.3 DENSE_RANK()

并列同名次，但后面不跳号。

```sql
SELECT 姓名, 成绩,
       DENSE_RANK() OVER (ORDER BY 成绩 DESC) AS dr
FROM students;
```

结果逻辑：

- A -> 1
- B -> 2
- C -> 2
- D -> 3

### 5.4 一句话区分

- `ROW_NUMBER()`：人人不同号
- `RANK()`：并列跳号
- `DENSE_RANK()`：并列不跳号

### 5.5 查第三名更适合哪个

通常更适合 `DENSE_RANK()`：

```sql
SELECT *
FROM (
    SELECT *,
           DENSE_RANK() OVER (ORDER BY 成绩 DESC) AS rk
    FROM students
) t
WHERE rk = 3;
```

---

## 6. OVER、PARTITION BY、ROW_NUMBER()

### 6.1 ROW_NUMBER() 本身有无参数

一般没有：

```sql
ROW_NUMBER()
```

规则写在 `OVER(...)` 中。

### 6.2 OVER 的作用

规定窗口函数的计算规则。

```sql
ROW_NUMBER() OVER (ORDER BY 成绩 DESC)
```

表示按成绩降序编号。

### 6.3 PARTITION BY 的作用

表示按某字段分区后分别计算。

```sql
ROW_NUMBER() OVER (PARTITION BY player_id ORDER BY login_date)
```

表示每个玩家内部自己重新编号。

---

## 7. DATE_SUB 与 INTERVAL

### 7.1 DATE_SUB

日期减法函数。

```sql
SELECT DATE_SUB('2026-03-26', INTERVAL 1 DAY);
```

结果为：

```text
2026-03-25
```

### 7.2 INTERVAL

时间间隔关键字。

例如：

- `INTERVAL 1 DAY`
- `INTERVAL 2 MONTH`
- `INTERVAL 5 YEAR`

---

## 8. 连续登录 3 天及以上的玩家

表：

`player_login_log(player_id, login_date)`

### 8.1 核心思路

对于同一个玩家：

1. 按登录日期排序
2. 用 `ROW_NUMBER()` 编号
3. 连续日期减去连续编号后结果相同
4. 用相同结果标识一段连续区间
5. 分组统计区间长度

### 8.2 SQL 示例

```sql
SELECT DISTINCT player_id
FROM (
    SELECT player_id
    FROM (
        SELECT 
            player_id,
            login_date,
            DATE_SUB(login_date, INTERVAL ROW_NUMBER() OVER (
                PARTITION BY player_id ORDER BY login_date
            ) DAY) AS grp
        FROM player_login_log
    ) t
    GROUP BY player_id, grp
    HAVING COUNT(*) >= 3
) x;
```

### 8.3 关键记忆点

> 连续日期问题的经典技巧：`日期 - ROW_NUMBER()` 相同的属于同一连续段。

---

## 9. 每组最新一条记录

这是比第三名更常见的业务题。

```sql
SELECT *
FROM (
    SELECT *,
           ROW_NUMBER() OVER (
               PARTITION BY player_id
               ORDER BY login_time DESC
           ) AS rn
    FROM login_log
) t
WHERE rn = 1;
```

表示每个玩家取最新一条登录记录。

---

## 10. 高频业务题模板

### 10.1 查第三名

```sql
SELECT *
FROM (
    SELECT *,
           DENSE_RANK() OVER (ORDER BY 成绩 DESC) AS rk
    FROM students
) t
WHERE rk = 3;
```

### 10.2 查每组最新一条

```sql
SELECT *
FROM (
    SELECT *,
           ROW_NUMBER() OVER (
               PARTITION BY player_id
               ORDER BY create_time DESC
           ) AS rn
    FROM some_table
) t
WHERE rn = 1;
```

### 10.3 查连续登录 3 天

见上文连续登录题。

---

## 11. 高频注意点

- “第三条记录” ≠ “第三名”
- `ROW_NUMBER()` 和 `DENSE_RANK()` 不能混用
- 窗口函数不会减少结果行数
- `PARTITION BY` 不是 `GROUP BY`
