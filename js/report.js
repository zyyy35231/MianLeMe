// ===== 面了么 - 面试报告模块 =====
MianBa.report = {
  render: function(container) {
    var report = MianBa.state.reportData || MianBa.storage.getLastReport();

    if (!report) {
      container.innerHTML =
        '<div class="p-8 flex flex-col items-center justify-center" style="min-height:60vh;">' +
        '  <i data-lucide="file-text" class="w-16 h-16 text-slate-300 mb-4"></i>' +
        '  <p class="text-slate-400 text-lg mb-2">还没有面试记录</p>' +
        '  <p class="text-slate-400 text-sm mb-4">完成一次模拟面试后，报告会在这里显示</p>' +
        '  <button onclick="MianBa.app.switchTab(\'interview\')" class="btn-primary">去模拟面试</button>' +
        '</div>';
      lucide.createIcons();
      return;
    }

    var scoreColor = report.score >= 80 ? 'text-green-500' : report.score >= 60 ? 'text-orange-500' : 'text-red-500';
    var scoreBg = report.score >= 80 ? 'bg-green-50' : report.score >= 60 ? 'bg-orange-50' : 'bg-red-50';

    container.innerHTML =
      '<div id="report-area" class="p-8">' +
      '  <h2 class="text-2xl font-bold text-slate-800 mb-6">面试报告</h2>' +
      // STAR 说明条
      '  <div class="flex items-start gap-2 p-3 bg-blue-50 rounded-lg mb-6 text-xs text-blue-700">' +
      '    <i data-lucide="info" class="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5"></i>' +
      '    <span><strong>STAR</strong> = <strong>S</strong>ituation（情境）+ <strong>T</strong>ask（任务）+ <strong>A</strong>ction（行动）+ <strong>R</strong>esult（结果），是面试回答的结构化框架，帮助面试官评估你的逻辑思维和问题解决能力。</span>' +
      '  </div>' +
      // 岗位信息
      '  <div class="flex items-center gap-4 mb-6 text-sm text-slate-500">' +
      '    <span>岗位：' + (report.position || '未知') + '</span>' +
      '    <span>难度：' + (report.difficulty || '未知') + '</span>' +
      '    <span>时间：' + (report.date ? new Date(report.date).toLocaleString('zh-CN') : '未知') + '</span>' +
      '  </div>' +
      // 综合得分
      '  <div class="card p-8 text-center mb-6 ' + scoreBg + '">' +
      '    <p class="text-slate-500 text-sm mb-2">综合得分</p>' +
      '    <div class="score-animate text-6xl font-bold ' + scoreColor + '">' + report.score + '</div>' +
      '    <p class="text-slate-400 text-xs mt-2">满分100分</p>' +
      '  </div>' +
      // 雷达图 + 薄弱项
      '  <div class="grid grid-cols-2 gap-6 mb-6">' +
      '    <div class="card p-6">' +
      '      <h3 class="text-lg font-semibold text-slate-800 mb-4">多维度分析</h3>' +
      '      <canvas id="report-radar"></canvas>' +
      '    </div>' +
      '    <div class="card p-6">' +
      '      <h3 class="text-lg font-semibold text-red-600 mb-3">薄弱项</h3>' +
      '      <div class="flex flex-wrap gap-2 mb-6">' +
      (report.weaknesses || []).map(function(w) {
        return '<span class="px-3 py-1 bg-red-50 text-red-600 rounded-full text-xs font-medium">' + w + '</span>';
      }).join('') +
      '      </div>' +
      '      <h3 class="text-lg font-semibold text-green-600 mb-3">提升建议</h3>' +
      '      <ul class="space-y-2">' +
      (report.suggestions || []).map(function(s) {
        return '<li class="flex items-start gap-2 text-sm text-slate-700"><span class="inline-block w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0"></span>' + s + '</li>';
      }).join('') +
      '      </ul>' +
      '    </div>' +
      '  </div>' +
      // 逐题回顾
      '  <div class="card p-6 mb-6">' +
      '    <h3 class="text-lg font-semibold text-slate-800 mb-4">逐题回顾</h3>' +
      '    <div class="space-y-3">' +
      (report.rounds || []).map(function(round, i) {
        var qTitle = round.question;
        if (qTitle.length > 60) qTitle = qTitle.substring(0, 60) + '...';
        return '<div class="border border-slate-200 rounded-lg">' +
          '<button class="w-full flex items-center justify-between px-4 py-3 text-left text-sm font-medium text-slate-700 hover:bg-slate-50" onclick="MianBa.report._toggleCollapse(this)">' +
          '  <span>第' + (i + 1) + '题：' + qTitle + '</span>' +
          '  <span class="collapse-arrow text-slate-400">▼</span>' +
          '</button>' +
          '<div class="collapse-content px-4" style="max-height:0">' +
          '  <div class="pb-4 pt-2 border-t border-slate-100">' +
          '    <p class="text-xs text-slate-400 mb-1">你的回答：</p>' +
          '    <p class="text-sm text-slate-600 mb-3">' + (round.answer || '(未作答)') + '</p>' +
          '    <p class="text-xs text-slate-400 mb-1">AI点评：</p>' +
          '    <p class="text-sm text-slate-700">' + (round.comment || '无点评') + '</p>' +
          (round.starIssues && round.starIssues.length
            ? '<div class="mt-2 flex flex-wrap gap-1">' + round.starIssues.map(function(s) { return '<span class="px-2 py-0.5 bg-orange-50 text-orange-500 rounded text-xs">STAR: ' + s + '</span>'; }).join('') + '</div>'
            : '') +
          '  </div>' +
          '</div>' +
          '</div>';
      }).join('') +
      '    </div>' +
      '  </div>' +
      // 底部按钮
      '  <div class="flex justify-center gap-4 pb-8">' +
      '    <button id="btn-share" class="btn-primary flex items-center gap-2"><i data-lucide="camera" class="w-4 h-4"></i> 截图分享</button>' +
      '    <button id="btn-export-text" class="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50 text-sm font-medium transition"><i data-lucide="file-text" class="w-4 h-4"></i> 导出文本</button>' +
      '    <button id="btn-retry" class="btn-accent flex items-center gap-2"><i data-lucide="rotate-ccw" class="w-4 h-4"></i> 再练一次</button>' +
      '  </div>' +
      '</div>';

    lucide.createIcons();

    // 雷达图
    var ctx = document.getElementById('report-radar');
    if (ctx && report.dimensions) {
      new Chart(ctx, {
        type: 'radar',
        data: {
          labels: ['内容完整度', '表达逻辑', '专业深度', 'STAR结构ⓘ'],
          datasets: [{
            data: [report.dimensions.content, report.dimensions.logic, report.dimensions.depth, report.dimensions.star],
            backgroundColor: 'rgba(59,130,246,0.15)',
            borderColor: '#3B82F6',
            borderWidth: 2,
            pointBackgroundColor: '#3B82F6',
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
    document.getElementById('btn-retry').onclick = function() { MianBa.app.switchTab('interview'); };
    document.getElementById('btn-share').onclick = function() { self.shareReport(); };
    document.getElementById('btn-export-text').onclick = function() { self.exportText(); };
  },

  // 折叠面板切换
  _toggleCollapse: function(btn) {
    var content = btn.nextElementSibling;
    var arrow = btn.querySelector('.collapse-arrow');
    if (content.style.maxHeight === '0px' || content.style.maxHeight === '') {
      content.style.maxHeight = content.scrollHeight + 'px';
      if (arrow) arrow.textContent = '▲';
    } else {
      content.style.maxHeight = '0px';
      if (arrow) arrow.textContent = '▼';
    }
  },

  // 截图分享
  shareReport: function() {
    var area = document.getElementById('report-area');
    if (!area) return;
    MianBa.ui.toast('正在生成截图...', 'info');

    // 截图前展开所有折叠面板
    var collapsedPanels = area.querySelectorAll('.collapse-content');
    var savedHeights = [];
    collapsedPanels.forEach(function(p) {
      savedHeights.push(p.style.maxHeight);
      p.style.maxHeight = p.scrollHeight + 'px';
    });
    var arrows = area.querySelectorAll('.collapse-arrow');
    arrows.forEach(function(a) { a.textContent = '▲'; });

    html2canvas(area, {
      backgroundColor: '#ffffff',
      scale: 2,
      useCORS: true,
      logging: false,
    }).then(function(canvas) {
      // 恢复折叠状态
      collapsedPanels.forEach(function(p, i) { p.style.maxHeight = savedHeights[i]; });
      arrows.forEach(function(a) { a.textContent = '▼'; });

      var link = document.createElement('a');
      link.download = '面了么面试报告_' + new Date().toISOString().slice(0, 10) + '.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
      MianBa.ui.toast('报告截图已下载', 'success');
    }).catch(function(err) {
      collapsedPanels.forEach(function(p, i) { p.style.maxHeight = savedHeights[i]; });
      arrows.forEach(function(a) { a.textContent = '▼'; });
      MianBa.ui.toast('截图失败，请尝试导出文本', 'error');
      console.error('截图失败:', err);
    });
  },

  // 导出文本报告（完整题目+回答+点评）
  exportText: function() {
    var report = MianBa.state.reportData || MianBa.storage.getLastReport();
    if (!report) { MianBa.ui.toast('没有可导出的报告', 'error'); return; }

    var text = '════════════════════════════════\n';
    text += '  面了么 AI面试报告\n';
    text += '════════════════════════════════\n\n';
    text += '面试时间：' + new Date(report.date).toLocaleString('zh-CN') + '\n';
    text += '岗位类型：' + (report.position || '未知') + '\n';
    text += '难度等级：' + (report.difficulty || '未知') + '\n';
    text += '综合得分：' + report.score + ' / 100\n\n';
    text += '─── 多维度评分 ───\n';
    if (report.dimensions) {
      text += '  内容完整度：' + report.dimensions.content + '\n';
      text += '  表达逻辑：' + report.dimensions.logic + '\n';
      text += '  专业深度：' + report.dimensions.depth + '\n';
      text += '  STAR结构：' + report.dimensions.star + '\n';
    }
    text += '\n─── 薄弱项 ───\n';
    (report.weaknesses || []).forEach(function(w, i) {
      text += '  ' + (i + 1) + '. ' + w + '\n';
    });
    text += '\n─── 逐题回顾 ───\n';
    (report.rounds || []).forEach(function(round, i) {
      text += '\n【第' + (i + 1) + '题】\n';
      text += 'Q: ' + round.question + '\n';
      text += 'A: ' + (round.answer || '(未作答)') + '\n';
      if (round.comment) {
        text += '点评: ' + round.comment + '\n';
      }
      if (round.starIssues && round.starIssues.length) {
        text += 'STAR问题: ' + round.starIssues.join('、') + '\n';
      }
    });
    text += '\n─── AI提升建议 ───\n';
    (report.suggestions || []).forEach(function(s, i) {
      text += '  ' + (i + 1) + '. ' + s + '\n';
    });
    text += '\n════════════════════════════════\n';
    text += '  由「面了么」AI面试教练生成\n';
    text += '════════════════════════════════\n';

    var blob = new Blob(['﻿' + text], { type: 'text/plain;charset=utf-8' });
    var link = document.createElement('a');
    link.download = '面了么面试报告_' + new Date().toISOString().slice(0, 10) + '.txt';
    link.href = URL.createObjectURL(blob);
    link.click();
    URL.revokeObjectURL(link.href);
    MianBa.ui.toast('文本报告已导出', 'success');
  },

  // 生成报告
  generate: function(callback) {
    var answers = MianBa.state.answers || [];
    var cfg = MianBa.state.interviewConfig;

    // 深拷贝模拟报告
    var mockReport = JSON.parse(JSON.stringify(MianBa.MockReport));

    // 用真实答案替换模拟数据
    var rounds = [];
    var maxRounds = Math.min(answers.length, mockReport.rounds.length);
    for (var i = 0; i < maxRounds; i++) {
      rounds.push({
        question: answers[i].question || mockReport.rounds[i].question,
        answer: answers[i].answer || '',
        comment: mockReport.rounds[i].comment || '',
        starIssues: mockReport.rounds[i].starIssues || [],
      });
    }
    // 补充超出模拟数据的答案
    for (var j = maxRounds; j < answers.length; j++) {
      rounds.push({
        question: answers[j].question,
        answer: answers[j].answer,
        comment: '请继续练习以获取更全面的AI点评',
        starIssues: [],
      });
    }

    var report = {
      date: new Date().toISOString(),
      position: cfg.position,
      difficulty: cfg.difficulty,
      score: mockReport.score,
      dimensions: mockReport.dimensions,
      rounds: rounds,
      weaknesses: mockReport.weaknesses,
      suggestions: mockReport.suggestions,
    };

    MianBa.storage.addHistory(report);
    callback(report);
  },
};
