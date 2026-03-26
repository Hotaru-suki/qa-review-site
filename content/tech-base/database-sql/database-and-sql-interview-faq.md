# 09 数据库与SQL笔面试高频题

## 1. 使用说明

这份文档的定位是：

- 校招 / 实习测试、测开、后端常见数据库与 SQL 高频题
- 兼顾笔试题、面试问答题、场景题
- 重点放在你当前阶段最可能被问到的内容

建议使用方式：

- 第一遍：理解题目和答案
- 第二遍：自己遮住答案口头回答
- 第三遍：挑不会的题反复练

---

## 2. SQL 基础高频题

### 2.1 `WHERE` 和 `HAVING` 有什么区别？

**标准答法：**

`WHERE` 用于在分组前过滤原始数据，`HAVING` 用于在分组后过滤聚合结果。通常 `WHERE` 不能直接筛聚合函数结果，而 `HAVING` 可以。

**例子：**

```sql
SELECT 班级, AVG(成绩)
FROM students
WHERE 成绩 >= 60
GROUP BY 班级;
```

表示先去掉不及格学生，再算平均分。

```sql
SELECT 班级, AVG(成绩)
FROM students
GROUP BY 班级
HAVING AVG(成绩) >= 60;
```

表示先算每个班平均分，再筛掉平均分低于 60 的班。

---

### 2.2 `GROUP BY` 为什么还要在 `SELECT` 里写分组字段？

**答法：**

`SELECT` 决定结果显示什么列，`GROUP BY` 决定按什么维度分组统计。  
如果既要显示班级，又要算每个班级的平均分，就必须按班级分组。

---

### 2.3 `DELETE`、`TRUNCATE`、`DROP` 的区别是什么？

**答法：**

- `DELETE`：删除表中数据，表结构还在，可以加 `WHERE`
- `TRUNCATE`：快速清空整张表数据，表结构还在，不能加 `WHERE`
- `DROP`：直接删除整张表，包括表结构

**一句话记忆：**

- `DELETE` 删记录
- `TRUNCATE` 清空表
- `DROP` 删表

---

### 2.4 `COUNT(*)` 和 `COUNT(字段)` 的区别？

**答法：**

- `COUNT(*)` 统计总行数
- `COUNT(字段)` 统计该字段非 `NULL` 的行数

---

### 2.5 `NULL` 能不能用 `=` 判断？

**答法：**

不能。  
`NULL` 要用：

- `IS NULL`
- `IS NOT NULL`

例如：

```sql
SELECT *
FROM students
WHERE 成绩 IS NULL;
```

---

### 2.6 `LIKE` 里的 `%` 和 `_` 有什么区别？

**答法：**

- `%` 表示任意多个字符
- `_` 表示任意一个字符

例如：

```sql
SELECT * FROM students WHERE 姓名 LIKE '张%';
SELECT * FROM students WHERE 姓名 LIKE '_明';
```

---

### 2.7 `UNION` 和 `UNION ALL` 的区别？

**答法：**

两者都用于合并多个查询结果。

- `UNION`：合并并去重
- `UNION ALL`：合并但不去重，通常效率更高

---

### 2.8 `JOIN` 和 `UNION` 的区别？

**答法：**

- `JOIN`：横向拼接，多列
- `UNION`：纵向拼接，多行

---

## 3. 连接查询高频题

### 3.1 `INNER JOIN`、`LEFT JOIN`、`RIGHT JOIN` 的区别？

**答法：**

- `INNER JOIN`：只保留两边都匹配上的记录
- `LEFT JOIN`：左表全部保留，右表匹配不上补 `NULL`
- `RIGHT JOIN`：右表全部保留，左表匹配不上补 `NULL`

---

### 3.2 `LEFT JOIN` 中，条件写在 `ON` 里和写在 `WHERE` 里有什么区别？

**答法：**

- `ON`：决定怎么连
- `WHERE`：决定连完以后保留哪些行

对于 `LEFT JOIN`，如果把右表条件写到 `WHERE` 中，可能会把右表为 `NULL` 的行过滤掉，从而让左连接效果接近内连接。

**例子：**

```sql
SELECT o.order_id, p.status
FROM orders o
LEFT JOIN payments p
ON o.order_id = p.order_id
WHERE p.status = 'success';
```

这会过滤掉右表为空的行。

