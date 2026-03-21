function article(id, title, file) {
  return { id, title, file };
}

function section(id, title, file, children = []) {
  return { id, title, file, children };
}

function category(categoryName, sections) {
  return { category: categoryName, sections };
}

const reviewData = [
  category("开始使用", [
    section("welcome-group", "欢迎页", "content/welcome.md", [
      article("welcome", "开始使用", "content/welcome.md")
    ])
  ]),

  category("测试方向", [
    section("test-basic", "测试基础", "content/test-direction/test-basic/index.md"),
    section("api-test", "接口测试", "content/test-direction/api-test/index.md", [
      article("api-testing-overview", "接口测试概述", "content/test-direction/api-test/api-testing-overview.md"), 
      article("api-testing-process", "接口测试流程", "content/test-direction/api-test/api-testing-process.md"), 
      article("api-testing-case-design", "接口测试用例设计思路", "content/test-direction/api-test/api-testing-case-design.md"), 
      article("availability-testing", "可用性测试", "content/test-direction/api-test/availability-testing.md"),
      article("correctness-testing", "正确性测试", "content/test-direction/api-test/correctness-testing.md"), 
      article("robustness-testing", "健壮性性测试", "content/test-direction/api-test/robustness-testing.md"),
      article("stability-testing", "稳定性测试", "content/test-direction/api-test/stability-testing.md"), 
      article("performance-testing", "接口性能测试", "content/test-direction/api-test/performance-testing.md"),
      article("data-consistency-testing", "数据一致性测试", "content/test-direction/api-test/data-consistency-testing.md"), 
      article("idempotency-testing", "幂等性测试", "content/test-direction/api-test/idempotency-testing.md"),
      article("compatibility-testing", "兼容性测试", "content/test-direction/api-test/compatibility-testing.md"), 
      article("api-security-testing", "接口安全性测试", "content/test-direction/api-test/api-security-testing.md"), 
      article("api-tools-postman-apifox", "Postman / Apifox 调试", "content/test-direction/api-test/api-tools-postman-apifox.md"), 
      article("api-automation-pytest-requests", "pytest + requests 接口自动化", "content/test-direction/api-test/api-automation-pytest-requests.md"), 
      article("api-performance-with-jmeter", "JMeter 接口性能测试", "content/test-direction/api-test/api-performance-with-jmeter.md"), 
      article("api-data-validation", "MySQL / Redis 数据校验", "content/test-direction/api-test/api-data-validation.md"), 
      article("api-mock-testing", "Mock 在接口测试中的应用", "content/test-direction/api-test/api-mock-testing.md"), 
      article("api-testing-interview-questions", "接口测试常见面试题", "content/test-direction/api-test/api-testing-interview-questions.md"), 
      article("api-authentication-and-token", "鉴权与 Token 机制", "content/test-direction/api-test/api-authentication-and-token.md"), 
      article("api-status-code-and-error-handling", "错误码、状态码与异常处理", "content/test-direction/api-test/api-status-code-and-error-handling.md"), 
      article("api-testing-report", "接口测试报告与缺陷记录", "content/test-direction/api-test/api-testing-report.md"), 

    ]), 
    section("performance-test", "性能测试", "content/test-direction/performance-test/index.md"),
    section("compatibility-test", "兼容性测试", "content/test-direction/compatibility-test/index.md"),
    section("weak-network-test", "弱网测试", "content/test-direction/weak-network-test/index.md"),
    section("test-tools", "测试工具", "content/test-direction/test-tools/index.md")
  ]),

  category("技术基础", [
    section("python", "Python", "content/tech-base/python/index.md"),
    section("cpp", "C++", "content/tech-base/cpp/index.md"),
    section("dsa", "数据结构与算法", "content/tech-base/dsa/index.md"),
    section("database-sql", "数据库与 SQL", "content/tech-base/database-sql/index.md"),
    section("linux", "Linux", "content/tech-base/linux/index.md"),
    section("network", "计算机网络", "content/tech-base/network/index.md"),
    section("os", "操作系统", "content/tech-base/os/index.md")
  ]),

  category("代码题目", [
    section("code-reading", "代码阅读", "content/code-problems/code-reading/index.md"),
    section("bug-location", "Bug 定位", "content/code-problems/bug-location/index.md"),
    section("sql-problems", "SQL 题", "content/code-problems/sql-problems/index.md"),
    section("cpp-problems", "C++ 题", "content/code-problems/cpp-problems/index.md"),
    section("python-problems", "Python 题", "content/code-problems/python-problems/index.md"),
    section("scenario-problems", "场景设计题", "content/code-problems/scenario-problems/index.md")
  ]),

  category("面试题目", [
    section("qa-interview", "测试岗面试题", "content/interviews/qa-interview/index.md"),
    section("tech-interview", "技术基础面试题", "content/interviews/tech-interview/index.md"),
    section("game-qa-interview", "游戏测试面试题", "content/interviews/game-qa-interview/index.md"),
    section("project-interview", "项目经历题", "content/interviews/project-interview/index.md"),
    section("intro-and-question", "自我介绍与反问", "content/interviews/intro-and-question/index.md")
  ])
];