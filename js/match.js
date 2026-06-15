// ===== 面了么 - 岗位匹配度预测 =====
MianBa.match = {
  result: null,

  render: function(container) {
    if (!MianBa.user.isLoggedIn()) {
      container.innerHTML =
        '<div class="p-8 flex flex-col items-center justify-center" style="min-height:60vh;">' +
        '  <i data-lucide="user-x" class="w-16 h-16 text-slate-300 mb-4"></i>' +
        '  <p class="text-slate-400 text-lg mb-2">请先登录</p>' +
        '  <button onclick="MianBa.user.showLoginModal()" class="btn-primary">登录 / 注册</button>' +
        '</div>';
      lucide.createIcons();
      return;
    }

    if (this.result) {
      this._renderResult(container, this.result);
      return;
    }

    var self = this;
    container.innerHTML =
      '<div class="p-8">' +
      '  <h2 class="text-2xl font-bold text-slate-800 mb-6">岗位匹配度预测</h2>' +
      '  <div class="card p-6 max-w-2xl mb-6">' +
      '    <label class="block text-sm font-medium text-slate-700 mb-2">目标岗位 JD（职位描述）</label>' +
      '    <textarea id="jd-input" class="w-full border border-slate-300 rounded-lg p-4 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none" rows="6" placeholder="粘贴目标岗位的职位描述...&#10;&#10;例如：&#10;岗位名称：高级前端开发工程师&#10;岗位要求：&#10;1. 3年以上前端开发经验&#10;2. 精通 React/Vue，有 TypeScript 项目经验&#10;3. 熟悉微服务架构和 CI/CD 流程&#10;4. 有带领团队的经验优先"></textarea>' +
      '    <label class="block text-sm font-medium text-slate-700 mt-4 mb-2">你的简历</label>' +
      '    <textarea id="match-resume-input" class="w-full border border-slate-300 rounded-lg p-4 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none" rows="6" placeholder="粘贴你的简历内容..."></textarea>' +
      '    <button id="btn-match" class="btn-primary mt-4">开始匹配分析</button>' +
      '  </div>' +
      '  <div id="match-result"></div>' +
      '</div>';

    lucide.createIcons();

    // 从简历分析页复用简历文本
    var lastResume = MianBa.state.lastResumeText;
    if (lastResume) {
      var matchResume = document.getElementById('match-resume-input');
      if (matchResume && !matchResume.value.trim()) {
        matchResume.value = lastResume;
        MianBa.ui.toast('已自动填入简历分析页的简历内容', 'info');
      }
    }

    document.getElementById('btn-match').onclick = function() { self.analyze(); };
  },

  analyze: function() {
    var jdText = document.getElementById('jd-input').value.trim();
    var resumeText = document.getElementById('match-resume-input').value.trim();
    if (!jdText) { MianBa.ui.toast('请先粘贴岗位JD', 'error'); return; }
    if (!resumeText) { MianBa.ui.toast('请先粘贴简历内容', 'error'); return; }

    // 权限检查
    if (!MianBa.user.canUseMatch()) {
      MianBa.ui.toast('今日匹配次数已用完，请升级会员', 'error');
      setTimeout(function() { MianBa.app.switchTab('pricing'); }, 1500);
      return;
    }

    var btn = document.getElementById('btn-match');
    btn.disabled = true;
    btn.textContent = '分析中...';

    var resultDiv = document.getElementById('match-result');
    MianBa.ui.showLoading(resultDiv, 'AI正在分析匹配度...');

    var self = this;
    // 尝试API，失败用模拟数据
    var apiKey = MianBa.storage.getApiKey();
    if (apiKey) {
      MianBa.api._call(
        '你是HR专家，分析JD和简历的匹配度。返回JSON：{"overallScore":0-100,"dimensions":{"skills":0-100,"experience":0-100,"education":0-100,"comprehensive":0-100},"gaps":["差距1"],"suggestions":["建议1"]}',
        'JD:\n' + jdText + '\n\n简历:\n' + resumeText,
        function(err, raw) {
          btn.disabled = false;
          btn.textContent = '开始匹配分析';
          if (err) { self._useMock(resultDiv); return; }
          try {
            var clean = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
            var parsed = JSON.parse(clean);
            self.result = parsed;
            MianBa.storage.incrementMatchCount();
            self._renderResult(resultDiv, parsed);
          } catch (e) { self._useMock(resultDiv); }
        }
      );
    } else {
      setTimeout(function() {
        btn.disabled = false;
        btn.textContent = '开始匹配分析';
        self._useMock(resultDiv);
      }, 1500);
    }
  },

  _useMock: function(container) {
    this.result = JSON.parse(JSON.stringify(MianBa.MockMatchResult));
    MianBa.storage.incrementMatchCount();
    this._renderResult(container, this.result);
  },

  _renderResult: function(container, result) {
    var scoreColor = result.overallScore >= 80 ? 'text-green-500 bg-green-50' : result.overallScore >= 60 ? 'text-orange-500 bg-orange-50' : 'text-red-500 bg-red-50';
    var d = result.dimensions || {};

    container.innerHTML =
      '<div class="fade-in-up">' +
      '  <div class="card p-8 text-center mb-6 ' + scoreColor.split(' ')[1] + '">' +
      '    <p class="text-slate-500 text-sm mb-2">综合匹配度</p>' +
      '    <div class="score-animate text-6xl font-bold ' + scoreColor.split(' ')[0] + '">' + result.overallScore + '%</div>' +
      '    <p class="text-slate-400 text-xs mt-2">该分数综合评估技能、经验、学历与JD的契合度</p>' +
      '  </div>' +
      '  <div class="grid grid-cols-2 gap-6 mb-6">' +
      '    <div class="card p-6"><h3 class="text-lg font-semibold text-slate-800 mb-4">匹配雷达图</h3><div class="max-w-xs mx-auto"><canvas id="match-radar"></canvas></div></div>' +
      '    <div class="card p-6">' +
      '      <h3 class="text-lg font-semibold text-red-600 mb-3">差距分析</h3>' +
      '      <ul class="space-y-2">' +
      (result.gaps || []).map(function(g) { return '<li class="flex items-start gap-2 text-sm text-slate-700"><span class="inline-block w-1.5 h-1.5 bg-red-400 rounded-full mt-2 flex-shrink-0"></span>' + g + '</li>'; }).join('') +
      '      </ul>' +
      '    </div>' +
      '  </div>' +
      '  <div class="card p-6 mb-6">' +
      '    <h3 class="text-lg font-semibold text-green-600 mb-3">提升建议</h3>' +
      '    <ul class="space-y-2">' +
      (result.suggestions || []).map(function(s) { return '<li class="flex items-start gap-2 text-sm text-slate-700"><span class="inline-block w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0"></span>' + s + '</li>'; }).join('') +
      '    </ul>' +
      '  </div>' +
      '  <div class="text-center">' +
      '    <button id="btn-practice-weak" class="btn-accent text-lg px-8 py-3">针对薄弱项练习 →</button>' +
      '  </div>' +
      '</div>';

    lucide.createIcons();

    var ctx = document.getElementById('match-radar');
    if (ctx) {
      new Chart(ctx, {
        type: 'radar',
        data: {
          labels: ['技能匹配', '经验匹配', '学历匹配', '综合匹配'],
          datasets: [{
            data: [d.skills || 0, d.experience || 0, d.education || 0, d.comprehensive || 0],
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

    var self = this;
    document.getElementById('btn-practice-weak').onclick = function() {
      // 将匹配结果完整传入面试模块
      MianBa.state.matchContext = {
        fromMatch: true,
        gaps: result.gaps || [],
        suggestions: result.suggestions || [],
        matchScore: result.overallScore || 0,
        dimensions: result.dimensions || {},
        jdText: document.getElementById('jd-input') ? document.getElementById('jd-input').value.trim() : '',
      };
      // 同步弱点到面试
      MianBa.state.resumeWeaknesses = (result.gaps || []).concat(result.suggestions || []);
      MianBa.ui.toast('已将薄弱项同步到面试，AI将针对性出题', 'success');
      MianBa.app.switchTab('interview');
    };
  },
};
