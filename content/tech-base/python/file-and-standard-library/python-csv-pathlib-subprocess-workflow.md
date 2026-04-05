# CSV、Pathlib 与 subprocess 组合流程

## 这个知识点在解决什么问题
测试开发里常见的脚本任务不是单点能力，而是“读输入文件 -> 调系统命令 -> 输出结果文件”的组合流程。`csv`、`pathlib` 和 `subprocess` 经常一起出现，因为它们刚好覆盖了结构化输入、路径管理和外部命令协作。

## 一个典型场景
例如你要做一个批量设备检查脚本：
- 从 CSV 读取设备列表
- 用 `adb` 或其他命令查询设备状态
- 把结果输出成新的 CSV 或 JSON 报告

这时：
- `csv` 负责结构化读写
- `pathlib` 负责输入输出路径
- `subprocess` 负责调外部工具

## 为什么这组组合很高频
- 测试数据常以表格形式维护
- 自动化工具经常要调系统命令
- 结果常要回写成机器和人都能看的结构化文件

## 一个简单例子
```python
from pathlib import Path
import csv
import subprocess

input_file = Path("devices.csv")
output_file = Path("result.csv")

rows = []
with input_file.open("r", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    for row in reader:
        result = subprocess.run(
            ["adb", "-s", row["serial"], "get-state"],
            capture_output=True,
            text=True,
            check=False,
        )
        rows.append({"serial": row["serial"], "state": result.stdout.strip()})

with output_file.open("w", encoding="utf-8", newline="") as f:
    writer = csv.DictWriter(f, fieldnames=["serial", "state"])
    writer.writeheader()
    writer.writerows(rows)
```

## 这个组合为什么比手工拼更稳
- `csv` 帮你处理字段顺序、转义和换行
- `pathlib` 帮你处理目录、文件名和跨平台路径
- `subprocess` 帮你拿到返回码、stdout、stderr

如果你把这三部分都手写成字符串拼接，脚本会很快变得脆弱。

## 一个更真实的测试开发场景
### 批量回收设备日志
1. 从 CSV 读取设备序列号和日志路径
2. 用 `subprocess` 调 `adb pull`
3. 用 `pathlib` 把日志归档到按日期组织的目录
4. 再输出一份设备拉取结果表

这类脚本的核心价值，不是某个单独模块，而是三者配合后的稳定流程。

## 常见排障点
- CSV 列名拼错，结果字典取值为空
- 命令执行失败但没检查返回码
- 输出目录不存在，直接写文件报错
- 路径写死，换机器或换 CI 环境就失效

## 常见误区
- 路径用字符串硬拼，换目录就出错
- 调命令只看 stdout，不看返回码和 stderr
- 读写 CSV 时忽略编码和换行问题
- 把脚本当一次性工具写，结果后续完全没法复用
