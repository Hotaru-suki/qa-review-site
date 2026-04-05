const navContainer = document.getElementById("navContainer");
const searchInput = document.getElementById("searchInput");
const docTitle = document.getElementById("docTitle");
const docCategory = document.getElementById("docCategory");
const docContent = document.getElementById("docContent");
const breadcrumb = document.getElementById("breadcrumb");
const subBreadcrumb = document.getElementById("subBreadcrumb");
const menuBtn = document.getElementById("menuBtn");
const sidebar = document.getElementById("sidebar");

const reviewData = window.reviewData || [];
const contentBaseUrl = new URL("./", window.location.href);
let suppressHashChange = false;

function getDefaultState(data) {
  const firstSection = data[0]?.sections?.[0] || null;
  const firstTopic = firstSection?.topics?.[0] || null;
  const firstArticle = firstTopic?.articles?.[0] || null;

  return {
    activeLevel: firstArticle ? "article" : firstTopic ? "topic" : "section",
    activeId: firstArticle?.id || firstTopic?.id || firstSection?.id || "",
    expandedSections: new Set(firstSection ? [firstSection.id] : []),
    expandedTopics: new Set(firstTopic ? [firstTopic.id] : [])
  };
}

const state = getDefaultState(reviewData);

const allowedHtmlTags = new Set([
  "a",
  "article",
  "blockquote",
  "br",
  "code",
  "del",
  "div",
  "em",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "hr",
  "img",
  "li",
  "ol",
  "p",
  "pre",
  "section",
  "span",
  "strong",
  "table",
  "tbody",
  "td",
  "th",
  "thead",
  "tr",
  "ul"
]);

const allowedAttributes = new Set(["href", "src", "alt", "title"]);
const dangerousProtocols = ["javascript:", "data:"];

function buildIndexes(data) {
  const sectionMap = new Map();
  const topicMap = new Map();
  const articleMap = new Map();

  data.forEach(group => {
    group.sections.forEach(section => {
      sectionMap.set(section.id, {
        ...section,
        category: group.category
      });

      (section.topics || []).forEach(topic => {
        topicMap.set(topic.id, {
          ...topic,
          category: group.category,
          sectionId: section.id,
          sectionTitle: section.title
        });

        (topic.articles || []).forEach(article => {
          articleMap.set(article.id, {
            ...article,
            category: group.category,
            sectionId: section.id,
            sectionTitle: section.title,
            topicId: topic.id,
            topicTitle: topic.title
          });
        });
      });
    });
  });

  return { sectionMap, topicMap, articleMap };
}

const indexes = buildIndexes(reviewData);

function getSectionById(id) {
  return indexes.sectionMap.get(id) || null;
}

function getTopicById(id) {
  return indexes.topicMap.get(id) || null;
}

function getArticleById(id) {
  return indexes.articleMap.get(id) || null;
}

function getRouteHash(level, id) {
  return `#${level}:${encodeURIComponent(id)}`;
}

