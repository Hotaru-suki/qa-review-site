const fs = require("fs");
const path = require("path");
const { createContext } = require("./content-tree");

const projectRoot = path.resolve(__dirname, "..");
const context = createContext(projectRoot);

const categoryFileMap = new Map([
  ["测试方向", "config/content/test-direction.js"],
  ["技术基础", "config/content/tech-base.js"],
  ["代码题目", "config/content/code-problems.js"],
  ["面试题目", "config/content/interviews.js"]
]);

function listDirs(dirPath) {
  return fs
    .readdirSync(dirPath, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name);
}

function listArticleSlugs(dirPath) {
  return fs
    .readdirSync(dirPath, { withFileTypes: true })
    .filter(entry => entry.isFile() && entry.name.endsWith(".md") && entry.name !== "index.md")
    .map(entry => path.basename(entry.name, ".md"));
}

function mergeOrder(existing, discovered) {
  return [...new Set((existing || []).filter(item => discovered.includes(item)).concat(discovered))];
}

function syncCategory(category) {
  const categoryDir = path.join(projectRoot, category.path);
  const discoveredSections = listDirs(categoryDir);
  category.sectionOrder = mergeOrder(category.sectionOrder, discoveredSections);
  category.topicOrder ||= {};
  category.articleOrder ||= {};

  discoveredSections.forEach(sectionName => {
    const sectionDir = path.join(categoryDir, sectionName);
    const sectionKey = `${category.path.replace(/^content\//, "")}/${sectionName}`;
    const discoveredTopics = listDirs(sectionDir);

    category.topicOrder[sectionKey] = mergeOrder(
      category.topicOrder[sectionKey],
      discoveredTopics
    );

    discoveredTopics.forEach(topicName => {
      const topicDir = path.join(sectionDir, topicName);
      const topicKey = `${sectionKey}/${topicName}`;
      const discoveredArticles = listArticleSlugs(topicDir);

      category.articleOrder[topicKey] = mergeOrder(
        category.articleOrder[topicKey],
        discoveredArticles
      );
    });
  });
}

function writeCategoryConfig(category) {
  const filePath = categoryFileMap.get(category.title);
  if (!filePath) {
    throw new Error(`未配置分类输出文件: ${category.title}`);
  }

  fs.writeFileSync(
    path.join(projectRoot, filePath),
    `module.exports = ${JSON.stringify(category, null, 2)};\n`
  );
}

function main() {
  context.config.categories.forEach(category => {
    syncCategory(category);
    writeCategoryConfig(category);
  });

  console.log(
    JSON.stringify(
      {
        status: "synced",
        categories: context.config.categories.length
      },
      null,
      2
    )
  );
}

main();
