// ===== 面了么 - 简历分析模块 =====
MianBa.resume = {
  analysisResult: null,

  render: function(container) {
    var self = this;
    container.innerHTML =
      '<div class="p-8">' +
      '  <h2 class="text-2xl font-bold text-slate-800 mb-6">简历分析</h2>' +
      // 文件上传区域
      '  <div class="card p-6 mb-4">' +
      '    <div id="file-drop-zone" class="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-blue-400 hover:bg-blue-50/30 transition cursor-pointer">' +
      '      <i data-lucide="upload" class="w-10 h-10 text-slate-400 mx-auto mb-3"></i>' +
      '      <p class="text-slate-600 font-medium mb-1">上传简历文件</p>' +
      '      <p class="text-slate-400 text-sm mb-3">拖拽文件到此处，或点击选择</p>' +
      '      <p class="text-slate-400 text-xs">支持 PDF、Word（.docx）格式，文件内容将自动提取到下方文本框</p>' +
      '      <input type="file" id="resume-file-input" accept=".pdf,.docx" class="hidden">' +
      '      <span id="file-status" class="inline-block mt-2 text-sm text-blue-500 hidden"></span>' +
      '    </div>' +
      '  </div>' +
      // 文本输入
      '  <div id="resume-input-card" class="card p-6 mb-6">' +
      '    <div class="card-body-inner">' +
      '      <label class="block text-sm font-medium text-slate-700 mb-2">简历文本 <span class="text-slate-400 font-normal">（上传文件自动填入，也可直接粘贴）</span></label>' +
      '      <textarea id="resume-input" class="w-full border border-slate-300 rounded-lg p-4 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" rows="8" placeholder="粘贴你的简历文本到这里...&#10;&#10;例如：&#10;教育背景：XX大学 计算机科学 本科&#10;实习经历：XX公司 前端开发实习生&#10;项目经历：...&#10;技能：Python, React, SQL..."></textarea>' +
      '      <div class="mt-4 flex gap-4">' +
      '        <input id="position-input" class="flex-1 border border-slate-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="目标岗位名称，如：前端开发工程师">' +
      '        <button id="btn-analyze" class="btn-primary">开始分析</button>' +
      '      </div>' +
      '    </div>' +
      '    <div class="card-collapsed-hint hidden text-center py-4 text-sm text-slate-400">' +
      '      简历已提交分析，<button id="btn-expand-input" class="text-blue-500 hover:text-blue-600 underline">点击展开</button>修改' +
      '    </div>' +
      '  </div>' +
      '  <div id="analysis-result"></div>' +
      '</div>';

    lucide.createIcons();
    document.getElementById('btn-analyze').onclick = function() { self.analyze(); };

    // 展开折叠的输入区域
    var expandBtn = document.getElementById('btn-expand-input');
    if (expandBtn) {
      expandBtn.onclick = function() {
        var card = document.getElementById('resume-input-card');
        card.querySelector('.card-body-inner').style.display = 'block';
        card.querySelector('.card-collapsed-hint').classList.add('hidden');
      };
    }

    // 文件上传逻辑
    self._setupFileUpload();
  },

  _setupFileUpload: function() {
    var self = this;
    var dropZone = document.getElementById('file-drop-zone');
    var fileInput = document.getElementById('resume-file-input');
    var status = document.getElementById('file-status');
    var textarea = document.getElementById('resume-input');

    if (!dropZone || !fileInput) return;

    // 点击选择文件
    dropZone.onclick = function() { fileInput.click(); };

    // 拖拽事件
    dropZone.ondragover = function(e) { e.preventDefault(); dropZone.classList.add('border-blue-400', 'bg-blue-50'); };
    dropZone.ondragleave = function(e) { dropZone.classList.remove('border-blue-400', 'bg-blue-50'); };
    dropZone.ondrop = function(e) {
      e.preventDefault();
      dropZone.classList.remove('border-blue-400', 'bg-blue-50');
      var file = e.dataTransfer.files[0];
      if (file) self._parseFile(file, status, textarea);
    };

    // 文件选择事件
    fileInput.onchange = function() {
      var file = fileInput.files[0];
      if (file) self._parseFile(file, status, textarea);
      fileInput.value = '';
    };
  },

  _parseFile: function(file, statusEl, textarea) {
    var self = this;
    var fileName = file.name.toLowerCase();

    statusEl.classList.remove('hidden');
    statusEl.textContent = '正在解析文件...';
    statusEl.className = 'inline-block mt-2 text-sm text-blue-500';

    if (fileName.endsWith('.pdf')) {
      this._parsePDF(file, statusEl, textarea);
    } else if (fileName.endsWith('.docx')) {
      this._parseWord(file, statusEl, textarea);
    } else {
      statusEl.textContent = '不支持的文件格式，请上传 PDF 或 .docx 文件';
      statusEl.className = 'inline-block mt-2 text-sm text-red-500';
    }
  },

  _parsePDF: function(file, statusEl, textarea) {
    var reader = new FileReader();
    reader.onload = function(e) {
      var typedArray = new Uint8Array(e.target.result);

      // 设置 worker
      if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      }

      pdfjsLib.getDocument({ data: typedArray }).promise.then(function(pdf) {
        var totalPages = pdf.numPages;
        var pages = [];
        for (var i = 1; i <= totalPages; i++) {
          pages.push(pdf.getPage(i));
        }
        return Promise.all(pages);
      }).then(function(pages) {
        var textPromises = pages.map(function(page) {
          return page.getTextContent().then(function(content) {
            return content.items.map(function(item) { return item.str; }).join(' ');
          });
        });
        return Promise.all(textPromises);
      }).then(function(texts) {
        var fullText = texts.join('\n\n');
        textarea.value = fullText;
        statusEl.textContent = '解析完成（' + texts.length + '页，共' + fullText.length + '字）';
        statusEl.className = 'inline-block mt-2 text-sm text-green-500';
      }).catch(function(err) {
        statusEl.textContent = 'PDF解析失败，请尝试直接粘贴文本';
        statusEl.className = 'inline-block mt-2 text-sm text-red-500';
        console.error('PDF解析失败:', err);
      });
    };
    reader.readAsArrayBuffer(file);
  },

  _parseWord: function(file, statusEl, textarea) {
    var reader = new FileReader();
    reader.onload = function(e) {
      mammoth.extractRawText({ arrayBuffer: e.target.result })
        .then(function(result) {
          textarea.value = result.value;
          statusEl.textContent = '解析完成（共' + result.value.length + '字）';
          statusEl.className = 'inline-block mt-2 text-sm text-green-500';
        })
        .catch(function(err) {
          statusEl.textContent = 'Word解析失败，请尝试直接粘贴文本';
          statusEl.className = 'inline-block mt-2 text-sm text-red-500';
          console.error('Word解析失败:', err);
        });
    };
    reader.readAsArrayBuffer(file);
  },

  analyze: function() {
    var resumeText = document.getElementById('resume-input').value.trim();
    var position = document.getElementById('position-input').value.trim() || '综合岗';
    if (!resumeText) { MianBa.ui.toast('请先粘贴简历内容或上传文件', 'error'); return; }

    // 折叠输入区域
    var inputCard = document.getElementById('resume-input-card');
    if (inputCard) {
      inputCard.querySelector('.card-body-inner').style.display = 'none';
      inputCard.querySelector('.card-collapsed-hint').classList.remove('hidden');
    }

    var btn = document.getElementById('btn-analyze');
    btn.disabled = true;
    btn.textContent = '分析中...';

    var resultDiv = document.getElementById('analysis-result');
    MianBa.ui.showLoading(resultDiv, 'AI正在分析简历...');

    var self = this;
    MianBa.api.analyzeResume(resumeText, position, function(err, result) {
      btn.disabled = false;
      btn.textContent = '开始分析';
      if (err) { MianBa.ui.toast('分析失败', 'error'); return; }
      self.analysisResult = result;
      MianBa.state.resumeWeaknesses = result.weaknesses || [];
      self._renderResult(resultDiv, result);
    });
  },

  _renderResult: function(container, result) {
    container.innerHTML =
      '<div class="card p-6 mb-6 fade-in-up">' +
      '  <h3 class="text-lg font-semibold text-slate-800 mb-4">简历评分雷达图</h3>' +
      '  <div class="max-w-md mx-auto"><canvas id="resume-radar"></canvas></div>' +
      '</div>' +
      '<div class="grid grid-cols-2 gap-6 mb-6">' +
      '  <div class="card p-6 fade-in-up">' +
      '    <h3 class="text-lg font-semibold text-red-600 mb-3">弱点标注</h3>' +
      '    <ul class="space-y-2">' +
      (result.weaknesses || []).map(function(w) {
        return '<li class="flex items-start gap-2 text-sm text-slate-700"><span class="inline-block w-1.5 h-1.5 bg-red-400 rounded-full mt-2 flex-shrink-0"></span>' + w + '</li>';
      }).join('') +
      '    </ul>' +
      '  </div>' +
      '  <div class="card p-6 fade-in-up">' +
      '    <h3 class="text-lg font-semibold text-green-600 mb-3">AI优化建议</h3>' +
      '    <ul class="space-y-2">' +
      (result.suggestions || []).map(function(s) {
        return '<li class="flex items-start gap-2 text-sm text-slate-700"><span class="inline-block w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0"></span>' + s + '</li>';
      }).join('') +
      '    </ul>' +
      '  </div>' +
      '</div>' +
      '<div class="text-center">' +
      '  <button id="btn-start-interview" class="btn-accent text-lg px-8 py-3">开始模拟面试 →</button>' +
      '</div>';

    var ctx = document.getElementById('resume-radar');
    if (ctx) {
      new Chart(ctx, {
        type: 'radar',
        data: {
          labels: ['完整性', '专业性', '亮点突出度', '岗位匹配度'],
          datasets: [{
            label: '简历评分',
            data: [result.score.completeness, result.score.professionalism, result.score.highlight, result.score.match],
            backgroundColor: 'rgba(59,130,246,0.15)', borderColor: '#3B82F6', borderWidth: 2, pointBackgroundColor: '#3B82F6',
          }],
        },
        options: {
          responsive: true,
          scales: { r: { beginAtZero: true, max: 100, ticks: { stepSize: 20, font: { size: 11 } } } },
          plugins: { legend: { display: false } },
        },
      });
    }

    document.getElementById('btn-start-interview').onclick = function() { MianBa.app.switchTab('interview'); };
    lucide.createIcons();
  },
};
