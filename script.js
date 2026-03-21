const navContainer = document.getElementById("navContainer");
const searchInput = document.getElementById("searchInput");
const docTitle = document.getElementById("docTitle");
const docCategory = document.getElementById("docCategory");
const docContent = document.getElementById("docContent");
const breadcrumb = document.getElementById("breadcrumb");
const subBreadcrumb = document.getElementById("subBreadcrumb");
const menuBtn = document.getElementById("menuBtn");
const sidebar = document.getElementById("sidebar");

let activeType = "article"; // "section" | "article"
let activeId = "welcome";
let expandedSections = new Set(["welcome-group"]);

function getSectionById(sectionId) {
  for (const group of reviewData) {
    for (const section of group.sections) {
      if (section.id === sectionId) {
        return {
          ...section,
          category: group.category
        };
      }
    }
  }
  return null;
}

function getChildById(childId) {
  for (const group of reviewData) {
    for (const section of group.sections) {
      for (const child of section.children || []) {
        if (child.id === childId) {
          return {
            ...child,
            category: group.category,
            sectionTitle: section.title,
            sectionId: section.id
          };
        }
      }
    }
  }
  return null;
}

function renderNav(data, keyword = "") {
  const lowerKeyword = keyword.trim().toLowerCase();

  navContainer.innerHTML = data
    .map(group => {
      const filteredSections = group.sections
        .map(section => {
          const sectionMatch = section.title.toLowerCase().includes(lowerKeyword);
          const filteredChildren = (section.children || []).filter(child =>
            child.title.toLowerCase().includes(lowerKeyword)
          );

          if (lowerKeyword === "") {
            return {
              ...section,
              filteredChildren: section.children || []
            };
          }

          if (sectionMatch || filteredChildren.length > 0) {
            return {
              ...section,
              filteredChildren: sectionMatch ? (section.children || []) : filteredChildren
            };
          }

          return null;
        })
        .filter(Boolean);

      if (filteredSections.length === 0) {
        return "";
      }

      return `
        <div class="nav-group">
          <div class="nav-group-title">${group.category}</div>
          <div class="nav-list">
            ${filteredSections
              .map(section => {
                const isExpanded = expandedSections.has(section.id);
                const isSectionActive = activeType === "section" && activeId === section.id;
                const hasChildren = (section.children || []).length > 0;

                return `
                  <div class="tree-section">
                    <button
                      class="nav-item nav-section-btn ${isSectionActive ? "active" : ""}"
                      data-section-id="${section.id}"
                    >
                      <span>${section.title}</span>
                      <span class="nav-arrow">${isExpanded ? "▾" : "▸"}</span>
                    </button>

                    <div
                      class="tree-children"
                      style="display: ${isExpanded ? "block" : "none"};"
                    >
                      ${
                        hasChildren
                          ? section.filteredChildren
                              .map(
                                child => `
                                  <button
                                    class="nav-item nav-child-btn ${
                                      activeType === "article" && activeId === child.id ? "active" : ""
                                    }"
                                    data-child-id="${child.id}"
                                  >
                                    ${child.title}
                                  </button>
                                `
                              )
                              .join("")
                          : `
                              <div class="nav-empty">暂无条目</div>
                            `
                      }
                    </div>
                  </div>
                `;
              })
              .join("")}
          </div>
        </div>
      `;
    })
    .join("");

  bindNavEvents();
}

function bindNavEvents() {
  const sectionButtons = document.querySelectorAll(".nav-section-btn");
  const childButtons = document.querySelectorAll(".nav-child-btn");

  sectionButtons.forEach(button => {
    button.addEventListener("click", async () => {
      const sectionId = button.dataset.sectionId;
      const section = getSectionById(sectionId);

      if (!section) return;

      if (expandedSections.has(sectionId)) {
        expandedSections.delete(sectionId);
      } else {
        expandedSections.add(sectionId);
      }

      activeType = "section";
      activeId = sectionId;

      renderNav(reviewData, searchInput.value);
      await loadDocument({
        title: section.title,
        category: section.category,
        file: section.file,
        subPath: `${section.category} / ${section.title}`
      });

      if (window.innerWidth <= 980) {
        sidebar.classList.remove("open");
      }
    });
  });

  childButtons.forEach(button => {
    button.addEventListener("click", async () => {
      const childId = button.dataset.childId;
      const child = getChildById(childId);

      if (!child) return;

      activeType = "article";
      activeId = childId;

      renderNav(reviewData, searchInput.value);
      await loadDocument({
        title: child.title,
        category: child.category,
        file: child.file,
        subPath: `${child.category} / ${child.sectionTitle} / ${child.title}`
      });

      if (window.innerWidth <= 980) {
        sidebar.classList.remove("open");
      }
    });
  });
}

async function loadDocument(doc) {
  docTitle.textContent = doc.title;
  docCategory.textContent = doc.category;
  breadcrumb.textContent = doc.title;
  subBreadcrumb.textContent = `${doc.subPath} / ${doc.file}`;
  docContent.innerHTML = `<div class="loading-state">正在加载内容...</div>`;

  try {
    const response = await fetch(doc.file);

    if (!response.ok) {
      throw new Error(`加载失败：${response.status}`);
    }

    const markdown = await response.text();
    const html = marked.parse(markdown, {
      breaks: true,
      gfm: true
    });

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
  renderNav(reviewData);

  const defaultChild = getChildById(activeId);

  if (defaultChild) {
    loadDocument({
      title: defaultChild.title,
      category: defaultChild.category,
      file: defaultChild.file,
      subPath: `${defaultChild.category} / ${defaultChild.sectionTitle} / ${defaultChild.title}`
    });
  } else {
    const defaultSection = getSectionById("welcome-group");
    if (defaultSection) {
      activeType = "section";
      activeId = defaultSection.id;
      loadDocument({
        title: defaultSection.title,
        category: defaultSection.category,
        file: defaultSection.file,
        subPath: `${defaultSection.category} / ${defaultSection.title}`
      });
    }
  }
}

searchInput.addEventListener("input", () => {
  const keyword = searchInput.value.trim().toLowerCase();

  if (keyword) {
    for (const group of reviewData) {
      for (const section of group.sections) {
        const sectionMatch = section.title.toLowerCase().includes(keyword);
        const childMatch = (section.children || []).some(child =>
          child.title.toLowerCase().includes(keyword)
        );

        if (sectionMatch || childMatch) {
          expandedSections.add(section.id);
        }
      }
    }
  }

  renderNav(reviewData, searchInput.value);
});

menuBtn.addEventListener("click", () => {
  sidebar.classList.toggle("open");
});

document.addEventListener("click", (e) => {
  if (
    window.innerWidth <= 980 &&
    !sidebar.contains(e.target) &&
    !menuBtn.contains(e.target)
  ) {
    sidebar.classList.remove("open");
  }
});

init();