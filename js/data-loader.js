document.addEventListener('DOMContentLoaded', function() {
    // 1. 加载章节目录（完全不变）
    fetch('data/chapters.json')
        .then(response => response.json())
        .then(data => {
            displayChapters(data.chapters);
        });

    // 2. 加载证据库（只改这里：适配新结构）
    fetch('data/evidence.json')
        .then(response => response.json())
        .then(data => {
            // 关键：兼容新旧格式
            const evidenceList = data.evidence || data; // 新结构用.evidence，旧结构直接使用
            
            displayEvidence(evidenceList);
            setupSearchFilter(evidenceList);
        });
});

// 3. 显示证据（只加id，显示HTML完全不变）
function displayEvidence(evidenceList) {
    const container = document.getElementById('evidence-container');
    if (!container) return;

    container.innerHTML = '';
    
    evidenceList.forEach(evidence => {
        const evidenceElement = document.createElement('div');
        evidenceElement.className = 'evidence-item';
        evidenceElement.dataset.id = evidence.id || ''; // 只加这一行
        
        // 生成标签HTML（原逻辑不变）
        let tagsHtml = '';
        if (evidence.tags && evidence.tags.length > 0) {
            tagsHtml = '<div class="evidence-tags">';
            evidence.tags.forEach(tag => {
                tagsHtml += `<span class="tag">${tag}</span>`;
            });
            tagsHtml += '</div>';
        }

        // 4. PDF链接：只留一个查看链接（唯一可见变化）
        let pdfLinkHtml = '';
        if (evidence.driveUrl) {
            const viewUrl = evidence.driveUrl.replace('/export?format=pdf', '/view');
            pdfLinkHtml = `
                <div class="pdf-link">
                    <a href="${viewUrl}" target="_blank" class="btn-view">
                        查看PDF
                    </a>
                </div>
            `;
        }

        // 5. 显示HTML：完全保持原样！
        evidenceElement.innerHTML = `
            <h4>${evidence.title}</h4>
            <div class="evidence-meta">
                <span class="evidence-type">${evidence.type || '文档'}</span>
                <span class="evidence-year">${evidence.year || ''}</span>
            </div>
            <p class="evidence-desc">${evidence.description || ''}</p>
            ${tagsHtml}
            ${pdfLinkHtml}
        `;
        
        container.appendChild(evidenceElement);
    });
}

// 6. 搜索筛选函数（完全保持原逻辑）
function setupSearchFilter(evidenceList) {
    const searchInput = document.getElementById('evidence-search');
    const typeFilter = document.getElementById('evidence-type-filter');
    
    if (!searchInput || !typeFilter) return;
    
    function filterEvidence() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedType = typeFilter.value;
        
        const filtered = evidenceList.filter(evidence => {
            // 搜索逻辑完全不变
            const matchesSearch = !searchTerm || 
                evidence.title.toLowerCase().includes(searchTerm) ||
                evidence.description.toLowerCase().includes(searchTerm) ||
                (evidence.tags && evidence.tags.some(tag => tag.toLowerCase().includes(searchTerm)));
            
            const matchesType = !selectedType || evidence.type === selectedType;
            
            return matchesSearch && matchesType;
        });
        
        displayEvidence(filtered);
    }
    
    searchInput.addEventListener('input', filterEvidence);
    typeFilter.addEventListener('change', filterEvidence);
}

// 7. 章节显示函数（完全不变）
function displayChapters(chapters) {
    const container = document.getElementById('chapters-container');
    if (!container) return;

    container.innerHTML = '';
    
    chapters.forEach(chapter => {
        const chapterElement = document.createElement('div');
        chapterElement.className = 'chapter-item';
        chapterElement.id = chapter.id;
        
        let linksHtml = '';
        if (chapter.links && chapter.links.length > 0) {
            linksHtml = '<div class="chapter-links">';
            chapter.links.forEach(link => {
                const platformIcon = getPlatformIcon(link.platform);
                const dateStr = link.date ? `<span class="link-date">${link.date}</span>` : '';
                
                linksHtml += `
                    <a href="${link.url}" target="_blank" class="link-item ${link.platform}">
                        ${platformIcon}
                        <span class="link-title">${link.title}</span>
                        ${dateStr}
                    </a>
                `;
            });
            linksHtml += '</div>';
        }

        chapterElement.innerHTML = `
            <h3>${chapter.title}</h3>
            <p>${chapter.description || ''}</p>
            ${linksHtml}
        `;
        
        container.appendChild(chapterElement);
    });
}

