// data-loader.js - MoonWane Ink 数据加载器
// 负责加载JSON数据并生成智能链接

// 全局变量，存储加载的数据
window.moonwaneData = {
  chapters: null,
  evidence: null,
  pdfs: null,
  loading: false
};

/**
 * 智能链接生成函数
 * 根据pdfs.json中的配置生成正确的PDF/外部链接
 * @param {string} fileId - 文件ID（如 "pdf_001", "evidence_001"）
 * @returns {string|null} - 返回链接或null（如果未发布）
 */
window.getPdfUrl = function(fileId) {
  if (!window.moonwaneData.pdfs || !window.moonwaneData.pdfs.files) {
    console.warn('PDF数据尚未加载');
    return null;
  }
  
  const fileInfo = window.moonwaneData.pdfs.files.find(file => file.file_id === fileId);
  
  if (!fileInfo) {
    console.warn(`未找到文件ID: ${fileId}`);
    return null;
  }
  
  // 根据状态返回链接
  switch(fileInfo.status) {
    case 'external':
      // 优先使用外部阅读链接
      return fileInfo.external_link || null;
      
    case 'drive':
      // 使用Google Drive链接
      if (fileInfo.drive_file_id) {
        return `https://drive.google.com/file/d/${fileInfo.drive_file_id}/preview`;
      }
      return null;
      
    case 'github':
      // 使用GitHub链接
      if (fileInfo.github_file_path) {
        return `https://raw.githubusercontent.com/a119j/moonwane/main/${fileInfo.github_file_path}`;
      }
      return null;
      
    case 'unpublished':
    default:
      // 未发布，返回null
      return null;
  }
};

/**
 * 检查链接状态并生成HTML
 * @param {string} fileId - 文件ID
 * @param {string} chapterName - 章节名称（用于提示）
 * @returns {string} - 生成的HTML
 */
window.generateLinkHtml = function(fileId, chapterName = '') {
  const pdfUrl = window.getPdfUrl(fileId);
  
  if (pdfUrl) {
    // 有链接：显示PDF图标和外部链接图标
    return `
      <div class="chapter-actions">
        <a href="${pdfUrl}" class="pdf-link" target="_blank" rel="noopener noreferrer">
          <i class="fas fa-file-pdf"></i> PDF
        </a>
        <a href="${pdfUrl}" class="external-link" target="_blank" rel="noopener noreferrer">
          <i class="fas fa-external-link-alt"></i>
        </a>
      </div>
    `;
  } else {
    // 无链接：显示"敬请期待"
    const chapterText = chapterName ? `第${chapterName}章` : '本章';
    return `
      <div class="chapter-actions">
        <span style="color:#888;font-size:0.9rem;font-style:italic;">
          <i class="fas fa-clock"></i> ${chapterText}正在准备中，敬请期待...
        </span>
      </div>
    `;
  }
};

/**
 * 动态生成章节目录表格
 */
