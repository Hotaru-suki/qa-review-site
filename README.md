# 测试与技术知识库

## 项目介绍

这是一个基于 `HTML + CSS + JavaScript + Markdown` 的纯静态知识库项目，用来组织测试方向、技术基础、代码题目和面试题目相关内容。

项目目标不是简单堆 Markdown，而是把内容整理成一棵稳定的知识树：

- 一级分类：大的知识域
- 二级专题：某个专题的总览页
- 三级主题：专题下的知识组
- 四级文章：具体知识点正文

站点形态是左侧多级导航、右侧正文阅读。它不依赖后端，适合本地长期维护，也适合部署到 GitHub Pages 或其他静态托管平台。

## 项目结构

```text
qa-review-site/
├─ index.html
├─ style.css
├─ script.js
├─ data.js
├─ content.config.js
├─ package.json
├─ README.md
├─ scripts/
│  ├─ content-tree.js
│  ├─ sync-content-config.js
│  ├─ validate-content.js
│  └─ generate-data.js
├─ config/
│  └─ content/
│     ├─ test-direction.js
│     ├─ tech-base.js
│     ├─ code-problems.js
│     └─ interviews.js
└─ content/
   ├─ welcome.md
   ├─ test-direction/
   ├─ tech-base/
   ├─ code-problems/
   └─ interviews/
```

核心文件职责如下：

- [index.html](/mnt/c/Users/siest/Desktop/qa-review-site/index.html)：页面骨架
- [style.css](/mnt/c/Users/siest/Desktop/qa-review-site/style.css)：站点样式
- [script.js](/mnt/c/Users/siest/Desktop/qa-review-site/script.js)：前端导航渲染、状态切换、Markdown 加载
- [data.js](/mnt/c/Users/siest/Desktop/qa-review-site/data.js)：前端使用的知识树数据，生成产物，不手工编辑
- [content/](/mnt/c/Users/siest/Desktop/qa-review-site/content)：所有专题概述页和知识页正文
- [content.config.js](/mnt/c/Users/siest/Desktop/qa-review-site/content.config.js)：配置入口，负责汇总各分类配置
- [config/content/](/mnt/c/Users/siest/Desktop/qa-review-site/config/content)：按一级分类拆分的顺序配置
- [scripts/content-tree.js](/mnt/c/Users/siest/Desktop/qa-review-site/scripts/content-tree.js)：共享目录扫描、标题提取、知识树构建逻辑
- [scripts/sync-content-config.js](/mnt/c/Users/siest/Desktop/qa-review-site/scripts/sync-content-config.js)：把新增目录和文章同步到配置中
- [scripts/validate-content.js](/mnt/c/Users/siest/Desktop/qa-review-site/scripts/validate-content.js)：校验标题、目录接入和缺失文件
- [scripts/generate-data.js](/mnt/c/Users/siest/Desktop/qa-review-site/scripts/generate-data.js)：生成最终的 [data.js](/mnt/c/Users/siest/Desktop/qa-review-site/data.js)

## 如何配置运行

### 环境要求

- Node.js：用于执行维护脚本
- 任意静态服务器：用于本地预览页面

这个项目没有打包步骤，Node 只用于维护知识树数据，不参与页面运行时。

### 安装与准备

项目没有额外依赖，克隆后即可使用。

如需使用 npm 脚本，确保本机可执行：

```bash
node -v
npm -v
```

### 本地运行

方式一：使用 VS Code Live Server

1. 用 VS Code 打开项目目录
2. 安装 `Live Server`
3. 右键 [index.html](/mnt/c/Users/siest/Desktop/qa-review-site/index.html)
4. 选择 `Open with Live Server`

方式二：使用 Python 静态服务器

```bash
python -m http.server 8000
```

然后访问：

```text
http://localhost:8000
```

### 维护脚本

项目内置了这几个脚本：

```bash
npm run sync:content
npm run validate
npm run generate
npm run build:data
npm run refresh:data
```

含义如下：

- `npm run sync:content`：扫描 `content/`，把新增目录和文章同步到分类配置
- `npm run validate`：校验 Markdown 标题、目录接入和文件缺失
- `npm run generate`：生成前端用的 [data.js](/mnt/c/Users/siest/Desktop/qa-review-site/data.js)
- `npm run build:data`：校验后生成
- `npm run refresh:data`：同步配置后，再校验并生成

日常维护推荐直接执行：

