const fs = require("fs");
const path = require("path");
const { createContext } = require("./content-tree");

const context = createContext(path.resolve(__dirname, ".."));

function walkMarkdownFiles(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkMarkdownFiles(fullPath, files);
      continue;
    }

    if (entry.isFile() && entry.name.endsWith(".md")) {
      files.push(context.normalizePath(fullPath));
    }
  }

  return files;
}

function createIssueCollector() {
  const issues = [];

  return {
    push(type, file, message) {
      issues.push({ type, file, message });
    },
    all() {
      return issues;
    }
  };
}

function validateMarkdownTitles(markdownFiles, issueCollector) {
  markdownFiles.forEach(filePath => {
    const meta = context.readMarkdownMeta(filePath);
    if (!meta.title) {
      issueCollector.push(
        "missing-title",
        path.relative(context.projectRoot, filePath),
        "缺少一级标题或可用的 frontmatter 标题"
      );
    }
  });
}

function validateReferencedFiles(reviewData, markdownFiles, issueCollector) {
  const referenced = new Set();

  reviewData.forEach(group => {
    group.sections.forEach(section => {
      referenced.add(section.file);
      (section.topics || []).forEach(topic => {
        referenced.add(topic.file);
        (topic.articles || []).forEach(article => {
          referenced.add(article.file);
        });
      });
    });
  });

  const normalizedContent = new Set(
    markdownFiles.map(filePath => path.relative(context.projectRoot, filePath).replace(/\\/g, "/"))
  );

  [...referenced].forEach(file => {
    if (!normalizedContent.has(file)) {
      issueCollector.push("missing-file", file, "已接入目录，但文件不存在");
    }
  });

  [...normalizedContent]
    .filter(file => !referenced.has(file))
    .forEach(file => {
      issueCollector.push("unused-file", file, "文件存在，但未接入知识树");
    });
}

function validateConfigCoverage(issueCollector) {
  context.config.categories.forEach(category => {
    const categoryDir = path.join(context.projectRoot, category.path);
    const configuredSections = new Set(category.sectionOrder || []);

    fs.readdirSync(categoryDir, { withFileTypes: true })
      .filter(entry => entry.isDirectory())
      .forEach(entry => {
        if (!configuredSections.has(entry.name)) {
          issueCollector.push(
            "unconfigured-section",
            `${category.path}/${entry.name}`,
            "目录存在，但未出现在 sectionOrder 中，将按字母序追加"
          );
        }
      });
  });
}

function main() {
  const issueCollector = createIssueCollector();
  const contentDir = path.join(context.projectRoot, "content");
  const markdownFiles = walkMarkdownFiles(contentDir);
  const reviewData = context.buildReviewData();

  validateMarkdownTitles(markdownFiles, issueCollector);
  validateReferencedFiles(reviewData, markdownFiles, issueCollector);
  validateConfigCoverage(issueCollector);

  const issues = issueCollector.all();
  if (issues.length === 0) {
    console.log(
      JSON.stringify(
        {
          status: "ok",
          markdownFiles: markdownFiles.length,
          categories: reviewData.length
        },
        null,
        2
      )
    );
    return;
  }

  console.log(
    JSON.stringify(
      {
        status: "issues",
        count: issues.length
      },
      null,
      2
    )
  );

  issues.forEach(issue => {
    console.log(`[${issue.type}] ${issue.file} - ${issue.message}`);
  });

  process.exitCode = 1;
}

main();
