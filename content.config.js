module.exports = {
  welcome: {
    category: "开始使用",
    file: "content/welcome.md",
    sectionTitle: "欢迎页",
    topicTitle: "开始使用",
    articleTitle: "欢迎来到你的知识库"
  },
  categories: [
    require("./config/content/test-direction"),
    require("./config/content/tech-base"),
    require("./config/content/code-problems"),
    require("./config/content/interviews")
  ]
};