window.renderChapterTable = function() {
  if (!window.moonwaneData.chapters || !window.moonwaneData.chapters.acts) {
    console.error('章节数据未加载');
    return;
  }
  
  const acts = window.moonwaneData.chapters.acts;
  let html = '';
  
  // 构建表格行
  acts.forEach((act, actIndex) => {
    if (actIndex % 3 === 0) {
      // 每3幕一行（您的设计是3列）
      const rowActs = acts.slice(actIndex, actIndex + 3);
      
      if (actIndex === 0) {
        // 表头
        html += `
          <thead>
            <tr>
              ${rowActs.map(act => `<th>${act.actTitle.split('：')[0]}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            <tr>
        `;
      }
      
      // 表格内容
      html += `
        ${rowActs.map(act => `
          <td>
            <span class="act-title">${act.actTitle}</span>
            <span class="act-title-second-line">${act.actSubtitle}</span>
            <ul>
              ${act.chapters.map(chapter => `
                <li>
                  <span class="chapter-title">${chapter.title}</span>
                  <span class="chapter-subtitle">${chapter.subtitle}</span>
                  ${window.generateLinkHtml(chapter.pdfId, chapter.chapterNumber)}
                </li>
              `).join('')}
            </ul>
          </td>
        `).join('')}
      `;
      
      if (actIndex === acts.length - rowActs.length) {
        // 最后一行
        html += `
            </tr>
          </tbody>
        `;
      }
    }
  });
  
  // 更新页面
  const tableElement = document.querySelector('.chapter-table');
  if (tableElement) {
    tableElement.innerHTML = html;
    
    // 重新绑定点击事件
    bindChapterEvents();
  }
};

/**
 * 动态生成证据库内容
 */
window.renderEvidenceTable = function() {
  if (!window.moonwaneData.evidence || !window.moonwaneData.evidence.categories) {
    console.error('证据数据未加载');
    return;
  }
  
  const categories = window.moonwaneData.evidence.categories;
  let html = '';
  
  categories.forEach(category => {
    html += `
      <div class="evidence-category" style="margin-bottom: 40px;">
        <h3 style="color: ${category.color || '#7bc8f8'}; font-size: 1.3rem; margin-bottom: 15px;">
          ${category.categoryName}
        </h3>
        <div style="background: rgba(30, 35, 60, 0.3); padding: 15px; border-radius: 8px;">
          ${category.items.map(item => `
            <div class="evidence-item" style="margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid rgba(255,255,255,0.1);">
              <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <div style="flex: 1;">
                  <div style="color: #f0f0f0; font-weight: 500; margin-bottom: 8px;">
                    ${item.id}. ${item.content}
                  </div>
                  <ul style="color: #b8b4b0; font-size: 0.9rem; margin-left: 20px;">
                    ${item.technicalPoints.map(point => `<li>${point}</li>`).join('')}
                  </ul>
                </div>
                <div style="margin-left: 15px;">
                  ${window.generateLinkHtml(item.pdfId, `证据${item.id}`)}
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  });
  
  // 更新页面
  const evidenceContainer = document.getElementById('evidence-container');
  if (evidenceContainer) {
    evidenceContainer.innerHTML = html;
  }
};

/**
 * 绑定章节链接点击事件
 */
function bindChapterEvents() {
  // PDF链接点击事件
  document.querySelectorAll('.pdf-link').forEach(link => {
    link.addEventListener('click', function(e) {
      // 阻止默认行为（已在href中处理）
      // 可以在这里添加点击统计等功能
      console.log('PDF链接被点击:', this.href);
    });
  });
  
  // 外部链接点击事件
  document.querySelectorAll('.external-link').forEach(link => {
    link.addEventListener('click', function(e) {
      console.log('外部链接被点击:', this.href);
    });
  });
}

/**
 * 加载JSON数据
 * @param {string} url - JSON文件URL
 * @returns {Promise} - 返回Promise
 */
function loadJsonData(url) {
  return fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(`加载失败: ${response.status}`);
      }
      return response.json();
    })
    .catch(error => {
      console.error(`加载 ${url} 失败:`, error);
      return null;
    });
}

/**
 * 初始化加载所有数据
 */
window.loadMoonwaneData = function() {
  if (window.moonwaneData.loading) return;
  
  window.moonwaneData.loading = true;
  
  console.log('开始加载MoonWane数据...');
  
  // 同时加载所有JSON文件
  Promise.all([
    loadJsonData('textdata/chapters.json'),
    loadJsonData('textdata/evidence.json'),
    loadJsonData('textdata/pdfs.json')
  ])
  .then(([chapters, evidence, pdfs]) => {
    window.moonwaneData.chapters = chapters;
    window.moonwaneData.evidence = evidence;
    window.moonwaneData.pdfs = pdfs;
    window.moonwaneData.loading = false;
    
    console.log('MoonWane数据加载完成', window.moonwaneData);
    
    // 根据当前页面渲染内容
    if (document.querySelector('.chapter-table')) {
      renderChapterTable();
    }
    
    if (document.getElementById('evidence-container')) {
      renderEvidenceTable();
    }
    
    // 触发自定义事件，通知其他组件数据已加载
    window.dispatchEvent(new CustomEvent('moonwane-data-loaded', {
      detail: window.moonwaneData
    }));
  })
  .catch(error => {
    console.error('加载数据时出错:', error);
    window.moonwaneData.loading = false;
  });
};

/**
 * 获取章节信息
 * @param {string} chapterId - 章节ID（如 "pdf_001"）
 * @returns {object|null} - 章节信息
 */
window.getChapterInfo = function(chapterId) {
  if (!window.moonwaneData.chapters) return null;
  
  for (const act of window.moonwaneData.chapters.acts) {
    const chapter = act.chapters.find(ch => ch.pdfId === chapterId);
    if (chapter) {
      return {
        ...chapter,
        actTitle: act.actTitle,
        actSubtitle: act.actSubtitle
      };
    }
  }
  return null;
};

/**
 * 获取证据信息
 * @param {string} evidenceId - 证据ID（如 "evidence_001"）
 * @returns {object|null} - 证据信息
 */
window.getEvidenceInfo = function(evidenceId) {
  if (!window.moonwaneData.evidence) return null;
  
  for (const category of window.moonwaneData.evidence.categories) {
    const evidence = category.items.find(item => item.pdfId === evidenceId);
    if (evidence) {
      return {
        ...evidence,
        categoryName: category.categoryName,
        categoryColor: category.color
      };
    }
  }
  return null;
};

// 页面加载完成后自动初始化
document.addEventListener('DOMContentLoaded', function() {
  // 延迟加载，确保其他脚本已执行
  setTimeout(() => {
    window.loadMoonwaneData();
  }, 100);
});
