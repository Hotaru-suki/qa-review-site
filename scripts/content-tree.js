const fs = require("fs");
const path = require("path");

function normalizePath(filePath) {
  return filePath.split(path.sep).join("/");
}

function fileExists(filePath) {
  return fs.existsSync(filePath) && fs.statSync(filePath).isFile();
}

function directoryExists(dirPath) {
  return fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory();
}

function readMarkdownMeta(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const lines = content.split(/\r?\n/);
  const meta = { title: null, navTitle: null, order: null };

  if (lines[0] === "---") {
    for (let index = 1; index < lines.length; index += 1) {
      const line = lines[index];
      if (line === "---") {
        break;
      }

      const match = line.match(/^([A-Za-z_][\w-]*):\s*(.+)\s*$/);
      if (!match) {
        continue;
      }

      const key = match[1].toLowerCase();
      const value = match[2].trim().replace(/^['"]|['"]$/g, "");

      if (key === "title") meta.title = value;
      if (key === "nav_title" || key === "navtitle") meta.navTitle = value;
      if (key === "order" && /^-?\d+$/.test(value)) meta.order = Number(value);
    }
  }

  const headingMatch = content.match(/^#\s+(.+)$/m);
  return {
    title: meta.navTitle || meta.title || (headingMatch ? headingMatch[1].trim() : null),
    order: meta.order
  };
}

function titleFromSlug(slug) {
  return slug
    .split("-")
    .filter(Boolean)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function slugFromRelative(relativePath) {
  return normalizePath(relativePath)
    .replace(/^content\//, "")
    .replace(/\/index\.md$/, "")
    .replace(/\.md$/, "")
    .replace(/\//g, "-");
}

function readDirEntries(dirPath, entryType) {
  return fs
    .readdirSync(dirPath, { withFileTypes: true })
    .filter(entry => (entryType === "dir" ? entry.isDirectory() : entry.isFile()))
    .map(entry => entry.name);
}

function orderItems(items, explicitOrder, orderOf) {
  const position = new Map(explicitOrder.map((value, index) => [value, index]));

  return [...items].sort((left, right) => {
    const leftOrder = orderOf(left);
    const rightOrder = orderOf(right);

    if (leftOrder != null || rightOrder != null) {
      if (leftOrder == null) return 1;
      if (rightOrder == null) return -1;
      if (leftOrder !== rightOrder) return leftOrder - rightOrder;
    }

    const leftPosition = position.get(left.orderKey);
    const rightPosition = position.get(right.orderKey);

    if (leftPosition != null || rightPosition != null) {
      if (leftPosition == null) return 1;
      if (rightPosition == null) return -1;
      if (leftPosition !== rightPosition) return leftPosition - rightPosition;
    }

    return left.sortLabel.localeCompare(right.sortLabel, "zh-Hans-CN");
  });
}

function createContext(projectRoot) {
  const resolvedRoot = path.resolve(projectRoot);
  const config = require(path.join(resolvedRoot, "content.config.js"));

  function toProjectRelative(absolutePath) {
    return normalizePath(path.relative(resolvedRoot, absolutePath));
  }

  function collectArticles(topicDir, articleOrder) {
    const articleFiles = readDirEntries(topicDir, "file")
      .filter(fileName => fileName.endsWith(".md") && fileName !== "index.md")
      .map(fileName => {
        const absolutePath = path.join(topicDir, fileName);
        const relativePath = toProjectRelative(absolutePath);
        const meta = readMarkdownMeta(absolutePath);

        return {
          id: slugFromRelative(relativePath),
          title: meta.title || titleFromSlug(path.basename(fileName, ".md")),
          file: relativePath,
          orderKey: path.basename(fileName, ".md"),
          sortLabel: meta.title || fileName,
          order: meta.order
        };
      });

    return orderItems(articleFiles, articleOrder, item => item.order).map(
      ({ id, title, file }) => ({ id, title, file })
    );
  }

  function collectTopics(sectionDir, topicOrder, articleOrderMap) {
    const topicDirs = readDirEntries(sectionDir, "dir");

    return orderItems(
      topicDirs.map(topicName => {
        const absolutePath = path.join(sectionDir, topicName);
        const indexPath = path.join(absolutePath, "index.md");
        if (!fileExists(indexPath)) {
          throw new Error(`缺少主题概述页: ${toProjectRelative(indexPath)}`);
        }

        const relativeDir = toProjectRelative(absolutePath);
        const relativeIndex = toProjectRelative(indexPath);
        const meta = readMarkdownMeta(indexPath);

        return {
          id: slugFromRelative(relativeDir),
          title: meta.title || titleFromSlug(topicName),
          file: relativeIndex,
          articles: collectArticles(
            absolutePath,
            articleOrderMap[relativeDir.replace(/^content\//, "")] || []
          ),
          orderKey: topicName,
          sortLabel: meta.title || topicName,
          order: meta.order
        };
      }),
      topicOrder,
      item => item.order
    ).map(({ id, title, file, articles }) => ({ id, title, file, articles }));
  }

  function collectSections(categoryConfig) {
    const categoryDir = path.join(resolvedRoot, categoryConfig.path);
    if (!directoryExists(categoryDir)) {
      throw new Error(`缺少分类目录: ${categoryConfig.path}`);
    }

    const sectionDirs = readDirEntries(categoryDir, "dir");
    const topicOrderMap = categoryConfig.topicOrder || {};
    const articleOrderMap = categoryConfig.articleOrder || {};

    return orderItems(
      sectionDirs.map(sectionName => {
        const absolutePath = path.join(categoryDir, sectionName);
        const indexPath = path.join(absolutePath, "index.md");
        if (!fileExists(indexPath)) {
          throw new Error(`缺少专题概述页: ${toProjectRelative(indexPath)}`);
        }

        const relativeDir = toProjectRelative(absolutePath);
        const relativeIndex = toProjectRelative(indexPath);
        const meta = readMarkdownMeta(indexPath);

        return {
          id: slugFromRelative(relativeDir),
          title: meta.title || titleFromSlug(sectionName),
          file: relativeIndex,
          topics: collectTopics(
            absolutePath,
            topicOrderMap[relativeDir.replace(/^content\//, "")] || [],
            articleOrderMap
          ),
          orderKey: sectionName,
          sortLabel: meta.title || sectionName,
          order: meta.order
        };
      }),
      categoryConfig.sectionOrder || [],
      item => item.order
    ).map(({ id, title, file, topics }) => ({ id, title, file, topics }));
  }

  function buildWelcomeNode() {
    const welcomeFile = path.join(resolvedRoot, config.welcome.file);
    if (!fileExists(welcomeFile)) {
      throw new Error(`缺少欢迎页: ${config.welcome.file}`);
    }

    const meta = readMarkdownMeta(welcomeFile);
    const welcomeId = slugFromRelative(config.welcome.file);

    return {
      category: config.welcome.category,
      sections: [
        {
          id: welcomeId,
          title: config.welcome.sectionTitle,
          file: config.welcome.file,
          topics: [
            {
              id: `${welcomeId}-start`,
              title: config.welcome.topicTitle,
              file: config.welcome.file,
              articles: [
                {
                  id: welcomeId,
                  title: meta.title || config.welcome.articleTitle,
                  file: config.welcome.file
                }
              ]
            }
          ]
        }
      ]
    };
  }

  function buildReviewData() {
    return [
      buildWelcomeNode(),
      ...config.categories.map(categoryConfig => ({
        category: categoryConfig.title,
        sections: collectSections(categoryConfig)
      }))
    ];
  }

  return {
    projectRoot: resolvedRoot,
    config,
    normalizePath,
    fileExists,
    directoryExists,
    readMarkdownMeta,
    slugFromRelative,
    buildReviewData
  };
}

module.exports = {
  createContext,
  normalizePath,
  fileExists,
  directoryExists,
  readMarkdownMeta,
  slugFromRelative
};