// 8. 辅助函数（完全不变）
function getPlatformIcon(platform) {
    const icons = {
        'Substack': '📰',
        'Notion': '📝',
        'Medium': '✍️',
        'PDF': '📄',
        'GitHub': '💻',
        'Google Drive': '☁️',
        'default': '🔗'
    };
    return icons[platform] || icons.default;
}        return;
    }

    if (data.chapters.length === 0) {
        container.innerHTML = '<p>暂无章节发布。</p>';
        return;
    }

    // 遍历并生成章节项
    data.chapters.forEach(chapter => {
        const chapterEl = document.createElement('div');
        chapterEl.className = 'chapter-item';
        chapterEl.style.cssText = `
            margin-bottom: 1.5rem;
            padding: 1rem;
            background: rgba(255, 255, 255, 0.03);
            border-radius: 8px;
            border-left: 3px solid #7bc8f8;
        `;

        // 构建链接HTML
        let linksHtml = '';
        const hasPdf = chapter.pdf_url && chapter.pdf_url.trim() !== '';
        const hasPreview = chapter.preview_url && chapter.preview_url.trim() !== '';
        const hasExternal = chapter.external_read_url && chapter.external_read_url.trim() !== '';

        if (hasPdf) {
            linksHtml += `<a href="${chapter.pdf_url}" target="_blank" rel="noopener" class="content-link" style="margin-right: 1rem;">📄 PDF文件</a>`;
        }
        if (hasPreview) {
            linksHtml += `<a href="${chapter.preview_url}" target="_blank" rel="noopener" class="content-link" style="margin-right: 1rem;">👁️ 在线预览</a>`;
        }
        if (hasExternal) {
            linksHtml += `<a href="${chapter.external_read_url}" target="_blank" rel="noopener" class="content-link">🔗 外部阅读</a>`;
        }

        chapterEl.innerHTML = `
            <div style="font-weight: bold; margin-bottom: 0.5rem; color: #f0f0f0;">${chapter.title}</div>
            <div>
                ${linksHtml ? linksHtml : '<span style="color: #888; font-size: 0.9em;">(链接准备中)</span>'}
            </div>
        `;
        container.appendChild(chapterEl);
    });
}

// 渲染证据库
function renderEvidence(container, data) {
    // 清空“正在加载”提示
    container.innerHTML = '';

    // 检查数据格式
    if (!data.categories || !Array.isArray(data.categories)) {
        container.innerHTML = '<p>证据数据格式有误。</p>';
        return;
    }

    // 遍历每个分类
    data.categories.forEach(category => {
        // 跳过没有证据项的分类
        if (!category.items || category.items.length === 0) return;

        // 创建分类标题
        const categoryTitle = document.createElement('h4');
        categoryTitle.textContent = category.categoryName || '未命名分类';
        categoryTitle.style.cssText = `
            color: ${category.color || '#7bc8f8'};
            margin-top: 2.5rem;
            margin-bottom: 1.2rem;
            padding-bottom: 0.5rem;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        `;
        container.appendChild(categoryTitle);

        // 遍历该分类下的每个证据项
        category.items.forEach(item => {
            const itemEl = document.createElement('div');
            itemEl.className = 'evidence-item';
            itemEl.style.cssText = `
                margin: 1rem 0 1rem 1rem;
                padding: 1rem;
                background: rgba(30, 30, 30, 0.4);
                border-radius: 6px;
                border-left: 4px solid ${category.color || '#007bff'};
            `;

            // 构建链接HTML (预留，未来可在evidence.json中添加pdf_url字段)
            let linksHtml = '';
            if (item.pdf_url && item.pdf_url.trim() !== '') {
                linksHtml += `<a href="${item.pdf_url}" target="_blank" rel="noopener" class="content-link" style="color: #FFD700; margin-right: 1rem;">📄 证据PDF</a>`;
            }

            // 将技术要点数组转换为带项目符号的HTML
            const pointsHtml = item.technicalPoints && Array.isArray(item.technicalPoints)
                ? `<ul style="color: #aaa; margin-top: 0.5rem; padding-left: 1.2rem; font-size: 0.95em;">
                     ${item.technicalPoints.map(point => `<li>${point}</li>`).join('')}
                   </ul>`
                : '<p style="color: #888; margin-top:0.5rem;">暂无技术要点说明。</p>';

            itemEl.innerHTML = `
                <div style="font-weight: bold; color: #e0e0e0;">${item.id || ''}. ${item.content}</div>
                ${pointsHtml}
                <div style="margin-top: 0.8rem;">
                    ${linksHtml ? linksHtml : '<span style="color: #888; font-size: 0.9em;">(证据文件链接准备中)</span>'}
                </div>
            `;
            container.appendChild(itemEl);
        });
    });
}      }
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