function getStateFromHash() {
  const hash = window.location.hash.replace(/^#/, "").trim();

  if (!hash) {
    return null;
  }

  const separatorIndex = hash.indexOf(":");
  if (separatorIndex <= 0) {
    return null;
  }

  const level = hash.slice(0, separatorIndex);
  const id = decodeURIComponent(hash.slice(separatorIndex + 1));

  if (!["section", "topic", "article"].includes(level) || !id) {
    return null;
  }

  const item =
    level === "section"
      ? getSectionById(id)
      : level === "topic"
        ? getTopicById(id)
        : getArticleById(id);

  if (!item) {
    return null;
  }

  return { level, id, item };
}

function syncHash(level, id) {
  const nextHash = getRouteHash(level, id);

  if (window.location.hash === nextHash) {
    return;
  }

  suppressHashChange = true;
  window.location.hash = nextHash;
}

function buildDocPayload(level, item) {
  if (level === "section") {
    return {
      title: item.title,
      category: item.category,
      file: item.file,
      pathLabel: `${item.category} / ${item.title}`
    };
  }

  if (level === "topic") {
    return {
      title: item.title,
      category: item.category,
      file: item.file,
      pathLabel: `${item.category} / ${item.sectionTitle} / ${item.title}`
    };
  }

  return {
    title: item.title,
    category: item.category,
    file: item.file,
    pathLabel: `${item.category} / ${item.sectionTitle} / ${item.topicTitle} / ${item.title}`
  };
}

function setActive(level, id) {
  state.activeLevel = level;
  state.activeId = id;

  if (level === "topic") {
    const topic = getTopicById(id);
    if (topic) {
      state.expandedSections.add(topic.sectionId);
      state.expandedTopics.add(topic.id);
    }
  }

  if (level === "article") {
    const article = getArticleById(id);
    if (article) {
      state.expandedSections.add(article.sectionId);
      state.expandedTopics.add(article.topicId);
    }
  }
}

function openItem(level, id) {
  const lookup =
    level === "section"
      ? getSectionById(id)
      : level === "topic"
        ? getTopicById(id)
        : getArticleById(id);

  if (!lookup) return;

  setActive(level, id);
  renderNav(reviewData, searchInput.value);
  loadDocument(buildDocPayload(level, lookup));
  syncHash(level, id);

  if (window.innerWidth <= 980) {
    sidebar.classList.remove("open");
  }
}

function toggleExpand(kind, id) {
  const bucket =
    kind === "section" ? state.expandedSections : state.expandedTopics;

  if (bucket.has(id)) {
    bucket.delete(id);
  } else {
    bucket.add(id);
  }

  renderNav(reviewData, searchInput.value);
}

function isMatch(text, keyword) {
  return text.toLowerCase().includes(keyword);
}

function getVisibleTree(data, keyword) {
  const normalized = keyword.trim().toLowerCase();

  return data
    .map(group => {
      const sections = group.sections
        .map(section => {
          const sectionMatch = isMatch(section.title, normalized);
          const topics = (section.topics || [])
            .map(topic => {
              const topicMatch = isMatch(topic.title, normalized);
              const articles = (topic.articles || []).filter(article =>
                isMatch(article.title, normalized)
              );

              if (!normalized || topicMatch || articles.length > 0 || sectionMatch) {
                return {
                  ...topic,
                  visibleArticles:
                    !normalized || sectionMatch || topicMatch
                      ? topic.articles || []
                      : articles
                };
              }

              return null;
            })
            .filter(Boolean);

          if (!normalized || sectionMatch || topics.length > 0) {
            return {
              ...section,
              visibleTopics: !normalized || sectionMatch ? section.topics || [] : topics
            };
          }

          return null;
        })
        .filter(Boolean);

      if (sections.length === 0) {
        return null;
      }

      return {
        ...group,
        visibleSections: sections
      };
    })
    .filter(Boolean);
}

function autoExpandForKeyword(keyword) {
  if (!keyword) return;

  reviewData.forEach(group => {
    group.sections.forEach(section => {
      const sectionMatch = isMatch(section.title, keyword);
      (section.topics || []).forEach(topic => {
        const topicMatch = isMatch(topic.title, keyword);
        const articleMatch = (topic.articles || []).some(article =>
          isMatch(article.title, keyword)
        );

        if (sectionMatch || topicMatch || articleMatch) {
          state.expandedSections.add(section.id);
        }

        if (topicMatch || articleMatch || sectionMatch) {
          state.expandedTopics.add(topic.id);
        }
      });
    });
  });
}

function renderNav(data, keyword = "") {
  const normalized = keyword.trim().toLowerCase();

  if (normalized) {
    autoExpandForKeyword(normalized);
  }

  const visibleTree = getVisibleTree(data, normalized);

  navContainer.innerHTML = visibleTree
    .map(group => {
      return `
        <section class="nav-group">
          <div class="nav-group-title">${group.category}</div>
          <div class="nav-list">
            ${group.visibleSections
              .map(section => {
                const topics = section.visibleTopics || [];
                const sectionExpanded = state.expandedSections.has(section.id);
                const sectionActive =
                  state.activeLevel === "section" && state.activeId === section.id;

                return `
                  <div class="tree-section">
                    <div class="nav-row">
                      <button
                        class="nav-item nav-open-btn nav-section-open ${sectionActive ? "active" : ""}"
                        data-level="section"
                        data-id="${section.id}"
                      >
                        <span>${section.title}</span>
                      </button>
                      ${
                        topics.length > 0
                          ? `
                            <button
                              class="nav-toggle-btn"
                              aria-label="${sectionExpanded ? "收起" : "展开"} ${section.title}"
                              data-toggle-kind="section"
                              data-id="${section.id}"
                            >
                              ${sectionExpanded ? "▾" : "▸"}
                            </button>
                          `
                          : ""
                      }
                    </div>

                    ${
                      topics.length > 0
                        ? `
                          <div class="tree-children ${sectionExpanded ? "expanded" : ""}">
                            ${topics
                              .map(topic => {
                                const topicExpanded = state.expandedTopics.has(topic.id);
                                const topicActive =
                                  state.activeLevel === "topic" && state.activeId === topic.id;
                                const articles = topic.visibleArticles || [];

                                return `
                                  <div class="tree-topic">
                                    <div class="nav-row nav-row-topic">
                                      <button
                                        class="nav-item nav-open-btn nav-topic-open ${topicActive ? "active" : ""}"
                                        data-level="topic"
                                        data-id="${topic.id}"
                                      >
                                        <span>${topic.title}</span>
                                      </button>
                                      ${
                                        articles.length > 0
                                          ? `
                                            <button
                                              class="nav-toggle-btn nav-toggle-btn-topic"
                                              aria-label="${topicExpanded ? "收起" : "展开"} ${topic.title}"
                                              data-toggle-kind="topic"
                                              data-id="${topic.id}"
                                            >
                                              ${topicExpanded ? "▾" : "▸"}
                                            </button>
                                          `
                                          : ""
                                      }
                                    </div>

                                    ${
                                      articles.length > 0
                                        ? `
                                          <div class="tree-articles ${topicExpanded ? "expanded" : ""}">
                                            ${articles
                                              .map(article => {
                                                const articleActive =
                                                  state.activeLevel === "article" &&
                                                  state.activeId === article.id;

                                                return `
                                                  <button
                                                    class="nav-item nav-article-btn ${articleActive ? "active" : ""}"
                                                    data-level="article"
                                                    data-id="${article.id}"
                                                  >
                                                    ${article.title}
                                                  </button>
                                                `;
                                              })
                                              .join("")}
                                          </div>
                                        `
                                        : ""
                                    }
                                  </div>
                                `;
                              })
                              .join("")}
                          </div>
                        `
                        : ""
                    }
                  </div>
                `;
              })
              .join("")}
          </div>
        </section>
      `;
    })
    .join("");

  bindNavEvents();
}

function bindNavEvents() {
  document.querySelectorAll("[data-level]").forEach(button => {
    button.addEventListener("click", () => {
      openItem(button.dataset.level, button.dataset.id);
    });
  });

  document.querySelectorAll("[data-toggle-kind]").forEach(button => {
    button.addEventListener("click", () => {
      toggleExpand(button.dataset.toggleKind, button.dataset.id);
    });
  });
}

function sanitizeHtml(html) {
  const template = document.createElement("template");
  template.innerHTML = html;

  const walk = node => {
    if (node.nodeType === Node.TEXT_NODE) {
      return;
    }

    if (node.nodeType !== Node.ELEMENT_NODE) {
      node.remove();
      return;
    }

    const tagName = node.tagName.toLowerCase();
    if (!allowedHtmlTags.has(tagName)) {
      const parent = node.parentNode;
      while (node.firstChild) {
        parent.insertBefore(node.firstChild, node);
      }
      node.remove();
      return;
    }

    [...node.attributes].forEach(attr => {
      const attrName = attr.name.toLowerCase();
      const attrValue = attr.value.trim().toLowerCase();

      if (attrName.startsWith("on")) {
        node.removeAttribute(attr.name);
        return;
      }

      if (!allowedAttributes.has(attrName)) {
        node.removeAttribute(attr.name);
        return;
      }

      if (
        (attrName === "href" || attrName === "src") &&
        dangerousProtocols.some(protocol => attrValue.startsWith(protocol))
      ) {
        node.removeAttribute(attr.name);
      }
    });

    [...node.childNodes].forEach(walk);
  };

  [...template.content.childNodes].forEach(walk);
  return template.innerHTML;
}

function renderMarkdown(markdown) {
  if (!window.marked) {
    return `<pre>${markdown.replace(/[&<>]/g, char => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;"
    }[char]))}</pre>`;
  }

  const html = marked.parse(markdown, {
    breaks: true,
    gfm: true,
    headerIds: false,
    mangle: false
  });

  return sanitizeHtml(html);
}

async function loadDocument(doc) {
  docTitle.textContent = doc.title;
  docCategory.textContent = doc.category;
  breadcrumb.textContent = doc.title;
  subBreadcrumb.textContent = `${doc.pathLabel} / ${doc.file}`;
  docContent.innerHTML = `<div class="loading-state">正在加载内容...</div>`;

  try {
    const response = await fetch(new URL(doc.file, contentBaseUrl));

    if (!response.ok) {
      throw new Error(`加载失败：${response.status}`);
    }

    const markdown = await response.text();
    const html = renderMarkdown(markdown);
    docContent.innerHTML = html || `<div class="empty-state">该文档暂无内容。</div>`;
  } catch (error) {
    docContent.innerHTML = `
      <div class="error-state">
        文档加载失败。<br />
        请检查文件路径是否正确，或确认你正在通过本地静态服务器运行项目。
      </div>
    `;
    console.error(error);
  }
}

function init() {
  const routeState = getStateFromHash();

  if (routeState) {
    setActive(routeState.level, routeState.id);
  }

  renderNav(reviewData);
  const defaultArticle =
    state.activeLevel === "article" ? getArticleById(state.activeId) : null;
  const defaultTopic =
    state.activeLevel === "topic" ? getTopicById(state.activeId) : null;
  const defaultSection =
    state.activeLevel === "section" ? getSectionById(state.activeId) : null;

  if (defaultArticle) {
    loadDocument(buildDocPayload("article", defaultArticle));
    syncHash("article", defaultArticle.id);
    return;
  }

  if (defaultTopic) {
    loadDocument(buildDocPayload("topic", defaultTopic));
    syncHash("topic", defaultTopic.id);
    return;
  }

  if (defaultSection) {
    loadDocument(buildDocPayload("section", defaultSection));
    syncHash("section", defaultSection.id);
  }
}

searchInput.addEventListener("input", () => {
  renderNav(reviewData, searchInput.value);
});

menuBtn.addEventListener("click", () => {
  sidebar.classList.toggle("open");
});

document.addEventListener("click", event => {
  if (
    window.innerWidth <= 980 &&
    !sidebar.contains(event.target) &&
    !menuBtn.contains(event.target)
  ) {
    sidebar.classList.remove("open");
  }
});

window.addEventListener("hashchange", () => {
  if (suppressHashChange) {
    suppressHashChange = false;
    return;
  }

  const routeState = getStateFromHash();
  if (!routeState) {
    return;
  }

  setActive(routeState.level, routeState.id);
  renderNav(reviewData, searchInput.value);
  loadDocument(buildDocPayload(routeState.level, routeState.item));
});

init();
