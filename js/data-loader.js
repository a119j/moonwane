// js/data-loader.js
// 加载章节列表
fetch('/chapters.json')
  .then(response => {
    if (!response.ok) throw new Error('章节JSON加载失败');
    return response.json();
  })
  .then(data => {
    const container = document.getElementById('chapters-container');
    if (!container) return;

    if (!data.chapters) {
      console.error('chapters.json 数据结构错误：缺少 chapters 字段');
      container.innerHTML = '<p>数据格式错误</p>';
      return;
    }

    container.innerHTML = ''; // 清空加载提示

    if (data.chapters.length === 0) {
      container.innerHTML = '<p>暂无章节内容。</p>';
      return;
    }

    data.chapters.forEach(ch => {
      const item = document.createElement('div');
      item.style.marginBottom = '1.2em';
      item.style.padding = '0.8em';
      item.style.borderBottom = '1px solid #333';

      let linksHtml = '';
      if (ch.pdf_url && ch.pdf_url.trim() !== '') {
        linksHtml += `<a href="${ch.pdf_url}" target="_blank" style="margin-right:1em; color:#7bc8f8;">📄 PDF</a>`;
      }
      if (ch.preview_url && ch.preview_url.trim() !== '') {
        linksHtml += `<a href="${ch.preview_url}" target="_blank" style="margin-right:1em; color:#7bc8f8;">预览</a>`;
      }
      if (ch.external_read_url && ch.external_read_url.trim() !== '') {
        linksHtml += `<a href="${ch.external_read_url}" target="_blank" style="color:#7bc8f8;">🔗 在线阅读</a>`;
      }

      item.innerHTML = `
        <strong style="font-size:1.1em;">${ch.title}</strong><br>
        ${linksHtml ? '<div style="margin-top:0.5em;">' + linksHtml + '</div>' : '<small style="color:#888;">(链接准备中)</small>'}
      `;

      container.appendChild(item);
    });
  })
  .catch(err => {
    console.error('章节加载错误:', err);
    const container = document.getElementById('chapters-container');
    if (container) container.innerHTML = '<p>章节加载失败，请稍后重试。</p>';
  });

// 加载证据列表 (注意路径是 /data/evidence.json)
fetch('/data/evidence.json')
  .then(response => {
    if (!response.ok) throw new Error('证据JSON加载失败');
    return response.json();
  })
  .then(data => {
    const container = document.getElementById('evidence-container');
    if (!container) return;

    if (!data.categories) {
      console.error('evidence.json 数据结构错误：缺少 categories 字段');
      container.innerHTML = '<p>数据格式错误</p>';
      return;
    }

    container.innerHTML = ''; // 清空加载提示

    data.categories.forEach(category => {
      if (!category.items || category.items.length === 0) return;

      const catDiv = document.createElement('div');
      catDiv.style.marginBottom = '2.5em';
      catDiv.innerHTML = `<h4 style="color:${category.color || '#7bc8f8'}; border-left:4px solid ${category.color || '#7bc8f8'}; padding-left:10px;">${category.categoryName || category.name}</h4>`;
      container.appendChild(catDiv);

      category.items.forEach(item => {
        const evDiv = document.createElement('div');
        evDiv.style.margin = '1em 0 1em 1em';
        evDiv.style.padding = '0.8em';
        evDiv.style.borderLeft = '3px solid ' + (category.color || '#007bff');
        evDiv.style.background = 'rgba(30, 30, 30, 0.3)';

        let linksHtml = '';
        // 注意：你的 evidence.json 中没有 pdf_url 等字段，需要后续添加
        // 这里先预留结构，等你在 evidence.json 中添加 pdf_url 后即可显示
        if (item.pdf_url && item.pdf_url.trim() !== '') {
          linksHtml += `<a href="${item.pdf_url}" target="_blank" style="margin-right:1em; color:#FFD700;">📄 PDF</a>`;
        }

        evDiv.innerHTML = `
          <strong>${item.content}</strong><br>
          <small style="color:#aaa;">技术要点：${item.technicalPoints ? item.technicalPoints.join('； ') : '暂无'}</small><br>
          ${linksHtml ? '<div style="margin-top:0.6em;">' + linksHtml + '</div>' : '<small style="color:#888;">(证据文件链接准备中)</small>'}
        `;

        container.appendChild(evDiv);
      });
    });
  })
  .catch(err => {
    console.error('证据加载错误:', err);
    const container = document.getElementById('evidence-container');
    if (container) container.innerHTML = '<p>证据加载失败，请稍后重试。</p>';
  });    .catch(err => console.error('章节加载错误:', err));

  // 加载证据列表
  fetch('/data/evidence.json')
    .then(response => {
      if (!response.ok) throw new Error('证据加载失败: ' + response.status);
      return response.json();
    })
    .then(data => {
      const container = document.getElementById('evidence-container');
      if (!container) {
        console.warn('未找到 evidence-container');
        return;
      }

      data.categories.forEach(cat => {
        if (cat.items.length === 0) return;

        const catHeader = document.createElement('h4');
        catHeader.textContent = cat.name;
        container.appendChild(catHeader);

        cat.items.forEach(item => {
          const div = document.createElement('div');
          div.style.margin = '1em 0 1em 2em';
          div.style.padding = '0.8em';
          div.style.borderLeft = '4px solid #444';  // 优化 2：更克制、严肃的深灰

          let links = '';
          if (item.pdf_url) links += `<a href="${item.pdf_url}" target="_blank" style="margin-right:1em;">📄 PDF</a>`;
          if (item.preview_url) links += `<a href="${item.preview_url}" target="_blank" style="margin-right:1em;">预览</a>`;
          if (item.external_read_url) links += `<a href="${item.external_read_url}" target="_blank">🔗 详细阅读</a>`;

          div.innerHTML = `
            <strong>${item.content}</strong><br>
            <small>技术要点：${item.technicalPoints?.join('； ') || '—'}</small><br>  <!-- 优化 1：防止空数组/undefined 报错 -->
            ${links || '<small>暂无可用链接</small>'}
          `;
          container.appendChild(div);
        });
      });
    })
    .catch(err => console.error('证据加载错误:', err));
}); */
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