```sql
SELECT o.order_id, p.status
FROM orders o
LEFT JOIN payments p
ON o.order_id = p.order_id
AND p.status = 'success';
```

这会保留左表全部记录，只是限制右表哪些行能接进来。

---

### 3.3 如何查“左表有、右表没有”的数据？

**答法：**

经典写法是：

```sql
SELECT a.*
FROM A a
LEFT JOIN B b
ON a.id = b.id
WHERE b.id IS NULL;
```

这是测试场景里很常用的查漏数据写法。

---

## 4. 子查询高频题

### 4.1 什么是子查询？

**答法：**

子查询就是在一个 SQL 查询里面再嵌套一个查询，用来先得到一个中间结果，再供外层查询使用。

---

### 4.2 `IN` 和 `EXISTS` 有什么区别？

**基础答法：**

- `IN`：适合子查询返回一组值，再判断当前值是否在这组值里
- `EXISTS`：适合判断某种匹配记录是否存在

**例子：**

```sql
SELECT *
FROM students
WHERE 班级 IN (
    SELECT 班级
    FROM classes
    WHERE 年级 = '高一'
);
```

```sql
SELECT *
FROM students s
WHERE EXISTS (
    SELECT 1
    FROM scores sc
    WHERE sc.student_id = s.id
);
```

面试入门阶段先会这个层次就够用。

---

### 4.3 `WHERE 2 = (子查询)` 是什么意思？

**答法：**

表示括号里的子查询结果必须等于 2，这一行才会被保留。  
本质上 `WHERE` 后面跟的是布尔条件表达式。

---

## 5. SQL 编程题高频题型

### 5.1 查成绩第三名的学生信息怎么写？

**写法一：`DISTINCT + LIMIT OFFSET`**

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

**关键解释：**

这里必须 `DISTINCT`，因为“第三条记录”不等于“第三名”。

---

### 5.2 查每个用户最新一条记录怎么写？

```sql
SELECT *
FROM (
    SELECT *,
           ROW_NUMBER() OVER (
               PARTITION BY user_id
               ORDER BY create_time DESC
           ) AS rn
    FROM some_table
) t
WHERE rn = 1;
```

---

### 5.3 查连续登录 3 天及以上的玩家怎么写？

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

**关键思路：**

连续日期减去连续编号，结果相同的属于同一连续区间。

---

### 5.4 查重复数据怎么写？

例如查重复发奖：

```sql
SELECT player_id, item_id, COUNT(*)
FROM reward_log
GROUP BY player_id, item_id
HAVING COUNT(*) > 1;
```

---

### 5.5 查缺失数据怎么写？

例如查有订单但没有支付记录的订单：

```sql
SELECT o.*
FROM orders o
LEFT JOIN payments p
ON o.order_id = p.order_id
WHERE p.order_id IS NULL;
```

---

## 6. 窗口函数高频题

### 6.1 `ROW_NUMBER()`、`RANK()`、`DENSE_RANK()` 的区别？

**答法：**

- `ROW_NUMBER()`：逐行唯一编号，不考虑并列
- `RANK()`：并列同名次，后面跳号
- `DENSE_RANK()`：并列同名次，后面不跳号

**一句话记忆：**

- `ROW_NUMBER()`：人人不同号
- `RANK()`：并列跳号
- `DENSE_RANK()`：并列不跳号

---

### 6.2 查“第 3 名”更适合用哪个函数？

**答法：**

通常更适合用 `DENSE_RANK()`，因为它更符合“并列算同一名，后面名次不跳号”的语义。

---

### 6.3 `PARTITION BY` 和 `GROUP BY` 有什么区别？

**答法：**

- `GROUP BY`：会把多行压成一行，做聚合统计
- `PARTITION BY`：不会减少行数，只是把数据分区后分别计算窗口函数

---

## 7. 数据库基础高频题

### 7.1 主键是什么？

**答法：**

主键是用来唯一标识一条记录的字段或字段组合，通常要求唯一且不能为空。

---

### 7.2 外键是什么？

**答法：**

外键是用来引用另一张表主键的字段，用于建立表与表之间的关联关系，并保证引用完整性。

---

### 7.3 主键和外键的区别？

**答法：**

- 主键：标识自己
- 外键：关联别人

---

### 7.4 索引是什么？

**答法：**

