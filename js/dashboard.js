// ===== 面了么 - 个人数据看板 =====
MianBa.dashboard = {
  render: function(container) {
    var user = MianBa.user.getCurrent();

    if (!user || !user.isLoggedIn) {
      container.innerHTML =
        '<div class="p-8 flex flex-col items-center justify-center" style="min-height:60vh;">' +
        '  <i data-lucide="user-x" class="w-16 h-16 text-slate-300 mb-4"></i>' +
        '  <p class="text-slate-400 text-lg mb-2">请先登录</p>' +
        '  <p class="text-slate-400 text-sm mb-4">登录后可查看练习数据和进度趋势</p>' +
        '  <button onclick="MianBa.user.showLoginModal()" class="btn-primary">登录 / 注册</button>' +
        '</div>';
      lucide.createIcons();
      return;
    }

    var planConfig = MianBa.Config.PLANS[user.plan] || MianBa.Config.PLANS.free;
    var initials = user.name ? user.name.charAt(0).toUpperCase() : '?';
    var history = MianBa.storage.getHistory();
    var avgScore = history.length > 0
      ? Math.round(history.reduce(function(sum, h) { return sum + (h.score || 0); }, 0) / history.length)
      : '-';

    container.innerHTML =
      '<div class="p-8">' +
      '  <h2 class="text-2xl font-bold text-slate-800 mb-6">个人中心</h2>' +
      // 用户信息卡片
      '  <div class="card p-6 mb-6">' +
      '    <div class="flex items-center gap-4">' +
      '      <div class="w-14 h-14 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl font-bold">' + initials + '</div>' +
      '      <div class="flex-1">' +
      '        <h3 class="text-lg font-semibold text-slate-800">' + (user.name || '未设置') + '</h3>' +
      '        <p class="text-sm text-slate-500">' + (user.email || '') + '</p>' +
      '        <p class="text-xs text-slate-400 mt-1">加入于 ' + (user.joinDate || '未知') + '</p>' +
      '      </div>' +
      '      <div class="text-right">' +
      '        <span class="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium">' + planConfig.name + '</span>' +
      '        <br><button onclick="MianBa.app.switchTab(\'pricing\')" class="text-xs text-blue-500 hover:text-blue-600 mt-2">升级会员 →</button>' +
      '        <br><button onclick="MianBa.user.logout()" class="text-xs text-slate-400 hover:text-red-500 mt-1">退出登录</button>' +
      '      </div>' +
      '    </div>' +
      '  </div>' +
      // 统计数据
      '  <div class="grid grid-cols-4 gap-4 mb-6">' +
      '    <div class="card p-5 text-center">' +
      '      <i data-lucide="target" class="w-6 h-6 text-blue-400 mx-auto mb-2"></i>' +
      '      <div class="text-2xl font-bold text-slate-800">' + (user.practiceCount || 0) + '</div>' +
      '      <div class="text-xs text-slate-500 mt-1">累计面试次数</div>' +
      '    </div>' +
      '    <div class="card p-5 text-center">' +
      '      <i data-lucide="clock" class="w-6 h-6 text-blue-400 mx-auto mb-2"></i>' +
      '      <div class="text-2xl font-bold text-slate-800">' + (user.totalMinutes || 0) + '</div>' +
      '      <div class="text-xs text-slate-500 mt-1">练习总时长（分钟）</div>' +
      '    </div>' +
      '    <div class="card p-5 text-center">' +
      '      <i data-lucide="trending-up" class="w-6 h-6 text-blue-400 mx-auto mb-2"></i>' +
      '      <div class="text-2xl font-bold text-slate-800">' + avgScore + '</div>' +
      '      <div class="text-xs text-slate-500 mt-1">平均得分</div>' +
      '    </div>' +
      '    <div class="card p-5 text-center">' +
      '      <i data-lucide="star" class="w-6 h-6 text-blue-400 mx-auto mb-2"></i>' +
      '      <div class="text-2xl font-bold text-slate-800">' + history.length + '</div>' +
      '      <div class="text-xs text-slate-500 mt-1">历史报告数</div>' +
      '    </div>' +
      '  </div>' +
      // 趋势图
      '  <div class="card p-6 mb-6">' +
      '    <h3 class="text-lg font-semibold text-slate-800 mb-4">最近练习趋势</h3>' +
      '    ' + (planConfig.deepReport
        ? '<canvas id="trend-chart" height="80"></canvas>'
        : '<div class="text-center py-8 text-slate-400"><i data-lucide="lock" class="w-8 h-8 mx-auto mb-2"></i><p class="text-sm">升级 Pro 版解锁趋势分析</p><button onclick="MianBa.app.switchTab(\'pricing\')" class="text-blue-500 text-sm mt-2 hover:text-blue-600">查看升级方案 →</button></div>') +
      '  </div>' +
      // 历史记录
      '  <div class="card p-6">' +
      '    <h3 class="text-lg font-semibold text-slate-800 mb-4">最近面试记录</h3>' +
      (history.length > 0
        ? '<div class="space-y-2">' + history.slice(0, 5).map(function(h, i) {
            var scoreColor = h.score >= 80 ? 'text-green-500' : h.score >= 60 ? 'text-orange-500' : 'text-red-500';
            return '<div class="flex items-center justify-between py-2.5 px-3 bg-slate-50 rounded-lg text-sm">' +
              '<div><span class="font-medium text-slate-700">' + (h.position || '未知') + '</span><span class="text-slate-400 ml-2">' + (h.difficulty || '') + '</span></div>' +
              '<div class="flex items-center gap-4">' +
              '  <span class="text-xs text-slate-400">' + (h.date ? new Date(h.date).toLocaleDateString('zh-CN') : '') + '</span>' +
              '  <span class="font-bold ' + scoreColor + '">' + h.score + '分</span>' +
              '</div>' +
              '</div>';
          }).join('') + '</div>'
        : '<p class="text-sm text-slate-400 text-center py-8">还没有面试记录，<button onclick="MianBa.app.switchTab(\'interview\')" class="text-blue-500 hover:text-blue-600">开始第一次模拟面试</button></p>') +
      '  </div>' +
      '</div>';

    lucide.createIcons();

    // 趋势图（仅Pro/Enterprise用户）
    if (planConfig.deepReport && document.getElementById('trend-chart')) {
      var recentScores = history.slice(0, 5).reverse();
      var labels = recentScores.map(function(h, i) { return '第' + (i + 1) + '次'; });
      var data = recentScores.map(function(h) { return h.score || 0; });
      if (labels.length < 2) { labels = ['第1次', '第2次']; data = [data[0] || 65, data[0] ? data[0] + 3 : 70]; }

      new Chart(document.getElementById('trend-chart'), {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{ data: data, borderColor: '#3B82F6', backgroundColor: 'rgba(59,130,246,0.1)', fill: true, tension: 0.4, pointBackgroundColor: '#3B82F6' }],
        },
        options: {
          responsive: true,
          plugins: { legend: { display: false } },
          scales: { y: { min: 0, max: 100, ticks: { stepSize: 20 } } },
        },
      });
    }
  },
};
