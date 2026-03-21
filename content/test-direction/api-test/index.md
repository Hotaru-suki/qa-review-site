# 接口测试

接口测试（API Testing）是软件测试中的核心能力之一，主要用于验证系统各模块之间的数据交互是否符合预期。相比页面测试，接口测试不依赖前端界面，更关注请求、响应、业务逻辑、数据流转以及系统边界，因此在功能验证、联调排查、自动化回归、性能压测和质量保障中都非常重要。

在实际项目中，接口测试不仅要关注“接口能不能调通”，还要继续判断“接口返回得对不对”“异常情况下是否可控”“高并发下是否稳定”“数据是否一致”“是否存在安全风险”等问题。因此，一个完整的接口测试体系，通常会从多个维度对接口质量进行拆解和验证。

本部分将围绕接口测试的基础概念、核心关注点、常见方法与常用工具进行系统梳理，并进一步拆分为多个专题子文档，便于逐项学习、补充和维护。

---

## 本章内容结构

### 基础认知
- [接口测试概述](.content/test-direction/api-test/api-testing-overview.md)
- [接口测试常见流程](.content/test-direction/api-test/api-testing-process.md)
- [接口测试用例设计思路](.content/test-direction/api-test/api-testing-case-design.md)

### 核心质量维度
- [可用性测试](.content/test-direction/api-test/availability-testing.md)
- [正确性测试](.content/test-direction/api-test/correctness-testing.md)
- [稳定性测试](.content/test-direction/api-test/stability-testing.md)
- [健壮性测试](.content/test-direction/api-test/robustness-testing.md)
- [性能测试](.content/test-direction/api-test/performance-testing.md)
- [数据一致性测试](.content/test-direction/api-test/data-consistency-testing.md)
- [幂等性测试](.content/test-direction/api-test/idempotency-testing.md)
- [安全性测试（接口视角）](.content/test-direction/api-test/api-security-testing.md)
- [兼容性测试](.content/test-direction/api-test/compatibility-testing.md)

### 工具与实践
- [Postman / Apifox 调试](.content/test-direction/api-test/api-tools-postman-apifox.md)
- [pytest + requests 接口自动化](.content/test-direction/api-test/api-automation-pytest-requests.md)
- [JMeter 接口性能测试](.content/test-direction/api-test/api-performance-with-jmeter.md)
- [MySQL / Redis 数据校验](.content/test-direction/api-test/api-data-validation.md)
- [Mock 在接口测试中的应用](.content/test-direction/api-test/api-mock-testing.md)

### 进阶专题
- [接口测试常见面试题](.content/test-direction/api-test/api-testing-interview-questions.md)
- [鉴权与 Token 机制](.content/test-direction/api-test/api-authentication-and-token.md)
- [错误码、状态码与异常处理](.content/test-direction/api-test/api-status-code-and-error-handling.md)
- [接口测试报告与缺陷记录](.content/test-direction/api-test/api-testing-report.md)

---

## 学习建议

如果是从零开始学习接口测试，建议按以下顺序阅读：

1. 先理解接口测试的基本概念、作用和整体流程
2. 再掌握可用性、正确性、健壮性等核心测试维度
3. 然后学习常用工具与自动化实践方法
4. 最后补充性能、安全、幂等性、数据一致性等进阶专题

---

## 说明

本章节内容以测试岗位常见业务场景为主，兼顾校招面试、项目实践与知识库整理需求。  
各子文档将尽量采用统一结构展开，包括：

- 概念定义
- 为什么要测
- 重点关注内容
- 常用方法
- 常见问题
- 测试示例
- 小结

这样既便于系统学习，也便于后续持续补充和维护。