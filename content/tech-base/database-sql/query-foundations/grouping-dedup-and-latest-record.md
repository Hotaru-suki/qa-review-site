# 分组、去重和最近一条记录怎么想

## 这个知识点在解决什么问题
SQL 里很多题表面不同，本质都在做三件事之一：
- 把多行按某个维度折叠成一行
- 从重复记录里只保留一条
- 在每组里找“最新”“最大”“最早”那条

理解这三类问题，比死记语法更重要。

## 一行到底代表谁
写这类 SQL 前，先回答：
- 一行代表一个用户，还是一条订单，还是一个日期

如果这件事没想清楚，后面就很容易重复行、漏行或统计错。

## 分组在做什么
`group by` 的本质，是把多行压成一个分组结果。典型用途：
- 每个用户的订单数
- 每天的支付金额
- 每个活动的参与人数

例如：

```sql
select user_id, count(*) as order_cnt
from orders
where created_at >= '2026-04-01'
group by user_id;
```

这条 SQL 的结果粒度是“每个用户一行”，不是“每个订单一行”。

## 去重在做什么
去重不是简单地“把一样的行删掉”，而是要先定义重复标准：
- 同一个用户重复报名
- 同一个订单号出现多条状态记录
- 同一设备重复上报

有时 `distinct` 就够，有时需要窗口函数或子查询挑出你真正想保留的那条。

### `distinct` 适合什么
当你只需要“唯一组合”时，例如：

```sql
select distinct user_id
from coupon_receive_log;
```

### `distinct` 不适合什么
如果你想保留“每个订单最新的一条状态”，`distinct` 就不够，因为你需要的是“按组挑一条代表记录”，不是纯去重。

## 最近一条记录怎么找
典型场景：
- 每个用户最近一次登录
- 每个订单最近一次状态变化

思路通常有两类：
- 先聚合出最大时间，再回表拿完整记录
- 直接用窗口函数按组排序后取第一条

### 方法 1：先聚合再回表

```sql
select t.*
from order_status_log t
join (
  select order_id, max(updated_at) as max_time
  from order_status_log
  group by order_id
) m
  on t.order_id = m.order_id
 and t.updated_at = m.max_time;
```

### 方法 2：窗口函数

```sql
select *
from (
  select t.*,
         row_number() over(partition by order_id order by updated_at desc) as rn
  from order_status_log t
) s
where rn = 1;
```

窗口函数通常更直观，尤其当你还需要第二新、第三新的记录时更好用。

## 测试场景里怎么用
### 查重复下单
- 先按用户 ID、商品 ID、时间窗口分组
- 再看 `count(*) > 1` 的分组

### 查订单最终状态
- 先找每个订单最新状态
- 再和订单主表对比是否一致

### 查每日新增用户
- 先确定粒度是“每日”
- 再把用户首次出现时间归到日期维度

## 常见误区
- 结果要“每组一条”，却直接 `order by` 后 `limit`
- 以为 `distinct` 能解决所有重复问题
- 只取最大时间，没有把其他列和该行对齐
- 分组后又直接选了未聚合列，结果语义不清
