module.exports = {
  "title": "测试方向",
  "path": "content/test-direction",
  "sectionOrder": [
    "test-basic",
    "api-test",
    "performance-test",
    "compatibility-test",
    "weak-network-test",
    "test-tools"
  ],
  "topicOrder": {
    "test-direction/test-basic": [
      "concepts"
    ],
    "test-direction/api-test": [
      "basic-cognition",
      "validation-and-consistency",
      "risk-and-control",
      "stability-and-performance",
      "engineering-practice",
      "advanced-topics",
      "quality-dimensions",
      "tools-and-practice"
    ],
    "test-direction/performance-test": [
      "basics",
      "metrics-and-tooling",
      "analysis-and-location",
      "client-and-server"
    ],
    "test-direction/compatibility-test": [
      "environment-matrix",
      "design-and-location"
    ],
    "test-direction/weak-network-test": [
      "network-fault-models",
      "recovery-and-consistency"
    ],
    "test-direction/test-tools": [
      "visual-automation"
    ]
  },
  "articleOrder": {
    "test-direction/test-basic/concepts": [
      "smoke-test",
      "regression-test",
      "test-case"
    ],
    "test-direction/api-test/basic-cognition": [
      "api-testing-overview",
      "api-testing-process",
      "api-testing-case-design",
      "api-doc-review-and-test-point-extraction",
      "preconditions-test-data-and-dependency-mapping"
    ],
    "test-direction/api-test/validation-and-consistency": [
      "response-contract-vs-business-result",
      "business-key-and-state-checks",
      "async-side-effect-verification",
      "cache-db-read-after-write-and-lag",
      "message-dedup-compensation-and-eventual-consistency"
    ],
    "test-direction/api-test/risk-and-control": [
      "error-inputs-and-risk-defense",
      "permission-model-and-cross-role-testing",
      "rate-limit-replay-and-abuse-protection",
      "sensitive-data-desensitization-and-audit",
      "batch-operation-compensation-and-write-risk"
    ],
    "test-direction/api-test/stability-and-performance": [
      "reliability-vs-throughput",
      "capacity-ramp-and-failure-thresholds",
      "dependency-timeout-and-circuit-breaker-testing"
    ],
    "test-direction/api-test/engineering-practice": [
      "debugging-to-regression-closure",
      "test-data-and-environment-governance",
      "case-layering-and-assertion-strategy",
      "test-account-environment-isolation-and-cleanup",
      "regression-scope-and-change-impact-analysis"
    ],
    "test-direction/performance-test/basics": [
      "performance-test-types",
      "performance-workload-modeling",
      "business-model-alignment-and-target-definition",
      "warmup-steady-state-and-ramp-design",
      "performance-test-baseline"
    ],
    "test-direction/performance-test/metrics-and-tooling": [
      "performance-observability-and-evidence",
      "client-server-metric-alignment",
      "throughput-percentile-and-error-budget",
      "logs-metrics-traces-and-evidence-correlation",
      "ue-performance-metrics-and-tooling"
    ],
    "test-direction/performance-test/analysis-and-location": [
      "performance-metrics-interpretation",
      "capacity-knee-and-breakpoint-detection",
      "ab-comparison-single-variable-and-attribution",
      "bottleneck-hypothesis-and-verification",
      "performance-bottleneck-location"
    ],
    "test-direction/performance-test/client-and-server": [
      "client-performance-thinking",
      "load-generator-and-service-side-bias",
      "mobile-thermal-memory-pressure-and-throttling",
      "dependency-resource-isolation-and-capacity-illusion",
      "server-performance-thinking"
    ],
    "test-direction/compatibility-test/environment-matrix": [
      "compatibility-dimensions",
      "device-fragmentation-and-version-strategy",
      "system-webview-and-sdk-compatibility",
      "compatibility-priority"
    ],
    "test-direction/compatibility-test/design-and-location": [
      "compatibility-case-design",
      "compatibility-evidence-and-regression-matrix",
      "install-upgrade-rollback-and-data-migration",
      "compatibility-problem-location"
    ],
    "test-direction/weak-network-test/network-fault-models": [
      "latency-loss-jitter",
      "bandwidth-fluctuation-and-burst-loss",
      "request-reordering-and-stale-response",
      "disconnect-switching"
    ],
    "test-direction/weak-network-test/recovery-and-consistency": [
      "weak-network-retry-and-idempotency",
      "offline-cache-and-resume-strategy",
      "upload-download-resume-and-checkpoint",
      "weak-network-state-recovery"
    ],
    "test-direction/test-tools/visual-automation": [
      "visual-automation-overview",
      "template-matching",
      "ocr",
      "object-detection-yolo",
      "background-subtraction",
      "internal-state-reading",
      "multi-signal-fusion-and-fallback",
      "record-replay-and-system-design"
    ],
    "test-direction/api-test/advanced-topics": [
      "api-authentication-and-token",
      "api-status-code-and-error-handling",
      "api-testing-interview-questions",
      "api-testing-report"
    ],
    "test-direction/api-test/quality-dimensions": [
      "api-security-testing",
      "availability-testing",
      "compatibility-testing",
      "correctness-testing",
      "data-consistency-testing",
      "idempotency-testing",
      "performance-testing",
      "robustness-testing",
      "stability-testing"
    ],
    "test-direction/api-test/tools-and-practice": [
      "api-automation-pytest-requests",
      "api-data-validation",
      "api-mock-testing",
      "api-performance-with-jmeter",
      "api-tools-postman-apifox"
    ]
  }
};
