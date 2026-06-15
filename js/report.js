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

  // 生成报告（根据实际回答动态评分）
  generate: function(callback) {
    var answers = MianBa.state.answers || [];
    var cfg = MianBa.state.interviewConfig;
    var msgs = MianBa.state.messages || [];

    // 收集AI在面试中的starIssues反馈
    var allStarIssues = [];
    msgs.forEach(function(m) {
      if (m.role === 'assistant' && m._starIssues && m._starIssues.length) {
        allStarIssues = allStarIssues.concat(m._starIssues);
      }
    });

    // 分析每条回答
    var totalLen = 0, hasNumber = 0, skipped = 0, validAnswers = 0;
    answers.forEach(function(a) {
      if (a.answer === '[跳过]') { skipped++; return; }
      validAnswers++;
      totalLen += a.answer.length;
      if (/\d+/.test(a.answer)) hasNumber++;
    });

    var avgLen = validAnswers > 0 ? totalLen / validAnswers : 0;
    var skipPenalty = answers.length > 0 ? skipped / answers.length : 0;

    // 动态计算各维度得分
    var contentScore = Math.min(95, Math.max(40, Math.round(
      50 + (avgLen > 120 ? 45 : avgLen > 60 ? 30 : avgLen > 20 ? 15 : 5) - skipPenalty * 30
    )));
    var logicScore = Math.min(95, Math.max(40, Math.round(
      50 + (hasNumber / Math.max(validAnswers, 1)) * 40 - skipPenalty * 25
    )));
    var depthScore = Math.min(95, Math.max(40, Math.round(
      50 + (avgLen > 150 ? 40 : avgLen > 80 ? 25 : avgLen > 30 ? 10 : 0) - skipPenalty * 20
    )));
    var starScore = Math.min(95, Math.max(40, Math.round(
      75 - allStarIssues.length * 8 - skipPenalty * 25
    )));

    // 综合得分 = 各维度加权平均 + 小幅随机
    var overall = Math.round(
      (contentScore * 0.3 + logicScore * 0.25 + depthScore * 0.2 + starScore * 0.25)
      + (Math.random() * 6 - 3) // ±3 随机波动
    );
    overall = Math.min(95, Math.max(45, overall));

    // 生成逐题点评
    var rounds = [];
    answers.forEach(function(a, i) {
      var comment = '';
      var issues = [];
      if (a.answer === '[跳过]') {
        comment = '此题未作答，建议在后续练习中尝试回答。';
        issues = ['未作答'];
      } else {
        if (a.answer.length < 30) {
          comment = '回答较为简短，建议展开细节，用具体案例支撑观点。';
          issues.push('回答过短');
        } else if (a.answer.length < 80) {
          comment = '回答有基本内容，但可以补充更多量化数据或具体行动步骤。';
          if (!(/\d/.test(a.answer))) issues.push('缺少量化数据');
        } else if (!(/\d/.test(a.answer))) {
          comment = '回答详细，但缺乏量化数据支撑。建议用具体数字增强说服力。';
          issues.push('缺少量化数据');
        } else {
          comment = '回答结构完整，有具体数据支撑。继续保持！';
        }
      }
      rounds.push({
        question: a.question || '第' + (i + 1) + '题',
        answer: a.answer || '',
        comment: comment,
        starIssues: issues,
      });
    });

    // 动态薄弱项
    var weaknesses = [];
    if (skipPenalty > 0) weaknesses.push('有' + skipped + '题未作答，需要提升临场应变能力');
    if (avgLen < 30) weaknesses.push('回答普遍偏短，缺乏细节展开');
    if (avgLen < 80 && avgLen >= 30) weaknesses.push('回答可以更详细，建议用STAR法则展开');
    if (hasNumber < validAnswers * 0.5) weaknesses.push('量化数据意识较弱，回答缺乏数字支撑');
    if (allStarIssues.length > 0) weaknesses.push('部分回答STAR结构不完整：' + allStarIssues.slice(0, 2).join('、'));
    if (weaknesses.length === 0) weaknesses.push('整体表现不错，继续保持练习！');

    // 动态建议
    var suggestions = [
      '每次回答尽量在80字以上，用完整STAR结构组织',
      '准备3-5个量化案例（如"提升XX%""节省XX天"），面试时灵活调用',
    ];
    if (hasNumber < validAnswers * 0.3) suggestions.push('刻意练习加入数据：每个项目描述至少配一个数字');
    if (skipped > 0) suggestions.push('遇到不会的题可以说"这方面我了解不多，但我可以谈谈相关的XX经验"');

    var report = {
      date: new Date().toISOString(),
      position: cfg.position,
      difficulty: cfg.difficulty,
      score: overall,
      dimensions: { content: contentScore, logic: logicScore, depth: depthScore, star: starScore },
      rounds: rounds,
      weaknesses: weaknesses,
      suggestions: suggestions,
    };

    MianBa.storage.addHistory(report);
    callback(report);
  },
};
