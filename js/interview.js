// ===== 面了么 - 模拟面试模块（核心） =====
MianBa.interview = {
  render: function(container) {
    if (MianBa.state.interviewInProgress) {
      this._renderInterviewUI(container);
      return;
    }
    this._renderConfigUI(container);
  },

  // ===== 面试配置界面 =====
  _renderConfigUI: function(container) {
    var positions = MianBa.Config.POSITIONS;
    var difficulties = MianBa.Config.DIFFICULTIES;
    var counts = MianBa.Config.QUESTION_COUNTS;

    var lastDesc = MianBa.state.customPositionDesc || '';

    var diffDescs = {
      '初级': '侧重基础概念、行为面试题，适合初次练习',
      '中级': '侧重项目深挖、场景分析、技术方案设计（推荐）',
      '高级': '侧重系统设计、架构思维、压力题，挑战较大',
    };
    var countDescs = {
      5: '快速体验，适合初步感受面试节奏（约15分钟）',
      8: '标准面试，覆盖核心考察点（约25分钟，推荐）',
      10: '深度模拟，全面系统评估面试能力（约35分钟）',
    };

    container.innerHTML =
      '<div class="p-8 flex flex-col items-center">' +
      '  <h2 class="text-2xl font-bold text-slate-800 mb-2">模拟面试</h2>' +
      '  <p class="text-sm text-slate-500 mb-8">配置面试参数，AI面试官将根据你的选择进行针对性提问</p>' +
      '  <div class="card p-6 w-full max-w-xl">' +
      // 岗位类型
      '    <div class="mb-5">' +
      '      <label class="block text-sm font-medium text-slate-700 mb-2">岗位类型</label>' +
      '      <select id="interview-position" class="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white">' +
      positions.map(function(p) { return '<option>' + p + '</option>'; }).join('') +
      '      </select>' +
      '    </div>' +
      // 岗位详细要求
      '    <div class="mb-5">' +
      '      <label class="block text-sm font-medium text-slate-700 mb-2">岗位详细要求 <span class="text-slate-400 font-normal">（可选，描述越详细面试越精准）</span></label>' +
      '      <textarea id="position-desc" class="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none" rows="4" placeholder="详细描述岗位要求，AI将据此出题。&#10;&#10;例如：&#10;岗位：前端开发工程师&#10;要求：熟练React/Vue，有TypeScript项目经验，了解Webpack/Vite等构建工具...">' + (lastDesc || '') + '</textarea>' +
      '    </div>' +
      // 难度等级
      '    <div class="mb-5">' +
      '      <label class="block text-sm font-medium text-slate-700 mb-2">难度等级</label>' +
      '      <div class="space-y-2" id="difficulty-options">' +
      difficulties.map(function(d, i) {
        var isActive = i === 0;
        return '<div class="diff-btn flex items-center gap-3 px-4 py-3 rounded-lg border cursor-pointer transition ' +
          (isActive ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-slate-300 bg-white') +
          '" data-diff="' + d + '">' +
          '  <div class="flex-1">' +
          '    <span class="text-sm font-medium ' + (isActive ? 'text-blue-600' : 'text-slate-700') + '">' + d + '</span>' +
          '    <p class="text-xs text-slate-400 mt-0.5">' + (diffDescs[d] || '') + '</p>' +
          '  </div>' +
          '  <div class="w-4 h-4 rounded-full border-2 flex items-center justify-center ' + (isActive ? 'border-blue-500' : 'border-slate-300') + '">' +
          (isActive ? '<div class="w-2 h-2 rounded-full bg-blue-500"></div>' : '') +
          '  </div>' +
          '</div>';
      }).join('') +
      '      </div>' +
      '    </div>' +
      // 面试题数
      '    <div class="mb-6">' +
      '      <label class="block text-sm font-medium text-slate-700 mb-2">面试题数</label>' +
      '      <div class="space-y-2" id="count-options">' +
      counts.map(function(c, i) {
        var isActive = i === 1;
        return '<div class="count-btn flex items-center gap-3 px-4 py-3 rounded-lg border cursor-pointer transition ' +
          (isActive ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-slate-300 bg-white') +
          '" data-count="' + c + '">' +
          '  <div class="flex-1">' +
          '    <span class="text-sm font-medium ' + (isActive ? 'text-blue-600' : 'text-slate-700') + '">' + c + ' 题</span>' +
          '    <p class="text-xs text-slate-400 mt-0.5">' + (countDescs[c] || '') + '</p>' +
          '  </div>' +
          '  <div class="w-4 h-4 rounded-full border-2 flex items-center justify-center ' + (isActive ? 'border-blue-500' : 'border-slate-300') + '">' +
          (isActive ? '<div class="w-2 h-2 rounded-full bg-blue-500"></div>' : '') +
          '  </div>' +
          '</div>';
      }).join('') +
      '      </div>' +
      '    </div>' +
      // 提示信息
      '    <div class="flex items-start gap-2 p-3 bg-blue-50 rounded-lg mb-6">' +
      '      <i data-lucide="info" class="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5"></i>' +
      '      <p class="text-xs text-blue-600">实际校招面试通常有 8-15 道题，这里提供的是核心题数。每道题可能包含 1-3 次追问，总对话轮数会更多。</p>' +
      '    </div>' +
      '    <button id="btn-start" class="btn-primary w-full text-lg py-3">开始面试</button>' +
      '  </div>' +
      '</div>';

    var self = this;
    // 难度选择（卡片样式）
    container.querySelectorAll('.diff-btn').forEach(function(card) {
      card.onclick = function() {
        // 重置所有难度卡片
        container.querySelectorAll('.diff-btn').forEach(function(c) {
          c.className = 'diff-btn flex items-center gap-3 px-4 py-3 rounded-lg border cursor-pointer transition border-slate-200 hover:border-slate-300 bg-white';
          c.querySelector('span:first-child').className = 'text-sm font-medium text-slate-700';
          c.querySelector('.w-4').innerHTML = '';
          c.querySelector('.w-4').className = 'w-4 h-4 rounded-full border-2 flex items-center justify-center border-slate-300';
        });
        // 激活当前卡片
        this.className = 'diff-btn flex items-center gap-3 px-4 py-3 rounded-lg border cursor-pointer transition border-blue-500 bg-blue-50';
        this.querySelector('span:first-child').className = 'text-sm font-medium text-blue-600';
        this.querySelector('.w-4').className = 'w-4 h-4 rounded-full border-2 flex items-center justify-center border-blue-500';
        this.querySelector('.w-4').innerHTML = '<div class="w-2 h-2 rounded-full bg-blue-500"></div>';
      };
    });
    // 题数选择（卡片样式）
    container.querySelectorAll('.count-btn').forEach(function(card) {
      card.onclick = function() {
        container.querySelectorAll('.count-btn').forEach(function(c) {
          c.className = 'count-btn flex items-center gap-3 px-4 py-3 rounded-lg border cursor-pointer transition border-slate-200 hover:border-slate-300 bg-white';
          c.querySelector('span:first-child').className = 'text-sm font-medium text-slate-700';
          c.querySelector('.w-4').innerHTML = '';
          c.querySelector('.w-4').className = 'w-4 h-4 rounded-full border-2 flex items-center justify-center border-slate-300';
        });
        this.className = 'count-btn flex items-center gap-3 px-4 py-3 rounded-lg border cursor-pointer transition border-blue-500 bg-blue-50';
        this.querySelector('span:first-child').className = 'text-sm font-medium text-blue-600';
        this.querySelector('.w-4').className = 'w-4 h-4 rounded-full border-2 flex items-center justify-center border-blue-500';
        this.querySelector('.w-4').innerHTML = '<div class="w-2 h-2 rounded-full bg-blue-500"></div>';
      };
    });

    document.getElementById('btn-start').onclick = function() {
      var position = document.getElementById('interview-position').value;
      var positionDesc = document.getElementById('position-desc').value.trim();
      var diffBtn = container.querySelector('.diff-btn.border-blue-500');
      var countBtn = container.querySelector('.count-btn.border-blue-500');
      var difficulty = diffBtn ? diffBtn.dataset.diff : '初级';
      var questionCount = countBtn ? parseInt(countBtn.dataset.count) : 8;
      self.start(position, difficulty, questionCount, positionDesc);
    };

    lucide.createIcons();
  },

  // ===== 开始面试 =====
  start: function(position, difficulty, questionCount, positionDesc) {
    // Free用户题数限制
    var planConfig = MianBa.user.getPlanConfig();
    var maxQuestions = planConfig.interviewLimit;
    if (questionCount > maxQuestions) {
      questionCount = maxQuestions;
      MianBa.ui.toast('免费版限制 ' + maxQuestions + ' 题/次，升级 Pro 版解锁无限题数', 'info');
    }

    MianBa.state.interviewInProgress = true;
    MianBa.state.customPositionDesc = positionDesc || '';
    MianBa.state.interviewConfig = { position: position, difficulty: difficulty, questionCount: questionCount, positionDesc: positionDesc || '' };
    MianBa.state.messages = [];
    MianBa.state.answers = [];
    MianBa.state.questionIndex = 0;
    MianBa.state.roundIndex = 0;
    MianBa.state.timerSeconds = MianBa.Config.DEFAULT_INTERVIEW_TIME;

    var container = document.getElementById('content-area');
    this._renderInterviewUI(container);

    // 发第一条AI消息（自我介绍）
    this._sendToAI();
  },

  // ===== 面试进行中界面（正式面试面板风格C） =====
  _renderInterviewUI: function(container) {
    var cfg = MianBa.state.interviewConfig;
    var qi = MianBa.state.questionIndex;

    container.innerHTML =
      '<div class="flex flex-col" style="height:calc(100vh - 0px);">' +
      // ---- 顶部状态栏 ----
      '  <div class="bg-white border-b border-slate-200 px-6 py-3 flex items-center gap-6 flex-shrink-0">' +
      '    <span class="text-sm font-medium text-slate-700">' + cfg.position + ' · ' + cfg.difficulty + '</span>' +
      '    <div class="flex-1 flex items-center gap-3">' +
      '      <div class="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">' +
      '        <div id="interview-progress" class="progress-bar h-full bg-blue-500 rounded-full" style="width:' + (qi / cfg.questionCount * 100) + '%"></div>' +
      '      </div>' +
      '      <span class="text-sm font-medium text-slate-600 whitespace-nowrap">第<span id="q-display">-</span>/' + cfg.questionCount + '题</span>' +
      '    </div>' +
      '    <span id="timer-display" class="text-orange-500 font-mono font-medium whitespace-nowrap">⏱ <span id="timer-seconds">' + MianBa.state.timerSeconds + '</span>s</span>' +
      '  </div>' +
      // ---- 主体区域 ----
      '  <div class="flex-1 overflow-y-auto p-6">' +
      // 当前问题卡片
      '    <div id="current-question-card" class="card border-l-4 border-blue-500 p-5 mb-6 message-in">' +
      '      <div class="flex items-start gap-3">' +
      '        <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">AI</div>' +
      '        <div class="flex-1">' +
      '          <p class="text-xs text-blue-500 font-medium mb-1">面试官提问</p>' +
      '          <p id="question-text" class="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed"></p>' +
      '        </div>' +
      '      </div>' +
      '      <div class="mt-3 flex gap-3 ml-11">' +
      '        <button id="btn-speak-q" class="text-xs text-blue-500 hover:text-blue-600 flex items-center gap-1"><i data-lucide="volume-2" class="w-3.5 h-3.5"></i> 播放语音</button>' +
      '        <span class="text-xs text-slate-300">|</span>' +
      '        <span id="followup-badge" class="text-xs text-orange-500 hidden">追问</span>' +
      '      </div>' +
      '    </div>' +
      // 回答区
      '    <div class="card p-5 mb-4 message-in">' +
      '      <p class="text-xs text-slate-400 mb-2">你的回答</p>' +
      '      <textarea id="answer-input" class="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none" rows="4" placeholder="在此输入你的回答...（Enter提交，Shift+Enter换行）"></textarea>' +
      '      <div class="flex items-center justify-between mt-3">' +
      '        <div class="flex gap-2">' +
      '          <button id="btn-submit" class="btn-primary text-sm">提交回答</button>' +
      '          <button id="btn-voice-hint" class="px-3 py-2 rounded-lg border border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-medium transition flex items-center gap-1.5" title="语音输入提示">🎤 语音输入</button>' +
      '        </div>' +
      '        <div class="flex gap-3">' +
      '          <button id="btn-skip" class="text-sm text-slate-400 hover:text-slate-600">跳过此题</button>' +
      '          <button id="btn-end" class="text-sm text-red-400 hover:text-red-600">结束面试</button>' +
      '        </div>' +
      '      </div>' +
      '    </div>' +
      // 历史问答区
      '    <div id="history-section" class="mt-6">' +
      '      <button id="btn-toggle-history" class="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-3">' +
      '        <span id="history-toggle-icon">▶</span> 历史问答 (<span id="history-count">0</span>)' +
      '      </button>' +
      '      <div id="history-list" class="space-y-3" style="display:none;"></div>' +
      '    </div>' +
      '  </div>' +
      '</div>';

    lucide.createIcons();

    var self = this;
    document.getElementById('btn-submit').onclick = function() { self.submitAnswer(); };
    document.getElementById('btn-skip').onclick = function() { self.skipQuestion(); };
    document.getElementById('btn-end').onclick = function() { self.endInterview(); };
    document.getElementById('btn-voice-hint').onclick = function() { self._showVoiceHint(); };
    document.getElementById('btn-speak-q').onclick = function() { self._speakQuestion(); };
    document.getElementById('btn-toggle-history').onclick = function() { self._toggleHistory(); };
    document.getElementById('answer-input').onkeydown = function(e) {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); self.submitAnswer(); }
    };

    // 渲染已有消息
    this._renderCurrentQuestion();
    this._renderHistory();
    this._startTimer();
  },

  // ===== 渲染当前问题 =====
  _renderCurrentQuestion: function() {
    var msgs = MianBa.state.messages;
    // 找最后一条assistant消息
    for (var i = msgs.length - 1; i >= 0; i--) {
      if (msgs[i].role === 'assistant') {
        var qText = document.getElementById('question-text');
        if (qText) qText.textContent = msgs[i].content;
        // 显示追问标记
        var badge = document.getElementById('followup-badge');
        if (badge && msgs[i]._wasFollowUp) {
          badge.classList.remove('hidden');
        }
        return;
      }
    }
  },

  // ===== 渲染历史问答 =====
  _renderHistory: function() {
    var answers = MianBa.state.answers;
    var list = document.getElementById('history-list');
    var count = document.getElementById('history-count');
    if (!list || !count) return;
    count.textContent = answers.length;

    if (answers.length === 0) {
      list.innerHTML = '<p class="text-sm text-slate-400 text-center py-4">暂无历史记录</p>';
      return;
    }

    list.innerHTML = answers.map(function(a, i) {
      var qShort = a.question.length > 50 ? a.question.substring(0, 50) + '...' : a.question;
      return '<div class="card p-3 text-sm">' +
        '<p class="text-slate-400 text-xs mb-1">第' + (i + 1) + '题</p>' +
        '<p class="text-slate-700 font-medium mb-2">Q: ' + qShort + '</p>' +
        '<p class="text-slate-500 text-xs">A: ' + (a.answer || '(未作答)') + '</p>' +
        '</div>';
    }).join('');
  },

  // ===== 提交回答 =====
  submitAnswer: function() {
    var input = document.getElementById('answer-input');
    if (!input) return;
    var answer = input.value.trim();
    if (!answer) { MianBa.ui.toast('请输入回答再提交', 'error'); return; }
    input.value = '';

    var msgs = MianBa.state.messages;
    var currentQ = '';
    for (var i = msgs.length - 1; i >= 0; i--) {
      if (msgs[i].role === 'assistant') { currentQ = msgs[i].content; break; }
    }

    MianBa.state.answers.push({ question: currentQ, answer: answer });
    MianBa.state.messages.push({ role: 'user', content: answer });
    this._updateProgress();
    this._renderHistory();
    this._resetTimer();

    var submitBtn = document.getElementById('btn-submit');
    if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = '等待中...'; }

    this._sendToAI();
  },

  // ===== 跳过题目 =====
  skipQuestion: function() {
    var msgs = MianBa.state.messages;
    var currentQ = '';
    for (var i = msgs.length - 1; i >= 0; i--) {
      if (msgs[i].role === 'assistant') { currentQ = msgs[i].content; break; }
    }

    MianBa.state.answers.push({ question: currentQ, answer: '[跳过]' });
    MianBa.state.messages.push({ role: 'user', content: '[跳过此题]' });
    this._updateProgress();
    this._renderHistory();
    this._resetTimer();

    var submitBtn = document.getElementById('btn-submit');
    if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = '等待中...'; }

    this._sendToAI();
  },

  // ===== 更新进度条和题号 =====
  _updateProgress: function() {
    var qi = MianBa.state.questionIndex;
    var total = MianBa.state.interviewConfig.questionCount;
    var progress = document.getElementById('interview-progress');
    var qDisplay = document.getElementById('q-display');
    if (progress) progress.style.width = (qi / total * 100) + '%';
    if (qDisplay) qDisplay.textContent = qi || '-';
  },

  // ===== 向AI发送请求 =====
  _sendToAI: function() {
    var self = this;
    var qText = document.getElementById('question-text');
    if (qText) qText.textContent = '正在生成问题...';

    // 收集已问过的非追问题目，避免重复
    var askedQuestions = [];
    MianBa.state.messages.forEach(function(m) {
      if (m.role === 'assistant' && !m._wasFollowUp && m.content) {
        // 取前50字作为题目摘要
        askedQuestions.push(m.content.length > 50 ? m.content.substring(0, 50) + '...' : m.content);
      }
    });

    MianBa.api.interviewReply(
      MianBa.state.messages,
      MianBa.state.interviewConfig.position,
      MianBa.state.interviewConfig.difficulty,
      MianBa.state.resumeWeaknesses,
      MianBa.state.interviewConfig.positionDesc || '',
      askedQuestions,
      function(err, reply) {
        var submitBtn = document.getElementById('btn-submit');
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = '提交回答'; }

        if (err) { MianBa.ui.toast('获取回复失败', 'error'); return; }

        // 非追问则递增题号（新问题）
        if (!reply.followUp) {
          MianBa.state.questionIndex++;
        }

        MianBa.state.messages.push({
          role: 'assistant', content: reply.reply,
          _wasFollowUp: reply.followUp || false,
          _questionIndex: MianBa.state.questionIndex,
          _starIssues: reply.starIssues || [],
        });

        self._updateProgress();
        self._renderCurrentQuestion();

        var badge = document.getElementById('followup-badge');
        if (badge) {
          if (reply.followUp) { badge.classList.remove('hidden'); }
          else { badge.classList.add('hidden'); }
        }

        self._renderHistory();
        self._resetTimer();

        // 检查是否完成所有题目
        if (MianBa.state.questionIndex >= MianBa.state.interviewConfig.questionCount) {
          MianBa.ui.toast('所有题目已完成', 'info');
          self.endInterview();
          return;
        }

        if (reply.suggestEnd) {
          MianBa.ui.toast('面试官提示可以结束了', 'info');
        }
      }
    );
  },

  // ===== 结束面试 =====
  endInterview: function() {
    clearInterval(MianBa.state.timerInterval);
    MianBa.state.interviewInProgress = false;

    // 显示等待画面
    var container = document.getElementById('content-area');
    if (container) {
      container.innerHTML =
        '<div class="flex flex-col items-center justify-center" style="min-height:60vh;">' +
        '  <div class="w-10 h-10 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mb-4"></div>' +
        '  <p class="text-slate-600 font-medium mb-1">AI 正在评估你的面试表现...</p>' +
        '  <p class="text-slate-400 text-sm">正在分析每一道题的回答质量，请稍候</p>' +
        '</div>';
    }

    MianBa.report.generate(function(report) {
      MianBa.state.reportData = report;
      MianBa.storage.saveLastReport(report);
      MianBa.app.switchTab('report');
    });
  },

  // ===== 计时器 =====
  _startTimer: function() {
    var self = this;
    clearInterval(MianBa.state.timerInterval);
    MianBa.state.timerInterval = setInterval(function() {
      MianBa.state.timerSeconds--;
      var display = document.getElementById('timer-seconds');
      if (display) display.textContent = MianBa.state.timerSeconds;
      // 10秒警告变红
      if (MianBa.state.timerSeconds <= 10) {
        var td = document.getElementById('timer-display');
        if (td) td.className = 'text-red-500 font-mono font-medium whitespace-nowrap';
      }
      // 超时自动跳过
      if (MianBa.state.timerSeconds <= 0) {
        self.skipQuestion();
      }
    }, 1000);
  },

  _resetTimer: function() {
    MianBa.state.timerSeconds = MianBa.Config.DEFAULT_INTERVIEW_TIME;
    var display = document.getElementById('timer-seconds');
    if (display) display.textContent = MianBa.state.timerSeconds;
    var td = document.getElementById('timer-display');
    if (td) td.className = 'text-orange-500 font-mono font-medium whitespace-nowrap';
  },

  // ===== 语音播报当前问题（TTS） =====
  _speakQuestion: function() {
    var qText = document.getElementById('question-text');
    if (!qText || !qText.textContent) return;
    if ('speechSynthesis' in window) {
      var utterance = new SpeechSynthesisUtterance(qText.textContent);
      utterance.lang = 'zh-CN';
      utterance.rate = 1.0;
      speechSynthesis.cancel();
      speechSynthesis.speak(utterance);
      var btn = document.getElementById('btn-speak-q');
      if (btn) { btn.innerHTML = '<i data-lucide="volume-2" class="w-3.5 h-3.5"></i> 播放中...'; }
      utterance.onend = function() {
        if (btn) { btn.innerHTML = '<i data-lucide="volume-2" class="w-3.5 h-3.5"></i> 播放语音'; }
      };
    } else {
      MianBa.ui.toast('浏览器不支持语音合成', 'error');
    }
  },

  // 语音输入提示（引导使用微信语音识别）
  _showVoiceHint: function() {
    MianBa.ui.modal(
      '🎤 语音输入指南',
      '<div class="text-sm text-slate-600 space-y-3">' +
      '  <p>推荐使用<strong class="text-green-600">微信桌面版</strong>的全局语音识别功能，准确且免费：</p>' +
      '  <div class="bg-slate-50 rounded-lg p-3 space-y-2">' +
      '    <div class="flex items-start gap-2">' +
      '      <span class="inline-flex items-center justify-center w-16 h-6 bg-slate-700 text-white text-[10px] font-mono rounded flex-shrink-0 mt-0.5">Ctrl+Win</span>' +
      '      <span class="text-xs text-slate-500">按住说话，松开停止。适合边想边说的场景。</span>' +
      '    </div>' +
      '    <div class="flex items-start gap-2">' +
      '      <span class="inline-flex items-center justify-center w-24 h-6 bg-slate-700 text-white text-[10px] font-mono rounded flex-shrink-0 mt-0.5">Ctrl+Shift+Win</span>' +
      '      <span class="text-xs text-slate-500">按一次开始，再按一次结束。适合较长段落的语音输入。</span>' +
      '    </div>' +
      '  </div>' +
      '  <p class="text-xs text-slate-400 mt-2">使用时确保微信已登录并在后台运行。将光标放在面试回答输入框中，按下快捷键开始语音识别，说完后语音结果会自动出现在微信输入框，复制后粘贴到这里即可。</p>' +
      '</div>',
      function() {}
    );
  },

  // ===== 历史区展开/折叠 =====
  _toggleHistory: function() {
    var list = document.getElementById('history-list');
    var icon = document.getElementById('history-toggle-icon');
    if (!list || !icon) return;
    if (list.style.display === 'none') {
      list.style.display = 'block';
      icon.textContent = '▼';
    } else {
      list.style.display = 'none';
      icon.textContent = '▶';
    }
  },
};