索引是数据库中用于提升查询效率的数据结构，可以理解为目录。  
它能加快查询、排序和连接，但也会占用空间，并增加写操作的维护成本。

---

### 7.5 什么字段适合建索引？

**答法：**

通常适合这些字段：

- 经常出现在 `WHERE`
- 经常用于 `JOIN`
- 经常用于 `ORDER BY`
- 区分度高、唯一性强的字段

---

### 7.6 索引是不是越多越好？

**答法：**

不是。  
索引会提升读性能，但会占空间，并拖慢插入、更新、删除，因为写入时也要维护索引。

---

### 7.7 联合索引是什么？最左前缀原则是什么？

**答法：**

联合索引是多个字段一起组成的索引，例如：

```sql
(user_id, status, create_time)
```

最左前缀原则指的是联合索引通常要尽量从最左边字段开始使用。  
例如上面这个索引更适合支持：

- `WHERE user_id = ?`
- `WHERE user_id = ? AND status = ?`

但不一定很好支持直接只查 `status`。

---

## 8. 事务高频题

### 8.1 事务是什么？

**答法：**

事务是一组操作的集合，这些操作要么全部成功，要么全部失败，常用于保证数据一致性。

---

### 8.2 ACID 是什么？

**答法：**

事务四大特性 ACID：

- A：Atomicity 原子性
- C：Consistency 一致性
- I：Isolation 隔离性
- D：Durability 持久性

---

### 8.3 原子性怎么理解？

**答法：**

事务中的操作不可分割，要么全部完成，要么全部不完成。  
例如转账时，扣款和加款必须同时成功，否则就要整体回滚。

---

### 8.4 一致性怎么理解？

**答法：**

事务执行前后，数据库都应该处于合法一致状态，不能破坏业务规则。

---

### 8.5 隔离性怎么理解？

**答法：**

多个事务并发执行时，应该尽量互不干扰，避免一个事务看到另一个事务的中间状态。

---

### 8.6 持久性怎么理解？

**答法：**

事务一旦提交，其结果应该永久保存，即使数据库重启也不能丢失。

---

## 9. 并发问题高频题

### 9.1 什么是脏读？

**答法：**

脏读是一个事务读到了另一个事务尚未提交的数据。

---

### 9.2 什么是不可重复读？

**答法：**

同一事务中，两次读取同一条记录，结果不一样。

---

### 9.3 什么是幻读？

**答法：**

同一事务中，两次按条件查询，第二次结果集中多出或少了几行。

---

### 9.4 脏读、不可重复读、幻读怎么区分？

**答法：**

- 脏读：读未提交
- 不可重复读：同一行前后读不一样
- 幻读：结果集行数变了

---

## 10. 锁高频题

### 10.1 锁是什么？

**答法：**

锁是数据库为了控制并发访问而使用的机制，用来避免多个事务同时操作同一份数据时出现不一致问题。

---

### 10.2 乐观锁和悲观锁的区别？

**答法：**

- 悲观锁：先锁再改，认为冲突经常发生
- 乐观锁：先尝试修改，提交时通过版本号等方式检查冲突

**典型乐观锁 SQL：**

```sql
UPDATE product
SET stock = stock - 1, version = version + 1
WHERE id = 1
  AND version = 5;
```

---

## 11. 慢查询与性能排查高频题

### 11.1 什么是慢查询？

**答法：**

慢查询就是执行时间明显过长、影响系统性能的 SQL 查询。

---

### 11.2 慢查询常见原因有哪些？

**答法：**

常见原因有：

- 没有索引
- 索引失效
- 扫描数据量太大
- 返回数据太多
- 排序、分组、JOIN 开销大
- 深分页
- SQL 写法不合理

---

### 11.3 如果遇到慢查询，你会怎么排查？

**答法模板：**

如果遇到慢查询，我会先定位具体是哪条 SQL 慢，再结合业务场景看是否条件不合理、返回数据过多或多表关联过重。然后检查相关字段是否有索引，并使用 `EXPLAIN` 查看执行计划，重点关注是否走索引、扫描行数、访问方式，以及是否有 `Using filesort`、`Using temporary` 等额外开销。如果 SQL 本身没有明显问题，还会考虑是否存在锁等待、并发冲突或数据量增长带来的性能退化。

---

