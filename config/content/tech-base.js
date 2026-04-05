module.exports = {
  "title": "技术基础",
  "path": "content/tech-base",
  "sectionOrder": [
    "python",
    "cpp",
    "dsa",
    "database-sql",
    "linux",
    "network",
    "os"
  ],
  "topicOrder": {
    "tech-base/python": [
      "data-types",
      "control-flow-and-functions",
      "file-and-standard-library",
      "exception-and-classes"
    ],
    "tech-base/cpp": [
      "basic-syntax",
      "object-model-and-memory",
      "stl-and-high-frequency-syntax"
    ],
    "tech-base/dsa": [
      "container-comparison",
      "linear-structures",
      "hash-and-tree",
      "algorithmic-thinking"
    ],
    "tech-base/database-sql": [
      "query-foundations",
      "business-validation",
      "storage-and-modeling",
      "transactions-and-concurrency",
      "optimization-and-troubleshooting",
      "interview-and-expression",
      "database-principles",
      "interview-faq",
      "performance-and-troubleshooting",
      "sql-basics"
    ],
    "tech-base/linux": [
      "common-commands",
      "process-and-service",
      "network-and-port",
      "logging-and-troubleshooting"
    ],
    "tech-base/network": [
      "transport-and-connections",
      "http-and-dns",
      "performance-and-troubleshooting"
    ],
    "tech-base/os": [
      "concurrency-and-scheduling",
      "memory-and-process-management",
      "process-thread-and-communication",
      "file-system-and-io"
    ]
  },
  "articleOrder": {
    "tech-base/python/data-types": [
      "python-data-types-overview",
      "mutable-immutable-and-copying",
      "python-data-types-cheatsheet"
    ],
    "tech-base/python/control-flow-and-functions": [
      "python-condition-loop",
      "decorator-generator-and-iterator",
      "python-functions-and-scope"
    ],
    "tech-base/python/file-and-standard-library": [
      "python-file-json",
      "python-csv-pathlib-subprocess-workflow",
      "python-common-standard-library"
    ],
    "tech-base/python/exception-and-classes": [
      "python-exception-handling",
      "python-dataclass-and-object-model",
      "python-context-manager-and-resource-cleanup",
      "python-custom-exception-and-boundary",
      "python-class-and-object"
    ],
    "tech-base/cpp/basic-syntax": [
      "const-copy-and-parameter-passing",
      "lifetime-reference-and-dangling",
      "references-pointers-and-basics"
    ],
    "tech-base/cpp/object-model-and-memory": [
      "object-lifecycle",
      "memory-leak-and-troubleshooting",
      "copy-move-and-resource"
    ],
    "tech-base/cpp/stl-and-high-frequency-syntax": [
      "templates-string-pair-lambda-priority-queue",
      "iterator-invalidations-and-common-pitfalls",
      "stl-containers-iterators-algorithms"
    ],
    "tech-base/dsa/container-comparison": [
      "container-selection-by-access-pattern",
      "ordered-vs-unordered-structure-tradeoffs",
      "cpp-python-containers-comparison"
    ],
    "tech-base/dsa/linear-structures": [
      "array-list-stack-queue",
      "monotonic-structure-and-sliding-window",
      "deque-heap-priority"
    ],
    "tech-base/dsa/hash-and-tree": [
      "hash-table-set-map",
      "trie-and-prefix-indexing",
      "tree-bst-balance"
    ],
    "tech-base/dsa/algorithmic-thinking": [
      "time-space-complexity",
      "recursion-backtracking-and-state-space",
      "common-problem-patterns"
    ],
    "tech-base/database-sql/query-foundations": [
      "query-thinking-and-result-shaping",
      "grouping-dedup-and-latest-record",
      "join-order-and-result-cardinality"
    ],
    "tech-base/database-sql/business-validation": [
      "business-key-reconciliation",
      "data-check-sql-patterns",
      "cross-table-consistency-checks"
    ],
    "tech-base/database-sql/storage-and-modeling": [
      "table-design-and-normalization",
      "constraints-and-data-integrity",
      "hotspot-data-and-sharding-smells"
    ],
    "tech-base/database-sql/transactions-and-concurrency": [
      "isolation-levels-and-anomalies",
      "locks-mvcc-and-deadlocks",
      "long-transaction-and-lock-wait-diagnosis"
    ],
    "tech-base/database-sql/optimization-and-troubleshooting": [
      "query-slowdown-diagnosis-path",
      "index-miss-and-scan-expansion",
      "sort-group-temporary-table-cost"
    ],
    "tech-base/database-sql/interview-and-expression": [
      "database-concepts-answering-framework",
      "database-problem-diagnosis-answering",
      "sql-optimization-answering-and-tradeoff"
    ],
    "tech-base/linux/common-commands": [
      "linux-files-and-search",
      "linux-pipeline-and-redirection",
      "linux-text-processing"
    ],
    "tech-base/linux/process-and-service": [
      "linux-process-observation",
      "signal-exit-code-and-process-control",
      "linux-service-control"
    ],
    "tech-base/linux/network-and-port": [
      "linux-network-check",
      "linux-curl-ss-tcpdump-workflow",
      "linux-connection-location"
    ],
    "tech-base/linux/logging-and-troubleshooting": [
      "linux-log-reading",
      "journalctl-dmesg-and-kernel-signals",
      "linux-troubleshooting-flow"
    ],
    "tech-base/network/transport-and-connections": [
      "tcp-udp-core-differences",
      "tcp-flow-and-congestion-control",
      "tcp-handshake-and-reliability"
    ],
    "tech-base/network/http-and-dns": [
      "url-to-page-rendering",
      "http-cache-cors-and-preflight",
      "cookie-session-token"
    ],
    "tech-base/network/performance-and-troubleshooting": [
      "network-latency-timeout-retry",
      "connection-pool-keepalive-and-half-open",
      "dns-tls-proxy-layer-location",
      "network-problem-location",
      "retry-storm-and-backoff"
    ],
    "tech-base/os/concurrency-and-scheduling": [
      "thread-safety-and-synchronization",
      "deadlock-livelock-and-starvation",
      "core-concepts"
    ],
    "tech-base/os/memory-and-process-management": [
      "memory-virtual-and-physical",
      "memory-leak-oom-and-core-dump",
      "process-state-and-context-switch"
    ],
    "tech-base/os/process-thread-and-communication": [
      "ipc-selection-and-scenario",
      "thread-pool-and-context-switch-cost",
      "process-thread-communication-and-scheduling"
    ],
    "tech-base/os/file-system-and-io": [
      "file-system-core-concepts",
      "disk-io-page-cache-and-writeback",
      "inode-fd-and-open-file-table",
      "mmap-vs-read-write-and-page-fault",
      "io-blocking-and-multiplexing"
    ],
    "tech-base/database-sql/database-principles": [
      "database-fundamentals",
      "storage-engine-and-index-organization",
      "transactions-and-concurrency-control"
    ],
    "tech-base/database-sql/interview-faq": [
      "database-and-sql-interview-faq",
      "database-transaction-lock-faq",
      "sql-and-index-misconceptions"
    ],
    "tech-base/database-sql/performance-and-troubleshooting": [
      "deep-pagination-covering-index-and-back-to-table",
      "indexes-and-execution-plans",
      "slow-queries-and-troubleshooting"
    ],
    "tech-base/database-sql/sql-basics": [
      "joins-and-subqueries",
      "sql-basics",
      "sql-scenario-problems",
      "window-functions-and-faq"
    ]
  }
};
