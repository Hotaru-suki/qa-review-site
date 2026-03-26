# 04 测试场景SQL

## 1. 为什么测试岗要学 SQL

测试和测开使用 SQL 的主要目的不是做复杂数据分析，而是：

- 校验数据是否正确
- 检查业务状态是否一致
- 查异常数据
- 查重复数据
- 查缺失数据
- 查最新状态
- 验证链路是否完整

---

## 2. 数据一致性校验

### 2.1 订单状态与支付状态不一致

```sql
SELECT order_id, order_status, pay_status
FROM orders
WHERE order_status = '已支付'
  AND pay_status != '成功';
```

### 2.2 接口返回库存与数据库库存不一致

思路通常是：

- 查数据库库存
- 与接口返回结果对比
- 找出差异记录

---

## 3. 异常数据查询

### 3.1 非法数值

```sql
SELECT *
FROM player
WHERE gold < 0
   OR level < 1;
```

### 3.2 空昵称 / 空关键字段

```sql
SELECT *
FROM player
WHERE nickname IS NULL;
```

### 3.3 非法状态值

```sql
SELECT *
FROM orders
WHERE status NOT IN ('待支付', '已支付', '已取消', '已退款');
```

---

## 4. 重复数据查询

### 4.1 重复发奖

```sql
SELECT player_id, item_id, COUNT(*)
FROM reward_log
GROUP BY player_id, item_id
HAVING COUNT(*) > 1;
```

### 4.2 玩家背包重复道具记录

```sql
SELECT player_id, item_id, COUNT(*)
FROM player_items
GROUP BY player_id, item_id
HAVING COUNT(*) > 1;
```

---

## 5. 缺失数据查询

### 5.1 有订单但没有支付记录

```sql
SELECT o.*
FROM orders o
LEFT JOIN payments p
ON o.order_id = p.order_id
WHERE p.order_id IS NULL;
```

### 5.2 有支付但没有发货记录

```sql
SELECT p.*
FROM payments p
LEFT JOIN shipments s
ON p.order_id = s.order_id
WHERE s.order_id IS NULL;
```

---

## 6. 链路完整性校验

在业务中常见链路：

- 注册 -> 登录 -> 创建角色
- 下单 -> 支付 -> 发货
- 抽卡 -> 扣货币 -> 发放角色
- 购买礼包 -> 扣余额 -> 发道具 -> 发邮件

### 6.1 示例：有支付但没发道具

```sql
SELECT p.order_id, p.player_id
FROM payments p
LEFT JOIN reward_log r
ON p.order_id = r.order_id
WHERE p.status = 'success'
  AND r.order_id IS NULL;
```

---

## 7. 查最新状态

### 7.1 每个玩家最新登录记录

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

### 7.2 每个订单最新状态记录

```sql
SELECT *
FROM (
    SELECT *,
           ROW_NUMBER() OVER (
               PARTITION BY order_id
               ORDER BY update_time DESC
           ) AS rn
    FROM order_status_log
) t
WHERE rn = 1;
```

---

## 8. 查排名与活跃用户

### 8.1 查充值前三的玩家

```sql
SELECT *
FROM (
    SELECT player_id,
           SUM(amount) AS total_amount,
           DENSE_RANK() OVER (ORDER BY SUM(amount) DESC) AS rk
    FROM recharge_log
    GROUP BY player_id
) t
WHERE rk <= 3;
```

### 8.2 查连续登录 3 天以上的玩家

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

---

## 9. 模糊查找场景

### 9.1 查昵称包含某关键词的玩家

```sql
SELECT *
FROM player
WHERE nickname LIKE '%测试%';
```

### 9.2 查异常命名账号

```sql
SELECT *
FROM player
WHERE nickname LIKE 'test%';
```

---

## 10. 测试岗写 SQL 的注意点

### 10.1 先明确业务问题

先想清楚：

- 你在查什么
- 你想验证什么
- 你要找的是异常、重复、漏数据还是最新状态

### 10.2 LEFT JOIN 特别常用

因为测试里经常查：

- 左表有、右表没有
- 链路中断
- 漏单
- 漏发奖励
- 漏支付记录

### 10.3 聚合与分组非常常见

因为测试经常查：

- 重复记录
- 总量统计
- 每人一条
- 每组最新一条

### 10.4 NULL 判断别写错

必须使用：

- `IS NULL`
- `IS NOT NULL`

### 10.5 排序和分页最好明确写

特别是查“最新一条”“前几条”时。

---

## 11. 面试中常见 SQL 业务题方向

- 查第三名
- 查每个用户最新一条记录
- 查连续登录 3 天
- 查重复订单 / 重复发奖
- 查有订单无支付
- 查有支付无发货
- 查状态不一致
- 查空值 / 非法值 / 越界值

---

## 12. 当前阶段最值得熟练的模板

### 12.1 查重复

```sql
SELECT 字段1, 字段2, COUNT(*)
FROM 表
GROUP BY 字段1, 字段2
HAVING COUNT(*) > 1;
```

### 12.2 查缺失

```sql
SELECT a.*
FROM A a
LEFT JOIN B b
ON a.id = b.id
WHERE b.id IS NULL;
```

### 12.3 查每组最新一条

```sql
SELECT *
FROM (
    SELECT *,
           ROW_NUMBER() OVER (
               PARTITION BY 分组字段
               ORDER BY 时间字段 DESC
           ) AS rn
    FROM 表
) t
WHERE rn = 1;
```

### 12.4 查第几名

```sql
SELECT *
FROM (
    SELECT *,
           DENSE_RANK() OVER (ORDER BY 排名字段 DESC) AS rk
    FROM 表
) t
WHERE rk = 3;
```

### 12.5 查连续日期

```sql
SELECT DISTINCT 分组字段
FROM (
    SELECT 分组字段
    FROM (
        SELECT 分组字段,
               日期字段,
               DATE_SUB(日期字段, INTERVAL ROW_NUMBER() OVER (
                   PARTITION BY 分组字段 ORDER BY 日期字段
               ) DAY) AS grp
        FROM 表
    ) t
    GROUP BY 分组字段, grp
    HAVING COUNT(*) >= 连续天数
) x;
```