### 11.4 为什么建了索引，SQL 还是可能很慢？

**答法：**

因为可能存在：

- 索引没用上
- 联合索引没按最左前缀使用
- 字段上做了函数或表达式
- 条件命中数据太多
- SQL 本身返回结果过大
- 锁等待或并发问题

---

## 12. EXPLAIN 高频题

### 12.1 `EXPLAIN` 是什么？

**答法：**

`EXPLAIN` 用于查看 SQL 的执行计划，帮助分析是否走索引、扫描了多少行、访问方式如何，以及是否有额外排序或临时表开销。

---

### 12.2 `EXPLAIN` 重点看哪些字段？

**答法：**

入门阶段重点看：

- `type`
- `key`
- `rows`
- `Extra`

---

### 12.3 `type = ALL` 一般说明什么？

**答法：**

通常说明发生了全表扫描，往往需要重点关注。

---

### 12.4 `key = NULL` 一般说明什么？

**答法：**

通常说明没有用上索引。

---

### 12.5 `Using filesort`、`Using temporary` 说明什么？

**答法：**

说明 SQL 可能存在额外排序或临时表开销，通常值得关注。

---

## 13. 测试 / 测开岗位场景追问

### 13.1 如果支付回调重复到达，会有什么数据库风险？

**答法方向：**

- 重复更新订单状态
- 重复发货
- 重复发奖
- 重复写日志

通常需要通过幂等控制、唯一约束、事务或状态校验避免重复处理。

---

### 13.2 如何用 SQL 查重复发奖问题？

```sql
SELECT player_id, item_id, COUNT(*)
FROM reward_log
GROUP BY player_id, item_id
HAVING COUNT(*) > 1;
```

---

### 13.3 如何用 SQL 查“有支付无发货”？

```sql
SELECT p.*
FROM payments p
LEFT JOIN shipments s
ON p.order_id = s.order_id
WHERE p.status = 'success'
  AND s.order_id IS NULL;
```

---

## 14. 口头快答版

### 数据库基础

- 主键：唯一标识本表记录
- 外键：引用其他表主键
- 索引：加速查询的目录结构

### SQL 基础

- `WHERE`：分组前过滤
- `HAVING`：分组后过滤
- `UNION`：合并并去重
- `UNION ALL`：合并不去重

### 连接

- `INNER JOIN`：交集
- `LEFT JOIN`：左表全保留
- `RIGHT JOIN`：右表全保留

### 排名

- `ROW_NUMBER()`：唯一编号
- `RANK()`：并列跳号
- `DENSE_RANK()`：并列不跳号

### 事务

- 事务：一组操作要么全成，要么全败
- ACID：原子性、一致性、隔离性、持久性

### 并发问题

- 脏读：读未提交
- 不可重复读：同一行前后不同
- 幻读：结果集行数变化

### 性能

- 慢查询：执行时间过长的 SQL
- `EXPLAIN`：看执行计划
- `type = ALL`：常见于全表扫描
- `key = NULL`：通常没走索引

---

## 15. 当前最值得反复练的题目清单

建议你重点反复练这些：

1. `WHERE` 和 `HAVING` 的区别  
2. `LEFT JOIN` 中 `ON` 和 `WHERE` 的区别  
3. `UNION` 和 `UNION ALL` 的区别  
4. `COUNT(*)` 和 `COUNT(字段)` 的区别  
5. 查第三名  
6. 查每组最新一条  
7. 查连续登录 3 天  
8. 主键、外键、索引分别是什么  
9. 事务和 ACID  
10. 脏读、不可重复读、幻读  
11. 乐观锁和悲观锁  
12. 慢查询排查思路  
13. `EXPLAIN` 看什么

---

## 16. 建议的后续训练方式

### 第一轮
只练口头定义题：

- 是什么
- 有什么区别
- 一句话怎么解释

### 第二轮
练 SQL 编程题：

- 第三名
- 最新一条
- 连续登录
- 查重复
- 查缺失

### 第三轮
练业务场景题：

- 重复发奖
- 有支付无发货
- 超卖
- 幂等
- 慢查询排查

---

## 17. 一句话总结

这份文档最核心的目标不是让你背所有细节，而是让你做到：

> 面试官问到数据库和 SQL 时，你能先答清“概念”，再答清“区别”，最后能落到“业务 SQL 场景”。 