```bash
npm run refresh:data
```

## 如何使用

### 浏览知识库

启动静态服务器后，页面左侧显示知识树，右侧显示正文内容。

使用方式：

- 点击二级专题：打开专题概述页
- 点击三级主题：打开主题概述页
- 点击四级文章：打开具体知识点正文
- 使用顶部搜索框：按标题过滤导航树

### 新增内容

新增内容时，优先把内容放入现有知识树，不要在根目录散放文件。

推荐流程：

1. 在 [content/](/mnt/c/Users/siest/Desktop/qa-review-site/content) 下找到对应分类和专题
2. 如果是新增专题或主题，创建目录并补 `index.md`
3. 如果是新增知识点，直接新增对应 Markdown 文件
4. 给每个新文件写清晰的一级标题 `# 标题`
5. 执行：

```bash
npm run refresh:data
```

### 调整顺序

如果需要人工调整展示顺序，不直接改 [data.js](/mnt/c/Users/siest/Desktop/qa-review-site/data.js)，而是改对应的分类配置文件：

- [test-direction.js](/mnt/c/Users/siest/Desktop/qa-review-site/config/content/test-direction.js)
- [tech-base.js](/mnt/c/Users/siest/Desktop/qa-review-site/config/content/tech-base.js)
- [code-problems.js](/mnt/c/Users/siest/Desktop/qa-review-site/config/content/code-problems.js)
- [interviews.js](/mnt/c/Users/siest/Desktop/qa-review-site/config/content/interviews.js)

改完后重新执行：

```bash
npm run build:data
```

## 如何维护

### 维护原则

- 概述页讲范围、结构和重点，不写成长篇正文
- 知识页负责讲透单个知识点，不写成泛泛提纲
- 同一知识点尽量只保留一套正文
- 优先维护 `content/` 和分类配置，不手工编辑 [data.js](/mnt/c/Users/siest/Desktop/qa-review-site/data.js)

### Markdown 编写约定

- 每个 `index.md` 代表一个概述页
- 每篇正文文件只讲一个主要知识点
- 每个 Markdown 至少应包含一级标题 `# 标题`
- 如有需要，可使用 frontmatter：

```md
---
nav_title: 导航标题
order: 10
---
```

说明：

- `nav_title`：只影响导航标题
- `order`：用于同级显式排序，优先级高于默认顺序

### 推荐维护顺序

当你新增或调整内容时，建议按这个顺序操作：

1. 修改 [content/](/mnt/c/Users/siest/Desktop/qa-review-site/content) 中的 Markdown
2. 如有新目录或新文章，执行 `npm run sync:content`
3. 如需人工调顺序，修改对应的 `config/content/*.js`
4. 执行 `npm run validate`
5. 执行 `npm run generate`
6. 本地启动静态服务器检查页面效果

### 常见维护边界

- 不手工编辑 [data.js](/mnt/c/Users/siest/Desktop/qa-review-site/data.js)
- 不把未接入知识树的 Markdown 长期留在仓库里
- 不把不同专题的正文混写到同一篇文件里
- 不把正文页退化成简单提纲

### GitHub Pages 部署

这是纯静态项目，可以直接部署到 GitHub Pages 或任意静态托管服务，不需要额外构建服务。

如果部署到 GitHub Pages，推荐直接发布仓库根目录：

1. 打开仓库 `Settings`
2. 进入 `Pages`
3. `Source` 选择 `Deploy from a branch`
4. 分支选择 `main`（或你的发布分支）
5. 文件夹选择 `/ (root)`
6. 保存后等待 GitHub 生成站点

项目已经保留了 [.nojekyll](/mnt/c/Users/siest/Desktop/qa-review-site/.nojekyll)，可避免 GitHub Pages 把以下划线目录当作 Jekyll 特殊目录处理。

### GitHub Pages 访问说明

- 首页可通过仓库 Pages 地址直接访问，例如 `https://<用户名>.github.io/<仓库名>/`
- 站点内部阅读状态会同步到 URL hash，例如 `#article:welcome`
- 因为使用 hash 路由，切换文章、刷新页面、分享当前文章链接时都能继续正常打开对应内容
- 如果访问了无效路径，GitHub Pages 会返回 [404.html](/mnt/c/Users/siest/Desktop/qa-review-site/404.html) 并提供回首页入口

### 其他静态托管

部署到其他静态托管平台时，同样只需要确保仓库中文件完整即可。
